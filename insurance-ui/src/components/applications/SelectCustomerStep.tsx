import { useMemo, useState } from "react";
import { Search, UserPlus, Check } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { useCustomers } from "../../hooks/useCustomers";
import type { Customer } from "../../types/insurance";

export function SelectCustomerStep({
  selected,
  onSelect,
  onCreateNew,
}: {
  selected: Customer | null;
  onSelect: (c: Customer) => void;
  onCreateNew: () => void;
}) {
  const { data: customers, isLoading } = useCustomers();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!customers) return [];
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => c.name?.toLowerCase().includes(q) || c.emailAddress?.toLowerCase().includes(q));
  }, [customers, search]);

  return (
    <Card>
      <CardBody>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers by name or email"
              className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <Button variant="outline" onClick={onCreateNew}>
            <UserPlus className="size-4" /> New Customer
          </Button>
        </div>

        {isLoading && <p className="py-8 text-center text-sm text-slate-500">Loading customers…</p>}

        {!isLoading && filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">No customers found. Create one to continue.</p>
        )}

        <div className="max-h-80 space-y-1 overflow-y-auto scrollbar-thin">
          {filtered.map((c) => {
            const isSelected = selected?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c)}
                className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                  isSelected ? "border-brand-400 bg-brand-50" : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div>
                  <p className="font-medium text-slate-900">{c.name}</p>
                  <p className="text-slate-500">{c.emailAddress}</p>
                </div>
                {isSelected && <Check className="size-4 text-brand-600" />}
              </button>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
