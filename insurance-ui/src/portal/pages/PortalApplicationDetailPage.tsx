import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle2, XCircle, FileDown, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { useApplication } from "../../hooks/useApplications";
import { useCustomerDependants } from "../../hooks/useDependants";
import { applicationApi } from "../../api/applicationApi";
import { getErrorMessage } from "../../api/client";
import { usePortalAuth } from "../context/usePortalAuth";

function statusMeta(status: string) {
  if (status === "APPROVED") return { tone: "success" as const, icon: CheckCircle2, label: "Approved" };
  if (status === "REJECTED") return { tone: "danger" as const, icon: XCircle, label: "Rejected" };
  return { tone: "warning" as const, icon: Clock, label: "Pending Review" };
}

export default function PortalApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { customer } = usePortalAuth();
  const { data: application, isLoading } = useApplication(id ? Number(id) : undefined);
  const { data: dependants } = useCustomerDependants(customer?.id);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!application || application.customer?.emailAddress !== customer?.emailAddress) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium text-slate-700">Application not found</p>
        <Link to="/portal" className="mt-2 inline-block text-sm text-brand-600 hover:text-brand-700">
          Back to my applications
        </Link>
      </div>
    );
  }

  const meta = statusMeta(application.status);
  const isApproved = application.status === "APPROVED";

  const handleDownload = async () => {
    setPdfLoading(true);
    setPdfError(null);
    try {
      const url = await applicationApi.getPdfBlobUrlById(application.id);
      window.open(url, "_blank", "noreferrer");
    } catch (err) {
      setPdfError(getErrorMessage(err));
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div>
      <Link to="/portal" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="size-4" /> Back to my applications
      </Link>

      <PageHeader
        title={application.product?.name ?? "Application"}
        description="This is a read-only view of your application — changes can only be made by the bank."
        action={
          isApproved ? (
            <Button onClick={handleDownload} isLoading={pdfLoading}>
              <FileDown className="size-4" /> Download Document
            </Button>
          ) : undefined
        }
      />

      {pdfError && <p className="mb-4 text-sm text-danger-700">{pdfError}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader title="Status" />
          <CardBody>
            <div className="flex items-center gap-2">
              <Badge tone={meta.tone}>{meta.label}</Badge>
            </div>
            <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Submitted</dt>
                <dd className="text-slate-900">
                  {(application.submittedOn ?? application.createdOn) ? new Date((application.submittedOn ?? application.createdOn) as string).toLocaleDateString() : "—"}
                </dd>
              </div>
              {application.reviewedOn && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">{isApproved ? "Approved" : "Reviewed"}</dt>
                  <dd className="text-slate-900">{new Date(application.reviewedOn).toLocaleDateString()}</dd>
                </div>
              )}
              {application.status === "REJECTED" && application.reviewNotes && (
                <div className="pt-2">
                  <dt className="text-slate-500">Reason</dt>
                  <dd className="mt-1 text-slate-900">{application.reviewNotes}</dd>
                </div>
              )}
            </dl>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Product" />
          <CardBody>
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{application.product?.name}</p>
                <p className="text-sm text-slate-500">{application.product?.description}</p>
              </div>
              <Badge tone={application.product?.plan === "Pro" ? "brand" : "neutral"} className="ml-auto">
                {application.product?.plan}
              </Badge>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader title="Health Declaration" />
          <CardBody className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">In good health</span>
              <Badge tone={application.inGoodHealth ? "success" : "warning"}>{application.inGoodHealth ? "Yes" : "No"}</Badge>
            </div>
            {!application.inGoodHealth && application.healthStatus && <p className="text-slate-700">{application.healthStatus}</p>}
            <div className="flex justify-between">
              <span className="text-slate-500">Specific diagnosis declared</span>
              <Badge tone={application.specificDiasgnosis ? "warning" : "neutral"}>{application.specificDiasgnosis ? "Yes" : "No"}</Badge>
            </div>
            {application.specificDiasgnosis && application.specificDiasgnosisStatus && (
              <p className="text-slate-700">{application.specificDiasgnosisStatus}</p>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader title="Dependants & Beneficiaries" />
          <CardBody>
            {!dependants?.length ? (
              <p className="text-sm text-slate-500">No dependants or beneficiaries on file.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {dependants.map((d) => (
                  <div key={d.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div className="flex items-center gap-2.5">
                      <Users className="size-4 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">{d.name}</p>
                        <p className="text-slate-500">{d.relationship}</p>
                      </div>
                    </div>
                    <Badge tone="brand">{d.personType}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
