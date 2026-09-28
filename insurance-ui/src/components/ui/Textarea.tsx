import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, hasError, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-md border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-brand-100",
        hasError ? "border-danger-500 focus:border-danger-500" : "border-slate-300 focus:border-brand-400",
        "disabled:bg-slate-50 disabled:text-slate-400",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
