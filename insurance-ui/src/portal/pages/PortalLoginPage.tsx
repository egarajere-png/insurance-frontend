import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import abcLogo from "../../assets/abc-logo.png";
import { Button } from "../../components/ui/Button";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { usePortalAuth } from "../context/usePortalAuth";

export default function PortalLoginPage() {
  const { customer, isLoading, error, login } = usePortalAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!isLoading && customer) {
    return <Navigate to="/portal" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await login(email);
      navigate("/portal", { replace: true });
    } catch {
      // error is surfaced via usePortalAuth().error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-xl bg-white p-2 shadow-sm">
            <img src={abcLogo} alt="ABC Bank" className="size-full object-contain" />
          </div>
          <h1 className="mt-4 text-lg font-semibold text-slate-900">Customer Portal</h1>
          <p className="mt-1 text-sm text-slate-500">
            Preview build — this stands in for Keycloak login until that's wired up. Enter the email address on your
            insurance record.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <FormField label="Email Address" error={error ?? undefined}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              hasError={!!error}
              autoFocus
            />
          </FormField>
          <Button type="submit" className="w-full" isLoading={submitting}>
            Continue
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Are you an admin? <a href="/" className="font-medium text-brand-600 hover:text-brand-700">Go to the admin dashboard</a>
        </p>
      </div>
    </div>
  );
}
