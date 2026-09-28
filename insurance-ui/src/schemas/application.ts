import { z } from "zod";

export const healthInfoSchema = z.object({
  inGoodHealth: z.enum(["yes", "no"]),
  healthStatus: z.string(),
  specificDiasgnosis: z.enum(["yes", "no"]),
  specificDiasgnosisStatus: z.string(),
});

export type HealthInfoFormValues = z.infer<typeof healthInfoSchema>;
