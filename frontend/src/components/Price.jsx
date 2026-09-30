import { useStore } from '../context/StoreContext';
import { effectivePrice, hasDiscount } from '../services/product';

/**
 * One price component everywhere, so a discount always reads the same way:
 * the price paid, with the original struck through beside it.
 */
export default function Price({ product, amount, className = '' }) {
  const { price, t } = useStore();

  if (product) {
    const discounted = hasDiscount(product);
    return (
      <span className={`price ${className}`.trim()}>
        <span className="price__now">{price(effectivePrice(product))}</span>
        {discounted ? (
          <>
            <span className="price__was">{price(product.base_price)}</span>
            <span className="sr-only">({t('navSale')})</span>
          </>
        ) : null}
      </span>
    );
  }

  return (
    <span className={`price ${className}`.trim()}>
      <span className="price__now">{price(amount)}</span>
    </span>
  );
}
