# backend/app/dependencies.py
from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader
from app.config import settings
import os

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def validate_api_key(api_key: str = Security(api_key_header)):

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