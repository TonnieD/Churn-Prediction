# backend/app/utils/preprocess.py
import pandas as pd
import numpy as np
from app.schemas import PredictionRequest

def preprocess_input(request: PredictionRequest, feature_names: list, scaler) -> np.ndarray:
    # 1. Convert request to dictionary with exact expected casing/names
    input_data = {
        "tenure": request.tenure,
        "MonthlyCharges": request.MonthlyCharges,
        "MultipleLines": request.MultipleLines,
        "InternetService": request.InternetService,
        "StreamingTV": request.StreamingTV,
        "StreamingMovies": request.StreamingMovies,
        "Contract": request.Contract
    }
    
    # 2. Convert to DataFrame
    input_df = pd.DataFrame([input_data])
    
    # 3. One-hot encoding
    input_df = pd.get_dummies(input_df)
    
    # 4. Ensure all expected dummy columns exist with value 0
    for col in feature_names:
        if col not in input_df.columns:
            input_df[col] = 0
            
    # 5. Keep only top 10 features in correct order
    input_df = input_df[feature_names]
    
    # Ensure all features are floating-point types for consistency
    input_df = input_df.astype(float)
    
    # 6. Scale the features using the loaded scaler
    input_scaled = scaler.transform(input_df)
    
    return input_scaled
