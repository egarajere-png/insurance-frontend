import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerApi } from "../api/customerApi";
import type { CustomerPayload } from "../types/insurance";

export const customerKeys = {
  all: ["customers"] as const,
  byEmail: (email: string) => ["customers", "email", email] as const,
};

export function useCustomers() {
  return useQuery({
    queryKey: customerKeys.all,
    queryFn: customerApi.list,
  });
}

export function useCustomer(email: string | undefined) {
  return useQuery({
    queryKey: customerKeys.byEmail(email ?? ""),
    queryFn: () => customerApi.getByEmail(email as string),
    enabled: !!email,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CustomerPayload) => customerApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CustomerPayload) => customerApi.update(payload),
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      queryClient.invalidateQueries({ queryKey: customerKeys.byEmail(customer.emailAddress) });
    },
  });
}
