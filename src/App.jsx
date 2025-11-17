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

// Contexts
import { AnalysisProvider } from "./contexts/AnalysisContext";
// Performance Monitoring
import PerformanceMonitor from "./components/ui/PerformanceMonitor";

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
import AnalyzePage from "./pages/AnalyzePage";
import ResultsPage from "./pages/ResultsPage";
import ResultDetailPage from "./pages/ResultDetailPage";
import ApiDocsPage from "./pages/ApiDocsPage";
import AdminDashboard from "./pages/AdminDashboard";
import UsersListPage from "./pages/admin/UsersListPage";
import AccessRequestsPage from "./pages/admin/AccessRequestsPage";
import CreateUserPage from "./pages/admin/CreateUserPage";

// Constants-check
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
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 p-4">
      <div className="max-w-md w-full bg-neutral-800 rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-error-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-error-400"
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
        <h2 className="text-2xl font-bold text-white mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-neutral-400 mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

function App() {
  const { initAuth } = useAuthStore();
  const { initTheme } = useUIStore(); // Removed theme variable

  // Initialize auth and theme on mount
  React.useEffect(() => {
    initAuth();
    initTheme();
  }, [initAuth, initTheme]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AnalysisProvider>
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
                  <Route path="analyze" element={<AnalyzePage />} />
                  <Route path="results" element={<ResultsPage />} />
                  <Route path="results/:jobId" element={<ResultDetailPage />} />
                  <Route path="api-docs" element={<ApiDocsPage />} />
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
                  <Route
                    path={ROUTES.ADMIN.USERS}
                    element={<UsersListPage />}
                  />
                  <Route
                    path={ROUTES.ADMIN.ACCESS_REQUESTS}
                    element={<AccessRequestsPage />}
                  />
                  <Route
                    path={ROUTES.ADMIN.CREATE_USER}
                    element={<CreateUserPage />}
                  />
                </Route>

                {/* 404 Redirect */}
                <Route
                  path="*"
                  element={<Navigate to={ROUTES.HOME} replace />}
                />
              </Routes>
            </Router>
          </AnalysisProvider>

          {/* Toast Notifications - Dark Mode Only */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: "dark-toast",
              style: {
                background: "#2a2a2a",
                color: "#e5e5e5",
                padding: "16px",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
                border: "1px solid #3d3d3d",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#2a2a2a",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#2a2a2a",
                },
              },
            }}
          />
          <PerformanceMonitor />
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
