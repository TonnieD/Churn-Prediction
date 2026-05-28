# backend/app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    MODEL_PATH: str = "app/models/best_model.pkl"
    SCALER_PATH: str = "app/models/scaler.pkl"
    FEATURES_PATH: str = "app/models/features_top10.pkl"
    API_KEY: str = "supersecretapikey123"
    ALLOWED_ORIGINS: str = "http://localhost:3000"
    ENVIRONMENT: str = "development"
    PORT: int = 8000

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
