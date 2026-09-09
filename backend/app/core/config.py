import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "BLACK ELEGANCE API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/black_elegance_db"
    )

    # JWT & Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "black_elegance_secret_super_key_jwt_2026_luxury")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # Initial Admin Seed
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@blackelegance.com")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "AdminSecurePass123!")
    ADMIN_NAME: str = os.getenv("ADMIN_NAME", "Black Elegance Admin")

    # SMTP Notifications
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    ADMIN_NOTIFICATION_EMAIL: str = os.getenv("ADMIN_NOTIFICATION_EMAIL", "admin@blackelegance.com")
    EMAILS_FROM_EMAIL: str = os.getenv("EMAILS_FROM_EMAIL", "notifications@blackelegance.com")
    EMAILS_FROM_NAME: str = os.getenv("EMAILS_FROM_NAME", "BLACK ELEGANCE")

    # CORS
    CORS_ORIGINS: Union[List[str], str] = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:5173,http://localhost:80"
    )

    # File Uploads Directory
    STATIC_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "static"))
    UPLOAD_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "static", "uploads"))

    @property
    def cors_origins_list(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
