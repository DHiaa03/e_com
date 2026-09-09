import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';

export default function Cart() {
  const { lang, t, cart, updateCartQty, removeFromCart, cartSubtotal } = useStore();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#080808] pt-36 pb-20 flex items-center justify-center px-4">
        <div className="glass-card max-w-md w-full p-8 text-center space-y-5 rounded-2xl border border-white/10">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-gray-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {t('emptyCart')}
          </h2>
          <p className="text-sm text-gray-400">
            {lang === 'ar'
              ? 'تصفح أحدث تصاميمنا الفاخرة للرجال والنساء وأضف قطعك المفضلة.'
              : 'Explore our latest luxury designs for men and women and select your favorites.'}
          </p>
          <div className="pt-2">
            <Link to="/catalog" className="gold-button text-sm py-3 px-6">
              {t('startShopping')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          {t('navCart')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.cartKey}
                className="glass-card p-4 sm:p-5 rounded-xl border border-white/10 flex items-center gap-4 sm:gap-6"
              >
                {/* Thumbnail */}
                <img
                  src={item.image || '/assets/logo.png'}
                  alt={lang === 'ar' ? item.name_ar : item.name_en}
                  className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg object-cover bg-neutral-900 flex-shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-base truncate">
                    {lang === 'ar' ? item.name_ar : item.name_en}
                  </h3>
                  {item.variantDetails && (
                    <p className="text-xs text-[#c5a059] mt-0.5">
                      {item.variantDetails}
                    </p>
                  )}
                  <div className="text-sm font-bold text-white mt-2">
                    {item.price} {t('currency')}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center glass-panel rounded-lg border border-white/10 overflow-hidden">
                      <button
                        onClick={() => updateCartQty(item.cartKey, -1)}
                        className="px-2.5 py-1 text-xs text-gray-300 hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.cartKey, 1)}
                        className="px-2.5 py-1 text-xs text-gray-300 hover:text-white"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartKey)}
                      className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-end flex-shrink-0">
                  <span className="text-xs text-gray-400 block">{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span className="text-base font-bold text-[#c5a059]">
                    {item.price * item.quantity} {t('currency')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Checkout Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6 lg:sticky lg:top-28">
            <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3">
              {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>{t('cartTotal')}</span>
                <span className="font-semibold text-white">
                  {cartSubtotal} {t('currency')}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>{t('shipping')}</span>
                <span className="font-semibold text-emerald-400">
                  {t('freeShipping')}
                </span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-base font-bold text-white">
                <span>{lang === 'ar' ? 'المجموع النهائي' : 'Estimated Total'}</span>
                <span className="text-[#c5a059] text-xl">
                  {cartSubtotal} {t('currency')}
                </span>
              </div>
            </div>

            {/* Cash on Delivery Notice */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-gray-300 flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#c5a059] flex-shrink-0" />
              <span>
                {lang === 'ar'
                  ? 'الدفع نقداً عند الاستلام: ادفع للمندوب عند استلام ومعاينة طلبك.'
                  : 'Cash on Delivery: Pay the courier directly upon physical inspection.'}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="gold-button w-full py-4 text-sm font-semibold"
            >
              <span>{t('checkoutBtn')}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
