import { useState } from "react";
import { ShieldCheck, Plus } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { ProductFormModal } from "../components/products/ProductFormModal";
import { useProducts } from "../hooks/useProducts";

function currency(n: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);
}

export default function ProductsPage() {
  const { data: products, isLoading, isError } = useProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Insurance Products"
        description="Available plans customers can apply for."
        action={
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="size-4" /> New Product
          </Button>
        }
      />

      <ProductFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <Card>
          <CardBody className="py-10 text-center text-sm text-danger-700">
            Couldn't load products. Please try again.
          </CardBody>
        </Card>
      )}

      {!isLoading && !isError && products?.length === 0 && (
        <Card>
          <CardBody className="flex flex-col items-center gap-2 py-14 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <ShieldCheck className="size-5" />
            </div>
            <p className="text-sm font-medium text-slate-700">No products yet</p>
            <p className="text-sm text-slate-500">Insurance products will appear here once added.</p>
          </CardBody>
        </Card>
      )}

      {!isLoading && !isError && products && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardBody className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <ShieldCheck className="size-5" />
                  </div>
                  <Badge tone={product.plan === "Pro" ? "brand" : "neutral"}>{product.plan}</Badge>
                </div>
                <h3 className="mt-3 text-base font-semibold text-slate-900">{product.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.description}</p>

                <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Benefit</dt>
                    <dd className="font-medium text-slate-900">{currency(product.benefit)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Child Benefit</dt>
                    <dd className="font-medium text-slate-900">{currency(product.benefitChild)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Premium</dt>
                    <dd className="font-medium text-slate-900">{currency(product.premium)}</dd>
                  </div>
                </dl>

                <Button variant="outline" className="mt-4 w-full">
                  View Details
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
