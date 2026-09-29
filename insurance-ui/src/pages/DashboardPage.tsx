import { useState } from "react";
import { Users, ShieldCheck, FileText, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardBody } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { Badge } from "../components/ui/Badge";
import { DataTable, type Column } from "../components/ui/DataTable";
import { ApplicationDetailModal } from "../components/applications/ApplicationDetailModal";
import { useCustomers } from "../hooks/useCustomers";
import { useProducts } from "../hooks/useProducts";
import { useApplications, useDashboardStats } from "../hooks/useApplications";
import type { ApplicationStatus, CustomerProduct } from "../types/insurance";

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
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  // Toggle: applications that are pending review (submitted by a customer, awaiting
  // an admin decision) vs applications already approved.
  const [tab, setTab] = useState<ApplicationStatus>("PENDING_REVIEW");
  const { data: applications, isLoading: applicationsLoading, isError } = useApplications(tab);
  const [selected, setSelected] = useState<CustomerProduct | null>(null);

  const columns: Column<CustomerProduct>[] = [
    { key: "customer", header: "Customer", render: (a) => <span className="font-medium text-slate-900">{a.customer?.name}</span> },
    { key: "product", header: "Product", render: (a) => a.product?.name },
    { key: "plan", header: "Plan", render: (a) => <Badge tone="info">{a.product?.plan}</Badge> },
    { key: "initiatedBy", header: "Initiated By", render: (a) => a.createdBy ?? "—" },
    {
      key: "when",
      header: tab === "PENDING_REVIEW" ? "Submitted" : "Approved",
      render: (a) => {
        const d = tab === "PENDING_REVIEW" ? a.submittedOn ?? a.createdOn : a.reviewedOn;
        return d ? new Date(d).toLocaleDateString() : "—";
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Operational overview of customers, products and applications."
      />

      <ApplicationDetailModal isOpen={!!selected} application={selected} onClose={() => setSelected(null)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Customers" value={customers?.length ?? 0} isLoading={customersLoading} to="/customers" />
        <StatCard icon={ShieldCheck} label="Insurance Products" value={products?.length ?? 0} isLoading={productsLoading} to="/products" />
        <StatCard icon={Clock} label="Pending Review" value={stats?.pendingReview ?? 0} isLoading={statsLoading} to="/applications" />
        <StatCard icon={CheckCircle2} label="Approved" value={stats?.approved ?? 0} isLoading={statsLoading} to="/applications" />
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setTab("PENDING_REVIEW")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === "PENDING_REVIEW" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Clock className="size-3.5" /> Pending Review
            </button>
            <button
              onClick={() => setTab("APPROVED")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === "APPROVED" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <CheckCircle2 className="size-3.5" /> Approved
            </button>
          </div>
          <Link to="/applications" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={applications}
          isLoading={applicationsLoading}
          isError={isError}
          rowKey={(a) => a.id}
          onRowClick={(a) => setSelected(a)}
          emptyTitle={tab === "PENDING_REVIEW" ? "No applications pending review" : "No approved applications yet"}
          emptyDescription={
            tab === "PENDING_REVIEW"
              ? "Applications appear here once a customer finishes and submits one."
              : "Approved applications will show up here once an admin accepts one."
          }
        />
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/customers" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700">
          <Users className="size-4" /> View all customers
        </Link>
        <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700">
          <FileText className="size-4" /> Browse insurance products
        </Link>
      </div>
    </div>
  );
}
