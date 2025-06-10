import pickle
import streamlit as st
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

# Load trained model and scaler
with open('best_model.pkl', 'rb') as file:
    model = pickle.load(file)

# Title
st.title("Telecom Customer Churn Prediction")

# User input form
st.sidebar.header("Customer Information")

def user_input_features():
    # Numeric features
    tenure = st.sidebar.slider('Tenure (Months)', 0, 72, 12)
    MonthlyCharges = st.sidebar.slider('Monthly Charges ($)', 0.0, 150.0, 70.0)
    
    # Categorical features (encoded as dummy variables)
    MultipleLines = st.sidebar.selectbox('Multiple Lines', ['No', 'Yes', 'No phone service'])
    InternetService = st.sidebar.selectbox('Internet Service', ['DSL', 'Fiber optic', 'No'])
    StreamingTV = st.sidebar.selectbox('TV Streaming', ['No', 'Yes', 'No internet service'])
    StreamingMovies = st.sidebar.selectbox('Movie Streaming', ['No', 'Yes', 'No internet service'])
    Contract = st.sidebar.selectbox('Contract Type', ['Month-to-month', 'One year', 'Two year'])
    
    # Create dummy variables to match model training
    data = {
        'tenure': tenure,
        'MonthlyCharges': MonthlyCharges,
        'MultipleLines_No': 1 if MultipleLines == 'No' else 0,
        'MultipleLines_Yes': 1 if MultipleLines == 'Yes' else 0,
        'InternetService_DSL': 1 if InternetService == 'DSL' else 0,
        'InternetService_Fiber optic': 1 if InternetService == 'Fiber optic' else 0,
        'StreamingTV_No': 1 if StreamingTV == 'No' else 0,
        'StreamingTV_Yes': 1 if StreamingTV == 'Yes' else 0,
        'StreamingTV_No internet service': 1 if StreamingTV == 'No internet service' else 0,
        'StreamingMovies_No': 1 if StreamingMovies == 'No' else 0,
        'StreamingMovies_Yes': 1 if StreamingMovies == 'Yes' else 0,
        'StreamingMovies_No internet service': 1 if StreamingMovies == 'No internet service' else 0,
        'Contract_Month-to-month': 1 if Contract == 'Month-to-month' else 0,
        'Contract_One year': 1 if Contract == 'One year' else 0,
        'Contract_Two year': 1 if Contract == 'Two year' else 0
    }
    
    # Create DataFrame with all possible columns
    features = pd.DataFrame(data, index=[0])
    
    # Select only the top features your model uses
    top_features = [
        'tenure',
        'MonthlyCharges',
        'MultipleLines_Yes',
        'InternetService_Fiber optic',
        'StreamingTV_No internet service',
        'StreamingTV_Yes',
        'StreamingMovies_No internet service',
        'StreamingMovies_Yes',
        'Contract_One year',
        'Contract_Two year'
    ]
    
    return features[top_features]

# Collect input
input_df = user_input_features()

# Display input
st.subheader('Customer Input')
st.write(input_df)

# Load scaler (you'll need to save this when training)
# scaler = pickle.load(open('scaler.pkl', 'rb'))
# input_scaled = scaler.transform(input_df)

# Load the pre-fitted scaler (add this near model loading)
with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

# Then modify the scaling line to:
input_scaled = scaler.transform(input_df)

# After loading scaler but before predictions
st.sidebar.subheader("Debug Info (Optional)")
if st.sidebar.checkbox("Show scaler stats"):  # Hideable debug info
    st.sidebar.code(
        f"Scaler mean: {scaler.mean_}\n"
        f"Scaler scale: {scaler.scale_}\n"
        f"Model features: {model.feature_names_in_}"
    )

# Prediction
prediction = model.predict(input_scaled)[0]
prediction_proba = model.predict_proba(input_scaled)[0][1]

# Output
st.subheader('Prediction')
st.write('Churn' if prediction == 1 else 'Not Churn')

st.subheader('Churn Probability')
st.write(f"{prediction_proba:.2%}")

