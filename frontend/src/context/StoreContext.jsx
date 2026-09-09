import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  ar: {
    brandName: "BLACK ELEGANCE",
    brandTagline: "الفخامة والأناقة الخالدة",
    navHome: "الرئيسية",
    navMen: "رجالي",
    navWomen: "نسائي",
    navNew: "وصل حديثاً",
    navSale: "تخفيضات",
    navCart: "حقيبة التسوق",
    navAdmin: "لوحة التحكم",
    ctaShopNow: "تسوق الآن",
    ctaExplore: "اكتشف التشكيلة",
    chooseSection: "اختر تشكيلتك الفاخرة",
    resetBtn: "عودة للمشهد الرئيسي",
    heroMenTitle: "تشكيلة الرجال الفاخرة",
    heroMenSub: "تصاميم كلاسيكية معاصرة مصنوعة من أفخر الأقمشة الإيطالية",
    heroWomenTitle: "تشكيلة النساء الراقية",
    heroWomenSub: "فساتين سهرة وأزياء كوتور تتألق بأناقة اللون الأسود الملكي",
    heroNewTitle: "إصدارات الموسم الجديد",
    heroNewSub: "أحدث إبداعات دار بلاك إليجانس لعام 2026",
    heroSaleTitle: "التخفيضات الموسمية الخاصة",
    heroSaleSub: "قطع حصرية مختارة بعناية بأسعار استثنائية لفترة محدودة",
    currency: "د.ج",
    addToCart: "إضافة إلى الحقيبة",
    size: "المقاس",
    color: "اللون",
    outOfStock: "نفذت الكمية",
    inStock: "متوفر بالمخزون",
    emptyCart: "حقيبة التسوق فارغة حالياً",
    startShopping: "تصفح التشكيلة وابدأ التسوق",
    cartTotal: "المجموع الكلي",
    shipping: "التوصيل",
    freeShipping: "توصيل مجاني",
    checkoutBtn: "متابعة لإتمام الطلب (الدفع عند الاستلام)",
    guestCheckoutTitle: "إتمام الطلب السريع (بدون حساب)",
    guestCheckoutSub: "أدخل بياناتك للتوصيل مباشرة، والدفع نقداً عند الاستلام.",
    fullName: "الاسم الكامل",
    phone: "رقم الهاتف",
    address: "عنوان التوصيل بالتفصيل",
    city: "المدينة / الولاية",
    orderNotes: "ملاحظات للتوصيل (اختياري)",
    confirmOrder: "تأكيد الطلب الآن",
    orderSuccessTitle: "تم استلام طلبك بنجاح!",
    orderSuccessSub: "سيتواصل معك فريقنا هاتفياً لتأكيد موعد التوصيل والدفع عند الاستلام.",
    orderNumber: "رقم الطلب",
    adminLoginTitle: "تسجيل دخول مدير المتجر",
    adminEmail: "البريد الإلكتروني للإدارة",
    adminPassword: "كلمة المرور",
    loginBtn: "دخول اللوحة",
    adminDashboard: "لوحة التحكم الرئيسية",
    totalOrders: "إجمالي الطلبات",
    totalRevenue: "إجمالي الإيرادات",
    pendingOrders: "طلبات قيد المراجعة",
    deliveredOrders: "طلبات تم تسليمها",
    manageProducts: "إدارة المنتجات",
    manageCategories: "إدارة الفئات",
    ordersList: "سجل الطلبات",
    newOrderAlert: "🔔 طلب جديد وارد الآن!",
    logout: "تسجيل الخروج",
    filterAll: "الكل",
    filterPrice: "تصفية حسب السعر",
    allSections: "جميع الأقسام",
    loading: "جاري التحميل...",
    saveChanges: "حفظ التغييرات",
    addNewProduct: "إضافة منتج جديد",
    statusPending: "قيد المراجعة",
    statusConfirmed: "تم التأكيد",
    statusShipped: "تم الشحن",
    statusDelivered: "تم التسليم",
    statusCancelled: "ملغي"
  },
  en: {
    brandName: "BLACK ELEGANCE",
    brandTagline: "Timeless Luxury & Elegance",
    navHome: "Home",
    navMen: "Men",
    navWomen: "Women",
    navNew: "New Arrivals",
    navSale: "Sale",
    navCart: "Shopping Bag",
    navAdmin: "Admin",
    ctaShopNow: "Shop Now",
    ctaExplore: "Explore Collection",
    chooseSection: "Choose Your Collection",
    resetBtn: "Reset to Main",
    heroMenTitle: "Men's Luxury Collection",
    heroMenSub: "Contemporary tailoring crafted from the finest Italian fabrics",
    heroWomenTitle: "Women's Haute Collection",
    heroWomenSub: "Evening gowns and couture radiating pure obsidian elegance",
    heroNewTitle: "New Season Arrivals",
    heroNewSub: "Latest 2026 runway creations from the Black Elegance atelier",
    heroSaleTitle: "Private Seasonal Sale",
    heroSaleSub: "Curated exclusive pieces at exceptional prices for a limited time",
    currency: "DZD",
    addToCart: "Add to Bag",
    size: "Size",
    color: "Color",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    emptyCart: "Your shopping bag is currently empty",
    startShopping: "Explore collections and start shopping",
    cartTotal: "Subtotal",
    shipping: "Delivery",
    freeShipping: "Complimentary Delivery",
    checkoutBtn: "Proceed to Checkout (Cash on Delivery)",
    guestCheckoutTitle: "Express Guest Checkout",
    guestCheckoutSub: "No account required. Enter your delivery info and pay on delivery.",
    fullName: "Full Name",
    phone: "Phone Number",
    address: "Detailed Delivery Address",
    city: "City / State",
    orderNotes: "Delivery Notes (Optional)",
    confirmOrder: "Confirm Order Now",
    orderSuccessTitle: "Order Received Successfully!",
    orderSuccessSub: "Our team will contact you shortly to confirm your delivery and cash on delivery.",
    orderNumber: "Order ID",
    adminLoginTitle: "Store Admin Login",
    adminEmail: "Admin Email",
    adminPassword: "Password",
    loginBtn: "Sign In to Dashboard",
    adminDashboard: "Admin Dashboard",
    totalOrders: "Total Orders",
    totalRevenue: "Total Revenue",
    pendingOrders: "Pending Orders",
    deliveredOrders: "Delivered Orders",
    manageProducts: "Products Management",
    manageCategories: "Categories Management",
    ordersList: "Orders History",
    newOrderAlert: "🔔 New order just received!",
    logout: "Sign Out",
    filterAll: "All",
    filterPrice: "Filter by Price",
    allSections: "All Collections",
    loading: "Loading...",
    saveChanges: "Save Changes",
    addNewProduct: "Add New Product",
    statusPending: "Pending",
    statusConfirmed: "Confirmed",
    statusShipped: "Shipped",
    statusDelivered: "Delivered",
    statusCancelled: "Cancelled"
  }
};

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('be_lang') || 'ar');
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('be_cart')) || [];
    } catch {
      return [];
    }
  });
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('be_admin_token') || null);

  useEffect(() => {
    localStorage.setItem('be_lang', lang);
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('be_cart', JSON.stringify(cart));
  }, [cart]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['ar'][key] || key;
  };

  // Cart operations
  const addToCart = (product, variant = null, quantity = 1) => {
    setCart((prev) => {
      const cartKey = `${product.id}-${variant?.id || 'base'}`;
      const existing = prev.find((item) => item.cartKey === cartKey);
      
      const price = variant?.additional_price 
        ? (Number(product.discount_price || product.base_price) + Number(variant.additional_price))
        : Number(product.discount_price || product.base_price);

      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [
        ...prev,
        {
          cartKey,
          productId: product.id,
          variantId: variant?.id || null,
          name_ar: product.name_ar,
          name_en: product.name_en,
          price: price,
          quantity: quantity,
          variantDetails: variant ? `${variant.size || ''} ${variant.color || ''}`.trim() : null,
          image: product.images?.[0]?.image_url || '/assets/logo.png'
        }
      ];
    });
  };

  const updateCartQty = (cartKey, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartKey === cartKey) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartKey) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Admin auth
  const loginAdmin = (token) => {
    localStorage.setItem('be_admin_token', token);
    setAdminToken(token);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('be_admin_token');
    setAdminToken(null);
  };

  return (
    <StoreContext.Provider
      value={{
        lang,
        toggleLanguage,
        t,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        adminToken,
        loginAdmin,
        logoutAdmin,
        isAdminLoggedIn: !!adminToken
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
