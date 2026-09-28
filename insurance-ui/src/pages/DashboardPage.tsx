import { Users, ShieldCheck, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardBody } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { useCustomers } from "../hooks/useCustomers";
import { useProducts } from "../hooks/useProducts";

function StatCard({
  icon: Icon,
  label,
  value,
  isLoading,
  to,
}: {
  icon: typeof Users;
  label: string;
  value: number | string;
  isLoading?: boolean;
  to: string;
}) {
  return (
    <Link to={to}>
      <Card className="transition-shadow hover:shadow-md">
        <CardBody className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            {isLoading ? (
              <Skeleton className="mt-2 h-7 w-14" />
            ) : (
              <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
            )}
          </div>
          <div className="flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Icon className="size-5" />
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { data: products, isLoading: productsLoading } = useProducts();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Operational overview of customers, products and applications."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Users} label="Total Customers" value={customers?.length ?? 0} isLoading={customersLoading} to="/customers" />
        <StatCard icon={ShieldCheck} label="Insurance Products" value={products?.length ?? 0} isLoading={productsLoading} to="/products" />
        <StatCard icon={FileText} label="Applications" value="—" to="/applications" />
      </div>

      <Card className="mt-6">
        <CardBody className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-warning-50 text-warning-700">
            <FileText className="size-4.5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Applications count isn't shown</p>
            <p className="mt-1 text-sm text-slate-500">
              The backend only exposes applications per customer (<code className="rounded bg-slate-100 px-1 py-0.5 text-xs">/customer-product/list/&#123;email&#125;</code>),
              not a global list. An aggregate total would need an admin-facing "list all applications" endpoint — flagged as a
              backend gap rather than derived by looping over every customer.
            </p>
          </div>
        </CardBody>
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/customers" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700">
          View all customers <ArrowRight className="size-4" />
        </Link>
        <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700">
          Browse insurance products <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
