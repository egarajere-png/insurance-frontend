import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Pencil } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { DataTable, type Column } from "../components/ui/DataTable";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { CustomerFormModal } from "../components/customers/CustomerFormModal";
import { useCustomers } from "../hooks/useCustomers";
import type { Customer } from "../types/insurance";

export default function CustomersPage() {
  const { data: customers, isLoading, isError } = useCustomers();
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!customers) return customers;
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.emailAddress?.toLowerCase().includes(q) ||
        c.idNumber?.toLowerCase().includes(q) ||
        c.mobileNumber?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const columns: Column<Customer>[] = [
    { key: "name", header: "Name", render: (c) => <span className="font-medium text-slate-900">{c.name}</span> },
    { key: "idNumber", header: "ID Number", render: (c) => c.idNumber },
    { key: "mobile", header: "Mobile", render: (c) => c.mobileNumber },
    { key: "email", header: "Email", render: (c) => c.emailAddress },
    { key: "city", header: "City", render: (c) => c.city || "—" },
    {
      key: "dependants",
      header: "Dependants",
      render: (c) => <Badge tone="brand">{c.dependantsNo ?? 0}</Badge>,
    },
    {
      key: "edit",
      header: "",
      className: "text-right",
      render: (c) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            setEditingCustomer(c);
            setIsFormOpen(true);
          }}
        >
          <Pencil className="size-3.5" /> Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Customers"
        description="View and manage customer records."
        action={
          <Button
            size="md"
            onClick={() => {
              setEditingCustomer(null);
              setIsFormOpen(true);
            }}
          >
            <UserPlus className="size-4" />
            New Customer
          </Button>
        }
      />

      <CustomerFormModal
        isOpen={isFormOpen}
        customer={editingCustomer ?? undefined}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCustomer(null);
        }}
        onSaved={(customer) => {
          if (!editingCustomer) navigate(`/customers/${customer.emailAddress}`);
        }}
      />

      <Card>
        <div className="border-b border-slate-100 px-5 py-3">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, email or phone"
              className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          isError={isError}
          rowKey={(c) => c.id}
          onRowClick={(c) => navigate(`/customers/${c.emailAddress}`)}
          emptyTitle={search ? "No matching customers" : "No customers yet"}
          emptyDescription={search ? "Try a different search term." : "Customer records will appear here once created."}
        />
      </Card>
    </div>
  );
}
