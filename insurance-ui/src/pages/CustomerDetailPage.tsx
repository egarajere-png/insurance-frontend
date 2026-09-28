import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Pencil, UserPlus, FilePlus2 } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { Button } from "../components/ui/Button";
import { DataTable, type Column } from "../components/ui/DataTable";
import { CustomerFormModal } from "../components/customers/CustomerFormModal";
import { DependantFormModal } from "../components/dependants/DependantFormModal";
import { useCustomer } from "../hooks/useCustomers";
import { useCustomerDependants, useCustomerBeneficiaries } from "../hooks/useDependants";
import { useCustomerApplications } from "../hooks/useApplications";
import type { Dependant, CustomerProduct } from "../types/insurance";

const TABS = ["Dependants", "Beneficiaries", "Applications"] as const;

export default function CustomerDetailPage() {
  const { email } = useParams<{ email: string }>();
  const { data: customer, isLoading } = useCustomer(email);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Dependants");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [dependantModal, setDependantModal] = useState<"dependant" | "beneficiary" | null>(null);

  const { data: dependants, isLoading: dependantsLoading } = useCustomerDependants(customer?.id);
  const { data: beneficiaries, isLoading: beneficiariesLoading } = useCustomerBeneficiaries(customer?.id);
  const { data: applications, isLoading: applicationsLoading } = useCustomerApplications(email);

  const dependantColumns: Column<Dependant>[] = [
    { key: "name", header: "Name", render: (d) => <span className="font-medium text-slate-900">{d.name}</span> },
    { key: "relationship", header: "Relationship", render: (d) => d.relationship },
    { key: "type", header: "Type", render: (d) => <Badge tone="brand">{d.personType}</Badge> },
    { key: "idNumber", header: "ID Number", render: (d) => d.idNumber || "—" },
    { key: "mobile", header: "Mobile", render: (d) => d.mobileNumber || "—" },
  ];

  const applicationColumns: Column<CustomerProduct>[] = [
    { key: "product", header: "Product", render: (a) => <span className="font-medium text-slate-900">{a.product?.name}</span> },
    { key: "plan", header: "Plan", render: (a) => <Badge tone="info">{a.product?.plan}</Badge> },
    {
      key: "health",
      header: "Health",
      render: (a) => (a.inGoodHealth ? <Badge tone="success">Good health</Badge> : <Badge tone="warning">Flagged</Badge>),
    },
    {
      key: "payment",
      header: "Payment",
      render: (a) => (a.paymentMade ? <Badge tone="success">Paid</Badge> : <Badge tone="neutral">Not yet implemented</Badge>),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-16">
        <p className="text-sm font-medium text-slate-700">Customer not found</p>
        <Link to="/customers" className="mt-2 inline-block text-sm text-brand-600 hover:text-brand-700">
          Back to customers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/customers" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="size-4" /> Back to customers
      </Link>

      <PageHeader
        title={customer.name}
        description={`ID Number: ${customer.idNumber}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(true)}>
              <Pencil className="size-4" /> Edit
            </Button>
            <Link to={`/applications/new?email=${encodeURIComponent(customer.emailAddress)}`}>
              <Button>
                <FilePlus2 className="size-4" /> Start Application
              </Button>
            </Link>
          </div>
        }
      />

      <CustomerFormModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} customer={customer} />
      {dependantModal && (
        <DependantFormModal
          isOpen={!!dependantModal}
          onClose={() => setDependantModal(null)}
          customerId={customer.id}
          context={dependantModal}
        />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader title="Personal Information" />
          <CardBody className="space-y-3 text-sm">
            <div className="flex items-center gap-2.5 text-slate-600">
              <Mail className="size-4 text-slate-400" /> {customer.emailAddress}
            </div>
            <div className="flex items-center gap-2.5 text-slate-600">
              <Phone className="size-4 text-slate-400" /> {customer.mobileNumber}
            </div>
            <div className="flex items-center gap-2.5 text-slate-600">
              <MapPin className="size-4 text-slate-400" />
              {[customer.postalAddress, customer.city].filter(Boolean).join(", ") || "—"}
            </div>
            <div className="flex items-center gap-2.5 text-slate-600">
              <Briefcase className="size-4 text-slate-400" /> {customer.occupation || "—"}
            </div>
            <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <dt className="text-slate-500">Gender</dt>
                <dd className="text-slate-900">{customer.gender || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">KRA PIN</dt>
                <dd className="text-slate-900">{customer.pinNumber || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Postal Code</dt>
                <dd className="text-slate-900">{customer.postalCode || "—"}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 pt-3">
            <div className="flex gap-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-t-md px-3 py-2 text-sm font-medium transition-colors ${
                    tab === t ? "border-b-2 border-brand-500 text-brand-600" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {tab === "Dependants" && (
              <Button size="sm" variant="outline" className="mb-2" onClick={() => setDependantModal("dependant")}>
                <UserPlus className="size-3.5" /> Add Dependant
              </Button>
            )}
            {tab === "Beneficiaries" && (
              <Button size="sm" variant="outline" className="mb-2" onClick={() => setDependantModal("beneficiary")}>
                <UserPlus className="size-3.5" /> Add Beneficiary
              </Button>
            )}
          </div>

          {tab === "Dependants" && (
            <DataTable
              columns={dependantColumns}
              data={dependants}
              isLoading={dependantsLoading}
              rowKey={(d) => d.id}
              emptyTitle="No dependants recorded"
            />
          )}
          {tab === "Beneficiaries" && (
            <DataTable
              columns={dependantColumns}
              data={beneficiaries}
              isLoading={beneficiariesLoading}
              rowKey={(d) => d.id}
              emptyTitle="No beneficiaries recorded"
            />
          )}
          {tab === "Applications" && (
            <DataTable
              columns={applicationColumns}
              data={applications}
              isLoading={applicationsLoading}
              rowKey={(a) => a.id}
              emptyTitle="No applications yet"
              emptyDescription="This customer hasn't applied for an insurance product."
            />
          )}
        </Card>
      </div>
    </div>
  );
}
