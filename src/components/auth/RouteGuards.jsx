import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { ROUTES, USER_TYPES } from "../../config/constants";
import { PageLoader } from "../ui/Spinner";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Give time for auth to initialize
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user?.userType !== USER_TYPES.ADMIN) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    if (user?.userType === USER_TYPES.ADMIN) {
      return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
    }
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};
