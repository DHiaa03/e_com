import { Link } from 'react-router-dom';
import { Banknote, RefreshCw, Truck } from 'lucide-react';
import HeroController from '../components/HeroController';
import ProductTile from '../components/ProductTile';
import { ErrorState, SkeletonGrid } from '../components/States';
import { useAsync } from '../hooks/useAsync';
import { useTitle } from '../hooks/useTitle';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';

const ENTRY_IMAGES = {
  men: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=65',
  women:
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=65',
};

function Shelf({ title, moreTo, moreLabel, query }) {
  const { t } = useStore();
  const { data, error, loading, reload } = useAsync(
    ({ signal }) => api.products.list(query, { signal }),
    [JSON.stringify(query)]
  );

  const items = data?.items || [];
  if (!loading && !error && items.length === 0) return null;

  return (
    <section className="section">
      <div className="shell">
        <div className="section__head">
          <h2>{title}</h2>
          <Link className="section__more" to={moreTo}>
            {moreLabel}
          </Link>
        </div>

        {error ? <ErrorState error={error} onRetry={reload} /> : null}
        {loading && !data ? <SkeletonGrid count={4} /> : null}

        {items.length > 0 ? (
          <div className="rail">
            {items.map((product, index) => (
              <ProductTile key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useStore();
  useTitle(t('navHome'));

  return (
    <>
      <HeroController />

      <Shelf
        title={t('homeNewTitle')}
        moreTo="/catalog?featured=true"
        moreLabel={t('homeNewMore')}
        query={{ is_featured: true, sort_by: 'newest', limit: 8 }}
      />

      <section className="section">
        <div className="shell grid-2">
          <Link className="entry" to="/catalog?section=men">
            <img className="entry__img" src={ENTRY_IMAGES.men} alt="" loading="lazy" decoding="async" />
            <span className="entry__body">
              <h3>{t('homeMenEntry')}</h3>
              <p>{t('homeMenEntryLine')}</p>
            </span>
          </Link>

          <Link className="entry" to="/catalog?section=women">
            <img
              className="entry__img"
              src={ENTRY_IMAGES.women}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="entry__body">
              <h3>{t('homeWomenEntry')}</h3>
              <p>{t('homeWomenEntryLine')}</p>
            </span>
          </Link>
        </div>
      </section>

      <Shelf
        title={t('homeOnSaleTitle')}
        moreTo="/catalog?sale=true"
        moreLabel={t('homeOnSaleMore')}
        query={{ is_on_sale: true, sort_by: 'price_asc', limit: 4 }}
      />

      <section className="section">
        <div className="shell trust">
          <div className="trust__item">
            <Banknote size={18} aria-hidden="true" />
            <span>
              <strong>{t('trustCodTitle')}</strong>
              {t('trustCodBody')}
            </span>
          </div>
          <div className="trust__item">
            <Truck size={18} aria-hidden="true" />
            <span>
              <strong>{t('trustDeliveryTitle')}</strong>
              {t('trustDeliveryBody')}
            </span>
          </div>
          <div className="trust__item">
            <RefreshCw size={18} aria-hidden="true" />
            <span>
              <strong>{t('trustExchangeTitle')}</strong>
              {t('trustExchangeBody')}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
