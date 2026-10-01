import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Users, UserCheck, Clock, CheckCircle2, ArrowRight, FilePlus2 } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { Button } from "../../components/ui/Button";
import { PersonDetailModal } from "../components/PersonDetailModal";
import { useCustomerApplications } from "../../hooks/useApplications";
import { useCustomerDependants } from "../../hooks/useDependants";
import { usePortalAuth } from "../context/usePortalAuth";
import type { Dependant } from "../../types/insurance";

const TYPE_LABEL: Record<string, string> = {
  DEPENDANT: "Dependant",
  BENEFICIARY: "Beneficiary",
  NOMINATED: "Nominated",
  BOTH: "Dependant & Beneficiary",
};

function StatCard({
  icon: Icon,
  label,
  value,
  isLoading,
}: {
  icon: typeof Users;
  label: string;
  value: number | string;
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardBody className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          {isLoading ? <Skeleton className="mt-2 h-7 w-10" /> : <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>}
        </div>
        <div className="flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <Icon className="size-5" />
        </div>
      </CardBody>
    </Card>
  );
}

export default function PortalDashboardPage() {
  const { customer } = usePortalAuth();
  const { data: applications, isLoading: applicationsLoading } = useCustomerApplications(customer?.emailAddress);
  const { data: people, isLoading: peopleLoading } = useCustomerDependants(customer?.id);
  const [selectedPerson, setSelectedPerson] = useState<Dependant | null>(null);

  const pendingCount = applications?.filter((a) => a.status === "PENDING_REVIEW").length ?? 0;
  const approvedCount = applications?.filter((a) => a.status === "APPROVED").length ?? 0;
  const dependantsCount = people?.filter((p) => p.personType === "DEPENDANT" || p.personType === "BOTH").length ?? 0;
  const beneficiariesCount = people?.filter((p) => p.personType === "BENEFICIARY" || p.personType === "BOTH").length ?? 0;

  return (
    <div>
      <PageHeader
        title={`Welcome${customer ? `, ${customer.name.split(" ")[0]}` : ""}`}
        description="An overview of your insurance applications and the people on your file."
        action={
          <Link to="/portal/applications/new">
            <Button>
              <FilePlus2 className="size-4" /> New Application
            </Button>
          </Link>
        }
      />

      <PersonDetailModal isOpen={!!selectedPerson} person={selectedPerson} onClose={() => setSelectedPerson(null)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={FileText} label="Total Applications" value={applications?.length ?? 0} isLoading={applicationsLoading} />
        <StatCard icon={Clock} label="Pending Review" value={pendingCount} isLoading={applicationsLoading} />
        <StatCard icon={CheckCircle2} label="Approved" value={approvedCount} isLoading={applicationsLoading} />
        <StatCard icon={Users} label="Dependants" value={dependantsCount} isLoading={peopleLoading} />
        <StatCard icon={UserCheck} label="Beneficiaries" value={beneficiariesCount} isLoading={peopleLoading} />
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <p className="text-sm font-medium text-slate-700">Recent Applications</p>
          <Link to="/portal/applications" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <CardBody>
          {applicationsLoading && <p className="py-6 text-center text-sm text-slate-500">Loading…</p>}
          {!applicationsLoading && (!applications || applications.length === 0) && (
            <p className="py-6 text-center text-sm text-slate-500">No applications yet.</p>
          )}
          {!applicationsLoading && applications && applications.length > 0 && (
            <ul className="divide-y divide-slate-100">
              {applications.slice(0, 5).map((a) => (
                <li key={a.id}>
                  <Link to={`/portal/applications/${a.id}`} className="flex items-center justify-between py-2.5 text-sm hover:text-brand-600">
                    <div>
                      <p className="font-medium text-slate-900">{a.product?.name}</p>
                      <p className="text-slate-500">{a.product?.plan} Plan</p>
                    </div>
                    <Badge tone={a.status === "APPROVED" ? "success" : a.status === "REJECTED" ? "danger" : "warning"}>
                      {a.status.replace("_", " ")}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Card className="mt-6">
        <div className="flex items-center gap-1.5 border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700">
          <UserCheck className="size-4 text-slate-400" /> Dependants &amp; Beneficiaries
        </div>
        <CardBody>
          {peopleLoading && <p className="py-6 text-center text-sm text-slate-500">Loading…</p>}
          {!peopleLoading && (!people || people.length === 0) && (
            <p className="py-6 text-center text-sm text-slate-500">
              None on file yet. Dependants and beneficiaries are added as part of an application.
            </p>
          )}
          {!peopleLoading && people && people.length > 0 && (
            <ul className="divide-y divide-slate-100">
              {people.map((p) => (
                <li key={p.id}>
                  <button onClick={() => setSelectedPerson(p)} className="flex w-full items-center justify-between py-2.5 text-left text-sm hover:text-brand-600">
                    <div>
                      <p className="font-medium text-slate-900">{p.name}</p>
                      <p className="text-slate-500">{p.relationship}</p>
                    </div>
                    <Badge tone="brand">{TYPE_LABEL[p.personType] ?? p.personType}</Badge>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
