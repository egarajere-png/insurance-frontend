import { useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, ShieldCheck, X } from "lucide-react";
import { PortalSidebar } from "./PortalSidebar";
import { PortalHeader } from "./PortalHeader";
import { usePortalAuth } from "./context/usePortalAuth";
import { cn } from "../lib/cn";
import abcLogo from "../assets/abc-logo.png";

const navItems = [
  { to: "/portal", label: "My Applications", icon: LayoutDashboard, end: true },
  { to: "/portal/products", label: "Insurance Products", icon: ShieldCheck, end: false },
];

function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-slate-900/50" onClick={onClose} aria-hidden />
      <div className="relative flex h-full w-64 flex-col bg-navy-900">
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white p-1">
              <img src={abcLogo} alt="ABC Bank" className="size-full object-contain" />
            </div>
            <p className="text-sm font-semibold text-white">ABC Bank Insurance</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-brand-500 text-white" : "text-slate-300 hover:bg-navy-800 hover:text-white"
                )
              }
            >
              <item.icon className="size-4.5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function PortalLayout() {
  const { customer, isLoading } = usePortalAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading…</div>;
  }

  if (!customer) {
    return <Navigate to="/portal/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <PortalSidebar />
      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <PortalHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
