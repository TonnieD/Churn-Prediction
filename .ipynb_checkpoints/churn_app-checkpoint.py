import streamlit as st
import pickle
import pandas as pd
import numpy as np

# Load model, scaler, and top 10 features
with open("best_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("features_top10.pkl", "rb") as f:
    feature_names = pickle.load(f)

st.title("📉 Telecom Churn Prediction App")

st.markdown("### Enter Customer Details")

# User input
tenure = st.slider("Tenure (months)", 0, 72, 12)
monthly_charges = st.slider("Monthly Charges", 0, 150, 70)

multiple_lines = st.selectbox("Multiple Lines", ["No", "Yes"])
internet_service = st.selectbox("Internet Service", ["DSL", "Fiber optic", "No"])
streaming_tv = st.selectbox("Streaming TV", ["No", "Yes", "No internet service"])
streaming_movies = st.selectbox("Streaming Movies", ["No", "Yes", "No internet service"])
contract = st.selectbox("Contract Type", ["Month-to-month", "One year", "Two year"])

# Base input
input_data = {
    "tenure": tenure,
    "MonthlyCharges": monthly_charges,
    "MultipleLines": multiple_lines,
    "InternetService": internet_service,
    "StreamingTV": streaming_tv,
    "StreamingMovies": streaming_movies,
    "Contract": contract
}

input_df = pd.DataFrame([input_data])

# One-hot encoding
input_df = pd.get_dummies(input_df)

# Ensure all expected dummy columns exist
for col in feature_names:
    if col not in input_df.columns:
        input_df[col] = 0

# Keep only top 10 features in correct order
input_df = input_df[feature_names]

# Scale
input_scaled = scaler.transform(input_df)

# Predict
prediction = model.predict(input_scaled)[0]
proba = model.predict_proba(input_scaled)[0][1]

# Display result
st.markdown("## 🔍 Prediction Result")
if prediction == 1:
    st.error(f"Customer is **likely to churn** 🔻\n\nProbability: {proba:.2f}")
else:
    st.success(f"Customer is **unlikely to churn** ✅\n\nProbability: {proba:.2f}")
