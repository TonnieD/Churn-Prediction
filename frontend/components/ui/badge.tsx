// frontend/components/ui/badge.tsx
import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400";
  
  const variants = {
    default: "bg-violet-600 text-white hover:bg-violet-500",
    secondary: "bg-slate-800 text-slate-300 hover:bg-slate-700",
    destructive: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
    success: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20",
    outline: "border border-slate-700 text-slate-300",
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className || ""}`}
      {...props}
    />
  );
}
