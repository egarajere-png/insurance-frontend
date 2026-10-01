import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AppLayout } from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import CustomersPage from "./pages/CustomersPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import ProductsPage from "./pages/ProductsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ApplicationWizardPage from "./pages/ApplicationWizardPage";
import NotFoundPage from "./pages/NotFoundPage";
import { PortalAuthProvider } from "./portal/context/PortalAuthContext";
import { PortalLayout } from "./portal/PortalLayout";
import PortalLoginPage from "./portal/pages/PortalLoginPage";
import PortalDashboardPage from "./portal/pages/PortalDashboardPage";
import PortalApplicationsPage from "./portal/pages/PortalApplicationsPage";
import PortalNewApplicationPage from "./portal/pages/PortalNewApplicationPage";
import PortalApplicationDetailPage from "./portal/pages/PortalApplicationDetailPage";
import PortalProductsPage from "./portal/pages/PortalProductsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/:email" element={<CustomerDetailPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="applications/new" element={<ApplicationWizardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/*
              Customer-facing portal. No Keycloak yet, so PortalAuthProvider
              stands in for auth via an email lookup (see PortalLoginPage) -
              swap it for a real OIDC flow later without touching these pages.
            */}
            <Route
              path="/portal/*"
              element={
                <PortalAuthProvider>
                  <Routes>
                    <Route path="login" element={<PortalLoginPage />} />
                    <Route element={<PortalLayout />}>
                      <Route index element={<PortalDashboardPage />} />
                      <Route path="applications" element={<PortalApplicationsPage />} />
                      <Route path="applications/new" element={<PortalNewApplicationPage />} />
                      <Route path="applications/:id" element={<PortalApplicationDetailPage />} />
                      <Route path="products" element={<PortalProductsPage />} />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </PortalAuthProvider>
              }
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}
