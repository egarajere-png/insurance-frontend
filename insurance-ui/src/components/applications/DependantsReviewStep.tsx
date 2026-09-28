import { UserPlus, AlertTriangle } from "lucide-react";
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

  const hasNominated = kind === "dependant" && dependants.data?.some((d) => d.personType === "NOMINATED" || d.personType === "BOTH");

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

        {kind === "dependant" && !isLoading && !hasNominated && (
          <div className="mb-4 flex items-start gap-2.5 rounded-md bg-warning-50 px-3.5 py-3 text-sm text-warning-700">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>
              No dependant is typed <strong>Nominated</strong> yet. The backend requires exactly one before it can
              generate the application PDF later — add one now or before submitting.
            </p>
          </div>
        )}

        {isLoading && <p className="py-6 text-center text-sm text-slate-500">Loading…</p>}

        {!isLoading && (!data || data.length === 0) && (
          <p className="py-6 text-center text-sm text-slate-500">
            None added yet. This step is optional to continue, but required before PDF generation.
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
