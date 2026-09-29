import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dependantApi } from "../api/dependantApi";
import type { DependantPayload } from "../types/insurance";

export const dependantKeys = {
  forCustomer: (customerId: number) => ["dependants", "customer", customerId] as const,
  beneficiaries: (customerId: number) => ["beneficiaries", "customer", customerId] as const,
};

export function useCustomerDependants(customerId: number | undefined) {
  return useQuery({
    queryKey: dependantKeys.forCustomer(customerId ?? 0),
    queryFn: () => dependantApi.listForCustomer(customerId as number),
    enabled: !!customerId,
  });
}

export function useCustomerBeneficiaries(customerId: number | undefined) {
  return useQuery({
    queryKey: dependantKeys.beneficiaries(customerId ?? 0),
    queryFn: () => dependantApi.listBeneficiaries(customerId as number),
    enabled: !!customerId,
  });
}

export function useCreateDependant(customerId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DependantPayload) => dependantApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dependantKeys.forCustomer(customerId) });
      queryClient.invalidateQueries({ queryKey: dependantKeys.beneficiaries(customerId) });
    },
  });
}

export function useUpdateDependant(customerId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DependantPayload) => dependantApi.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dependantKeys.forCustomer(customerId) });
      queryClient.invalidateQueries({ queryKey: dependantKeys.beneficiaries(customerId) });
    },
  });
}

export function useDeleteDependant(customerId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dependantApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dependantKeys.forCustomer(customerId) });
      queryClient.invalidateQueries({ queryKey: dependantKeys.beneficiaries(customerId) });
    },
  });
}
