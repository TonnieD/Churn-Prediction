# backend/app/schemas.py
from pydantic import BaseModel, Field
from typing import Literal

class PredictionRequest(BaseModel):
    tenure: int = Field(..., ge=0, le=72, description="Months with the company")
    MonthlyCharges: float = Field(..., ge=0.0, le=150.0, description="Monthly bill amount")
    MultipleLines: Literal["No", "Yes"] = Field(..., description="Whether the customer has multiple phone lines")
    InternetService: Literal["DSL", "Fiber optic", "No"] = Field(..., description="Internet service provider type")
    StreamingTV: Literal["No", "Yes", "No internet service"] = Field(..., description="Streaming TV service subscribed")
    StreamingMovies: Literal["No", "Yes", "No internet service"] = Field(..., description="Streaming movies service subscribed")
    Contract: Literal["Month-to-month", "One year", "Two year"] = Field(..., description="Contract duration type")

    model_config = {
        "json_schema_extra": {
            "example": {
                "tenure": 12,
                "MonthlyCharges": 70.0,
                "MultipleLines": "No",
                "InternetService": "Fiber optic",
                "StreamingTV": "Yes",
                "StreamingMovies": "No",
                "Contract": "Month-to-month"
            }
        }
    }

class PredictionResponse(BaseModel):
    prediction: int = Field(..., description="Predicted churn value (1 for churn, 0 for retain)")
    probability: float = Field(..., description="Churn probability/confidence score between 0 and 1")
    verdict: str = Field(..., description="Human-readable verdict message")
