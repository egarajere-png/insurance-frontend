import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationApi } from "../api/applicationApi";
import type { ApplicationStatus, CustomerProductPayload } from "../types/insurance";

export const applicationKeys = {
  forCustomer: (email: string) => ["applications", "customer", email] as const,
  all: (status?: ApplicationStatus) => ["applications", "all", status ?? "any"] as const,
  byId: (id: number) => ["applications", "detail", id] as const,
  stats: ["applications", "stats"] as const,
};

export function useCustomerApplications(email: string | undefined) {
  return useQuery({
    queryKey: applicationKeys.forCustomer(email ?? ""),
    queryFn: () => applicationApi.listForCustomer(email as string),
    enabled: !!email,
  });
}

/** All applications in the system, optionally filtered by status. Powers the audit/Applications page and dashboard. */
export function useApplications(status?: ApplicationStatus) {
  return useQuery({
    queryKey: applicationKeys.all(status),
    queryFn: () => applicationApi.listAll(status),
  });
}

export function useApplication(id: number | undefined) {
  return useQuery({
    queryKey: applicationKeys.byId(id ?? 0),
    queryFn: () => applicationApi.getById(id as number),
    enabled: !!id,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: applicationKeys.stats,
    queryFn: applicationApi.dashboardStats,
  });
}

function invalidateApplicationLists(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["applications"] });
}

export function useCreateApplication(email: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CustomerProductPayload) => applicationApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.forCustomer(email) });
      invalidateApplicationLists(queryClient);
    },
  });
}

export function useApproveApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) => applicationApi.approve(id, notes),
    onSuccess: () => invalidateApplicationLists(queryClient),
  });
}

export function useRejectApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) => applicationApi.reject(id, notes),
    onSuccess: () => invalidateApplicationLists(queryClient),
  });
}

export function useProcessApplication() {
  return useMutation({
    mutationFn: (email: string) => applicationApi.process(email),
  });
}
