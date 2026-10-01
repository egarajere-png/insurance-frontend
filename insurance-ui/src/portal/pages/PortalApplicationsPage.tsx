import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileDown, Clock, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { useCustomerApplications } from "../../hooks/useApplications";
import { usePortalAuth } from "../context/usePortalAuth";
import { applicationApi } from "../../api/applicationApi";
import { getErrorMessage } from "../../api/client";
import { useToast } from "../../hooks/useToast";
import type { ApplicationStatus, CustomerProduct } from "../../types/insurance";

const FILTERS: { label: string; value: ApplicationStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending Review", value: "PENDING_REVIEW" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

function statusMeta(status: ApplicationStatus) {
  if (status === "APPROVED") return { tone: "success" as const, icon: CheckCircle2, label: "Approved" };
  if (status === "REJECTED") return { tone: "danger" as const, icon: XCircle, label: "Rejected" };
  return { tone: "warning" as const, icon: Clock, label: "Pending Review" };
}

function DownloadButton({ applicationId }: { applicationId: number }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const url = await applicationApi.getPdfBlobUrlById(applicationId);
      window.open(url, "_blank", "noreferrer");
    } catch (err) {
      showToast({ tone: "error", title: "Couldn't open PDF", description: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      isLoading={loading}
      onClick={(e) => {
        e.stopPropagation();
        handleDownload();
      }}
    >
      <FileDown className="size-3.5" /> PDF
    </Button>
  );
}

export default function PortalApplicationsPage() {
  const { customer } = usePortalAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const { data: applications, isLoading, isError } = useCustomerApplications(customer?.emailAddress);

  const filtered = useMemo(() => {
    if (!applications) return applications;
    if (filter === "ALL") return applications;
    return applications.filter((a) => a.status === filter);
  }, [applications, filter]);

  const columns: Column<CustomerProduct>[] = [
    { key: "product", header: "Product", render: (a) => <span className="font-medium text-slate-900">{a.product?.name}</span> },
    { key: "plan", header: "Plan", render: (a) => <Badge tone={a.product?.plan === "Pro" ? "brand" : "neutral"}>{a.product?.plan}</Badge> },
    { key: "initiatedBy", header: "Initiated By", render: (a) => a.createdBy ?? "—" },
    {
      key: "status",
      header: "Status",
      render: (a) => {
        const meta = statusMeta(a.status);
        return (
          <Badge tone={meta.tone}>
            <meta.icon className="mr-1 inline size-3" />
            {meta.label}
          </Badge>
        );
      },
    },
    {
      key: "submittedOn",
      header: "Submitted",
      render: (a) => ((a.submittedOn ?? a.createdOn) ? new Date((a.submittedOn ?? a.createdOn) as string).toLocaleDateString() : "—"),
    },
    {
      key: "reviewedOn",
      header: "Reviewed",
      render: (a) => (a.reviewedOn ? new Date(a.reviewedOn).toLocaleDateString() : "—"),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (a) => (a.status === "APPROVED" ? <DownloadButton applicationId={a.id} /> : null),
    },
  ];

  return (
    <div>
      <PageHeader
        title="My Applications"
        description="Track the status of every insurance application you've submitted."
        action={
          <Link to="/portal/applications/new">
            <Button>New Application</Button>
          </Link>
        }
      />

      <Card>
        <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1 m-4 w-fit">
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

        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          isError={isError}
          rowKey={(a) => a.id}
          onRowClick={(a) => navigate(`/portal/applications/${a.id}`)}
          emptyTitle="No applications found"
          emptyDescription={filter === "ALL" ? "Once you submit an application, it'll show up here." : "No applications match this filter."}
        />
      </Card>
    </div>
  );
}
