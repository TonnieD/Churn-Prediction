// frontend/components/ui/alert.tsx
import * as React from "react"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success";
}

export function Alert({ className, variant = "default", ...props }: AlertProps) {
  const baseStyles = "relative w-full rounded-xl border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";
  
  const variants = {
    default: "bg-slate-900 border-slate-800 text-slate-100 [&>svg]:text-slate-400",
    destructive: "bg-red-500/10 border-red-500/20 text-red-200 [&>svg]:text-red-400",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200 [&>svg]:text-emerald-400",
  };

  return (
    <div
      role="alert"
      className={`${baseStyles} ${variants[variant]} ${className || ""}`}
      {...props}
    />
  )
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={`mb-1 font-bold leading-none tracking-tight text-white ${className || ""}`} {...props} />
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={`text-sm text-slate-300 opacity-90 [&_p]:leading-relaxed ${className || ""}`} {...props} />
}
