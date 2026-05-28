// frontend/__tests__/PredictionForm.test.tsx
import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Home from "../app/page"
import { predict } from "../lib/api"

// Mock the API predict call
jest.mock("../lib/api", () => ({
  predict: jest.fn(),
}));

describe("Telecom Churn Prediction Form & Dashboard Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("form renders correctly with all expected input fields and defaults", () => {
    render(<Home />);
    
    // Check main title
    expect(screen.getByText("Telecom Customer Churn Dashboard")).toBeInTheDocument();
    
    // Check that we have form fields
    expect(screen.getByLabelText(/Tenure \(months\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contract Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly Charges \(\$\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Internet Service/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Multiple Lines/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Streaming TV/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Streaming Movies/i)).toBeInTheDocument();
    
    // Check submit button
    expect(screen.getByRole("button", { name: /Calculate Churn Probability/i })).toBeInTheDocument();
  });

  test("form shows inline validation errors for invalid input values", async () => {
    render(<Home />);
    
    const chargesInput = screen.getByLabelText(/Monthly Charges \(\$\)/i);
    
    // Put an invalid monthly charge value, e.g. 500 (max is 150)
    fireEvent.change(chargesInput, { target: { value: 500 } });
    fireEvent.blur(chargesInput);
    
    // Wait for the Zod resolver error message to display
    await waitFor(() => {
      expect(screen.getByText(/Charges cannot exceed \$150/i)).toBeInTheDocument();
    });
  });

  test("successful prediction form submission renders results dashboard properly", async () => {
    const mockResult = {
      prediction: 1,
      probability: 0.82,
      verdict: "Customer is likely to churn",
    };
    
    (predict as jest.Mock).mockResolvedValueOnce(mockResult);

    render(<Home />);

    const submitButton = screen.getByRole("button", { name: /Calculate Churn Probability/i });
    fireEvent.click(submitButton);

    // Wait for the success results card to render on the page
    await waitFor(() => {
      expect(screen.getByText("Prediction Analysis")).toBeInTheDocument();
      expect(screen.getByText("HIGH RISK OF CHURN")).toBeInTheDocument();
      expect(screen.getByText("82%")).toBeInTheDocument();
      expect(screen.getByText("Customer is likely to churn")).toBeInTheDocument();
    });
  });

  test("failed prediction API call renders error banner in result section", async () => {
    const errorMessage = "Backend inference failed: internal model exception";
    (predict as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<Home />);

    const submitButton = screen.getByRole("button", { name: /Calculate Churn Probability/i });
    fireEvent.click(submitButton);

    // Wait for the error banner to render
    await waitFor(() => {
      expect(screen.getByText("Prediction Failed")).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
