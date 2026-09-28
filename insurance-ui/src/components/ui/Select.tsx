import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, hasError, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none rounded-md border bg-white px-3 py-2 pr-9 text-sm text-slate-900",
          "focus:outline-none focus:ring-2 focus:ring-brand-100",
          hasError ? "border-danger-500 focus:border-danger-500" : "border-slate-300 focus:border-brand-400",
          "disabled:bg-slate-50 disabled:text-slate-400",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
});
Select.displayName = "Select";
