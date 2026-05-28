// frontend/components/AnalyticsPanel.tsx
"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type DriverKey = "contract" | "internet" | "tenure" | "streaming"

interface CohortStat {
  label: string
  value: string
  churnRate: number
  colorClass: string
  barColor: string
}

const DRIVER_DATA: Record<DriverKey, {
  title: string
  description: string
  why: string
  cohorts: CohortStat[]
  recommendation: string
}> = {
  contract: {
    title: "Contract Type Influence",
    description: "Attritions grouped by customer contract agreement structures",
    why: "Month-to-month subscribers represent the highest risk group due to low switching friction, making up over 88% of all churned accounts.",
    cohorts: [
      { label: "Month-to-month", value: "3,875 Customers", churnRate: 42.7, colorClass: "text-rose-400 bg-rose-500/10", barColor: "from-rose-500 to-violet-600" },
      { label: "One year", value: "1,473 Customers", churnRate: 11.2, colorClass: "text-amber-400 bg-amber-500/10", barColor: "from-amber-400 to-orange-500" },
      { label: "Two year", value: "1,695 Customers", churnRate: 2.8, colorClass: "text-emerald-400 bg-emerald-500/10", barColor: "from-emerald-400 to-teal-500" },
    ],
    recommendation: "Introduce standard $10 monthly discount incentives to migrate Month-to-Month accounts to locked 1-year terms. The loyalty gain offsets the price drop in under 3 months.",
  },
  internet: {
    title: "Internet Service Impact",
    description: "Vulnerability analysis by connection infrastructure types",
    why: "Fiber optic accounts show a remarkably high churn rate (41.8%), despite delivering high speeds. This is heavily correlated with high monthly billing and technical issues reported in EDA.",
    cohorts: [
      { label: "Fiber optic", value: "3,096 Customers", churnRate: 41.8, colorClass: "text-rose-400 bg-rose-500/10", barColor: "from-rose-500 to-violet-600" },
      { label: "DSL", value: "2,421 Customers", churnRate: 19.0, colorClass: "text-amber-400 bg-amber-500/10", barColor: "from-amber-400 to-orange-500" },
      { label: "No internet", value: "1,526 Customers", churnRate: 7.4, colorClass: "text-emerald-400 bg-emerald-500/10", barColor: "from-emerald-400 to-teal-500" },
    ],
    recommendation: "Establish a direct post-installation service audit for Fiber Optic lines within the first 14 days, and offer targeted retention discounts to combat high price sensitivity.",
  },
  tenure: {
    title: "Customer Tenure Cohorts",
    description: "Churn susceptibility tracked over account lifetime",
    why: "Customer churn is heavily frontloaded: 47.4% of users drop within their first year of subscription. Loyalty increases exponentially once the account crosses the 24-month threshold.",
    cohorts: [
      { label: "Early-stage (0-12 mo)", value: "2,186 Customers", churnRate: 47.4, colorClass: "text-rose-400 bg-rose-500/10", barColor: "from-rose-500 to-violet-600" },
      { label: "Short-term (12-24 mo)", value: "1,024 Customers", churnRate: 28.7, colorClass: "text-amber-400 bg-amber-500/10", barColor: "from-amber-400 to-orange-500" },
      { label: "Mid-term (24-48 mo)", value: "1,594 Customers", churnRate: 20.1, colorClass: "text-slate-400 bg-slate-800", barColor: "from-slate-400 to-slate-600" },
      { label: "Long-term (48-72 mo)", value: "2,239 Customers", churnRate: 8.9, colorClass: "text-emerald-400 bg-emerald-500/10", barColor: "from-emerald-400 to-teal-500" },
    ],
    recommendation: "Deploy automated 'Onboarding Check-ins' and value-add streaming offers at months 3 and 9 to bypass the critical early-stage churn spikes.",
  },
  streaming: {
    title: "Streaming Services Bundling",
    description: "Cancellations influenced by multi-service subscriptions",
    why: "Customers who bundle streaming TV and movies together have higher retention. Disconnected, single-service accounts represent higher switching probabilities.",
    cohorts: [
      { label: "Streaming TV & Movies", value: "1,940 Customers", churnRate: 25.1, colorClass: "text-emerald-400 bg-emerald-500/10", barColor: "from-emerald-400 to-teal-500" },
      { label: "Single Streaming Service", value: "1,438 Customers", churnRate: 29.5, colorClass: "text-amber-400 bg-amber-500/10", barColor: "from-amber-400 to-orange-500" },
      { label: "No Streaming Services", value: "2,139 Customers", churnRate: 33.5, colorClass: "text-rose-400 bg-rose-500/10", barColor: "from-rose-500 to-violet-600" },
      { label: "No Internet Service", value: "1,526 Customers", churnRate: 7.4, colorClass: "text-emerald-400 bg-emerald-500/10", barColor: "from-emerald-400 to-teal-500" },
    ],
    recommendation: "Promote entertainment bundles with a complimentary 3-month trial of Streaming Movies to lock in users with high utility valuations.",
  },
}

