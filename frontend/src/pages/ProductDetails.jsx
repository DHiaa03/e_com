import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';

export default function ProductDetails() {
  const { slug } = useParams();
  const { lang, t, addToCart } = useStore();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedAlert, setAddedAlert] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await api.getProduct(slug);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].image_url);
        } else {
          setSelectedImage('/assets/logo.png');
        }
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center pt-20">
        <div className="text-center text-[#c5a059] flex items-center gap-3 animate-pulse">
          <span className="w-3 h-3 rounded-full bg-[#c5a059]"></span>
          <span>{t('loading')}</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center pt-20 px-4">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">{lang === 'ar' ? 'المنتج غير متوفر' : 'Product Not Found'}</h2>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          <button onClick={() => navigate('/catalog')} className="gold-button text-xs py-2 px-6">
            {lang === 'ar' ? 'العودة للكتالوج' : 'Back to Catalog'}
          </button>
        </div>
      </div>
    );
  }

  const basePrice = Number(product.discount_price || product.base_price);
  const variantAdditional = Number(selectedVariant?.additional_price || 0);
  const currentPrice = basePrice + variantAdditional;
  const hasDiscount = !!product.discount_price;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 2500);
  };

  const handleDirectBuy = () => {
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Navigation breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white mb-8 transition-colors"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{lang === 'ar' ? 'رجوع' : 'Back'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Gallery Side */}
          <div className="space-y-4">
            <div className="h-[480px] md:h-[580px] rounded-2xl overflow-hidden glass-panel border border-white/10 relative bg-neutral-950">
              <img
                src={selectedImage}
                alt={lang === 'ar' ? product.name_ar : product.name_en}
                className="w-full h-full object-cover object-center"
              />
              {hasDiscount && (
                <span className="absolute top-4 start-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {lang === 'ar' ? 'تخفيض حصري' : 'Special Offer'}
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.image_url)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === img.image_url ? 'border-[#c5a059] scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.image_url} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Side */}
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-[#c5a059]">
                {product.gender_section === 'men' ? t('navMen') : t('navWomen')} · {product.category?.name_ar || ''}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-1 mb-3">
                {lang === 'ar' ? product.name_ar : product.name_en}
              </h1>

              {/* Price Display */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#c5a059]">
                  {currentPrice} {t('currency')}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-500 line-through">
                    {Number(product.base_price) + variantAdditional} {t('currency')}
                  </span>
                )}
              </div>
            </div>

            {/* Product Description */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                {lang === 'ar' ? product.description_ar : product.description_en}
              </p>
            </div>

            {/* Variants Picker (Size & Color) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 border-t border-white/10 pt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                  {t('size')} / {t('color')}
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-2 min-h-[44px] ${
                          isSelected
                            ? 'bg-[#c5a059] text-black border-[#c5a059] shadow-md'
                            : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {v.color_code && (
                          <span
                            className="w-3 h-3 rounded-full border border-black/30"
                            style={{ backgroundColor: v.color_code }}
                          />
                        )}
                        <span>{v.size ? `${v.size}` : ''} {v.color ? `· ${v.color}` : ''}</span>
                        {v.additional_price > 0 && (
                          <span className="text-[10px] opacity-75">
                            (+{v.additional_price} {t('currency')})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 border-t border-white/10 pt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                {lang === 'ar' ? 'الكمية' : 'Quantity'}
              </span>
              <div className="flex items-center glass-panel rounded-lg border border-white/10 overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 text-base"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-bold text-white min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 text-base"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="gold-button flex-1 py-3.5 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('addToCart')}</span>
              </button>

              <button
                onClick={handleDirectBuy}
                className="glass-outline-button flex-1 py-3.5 text-sm font-semibold hover:bg-white hover:text-black"
              >
                <span>{lang === 'ar' ? 'شراء فوري (الدفع عند الاستلام)' : 'Buy Now (Cash on Delivery)'}</span>
              </button>
            </div>

            {/* Add Alert */}
            {addedAlert && (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'تمت إضافة القطعة بنجاح إلى حقيبة التسوق!' : 'Piece added to your shopping bag!'}</span>
              </div>
            )}

            {/* Trust Assurances */}
            <div className="border-t border-white/10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#c5a059]" />
                <span>{lang === 'ar' ? 'الدفع نقداً عند التوصيل والمعاينة' : 'Cash on delivery with full inspection'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                <span>{lang === 'ar' ? 'خامات إيطالية أصلية ومضمونة' : '100% Genuine Italian craftsmanship'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
