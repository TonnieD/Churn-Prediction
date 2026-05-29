# backend/app/dependencies.py
from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader
from app.config import settings
import os

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def validate_api_key(api_key: str = Security(api_key_header)):
    # Temporary debug — remove after fixing
    print(f"[DEBUG] Received API key: '{api_key}'")
    print(f"[DEBUG] Expected API key: '{settings.API_KEY}'")
    print(f"[DEBUG] Raw env API_KEY: '{os.environ.get('API_KEY', 'NOT_FOUND')}'")
    print(f"[DEBUG] Keys match: {api_key == settings.API_KEY}")

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": "API Key is missing", "code": "API_KEY_MISSING"}
        )
    if api_key != settings.API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": "Invalid API Key", "code": "INVALID_API_KEY"}
        )
    return api_key