import { apiClient } from "./client";
import type { Customer, CustomerProduct, CustomerProductPayload } from "../types/insurance";

export const applicationApi = {
  listForCustomer: async (email: string): Promise<CustomerProduct[]> => {
    const { data } = await apiClient.get<CustomerProduct[]>(`/customer-product/list/${encodeURIComponent(email)}`);
    return data;
  },
  create: async (payload: CustomerProductPayload): Promise<CustomerProduct> => {
    const { data } = await apiClient.post<CustomerProduct>("/customer-product", { id: 0, ...payload });
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
  /** Fetches the generated application PDF as a Blob URL for viewing/downloading. */
  getPdfBlobUrl: async (email: string): Promise<string> => {
    const { data } = await apiClient.get(`/customer-product/pdf/${encodeURIComponent(email)}`, {
      responseType: "blob",
    });
    return URL.createObjectURL(data as Blob);
  },
};
