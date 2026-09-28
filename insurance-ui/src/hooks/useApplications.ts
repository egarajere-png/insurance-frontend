import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationApi } from "../api/applicationApi";
import type { CustomerProductPayload } from "../types/insurance";

export const applicationKeys = {
  forCustomer: (email: string) => ["applications", "customer", email] as const,
};

export function useCustomerApplications(email: string | undefined) {
  return useQuery({
    queryKey: applicationKeys.forCustomer(email ?? ""),
    queryFn: () => applicationApi.listForCustomer(email as string),
    enabled: !!email,
  });
}

export function useCreateApplication(email: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CustomerProductPayload) => applicationApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.forCustomer(email) });
    },
  });
}

export function useProcessApplication() {
  return useMutation({
    mutationFn: (email: string) => applicationApi.process(email),
  });
}
