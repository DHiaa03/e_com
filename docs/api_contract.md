# وثيقة عقد واجهات برمجة التطبيقات (API Contract) — BLACK ELEGANCE

**الإصدار:** 1.0.0  
**المسار الأساسي:** `/api/v1`  
**طريقة التوثيق الحي:** `/docs` (Swagger UI) و `/redoc`

---

## 1. المصادقة (Authentication — خاص بالأدمن فقط)

> **قاعدة:** لا يوجد تسجيل أو تسجيل دخول للعملاء إطلاقاً (Guest Checkout). مسارات المصادقة مخصصة لمدير المتجر فقط.

### `POST /api/v1/auth/login`
- **الوصف:** تسجيل دخول الأدمن واستخراج رمز JWT.
- **Request Body (JSON أو Form Data):**
```json
{
  "email": "admin@blackelegance.com",
  "password": "AdminSecurePass123!"
}
```
- **Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

### `GET /api/v1/auth/me`
- **الهيدر:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "id": 1,
  "email": "admin@blackelegance.com",
  "full_name": "Black Elegance Admin",
  "is_active": true,
  "created_at": "2026-09-09T18:00:00Z"
}
```

---

## 2. الفئات والتصنيفات الهرمية (Categories)

### `GET /api/v1/categories?root_only=true`
- **الوصف:** استرجاع التصنيفات الأساسية (رجالي / نسائي) مع كافة الفئات الفرعية المندرجة تحتها.
- **Response (200 OK):**
```json
[
  {
    "id": 1,
    "name_ar": "رجالي",
    "name_en": "Men",
    "slug": "men",
    "description_ar": "تشكيلة الأزياء الرجالية الفاخرة",
    "description_en": "Luxury Men's Collection",
    "parent_id": null,
    "is_active": true,
    "created_at": "2026-09-09T18:00:00Z",
    "subcategories": [
      {
        "id": 3,
        "name_ar": "بدل رسمية",
        "name_en": "Suits",
        "slug": "men-suits",
        "parent_id": 1,
        "is_active": true
      }
    ]
  }
]
```

### `POST /api/v1/categories` (Admin)
- **الهيدر:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "name_ar": "أحذية فاخرة",
  "name_en": "Luxury Shoes",
  "slug": "luxury-shoes",
  "description_ar": "أحذية جلدية رسمية",
  "description_en": "Formal leather footwear",
  "parent_id": 1,
  "is_active": true
}
```

---

## 3. كتالوج المنتجات (Products)

### `GET /api/v1/products`
- **Query Params:**
  - `gender_section`: `men` | `women` | `unisex`
  - `category_id`: رقم التصنيف
  - `search`: كلمة البحث (عربي أو إنجليزي)
  - `min_price`: أقل سعر
  - `max_price`: أعلى سعر
  - `is_on_sale`: `true` | `false`
  - `is_featured`: `true` | `false`
  - `sort_by`: `newest` | `price_asc` | `price_desc`
  - `page`: رقم الصفحة (افتراضي 1)
  - `limit`: عدد العناصر (افتراضي 20)
