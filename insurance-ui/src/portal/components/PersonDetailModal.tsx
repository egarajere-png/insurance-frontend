import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import type { Dependant } from "../../types/insurance";

const TYPE_LABEL: Record<string, string> = {
  DEPENDANT: "Dependant",
  BENEFICIARY: "Beneficiary",
  NOMINATED: "Nominated",
  BOTH: "Dependant & Beneficiary",
};

export function PersonDetailModal({
  isOpen,
  onClose,
  person,
}: {
  isOpen: boolean;
  onClose: () => void;
  person: Dependant | null;
}) {
  if (!person) return null;

  const rows: [string, string][] = [
    ["Relationship", person.relationship || "—"],
    ["Type", TYPE_LABEL[person.personType] ?? person.personType],
    ["ID Number", person.idNumber || "—"],
    ["Mobile", person.mobileNumber || "—"],
    ["Email", person.email || "—"],
    ["Date of Birth", person.dateOfBirth ? new Date(person.dateOfBirth).toLocaleDateString() : "—"],
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={person.name} description="Read-only — contact the bank to make changes.">
      <div className="space-y-4">
        <Badge tone="brand">{TYPE_LABEL[person.personType] ?? person.personType}</Badge>
        <dl className="divide-y divide-slate-100 rounded-lg border border-slate-100">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-medium text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Modal>
  );
}
