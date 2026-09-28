import { apiClient } from "./client";
import type { Customer, CustomerPayload } from "../types/insurance";

export const customerApi = {
  list: async (): Promise<Customer[]> => {
    const { data } = await apiClient.get<Customer[]>("/customer/list");
    return data;
  },
  getByEmail: async (email: string): Promise<Customer> => {
    const { data } = await apiClient.get<Customer>(`/customer/email/${encodeURIComponent(email)}`);
    return data;
  },
  getByIdNumber: async (idNumber: string): Promise<Customer> => {
    const { data } = await apiClient.get<Customer>(`/customer/id-number/${encodeURIComponent(idNumber)}`);
    return data;
  },
  getByPhone: async (phoneNumber: string): Promise<Customer> => {
    const { data } = await apiClient.get<Customer>(`/customer/phone-number/${encodeURIComponent(phoneNumber)}`);
    return data;
  },
  create: async (payload: CustomerPayload): Promise<Customer> => {
    const { data } = await apiClient.post<Customer>("/customer", { id: 0, ...payload });
    return data;
  },
  update: async (payload: CustomerPayload): Promise<Customer> => {
    const { data } = await apiClient.post<Customer>("/customer", payload);
    return data;
  },
};
