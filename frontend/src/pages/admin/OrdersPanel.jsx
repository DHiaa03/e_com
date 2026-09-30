import { useEffect, useState } from 'react';
import { EmptyState, ErrorState, InlineNotice } from '../../components/States';
import { useAsync, useDebounced } from '../../hooks/useAsync';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { formatDate } from '../../context/i18n';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const statusKey = (value) => `status${value.charAt(0).toUpperCase()}${value.slice(1)}`;

export default function OrdersPanel({ refreshKey = 0, onChanged }) {
  const { t, lang, price } = useStore();
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [notice, setNotice] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);
  const search = useDebounced(query);

  useEffect(() => {
    setPage(1);
  }, [status, search, refreshKey, reloadToken]);

  const orders = useAsync(
    ({ signal }) =>
      api.orders.list(
        {
          status_filter: status || undefined,
          search: search || undefined,
          page,
          limit: 20,
        },
        { signal }
      ),
    [status, search, page, refreshKey, reloadToken]
  );

  const items = orders.data?.items || [];
  const total = orders.data?.total || 0;
  const pageCount = Math.max(1, Math.ceil(total / 20));

  const changeStatus = async (order, next) => {
    setSavingId(order.id);
    setNotice(null);
    try {
      const updated = await api.orders.updateStatus(order.id, next);
      orders.setData({
        ...orders.data,
        items: orders.data.items.map((entry) => (entry.id === updated.id ? updated : entry)),
      });
      onChanged?.();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className="panel">
      <div className="panel__head">
        <h2>{t('tabOrders')}</h2>
        <div className="panel__tools">
          <div className="field">
            <label className="sr-only" htmlFor="order-search">
              {t('searchOrders')}
            </label>
            <input
              id="order-search"
              type="search"
              value={query}
              placeholder={t('searchOrders')}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setReloadToken((value) => value + 1)}
          >
            {t('refresh')}
          </button>
        </div>
      </div>

      <div className="chip-row" role="group" aria-label={t('updateStatus')}>
        <button
          type="button"
          className="chip chip--sm"
          aria-pressed={status === ''}
          onClick={() => setStatus('')}
        >
          {t('allStatuses')}
        </button>
        {STATUSES.map((entry) => (
          <button
            key={entry}
            type="button"
            className="chip chip--sm"
            aria-pressed={status === entry}
            onClick={() => setStatus(entry)}
          >
            {t(statusKey(entry))}
          </button>
        ))}
      </div>

      {notice ? (
        <div className="mt-4">
          <InlineNotice tone="error">{notice}</InlineNotice>
        </div>
      ) : null}

      {orders.error ? <ErrorState error={orders.error} onRetry={orders.reload} /> : null}
      {orders.loading ? <p className="small muted mt-4">{t('loading')}</p> : null}

      {!orders.loading && !orders.error && items.length === 0 ? (
        <EmptyState
          title={search || status ? t('noSearchResults') : t('noOrdersTitle')}
          body={t('noOrdersBody')}
        />
      ) : null}

      <div className="data-list">
        {items.map((order) => (
          <article className="data-row" key={order.id}>
            <div>
              <p className="data-row__title">{order.order_number}</p>
              <p className="data-row__meta">
                {order.customer_name} — {order.phone}
              </p>
              <p className="data-row__meta">{formatDate(order.created_at, lang)}</p>
            </div>

            <div className="data-row__fields">
              <div className="data-pair">
                <dt>{t('total')}</dt>
                <dd className="strong">{price(order.total_amount)}</dd>
              </div>
              <div className="data-pair">
                <dt>{t('city')}</dt>
                <dd>{order.city || '—'}</dd>
              </div>
            </div>

            <div className="data-row__actions">
              <span className={`status status--${order.status}`}>{t(statusKey(order.status))}</span>

              <label className="sr-only" htmlFor={`status-${order.id}`}>
                {t('updateStatus')}
              </label>
              <select
                id={`status-${order.id}`}
                className="status-select"
                value={order.status}
                disabled={savingId === order.id}
                onChange={(event) => changeStatus(order, event.target.value)}
              >
                {STATUSES.map((entry) => (
                  <option key={entry} value={entry}>
                    {t(statusKey(entry))}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="btn btn--quiet"
                aria-expanded={expanded === order.id}
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                {expanded === order.id ? t('hideDetails') : t('showDetails')}
              </button>
            </div>

            {expanded === order.id ? (
              <div className="detail-block">
                <p className="small">
                  <strong>{t('address')}:</strong> {order.address}
                </p>
                {order.notes ? (
                  <p className="small">
                    <strong>{t('notes')}:</strong> {order.notes}
                  </p>
                ) : null}
                <p className="small strong">{t('orderContents')}</p>
                {order.items.map((item) => (
                  <div className="summary__item" key={item.id}>
                    <span>
                      {item.product_name}
                      {item.variant_details ? ` (${item.variant_details})` : ''} × {item.quantity}
                    </span>
                    <span>{price(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      {pageCount > 1 ? (
        <div className="pagination">
          <button
            type="button"
            className="btn btn--ghost"
            disabled={page <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            {t('previous')}
          </button>
          <span className="small muted">
            {page} / {pageCount}
          </span>
          <button
            type="button"
            className="btn btn--ghost"
            disabled={page >= pageCount}
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
          >
            {t('next')}
          </button>
        </div>
      ) : null}
    </section>
  );
}
