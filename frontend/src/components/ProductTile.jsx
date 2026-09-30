import { Link } from 'react-router-dom';
import Price from './Price';
import { useStore } from '../context/StoreContext';
import { primaryImage, hasDiscount, variantsOf } from '../services/product';
import { pickLang } from '../context/i18n';

/** A product is a photo and a caption — no card, no border, no shadow. */
export default function ProductTile({ product, priority = false }) {
  const { lang, t } = useStore();
  const name = pickLang(product, 'name', lang);
  const href = `/products/${product.slug || product.id}`;
  const variants = variantsOf(product);
  const soldOut = variants.length > 0 && variants.every((variant) => !(variant.stock_quantity > 0));

  return (
    <article className="tile">
      <Link className="tile__media" to={href} aria-label={name}>
        <img
          className="tile__img"
          src={primaryImage(product)}
          alt={name}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
        {hasDiscount(product) || soldOut ? (
          <span className="tile__badges">
            {hasDiscount(product) ? (
              <span className="badge badge--sale">{t('navSale')}</span>
            ) : null}
            {soldOut ? <span className="badge badge--muted">{t('outOfStock')}</span> : null}
          </span>
        ) : null}
      </Link>

      <Link className="tile__name" to={href}>
        {name}
      </Link>

      <div className="tile__foot">
        <Price product={product} />
        {product.category ? (
          <span className="tile__meta">{pickLang(product.category, 'name', lang)}</span>
        ) : null}
      </div>
    </article>
  );
}
