import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  idNumber: z.string().min(1, "ID number is required"),
  pinNumber: z.string().min(1, "KRA PIN is required"),
  occupation: z.string().min(1, "Occupation is required"),
  gender: z.enum(["M", "F"], {
    message: "Select a valid gender",
  }),
  mobileNumber: z.string().min(10, "Enter a valid mobile number"),
  emailAddress: z.string().email("Enter a valid email address"),
  postalAddress: z.string().min(1, "Postal address is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
