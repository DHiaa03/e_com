/**
 * Copy for both storefront languages.
 * One entry per key holding both languages, so a key can never exist in only
 * one of them. Sentence case, plain verbs, no filler.
 */

export const dict = {
  /* --- navigation and chrome --- */
  navHome: { ar: 'الرئيسية', en: 'Home' },
  navMen: { ar: 'رجالي', en: 'Men' },
  navWomen: { ar: 'نسائي', en: 'Women' },
  navNew: { ar: 'وصل حديثاً', en: 'New arrivals' },
  navSale: { ar: 'تخفيضات', en: 'Sale' },
  navStore: { ar: 'المتجر', en: 'Store' },
  navBag: { ar: 'حقيبة التسوق', en: 'Shopping bag' },
  navAdmin: { ar: 'لوحة التحكم', en: 'Admin' },
  openMenu: { ar: 'فتح القائمة', en: 'Open menu' },
  closeMenu: { ar: 'إغلاق القائمة', en: 'Close menu' },
  switchLanguage: { ar: 'English', en: 'العربية' },
  brandName: { ar: 'BLACK ELEGANCE', en: 'BLACK ELEGANCE' },
  brandLine: { ar: 'أزياء رجالية ونسائية', en: 'Menswear and womenswear' },

  /* --- hero --- */
  heroBaseTitle: { ar: 'الأسود لا يخرج من الموضة', en: 'Black does not go out of style' },
  heroBaseSub: {
    ar: 'بدل رسمية وقمصان وأحذية، نصنعها بكميات صغيرة من أقمشة نختارها بأنفسنا.',
    en: 'Tailoring, shirts and shoes, made in small runs from fabrics we choose ourselves.',
  },
  heroMenTitle: { ar: 'تشكيلة الرجال', en: "Men's collection" },
  heroMenSub: {
    ar: 'بدل رسمية وقمصان وأحذية جلدية. المقاسات من S إلى XXL.',
    en: 'Suits, shirts and leather shoes. Sizes S to XXL.',
  },
  heroWomenTitle: { ar: 'تشكيلة النساء', en: "Women's collection" },
  heroWomenSub: {
    ar: 'فساتين سهرة وسترات وحقائب يد. المقاسات من XS إلى XL.',
    en: 'Evening dresses, blazers and handbags. Sizes XS to XL.',
  },
  heroNewTitle: { ar: 'ما أضفناه هذا الشهر', en: 'Added this month' },
  heroNewSub: {
    ar: 'أحدث القطع في المتجر، بكميات محدودة.',
    en: 'The newest pieces in the store, in limited numbers.',
  },
  heroSaleTitle: { ar: 'أسعار مخفّضة', en: 'Reduced prices' },
  heroSaleSub: {
    ar: 'قطع مختارة بأسعار أقل حتى نفاد الكمية.',
    en: 'Selected pieces at lower prices while they last.',
  },
  chooseSection: { ar: 'اختر قسم التشكيلة', en: 'Choose a collection' },
  ctaBrowseStore: { ar: 'تصفح المتجر', en: 'Browse the store' },
  ctaShopMen: { ar: 'تصفح رجالي', en: 'Shop men' },
  ctaShopWomen: { ar: 'تصفح نسائي', en: 'Shop women' },
  ctaShopNew: { ar: 'تصفح الجديد', en: 'Shop new arrivals' },
  ctaShopSale: { ar: 'تصفح التخفيضات', en: 'Shop the sale' },
  stateAll: { ar: 'الكل', en: 'All' },
  stateMen: { ar: 'رجالي', en: 'Men' },
  stateWomen: { ar: 'نسائي', en: 'Women' },
  stateNew: { ar: 'جديد', en: 'New' },
  stateSale: { ar: 'تخفيضات', en: 'Sale' },

  /* --- home sections --- */
  homeNewTitle: { ar: 'وصل حديثاً', en: 'New arrivals' },
  homeNewMore: { ar: 'كل الجديد', en: 'All new arrivals' },
  homeMenEntry: { ar: 'رجالي', en: 'Men' },
  homeMenEntryLine: {
    ar: 'بدل رسمية وقمصان وأحذية جلدية.',
    en: 'Suits, shirts and leather shoes.',
  },
  homeWomenEntry: { ar: 'نسائي', en: 'Women' },
  homeWomenEntryLine: {
    ar: 'فساتين سهرة وسترات وحقائب يد.',
    en: 'Evening dresses, blazers and handbags.',
  },
  homeOnSaleTitle: { ar: 'بأسعار مخفّضة', en: 'Reduced prices' },
  homeOnSaleMore: { ar: 'كل التخفيضات', en: 'The whole sale' },

  /* --- trust --- */
  trustCodTitle: { ar: 'الدفع عند الاستلام', en: 'Cash on delivery' },
  trustCodBody: {
    ar: 'تدفع نقداً للموصّل عند وصول الطلب.',
    en: 'Pay the courier in cash when your order arrives.',
  },
  trustDeliveryTitle: { ar: 'توصيل خلال 48 إلى 72 ساعة', en: 'Delivery in 48 to 72 hours' },
  trustDeliveryBody: { ar: 'نوصل إلى جميع الولايات.', en: 'We deliver to every wilaya.' },
  trustExchangeTitle: { ar: 'استبدال خلال 7 أيام', en: 'Exchange within 7 days' },
  trustExchangeBody: {
    ar: 'إن لم يناسبك المقاس أو اللون، استبدله.',
    en: 'Wrong size or colour? Exchange it.',
  },

  /* --- catalog --- */
  catalogTitle: { ar: 'المتجر', en: 'Store' },
  refine: { ar: 'تصفية', en: 'Refine' },
  hideFilters: { ar: 'إخفاء التصفية', en: 'Hide filters' },
  sortBy: { ar: 'الترتيب', en: 'Sort' },
  sortNewest: { ar: 'الأحدث أولاً', en: 'Newest first' },
  sortPriceAsc: { ar: 'السعر: من الأقل', en: 'Price: low to high' },
  sortPriceDesc: { ar: 'السعر: من الأعلى', en: 'Price: high to low' },
  onSaleOnly: { ar: 'التخفيضات فقط', en: 'On sale only' },
  priceRange: { ar: 'نطاق السعر', en: 'Price range' },
  priceFrom: { ar: 'من', en: 'From' },
  priceTo: { ar: 'إلى', en: 'To' },
  clearFilters: { ar: 'مسح التصفية', en: 'Clear filters' },
  applyFilters: { ar: 'عرض النتائج', en: 'Show results' },
  resultsCount: { ar: '{n} منتج', en: '{n} products' },
  resultsCountOne: { ar: 'منتج واحد', en: '1 product' },
  noResultsTitle: { ar: 'لا نتائج بهذه التصفية', en: 'No products match these filters' },
  noResultsBody: {
    ar: 'جرّب توسيع نطاق السعر أو مسح التصفية.',
    en: 'Try a wider price range, or clear the filters.',
  },
  subcategory: { ar: 'الفئة', en: 'Category' },
  searchProducts: { ar: 'ابحث عن منتج', en: 'Search products' },
  showMore: { ar: 'عرض المزيد من المنتجات', en: 'Show more products' },
  showingAll: { ar: 'عرضت كل النتائج', en: 'All results shown' },
  previous: { ar: 'السابق', en: 'Previous' },
  next: { ar: 'التالي', en: 'Next' },

  /* --- product detail --- */
  addToBag: { ar: 'أضف إلى الحقيبة', en: 'Add to bag' },
  addedToBag: { ar: 'أُضيف إلى الحقيبة', en: 'Added to bag' },
  size: { ar: 'المقاس', en: 'Size' },
  color: { ar: 'اللون', en: 'Colour' },
  quantity: { ar: 'الكمية', en: 'Quantity' },
  chooseSize: { ar: 'اختر المقاس', en: 'Choose a size' },
  chooseColor: { ar: 'اختر اللون', en: 'Choose a colour' },
  pickVariant: { ar: 'اختر المقاس واللون أولاً.', en: 'Choose a size and colour first.' },
  combinationUnavailable: {
    ar: 'هذه التركيبة غير متوفرة.',
    en: 'That combination is not available.',
  },
  outOfStock: { ar: 'نفدت الكمية', en: 'Out of stock' },
  inStock: { ar: 'متوفر', en: 'In stock' },
  unitsLeft: { ar: 'بقيت {n} قطع', en: '{n} left' },
  productDetails: { ar: 'تفاصيل المنتج', en: 'Product details' },
  productGoneTitle: { ar: 'هذا المنتج غير متوفر', en: 'This product is unavailable' },
  productGoneBody: {
    ar: 'قد يكون حُذف أو نُفد من المخزون. تصفح بقية التشكيلة.',
    en: 'It may have been removed or sold out. Browse the rest of the collection.',
  },
  backToStore: { ar: 'عودة إلى المتجر', en: 'Back to the store' },
  oneSize: { ar: 'مقاس واحد', en: 'One size' },

  /* --- bag --- */
  bagTitle: { ar: 'حقيبة التسوق', en: 'Shopping bag' },
  bagEmptyTitle: { ar: 'الحقيبة فارغة', en: 'Your bag is empty' },
  bagEmptyBody: { ar: 'أضف قطعة لتبدأ طلبك.', en: 'Add a piece to start your order.' },
  browseStore: { ar: 'تصفح المتجر', en: 'Browse the store' },
  subtotal: { ar: 'المجموع الفرعي', en: 'Subtotal' },
  delivery: { ar: 'التوصيل', en: 'Delivery' },
  freeDelivery: { ar: 'مجاني', en: 'Free' },
  total: { ar: 'المجموع', en: 'Total' },
  remove: { ar: 'إزالة', en: 'Remove' },
  continueToCheckout: { ar: 'متابعة الطلب', en: 'Continue to checkout' },
  bagSummaryTitle: { ar: 'ملخص الطلب', en: 'Order summary' },
  bagDeliveryNote: {
    ar: 'التوصيل مجاني، والدفع نقداً عند الاستلام.',
    en: 'Delivery is free. You pay cash on arrival.',
  },
  itemsCount: { ar: '{n} قطعة', en: '{n} items' },
  itemsCountOne: { ar: 'قطعة واحدة', en: '1 item' },
  increase: { ar: 'زيادة الكمية', en: 'Increase quantity' },
  decrease: { ar: 'تقليل الكمية', en: 'Decrease quantity' },

  /* --- checkout --- */
  checkoutTitle: { ar: 'إتمام الطلب', en: 'Checkout' },
  checkoutIntro: {
    ar: 'لا حاجة لإنشاء حساب. أدخل بيانات التوصيل ونرسل الطلب.',
    en: 'No account needed. Enter your delivery details and we send the order.',
  },
  deliveryDetails: { ar: 'بيانات التوصيل', en: 'Delivery details' },
  fullName: { ar: 'الاسم الكامل', en: 'Full name' },
  fullNamePlaceholder: { ar: 'مثال: أحمد الشريف', en: 'For example: Ahmed Cherif' },
  phone: { ar: 'رقم الهاتف', en: 'Phone number' },
  phonePlaceholder: { ar: '0550 12 34 56', en: '0550 12 34 56' },
  city: { ar: 'الولاية أو المدينة', en: 'Wilaya or city' },
  address: { ar: 'العنوان بالتفصيل', en: 'Full address' },
  addressPlaceholder: {
    ar: 'الحي، الشارع، رقم العمارة',
    en: 'Neighbourhood, street, building number',
  },
  notes: { ar: 'ملاحظات للموصّل (اختياري)', en: 'Notes for the courier (optional)' },
  optional: { ar: 'اختياري', en: 'Optional' },
  fieldRequired: { ar: 'هذا الحقل مطلوب.', en: 'This field is required.' },
  phoneInvalid: { ar: 'أدخل رقم هاتف صحيح.', en: 'Enter a valid phone number.' },
  codTitle: { ar: 'الدفع عند الاستلام', en: 'Cash on delivery' },
  codBody: {
    ar: 'تدفع نقداً للموصّل عند وصول الطلب. لا دفع عبر الإنترنت.',
    en: 'You pay the courier in cash when your order arrives. Nothing is paid online.',
  },
  placeOrder: { ar: 'تأكيد الطلب', en: 'Place order' },
  placingOrder: { ar: 'جاري إرسال الطلب…', en: 'Placing your order…' },
  orderPlacedTitle: { ar: 'تم إرسال طلبك', en: 'Your order is placed' },
  orderPlacedBody: {
    ar: 'سنتصل بك على {phone} لتأكيد موعد التوصيل.',
    en: "We'll call you on {phone} to confirm the delivery time.",
  },
  orderNumberLabel: { ar: 'رقم الطلب', en: 'Order number' },
  keepOrderNumber: {
    ar: 'احتفظ بهذا الرقم لمتابعة الطلب.',
    en: 'Keep this number to follow your order.',
  },
  orderFailedTitle: { ar: 'لم نتمكن من إرسال الطلب', en: "We couldn't place the order" },
  orderRetry: { ar: 'جرّب مرة أخرى', en: 'Try again' },
  backHome: { ar: 'الرئيسية', en: 'Home' },
  summaryItems: { ar: 'القطع', en: 'Items' },
  paidOnDelivery: { ar: 'يُدفع عند الاستلام', en: 'Paid on delivery' },

  /* --- admin --- */
  adminLoginTitle: { ar: 'تسجيل دخول المدير', en: 'Admin sign in' },
  adminLoginIntro: {
    ar: 'هذه المساحة مخصّصة لمدير المتجر فقط.',
    en: 'This area is for the store admin only.',
  },
  adminEmail: { ar: 'البريد الإلكتروني', en: 'Email' },
  adminPassword: { ar: 'كلمة المرور', en: 'Password' },
  adminSignIn: { ar: 'تسجيل الدخول', en: 'Sign in' },
  adminSigningIn: { ar: 'جاري الدخول…', en: 'Signing in…' },
  adminLogout: { ar: 'تسجيل الخروج', en: 'Sign out' },
  adminDashboard: { ar: 'لوحة التحكم', en: 'Dashboard' },
  adminViewStore: { ar: 'عرض المتجر', en: 'View store' },
  tabOrders: { ar: 'الطلبات', en: 'Orders' },
  tabProducts: { ar: 'المنتجات', en: 'Products' },
  tabCategories: { ar: 'الفئات', en: 'Categories' },
  tabAccount: { ar: 'الحساب', en: 'Account' },
  statOrders: { ar: 'إجمالي الطلبات', en: 'Orders' },
  statRevenue: { ar: 'إجمالي الإيرادات', en: 'Revenue' },
  statPending: { ar: 'قيد المراجعة', en: 'Pending' },
  statDelivered: { ar: 'تم التسليم', en: 'Delivered' },
  newOrdersBanner: {
    ar: '{n} طلب جديد منذ فتح هذه الصفحة',
    en: '{n} new orders since you opened this page',
  },
  refresh: { ar: 'تحديث', en: 'Refresh' },
  searchOrders: {
    ar: 'ابحث بالاسم أو الهاتف أو رقم الطلب',
    en: 'Search name, phone or order number',
  },
  allStatuses: { ar: 'كل الحالات', en: 'All statuses' },
  statusPending: { ar: 'قيد المراجعة', en: 'Pending' },
  statusConfirmed: { ar: 'مؤكد', en: 'Confirmed' },
  statusShipped: { ar: 'تم الشحن', en: 'Shipped' },
  statusDelivered: { ar: 'تم التسليم', en: 'Delivered' },
  statusCancelled: { ar: 'ملغي', en: 'Cancelled' },
  orderContents: { ar: 'محتويات الطلب', en: 'Order contents' },
  customer: { ar: 'العميل', en: 'Customer' },
  placedAt: { ar: 'تاريخ الطلب', en: 'Placed on' },
  showDetails: { ar: 'عرض التفاصيل', en: 'Show details' },
  hideDetails: { ar: 'إخفاء التفاصيل', en: 'Hide details' },
  noOrdersTitle: { ar: 'لا طلبات بعد', en: 'No orders yet' },
  noOrdersBody: {
    ar: 'ستظهر الطلبات هنا فور وصولها.',
    en: 'Orders appear here as soon as they arrive.',
  },
  noSearchResults: { ar: 'لا طلبات مطابقة', en: 'No matching orders' },
  updateStatus: { ar: 'تحديث الحالة', en: 'Update status' },
  newProduct: { ar: 'منتج جديد', en: 'New product' },
  editProductTitle: { ar: 'تعديل المنتج', en: 'Edit product' },
  createProductTitle: { ar: 'إضافة منتج', en: 'Add a product' },
  confirmDeleteProduct: {
    ar: 'سيُحذف المنتج بصوره ومقاساته نهائياً. هل تريد المتابعة؟',
    en: 'This deletes the product with its images and variants permanently. Continue?',
  },
  confirmDelete: { ar: 'نعم، احذف', en: 'Yes, delete' },
  cancel: { ar: 'إلغاء', en: 'Cancel' },
  save: { ar: 'حفظ', en: 'Save' },
  saving: { ar: 'جاري الحفظ…', en: 'Saving…' },
  saved: { ar: 'تم الحفظ', en: 'Saved' },
  nameAr: { ar: 'الاسم بالعربية', en: 'Name (Arabic)' },
  nameEn: { ar: 'الاسم بالإنجليزية', en: 'Name (English)' },
  slug: { ar: 'الرابط المختصر', en: 'Slug' },
  slugHint: {
    ar: 'حروف إنجليزية صغيرة وأرقام وشرطات فقط.',
    en: 'Lowercase Latin letters, numbers and dashes only.',
  },
  descriptionAr: { ar: 'الوصف بالعربية', en: 'Description (Arabic)' },
  descriptionEn: { ar: 'الوصف بالإنجليزية', en: 'Description (English)' },
  basePrice: { ar: 'السعر', en: 'Price' },
  discountPrice: { ar: 'سعر التخفيض', en: 'Sale price' },
  onSale: { ar: 'ضمن التخفيضات', en: 'On sale' },
  featured: { ar: 'منتج مميز', en: 'Featured' },
  active: { ar: 'ظاهر في المتجر', en: 'Visible in the store' },
  section: { ar: 'القسم', en: 'Section' },
  sectionMen: { ar: 'رجالي', en: 'Men' },
  sectionWomen: { ar: 'نسائي', en: 'Women' },
  sectionUnisex: { ar: 'للجنسين', en: 'Unisex' },
  category: { ar: 'الفئة', en: 'Category' },
  chooseCategory: { ar: 'اختر فئة', en: 'Choose a category' },
  images: { ar: 'الصور', en: 'Images' },
  uploadImage: { ar: 'رفع صورة', en: 'Upload image' },
  uploading: { ar: 'جاري الرفع…', en: 'Uploading…' },
  imagePrimary: { ar: 'رئيسية', en: 'Primary' },
  imageAlt: { ar: 'وصف الصورة', en: 'Image description' },
  noImages: { ar: 'لا صور لهذا المنتج بعد.', en: 'This product has no images yet.' },
  variants: { ar: 'المقاسات والألوان', en: 'Sizes and colours' },
  addVariant: { ar: 'إضافة مقاس أو لون', en: 'Add a size or colour' },
  variantSku: { ar: 'رمز المخزون', en: 'SKU' },
  variantExtra: { ar: 'فرق السعر', en: 'Extra price' },
  variantStock: { ar: 'الكمية في المخزون', en: 'Stock' },
  noVariants: {
    ar: 'لا مقاسات لهذا المنتج بعد. بدون مقاسات يُطلب المنتج مباشرة.',
    en: 'No variants yet. Without variants the product is ordered directly.',
  },
  newCategory: { ar: 'فئة جديدة', en: 'New category' },
  edit: { ar: 'تعديل', en: 'Edit' },
  delete: { ar: 'حذف', en: 'Delete' },
  colorCode: { ar: 'كود اللون', en: 'Colour code' },
  sortOrder: { ar: 'ترتيب العرض', en: 'Display order' },
  deleteImage: { ar: 'حذف الصورة', en: 'Delete image' },
  noProducts: { ar: 'لا منتجات بعد', en: 'No products yet' },
  noProductsBody: {
    ar: 'أضف أول منتج ليظهر في المتجر.',
    en: 'Add your first product to publish it in the store.',
  },
  noCategories: { ar: 'لا فئات بعد', en: 'No categories yet' },
  noCategoriesBody: {
    ar: 'أنشئ قسم رجالي ونسائي لتبدأ.',
    en: 'Create the men and women categories to begin.',
  },
  parentCategory: { ar: 'الفئة الأب', en: 'Parent category' },
  noParent: { ar: 'بدون فئة أب', en: 'No parent' },
  confirmDeleteCategory: {
    ar: 'إن كانت الفئة تحتوي منتجات فلن تُحذف. هل تريد المتابعة؟',
    en: 'Categories that still hold products cannot be deleted. Continue?',
  },
  accountTitle: { ar: 'حساب المدير', en: 'Admin account' },
  accountSignedInAs: { ar: 'مسجل الدخول باسم', en: 'Signed in as' },
  changePassword: { ar: 'تغيير كلمة المرور', en: 'Change password' },
  oldPassword: { ar: 'كلمة المرور الحالية', en: 'Current password' },
  newPassword: { ar: 'كلمة المرور الجديدة', en: 'New password' },
  updatePassword: { ar: 'تحديث كلمة المرور', en: 'Update password' },
  passwordUpdated: { ar: 'تم تحديث كلمة المرور', en: 'Password updated' },
  memberSince: { ar: 'حساب مُنشأ في', en: 'Account created' },

  /* --- shared states --- */
  loading: { ar: 'جاري التحميل…', en: 'Loading…' },
  loadFailedTitle: { ar: 'تعذّر تحميل البيانات', en: "We couldn't load this" },
  retry: { ar: 'إعادة المحاولة', en: 'Try again' },
  close: { ar: 'إغلاق', en: 'Close' },
  skipToContent: { ar: 'تجاوز إلى المحتوى', en: 'Skip to content' },
  currency: { ar: 'د.ج', en: 'DA' },
};

