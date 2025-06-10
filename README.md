# Telecom Customer Churn Prediction

## 1. Project Overview
This project explores customer churn in a telecom company. The goal is to analyze customer behavior, identify patterns associated with churn, and build a model that predicts which customers are likely to leave.

---

## 2. Business Problem

**As a stakeholder:**  
You're a Customer Retention Manager at a telecom company. You've noticed a rise in customer churn over the last quarter. The company wants to reduce churn by identifying at-risk customers early and intervening with retention strategies.

### Objectives:
- Understand which factors most influence churn
- Build a model to predict the likelihood of churn
- Provide actionable recommendations to reduce churn

---

## 3. Dataset Description

**Source:** [Kaggle - Telco Customer Churn](https://www.kaggle.com/datasets/blastchar/telco-customer-churn)

The dataset contains 21 columns including:
- Customer demographics
- Account information
- Services subscribed
- Monthly charges
- Whether they churned (`Churn`)

### Key Features

| Column             | Description |
|--------------------|-------------|
| `customerID`        | Unique customer identifier |
| `gender`            | Customer's gender |
| `SeniorCitizen`     | Whether the customer is a senior (1) or not (0) |
| `Partner`           | Has a partner (Yes/No) |
| `Dependents`        | Has dependents (Yes/No) |
| `tenure`            | Months with the company |
| `PhoneService`      | Has phone service (Yes/No) |
| `MultipleLines`     | Has multiple phone lines |
| `InternetService`   | DSL, Fiber optic, or None |
| `OnlineSecurity`, `OnlineBackup`, `DeviceProtection`, `TechSupport` | Add-on services |
| `StreamingTV`, `StreamingMovies` | Streaming services subscribed |
| `Contract`          | Contract type (Month-to-month, One year, Two year) |
| `PaperlessBilling`  | Receives paperless billing (Yes/No) |
| `PaymentMethod`     | Method of payment |
| `MonthlyCharges`    | Monthly bill amount |
| `TotalCharges`      | Total bill amount |
| `Churn`             | Target: whether the customer left (Yes/No) |

## 📊 Project Report / Presentation Structure

### 1. Introduction
- Brief overview of the telecom industry and churn
- Importance of customer retention in a competitive market
- High-level summary of the dataset (e.g., 7,043 customers, 21 features)

### 2. Business Problem & Objectives
- Stakeholder perspective: rising churn despite competitive offerings
- Current churn rate (26.5%) is unsustainable
- Project Objectives:
  - Understand drivers of churn
  - Predict customers at risk
  - Recommend retention strategies

### 3. Data Analysis
- Dataset overview and cleaning process
- Exploratory Data Analysis (EDA) insights
  - Demographic trends
  - Service usage differences
  - Contract/payment patterns
- Visual comparisons between churned and retained customers

### 4. Modeling & Results
- Model selection and why (e.g., Logistic Regression, Random Forest)
- Training & testing process
- Model performance (Accuracy, Precision, Recall, F1-score, ROC-AUC)
- Most important features driving churn

### 5. Key Findings & Insights
- Summary of what influences churn the most
- Any surprising or actionable patterns found
- High-risk customer profiles

### 6. Business Recommendations
- Strategies to reduce churn (e.g., loyalty programs, service bundling)
- Suggested improvements to customer experience
- How to use the model in operations

### 7. Conclusion
- Final recap of the problem, solution, and impact
- Next steps or possible project extensions (e.g., real-time churn alerts)

### 8. Build a Streamlit Demo
- Build a demo app using streamlit
- Use the demo app to predict customers who are at risk to churn

