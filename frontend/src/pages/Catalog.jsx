import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { Search, Filter, SlidersHorizontal, ShoppingBag, X } from 'lucide-react';

export default function Catalog() {
  const { lang, t, addToCart } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const sectionParam = searchParams.get('section') || '';
  const saleParam = searchParams.get('sale') === 'true';
  const featuredParam = searchParams.get('featured') === 'true';
  const categoryParam = searchParams.get('category_id') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState(sectionParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('newest');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setSelectedSection(sectionParam);
    setSelectedCategory(categoryParam);
  }, [sectionParam, categoryParam]);

  // Load categories
  useEffect(() => {
    async function loadCats() {
      try {
        const cats = await api.getCategories(true);
        setCategories(cats || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCats();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = {
          gender_section: selectedSection || undefined,
          category_id: selectedCategory || undefined,
          is_on_sale: saleParam ? true : undefined,
          is_featured: featuredParam ? true : undefined,
          search: searchTerm || undefined,
          sort_by: sortBy,
          limit: 40
        };
        const res = await api.getProducts(params);
        setProducts(res.items || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedSection, selectedCategory, saleParam, featuredParam, searchTerm, sortBy]);

  const handleSectionFilter = (sec) => {
    setSelectedSection(sec);
    const newParams = new URLSearchParams(searchParams);
    if (sec) newParams.set('section', sec);
    else newParams.delete('section');
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-start">
          <span className="text-[#c5a059] text-xs font-semibold uppercase tracking-widest">
            {lang === 'ar' ? 'كتالوج الأزياء الفاخرة' : 'Haute Couture Catalog'}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mt-1">
            {selectedSection === 'men'
              ? t('heroMenTitle')
              : selectedSection === 'women'
              ? t('heroWomenTitle')
              : saleParam
              ? t('heroSaleTitle')
              : featuredParam
              ? t('heroNewTitle')
              : lang === 'ar'
              ? 'كافة التشكيلات'
              : 'All Collections'}
          </h1>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel rounded-2xl p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 border border-white/10">
          {/* Section Pills */}
          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              onClick={() => handleSectionFilter('')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] ${
                !selectedSection
                  ? 'bg-[#c5a059] text-black shadow-lg'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {t('filterAll')}
            </button>
            <button
              onClick={() => handleSectionFilter('men')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] ${
                selectedSection === 'men'
                  ? 'bg-[#c5a059] text-black shadow-lg'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {t('navMen')}
            </button>
            <button
              onClick={() => handleSectionFilter('women')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] ${
                selectedSection === 'women'
                  ? 'bg-[#c5a059] text-black shadow-lg'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {t('navWomen')}
            </button>
          </div>

          {/* Search Input & Sorter */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute top-3.5 start-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'بحث عن قطعة...' : 'Search pieces...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input ps-9 py-2 text-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute top-3 end-3 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input py-2 text-xs w-36 bg-[#161616]"
            >
              <option value="newest">{lang === 'ar' ? 'الأحدث أولاً' : 'Newest'}</option>
              <option value="price_asc">{lang === 'ar' ? 'السعر: من الأقل' : 'Price: Low to High'}</option>
              <option value="price_desc">{lang === 'ar' ? 'السعر: من الأعلى' : 'Price: High to Low'}</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-24 text-center text-[#c5a059] flex items-center justify-center gap-3 animate-pulse">
            <span className="w-3 h-3 rounded-full bg-[#c5a059]"></span>
            <span>{t('loading')}</span>
          </div>
        ) : products.length === 0 ? (
          <div className="glass-card text-center py-20 px-4 rounded-2xl">
            <p className="text-gray-400 text-lg mb-4">
              {lang === 'ar' ? 'لا توجد منتجات تطابق اختياراتك الحالية.' : 'No pieces found matching your criteria.'}
            </p>
            <button
              onClick={() => {
                setSelectedSection('');
                setSelectedCategory('');
                setSearchTerm('');
                setSearchParams({});
              }}
              className="gold-button text-xs py-2 px-5"
            >
              {lang === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => {
              const price = p.discount_price || p.base_price;
              const hasDiscount = !!p.discount_price;
              const imageUrl = p.images?.[0]?.image_url || '/assets/logo.png';

              return (
                <div key={p.id} className="glass-card overflow-hidden flex flex-col group">
                  <Link to={`/products/${p.slug}`} className="relative h-80 w-full overflow-hidden bg-neutral-900 block">
                    <img
                      src={imageUrl}
                      alt={lang === 'ar' ? p.name_ar : p.name_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {hasDiscount && (
                      <span className="absolute top-3 start-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                        {lang === 'ar' ? 'تخفيض' : 'Sale'}
                      </span>
                    )}
                    {p.is_featured && !hasDiscount && (
                      <span className="absolute top-3 start-3 bg-[#c5a059] text-black text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                        {lang === 'ar' ? 'حصري' : 'Exclusive'}
                      </span>
                    )}
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-gray-400">
                        {p.gender_section === 'men' ? t('navMen') : t('navWomen')}
                      </span>
                      <h3 className="font-semibold text-white text-base mt-1 line-clamp-1 group-hover:text-[#c5a059] transition-colors">
                        <Link to={`/products/${p.slug}`}>
                          {lang === 'ar' ? p.name_ar : p.name_en}
                        </Link>
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {lang === 'ar' ? p.description_ar : p.description_en}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-[#c5a059]">
                          {price} {t('currency')}
                        </div>
                        {hasDiscount && (
                          <div className="text-xs text-gray-500 line-through">
                            {p.base_price} {t('currency')}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(p, p.variants?.[0] || null)}
                        className="gold-button text-xs py-2 px-3.5 min-h-[40px]"
                        title={t('addToCart')}
                        aria-label={t('addToCart')}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t('addToCart')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
