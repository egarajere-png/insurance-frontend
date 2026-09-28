import { z } from "zod";

export const dependantSchema = z.object({
  name: z.string().min(2, "Name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  idNumber: z.string(),
  relationship: z.string().min(1, "Relationship is required"),
  mobileNumber: z.string(),
  email: z.string().refine((v) => v === "" || /^\S+@\S+\.\S+$/.test(v), "Enter a valid email address"),
  type: z.enum(["NOMINATED", "DEPENDANT", "BENEFICIARY", "BOTH"]),
});

export type DependantFormValues = z.infer<typeof dependantSchema>;
