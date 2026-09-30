import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductTile from '../components/ProductTile';
import { EmptyState, ErrorState, SkeletonGrid } from '../components/States';
import { useAsync } from '../hooks/useAsync';
import { useTitle } from '../hooks/useTitle';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { pickLang } from '../context/i18n';

const PAGE_SIZE = 12;
const SORTS = ['sortNewest', 'sortPriceAsc', 'sortPriceDesc'];
const SORT_VALUES = ['newest', 'price_asc', 'price_desc'];
const SECTIONS = [
  { value: '', label: 'stateAll' },
  { value: 'men', label: 'stateMen' },
  { value: 'women', label: 'stateWomen' },
];

export default function Catalog() {
  const { t, lang } = useStore();
  const [params, setParams] = useSearchParams();
  const [refineOpen, setRefineOpen] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const section = params.get('section') || '';
  const category = params.get('category') || '';
  const sale = params.get('sale') === 'true';
  const featured = params.get('featured') === 'true';
  const sort = params.get('sort') || 'newest';
  const minPrice = params.get('min') || '';
  const maxPrice = params.get('max') || '';
  const search = params.get('q') || '';

  const [priceDraft, setPriceDraft] = useState({ min: minPrice, max: maxPrice });
  const [searchDraft, setSearchDraft] = useState(search);

  useEffect(() => {
    setPriceDraft({ min: minPrice, max: maxPrice });
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setSearchDraft(search);
  }, [search]);

  const buildQuery = useCallback(
    (page) => ({
      gender_section: section || undefined,
      category_id: category || undefined,
      search: search || undefined,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      is_on_sale: sale ? true : undefined,
      is_featured: featured ? true : undefined,
      sort_by: sort,
      page,
      limit: PAGE_SIZE,
    }),
    [section, category, search, minPrice, maxPrice, sale, featured, sort]
  );

  const filterKey = `${JSON.stringify(buildQuery(1))}#${reloadToken}`;
  const [results, setResults] = useState({
    items: [],
    total: 0,
    page: 1,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setResults((current) => ({ ...current, loading: true, error: null }));

    api.products
      .list(buildQuery(1), { signal: controller.signal })
      .then((data) => {
        if (!active) return;
        setResults({ items: data.items, total: data.total, page: 1, loading: false, error: null });
      })
      .catch((error) => {
        if (!active || error?.name === 'AbortError') return;
        setResults({ items: [], total: 0, page: 1, loading: false, error });
      });

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  const categories = useAsync(({ signal }) => api.categories.list(true, { signal }), []);
  const roots = categories.data || [];
  const activeRoot = roots.find((root) => root.slug === section);
  const subcategories = activeRoot?.subcategories || [];

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const setSection = (value) => {
    const next = new URLSearchParams(params);
    if (value) next.set('section', value);
    else next.delete('section');
    next.delete('category');
    setParams(next);
  };

  const clearFilters = () => setParams(new URLSearchParams());

  const retry = () => setReloadToken((value) => value + 1);

  /** Price and search wait for an explicit apply, so typing never refetches. */
  const applyDrafts = () => {
    const next = new URLSearchParams(params);
    const set = (key, value) => {
      if (value) next.set(key, value);
      else next.delete(key);
    };
    set('min', priceDraft.min);
    set('max', priceDraft.max);
    set('q', searchDraft.trim());
    setParams(next);
    setRefineOpen(false);
  };

  const loadMore = () => {
    const nextPage = results.page + 1;
    api.products
      .list(buildQuery(nextPage))
      .then((data) =>
        setResults((current) => ({
          ...current,
          items: [...current.items, ...data.items],
          total: data.total,
          page: nextPage,
        }))
      )
      .catch((error) => setResults((current) => ({ ...current, error })));
  };

  const heading = useMemo(() => {
    if (section === 'men') return t('navMen');
    if (section === 'women') return t('navWomen');
    if (sale) return t('navSale');
    if (featured) return t('navNew');
    return t('catalogTitle');
  }, [section, sale, featured, t]);

  useTitle(heading);

  const countLabel =
    results.total === 1 ? t('resultsCountOne') : t('resultsCount', { n: results.total });
  const filtersDirty = Boolean(
    section || category || sale || featured || minPrice || maxPrice || search
  );

  return (
    <>
      <div className="toolbar">
        <div className="shell toolbar__inner">
          <div className="toolbar__row">
            <div className="chip-row" role="group" aria-label={t('section')}>
              {SECTIONS.map((entry) => (
                <button
                  key={entry.value || 'all'}
                  type="button"
                  className="chip"
                  aria-pressed={section === entry.value}
                  onClick={() => setSection(entry.value)}
                >
                  {t(entry.label)}
                </button>
              ))}
            </div>
            <span className="toolbar__count">{countLabel}</span>
          </div>

          <div className="toolbar__row">
            <button
              type="button"
              className="chip"
              aria-expanded={refineOpen}
              onClick={() => setRefineOpen((open) => !open)}
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              {refineOpen ? t('hideFilters') : t('refine')}
            </button>

            <label className="sr-only" htmlFor="sort">
              {t('sortBy')}
            </label>
            <select
              id="sort"
              className="select-inline"
              value={sort}
              onChange={(event) => setParam('sort', event.target.value)}
            >
              {SORTS.map((key, index) => (
                <option key={key} value={SORT_VALUES[index]}>
                  {t(key)}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="chip"
              aria-pressed={sale}
              onClick={() => setParam('sale', sale ? '' : 'true')}
            >
              {t('onSaleOnly')}
            </button>
          </div>

          {refineOpen ? (
            <div className="filters">
              {subcategories.length > 0 ? (
                <div className="filters__group">
                  <h3>{t('subcategory')}</h3>
                  <div className="chip-row">
                    <button
                      type="button"
                      className="chip chip--sm"
                      aria-pressed={!category}
                      onClick={() => setParam('category', '')}
                    >
                      {t('stateAll')}
                    </button>
                    {subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        className="chip chip--sm"
                        aria-pressed={String(sub.id) === category}
                        onClick={() => setParam('category', String(sub.id))}
                      >
                        {pickLang(sub, 'name', lang)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="filters__group">
                <h3>{t('priceRange')}</h3>
                <div className="filters__range">
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={priceDraft.min}
                    placeholder={t('priceFrom')}
                    aria-label={t('priceFrom')}
                    onChange={(event) =>
                      setPriceDraft((draft) => ({ ...draft, min: event.target.value }))
                    }
                  />
                  <span className="muted" aria-hidden="true">
                    —
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={priceDraft.max}
                    placeholder={t('priceTo')}
                    aria-label={t('priceTo')}
                    onChange={(event) =>
                      setPriceDraft((draft) => ({ ...draft, max: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="filters__group">
                <label htmlFor="catalog-search">{t('searchProducts')}</label>
                <input
                  id="catalog-search"
                  className="input"
                  type="search"
                  value={searchDraft}
                  placeholder={t('searchProducts')}
                  onChange={(event) => setSearchDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') applyDrafts();
                  }}
                />
              </div>

              <div className="filters__actions">
                <button type="button" className="btn btn--primary" onClick={applyDrafts}>
                  {t('applyFilters')}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setPriceDraft({ min: '', max: '' });
                    setSearchDraft('');
                    clearFilters();
                  }}
                >
                  {t('clearFilters')}
                </button>
              </div>
            </div>
          ) : null}

        </div>
      </div>

      <div className="shell page">
        <div className="page__head">
          <h1 className="page__title">{heading}</h1>
        </div>

        {results.error ? <ErrorState error={results.error} onRetry={retry} /> : null}

        {results.loading && results.items.length === 0 ? <SkeletonGrid count={8} /> : null}

        {!results.loading && !results.error && results.items.length === 0 ? (
          <EmptyState
            title={t('noResultsTitle')}
            body={t('noResultsBody')}
            action={
              filtersDirty ? (
                <button type="button" className="btn btn--ghost" onClick={clearFilters}>
                  {t('clearFilters')}
                </button>
              ) : null
            }
          />
        ) : null}

        {results.items.length > 0 ? (
          <>
            <div className="grid-products">
              {results.items.map((product, index) => (
                <ProductTile key={product.id} product={product} priority={index < 4} />
              ))}
            </div>

            {results.items.length < results.total ? (
              <div className="pagination">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={loadMore}
                  disabled={results.loading}
                >
                  {results.loading ? t('loading') : t('showMore')}
                </button>
              </div>
            ) : (
              <p className="pagination small muted">{t('showingAll')}</p>
            )}
          </>
        ) : null}

      </div>
    </>
  );
}
