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
      <Alert variant="destructive" className="mt-6 border border-rose-500/50 bg-rose-500/10 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
        <svg className="h-5 w-5 mr-3 inline text-rose-450 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <AlertTitle className="text-rose-100 font-extrabold tracking-wide uppercase text-xs">Prediction Failed</AlertTitle>
          <AlertDescription className="text-rose-200/90 text-sm mt-1">{error}</AlertDescription>
        </div>
      </Alert>
    );
  }

  if (!result) return null;

  const isChurn = result.prediction === 1;
  const probabilityPercentage = Math.round(result.probability * 100);

  return (
    <Card className={`mt-6 border backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:-translate-y-0.5 ${
      isChurn 
        ? "border-rose-500/30 bg-slate-950/70 hover:border-rose-500/50 hover:shadow-[0_0_40px_rgba(244,63,94,0.12)]" 
        : "border-emerald-500/30 bg-slate-950/70 hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.12)]"
    }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-900/60">
        <div>
          <CardTitle className="text-xl font-extrabold text-white flex items-center space-x-2">
            <span>🔮</span>
            <span>Prediction Analysis</span>
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs">Model-calculated risk evaluation</CardDescription>
        </div>
        <Badge 
          variant={isChurn ? "destructive" : "success"} 
          className={`text-xs px-3 py-1 font-extrabold tracking-widest ${
            isChurn 
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]" 
              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
          }`}
        >
          {isChurn ? "HIGH RISK OF CHURN" : "LOW CHURN RISK"}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* Visual Probability Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs uppercase tracking-wider font-bold">
            <span className="text-slate-400">Churn Probability</span>
            <span className={`text-sm font-extrabold ${
              isChurn 
                ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]' 
                : 'text-emerald-450 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]'
            }`}>
              {probabilityPercentage}%
            </span>
          </div>
          <div className="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-950">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${
                isChurn 
                  ? "from-pink-500 via-rose-500 to-red-650 shadow-[0_0_20px_rgba(244,63,94,0.45)]" 
                  : "from-teal-400 via-emerald-400 to-green-500 shadow-[0_0_20px_rgba(16,185,129,0.45)]"
              }`}
              style={{ width: `${probabilityPercentage}%` }}
              data-testid="probability-bar"
            />
          </div>
        </div>
 
        {/* Actionable Insights */}
        <div className={`p-4 rounded-xl border transition-all duration-300 ${
          isChurn 
            ? 'bg-rose-500/10 border-rose-500/40 text-rose-200 shadow-[inset_0_0_12px_rgba(244,63,94,0.05)]' 
            : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 shadow-[inset_0_0_12px_rgba(16,185,129,0.05)]'
        }`}>
          <div className="flex items-start space-x-3">
            <span className="text-xl">
              {isChurn ? "⚠️" : "✨"}
            </span>
            <div>
              <p className="font-bold text-white mb-1">
                {isChurn ? "Immediate Retention Action Required" : "Customer Loyalty is Stable"}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
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
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1.5">Prediction Verdict</p>
          <h4 className="text-base font-extrabold text-slate-200 text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">{result.verdict}</h4>
        </div>
      </CardContent>
    </Card>
  );
}

function ResultSkeleton() {
  return (
    <Card className="mt-6 border border-slate-900 bg-slate-950/70 backdrop-blur-2xl shadow-2xl p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-900/60 pb-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40 bg-slate-800/80" />
          <Skeleton className="h-3.5 w-64 bg-slate-900/60" />
        </div>
        <Skeleton className="h-7 w-32 rounded-full bg-slate-800/80" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3.5 w-28 bg-slate-900/60" />
          <Skeleton className="h-3.5 w-12 bg-slate-900/60" />
        </div>
        <Skeleton className="h-3.5 w-full bg-slate-900/80" />
      </div>
      <Skeleton className="h-20 w-full bg-slate-900/60" />
      <div className="flex flex-col items-center py-2 space-y-2">
        <Skeleton className="h-3 w-28 bg-slate-900/50" />
        <Skeleton className="h-5 w-56 bg-slate-900/80" />
      </div>
    </Card>
  );
}
