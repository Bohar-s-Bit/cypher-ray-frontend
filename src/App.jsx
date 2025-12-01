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
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

// Store
import useAuthStore from "./store/authStore";
import useUIStore from "./store/uiStore";

// Contexts
import { AnalysisProvider } from "./contexts/AnalysisContext";
import { LoadingProvider } from "./contexts/LoadingContext";
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
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import FeaturesPage from "./pages/FeaturesPage";
import NotFoundPage from "./pages/NotFoundPage";
import ServerErrorPage from "./pages/ServerErrorPage";
import UserDashboard from "./pages/UserDashboard";
import ProfilePage from "./pages/ProfilePage";
import CreditsPage from "./pages/CreditsPage";
import AnalyzePage from "./pages/AnalyzePage";
import ResultsPage from "./pages/ResultsPage";
import ResultDetailPage from "./pages/ResultDetailPage";
import SdkDocsPage from "./pages/SdkDocsPage";
import SDKWorkflowPage from "./pages/SDKWorkflowPage";
import AdminDashboard from "./pages/AdminDashboard";
import UsersListPage from "./pages/admin/UsersListPage";
import AccessRequestsPage from "./pages/admin/AccessRequestsPage";
import CreateUserPage from "./pages/admin/CreateUserPage";
import UserDetailsPage from "./pages/admin/UserDetailsPage";
import CypherRayWebsiteWorkflow from "./pages/CypherRayWebsiteWorkflow";

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
  const navigate = useNavigate();
  
  return (
    <div className="w-full relative flex min-h-screen items-center justify-center overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)' }}>
      {/* Purple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-purple-900/5" />
      
      <div className="relative max-w-md w-full bg-gradient-to-br from-purple-900/20 to-purple-950/20 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-xl p-8 text-center mx-4">
        <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-purple-400"
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
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-purple-200/60 mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
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
          <ChakraProvider value={defaultSystem}>
            <LoadingProvider>
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
                    <Route
                      path={ROUTES.FAQ}
                      element={
                        <PublicRoute>
                          <FAQPage />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/workflow"
                      element={
                        <PublicRoute>
                          <CypherRayWebsiteWorkflow />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/workflow"
                      element={
                        <PublicRoute>
                          <CypherRayWebsiteWorkflow />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/workflow/sdk"
                      element={
                        <PublicRoute>
                          <SDKWorkflowPage />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path={ROUTES.CONTACT}
                      element={
                        <PublicRoute>
                          <ContactPage />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path={ROUTES.FEATURES}
                      element={
                        <PublicRoute>
                          <FeaturesPage />
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
                    <Route
                      path="settings"
                      element={<Navigate to="/profile" replace />}
                    />
                    <Route path="credits" element={<CreditsPage />} />
                    <Route path="analyze" element={<AnalyzePage />} />
                    <Route path="results" element={<ResultsPage />} />
                    <Route
                      path="results/:jobId"
                      element={<ResultDetailPage />}
                    />
                  </Route>

                  {/* SDK Docs - Standalone Route (No DashboardLayout) */}
                  <Route
                    path="api-docs"
                    element={
                      <ProtectedRoute>
                        <SdkDocsPage />
                      </ProtectedRoute>
                    }
                  />

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
                    <Route
                      path={ROUTES.ADMIN.USER_DETAILS}
                      element={<UserDetailsPage />}
                    />
                  </Route>

                  {/* Error Pages */}
                  <Route path="/500" element={<ServerErrorPage />} />
                  
                  {/* 404 - Catch all */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Router>
            </AnalysisProvider>
          </LoadingProvider>

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
          </ChakraProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