export function AnalyticsPanel() {
  const [selectedDriver, setSelectedDriver] = useState<DriverKey>("contract")
  const activeData = DRIVER_DATA[selectedDriver]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Core KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Churn Rate */}
        <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-slate-950/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]">
          <div className="absolute top-0 right-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-rose-500/5 blur-2xl" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overall Churn Rate</span>
            <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">26.5%</span>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-md">HIGH RISK</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">1,869 churned out of 7,043 customers</p>
        </div>

        {/* KPI 2: Total Cohort */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-slate-700 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Accounts</span>
            <span className="text-sm">👥</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">7,043</span>
            <span className="text-[10px] font-semibold text-slate-400">Total volume</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Full dataset demographic base</p>
        </div>

        {/* KPI 3: Avg Tenure */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-slate-700 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average Tenure</span>
            <span className="text-sm">⏳</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">32.4</span>
            <span className="text-[10px] font-semibold text-slate-400">Months</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Average client account lifespan</p>
        </div>

        {/* KPI 4: Monthly Charges */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 p-5 backdrop-blur-xl transition-all duration-300 hover:border-slate-700 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average Bill</span>
            <span className="text-sm">💰</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">$64.76</span>
            <span className="text-[10px] font-semibold text-slate-400">Monthly</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Aggregated monthly recurring spend</p>
        </div>

      </div>

      {/* 2. Interactive Factors Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Toggles Panel */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 mb-1.5">Select Churn Driver</h3>
          
          {/* Button: Contract */}
          <button
            onClick={() => setSelectedDriver("contract")}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-center space-x-3 focus:outline-none ${
              selectedDriver === "contract"
                ? "bg-violet-500/15 border-violet-500/60 text-violet-250 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                : "bg-slate-950/40 border-slate-900 text-slate-450 hover:bg-slate-900/30 hover:border-slate-800 hover:text-white"
            }`}
          >
            <span className="text-lg">📅</span>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">Contract Type</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Month-to-month vs Long agreements</div>
            </div>
          </button>

          {/* Button: Internet */}
          <button
            onClick={() => setSelectedDriver("internet")}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-center space-x-3 focus:outline-none ${
              selectedDriver === "internet"
                ? "bg-violet-500/15 border-violet-500/60 text-violet-250 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                : "bg-slate-950/40 border-slate-900 text-slate-450 hover:bg-slate-900/30 hover:border-slate-800 hover:text-white"
            }`}
          >
            <span className="text-lg">⚡</span>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">Internet Infrastructure</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Fiber Optic line fees & DSL analysis</div>
            </div>
          </button>

          {/* Button: Tenure */}
          <button
            onClick={() => setSelectedDriver("tenure")}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-center space-x-3 focus:outline-none ${
              selectedDriver === "tenure"
                ? "bg-violet-500/15 border-violet-500/60 text-violet-250 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                : "bg-slate-950/40 border-slate-900 text-slate-450 hover:bg-slate-900/30 hover:border-slate-800 hover:text-white"
            }`}
          >
            <span className="text-lg">⏳</span>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">Lifetime Cohorts</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Early lifecycle attrition thresholds</div>
            </div>
          </button>

          {/* Button: Streaming */}
          <button
            onClick={() => setSelectedDriver("streaming")}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-center space-x-3 focus:outline-none ${
              selectedDriver === "streaming"
                ? "bg-violet-500/15 border-violet-500/60 text-violet-250 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                : "bg-slate-950/40 border-slate-900 text-slate-450 hover:bg-slate-900/30 hover:border-slate-800 hover:text-white"
            }`}
          >
            <span className="text-lg">🎬</span>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">Service Bundles</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Multiple entertainment subscription links</div>
            </div>
          </button>

        </div>

        {/* Right Charts & Recommendation Workspace */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Visualizer Card */}
          <Card className="border border-slate-900 bg-slate-950/70 backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:border-violet-500/30 hover:shadow-[0_0_50px_rgba(139,92,246,0.08)]">
            <CardHeader className="border-b border-slate-900/60 pb-5">
              <CardTitle className="text-xl font-extrabold text-white flex items-center space-x-3">
                <span>🎯</span>
                <span>{activeData.title}</span>
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                {activeData.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* Cohort list and bars */}
              <div className="space-y-5">
                {activeData.cohorts.map((cohort, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-200">{cohort.label}</span>
                        <span className="text-[10px] text-slate-500 font-normal">({cohort.value})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">Churn Rate:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cohort.colorClass}`}>
                          {cohort.churnRate}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Animated Progress Gauge */}
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-950">
                      <div
                        className={`h-full bg-gradient-to-r ${cohort.barColor} transition-all duration-1000 ease-out`}
                        style={{ width: `${cohort.churnRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* SHAP Insight Block */}
              <div className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/20 backdrop-blur-md space-y-2">
                <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest flex items-center space-x-2">
                  <span>🔬</span>
                  <span>Feature Attribution Insight</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {activeData.why}
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Actionable Strategic Advice Card */}
          <Card className="border border-violet-500/25 bg-violet-500/5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-violet-400 flex items-center space-x-2">
                <span>🛡️</span>
                <span>Strategic Retention Recommendation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {activeData.recommendation}
              </p>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  )
}
