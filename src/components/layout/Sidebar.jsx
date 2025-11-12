import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useUIStore from "../../store/uiStore";
import useAuthStore from "../../store/authStore";
import { ROUTES, USER_TYPES } from "../../config/constants";
import { cn } from "../../lib/utils";

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const isAdmin = user?.userType === USER_TYPES.ADMIN;

  const userNavItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: ROUTES.DASHBOARD,
      end: true,
    },
    {
      label: "Settings",
      icon: Settings,
      path: ROUTES.SETTINGS,
      end: true,
    },
  ];

  const adminNavItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: ROUTES.ADMIN.DASHBOARD,
      end: true,
    },
    {
      label: "Users",
      icon: Users,
      path: ROUTES.ADMIN.USERS,
      end: true, // Exact match only
    },
    {
      label: "Create User",
      icon: UserPlus,
      path: ROUTES.ADMIN.CREATE_USER,
      end: true,
    },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="hidden md:flex flex-col bg-white border-r border-neutral-200 h-screen sticky top-0"
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-end p-4 border-b border-neutral-200">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end} // Use exact matching
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary-50 text-primary-600 font-medium"
                      : "text-neutral-600 hover:bg-neutral-100",
                    !sidebarOpen && "justify-center"
                  )
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info */}
        {sidebarOpen && (
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Mobile Sidebar - Can be added later with drawer component */}
    </>
  );
};

export default Sidebar;
