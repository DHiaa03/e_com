import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroGlassController from '../components/HeroGlassController';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { ArrowRight, ArrowLeft, Sparkles, Shield, Truck, CreditCard } from 'lucide-react';

export default function Home() {
  const { lang, t, addToCart } = useStore();
  const isRtl = lang === 'ar';
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await api.getProducts({ is_featured: true, limit: 4 });
        setFeaturedProducts(data.items || []);
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* 1. Interactive Full-Viewport Glass Hero Section */}
      <HeroGlassController />

      {/* 2. Main Two Collections Showcase (Men & Women) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-[#c5a059] text-xs font-semibold tracking-widest uppercase">
            {lang === 'ar' ? 'التصاميم الحصرية' : 'Exclusive Ateliers'}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-2">
            {lang === 'ar' ? 'استكشف التشكيلتين الأساسيتين' : 'Explore The Signature Collections'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Men's Showcase Card */}
          <Link
            to="/catalog?section=men"
            className="group relative h-[480px] rounded-2xl overflow-hidden glass-card border border-white/10 flex flex-col justify-end p-8"
          >
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80"
              alt="Men's Fashion"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="relative z-10">
              <span className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider">
                {lang === 'ar' ? 'تشكيلة الرجال' : "Men's Line"}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-1 mb-2">
                {lang === 'ar' ? 'الهيبة والأناقة الرسمية' : 'Formal Sartorial Majesty'}
              </h3>
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                {lang === 'ar'
                  ? 'بدل توكسيدو، قمصان حريرية، وسترات كلاسيكية مصممة لأصحاب الذوق الرفيع.'
                  : 'Tailored tuxedos, silk dress shirts, and outerwear crafted for connoisseurs.'}
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#c5a059] group-hover:underline">
                <span>{t('ctaExplore')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </div>
            </div>
          </Link>

          {/* Women's Showcase Card */}
          <Link
            to="/catalog?section=women"
            className="group relative h-[480px] rounded-2xl overflow-hidden glass-card border border-white/10 flex flex-col justify-end p-8"
          >
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80"
              alt="Women's Fashion"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="relative z-10">
              <span className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider">
                {lang === 'ar' ? 'تشكيلة النساء' : "Women's Line"}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-1 mb-2">
                {lang === 'ar' ? 'سحر السهرات والأنوثة الخالدة' : 'Evening Glamour & Allure'}
              </h3>
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                {lang === 'ar'
                  ? 'فساتين سهرة راقية وبليزر كوتور يفيض بالأناقة باللون الأسود الملكي.'
                  : 'Haute couture gowns, tailored blazers, and luxury pieces bathed in deep obsidian.'}
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#c5a059] group-hover:underline">
                <span>{t('ctaExplore')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Featured Products Showcase */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#c5a059] text-xs font-semibold tracking-wider uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'مختارات الموسم' : 'Seasonal Highlights'}</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white">
                {lang === 'ar' ? 'أبرز القطع المختارة' : 'Featured Pieces'}
              </h2>
            </div>
            <Link
              to="/catalog"
              className="glass-outline-button text-xs py-2 px-4"
            >
              <span>{lang === 'ar' ? 'عرض الكتالوج بالكامل' : 'View Full Catalog'}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => {
              const price = p.discount_price || p.base_price;
              const hasDiscount = !!p.discount_price;
              const imageUrl = p.images?.[0]?.image_url || '/assets/logo.png';

              return (
                <div key={p.id} className="glass-card overflow-hidden flex flex-col group">
                  <Link to={`/products/${p.slug}`} className="relative h-72 w-full overflow-hidden bg-neutral-900 block">
                    <img
                      src={imageUrl}
                      alt={lang === 'ar' ? p.name_ar : p.name_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {hasDiscount && (
                      <span className="absolute top-3 start-3 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                        {lang === 'ar' ? 'تخفيض' : 'Sale'}
                      </span>
                    )}
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-gray-400">
                        {p.gender_section === 'men' ? t('navMen') : t('navWomen')}
                      </span>
                      <h4 className="font-semibold text-white text-base mt-1 line-clamp-1 group-hover:text-[#c5a059] transition-colors">
                        <Link to={`/products/${p.slug}`}>
                          {lang === 'ar' ? p.name_ar : p.name_en}
                        </Link>
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-[#c5a059]">
                          {price} {t('currency')}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-gray-500 line-through">
                            {p.base_price} {t('currency')}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(p, p.variants?.[0] || null)}
                        className="gold-button text-xs py-2 px-3 min-h-[38px]"
                        title={t('addToCart')}
                        aria-label={t('addToCart')}
                      >
                        <span>{t('addToCart')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Cash On Delivery Banner */}
      <section className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-y border-white/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex p-3 rounded-full bg-[#c5a059]/10 text-[#c5a059]">
            <Truck className="w-8 h-8" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            {lang === 'ar' ? 'تسوق بثقة تامة — الدفع نقداً عند الاستلام' : 'Shop with Absolute Confidence — Cash on Delivery'}
          </h3>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto">
            {lang === 'ar'
              ? 'لا حاجة لبطاقات ائتمانية. اطلب ما يعجبك الآن، وسيقوم مندوبنا بالتوصيل حتى باب بيتك مع إمكانية المعاينة قبل الدفع.'
              : 'No credit cards required. Place your order now, and our courier will deliver to your doorstep where you pay upon inspection.'}
          </p>
          <div className="pt-2">
            <Link to="/catalog" className="gold-button text-sm py-3 px-6">
              {t('ctaShopNow')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
