// frontend/components/ui/slider.tsx
import * as React from "react"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, min, max, step = 1, onChange, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-4 w-full">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`h-2 w-full cursor-pointer rounded-lg appearance-none bg-slate-800 accent-violet-500 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${className || ""}`}
          ref={ref}
          {...props}
        />
        <span className="text-sm font-bold text-violet-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 min-w-[3rem] text-center">
          {value}
        </span>
      </div>
    )
  }
)
Slider.displayName = "Slider"
