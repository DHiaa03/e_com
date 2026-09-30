import { mediaUrl } from './api';

/** Price the customer actually pays: the sale price when the product is on sale. */
export function effectivePrice(product) {
  if (!product) return 0;
  if (product.is_on_sale && product.discount_price) return Number(product.discount_price);
  return Number(product.base_price);
}

export function hasDiscount(product) {
  if (!product?.is_on_sale || !product.discount_price) return false;
  return Number(product.discount_price) < Number(product.base_price);
}

/** Primary image first, then whatever the admin uploaded next. */
export function primaryImage(product) {
  const images = product?.images || [];
  const primary = images.find((image) => image.is_primary);
  return mediaUrl((primary || images[0])?.image_url);
}

export function galleryImages(product) {
  const images = product?.images || [];
  const sorted = [...images].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });
  const urls = sorted.map((image) => mediaUrl(image.image_url));
  return urls.length ? urls : [mediaUrl(null)];
}

/** Any order needs a category id, so the storefront asks for one only once. */
export function defaultCategoryId(categories) {
  if (!categories?.length) return '';
  const withProducts = categories.find((category) => category.subcategories?.length);
  return (withProducts || categories[0]).id;
}

export function variantsOf(product) {
  return (product?.variants || []).filter((variant) => variant.is_active !== false);
}

/** Unique sizes / colours available, in the order the admin entered them. */
export function variantOptions(variants) {
  const sizes = [];
  const colors = [];
  variants.forEach((variant) => {
    if (variant.size && !sizes.includes(variant.size)) sizes.push(variant.size);
    if (variant.color && !colors.some((entry) => entry.name === variant.color)) {
      colors.push({ name: variant.color, code: variant.color_code || null });
    }
  });
  return { sizes, colors };
}

/**
 * Resolve the selected size/colour to a concrete variant.
 * Returns { variant, status } where status is
 * 'exact' | 'missing' | 'out-of-stock' | 'no-variant'.
 */
export function resolveVariant(product, size, color) {
  const variants = variantsOf(product);
  if (!variants.length) return { variant: null, status: size || color ? 'missing' : 'no-variant' };

  const candidates = variants.filter(
    (variant) => (!size || variant.size === size) && (!color || variant.color === color)
  );
  if (!candidates.length) return { variant: null, status: 'missing' };

  const inStock = candidates.find((variant) => (variant.stock_quantity ?? 0) > 0);
  if (!inStock) return { variant: candidates[0], status: 'out-of-stock' };
  return { variant: inStock, status: 'exact' };
}

export function stockLeft(variant) {
  return Math.max(0, Number(variant?.stock_quantity ?? 0));
}
