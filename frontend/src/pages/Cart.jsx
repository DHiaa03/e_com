import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Price from '../components/Price';
import QuantityStepper from '../components/QuantityStepper';
import { EmptyState } from '../components/States';
import { useTitle } from '../hooks/useTitle';
import { useStore } from '../context/StoreContext';
import { mediaUrl } from '../services/api';

export default function Cart() {
  const { t, lang, cart, price, cartCount, cartSubtotal, setQuantity, removeItem } = useStore();
  useTitle(t('bagTitle'));

  const label = (item) => (lang === 'ar' ? item.nameAr || item.nameEn : item.nameEn || item.nameAr);

  const variantLine = (item) =>
    [item.size ? `${t('size')} ${item.size}` : null, item.color ? `${t('color')} ${item.color}` : null]
      .filter(Boolean)
      .join(lang === 'ar' ? '، ' : ', ');

  if (cart.length === 0) {
    return (
      <div className="shell page">
        <div className="page__head">
          <h1 className="page__title">{t('bagTitle')}</h1>
        </div>
        <EmptyState
          title={t('bagEmptyTitle')}
          body={t('bagEmptyBody')}
          action={
            <Link className="btn btn--primary" to="/catalog">
              {t('browseStore')}
            </Link>
          }
        />
      </div>
    );
  }

  const countLabel = cartCount === 1 ? t('itemsCountOne') : t('itemsCount', { n: cartCount });

  return (
    <div className="shell page">
      <div className="page__head">
        <h1 className="page__title">{t('bagTitle')}</h1>
        <p className="lede">{countLabel}</p>
      </div>

      <div className="cart">
        <div className="cart-lines">
          {cart.map((item) => (
            <article className="cart-line" key={item.key}>
              <Link to={`/products/${item.productId}`} tabIndex={-1} aria-hidden="true">
                <img
                  className="cart-line__thumb"
                  src={mediaUrl(item.image)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </Link>

              <div className="cart-line__body">
                <div className="cart-line__head">
                  <div>
                    <Link className="cart-line__name" to={`/products/${item.productId}`}>
                      {label(item)}
                    </Link>
                    {variantLine(item) ? (
                      <p className="cart-line__variant">{variantLine(item)}</p>
                    ) : null}
                  </div>
                  <Price amount={item.price * item.quantity} />
                </div>

                <div className="cart-line__controls">
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(quantity) => setQuantity(item.key, quantity)}
                    label={label(item)}
                  />
                  <button
                    type="button"
                    className="btn btn--quiet"
                    onClick={() => removeItem(item.key)}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    {t('remove')}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="stack">
          <div className="summary">
            <span className="strong">{t('bagSummaryTitle')}</span>

            <div className="summary__items">
              {cart.map((item) => (
                <div className="summary__item" key={item.key}>
                  <span>
                    {label(item)} × {item.quantity}
                  </span>
                  <span>{price(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="summary__row">
              <span>{t('subtotal')}</span>
              <strong>{price(cartSubtotal)}</strong>
            </div>
            <div className="summary__row">
              <span>{t('delivery')}</span>
              <strong>{t('freeDelivery')}</strong>
            </div>
            <div className="summary__row summary__total">
              <span>{t('total')}</span>
              <strong>{price(cartSubtotal)}</strong>
            </div>
            <p className="small muted">{t('bagDeliveryNote')}</p>
          </div>

          <div className="action-bar">
            <Link className="btn btn--primary btn--lg btn--block" to="/checkout">
              {t('continueToCheckout')}
            </Link>
          </div>
          <div className="action-bar--spacer" />
        </div>
      </div>
    </div>
  );
}
