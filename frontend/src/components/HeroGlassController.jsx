import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowRight, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';

const HERO_DATA = {
  base: {
    titleKey: 'brandName',
    subKey: 'brandTagline',
    ctaPath: '/catalog',
    imgUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80',
    altText: 'Black Elegance Luxury Atelier'
  },
  men: {
    titleKey: 'heroMenTitle',
    subKey: 'heroMenSub',
    ctaPath: '/catalog?section=men',
    imgUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2000&q=80',
    altText: "Black Elegance Men's Tailored Collection"
  },
  women: {
    titleKey: 'heroWomenTitle',
    subKey: 'heroWomenSub',
    ctaPath: '/catalog?section=women',
    imgUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2000&q=80',
    altText: "Black Elegance Women's Evening Gown Collection"
  },
  new: {
    titleKey: 'heroNewTitle',
    subKey: 'heroNewSub',
    ctaPath: '/catalog?featured=true',
    imgUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80',
    altText: 'Black Elegance Runway New Arrivals'
  },
  sale: {
    titleKey: 'heroSaleTitle',
    subKey: 'heroSaleSub',
    ctaPath: '/catalog?sale=true',
    imgUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=2000&q=80',
    altText: 'Black Elegance Private Seasonal Sale'
  }
};

export default function HeroGlassController() {
  const { lang, t } = useStore();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  // State Machine: 'base' | 'men' | 'women' | 'new' | 'sale'
  const [heroState, setHeroState] = useState('base');
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Preload all 5 images via new Image()
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = Object.keys(HERO_DATA).length;

    Object.values(HERO_DATA).forEach((item) => {
      const img = new Image();
      img.src = item.imgUrl;
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        // Even if an external image errors, enable buttons so UI is not blocked
        loadedCount += 1;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  // State transitions: base -> (men|women|new|sale) -> base
  const handleSelectSection = (sectionKey) => {
    if (heroState === 'base') {
      setHeroState(sectionKey);
      setAnnouncement(`${t(HERO_DATA[sectionKey].titleKey)} ${lang === 'ar' ? 'مختارة الآن' : 'selected'}`);
    } else if (heroState === sectionKey) {
      // Clicking the active section resets back to base
      setHeroState('base');
      setAnnouncement(lang === 'ar' ? 'تمت العودة للمشهد الرئيسي' : 'Reset to main view');
    }
  };

  const handleReset = () => {
    setHeroState('base');
    setAnnouncement(lang === 'ar' ? 'تمت العودة للمشهد الرئيسي' : 'Reset to main view');
  };

  const currentHero = HERO_DATA[heroState];

  const sections = [
    { key: 'men', label: t('navMen') },
    { key: 'women', label: t('navWomen') },
    { key: 'new', label: t('navNew') },
    { key: 'sale', label: t('navSale') },
  ];

  return (
    <section 
      className="relative w-full h-screen min-h-[640px] max-h-[1080px] flex flex-col justify-between overflow-hidden bg-black select-none"
      aria-label="Hero Section"
    >
      {/* Live Region for Screen Readers (Accessibility) */}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      {/* Stack of Preloaded Full-Viewport Background Images */}
      {Object.entries(HERO_DATA).map(([key, data]) => {
        const isActive = heroState === key;
        return (
          <div
            key={key}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <img
              src={data.imgUrl}
              alt={data.altText}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
              loading="eager"
            />
            {/* Multi-gradient Vignette Overlay for Luxury Black Elegance Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/50 to-black/70" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80" />
          </div>
        );
      })}

      {/* Top Spacer to account for fixed navbar */}
      <div className="h-20 w-full" />

      {/* Center Content: Title, Subtitle, and Glass Controller */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 w-full flex flex-col items-center text-center my-auto">
        {/* State Badge */}
        {heroState !== 'base' && (
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#c5a059] text-xs font-semibold tracking-wider uppercase animate-in fade-in zoom-in duration-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t(currentHero.titleKey)}</span>
          </div>
        )}

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-wider mb-4 leading-tight drop-shadow-2xl transition-all duration-500">
          {t(currentHero.titleKey)}
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 font-light leading-relaxed drop-shadow-md transition-all duration-500">
          {t(currentHero.subKey)}
        </p>

        {/* Interactive CTA Link */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(currentHero.ctaPath)}
            className="gold-button text-sm sm:text-base px-8 py-3.5"
            aria-label={`${t('ctaShopNow')} - ${t(currentHero.titleKey)}`}
          >
            <span>{t('ctaShopNow')}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>

          {heroState !== 'base' && (
            <button
              onClick={handleReset}
              className="glass-outline-button text-xs sm:text-sm py-3 px-5"
              aria-label={t('resetBtn')}
            >
              <RotateCcw className="w-4 h-4 text-[#c5a059]" />
              <span>{t('resetBtn')}</span>
            </button>
          )}
        </div>

        {/* Loading Indicator while Images Preload */}
        {!imagesLoaded && (
          <div className="text-xs text-[#c5a059] flex items-center gap-2 mb-4 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#c5a059]"></span>
            <span>{t('loading')}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Glassmorphic Controller Bar (Responsive: Horizontal Desktop, 2x2 Mobile) */}
        {/* ------------------------------------------------------------- */}
        <div
          className={`hero-glass-controller transition-all duration-500 ${
            heroState === 'base' ? 'grid-mode' : 'w-auto max-w-xs'
          }`}
          role="group"
          aria-label={t('chooseSection')}
        >
          {heroState === 'base' ? (
            <>
              <div className="hidden lg:flex items-center px-4 text-xs font-semibold tracking-widest text-[#c5a059] uppercase border-e border-white/10 select-none">
                {t('chooseSection')}
              </div>

              {sections.map((sec) => (
                <button
                  key={sec.key}
                  disabled={!imagesLoaded}
                  onClick={() => handleSelectSection(sec.key)}
                  className="hero-btn"
                  aria-pressed={heroState === sec.key}
                  aria-label={sec.label}
                >
                  {sec.label}
                </button>
              ))}
            </>
          ) : (
            /* Collapsed Single Capsule in Active State */
            <div className="flex items-center justify-between w-full px-2 py-1 gap-4">
              <span className="text-sm font-semibold text-white px-2">
                {sections.find((s) => s.key === heroState)?.label}
              </span>
              <button
                onClick={handleReset}
                className="gold-button text-xs py-1.5 px-4 min-h-[36px]"
                aria-label={t('resetBtn')}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'رجوع' : 'Back'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="relative z-20 pb-6 text-center text-xs text-gray-500 flex flex-col items-center gap-1 animate-pulse">
        <span>{lang === 'ar' ? 'مرر للأسفل لاكتشاف الكتالوج الكامل' : 'Scroll down to explore collection'}</span>
        <div className="w-1 h-4 rounded-full bg-[#c5a059]/40 mt-1" />
      </div>
    </section>
  );
}
