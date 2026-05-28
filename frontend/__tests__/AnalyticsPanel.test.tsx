// frontend/__tests__/AnalyticsPanel.test.tsx
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { AnalyticsPanel } from "../components/AnalyticsPanel"

describe("Telecom Churn Interactive Analytics Panel", () => {
  test("renders the four primary core KPI cards with correct aggregates", () => {
    render(<AnalyticsPanel />);

    // Check KPI Headers
    expect(screen.getByText("Overall Churn Rate")).toBeInTheDocument();
    expect(screen.getByText("26.5%")).toBeInTheDocument();

    expect(screen.getByText("Total Accounts")).toBeInTheDocument();
    expect(screen.getByText("7,043")).toBeInTheDocument();

    expect(screen.getByText("Average Tenure")).toBeInTheDocument();
    expect(screen.getByText("32.4")).toBeInTheDocument();

    expect(screen.getByText("Average Bill")).toBeInTheDocument();
    expect(screen.getByText("$64.76")).toBeInTheDocument();
  });

  test("defaults to displaying Contract Type Influence cohorts and recommendation", () => {
    render(<AnalyticsPanel />);

    // Check active driver header
    expect(screen.getByText("Contract Type Influence")).toBeInTheDocument();
    expect(screen.getByText(/Attritions grouped by customer contract agreement structures/i)).toBeInTheDocument();

    // Check cohorts are displayed
    expect(screen.getByText("Month-to-month")).toBeInTheDocument();
    expect(screen.getByText(/3,875 Customers/i)).toBeInTheDocument();
    expect(screen.getByText("One year")).toBeInTheDocument();
    expect(screen.getByText("Two year")).toBeInTheDocument();

    // Check recommendation
    expect(screen.getByText(/Introduce standard \$10 monthly discount incentives/i)).toBeInTheDocument();
  });

  test("clicking Internet Infrastructure driver updates the visualized service cohorts", () => {
    render(<AnalyticsPanel />);

    // Find and click the Internet Service driver button
    const internetButton = screen.getByRole("button", { name: /Internet Infrastructure/i });
    fireEvent.click(internetButton);

    // Verify it transitions to Internet Service Impact statistics
    expect(screen.getByText("Internet Service Impact")).toBeInTheDocument();
    expect(screen.getByText("Fiber optic")).toBeInTheDocument();
    expect(screen.getByText(/3,096 Customers/i)).toBeInTheDocument();
    expect(screen.getByText("DSL")).toBeInTheDocument();
    expect(screen.getByText("No internet")).toBeInTheDocument();

    // Verify SHAP and strategic recommendations update
    expect(screen.getByText(/Fiber optic accounts show a remarkably high churn rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Establish a direct post-installation service audit/i)).toBeInTheDocument();
  });

  test("clicking Lifetime Cohorts driver updates visualized tenure group percentages", () => {
    render(<AnalyticsPanel />);

    // Find and click Tenure Cohorts driver button
    const tenureButton = screen.getByRole("button", { name: /Lifetime Cohorts/i });
    fireEvent.click(tenureButton);

    // Verify it transitions to Tenure Cohorts statistics
    expect(screen.getByText("Customer Tenure Cohorts")).toBeInTheDocument();
    expect(screen.getByText("Early-stage (0-12 mo)")).toBeInTheDocument();
    expect(screen.getByText(/2,186 Customers/i)).toBeInTheDocument();
    expect(screen.getByText("Long-term (48-72 mo)")).toBeInTheDocument();

    // Verify recommendations update
    expect(screen.getByText(/Customer churn is heavily frontloaded/i)).toBeInTheDocument();
    expect(screen.getByText(/Deploy automated 'Onboarding Check-ins'/i)).toBeInTheDocument();
  });
});
