import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Banknote } from 'lucide-react';
import Price from '../components/Price';
import { EmptyState } from '../components/States';
import { useTitle } from '../hooks/useTitle';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';

const EMPTY_FORM = { name: '', phone: '', city: '', address: '', notes: '' };

export default function Checkout() {
  const { t, lang, cart, price, cartCount, cartSubtotal, clearCart } = useStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState(null);
  const [placed, setPlaced] = useState(null);
  const fields = useRef({});

  useTitle(t('checkoutTitle'));

  const label = (item) => (lang === 'ar' ? item.nameAr || item.nameEn : item.nameEn || item.nameAr);

  const validate = () => {
    const found = {};
    if (!form.name.trim()) found.name = t('fieldRequired');

    const phone = form.phone.replace(/[\s-]/g, '');
    if (!phone) found.phone = t('fieldRequired');
    else if (!/^\+?\d{8,15}$/.test(phone)) found.phone = t('phoneInvalid');

    if (!form.address.trim()) found.address = t('fieldRequired');
    return found;
  };

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  };

  const blur = (key) => {
    const found = validate()[key];
    setErrors((current) => {
      const next = { ...current };
      if (found) next[key] = found;
      else delete next[key];
      return next;
    });
  };

  const submit = async (event) => {
    if (event) event.preventDefault();
    const found = validate();
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      fields.current[firstInvalid]?.focus();
      return;
    }

    setBusy(true);
    setFailure(null);
    try {
      const order = await api.orders.create({
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim() || null,
        address: form.address.trim(),
        notes: form.notes.trim() || null,
        items: cart.map((item) => ({
          product_id: item.productId,
          variant_id: item.variantId ?? null,
          quantity: item.quantity,
        })),
      });
      clearCart();
      setPlaced({ order, phone: form.phone.trim() });
    } catch (error) {
      setFailure(error.message);
    } finally {
      setBusy(false);
    }
  };

  if (placed) {
    const order = placed.order;
    return (
      <div className="shell page">
        <div className="confirm">
          <h1 className="page__title">{t('orderPlacedTitle')}</h1>
          <div className="confirm__number">
            <span className="label">{t('orderNumberLabel')}</span>
            <strong>{order.order_number}</strong>
          </div>
          <p className="lede">{t('orderPlacedBody', { phone: placed.phone })}</p>
          <p className="small muted">{t('keepOrderNumber')}</p>

          <div className="summary">
            {order.items?.map((item) => (
              <div className="summary__item" key={item.id}>
                <span>
                  {item.product_name} × {item.quantity}
                </span>
                <span>{price(item.subtotal)}</span>
              </div>
            ))}
            <div className="summary__row summary__total">
              <span>{t('total')}</span>
              <strong>{price(order.total_amount)}</strong>
            </div>
          </div>

          <div className="row">
            <Link className="btn btn--primary" to="/catalog">
              {t('browseStore')}
            </Link>
            <Link className="btn btn--ghost" to="/">
              {t('backHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="shell page">
        <div className="page__head">
          <h1 className="page__title">{t('checkoutTitle')}</h1>
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
        <h1 className="page__title">{t('checkoutTitle')}</h1>
        <p className="lede">{t('checkoutIntro')}</p>
      </div>

      <div className="checkout">
        <form id="checkout-form" className="checkout__form" onSubmit={submit} noValidate>
          <h2>{t('deliveryDetails')}</h2>

          <div className="field-row">
            <div className="field">
              <label htmlFor="name">{t('fullName')}</label>
              <input
                id="name"
                ref={(node) => {
                  fields.current.name = node;
                }}
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                onBlur={() => blur('name')}
                placeholder={t('fullNamePlaceholder')}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name ? (
                <span className="error" id="name-error">
                  {errors.name}
                </span>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="phone">{t('phone')}</label>
              <input
                id="phone"
                ref={(node) => {
                  fields.current.phone = node;
                }}
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(event) => update('phone', event.target.value)}
                onBlur={() => blur('phone')}
                placeholder={t('phonePlaceholder')}
                autoComplete="tel"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone ? (
                <span className="error" id="phone-error">
                  {errors.phone}
                </span>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="city">
                {t('city')} <span className="muted small">({t('optional')})</span>
              </label>
              <input
                id="city"
                value={form.city}
                onChange={(event) => update('city', event.target.value)}
                autoComplete="address-level2"
              />
            </div>

            <div className="field">
              <label htmlFor="address">{t('address')}</label>
              <textarea
                id="address"
                ref={(node) => {
                  fields.current.address = node;
                }}
                value={form.address}
                onChange={(event) => update('address', event.target.value)}
                onBlur={() => blur('address')}
                placeholder={t('addressPlaceholder')}
                autoComplete="street-address"
                aria-invalid={Boolean(errors.address)}
                aria-describedby={errors.address ? 'address-error' : undefined}
              />
              {errors.address ? (
                <span className="error" id="address-error">
                  {errors.address}
                </span>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="notes">{t('notes')}</label>
              <textarea
                id="notes"
                value={form.notes}
                onChange={(event) => update('notes', event.target.value)}
              />
            </div>
          </div>

          <div className="pay-note">
            <Banknote size={18} aria-hidden="true" />
            <span>
              <strong>{t('codTitle')}</strong> {t('codBody')}
            </span>
          </div>

          {failure ? (
            <div className="notice notice--error" role="alert">
              <span>
                <strong>{t('orderFailedTitle')}</strong> {failure}
              </span>
            </div>
          ) : null}
        </form>

        <aside className="checkout__aside">
          <div className="summary">
            <span className="strong">{t('bagSummaryTitle')}</span>
            <span className="small muted">{countLabel}</span>

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

            <Link className="btn btn--quiet" to="/cart">
              {t('navBag')}
            </Link>
          </div>

          <div className="action-bar">
            <span className="action-bar__total">
              <span className="label">{t('total')}</span>
              <Price amount={cartSubtotal} className="price--lg" />
            </span>
            <button
              type="submit"
              form="checkout-form"
              className="btn btn--primary btn--lg"
              disabled={busy}
            >
              {busy ? t('placingOrder') : t('placeOrder')}
            </button>
          </div>
          <div className="action-bar--spacer" />
        </aside>

      </div>
    </div>
  );
}
