import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Normalizes Axios errors into a plain message a UI component can show
 * directly, without leaking raw stack traces / Axios internals.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data as { message?: string } | string | undefined;
      if (typeof data === "string" && data.trim()) return data;
      if (data && typeof data === "object" && data.message) return data.message;
      return `Request failed (${error.response.status})`;
    }
    if (error.request) {
      return "Couldn't reach the server. Check your connection and try again.";
    }
  }
  return "Something went wrong. Please try again.";
}
