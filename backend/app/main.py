import os
import logging
from contextlib import asynccontextmanager
from decimal import Decimal
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.models.product_image import ProductImage
from app.routers import (
    auth_router,
    users_router,
    categories_router,
    products_router,
    images_router,
    orders_router,
    comments_router
)

logger = logging.getLogger("uvicorn.error")

def seed_initial_data(db: Session):
    """Seed initial administrator and default categories/products if database is empty."""
    try:
        # 1. Seed Admin
        admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin:
            logger.info(f"Seeding default admin: {settings.ADMIN_EMAIL}")
            admin_user = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                full_name=settings.ADMIN_NAME,
                is_active=True
            )
            db.add(admin_user)
            db.commit()

        # 2. Seed Hierarchical Categories (Men & Women roots)
        men_cat = db.query(Category).filter(Category.slug == "men").first()
        if not men_cat:
            logger.info("Seeding root categories (Men & Women)...")
            men_cat = Category(
                name_ar="رجالي",
                name_en="Men",
                slug="men",
                description_ar="تشكيلة الأزياء الرجالية الفاخرة",
                description_en="Luxury Men's Collection",
                parent_id=None
            )
            women_cat = Category(
                name_ar="نسائي",
                name_en="Women",
                slug="women",
                description_ar="تشكيلة الأزياء النسائية الراقية",
                description_en="Luxury Women's Collection",
                parent_id=None
            )
            db.add_all([men_cat, women_cat])
            db.flush()

            # Subcategories under Men
            men_suits = Category(name_ar="بدل رسمية", name_en="Suits", slug="men-suits", parent_id=men_cat.id)
            men_shirts = Category(name_ar="قمصان فاخرة", name_en="Shirts", slug="men-shirts", parent_id=men_cat.id)
            men_shoes = Category(name_ar="أحذية جلدية", name_en="Shoes", slug="men-shoes", parent_id=men_cat.id)
            
            # Subcategories under Women
            women_dresses = Category(name_ar="فساتين سهرة", name_en="Dresses", slug="women-dresses", parent_id=women_cat.id)
            women_blazers = Category(name_ar="سترات رسمية", name_en="Blazers", slug="women-blazers", parent_id=women_cat.id)
            women_bags = Category(name_ar="حقائب يد", name_en="Handbags", slug="women-bags", parent_id=women_cat.id)

            db.add_all([men_suits, men_shirts, men_shoes, women_dresses, women_blazers, women_bags])
            db.commit()

        # 3. Seed Sample Products if empty
        if db.query(Product).count() == 0:
            logger.info("Seeding initial luxury showcase products...")
            p1 = Product(
                name_ar="بدلة توكسيدو مخملية سوداء",
                name_en="Midnight Black Velvet Tuxedo",
                slug="midnight-black-velvet-tuxedo",
                description_ar="بدلة سهرة راقية مصنوعة يدوياً من أفخر أنواع المخمل الإيطالي مع لمسات حريرية.",
                description_en="Handcrafted luxury evening tuxedo tailored from premium Italian velvet with satin lapels.",
                base_price=Decimal("45000.00"),
                discount_price=Decimal("38000.00"),
                is_on_sale=True,
                is_featured=True,
                gender_section="men",
                category_id=men_cat.id
            )
            p2 = Product(
                name_ar="فستان سهرة كلاسيكي حريري",
                name_en="Obsidian Silk Evening Gown",
                slug="obsidian-silk-evening-gown",
                description_ar="فستان سهرة طويل من الحرير الطبيعي الأسود بتطريز أنيق يجسد الأناقة الخالدة.",
                description_en="Full-length pure black silk evening gown with subtle hand-embroidery defining timeless elegance.",
                base_price=Decimal("52000.00"),
                discount_price=None,
                is_on_sale=False,
                is_featured=True,
                gender_section="women",
                category_id=women_cat.id
            )
            p3 = Product(
                name_ar="قمصلة جلدية فاخرة باللون الأسود الملكي",
                name_en="Royal Leather Bomber Jacket",
                slug="royal-leather-bomber-jacket",
                description_ar="سترة جلد طبيعي ناعمة الملمس مع بطانة حريرية وإكسسوارات معدنية داكنة.",
                description_en="Supple genuine calfskin leather jacket lined with silk and finished with matte dark hardware.",
                base_price=Decimal("32000.00"),
                discount_price=Decimal("27500.00"),
                is_on_sale=True,
                is_featured=True,
                gender_section="men",
                category_id=men_cat.id
            )
            p4 = Product(
                name_ar="بليزر كوتور عصري مطرز",
                name_en="Couture Tailored Blazer",
                slug="couture-tailored-blazer",
                description_ar="بليزر نسائي بتصميم هندسي جريء وأزرار ذهبية عتيقة لإطلالة واثقة.",
                description_en="Architectural silhouette women's blazer with antique gold buttons for empowering presence.",
                base_price=Decimal("29000.00"),
                discount_price=None,
                is_on_sale=False,
                is_featured=True,
                gender_section="women",
                category_id=women_cat.id
            )
            db.add_all([p1, p2, p3, p4])
            db.flush()

            # Add variants & images
            for p in [p1, p3]:
                db.add(ProductVariant(product_id=p.id, size="M", color="Black", color_code="#111111", stock_quantity=15))
                db.add(ProductVariant(product_id=p.id, size="L", color="Black", color_code="#111111", stock_quantity=20))
                db.add(ProductVariant(product_id=p.id, size="XL", color="Black", color_code="#111111", stock_quantity=10))
                db.add(ProductImage(product_id=p.id, image_url="/assets/logo.png", is_primary=True, sort_order=0))

            for p in [p2, p4]:
                db.add(ProductVariant(product_id=p.id, size="S", color="Black", color_code="#0d0d0d", stock_quantity=12))
                db.add(ProductVariant(product_id=p.id, size="M", color="Black", color_code="#0d0d0d", stock_quantity=18))
                db.add(ProductImage(product_id=p.id, image_url="/assets/logo.png", is_primary=True, sort_order=0))

            db.commit()

    except Exception as e:
        db.rollback()
        logger.warning(f"Warning during seed: {str(e)}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure static upload folders exist
    os.makedirs(os.path.join(settings.UPLOAD_DIR, "avatars"), exist_ok=True)
    os.makedirs(os.path.join(settings.UPLOAD_DIR, "products"), exist_ok=True)

    # Initialize tables
    Base.metadata.create_all(bind=engine)
    
    # Run Seeding
    db = SessionLocal()
    seed_initial_data(db)

    yield

app = FastAPI(
    title="BLACK ELEGANCE E-Commerce API",
    description="""
    Backend API for BLACK ELEGANCE luxury fashion store.
    Features:
    - Guest Checkout (No customer registration required)
    - Admin Authentication via JWT (Single static admin)
    - Hierarchical Categories (Men & Women sections)
    - Full Product, Variant, and Image Management
    - Order Processing & SMTP Store Owner Email Alerts
    - Bilingual Content Support (Arabic & English)
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files Mount
if os.path.exists(settings.STATIC_DIR):
    app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")

# Mount Routers under API_V1_STR
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(categories_router, prefix=settings.API_V1_STR)
app.include_router(products_router, prefix=settings.API_V1_STR)
app.include_router(images_router, prefix=settings.API_V1_STR)
app.include_router(orders_router, prefix=settings.API_V1_STR)
app.include_router(comments_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "brand": "BLACK ELEGANCE",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
