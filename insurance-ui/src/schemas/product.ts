import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  plan: z.enum(["Basic", "Pro"]),
  benefit: z.number().min(0, "Enter a valid amount"),
  benefitChild: z.number().min(0, "Enter a valid amount"),
  premium: z.number().min(0, "Enter a valid amount"),
  premiumAdditionalChild: z.number().min(0, "Enter a valid amount"),
  premiumAdditionalAdultChild: z.number().min(0, "Enter a valid amount"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
