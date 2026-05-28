// frontend/components/ResultCard.tsx
import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export interface PredictionResult {
  prediction: number;
  probability: number;
  verdict: string;
}

interface ResultCardProps {
  result: PredictionResult | null;
  loading: boolean;
  error: string | null;
}

export function ResultCard({ result, loading, error }: ResultCardProps) {
  if (loading) {
    return <ResultSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-6 border border-rose-500/30 bg-rose-500/5 text-rose-200">
        <svg className="h-5 w-5 mr-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <AlertTitle className="text-rose-100 font-bold">Prediction Failed</AlertTitle>
          <AlertDescription className="text-rose-200 opacity-90">{error}</AlertDescription>
        </div>
      </Alert>
    );
  }

  if (!result) return null;

  const isChurn = result.prediction === 1;
  const probabilityPercentage = Math.round(result.probability * 100);

  return (
    <Card className="mt-6 border border-slate-800 bg-slate-950/60 backdrop-blur-xl shadow-2xl transition-all duration-500 transform translate-y-0 opacity-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-extrabold text-white">Prediction Analysis</CardTitle>
          <CardDescription className="text-slate-400">Model-calculated risk evaluation</CardDescription>
        </div>
        <Badge variant={isChurn ? "destructive" : "success"} className="text-sm px-3 py-1 font-bold tracking-wider">
          {isChurn ? "HIGH RISK OF CHURN" : "LOW CHURN RISK"}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Visual Probability Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-slate-300">Churn Probability</span>
            <span className={`font-bold ${isChurn ? 'text-red-400' : 'text-emerald-400'}`}>
              {probabilityPercentage}%
            </span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                isChurn 
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 shadow-md shadow-rose-500/20" 
                  : "bg-gradient-to-r from-teal-500 to-emerald-500 shadow-md shadow-emerald-500/20"
              }`}
              style={{ width: `${probabilityPercentage}%` }}
              data-testid="probability-bar"
            />
          </div>
        </div>

        {/* Actionable Insights */}
        <div className={`p-4 rounded-xl border ${
          isChurn 
            ? 'bg-rose-500/5 border-rose-500/20 text-rose-200' 
            : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200'
        }`}>
          <div className="flex items-start space-x-3">
            <span className="text-xl">
              {isChurn ? "⚠️" : "✨"}
            </span>
            <div>
              <p className="font-bold text-white mb-1">
                {isChurn ? "Immediate Retention Action Required" : "Customer Loyalty is Stable"}
              </p>
              <p className="text-sm opacity-85">
                {isChurn 
                  ? "This customer shows patterns highly correlated with churn. Consider proactive outreach, bundling services, or offering loyalty contract incentives."
                  : "Customer exhibits patterns consistent with retention. Maintain standard high-quality customer touchpoints."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Verdict Callout */}
        <div className="flex flex-col items-center justify-center py-4 border-t border-slate-900/50">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Prediction Verdict</p>
          <h4 className="text-lg font-bold text-slate-100 text-center">{result.verdict}</h4>
        </div>
      </CardContent>
    </Card>
  );
}

function ResultSkeleton() {
  return (
    <Card className="mt-6 border border-slate-800 bg-slate-950/60 backdrop-blur-xl shadow-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-7 w-32 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-3 w-full" />
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex flex-col items-center py-2 space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-5 w-56" />
      </div>
    </Card>
  );
}
