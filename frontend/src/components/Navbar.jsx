import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Globe, User, Menu, X, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const { lang, toggleLanguage, t, cartCount, isAdminLoggedIn } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isRtl = lang === 'ar';

  const navLinks = [
    { label: t('navHome'), path: '/' },
    { label: t('navMen'), path: '/catalog?section=men' },
    { label: t('navWomen'), path: '/catalog?section=women' },
    { label: t('navNew'), path: '/catalog?featured=true' },
    { label: t('navSale'), path: '/catalog?sale=true' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top micro announcement */}
      <div className="bg-[#050505] text-[#a3a3a3] text-xs py-1.5 px-4 text-center border-b border-white/5 flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span>
        <span>{lang === 'ar' ? 'خدمة الدفع عند الاستلام متوفرة لجميع المناطق' : 'Cash on Delivery Available Nationwide'}</span>
      </div>

      <nav className="glass-panel mx-auto px-4 md:px-8 py-3 flex items-center justify-between border-b border-white/10">
        {/* Left: Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/assets/logo.png"
            alt="BLACK ELEGANCE"
            className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="brand-font text-base md:text-xl font-bold tracking-widest text-white">
              BLACK ELEGANCE
            </span>
            <span className="text-[10px] text-[#c5a059] tracking-wider uppercase">
              {t('brandTagline')}
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative py-1 hover:border-b-2 hover:border-[#c5a059]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Actions (Language, Admin, Cart, Mobile Menu) */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="glass-outline-button text-xs font-semibold py-1.5 px-3 min-h-[38px]"
            title="Switch Language / تبديل اللغة"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Admin link */}
          <Link
            to={isAdminLoggedIn ? '/admin' : '/admin/login'}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            title={t('navAdmin')}
            aria-label="Admin Portal"
          >
            <User className="w-5 h-5" />
          </Link>

          {/* Cart Icon with Live Badge */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/5 flex items-center"
            title={t('navCart')}
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#c5a059] text-black font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white"
            aria-label="Open Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Mobile-First responsive) */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-white/10 px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-gray-200 hover:text-[#c5a059] py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>{link.label}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4 text-gray-500" /> : <ArrowRight className="w-4 h-4 text-gray-500" />}
            </Link>
          ))}
          <div className="pt-2 flex items-center justify-between">
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="gold-button w-full text-center text-sm py-3"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('navCart')} ({cartCount})</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
