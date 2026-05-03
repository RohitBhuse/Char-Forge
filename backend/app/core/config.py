import os
from typing import Optional
from pydantic import PostgresDsn, field_validator, ValidationInfo
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Character Forge App")
    BACKEND_CORS_ORIGINS: list[str] = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
    
    # Database Settings
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "char_forge_db")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", 5433))
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], info: ValidationInfo) -> str:
        if isinstance(v, str) and v:
            return v
        
        # Build from individual components if DATABASE_URL is not provided
        user = info.data.get("POSTGRES_USER")
        password = info.data.get("POSTGRES_PASSWORD")
        host = info.data.get("POSTGRES_SERVER")
        port = info.data.get("POSTGRES_PORT")
        db = info.data.get("POSTGRES_DB")
        
        if not all([user, host, db]):
            # If we don't have enough info, return whatever v was (likely None)
            # Pydantic will handle the validation error if DATABASE_URL is required
            return v
            
        return str(PostgresDsn.build(
            scheme="postgresql",
            username=user,
            password=password,
            host=host,
            port=port,
            path=f"{db or ''}",
        ))

    # JWT Settings
    JWT_SECRET_TOKEN: str = os.getenv("JWT_SECRET_TOKEN")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))
    
    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore"
    )

settings = Settings()

