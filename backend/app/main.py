# backend/app/main.py
import os
import pickle
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas import PredictionRequest, PredictionResponse
from app.dependencies import validate_api_key
from app.utils.preprocess import preprocess_input

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Retrieve paths from configuration settings
    model_path = settings.MODEL_PATH
    scaler_path = settings.SCALER_PATH
    features_path = settings.FEATURES_PATH

    # Check if files exist at startup
    if not os.path.exists(model_path):
        raise RuntimeError(f"Model file not found at {model_path}")
    if not os.path.exists(scaler_path):
        raise RuntimeError(f"Scaler file not found at {scaler_path}")
    if not os.path.exists(features_path):
        raise RuntimeError(f"Features file not found at {features_path}")

    # Load artifacts into app.state
    with open(model_path, "rb") as f:
        app.state.model = pickle.load(f)
    with open(scaler_path, "rb") as f:
        app.state.scaler = pickle.load(f)
    with open(features_path, "rb") as f:
        app.state.feature_names = pickle.load(f)

    yield

    # Clean up at shutdown
    app.state.model = None
    app.state.scaler = None
    app.state.feature_names = None

app = FastAPI(
    title="Telecom Churn Prediction Backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware configuration
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
        "model_loaded": hasattr(app.state, "model") and app.state.model is not None
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest, api_key: str = Depends(validate_api_key)):
    try:
        # Check if the model is loaded
        if not hasattr(app.state, "model") or app.state.model is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail={"error": "Model is not loaded on the server", "code": "MODEL_NOT_LOADED"}
            )
        
        # Preprocessing block
        try:
            input_scaled = preprocess_input(request, app.state.feature_names, app.state.scaler)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail={"error": f"Preprocessing failed: {str(e)}", "code": "PREPROCESSING_ERROR"}
            )

        # Inference block
        try:
            prediction = int(app.state.model.predict(input_scaled)[0])
            proba = float(app.state.model.predict_proba(input_scaled)[0][1])
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={"error": f"Model inference failed: {str(e)}", "code": "INFERENCE_ERROR"}
            )

        # Build verdict response
        verdict = "Customer is likely to churn" if prediction == 1 else "Customer is unlikely to churn"

        return PredictionResponse(
            prediction=prediction,
            probability=proba,
            verdict=verdict
        )
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": f"An unexpected error occurred: {str(e)}", "code": "UNEXPECTED_ERROR"}
        )
