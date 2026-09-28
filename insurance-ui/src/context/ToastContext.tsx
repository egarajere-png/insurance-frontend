import { useCallback, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "../lib/cn";
import { ToastContext } from "./toast-context-def";

type ToastTone = "success" | "error" | "info";

interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

const toneConfig: Record<ToastTone, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: "border-l-success-500 text-success-700" },
  error: { icon: XCircle, classes: "border-l-danger-500 text-danger-700" },
  info: { icon: Info, classes: "border-l-info-500 text-info-700" },
};

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => {
          const { icon: Icon, classes } = toneConfig[toast.tone];
          return (
            <div
              key={toast.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border-l-4 bg-white px-4 py-3 shadow-lg ring-1 ring-black/5",
                classes
              )}
            >
              <Icon className="mt-0.5 size-5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{toast.title}</p>
                {toast.description && <p className="mt-0.5 text-sm text-slate-500">{toast.description}</p>}
              </div>
              <button onClick={() => dismiss(toast.id)} className="text-slate-400 hover:text-slate-600">
                <X className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
