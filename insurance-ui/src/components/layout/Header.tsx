import { Menu } from "lucide-react";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="flex size-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 lg:hidden"
      >
        <Menu className="size-5" />
      </button>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-200">
          Admin mode &middot; no login required
        </span>
      </div>
    </header>
  );
}
