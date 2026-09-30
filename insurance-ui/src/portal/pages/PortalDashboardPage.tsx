import { Link } from "react-router-dom";
import { Clock, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { useCustomerApplications } from "../../hooks/useApplications";
import { usePortalAuth } from "../context/usePortalAuth";
import type { CustomerProduct } from "../../types/insurance";

function statusMeta(status: CustomerProduct["status"]) {
  if (status === "APPROVED") return { tone: "success" as const, icon: CheckCircle2, label: "Approved" };
  if (status === "REJECTED") return { tone: "danger" as const, icon: XCircle, label: "Rejected" };
  return { tone: "warning" as const, icon: Clock, label: "Pending Review" };
}

export default function PortalDashboardPage() {
  const { customer } = usePortalAuth();
  const { data: applications, isLoading, isError } = useCustomerApplications(customer?.emailAddress);

  return (
    <div>
      <PageHeader title="My Applications" description="Track the status of every insurance application you've submitted." />

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <Card>
          <CardBody className="py-10 text-center text-sm text-danger-700">Couldn't load your applications. Please try again.</CardBody>
        </Card>
      )}

      {!isLoading && !isError && applications?.length === 0 && (
        <Card>
          <CardBody className="flex flex-col items-center gap-2 py-14 text-center">
            <p className="text-sm font-medium text-slate-700">No applications yet</p>
            <p className="text-sm text-slate-500">Once an application is submitted on your behalf, it'll show up here.</p>
          </CardBody>
        </Card>
      )}

      {!isLoading && !isError && applications && applications.length > 0 && (
        <div className="space-y-3">
          {applications.map((application) => {
            const meta = statusMeta(application.status);
            return (
              <Link key={application.id} to={`/portal/applications/${application.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardBody className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-10 items-center justify-center rounded-lg ${
                          meta.tone === "success"
                            ? "bg-success-50 text-success-700"
                            : meta.tone === "danger"
                              ? "bg-danger-50 text-danger-700"
                              : "bg-warning-50 text-warning-700"
                        }`}
                      >
                        <meta.icon className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{application.product?.name}</p>
                        <p className="text-sm text-slate-500">
                          {application.product?.plan} Plan ·{" "}
                          {application.submittedOn ? new Date(application.submittedOn).toLocaleDateString() : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                      <ChevronRight className="size-4 text-slate-400" />
                    </div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
