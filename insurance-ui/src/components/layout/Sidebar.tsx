import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, ShieldCheck, FileText } from "lucide-react";
import { cn } from "../../lib/cn";
import abcLogo from "../../assets/abc-logo.png";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/products", label: "Insurance Products", icon: ShieldCheck },
  { to: "/applications", label: "Applications", icon: FileText },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-navy-900 lg:flex">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-white p-1">
          <img src={abcLogo} alt="ABC Bank" className="size-full object-contain" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-tight">ABC Bank Insurance</p>
          <p className="text-xs text-slate-400 leading-tight">Management System</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-500 text-white"
                  : "text-slate-300 hover:bg-navy-800 hover:text-white"
              )
            }
          >
            <item.icon className="size-4.5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-navy-800 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-navy-700 text-xs font-semibold text-white">
            AD
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">Administrator</p>
            <p className="truncate text-xs text-slate-400">Full access</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
