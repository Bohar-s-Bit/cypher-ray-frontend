import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Code2,
  User,
  CreditCard,
  LogOut,
  Users,
  UserPlus,
  UserCog,
} from "lucide-react";
import { FloatingDock } from "../ui/floating-dock";
import useAuthStore from "../../store/authStore";
import { ROUTES, USER_TYPES } from "../../config/constants";

export const UserDockNavigation = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const dockItems = [
    {
      title: "Dashboard",
      icon: (
        <LayoutDashboard className="w-full h-full text-purple-300 dark:text-purple-300" />
      ),
      onClick: () => navigate(ROUTES.DASHBOARD),
    },
    {
      title: "Analysis",
      icon: (
        <Search className="w-full h-full text-purple-300 dark:text-purple-300" />
      ),
      onClick: () => navigate(ROUTES.ANALYZE),
    },
    {
      title: "Results",
      icon: (
        <BarChart3 className="w-full h-full text-purple-300 dark:text-purple-300" />
      ),
      onClick: () => navigate(ROUTES.RESULTS),
    },
    {
      title: "API Docs",
      icon: (
        <Code2 className="w-full h-full text-purple-300 dark:text-purple-300" />
      ),
      onClick: () => navigate(ROUTES.API_DOCS),
    },
    {
      title: "Profile",
      icon: (
        <User className="w-full h-full text-purple-300 dark:text-purple-300" />
      ),
      onClick: () => navigate(ROUTES.PROFILE),
    },
    {
      title: "Credits",
      icon: (
        <CreditCard className="w-full h-full text-purple-300 dark:text-purple-300" />
      ),
      onClick: () => navigate(ROUTES.CREDITS),
    },
    {
      title: "Logout",
      icon: (
        <LogOut className="w-full h-full text-error-600 dark:text-error-400" />
      ),
      onClick: () => {
        logout();
        toast.success("Logged out successfully!");
        navigate(ROUTES.LOGIN);
      },
      variant: "danger",
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <FloatingDock items={dockItems} />
    </div>
  );
};

export const AdminDockNavigation = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const dockItems = [
    {
      title: "Dashboard",
      icon: (
        <LayoutDashboard className="w-full h-full text-purple-300 dark:text-purple-300" />
      ),
      onClick: () => navigate(ROUTES.ADMIN.DASHBOARD),
    },
    {
      title: "Users",
      icon: (
        <Users className="w-full h-full text-purple-300 dark:text-purple-300" />
      ),
      onClick: () => navigate(ROUTES.ADMIN.USERS),
    },
    {
      title: "Access Requests",
      icon: (
        <UserCog className="w-full h-full text-purple-300 dark:text-purple-300" />
      ),
      onClick: () => navigate(ROUTES.ADMIN.ACCESS_REQUESTS),
    },
    {
      title: "Create User",
      icon: (
        <UserPlus className="w-full h-full text-purple-300 dark:text-purple-300" />
      ),
      onClick: () => navigate(ROUTES.ADMIN.CREATE_USER),
    },
    {
      title: "Logout",
      icon: (
        <LogOut className="w-full h-full text-error-600 dark:text-error-400" />
      ),
      onClick: () => {
        logout();
        toast.success("Logged out successfully!");
        navigate(ROUTES.LOGIN);
      },
      variant: "danger",
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <FloatingDock items={dockItems} />
    </div>
  );
};

export const DockNavigation = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.userType === USER_TYPES.ADMIN;

  return isAdmin ? <AdminDockNavigation /> : <UserDockNavigation />;
};
