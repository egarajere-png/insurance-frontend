import { useState } from "react";
import { CheckCircle2, XCircle, FileDown, User, ShieldCheck } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Textarea } from "../ui/Textarea";
import { FormField } from "../ui/FormField";
import { useApproveApplication, useRejectApplication } from "../../hooks/useApplications";
import { applicationApi } from "../../api/applicationApi";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../api/client";
import type { CustomerProduct } from "../../types/insurance";

function statusTone(status: CustomerProduct["status"]) {
  if (status === "APPROVED") return "success" as const;
  if (status === "REJECTED") return "danger" as const;
  return "warning" as const;
}

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString() : "—";
}

export function ApplicationDetailModal({
  isOpen,
  onClose,
  application,
}: {
  isOpen: boolean;
  onClose: () => void;
  application: CustomerProduct | null;
}) {
  const { showToast } = useToast();
  const approve = useApproveApplication();
  const reject = useRejectApplication();
  const [rejectNotes, setRejectNotes] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  if (!application) return null;

  const isPending = application.status === "PENDING_REVIEW";
  const isApproved = application.status === "APPROVED";

  const handleApprove = async () => {
    try {
      await approve.mutateAsync({ id: application.id });
      showToast({ tone: "success", title: "Application approved" });
      onClose();
    } catch (err) {
      showToast({ tone: "error", title: "Couldn't approve", description: getErrorMessage(err) });
    }
  };

  const handleReject = async () => {
    try {
      await reject.mutateAsync({ id: application.id, notes: rejectNotes });
      showToast({ tone: "success", title: "Application rejected" });
      setShowRejectForm(false);
      setRejectNotes("");
      onClose();
    } catch (err) {
      showToast({ tone: "error", title: "Couldn't reject", description: getErrorMessage(err) });
    }
  };

  const handleDownload = async () => {
    setPdfLoading(true);
    try {
      const url = await applicationApi.getPdfBlobUrlById(application.id);
      window.open(url, "_blank", "noreferrer");
    } catch (err) {
      showToast({ tone: "error", title: "Couldn't open PDF", description: getErrorMessage(err) });
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Application Detail"
      description={`${application.customer?.name ?? "—"} — ${application.product?.name ?? "—"}`}
      size="lg"
      footer={
        isPending ? (
          showRejectForm ? (
            <>
              <Button variant="outline" onClick={() => setShowRejectForm(false)} disabled={reject.isPending}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleReject} isLoading={reject.isPending} disabled={!rejectNotes.trim()}>
                Confirm Rejection
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="text-danger-700" onClick={() => setShowRejectForm(true)}>
                <XCircle className="size-4" /> Reject
              </Button>
              <Button onClick={handleApprove} isLoading={approve.isPending}>
                <CheckCircle2 className="size-4" /> Approve
              </Button>
            </>
          )
        ) : isApproved ? (
          <Button onClick={handleDownload} isLoading={pdfLoading}>
            <FileDown className="size-4" /> Download PDF
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Badge tone={statusTone(application.status)}>{application.status.replace("_", " ")}</Badge>
          <Badge tone={application.product?.plan === "Pro" ? "brand" : "neutral"}>{application.product?.plan}</Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Customer</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{application.customer?.name}</p>
            <p className="text-sm text-slate-500">{application.customer?.emailAddress}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Product</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{application.product?.name}</p>
            <p className="text-sm text-slate-500">{application.product?.description}</p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-100">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <User className="size-4 text-slate-400" />
            <p className="text-sm font-medium text-slate-700">Audit Trail</p>
          </div>
          <dl className="divide-y divide-slate-100 text-sm">
            <div className="flex items-center justify-between px-4 py-2.5">
              <dt className="text-slate-500">Initiated by</dt>
              <dd className="font-medium text-slate-900">
                {application.createdBy ?? "—"} · {formatDate(application.submittedOn ?? application.createdOn)}
              </dd>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <dt className="text-slate-500">{isPending ? "Reviewed by" : application.status === "APPROVED" ? "Approved by" : "Rejected by"}</dt>
              <dd className="font-medium text-slate-900">
                {application.reviewedBy ?? "Awaiting review"}
                {application.reviewedOn ? ` · ${formatDate(application.reviewedOn)}` : ""}
              </dd>
            </div>
            {application.reviewNotes && (
              <div className="px-4 py-2.5">
                <dt className="text-slate-500">Notes</dt>
                <dd className="mt-1 text-slate-900">{application.reviewNotes}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-lg border border-slate-100">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
            <ShieldCheck className="size-4 text-slate-400" />
            <p className="text-sm font-medium text-slate-700">Health Declaration</p>
          </div>
          <div className="space-y-2 px-4 py-3 text-sm">
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
          </div>
        </div>

        {showRejectForm && (
          <FormField label="Reason for rejection" hint="Shown on the audit trail and shared with the customer">
            <Textarea rows={3} value={rejectNotes} onChange={(e) => setRejectNotes(e.target.value)} placeholder="e.g. Missing nominated beneficiary details" />
          </FormField>
        )}
      </div>
    </Modal>
  );
}
