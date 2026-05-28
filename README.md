# 📉 Telecom Customer Churn Prediction & Analytics Platform
### A Decoupled Enterprise Machine Learning and Interactive Business Intelligence Solution

This project represents the complete end-to-end migration of a legacy monolithic data science app into a modern, decoupled production architecture. It features a high-performance **FastAPI backend** for secure model inference, an interactive **Next.js 14 App Router frontend** built with premium glassmorphic styling, and fully containerized deployment orchestrated via **Docker Compose**.

---

## 👥 Audience Navigation
- [💼 For Business Stakeholders & Non-Technical Readers](#-for-business-stakeholders--non-technical-readers)
  - [The Business Problem & Objectives](#the-business-problem--objectives)
  - [Core Analytical Findings & Churn Drivers](#core-analytical-findings--churn-drivers)
  - [Actionable Strategic Business Recommendations](#actionable-strategic-business-recommendations)
- [🛠️ For Technical Engineers & Data Scientists](#%EF%B8%8F-for-technical-engineers--data-scientists)
  - [Machine Learning & Preprocessing Pipeline](#machine-learning--preprocessing-pipeline)
  - [Decoupled Architecture & Security Protocol](#decoupled-architecture--security-protocol)
  - [Quality Assurance & Automated Test Suites](#quality-assurance--automated-test-suites)
- [🚀 Quick Start & Installation Guide](#-quick-start--installation-guide)

---

## 💼 For Business Stakeholders & Non-Technical Readers

### The Business Problem & Objectives
In the highly saturated telecommunications sector, **acquiring a new customer costs 5x to 7x more than retaining an existing one**. Out of the **7,043 customers** analyzed in this historical cohort, **1,869 have canceled/churned—resulting in a high overall churn rate of 26.5%**. 

This platform serves two vital operational functions:
1. **Interactive Strategic Analytics**: Visualizes Key Performance Indicators (KPIs) and cohort churn behaviors to help executives identify systemic service friction points.
2. **Real-time Churn Risk Predictor**: Empowers customer-facing agents to input user attributes during check-ins, instantly calculating their churn risk probability and generating customized retention offers.

### Core Analytical Findings & Churn Drivers
Exploratory Data Analysis (EDA) and machine learning feature attribution (SHAP values) identified four primary drivers of customer cancellations:

```
Month-to-Month Contract [42.7% Churn] ───────────────████████████████████ 42.7%
Fiber Optic Infrastructure [41.8% Churn] ────────────███████████████████  41.8%
Early Stage Tenure (0-12 mo) [47.4% Churn] ──────────██████████████████████ 47.4%
No Streaming Services Bundled [33.5% Churn] ─────────███████████████ 33.5%
```

1. **Agreement Structure (Contract Type)**: 
   - Customers on **Month-to-month contracts have an alarming 42.7% churn rate**, accounting for **over 88% of all lost customers**. 
   - By comparison, customers locked into **One-year (11.2% churn)** or **Two-year contracts (2.8% churn)** show exceptionally high loyalty.
2. **Infrastructure Discrepancies (Fiber Optic vs. DSL)**:
   - Customers subscribed to **Fiber Optic service churn at 41.8%**, compared to **DSL (19.0%)** and **No Internet (7.4%)**. While fiber delivers high-speed data, EDA indicates these users have high monthly charges, making them highly price-sensitive.
3. **The Lifecycle Attrition Window (Tenure)**:
   - Attrition is heavily frontloaded. **47.4% of all customer drop-offs occur within the first 12 months** of signup. If a customer stays active beyond 24 months, their churn risk drops to **20.1%**, and further decays to **8.9%** past 48 months.
4. **Service Bundling (Add-ons)**:
   - Customers who do not subscribe to streaming TV or movies show higher churn rates (**33.5%**), while users who bundle internet, TV, and movie add-ons together show vastly superior retention (**25.1%**).

### Actionable Strategic Business Recommendations

* **The $10 Contract Migration Protocol**: Offer month-to-month users a targeted $10/month bill credit incentive if they transition to a 1-year contract. The guaranteed recurring contract revenue easily offsets the minor price discount in under 90 days.
* **Onboarding Retention Lifelines**: Establish automated service wellness check-ins (via SMS/Email) at Month 3 and Month 9 of the customer lifecycle. Resolving initial connection or billing issues early directly targets the critical first-year churn window.
* **Aggressive Entertainment Bundling**: Package streaming TV and movies as a value-added bundle. Offering a free 3-month trial of streaming movies to single-service internet customers locks in higher utility value and raises switching friction.

---

## 🛠️ For Technical Engineers & Data Scientists

### Project Directory Layout
To establish an enterprise-grade structure, the repository is partitioned into isolated layers:
```
churn-prediction/
├── churn_app.py                  # Legacy Streamlit App (Fully runnable using /models)
├── docker-compose.yml            # Multi-container orchestration config
├── README.md                     # This document
├── docs/                         # Executive PPTX and PDF reports
├── notebooks/                    # Jupyter analytics notebooks & column descriptions
├── models/                       # Root serialized model binary storage
├── backend/                      # FAST-API Backend Service
│   ├── requirements.txt          # Isolated Python dependencies
│   ├── app/
│   │   ├── main.py               # Lifespan loader, CORS, endpoints, exception handlers
│   │   ├── schemas.py            # Pydantic v2 request/response models
│   │   ├── dependencies.py       # Security validation (API Header)
│   │   └── utils/preprocess.py   # One-hot encoding & feature scaler transformer
│   └── tests/test_main.py        # Async client endpoint mock tests
└── frontend/                     # Next.js 14 App Router Service
    ├── package.json              # TypeScript, Tailwind, Zod dependencies
    ├── app/
    │   ├── page.tsx              # Main dashboard wrapper & Tab selector state
    │   └── api/predict/route.ts  # Server-side proxy routing to shield API keys
    ├── components/
    │   ├── AnalyticsPanel.tsx    # Interactive KPI grids & Cohort bar charts
    │   └── PredictionForm.tsx    # React-hook-form + Zod client validation
    └── __tests__/                # Jest + React Testing Library suites
```

### Machine Learning & Preprocessing Pipeline
The model is a serialized tree-based classifier trained on the Telco Churn dataset.

1. **Preprocessing Pipeline (`backend/app/utils/preprocess.py`)**:
   - Converts the single-row input JSON into a Pandas DataFrame.
   - Performs one-hot dummy encoding using `pd.get_dummies()`.
   - Aligns the resulting dummy DataFrame against the exact 10 columns expected by the trained model (re-indexing and filling missing columns with `0`):
     ```
     ['tenure', 'MonthlyCharges', 'MultipleLines_Yes', 'InternetService_Fiber optic', 
      'StreamingTV_No internet service', 'StreamingTV_Yes', 
      'StreamingMovies_No internet service', 'StreamingMovies_Yes', 
      'Contract_One year', 'Contract_Two year']
     ```
   - Converts columns to floating-point types and fits them against the pre-trained `scaler.pkl` transformer.
2. **Binary Serialisation Parity**:
   - **Pickle Binary Mismatch**: Trained using standard tree schemas under `scikit-learn==1.2.2` and `numpy==1.26.4`. The backend environment strictly pins these versions to prevent tree schema parsing errors (such as `missing_go_to_left` exceptions standard in scikit-learn 1.3+).

### Decoupled Architecture & Security Protocol

```
┌────────────────────────┐              ┌────────────────────────┐              ┌────────────────────────┐
│  Next.js 14 Browser    │ ───────────> │  Next.js Server Proxy  │ ───────────> │  FastAPI Backend (80)  │
│  (Tab: Predict/Charts) │  (No Keys)   │  (app/api/predict)     │ (X-API-Key)  │  (Model Lifespan Load) │
└────────────────────────┘              └────────────────────────┘              └────────────────────────┘
```

1. **FastAPI Lifespan Loading**:
   - The backend utilizes FastAPI's `lifespan` context manager to load the ML model (`best_model.pkl`), `scaler.pkl`, and feature column list into the global `app.state` exactly once on startup, preventing redundant, slow disk I/O on individual requests.
2. **API Key Security Protocol**:
   - In production, Next.js calls the FastAPI server securely. To prevent the private API key (`supersecretapikey123`) from being baked into the browser bundle (which exposes it in client-side sources), a **Server-side API Proxy** was built in Next.js (`app/api/predict/route.ts`).
   - Browser form submissions are POSTed to the Next.js local proxy route, which grabs the backend private key from the server environment, injects it into the custom `X-API-Key` request header, and forwards the payload to the backend. The client browser never sees the backend URL or the API credential.
3. **Structured JSON Exception Mapping**:
   - Global exception handlers catch preprocessing, model inference, and auth issues, returning clear JSON structures (e.g. `HTTP 422: PREPROCESSING_ERROR`) rather than unhandled Python traces.

### Quality Assurance & Automated Test Suites
Both services are backed by comprehensive unit tests, achieving 100% pass rates.

* **Backend (`pytest backend/tests/test_main.py -v`)**:
  - Leverages Starlette's `TestClient` context manager to trigger lifespan setups.
  - Verifies health check responses (`GET /`).
  - Asserts that incorrect API keys or missing headers return `HTTP 403 Forbidden` with structured JSON bodies.
  - Verifies that out-of-bounds fields (e.g. tenure < 0) trigger `HTTP 422 Unprocessable Entity` Zod validation errors.
  - Mocks model predictions (`predict_proba`) to assert classification probabilities.
* **Frontend (`npm run test` inside `/frontend`)**:
  - Leverages Jest and React Testing Library (RTL).
  - Asserts that the Prediction Form correctly renders all input sliders, selects, and default values.
  - Verifies Zod client-side validations (e.g. entering Monthly Charges > $150 triggers inline validation errors).
  - Mocks API responses to assert successful loading skeletons, result badge formatting, and error alert displays.
  - Verifies that the Interactive Analytics Panel renders the 4 core KPIs and dynamically updates visual progress charts on cohort changes.

---

## 🚀 Quick Start & Installation Guide

### Prerequisite Checklist
* Git
* Docker & Docker Compose (Recommended) OR Anaconda (Conda environment) & Node.js (v20+)

### Option A: Standard Orchestration via Docker (Highly Recommended)
Build and run the entire production-grade ecosystem (Frontend Next.js server on port `3000`, Backend FastAPI server on port `8000`) in one click:
```bash
docker-compose up --build
```
Open `http://localhost:3000` to interact with the visual dashboard and metrics panel.

### Option B: Local Development Mode (Manual Process)

#### 1. Backend Service Setup
1. Open a terminal and navigate to `/backend`.
2. Create and activate the conda environment using Python 3.11:
   ```bash
   conda create -n churn-prediction python=3.11 -y
   conda activate churn-prediction
   ```
3. Install pinned dependencies and run tests:
   ```bash
   pip install -r requirements.txt
   python -m pytest tests/ -v
   ```
4. Start the FastAPI development server:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

#### 2. Frontend Next.js Setup
1. Open a separate terminal and navigate to `/frontend`.
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the Jest unit test suite:
   ```bash
   npm run test
   ```
4. Launch the local Next.js server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

#### 3. Legacy Applications Access
- **Legacy Streamlit App**: Run `streamlit run churn_app.py` directly from the project root. (It opens pickles seamlessly from `models/` without root pollution).
- **Analytics Jupyter Notebook**: Run and inspect `notebooks/Index.ipynb` using Jupyter Notebook or VS Code. (Relative load paths are pre-coded to resolve from `../Data/`).
