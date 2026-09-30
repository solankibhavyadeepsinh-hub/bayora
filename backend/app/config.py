import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Bayora AI Security Laboratory"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "bayora-super-secret-jwt-key-for-isolated-evaluations-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database - Default to SQLite for zero-config local run, supports Postgres in Docker/K8s
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite+aiosqlite:///./bayora.db"
    )
    
    # Redis for live pub/sub and distributed rate-limiting
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Zone configuration
    ZONE_RED: str = "red_zone"
    ZONE_BLUE: str = "blue_zone"
    ZONE_LLM: str = "llm_zone"
    ZONE_CONTROL: str = "control_plane"
    ZONE_AUDIT: str = "audit_zone"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
