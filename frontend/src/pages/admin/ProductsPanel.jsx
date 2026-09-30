import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { EmptyState, ErrorState, InlineNotice } from '../../components/States';
import { useAsync, useDebounced } from '../../hooks/useAsync';
import { useStore } from '../../context/StoreContext';
import { api, mediaUrl } from '../../services/api';
import { pickLang } from '../../context/i18n';
import ProductForm from './ProductForm';

const SECTION_FILTERS = [
  { value: '', label: 'stateAll' },
  { value: 'men', label: 'stateMen' },
  { value: 'women', label: 'stateWomen' },
  { value: 'unisex', label: 'sectionUnisex' },
];

export default function ProductsPanel() {
  const { t, lang, price } = useStore();
  const [query, setQuery] = useState('');
  const [section, setSection] = useState('');
  const [page, setPage] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);
  const [editing, setEditing] = useState(null); // 'new' or a product object
  const [notice, setNotice] = useState(null);
  const search = useDebounced(query);

  useEffect(() => {
    setPage(1);
  }, [search, section]);

  const categories = useAsync(({ signal }) => api.categories.list(false, { signal }), []);

  const products = useAsync(
    ({ signal }) =>
      api.products.list(
        {
          search: search || undefined,
          gender_section: section || undefined,
          page,
          limit: 20,
        },
        { signal }
      ),
    [search, section, page, reloadToken]
  );

  const items = products.data?.items || [];
  const total = products.data?.total || 0;
  const pageCount = Math.max(1, Math.ceil(total / 20));

  const removeProduct = async (product) => {
    if (!window.confirm(t('confirmDeleteProduct'))) return;
    setNotice(null);
    try {
      await api.products.remove(product.id);
      if (editing && editing !== 'new' && editing.id === product.id) setEditing(null);
      setReloadToken((value) => value + 1);
    } catch (error) {
      setNotice({ tone: 'error', text: error.message });
    }
  };

  const closeForm = (saved) => {
    setEditing(null);
    if (saved) {
      setNotice({ tone: 'info', text: t('saved') });
      setReloadToken((value) => value + 1);
    }
  };

  return (
    <section className="panel">
      <div className="panel__head">
        <h2>{t('tabProducts')}</h2>
        <div className="panel__tools">
          <div className="field">
            <label className="sr-only" htmlFor="product-search">
              {t('searchProducts')}
            </label>
            <input
              id="product-search"
              type="search"
              value={query}
              placeholder={t('searchProducts')}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setEditing(editing === 'new' ? null : 'new')}
          >
            <Plus size={16} aria-hidden="true" />
            {t('newProduct')}
          </button>
        </div>
      </div>

      <div className="chip-row" role="group" aria-label={t('section')}>
        {SECTION_FILTERS.map((entry) => (
          <button
            key={entry.value}
            type="button"
            className="chip chip--sm"
            aria-pressed={section === entry.value}
            onClick={() => setSection(entry.value)}
          >
            {t(entry.label)}
          </button>
        ))}
      </div>

      {notice ? (
        <div className="mt-4">
          <InlineNotice tone={notice.tone}>{notice.text}</InlineNotice>
        </div>
      ) : null}

      {editing ? (
        <ProductForm
          key={editing === 'new' ? 'new' : editing.id}
          product={editing === 'new' ? null : editing}
          categories={categories.data || []}
          onClose={closeForm}
        />
      ) : null}

      {products.error ? <ErrorState error={products.error} onRetry={products.reload} /> : null}
      {products.loading ? <p className="small muted mt-4">{t('loading')}</p> : null}

      {!products.loading && !products.error && items.length === 0 ? (
        <EmptyState
          title={search || section ? t('noSearchResults') : t('noProducts')}
          body={search || section ? undefined : t('noProductsBody')}
        />
      ) : null}

      <div className="data-list">
        {items.map((product) => {
          const cover =
            product.images?.find((image) => image.is_primary) || product.images?.[0] || null;
          return (
            <article className="data-row data-row--product" key={product.id}>
              <img
                className="mini-thumb"
                src={mediaUrl(cover?.image_url)}
                alt={cover?.alt_text || pickLang(product, 'name', lang)}
                loading="lazy"
              />

              <div>
                <p className="data-row__title">{pickLang(product, 'name', lang)}</p>
                <p className="data-row__meta">
                  {pickLang(product, 'name', lang === 'ar' ? 'en' : 'ar')} — {product.slug}
                </p>
                <p className="data-row__meta">
                  {product.category ? pickLang(product.category, 'name', lang) : '—'}
                </p>
                <span className="row">
                  {product.is_on_sale ? (
                    <span className="badge badge--sale">{t('onSale')}</span>
                  ) : null}
                  {product.is_featured ? (
                    <span className="badge badge--muted">{t('featured')}</span>
                  ) : null}
                </span>
              </div>

              <div className="data-row__fields">
                <div className="data-pair">
                  <dt>{t('basePrice')}</dt>
                  <dd className="strong">{price(product.base_price)}</dd>
                </div>
                <div className="data-pair">
                  <dt>{t('variants')}</dt>
                  <dd>{product.variants?.length || 0}</dd>
                </div>
              </div>

              <div className="data-row__actions">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() =>
                    setEditing(editing !== 'new' && editing?.id === product.id ? null : product)
                  }
                >
                  <Pencil size={17} aria-hidden="true" />
                  <span className="sr-only">{t('edit')}</span>
                </button>
                <button type="button" className="icon-btn" onClick={() => removeProduct(product)}>
                  <Trash2 size={17} aria-hidden="true" />
                  <span className="sr-only">{t('delete')}</span>
                </button>
              </div>
            </article>
          );
        })}
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
