// frontend/components/PredictionForm.tsx
import React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { predict, PredictionRequest, PredictionResponse } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  tenure: z.number().min(0, "Tenure must be at least 0 months").max(72, "Tenure cannot exceed 72 months"),
  MonthlyCharges: z.number().min(0, "Charges must be at least $0").max(150, "Charges cannot exceed $150"),
  MultipleLines: z.enum(["No", "Yes"]),
  InternetService: z.enum(["DSL", "Fiber optic", "No"]),
  StreamingTV: z.enum(["No", "Yes", "No internet service"]),
  StreamingMovies: z.enum(["No", "Yes", "No internet service"]),
  Contract: z.enum(["Month-to-month", "One year", "Two year"]),
});

type FormValues = z.infer<typeof formSchema>;

interface PredictionFormProps {
  onSuccess: (result: PredictionResponse) => void;
  onError: (error: string) => void;
  onStartLoading: () => void;
  loading: boolean;
}

export function PredictionForm({ onSuccess, onError, onStartLoading, loading }: PredictionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      tenure: 12,
      MonthlyCharges: 70,
      MultipleLines: "No",
      InternetService: "DSL",
      StreamingTV: "No",
      StreamingMovies: "No",
      Contract: "Month-to-month",
    },
  });

  const onSubmit = async (values: FormValues) => {
    onStartLoading();
    try {
      const response = await predict(values as PredictionRequest);
      onSuccess(response);
    } catch (err: any) {
      onError(err.message || "Failed to make prediction");
    }
  };

  return (
    <Card className="w-full border border-slate-900 bg-slate-950/70 backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:border-violet-500/30 hover:shadow-[0_0_50px_rgba(139,92,246,0.08)]">
      <CardHeader className="border-b border-slate-900/60 pb-5">
        <CardTitle className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <span>📉</span>
          <span>Customer Insights Form</span>
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs">
          Enter subscription parameters to evaluate the risk of user cancellation.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Section 1: Account Details */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-500 border-b border-slate-900 pb-1">
              Account details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Tenure Slider */}
              <div className="space-y-2 flex flex-col justify-end">
                <Label htmlFor="tenure">Tenure (months)</Label>
                <Controller
                  name="tenure"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      id="tenure"
                      min={0}
                      max={72}
                      step={1}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.tenure && (
                  <p className="text-xs text-rose-400 font-semibold mt-1">{errors.tenure.message}</p>
                )}
              </div>

              {/* Contract Type */}
              <div className="space-y-2">
                <Label htmlFor="Contract">Contract Type</Label>
                <Select id="Contract" {...register("Contract")} defaultValue="Month-to-month">
                  <option value="Month-to-month">Month-to-month</option>
                  <option value="One year">One year</option>
                  <option value="Two year">Two year</option>
                </Select>
                {errors.Contract && (
                  <p className="text-xs text-rose-400 font-semibold mt-1">{errors.Contract.message}</p>
                )}
              </div>

            </div>
          </div>

          {/* Section 2: Financial Details */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-500 border-b border-slate-900 pb-1">
              Financial parameters
            </h4>
            <div className="space-y-2">
              <Label htmlFor="MonthlyCharges">Monthly Charges ($)</Label>
              <Input
                id="MonthlyCharges"
                type="number"
                step="0.01"
                placeholder="70.00"
                {...register("MonthlyCharges", { valueAsNumber: true })}
              />
              <span className="text-[10px] text-slate-500 font-medium block">Allowed range: $0.00 to $150.00</span>
              {errors.MonthlyCharges && (
                <p className="text-xs text-rose-400 font-semibold mt-1">{errors.MonthlyCharges.message}</p>
              )}
            </div>
          </div>

          {/* Section 3: Subscribed Services */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-500 border-b border-slate-900 pb-1">
              Subscribed services
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Internet Service */}
              <div className="space-y-2">
                <Label htmlFor="InternetService">Internet Service</Label>
                <Select id="InternetService" {...register("InternetService")} defaultValue="DSL">
                  <option value="DSL">DSL</option>
                  <option value="Fiber optic">Fiber optic</option>
                  <option value="No">No Internet Service</option>
                </Select>
                {errors.InternetService && (
                  <p className="text-xs text-rose-400 font-semibold mt-1">{errors.InternetService.message}</p>
                )}
              </div>

              {/* Multiple Lines */}
              <div className="space-y-2">
                <Label htmlFor="MultipleLines">Multiple Lines</Label>
                <Select id="MultipleLines" {...register("MultipleLines")} defaultValue="No">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </Select>
                {errors.MultipleLines && (
                  <p className="text-xs text-rose-400 font-semibold mt-1">{errors.MultipleLines.message}</p>
                )}
              </div>

              {/* Streaming TV */}
              <div className="space-y-2">
                <Label htmlFor="StreamingTV">Streaming TV</Label>
                <Select id="StreamingTV" {...register("StreamingTV")} defaultValue="No">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No internet service">No internet service</option>
                </Select>
                {errors.StreamingTV && (
                  <p className="text-xs text-rose-400 font-semibold mt-1">{errors.StreamingTV.message}</p>
                )}
              </div>

              {/* Streaming Movies */}
              <div className="space-y-2">
                <Label htmlFor="StreamingMovies">Streaming Movies</Label>
                <Select id="StreamingMovies" {...register("StreamingMovies")} defaultValue="No">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="No internet service">No internet service</option>
                </Select>
                {errors.StreamingMovies && (
                  <p className="text-xs text-rose-400 font-semibold mt-1">{errors.StreamingMovies.message}</p>
                )}
              </div>

            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full font-bold uppercase tracking-wider py-6"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Evaluating...</span>
              </span>
            ) : (
              "Calculate Churn Probability"
            )}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}