/** Look up a phrase, optionally filling {placeholders}. */
export function translate(lang, key, vars) {
  const entry = dict[key];
  let text = entry ? entry[lang] ?? entry.en : key;
  if (vars) {
    Object.entries(vars).forEach(([name, value]) => {
      text = text.replaceAll(`{${name}}`, String(value));
    });
  }
  return text;
}

const numberFormat = (lang) =>
  new Intl.NumberFormat(lang === 'ar' ? 'ar-DZ-u-nu-latn' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

/** "45000.00" (a FastAPI Decimal string) -> "45,000 د.ج" / "45,000 DA". */
export function formatPrice(value, lang) {
  const amount = Number(value ?? 0);
  const safe = Number.isFinite(amount) ? amount : 0;
  return `${numberFormat(lang).format(safe)} ${translate(lang, 'currency')}`;
}

export const formatNumber = (value, lang) => numberFormat(lang).format(Number(value) || 0);

/** Pick the language-appropriate name/description field from an API record. */
export function pickLang(record, field, lang) {
  if (!record) return '';
  const primary = record[`${field}_${lang}`];
  const other = record[`${field}_${lang === 'ar' ? 'en' : 'ar'}`];
  return primary || other || '';
}

export function formatDate(value, lang) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-DZ' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default dict;
