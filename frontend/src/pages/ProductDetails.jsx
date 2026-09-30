import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Banknote, Check, RefreshCw, Truck } from 'lucide-react';
import Price from '../components/Price';
import QuantityStepper from '../components/QuantityStepper';
import { ErrorState } from '../components/States';
import { useAsync } from '../hooks/useAsync';
import { useTitle } from '../hooks/useTitle';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { pickLang } from '../context/i18n';
import {
  effectivePrice,
  galleryImages,
  hasDiscount,
  resolveVariant,
  stockLeft,
  variantOptions,
  variantsOf,
} from '../services/product';

export default function ProductDetails() {
  const { slug } = useParams();
  const { t, lang, addItem } = useStore();
  const { data: product, error, loading, reload } = useAsync(
    ({ signal }) => api.products.get(slug, { signal }),
    [slug]
  );

  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [prompt, setPrompt] = useState('');

  const variants = useMemo(() => variantsOf(product), [product]);
  const options = useMemo(() => variantOptions(variants), [variants]);

  /* Start on the first available size and colour instead of asking the
     customer to guess what exists. */
  useEffect(() => {
    if (!product) return;
    const { sizes, colors } = variantOptions(variantsOf(product));
    const firstSize = sizes.find((entry) =>
      variantsOf(product).some((variant) => variant.size === entry && variant.stock_quantity > 0)
    );
    const firstColor = colors.find((entry) =>
      variantsOf(product).some(
        (variant) => variant.color === entry.name && variant.stock_quantity > 0
      )
    );
    setSize(firstSize ?? sizes[0] ?? null);
    setColor(firstColor?.name ?? colors[0]?.name ?? null);
    setImageIndex(0);
  }, [product]);

  useEffect(() => {
    if (!added) return undefined;
    const timer = setTimeout(() => setAdded(false), 2600);
    return () => clearTimeout(timer);
  }, [added]);

  const name = pickLang(product, 'name', lang);
  const description = pickLang(product, 'description', lang);
  const images = useMemo(() => (product ? galleryImages(product) : []), [product]);
  const { variant, status } = useMemo(
    () => resolveVariant(product, size, color),
    [product, size, color]
  );

  useTitle(name || t('productDetails'));

  const sizeAvailable = (entry) =>
    variants.some(
      (item) =>
        item.size === entry &&
        (!color || item.color === color) &&
        (item.stock_quantity ?? 0) > 0
    );

  const colorAvailable = (entry) =>
    variants.some(
      (item) =>
        item.color === entry.name &&
        (!size || item.size === size) &&
        (item.stock_quantity ?? 0) > 0
    );

  const maxQuantity = status === 'exact' ? Math.max(1, stockLeft(variant)) : 99;
  const lineTotal = useMemo(
    () => (effectivePrice(product) + Number(variant?.additional_price || 0)) * quantity,
    [product, variant, quantity]
  );

  const onAdd = () => {
    if (status === 'missing') {
      setPrompt(t('pickVariant'));
      return;
    }
    if (status === 'out-of-stock') {
      setPrompt(t('outOfStock'));
      return;
    }
    setPrompt('');
    addItem(product, variant, quantity);
    setAdded(true);
  };

  if (loading && !product) {
    return (
      <div className="shell page">
        <div className="skeleton skeleton--crumb" />
        <div className="pdp">
          <div className="skeleton skeleton-tile" />
          <div className="stack">
            <div className="skeleton skeleton--title" />
            <div className="skeleton skeleton--text" />
            <div className="skeleton skeleton--block" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="shell page">
        <Link className="back-link" to="/catalog">
          <ArrowLeft size={16} aria-hidden="true" />
          {t('backToStore')}
        </Link>
        <div className="mt-5">
          {error ? (
            <ErrorState error={error} onRetry={reload} />
          ) : (
            <div className="state">
              <h3>{t('productGoneTitle')}</h3>
              <p>{t('productGoneBody')}</p>
              <Link className="btn btn--ghost" to="/catalog">
                {t('backToStore')}
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <Link className="back-link mt-5" to="/catalog">
        <ArrowLeft size={16} aria-hidden="true" />
        {t('backToStore')}
      </Link>

      <div className="pdp">
        <div className="gallery">
          <div className="gallery__main">
            <img className="gallery__img" src={images[imageIndex]} alt={name} decoding="async" />
            {hasDiscount(product) ? (
              <span className="tile__badges">
                <span className="badge badge--sale">{t('navSale')}</span>
              </span>
            ) : null}
          </div>

          {images.length > 1 ? (
            <div className="gallery__thumbs">
              {images.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  className="gallery__thumb"
                  aria-current={index === imageIndex}
                  aria-label={`${name} — ${index + 1}`}
                  onClick={() => setImageIndex(index)}
                >
                  <img src={url} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="pdp__info">
          <h1 className="pdp__title">{name}</h1>
          <Price product={product} className="price--lg" />
          {description ? <p className="pdp__desc">{description}</p> : null}

          {options.sizes.length > 0 ? (
            <div className="variant-group">
              <div className="variant-group__head">
                <span className="label">{t('size')}</span>
                {size ? <span className="variant-group__value">{size}</span> : null}
              </div>
              <div className="variant-group__options">
                {options.sizes.map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    className="swatch"
                    aria-pressed={size === entry}
                    disabled={!sizeAvailable(entry)}
                    onClick={() => {
                      setSize(entry);
                      setPrompt('');
                    }}
                  >
                    {entry}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {options.colors.length > 0 ? (
            <div className="variant-group">
              <div className="variant-group__head">
                <span className="label">{t('color')}</span>
                {color ? <span className="variant-group__value">{color}</span> : null}
              </div>
              <div className="variant-group__options">
                {options.colors.map((entry) => (
                  <button
                    key={entry.name}
                    type="button"
                    className="swatch"
                    aria-pressed={color === entry.name}
                    disabled={!colorAvailable(entry)}
                    onClick={() => {
                      setColor(entry.name);
                      setPrompt('');
                    }}
                  >
                    {entry.code ? (
                      <span
                        className="swatch__dot"
                        style={{ background: entry.code }}
                        aria-hidden="true"
                      />
                    ) : null}
                    {entry.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="variant-group">
            <div className="variant-group__head">
              <span className="label">{t('quantity')}</span>
              <span className="variant-group__value">
                {status === 'out-of-stock'
                  ? t('outOfStock')
                  : status === 'exact' && stockLeft(variant) <= 5
                    ? t('unitsLeft', { n: stockLeft(variant) })
                    : status === 'exact'
                      ? t('inStock')
                      : ''}
              </span>
            </div>
            <QuantityStepper value={quantity} max={maxQuantity} onChange={setQuantity} />
          </div>

          {prompt ? (
            <p className="error-text" role="status">
              {prompt}
            </p>
          ) : null}

          {added ? (
            <div className="notice notice--info" role="status">
              <span>{t('addedToBag')}</span>
              <Link className="section__more" to="/cart">
                {t('bagTitle')}
              </Link>
            </div>
          ) : null}

          <div className="pdp__facts">
            <div className="pdp__fact">
              <Banknote size={16} aria-hidden="true" />
              <span>{t('trustCodBody')}</span>
            </div>
            <div className="pdp__fact">
              <Truck size={16} aria-hidden="true" />
              <span>{t('trustDeliveryBody')}</span>
            </div>
            <div className="pdp__fact">
              <RefreshCw size={16} aria-hidden="true" />
              <span>{t('trustExchangeBody')}</span>
            </div>
          </div>

          {product.category ? (
            <p className="small muted">
              {t('subcategory')}: {pickLang(product.category, 'name', lang)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="action-bar">
        <span className="action-bar__total">
          <span className="label">{t('total')}</span>
          <Price amount={lineTotal} />
        </span>
        <button type="button" className="btn btn--primary btn--lg" onClick={onAdd}>
          {added ? <Check size={18} aria-hidden="true" /> : null}
          {added ? t('addedToBag') : t('addToBag')}
        </button>
      </div>
      <div className="action-bar--spacer" />
    </div>
  );
}
