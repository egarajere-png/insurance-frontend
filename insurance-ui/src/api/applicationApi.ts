import { apiClient } from "./client";
import type {
  ApplicationStatus,
  Customer,
  CustomerProduct,
  CustomerProductPayload,
  DashboardStats,
} from "../types/insurance";

export const applicationApi = {
  listForCustomer: async (email: string): Promise<CustomerProduct[]> => {
    const { data } = await apiClient.get<CustomerProduct[]>(`/customer-product/list/${encodeURIComponent(email)}`);
    return data;
  },
  /** Every application in the system — the Applications (audit) page and dashboard. */
  listAll: async (status?: ApplicationStatus): Promise<CustomerProduct[]> => {
    const { data } = await apiClient.get<CustomerProduct[]>("/customer-product/list", {
      params: status ? { status } : undefined,
    });
    return data;
  },
  getById: async (id: number): Promise<CustomerProduct> => {
    const { data } = await apiClient.get<CustomerProduct>(`/customer-product/${id}`);
    return data;
  },
  dashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardStats>("/customer-product/dashboard-stats");
    return data;
  },
  create: async (payload: CustomerProductPayload): Promise<CustomerProduct> => {
    const { data } = await apiClient.post<CustomerProduct>("/customer-product", { id: 0, ...payload });
    return data;
  },
  /** Admin accepts the application. Requires the customer to have a NOMINATED dependant on file. */
  approve: async (id: number, notes?: string): Promise<CustomerProduct> => {
    const { data } = await apiClient.post<CustomerProduct>(`/customer-product/${id}/approve`, { notes });
    return data;
  },
  /** Admin declines the application. A reason is required and kept for the audit trail. */
  reject: async (id: number, notes: string): Promise<CustomerProduct> => {
    const { data } = await apiClient.post<CustomerProduct>(`/customer-product/${id}/reject`, { notes });
    return data;
  },
  /**
   * Triggers backend PDF generation for the customer's application.
   * Requires the customer to already have a NOMINATED dependant on file, or
   * generation will fail server-side.
   */
  process: async (email: string): Promise<Customer> => {
    const { data } = await apiClient.get<Customer>(`/customer-product/process/${encodeURIComponent(email)}`);
    return data;
  },
  /** Fetches the generated application PDF (by application id) as a Blob URL. Only works once APPROVED. */
  getPdfBlobUrlById: async (id: number): Promise<string> => {
    const { data } = await apiClient.get(`/customer-product/${id}/pdf`, { responseType: "blob" });
    return URL.createObjectURL(data as Blob);
  },
  /** Legacy email-based route — fetches the latest approved application's PDF. */
  getPdfBlobUrl: async (email: string): Promise<string> => {
    const { data } = await apiClient.get(`/customer-product/pdf/${encodeURIComponent(email)}`, {
      responseType: "blob",
    });
    return URL.createObjectURL(data as Blob);
  },
};
