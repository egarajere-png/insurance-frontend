import { apiClient } from "./client";
import type { Dependant, DependantPayload } from "../types/insurance";

export const dependantApi = {
  list: async (): Promise<Dependant[]> => {
    const { data } = await apiClient.get<Dependant[]>("/dependant/list");
    return data;
  },
  get: async (id: number): Promise<Dependant> => {
    const { data } = await apiClient.get<Dependant>(`/dependant/${id}`);
    return data;
  },
  /** All dependant-table rows for a customer, regardless of personType. */
  listForCustomer: async (customerId: number): Promise<Dependant[]> => {
    const { data } = await apiClient.get<Dependant[]>(`/customer/dependant/list/${customerId}`);
    return data;
  },
  /** Rows typed as BENEFICIARY for a customer (by id). */
  listBeneficiaries: async (customerId: number): Promise<Dependant[]> => {
    const { data } = await apiClient.get<Dependant[]>(`/beneficiary/list/${customerId}`);
    return data;
  },
  listBeneficiariesByEmail: async (email: string): Promise<Dependant[]> => {
    const { data } = await apiClient.get<Dependant[]>(`/beneficiary/list/email/${encodeURIComponent(email)}`);
    return data;
  },
  create: async (payload: DependantPayload): Promise<Dependant> => {
    const { data } = await apiClient.post<Dependant>("/dependant", { id: 0, ...payload });
    return data;
  },
  update: async (payload: DependantPayload): Promise<Dependant> => {
    const { data } = await apiClient.post<Dependant>("/dependant", payload);
    return data;
  },
};
