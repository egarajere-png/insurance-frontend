import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

export function Stepper({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <ol className="mb-6 flex flex-wrap items-center gap-y-3">
      {steps.map((step, i) => {
        const isDone = i < currentStep;
        const isActive = i === currentStep;
        return (
          <li key={step} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  isDone && "bg-brand-500 text-white",
                  isActive && !isDone && "bg-brand-500 text-white ring-4 ring-brand-100",
                  !isActive && !isDone && "bg-slate-100 text-slate-400"
                )}
              >
                {isDone ? <Check className="size-4" /> : i + 1}
              </div>
              <span className={cn("text-sm font-medium", isActive || isDone ? "text-slate-900" : "text-slate-400")}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && <div className="mx-3 h-px w-8 bg-slate-200 sm:w-12" />}
          </li>
        );
      })}
    </ol>
  );
}
