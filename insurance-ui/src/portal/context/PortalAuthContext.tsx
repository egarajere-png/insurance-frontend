import { useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { customerApi } from "../../api/customerApi";
import { getErrorMessage } from "../../api/client";
import type { Customer } from "../../types/insurance";
import { PortalAuthContext } from "./portalAuthTypes";

const STORAGE_KEY = "portal.customerEmail";

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  // Explicitly logged in/out this session (via login()/logout()). Takes
  // priority over the restored-session query below once it settles.
  const [manualCustomer, setManualCustomer] = useState<Customer | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const savedEmail = localStorage.getItem(STORAGE_KEY);

  // Restores a session from a previous visit — placeholder for what a real
  // OIDC/Keycloak silent-refresh would do on load.
  const bootstrap = useQuery({
    queryKey: ["portal-session", savedEmail],
    queryFn: () => customerApi.getByEmail(savedEmail as string),
    enabled: !!savedEmail && manualCustomer === undefined,
    retry: 0,
  });

  useEffect(() => {
    if (bootstrap.isError) localStorage.removeItem(STORAGE_KEY);
  }, [bootstrap.isError]);

  const customer = manualCustomer !== undefined ? manualCustomer : (bootstrap.data ?? null);
  const isLoading = manualCustomer === undefined && !!savedEmail && bootstrap.isPending;

  const login = async (email: string) => {
    setError(null);
    try {
      const found = await customerApi.getByEmail(email.trim());
      localStorage.setItem(STORAGE_KEY, found.emailAddress);
      setManualCustomer(found);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setManualCustomer(null);
  };

  const refresh = async () => {
    if (customer) {
      const found = await customerApi.getByEmail(customer.emailAddress);
      setManualCustomer(found);
    }
  };

  return (
    <PortalAuthContext.Provider value={{ customer, isLoading, error, login, logout, refresh }}>
      {children}
    </PortalAuthContext.Provider>
  );
}
