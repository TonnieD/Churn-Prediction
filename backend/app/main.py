# backend/app/main.py
import os
import pickle
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas import PredictionRequest, PredictionResponse
from app.dependencies import validate_api_key
from app.utils.preprocess import preprocess_input

# Resolves to backend/app/ regardless of working directory
APP_DIR = os.path.dirname(os.path.abspath(__file__))

def _resolve(relative_path: str) -> str:
    """Convert config-relative path to absolute, anchored to this file's directory."""
    return os.path.join(APP_DIR, relative_path)

# Module-level cache — survives within a warm container instance
_model = None
_scaler = None
_feature_names = None

def load_artifacts():
    global _model, _scaler, _feature_names
    if _model is not None:
        return  # Already loaded in this container instance

    model_path   = _resolve(settings.MODEL_PATH)
    scaler_path  = _resolve(settings.SCALER_PATH)
    features_path = _resolve(settings.FEATURES_PATH)

    for path, label in [
        (model_path,    "Model"),
        (scaler_path,   "Scaler"),
        (features_path, "Features"),
    ]:
        if not os.path.exists(path):
            raise RuntimeError(f"{label} file not found at: {path}")

    with open(model_path, "rb") as f:
        _model = pickle.load(f)
    with open(scaler_path, "rb") as f:
        _scaler = pickle.load(f)
    with open(features_path, "rb") as f:
        _feature_names = pickle.load(f)


app = FastAPI(
    title="Telecom Churn Prediction Backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {
        "service": "Telecom Churn Prediction API",
        "version": "1.0.0",
        "status": "healthy",
        "model_loaded": _model is not None,
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest, api_key: str = Depends(validate_api_key)):
    try:
        load_artifacts()
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"error": str(e), "code": "ARTIFACTS_NOT_FOUND"},
        )

    try:
        input_scaled = preprocess_input(request, _feature_names, _scaler)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": f"Preprocessing failed: {str(e)}", "code": "PREPROCESSING_ERROR"},
        )

    try:
        prediction = int(_model.predict(input_scaled)[0])
        proba = float(_model.predict_proba(input_scaled)[0][1])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": f"Inference failed: {str(e)}", "code": "INFERENCE_ERROR"},
        )

    verdict = "Customer is likely to churn" if prediction == 1 else "Customer is unlikely to churn"
    return PredictionResponse(prediction=prediction, probability=proba, verdict=verdict)