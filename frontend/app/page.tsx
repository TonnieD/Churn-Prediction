// frontend/app/page.tsx
"use client"

import React, { useState } from "react"
import { PredictionForm } from "@/components/PredictionForm"
import { ResultCard, PredictionResult } from "@/components/ResultCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsPanel } from "@/components/AnalyticsPanel"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"predictor" | "analytics">("predictor");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartLoading = () => {
    setLoading(true);
    setError(null);
    setResult(null);
  };

  const handleSuccess = (data: PredictionResult) => {
    setResult(data);
    setLoading(false);
  };

  const handleError = (msg: string) => {
    setError(msg);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-violet-500/30">
      {/* Decorative Top Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">
        
        {/* Dashboard Header */}
        <header className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-900 pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Telecom Customer Churn Dashboard
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm md:text-base">
              Predict customer cancellation risk instantly using advanced ML classification. Evaluate features and take retention action.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-2 self-center md:self-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Model Online (v1.0)</span>
          </div>
        </header>

        {/* Tab Selection Switcher */}
        <div className="flex border-b border-slate-900 mb-8 max-w-md mx-auto md:mx-0">
          <button
            onClick={() => setActiveTab("predictor")}
            className={`flex-1 pb-4 text-sm font-bold uppercase tracking-wider transition-all duration-355 relative focus:outline-none ${
              activeTab === "predictor" ? "text-violet-400 font-extrabold" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            🔮 Predict Churn
            {activeTab === "predictor" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-400 shadow-[0_0_12px_#a78bfa] animate-in slide-in-from-left duration-200" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 pb-4 text-sm font-bold uppercase tracking-wider transition-all duration-355 relative focus:outline-none ${
              activeTab === "analytics" ? "text-violet-400 font-extrabold" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            📊 Dataset Analytics
            {activeTab === "analytics" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-400 shadow-[0_0_12px_#a78bfa] animate-in slide-in-from-right duration-200" />
            )}
          </button>
        </div>

        {/* Dynamic Panels */}
        {activeTab === "predictor" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            
            {/* Left Panel: Context & Churn Drivers */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Churn Drivers Widget */}
              <Card className="border border-slate-800 bg-slate-950/60 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
                    <span>📊</span>
                    <span>Primary Churn Drivers</span>
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Identified key factors influencing user cancellations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {/* Driver 1 */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-900/40 rounded-xl border border-slate-900">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">📅</span>
                        <span className="text-xs font-semibold text-slate-300">Month-to-Month Contract</span>
                      </div>
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full uppercase">Highest Impact</span>
                    </div>

                    {/* Driver 2 */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-900/40 rounded-xl border border-slate-900">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">⚡</span>
                        <span className="text-xs font-semibold text-slate-300">Fiber Optic Service</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase">High Impact</span>
                    </div>

                    {/* Driver 3 */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-900/40 rounded-xl border border-slate-900">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">💰</span>
                        <span className="text-xs font-semibold text-slate-300">High Monthly Charges</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full uppercase">Medium Impact</span>
                    </div>

                    {/* Driver 4 */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-900/40 rounded-xl border border-slate-900">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">⏳</span>
                        <span className="text-xs font-semibold text-slate-300">Short Tenure (&lt; 12 mo)</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full uppercase">Medium Impact</span>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 leading-relaxed">
                    * Based on shapley value attribution calculations from historical training datasets (Telco Churn).
                  </div>
                </CardContent>
              </Card>

              {/* Retention Strategies Quick Tips */}
              <Card className="border border-slate-800 bg-slate-950/60 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
                    <span>💡</span>
                    <span>Retention Strategies</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-300 space-y-3 leading-relaxed">
                  <p>
                    <strong>1. Transition to Contracts:</strong> Users on month-to-month contracts have high attrition. Offer incentives to sign 1-year or 2-year agreements.
                  </p>
                  <p>
                    <strong>2. Bundle Internet/TV:</strong> Customers with streaming services bundled together with DSL have significantly higher retention rates.
                  </p>
                  <p>
                    <strong>3. Audit Fiber Pricing:</strong> High pricing on fiber optic lines is a main driver of negative feedback and churn. Review service tier bundles.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel: Prediction Form & Result Display */}
            <div className="lg:col-span-8 space-y-6">
              <PredictionForm
                onStartLoading={handleStartLoading}
                onSuccess={handleSuccess}
                onError={handleError}
                loading={loading}
              />

              <ResultCard result={result} loading={loading} error={error} />
            </div>

          </div>
        ) : (
          <AnalyticsPanel />
        )}

      </div>
    </main>
  );
}
