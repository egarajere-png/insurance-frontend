import { UserPlus } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useCustomerDependants } from "../../hooks/useDependants";

const TYPE_LABEL: Record<string, string> = {
  DEPENDANT: "Dependant",
  BENEFICIARY: "Beneficiary",
  NOMINATED: "Nominated",
  BOTH: "Dependant & Beneficiary",
};

/**
 * Dependants and beneficiaries are the same underlying record (just a
 * relation type) — this is one combined list with one "Add Person" action,
 * rather than treating them as two separate processes.
 */
export function PeopleStep({ customerId, onAdd }: { customerId: number; onAdd: () => void }) {
  const { data, isLoading } = useCustomerDependants(customerId);

  return (
    <Card>
      <CardBody>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Dependants &amp; Beneficiaries on file</p>
          <Button size="sm" variant="outline" onClick={onAdd}>
            <UserPlus className="size-3.5" /> Add Person
          </Button>
        </div>

        {isLoading && <p className="py-6 text-center text-sm text-slate-500">Loading…</p>}

        {!isLoading && (!data || data.length === 0) && (
          <p className="py-6 text-center text-sm text-slate-500">
            None added yet. This step is optional — feel free to continue without adding any.
          </p>
        )}

        {!isLoading && data && data.length > 0 && (
          <ul className="divide-y divide-slate-100">
            {data.map((d) => (
              <li key={d.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium text-slate-900">{d.name}</p>
                  <p className="text-slate-500">{d.relationship}</p>
                </div>
                <Badge tone="brand">{TYPE_LABEL[d.personType] ?? d.personType}</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
