import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translate, formatPrice } from './i18n';
import { token as authToken } from '../services/api';

const LANG_KEY = 'be_lang';
const CART_KEY = 'be_cart';

const StoreContext = createContext(null);

function readCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY));
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((item) => item && item.key && item.productId)
      .map((item) => ({
        key: String(item.key),
        productId: Number(item.productId),
        variantId: item.variantId ?? null,
        nameAr: item.nameAr || '',
        nameEn: item.nameEn || '',
        size: item.size || null,
        color: item.color || null,
        image: item.image || null,
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
      }));
  } catch {
    return [];
  }
}

export function StoreProvider({ children }) {
  const [lang, setLang] = useState(() => (localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'ar'));
  const [cart, setCart] = useState(readCart);
  const [adminToken, setAdminToken] = useState(() => authToken.get());

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const t = useCallback((key, vars) => translate(lang, key, vars), [lang]);
  const price = useCallback((value) => formatPrice(value, lang), [lang]);

  const toggleLanguage = useCallback(() => {
    setLang((current) => (current === 'ar' ? 'en' : 'ar'));
  }, []);

  const addItem = useCallback((product, variant, quantity = 1) => {
    const key = `${product.id}:${variant?.id ?? 'base'}`;
    const unit = Number(variant?.additional_price || 0);
    const base =
      product.is_on_sale && product.discount_price ? product.discount_price : product.base_price;

    setCart((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...current,
        {
          key,
          productId: product.id,
          variantId: variant?.id ?? null,
          nameAr: product.name_ar,
          nameEn: product.name_en,
          size: variant?.size || null,
          color: variant?.color || null,
          image: product.images?.[0]?.image_url || null,
          price: Number(base) + unit,
          quantity,
        },
      ];
    });
  }, []);

  const setQuantity = useCallback((key, quantity) => {
    setCart((current) =>
      quantity < 1
        ? current.filter((item) => item.key !== key)
        : current.map((item) => (item.key === key ? { ...item, quantity } : item))
    );
  }, []);

  const removeItem = useCallback((key) => {
    setCart((current) => current.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const signIn = useCallback((value) => {
    authToken.set(value);
    setAdminToken(value);
  }, []);

  const signOut = useCallback(() => {
    authToken.clear();
    setAdminToken(null);
  }, []);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      lang,
      isRtl: lang === 'ar',
      toggleLanguage,
      t,
      price,
      cart,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      cartCount,
      cartSubtotal,
      adminToken,
      signIn,
      signOut,
      isAdmin: Boolean(adminToken),
    }),
    [
      lang,
      toggleLanguage,
      t,
      price,
      cart,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      cartCount,
      cartSubtotal,
      adminToken,
      signIn,
      signOut,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside StoreProvider');
  return context;
}

export default StoreContext;
