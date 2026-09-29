import { Pencil, Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import type { Product } from "../../types/insurance";

function currency(n: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);
}

export function ProductDetailModal({
  isOpen,
  onClose,
  product,
  onEdit,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!product) return null;

  const rows: [string, string][] = [
    ["Benefit", currency(product.benefit)],
    ["Child Benefit", currency(product.benefitChild)],
    ["Annual Premium", currency(product.premium)],
    ["Additional Child Premium", currency(product.premiumAdditionalChild)],
    ["Additional Adult/Child Premium", currency(product.premiumAdditionalAdultChild)],
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      description={product.description}
      size="lg"
      footer={
        <>
          <Button variant="outline" className="text-danger-700" onClick={onDelete}>
            <Trash2 className="size-4" /> Delete
          </Button>
          <Button onClick={onEdit}>
            <Pencil className="size-4" /> Edit Product
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Badge tone={product.plan === "Pro" ? "brand" : "neutral"}>{product.plan} Plan</Badge>
        <dl className="divide-y divide-slate-100 rounded-lg border border-slate-100">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-medium text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Modal>
  );
}
