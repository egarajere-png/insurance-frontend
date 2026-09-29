import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import type { ProductPayload } from "../types/insurance";

export const productKeys = {
  all: ["products"] as const,
  byId: (id: number) => ["products", id] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: productApi.list,
  });
}

export function useProduct(id: number | undefined) {
  return useQuery({
    queryKey: productKeys.byId(id ?? 0),
    queryFn: () => productApi.get(id as number),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductPayload) => productApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProductPayload }) => productApi.update(id, payload),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.byId(product.id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });
}
