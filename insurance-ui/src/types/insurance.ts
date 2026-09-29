/**
 * These types mirror the backend entities exactly as they are serialized by
 * Jackson (GET endpoints return entities directly, not DTOs). Do not add
 * fields the backend doesn't actually return — see /docs or the backend
 * inspection notes for the source of truth.
 */

export type PersonType = "NOMINATED" | "DEPENDANT" | "BENEFICIARY" | "BOTH";

export type Plan = "Basic" | "Pro";

export type Gender = "Male" | "Female" | "Other";

export type ApplicationStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED";

export interface Customer {
  id: number;
  name: string;
  dateOfBirth: string | null; // ISO date
  idNumber: string;
  pinNumber: string;
  occupation: string;
  gender: string;
  mobileNumber: string;
  emailAddress: string;
  postalAddress: string;
  postalCode: string;
  city: string;
  dependantsNo: number;
  createdOn: string | null;
  createdBy: string | null;
  edittedOn: string | null;
  edittedBy: string | null;
}

export interface Dependant {
  id: number;
  name: string;
  dateOfBirth: string | null;
  idNumber: string;
  mobileNumber: string;
  relationship: string;
  email: string;
  personType: PersonType;
  createdOn: string | null;
  createdBy: string | null;
  edittedOn: string | null;
  edittedBy: string | null;
  customer: Customer | null;
}

export interface Product {
  id: number;
  plan: Plan;
  name: string;
  description: string;
  benefit: number;
  benefitChild: number;
  premium: number;
  premiumAdditionalChild: number;
  premiumAdditionalAdultChild: number;
  createdOn: string | null;
  createdBy: string | null;
  edittedOn: string | null;
  edittedBy: string | null;
}

export interface CustomerProduct {
  id: number;
  paymentMade: boolean;
  inGoodHealth: boolean;
  healthStatus: string | null;
  specificDiasgnosis: boolean;
  specificDiasgnosisStatus: string | null;
  status: ApplicationStatus;
  submittedOn: string | null;
  reviewedOn: string | null;
  /** Admin who approved/rejected — "who approved it" for the audit view. */
  reviewedBy: string | null;
  reviewNotes: string | null;
  createdOn: string | null;
  /** Who initiated the application — "who initialised it" for the audit view. */
  createdBy: string | null;
  edittedOn: string | null;
  edittedBy: string | null;
  customer: Customer;
  product: Product;
}

export interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalApplications: number;
  pendingReview: number;
  approved: number;
  rejected: number;
}

/** Request payloads — match the *Dto classes the POST endpoints accept. */

export interface CustomerPayload {
  id?: number; // 0 or omitted = create, real id = update (upsert)
  name: string;
  dateOfBirth: string;
  idNumber: string;
  pinNumber: string;
  occupation: string;
  gender: string;
  mobileNumber: string;
  emailAddress: string;
  postalAddress: string;
  postalCode: string;
  city: string;
}

export interface DependantPayload {
  id?: number;
  name: string;
  dateOfBirth: string;
  idNumber: string;
  relationship: string;
  mobileNumber: string;
  email: string;
  customerId: number;
  /** Backend expects the PersonType enum name as a string, e.g. "DEPENDANT". */
  type: PersonType;
}

export interface ProductPayload {
  id?: number;
  name: string;
  description: string;
  benefit: number;
  benefitChild: number;
  plan: Plan;
  premium: number;
  premiumAdditionalChild: number;
  premiumAdditionalAdultChild: number;
}

export interface CustomerProductPayload {
  id?: number;
  paymentMade?: boolean;
  inGoodHealth: boolean;
  healthStatus?: string;
  specificDiasgnosis: boolean;
  specificDiasgnosisStatus?: string;
  customerId: number;
  productId: number;
}
