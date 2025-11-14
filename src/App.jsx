import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "react-error-boundary";

// Store
import useAuthStore from "./store/authStore";
import useUIStore from "./store/uiStore";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

// Route Guards
import {
  ProtectedRoute,
  AdminRoute,
  PublicRoute,
} from "./components/auth/RouteGuards";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import CreditsPage from "./pages/CreditsPage";
import AdminDashboard from "./pages/AdminDashboard";
import UsersListPage from "./pages/admin/UsersListPage";
import CreateUserPage from "./pages/admin/CreateUserPage";

// Constants
import { ROUTES } from "./config/constants";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-error-100 dark:bg-error-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-error-600 dark:text-error-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-4 bg-primary-500 dark:bg-primary-600 text-white rounded-lg hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

function App() {
  const { initAuth } = useAuthStore();
  const { initTheme, theme } = useUIStore();

  // Initialize auth and theme on mount
  React.useEffect(() => {
    initAuth();
    initTheme();
  }, [initAuth, initTheme]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route
                  path={ROUTES.HOME}
                  element={
                    <PublicRoute>
                      <LandingPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path={ROUTES.LOGIN}
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />
              </Route>

              {/* Protected User Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="credits" element={<CreditsPage />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route
                element={
                  <AdminRoute>
                    <DashboardLayout />
                  </AdminRoute>
                }
              >
                <Route
                  path={ROUTES.ADMIN.DASHBOARD}
                  element={<AdminDashboard />}
                />
                <Route path={ROUTES.ADMIN.USERS} element={<UsersListPage />} />
                <Route
                  path={ROUTES.ADMIN.CREATE_USER}
                  element={<CreateUserPage />}
                />
              </Route>

              {/* 404 Redirect */}
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
          </Router>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: theme === "dark" ? "dark-toast" : "",
              style: {
                background: theme === "dark" ? "#1f2937" : "#fff",
                color: theme === "dark" ? "#f9fafb" : "#0f172a",
                padding: "16px",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                border: theme === "dark" ? "1px solid #374151" : "none",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: theme === "dark" ? "#1f2937" : "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: theme === "dark" ? "#1f2937" : "#fff",
                },
              },
            }}
          />
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
