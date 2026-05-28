# backend/tests/test_main.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from app.main import app
from app.config import settings

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

def test_health_check(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "service" in data
    assert "status" in data
    assert data["status"] == "healthy"

def test_predict_missing_api_key(client):
    payload = {
        "tenure": 12,
        "MonthlyCharges": 70.0,
        "MultipleLines": "No",
        "InternetService": "Fiber optic",
        "StreamingTV": "Yes",
        "StreamingMovies": "No",
        "Contract": "Month-to-month"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 403
    data = response.json()
    assert "detail" in data
    assert "API Key is missing" in data["detail"]["error"]

def test_predict_invalid_api_key(client):
    payload = {
        "tenure": 12,
        "MonthlyCharges": 70.0,
        "MultipleLines": "No",
        "InternetService": "Fiber optic",
        "StreamingTV": "Yes",
        "StreamingMovies": "No",
        "Contract": "Month-to-month"
    }
    response = client.post("/predict", json=payload, headers={"X-API-Key": "wrongkey"})
    assert response.status_code == 403
    data = response.json()
    assert "detail" in data
    assert "Invalid API Key" in data["detail"]["error"]

def test_predict_invalid_input(client):
    payload = {
        "tenure": -5,
        "MonthlyCharges": 70.0,
        "MultipleLines": "No",
        "InternetService": "Fiber optic",
        "StreamingTV": "Yes",
        "StreamingMovies": "No",
        "Contract": "Month-to-month"
    }
    response = client.post("/predict", json=payload, headers={"X-API-Key": settings.API_KEY})
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data

def test_predict_success(client):
    payload = {
        "tenure": 12,
        "MonthlyCharges": 70.0,
        "MultipleLines": "No",
        "InternetService": "Fiber optic",
        "StreamingTV": "Yes",
        "StreamingMovies": "No",
        "Contract": "Month-to-month"
    }
    
    mock_model = MagicMock()
    mock_model.predict.return_value = [0]
    mock_model.predict_proba.return_value = [[0.85, 0.15]]

    with patch.object(app.state, "model", mock_model):
        response = client.post("/predict", json=payload, headers={"X-API-Key": settings.API_KEY})
        assert response.status_code == 200
        data = response.json()
        assert data["prediction"] == 0
        assert data["probability"] == 0.15
        assert "unlikely to churn" in data["verdict"]

def test_predict_success_churn(client):
    payload = {
        "tenure": 1,
        "MonthlyCharges": 120.0,
        "MultipleLines": "Yes",
        "InternetService": "Fiber optic",
        "StreamingTV": "Yes",
        "StreamingMovies": "Yes",
        "Contract": "Month-to-month"
    }
    
    mock_model = MagicMock()
    mock_model.predict.return_value = [1]
    mock_model.predict_proba.return_value = [[0.2, 0.8]]

    with patch.object(app.state, "model", mock_model):
        response = client.post("/predict", json=payload, headers={"X-API-Key": settings.API_KEY})
        assert response.status_code == 200
        data = response.json()
        assert data["prediction"] == 1
        assert data["probability"] == 0.8
        assert "likely to churn" in data["verdict"]
