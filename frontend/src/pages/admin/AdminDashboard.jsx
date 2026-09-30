import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync';
import { useTitle } from '../../hooks/useTitle';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { formatNumber } from '../../context/i18n';
import OrdersPanel from './OrdersPanel';
import ProductsPanel from './ProductsPanel';
import CategoriesPanel from './CategoriesPanel';
import AccountPanel from './AccountPanel';

const TABS = [
  { key: 'orders', label: 'tabOrders' },
  { key: 'products', label: 'tabProducts' },
  { key: 'categories', label: 'tabCategories' },
  { key: 'account', label: 'tabAccount' },
];

export default function AdminDashboard() {
  const { t, lang, isAdmin, signOut } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState('orders');
  const [statsToken, setStatsToken] = useState(0);
  const [newOrders, setNewOrders] = useState(0);
  const seen = useRef(null);

  useTitle(t('adminDashboard'));

  const stats = useAsync(({ signal }) => api.orders.stats({ signal }), [statsToken]);
  const profile = useAsync(({ signal }) => api.admin.profile({ signal }), []);

  const refresh = useCallback(() => setStatsToken((value) => value + 1), []);

  /* Quiet in-dashboard notice when orders arrive while the page is open. */
  useEffect(() => {
    if (!isAdmin) return undefined;
    let active = true;

    const poll = async () => {
      try {
        const page = await api.orders.list({ page: 1, limit: 20 });
        if (!active) return;
        const ids = page.items.map((order) => order.id);
        if (seen.current === null) {
          seen.current = new Set(ids);
          return;
        }
        const fresh = ids.filter((id) => !seen.current.has(id));
        if (fresh.length) setNewOrders((current) => current + fresh.length);
        ids.forEach((id) => seen.current.add(id));
      } catch {
        /* polling is best effort; the panels surface real errors */
      }
    };

    poll();
    const timer = setInterval(poll, 45000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [isAdmin]);

  const statCards = useMemo(() => {
    const data = stats.data;
    return [
      { key: 'statOrders', value: formatNumber(data?.total_orders, lang) },
      { key: 'statRevenue', value: data ? `${formatNumber(data.total_revenue, lang)} ${t('currency')}` : '—' },
      { key: 'statPending', value: formatNumber(data?.pending_orders, lang) },
      { key: 'statDelivered', value: formatNumber(data?.delivered_orders, lang) },
    ];
  }, [stats.data, lang, t]);

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const onSignOut = () => {
    signOut();
    navigate('/admin/login', { replace: true });
  };

  const dismissNotice = () => {
    setNewOrders(0);
    refresh();
  };

  return (
    <>
      <div className="admin-bar">
        <div className="shell admin-bar__inner">
          <Link className="brand" to="/admin">
            <img className="brand__mark" src="/assets/logo.png" alt="" width="28" height="28" />
            <span className="brand__name">{t('adminDashboard')}</span>
          </Link>

          <span className="admin-bar__who">
            {profile.data?.email ? `${t('accountSignedInAs')} ${profile.data.email}` : ''}
          </span>

          <div className="site-actions">
            <Link className="btn btn--quiet" to="/">
              {t('adminViewStore')}
            </Link>
            <button type="button" className="icon-btn" onClick={onSignOut}>
              <LogOut size={18} aria-hidden="true" />
              <span className="sr-only">{t('adminLogout')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="stats">
        {statCards.map((card) => (
          <div className="stat" key={card.key}>
            <span className="stat__value">{card.value}</span>
            <span className="label">{t(card.key)}</span>
          </div>
        ))}
      </div>

      {newOrders > 0 ? (
        <div className="banner" role="status">
          <span>{t('newOrdersBanner', { n: newOrders })}</span>
          <button type="button" className="btn btn--primary" onClick={dismissNotice}>
            {t('refresh')}
          </button>
        </div>
      ) : null}

      <div className="admin-tabs" role="tablist" aria-label={t('adminDashboard')}>
        {TABS.map((entry) => (
          <button
            key={entry.key}
            type="button"
            role="tab"
            className="chip"
            aria-selected={tab === entry.key}
            onClick={() => {
              setTab(entry.key);
              if (entry.key === 'orders') dismissNotice();
            }}
          >
            {t(entry.label)}
          </button>
        ))}
      </div>

      {tab === 'orders' ? <OrdersPanel refreshKey={statsToken} onChanged={refresh} /> : null}
      {tab === 'products' ? <ProductsPanel /> : null}
      {tab === 'categories' ? <CategoriesPanel /> : null}
      {tab === 'account' ? <AccountPanel /> : null}
    </>
  );
}
