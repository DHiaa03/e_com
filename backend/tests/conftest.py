import os
import pytest
from decimal import Decimal
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use in-memory SQLite for rapid, isolated testing
os.environ["DATABASE_URL"] = "sqlite:///./test_black_elegance.db"
os.environ["SECRET_KEY"] = "test_secret_key_jwt_black_elegance"

from app.core.database import Base, get_db
from app.core.config import settings
from app.core.security import get_password_hash, create_access_token
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_black_elegance.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Create test admin
    admin = db.query(User).filter(User.email == "admin@test.com").first()
    if not admin:
        admin = User(
            email="admin@test.com",
            hashed_password=get_password_hash("TestAdminPass123!"),
            full_name="Test Admin",
            is_active=True
        )
        db.add(admin)
        db.commit()

    # Create root categories
    cat_men = Category(name_ar="رجالي", name_en="Men", slug="test-men")
    cat_women = Category(name_ar="نسائي", name_en="Women", slug="test-women")
    db.add_all([cat_men, cat_women])
    db.commit()

    # Create test product
    prod = Product(
        name_ar="بدلة اختبار",
        name_en="Test Tuxedo",
        slug="test-tuxedo",
        base_price=Decimal("15000.00"),
        gender_section="men",
        category_id=cat_men.id,
        is_active=True
    )
    db.add(prod)
    db.commit()

    db.close()
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_black_elegance.db"):
        os.remove("./test_black_elegance.db")

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def admin_token():
    return create_access_token(subject="admin@test.com")

@pytest.fixture
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}
