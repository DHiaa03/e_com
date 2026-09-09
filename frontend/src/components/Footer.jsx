import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  const { lang, t } = useStore();

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-12 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Value Propositions / Trust badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/5 text-center md:text-start">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">
                {lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash On Delivery'}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {lang === 'ar' ? 'عاين مشترياتك وادفع نقداً عند باب منزلك' : 'Inspect your order and pay in cash upon delivery'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">
                {lang === 'ar' ? 'جودة فاخرة أصلية 100%' : '100% Guaranteed Luxury'}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {lang === 'ar' ? 'أفخر الخامات والأقمشة الإيطالية والجلد الطبيعي' : 'Finest handcrafted fabrics and genuine calfskin'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059]">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">
                {lang === 'ar' ? 'استبدال سلس ومريح' : 'Seamless Exchange'}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {lang === 'ar' ? 'خدمة استبدال المقاس بكل سهولة وسرعة' : 'Hassle-free size replacement and customer care'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/assets/logo.png" alt="BLACK ELEGANCE" className="h-10 w-auto object-contain" />
              <span className="brand-font text-xl font-bold text-white tracking-widest">
                BLACK ELEGANCE
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              {lang === 'ar'
                ? 'علامة تجارية متخصصة في تقديم أحدث صيحات الموضة الراقية باللون الأسود الملكي. أناقة استثنائية، خياطة رفيعة، وتصاميم تواكب الذوق العصري.'
                : 'Exclusive fashion atelier dedicated to obsidian royalty and timeless silhouettes. Uncompromising craftsmanship tailored for the discerning modern elite.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
              {lang === 'ar' ? 'الأقسام' : 'Collections'}
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/catalog?section=men" className="hover:text-[#c5a059] transition-colors">
                  {t('navMen')}
                </Link>
              </li>
              <li>
                <Link to="/catalog?section=women" className="hover:text-[#c5a059] transition-colors">
                  {t('navWomen')}
                </Link>
              </li>
              <li>
                <Link to="/catalog?featured=true" className="hover:text-[#c5a059] transition-colors">
                  {t('navNew')}
                </Link>
              </li>
              <li>
                <Link to="/catalog?sale=true" className="hover:text-[#c5a059] transition-colors">
                  {t('navSale')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Admin */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
              {lang === 'ar' ? 'خدمة العملاء' : 'Customer Care'}
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/cart" className="hover:text-[#c5a059] transition-colors">
                  {t('navCart')}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#c5a059] transition-colors">
                  {t('navAdmin')}
                </Link>
              </li>
              <li className="text-xs text-gray-500 pt-2">
                {lang === 'ar' ? 'الدعم الفني متاح يومياً' : 'Support available daily'}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} BLACK ELEGANCE. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All Rights Reserved.'}</p>
          <div className="flex items-center gap-4">
            <span>{lang === 'ar' ? 'الأناقة في أبهى صورها' : 'Elegance Redefined'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
