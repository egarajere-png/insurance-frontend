import { z } from "zod";

export const healthInfoSchema = z.object({
  inGoodHealth: z.enum(["yes", "no"]),
  healthStatus: z.string(),
  specificDiasgnosis: z.enum(["yes", "no"]),
  specificDiasgnosisStatus: z.string(),
});

export type HealthInfoFormValues = z.infer<typeof healthInfoSchema>;

/**
 * A negative health answer needs a reason — mirrors the backend's own check
 * (CustomerProductService#createCustomerProduct) so the user sees the problem
 * before submitting rather than after.
 */
export function isHealthStepValid(value: HealthInfoFormValues): boolean {
  if (value.inGoodHealth === "no" && !value.healthStatus.trim()) return false;
  if (value.specificDiasgnosis === "yes" && !value.specificDiasgnosisStatus.trim()) return false;
  return true;
}
