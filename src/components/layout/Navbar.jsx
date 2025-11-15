import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  // Sun,     // COMMENTED OUT - Theme toggle disabled
  // Moon,    // COMMENTED OUT - Theme toggle disabled
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../../store/authStore";
import useUIStore from "../../store/uiStore";
import { APP_NAME, ROUTES } from "../../config/constants";
import { cn } from "../../lib/utils";
import Button from "../ui/Button";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthStore();
  const { mobileMenuOpen, toggleMobileMenu } = useUIStore(); // Removed theme, toggleTheme
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="bg-neutral-800 border-b border-neutral-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg group-hover:shadow-lg transition-shadow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-neutral-900 dark:text-white">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.HOME}
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/features"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors"
                >
                  Features
                </Link>

                {/* COMMENTED OUT - Theme Toggle Disabled */}
                {/* <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  title={
                    theme === "light"
                      ? "Switch to dark mode"
                      : "Switch to light mode"
                  }
                >
                  {theme === "light" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </button> */}

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Sign In
                </Button>
              </>
            ) : (
              <>
                {/* COMMENTED OUT - Theme Toggle Disabled */}
                {/* <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  title={
                    theme === "light"
                      ? "Switch to dark mode"
                      : "Switch to light mode"
                  }
                >
                  {theme === "light" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </button> */}

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      {user?.username || "User"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-2"
                      >
                        <Link
                          to={ROUTES.PROFILE}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          to={ROUTES.SETTINGS}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <hr className="my-2 border-neutral-200 dark:border-neutral-700" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-neutral-700 dark:text-neutral-200" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-700 dark:text-neutral-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-neutral-700 bg-neutral-800 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    to={ROUTES.HOME}
                    className="block px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
                    onClick={toggleMobileMenu}
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className="block px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
                    onClick={toggleMobileMenu}
                  >
                    About
                  </Link>
                  <Link
                    to="/features"
                    className="block px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
                    onClick={toggleMobileMenu}
                  >
                    Features
                  </Link>

                  {/* COMMENTED OUT - Theme Toggle Disabled */}
                  {/* <button
                    onClick={toggleTheme}
                    className="flex items-center justify-between w-full px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
                  >
                    <span>Theme</span>
                    {theme === "light" ? (
                      <Moon className="w-5 h-5" />
                    ) : (
                      <Sun className="w-5 h-5" />
                    )}
                  </button> */}

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      navigate(ROUTES.LOGIN);
                      toggleMobileMenu();
                    }}
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.DASHBOARD}
                    className="block px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
                    onClick={toggleMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={ROUTES.PROFILE}
                    className="block px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
                    onClick={toggleMobileMenu}
                  >
                    Profile
                  </Link>

                  {/* COMMENTED OUT - Theme Toggle Disabled */}
                  {/* <button
                    onClick={toggleTheme}
                    className="flex items-center justify-between w-full px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
                  >
                    <span>Theme</span>
                    {theme === "light" ? (
                      <Moon className="w-5 h-5" />
                    ) : (
                      <Sun className="w-5 h-5" />
                    )}
                  </button> */}

                  <Button
                    variant="error"
                    fullWidth
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
