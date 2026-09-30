import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

/* Static artwork per section: one picture, one headline, one action. */
const STATES = [
  {
    key: 'base',
    label: 'stateAll',
    title: 'heroBaseTitle',
    sub: 'heroBaseSub',
    cta: 'ctaBrowseStore',
    to: '/catalog',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=70',
  },
  {
    key: 'men',
    label: 'stateMen',
    title: 'heroMenTitle',
    sub: 'heroMenSub',
    cta: 'ctaShopMen',
    to: '/catalog?section=men',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=70',
  },
  {
    key: 'women',
    label: 'stateWomen',
    title: 'heroWomenTitle',
    sub: 'heroWomenSub',
    cta: 'ctaShopWomen',
    to: '/catalog?section=women',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=70',
  },
  {
    key: 'new',
    label: 'stateNew',
    title: 'heroNewTitle',
    sub: 'heroNewSub',
    cta: 'ctaShopNew',
    to: '/catalog?featured=true',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=70',
  },
  {
    key: 'sale',
    label: 'stateSale',
    title: 'heroSaleTitle',
    sub: 'heroSaleSub',
    cta: 'ctaShopSale',
    to: '/catalog?sale=true',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=70',
  },
];

export default function HeroController() {
  const { t, isRtl } = useStore();
  const [activeKey, setActiveKey] = useState('base');
  const [shownKeys, setShownKeys] = useState(['base']);
  const buttons = useRef({});

  const active = STATES.find((state) => state.key === activeKey) || STATES[0];

  /* Warm the cache for the other sections once the first paint is done, so a
     change of section is a cross-fade rather than a fresh download. */
  useEffect(() => {
    const timer = setTimeout(() => {
      STATES.filter((state) => state.key !== 'base').forEach((state) => {
        const preload = new Image();
        preload.src = state.image;
      });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const select = useCallback((key) => {
    setActiveKey(key);
    setShownKeys((current) => (current.includes(key) ? current : [...current, key]));
  }, []);

  const onGroupKeyDown = (event) => {
    const index = STATES.findIndex((state) => state.key === activeKey);
    const step = isRtl ? -1 : 1;
    let next = null;

    if (event.key === 'ArrowRight') next = (index + step + STATES.length) % STATES.length;
    if (event.key === 'ArrowLeft') next = (index - step + STATES.length) % STATES.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = STATES.length - 1;
    if (next === null) return;

    event.preventDefault();
    const target = STATES[next];
    select(target.key);
    buttons.current[target.key]?.focus();
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        {STATES.filter((state) => shownKeys.includes(state.key)).map((state) => (
          <img
            key={state.key}
            className={`hero__img ${state.key === activeKey ? 'is-active' : ''}`}
            src={state.image}
            alt=""
            fetchpriority={state.key === 'base' ? 'high' : 'low'}
            decoding="async"
          />
        ))}
        <span className="hero__scrim" aria-hidden="true" />
      </div>

      <div className="hero__copy">
        <h1 className="hero__title" id="hero-title">
          {t(active.title)}
        </h1>
        <p className="hero__sub">{t(active.sub)}</p>
        <div className="hero__cta">
          <Link className="btn btn--primary btn--lg" to={active.to}>
            {t(active.cta)}
          </Link>
        </div>
      </div>

      <div className="hero__controller">
        <div className="seg" role="group" aria-label={t('chooseSection')} onKeyDown={onGroupKeyDown}>
          {STATES.map((state) => (
            <button
              key={state.key}
              type="button"
              ref={(node) => {
                buttons.current[state.key] = node;
              }}
              className="seg__item"
              aria-pressed={state.key === activeKey}
              tabIndex={state.key === activeKey ? 0 : -1}
              onClick={() => select(state.key)}
            >
              {t(state.label)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
