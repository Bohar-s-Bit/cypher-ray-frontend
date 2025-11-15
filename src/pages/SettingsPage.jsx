import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Lock, /* Moon, Sun, */ Bell, Shield, Key, AlertCircle } from "lucide-react"; // COMMENTED OUT - Theme icons disabled
import { authService } from "../services/authService";
// import useUIStore from "../store/uiStore"; // COMMENTED OUT - Theme toggle disabled
import { APP_NAME } from "../config/constants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const SettingsPage = () => {
  // const { theme, toggleTheme } = useUIStore(); // COMMENTED OUT - Theme toggle disabled
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  // COMMENTED OUT - Theme toggle functionality disabled
  // const handleThemeToggle = () => {
  //   toggleTheme();
  //   toast.success(`Switched to ${theme === "light" ? "dark" : "light"} mode`);
  // };

  return (
    <>
      <Helmet>
        <title>Settings - {APP_NAME}</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Settings
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Security Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Lock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Security
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Manage your password and security settings
                </p>
              </div>
            </div>

            {/* Change Password Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/50 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-neutral-700 dark:text-neutral-300">
                  <p className="font-semibold mb-1 text-neutral-900 dark:text-white">
                    Password Requirements:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>At least 8 characters long</li>
                    <li>Include uppercase and lowercase letters</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                  </ul>
                </div>
              </div>

              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                required
                icon={Key}
              />

              <Input
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your new password"
                required
                icon={Lock}
              />

              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
                required
                icon={Lock}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  loading={changePasswordMutation.isLoading}
                  icon={Shield}
                >
                  Change Password
                </Button>
              </div>
            </form>
          </Card>

          {/* COMMENTED OUT - Appearance Settings (Theme Toggle Disabled) */}
          {/* <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                {theme === "light" ? (
                  <Sun className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                ) : (
                  <Moon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Appearance
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Customize how the application looks
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-white">
                    Dark Mode
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Switch between light and dark themes
                  </p>
                </div>
                <button
                  onClick={handleThemeToggle}
                  className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
                  style={{
                    backgroundColor: theme === "dark" ? "#3b82f6" : "#cbd5e1",
                  }}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      theme === "dark" ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => theme === "dark" && handleThemeToggle()}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === "light"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Sun className="w-8 h-8 text-neutral-900 dark:text-white" />
                    <span className="font-medium text-neutral-900 dark:text-white">
                      Light
                    </span>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => theme === "light" && handleThemeToggle()}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === "dark"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Moon className="w-8 h-8 text-neutral-900 dark:text-white" />
                    <span className="font-medium text-neutral-900 dark:text-white">
                      Dark
                    </span>
                  </div>
                </motion.button>
              </div>
            </div>
          </Card> */}

          {/* Notifications Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Notifications
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Manage your notification preferences
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-white">
                    Email Notifications
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Receive email updates about your account
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-white">
                    Credit Alerts
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Get notified when credits are low
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-white">
                    Security Alerts
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Important security updates and alerts
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                />
              </div>
            </div>
          </Card>

          {/* Account Information */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Account Information
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  View your account details
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Account ID
                </span>
                <span className="font-mono text-sm text-neutral-900 dark:text-white">
                  {Math.random().toString(36).substr(2, 9).toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Data Storage
                </span>
                <span className="text-neutral-900 dark:text-white">
                  Encrypted & Secure
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Two-Factor Auth
                </span>
                <span className="text-neutral-900 dark:text-white">
                  Coming Soon
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
