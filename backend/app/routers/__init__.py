from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.categories import router as categories_router
from app.routers.products import router as products_router
from app.routers.images import router as images_router
from app.routers.orders import router as orders_router
from app.routers.comments import router as comments_router

__all__ = [
    "auth_router",
    "users_router",
    "categories_router",
    "products_router",
    "images_router",
    "orders_router",
    "comments_router"
]
