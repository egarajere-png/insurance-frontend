import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-semibold text-slate-200">404</p>
      <p className="mt-2 text-lg font-medium text-slate-900">Page not found</p>
      <p className="mt-1 text-sm text-slate-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-5">
        <Button variant="outline">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
