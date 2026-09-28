import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, FileText } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { DataTable, type Column } from "../components/ui/DataTable";
import { useCustomerApplications } from "../hooks/useApplications";
import type { CustomerProduct } from "../types/insurance";

export default function ApplicationsPage() {
  const [email, setEmail] = useState("");
  const [searchedEmail, setSearchedEmail] = useState<string | undefined>();

  const { data: applications, isLoading, isError } = useCustomerApplications(searchedEmail);

  const columns: Column<CustomerProduct>[] = [
    { key: "product", header: "Product", render: (a) => <span className="font-medium text-slate-900">{a.product?.name}</span> },
    { key: "plan", header: "Plan", render: (a) => <Badge tone="info">{a.product?.plan}</Badge> },
    {
      key: "health",
      header: "Health",
      render: (a) => (a.inGoodHealth ? <Badge tone="success">Good health</Badge> : <Badge tone="warning">Flagged</Badge>),
    },
    { key: "createdOn", header: "Created", render: (a) => (a.createdOn ? new Date(a.createdOn).toLocaleDateString() : "—") },
  ];

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Look up a customer's insurance applications."
        action={
          <Link to="/applications/new">
            <Button>New Application</Button>
          </Link>
        }
      />

      <Card className="mb-6">
        <CardBody className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-warning-50 text-warning-700">
            <FileText className="size-4.5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">No global applications list on the backend</p>
            <p className="mt-1 text-sm text-slate-500">
              Applications can only be fetched per customer (by email). Search for a customer below, or open a customer's
              record and use the Applications tab there. An admin-facing "list all applications" endpoint would be needed
              for a full applications table here.
            </p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <div className="border-b border-slate-100 px-5 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchedEmail(email.trim() || undefined);
            }}
            className="flex max-w-md gap-2"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Customer email address"
                className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>
        </div>

        <DataTable
          columns={columns}
          data={searchedEmail ? applications : []}
          isLoading={!!searchedEmail && isLoading}
          isError={!!searchedEmail && isError}
          rowKey={(a) => a.id}
          emptyTitle={searchedEmail ? "No applications found" : "Search for a customer"}
          emptyDescription={
            searchedEmail ? "This customer has no applications on file." : "Enter a customer's email above to view their applications."
          }
        />
      </Card>
    </div>
  );
}
