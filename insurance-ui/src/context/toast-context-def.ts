import { createContext } from "react";

export interface ToastContextValue {
  showToast: (toast: { tone: "success" | "error" | "info"; title: string; description?: string }) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
