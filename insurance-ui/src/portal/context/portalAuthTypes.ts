import { createContext } from "react";
import type { Customer } from "../../types/insurance";

export interface PortalAuthContextValue {
  customer: Customer | null;
  isLoading: boolean;
  error: string | null;
  /**
   * Placeholder for Keycloak: "logs in" by looking the customer up by email,
   * no password. Swap this for a real OIDC flow later — everything downstream
   * (PortalLayout, the read-only pages) just needs `customer` to be set.
   */
  login: (email: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

export const PortalAuthContext = createContext<PortalAuthContextValue | undefined>(undefined);
