import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { ShieldCheck, Truck, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const { lang, t, cart, cartSubtotal, clearCart } = useStore();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  if (cart.length === 0 && !placedOrder) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customer_name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg(lang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة (الاسم، الهاتف، العنوان).' : 'Please fill all required fields (Name, Phone, Address).');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customer_name: formData.customer_name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        address: formData.address.trim(),
        city: formData.city.trim() || null,
        notes: formData.notes.trim() || null,
        items: cart.map((item) => ({
          product_id: item.productId,
          variant_id: item.variantId || null,
          quantity: item.quantity
        }))
      };

      const result = await api.createOrder(orderPayload);
      setPlacedOrder(result);
      clearCart();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place order. Please check your data.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success Screen
  if (placedOrder) {
    return (
      <div className="min-h-screen bg-[#080808] pt-36 pb-20 flex items-center justify-center px-4">
        <div className="glass-panel max-w-xl w-full p-8 md:p-12 text-center rounded-2xl border border-white/10 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider">
              {t('orderSuccessTitle')}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">
              {lang === 'ar' ? 'شكراً لطلبك من BLACK ELEGANCE' : 'Thank You For Your Order'}
            </h1>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-start text-sm space-y-2">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">{t('orderNumber')}:</span>
              <span className="font-bold text-[#c5a059]">{placedOrder.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{lang === 'ar' ? 'المستلم' : 'Recipient'}:</span>
              <span className="font-semibold text-white">{placedOrder.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}:</span>
              <span className="font-semibold text-white">{placedOrder.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}:</span>
              <span className="font-semibold text-white">{lang === 'ar' ? 'الدفع عند الاستلام (COD)' : 'Cash On Delivery'}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-base">
              <span className="text-white">{lang === 'ar' ? 'المبلغ المستحق نقداً' : 'Total Due on Delivery'}:</span>
              <span className="text-[#c5a059]">{placedOrder.total_amount} {t('currency')}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            {t('orderSuccessSub')}
          </p>

          <div className="pt-4">
            <Link to="/catalog" className="gold-button text-sm py-3 px-8">
              {lang === 'ar' ? 'العودة للتسوق' : 'Continue Shopping'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {t('guestCheckoutTitle')}
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          {t('guestCheckoutSub')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Guest Form */}
          <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-2xl border border-white/10">
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    required
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder={lang === 'ar' ? 'مثال: محمد العمري' : 'e.g. John Doe'}
                    className="glass-input text-sm"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                    {t('phone')} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0550 12 34 56"
                    className="glass-input text-sm"
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  {lang === 'ar' ? 'البريد الإلكتروني (اختياري لتأكيد الطلب)' : 'Email (Optional for receipt)'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="glass-input text-sm"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  {t('address')} *
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={lang === 'ar' ? 'اسم الحي، الشارع، رقم البناية أو المنزل...' : 'District, Street, Building / Villa number...'}
                  className="glass-input text-sm resize-none"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  {t('city')}
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={lang === 'ar' ? 'الجزائر / الرياض / دبي...' : 'City name...'}
                  className="glass-input text-sm"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                  {t('orderNotes')}
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder={lang === 'ar' ? 'أي تعليمات خاصة بالتوصيل أو موعد الاتصال...' : 'Special courier instructions...'}
                  className="glass-input text-sm resize-none"
                />
              </div>

              {/* Payment Method Details (Cash On Delivery) */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#c5a059] flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white">
                    {lang === 'ar' ? 'الدفع نقداً عند الاستلام (COD)' : 'Cash On Delivery (COD)'}
                  </div>
                  <p className="text-gray-400">
                    {lang === 'ar'
                      ? 'لا حاجة للدفع بالبطاقة الآن. سيقوم المندوب باستلام المبلغ نقداً عند تسليم الطلب وفحصه.'
                      : 'Zero online payment required. Pay cash directly to our courier after delivery.'}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="gold-button w-full py-4 text-sm font-semibold"
              >
                {submitting ? (
                  <span>{t('loading')}</span>
                ) : (
                  <>
                    <span>{t('confirmOrder')}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Side Summary */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white border-b border-white/10 pb-3">
              {lang === 'ar' ? 'محتويات الطلب' : 'Order Items'} ({cart.length})
            </h2>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((it) => (
                <div key={it.cartKey} className="flex items-center gap-3 text-xs">
                  <img src={it.image} alt={it.name_ar} className="w-12 h-14 rounded object-cover bg-neutral-900" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{lang === 'ar' ? it.name_ar : it.name_en}</p>
                    <p className="text-gray-400">{it.variantDetails || ''}</p>
                    <p className="text-[#c5a059] font-semibold">{it.quantity} × {it.price} {t('currency')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>{t('cartTotal')}</span>
                <span className="font-semibold text-white">{cartSubtotal} {t('currency')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('shipping')}</span>
                <span className="text-emerald-400 font-semibold">{t('freeShipping')}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between text-base font-bold text-white">
                <span>{lang === 'ar' ? 'المجموع المستحق' : 'Amount Due'}</span>
                <span className="text-[#c5a059]">{cartSubtotal} {t('currency')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
