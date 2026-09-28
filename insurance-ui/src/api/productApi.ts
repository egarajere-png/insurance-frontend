import { apiClient } from "./client";
import type { Product, ProductPayload } from "../types/insurance";

export const productApi = {
  list: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>("/product/list");
    return data;
  },
  get: async (id: number): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/product/${id}`);
    return data;
  },
  create: async (payload: ProductPayload): Promise<Product> => {
    const { data } = await apiClient.post<Product>("/product", { id: 0, ...payload });
    return data;
  },
  update: async (payload: ProductPayload): Promise<Product> => {
    const { data } = await apiClient.post<Product>("/product", payload);
    return data;
  },
};