- **Response (200 OK):**
```json
{
  "items": [
    {
      "id": 1,
      "name_ar": "بدلة توكسيدو مخملية سوداء",
      "name_en": "Midnight Black Velvet Tuxedo",
      "slug": "midnight-black-velvet-tuxedo",
      "description_ar": "بدلة سهرة راقية مصنوعة يدوياً...",
      "description_en": "Handcrafted luxury evening tuxedo...",
      "base_price": "45000.00",
      "discount_price": "38000.00",
      "is_on_sale": true,
      "is_featured": true,
      "is_active": true,
      "gender_section": "men",
      "category_id": 1,
      "category": {
        "id": 1,
        "name_ar": "رجالي",
        "name_en": "Men",
        "slug": "men"
      },
      "variants": [
        {
          "id": 1,
          "product_id": 1,
          "size": "L",
          "color": "Black",
          "color_code": "#111111",
          "additional_price": "0.00",
          "stock_quantity": 20,
          "is_active": true
        }
      ],
      "images": [
        {
          "id": 1,
          "product_id": 1,
          "image_url": "/assets/logo.png",
          "is_primary": true,
          "sort_order": 0
        }
      ],
      "created_at": "2026-09-09T18:00:00Z",
      "updated_at": "2026-09-09T18:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

### `GET /api/v1/products/{id_or_slug}`
- **Response (200 OK):** تفاصيل منتج كاملة.

### `POST /api/v1/products` (Admin)
- **الهيدر:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "name_ar": "قميص كلاسيكي حريري",
  "name_en": "Classic Silk Shirt",
  "slug": "classic-silk-shirt",
  "description_ar": "قميص رسمي أسود",
  "description_en": "Formal black shirt",
  "base_price": 12000.00,
  "discount_price": null,
  "is_on_sale": false,
  "is_featured": false,
  "gender_section": "men",
  "category_id": 1,
  "variants": [
    { "size": "M", "color": "Black", "stock_quantity": 10 }
  ]
}
```

---

## 4. رفع صور المنتجات (Product Images)

### `POST /api/v1/images/products/{product_id}` (Admin)
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `file`: ملف الصورة (`.jpg`, `.png`, `.webp`)
  - `is_primary`: `true` | `false`
  - `alt_text`: نص وصفي للصورة
  - `sort_order`: ترتيب العرض

---

## 5. الطلبات وإتمام الشراء (Orders & Guest Checkout)

### `POST /api/v1/orders` (Public / Guest Checkout)
- **الوصف:** إنشاء طلب شراء لزائر دون الحاجة لحساب، وحساب التكاليف بالخادم، وإرسال بريد SMTP فوري لصاحب المتجر.
- **Request Body:**
```json
{
  "customer_name": "أحمد الشريف",
  "phone": "0550123456",
  "email": "customer@example.com",
  "address": "حي النخيل، شارع الأمير سلطان، عمارة 4",
  "city": "الجزائر العاصمة / الرياض",
  "notes": "يرجى الاتصال قبل التوصيل بنصف ساعة",
  "items": [
    {
      "product_id": 1,
      "variant_id": 1,
      "quantity": 1
    }
  ]
}
```
- **Response (201 Created):**
```json
{
  "id": 1,
  "order_number": "BE-A89E12",
  "customer_name": "أحمد الشريف",
  "phone": "0550123456",
  "email": "customer@example.com",
  "address": "حي النخيل، شارع الأمير سلطان...",
  "city": "الجزائر العاصمة",
  "subtotal": "38000.00",
  "shipping_fee": "0.00",
  "total_amount": "38000.00",
  "status": "pending",
  "payment_method": "cash_on_delivery",
  "created_at": "2026-09-09T18:00:00Z",
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "variant_id": 1,
      "product_name": "بدلة توكسيدو مخملية سوداء",
      "variant_details": "Size: L | Color: Black",
      "price": "38000.00",
      "quantity": 1,
      "subtotal": "38000.00"
    }
  ]
}
```

### `GET /api/v1/orders` (Admin)
- **Query Params:** `status_filter`, `search`, `page`, `limit`
- **Response (200 OK):** قائمة الطلبات للمدير.

### `PATCH /api/v1/orders/{id}/status` (Admin)
- **Request Body:**
```json
{
  "status": "confirmed"
}
```
*(الخيارات المتاحة: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`)*

### `GET /api/v1/orders/stats/summary` (Admin)
- **Response (200 OK):** إحصائيات لوحة التحكم (`total_orders`, `total_revenue`, `pending_orders`, `delivered_orders`).

---

## 6. التعليقات والتقييمات (Comments)
- `GET /api/v1/comments` -> Placeholder لطور التوسعة اللاحق.
