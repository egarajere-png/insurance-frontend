import { Card, CardBody } from "../ui/Card";
import { FormField } from "../ui/FormField";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import type { HealthInfoFormValues } from "../../schemas/application";

/**
 * Small, self-contained form — plain controlled state instead of react-hook-form,
 * since this step's values just need to flow into the wizard's own state on every
 * change (the wizard already validates completeness via the Review step).
 */
export function HealthInfoStep({
  value,
  onChange,
}: {
  value: HealthInfoFormValues;
  onChange: (v: HealthInfoFormValues) => void;
}) {
  const set = <K extends keyof HealthInfoFormValues>(key: K, val: HealthInfoFormValues[K]) =>
    onChange({ ...value, [key]: val });

  return (
    <Card>
      <CardBody className="space-y-4">
        <FormField label="Is the applicant in good health?">
          <Select value={value.inGoodHealth} onChange={(e) => set("inGoodHealth", e.target.value as "yes" | "no")}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
        </FormField>

        {value.inGoodHealth === "no" && (
          <FormField label="Describe the health status" hint="Details the backend will store as free text">
            <Textarea
              rows={3}
              value={value.healthStatus}
              onChange={(e) => set("healthStatus", e.target.value)}
              placeholder="e.g. Managing hypertension, on medication"
            />
          </FormField>
        )}

        <FormField label="Any specific diagnosis to declare?">
          <Select value={value.specificDiasgnosis} onChange={(e) => set("specificDiasgnosis", e.target.value as "yes" | "no")}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </Select>
        </FormField>

        {value.specificDiasgnosis === "yes" && (
          <FormField label="Diagnosis details">
            <Textarea
              rows={3}
              value={value.specificDiasgnosisStatus}
              onChange={(e) => set("specificDiasgnosisStatus", e.target.value)}
              placeholder="Describe the diagnosis"
            />
          </FormField>
        )}
      </CardBody>
    </Card>
  );
}
