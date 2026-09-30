import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Settings, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const LINKS = [
  { to: '/catalog', key: 'navStore' },
  { to: '/catalog?section=men', key: 'navMen' },
  { to: '/catalog?section=women', key: 'navWomen' },
  { to: '/catalog?featured=true', key: 'navNew' },
  { to: '/catalog?sale=true', key: 'navSale' },
];

export default function SiteHeader() {
  const { t, lang, toggleLanguage, cartCount } = useStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeRef = useRef(null);

  const overHero = location.pathname === '/';
  const here = `${location.pathname}${location.search}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const headerClass = overHero && !scrolled ? 'site-header--over' : 'site-header--solid';

  return (
    <>
      <header className={`site-header ${headerClass}`}>
        <div className="shell site-header__inner">
          <Link className="brand" to="/">
            <img className="brand__mark" src="/assets/logo.png" alt="" width="28" height="28" />
            <span className="brand__name">{t('brandName')}</span>
          </Link>

          <nav className="site-nav" aria-label={t('navStore')}>
            {LINKS.map((link) => (
              <Link
                key={link.to}
                className="site-nav__link"
                to={link.to}
                aria-current={here === link.to ? 'page' : undefined}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div className="site-actions">
            <button
              type="button"
              className="lang-btn"
              onClick={toggleLanguage}
              aria-label={`${t('switchLanguage')}`}
              lang={lang === 'ar' ? 'en' : 'ar'}
            >
              {t('switchLanguage')}
            </button>

            <Link className="icon-btn" to="/cart">
              <ShoppingBag size={20} aria-hidden="true" />
              <span className="sr-only">{t('navBag')}</span>
              {cartCount > 0 ? (
                <span className="icon-btn__count" aria-hidden="true">
                  {cartCount}
                </span>
              ) : null}
            </Link>

            <Link className="icon-btn site-actions__admin" to="/admin">
              <Settings size={18} aria-hidden="true" />
              <span className="sr-only">{t('navAdmin')}</span>
            </Link>

            <button
              type="button"
              className="icon-btn site-actions__menu"
              onClick={() => setMenuOpen(true)}
              aria-label={t('openMenu')}
              aria-expanded={menuOpen}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
        <span className="site-header__edge" aria-hidden="true" />
      </header>

      {menuOpen ? (
        <div className="nav-sheet" role="dialog" aria-modal="true" aria-label={t('openMenu')}>
          <button
            type="button"
            ref={closeRef}
            className="icon-btn nav-sheet__close"
            onClick={() => setMenuOpen(false)}
            aria-label={t('closeMenu')}
          >
            <X size={22} aria-hidden="true" />
          </button>

          <nav aria-label={t('navStore')}>
            <ul className="nav-sheet__list">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <Link className="nav-sheet__link" to={link.to}>
                    {t(link.key)}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="nav-sheet__link" to="/admin">
                  {t('navAdmin')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </>
  );
}
