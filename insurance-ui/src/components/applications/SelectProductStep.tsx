import { Check, ShieldCheck } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { useProducts } from "../../hooks/useProducts";
import type { Product } from "../../types/insurance";

function currency(n: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);
}

export function SelectProductStep({ selected, onSelect }: { selected: Product | null; onSelect: (p: Product) => void }) {
  const { data: products, isLoading } = useProducts();

  if (isLoading) return <p className="py-8 text-center text-sm text-slate-500">Loading products…</p>;

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardBody className="py-10 text-center text-sm text-slate-500">
          No insurance products are available yet. Add one from the Products page first.
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {products.map((p) => {
        const isSelected = selected?.id === p.id;
        return (
          <button key={p.id} onClick={() => onSelect(p)} className="text-left">
            <Card className={isSelected ? "ring-2 ring-brand-400" : "hover:shadow-md"}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={p.plan === "Pro" ? "brand" : "neutral"}>{p.plan}</Badge>
                    {isSelected && <Check className="size-4 text-brand-600" />}
                  </div>
                </div>
                <h3 className="mt-3 text-base font-semibold text-slate-900">{p.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{p.description}</p>
                <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-sm">
                  <span className="text-slate-500">Premium</span>
                  <span className="font-medium text-slate-900">{currency(p.premium)}</span>
                </div>
              </CardBody>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
