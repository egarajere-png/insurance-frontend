import { useState } from "react";
import { Card, CardBody } from "../ui/Card";
import { FormField } from "../ui/FormField";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import type { HealthInfoFormValues } from "../../schemas/application";

/**
 * Small, self-contained form — plain controlled state instead of react-hook-form,
 * since this step's values just need to flow into the wizard's own state on every
 * change. Required-reason errors show once the person has interacted with the
 * field (or tried to move on), not before.
 */
export function HealthInfoStep({
  value,
  onChange,
}: {
  value: HealthInfoFormValues;
  onChange: (v: HealthInfoFormValues) => void;
}) {
  const [touched, setTouched] = useState({ healthStatus: false, specificDiasgnosisStatus: false });

  const set = <K extends keyof HealthInfoFormValues>(key: K, val: HealthInfoFormValues[K]) =>
    onChange({ ...value, [key]: val });

  const healthStatusMissing = value.inGoodHealth === "no" && !value.healthStatus.trim();
  const diagnosisStatusMissing = value.specificDiasgnosis === "yes" && !value.specificDiasgnosisStatus.trim();

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
          <FormField
            label="Describe the health status"
            hint="Required — this is stored as free text"
            error={touched.healthStatus && healthStatusMissing ? "Please describe the health status." : undefined}
          >
            <Textarea
              rows={3}
              value={value.healthStatus}
              onChange={(e) => set("healthStatus", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, healthStatus: true }))}
              hasError={touched.healthStatus && healthStatusMissing}
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
          <FormField
            label="Diagnosis details"
            hint="Required"
            error={touched.specificDiasgnosisStatus && diagnosisStatusMissing ? "Please provide diagnosis details." : undefined}
          >
            <Textarea
              rows={3}
              value={value.specificDiasgnosisStatus}
              onChange={(e) => set("specificDiasgnosisStatus", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, specificDiasgnosisStatus: true }))}
              hasError={touched.specificDiasgnosisStatus && diagnosisStatusMissing}
              placeholder="Describe the diagnosis"
            />
          </FormField>
        )}
      </CardBody>
    </Card>
  );
}
