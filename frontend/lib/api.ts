// frontend/lib/api.ts

export interface PredictionRequest {
  tenure: number;
  MonthlyCharges: number;
  MultipleLines: "No" | "Yes";
  InternetService: "DSL" | "Fiber optic" | "No";
  StreamingTV: "No" | "Yes" | "No internet service";
  StreamingMovies: "No" | "Yes" | "No internet service";
  Contract: "Month-to-month" | "One year" | "Two year";
}

export interface PredictionResponse {
  prediction: number;
  probability: number;
  verdict: string;
}

export async function predict(request: PredictionRequest): Promise<PredictionResponse> {
  const response = await fetch("/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let errorDetail = "Failed to run prediction";
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail?.error || errorJson.error || errorDetail;
    } catch {
      // Ignore JSON parsing failures and use default message
    }
    throw new Error(errorDetail);
  }

  return response.json();
}
