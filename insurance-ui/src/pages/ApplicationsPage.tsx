import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Select } from "../components/ui/Select";
import { DataTable, type Column } from "../components/ui/DataTable";
import { ApplicationDetailModal } from "../components/applications/ApplicationDetailModal";
import { useApplications } from "../hooks/useApplications";
import type { ApplicationStatus, CustomerProduct, Plan } from "../types/insurance";

const FILTERS: { label: string; value: ApplicationStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending Review", value: "PENDING_REVIEW" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const PLAN_FILTERS: { label: string; value: Plan | "ALL" }[] = [
  { label: "All Plans", value: "ALL" },
  { label: "Basic", value: "Basic" },
  { label: "Pro", value: "Pro" },
];

function statusTone(status: ApplicationStatus) {
  if (status === "APPROVED") return "success" as const;
  if (status === "REJECTED") return "danger" as const;
  return "warning" as const;
}

export default function ApplicationsPage() {
  const [filter, setFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const [planFilter, setPlanFilter] = useState<Plan | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CustomerProduct | null>(null);

  const { data: applications, isLoading, isError } = useApplications(filter === "ALL" ? undefined : filter);

  const filtered = useMemo(() => {
    if (!applications) return applications;
    const q = search.trim().toLowerCase();
    return applications.filter((a) => {
      if (planFilter !== "ALL" && a.product?.plan !== planFilter) return false;
      if (!q) return true;
      return (
        a.customer?.name?.toLowerCase().includes(q) ||
        a.customer?.emailAddress?.toLowerCase().includes(q) ||
        a.product?.name?.toLowerCase().includes(q)
      );
    });
  }, [applications, search, planFilter]);

  const columns: Column<CustomerProduct>[] = [
    { key: "customer", header: "Customer", render: (a) => <span className="font-medium text-slate-900">{a.customer?.name}</span> },
    { key: "product", header: "Product", render: (a) => a.product?.name },
    { key: "plan", header: "Plan", render: (a) => <Badge tone="info">{a.product?.plan}</Badge> },
    { key: "status", header: "Status", render: (a) => <Badge tone={statusTone(a.status)}>{a.status.replace("_", " ")}</Badge> },
    { key: "initiatedBy", header: "Initiated By", render: (a) => a.createdBy ?? "—" },
    { key: "reviewedBy", header: "Reviewed By", render: (a) => a.reviewedBy ?? "—" },
    {
      key: "createdOn",
      header: "Submitted",
      render: (a) => ((a.submittedOn ?? a.createdOn) ? new Date((a.submittedOn ?? a.createdOn) as string).toLocaleDateString() : "—"),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Every insurance application in the system — this is the audit station."
        action={
          <Link to="/applications/new">
            <Button>New Application</Button>
          </Link>
        }
      />

      <ApplicationDetailModal isOpen={!!selected} application={selected} onClose={() => setSelected(null)} />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value as Plan | "ALL")}
              className="sm:w-36"
            >
              {PLAN_FILTERS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>
            <div className="relative max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer or product"
                className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          isError={isError}
          rowKey={(a) => a.id}
          onRowClick={(a) => setSelected(a)}
          emptyTitle="No applications found"
          emptyDescription={filter === "ALL" ? "Applications will appear here once customers apply." : "No applications match this filter."}
        />
      </Card>
    </div>
  );
}
