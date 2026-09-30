import { UserPlus } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useCustomerDependants, useCustomerBeneficiaries } from "../../hooks/useDependants";

export function DependantsReviewStep({
  customerId,
  kind,
  onAdd,
}: {
  customerId: number;
  kind: "dependant" | "beneficiary";
  onAdd: () => void;
}) {
  const dependants = useCustomerDependants(kind === "dependant" ? customerId : undefined);
  const beneficiaries = useCustomerBeneficiaries(kind === "beneficiary" ? customerId : undefined);
  const { data, isLoading } = kind === "dependant" ? dependants : beneficiaries;

  return (
    <Card>
      <CardBody>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">
            {kind === "dependant" ? "Dependants on file" : "Beneficiaries on file"}
          </p>
          <Button size="sm" variant="outline" onClick={onAdd}>
            <UserPlus className="size-3.5" /> Add {kind === "dependant" ? "Dependant" : "Beneficiary"}
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
                <Badge tone="brand">{d.personType}</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
