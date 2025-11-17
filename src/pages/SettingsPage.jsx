import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import {
  Lock,
  /* Moon, Sun, */ Bell,
  Shield,
  Key,
  AlertCircle,
} from "lucide-react"; // COMMENTED OUT - Theme icons disabled
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

      {/* FIX: Changed space-y-6 to space-y-8 */}
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Settings
          </h1>
          <p className="text-white/70 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* FIX: Removed the "max-w-4xl space-y-6" wrapper div */}
        {/* Security Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Security
              </h2>
              <p className="text-sm text-white/70">
                Manage your password and security settings
              </p>
            </div>
          </div>

          {/* Change Password Form */}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-700 dark:text-neutral-300">
                <p className="font-semibold mb-1 text-white">
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

    

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-white">
                Email Notifications
              </p>
              <p className="text-sm text-white/70">
                Receive email updates about your account
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-purple-600 bg-neutral-100 border-neutral-300 rounded focus:ring-purple-500 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-white">
                Credit Alerts
              </p>
              <p className="text-sm text-white/70">
                Get notified when credits are low
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-purple-600 bg-neutral-100 border-neutral-300 rounded focus:ring-purple-500 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
            <div classNameAme="flex-1">
              <p className="font-medium text-white">
                Security Alerts
              </p>
              <p className="text-sm text-white/70">
                Important security updates and alerts
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-purple-600 bg-neutral-100 border-neutral-300 rounded focus:ring-purple-500 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
            />
          </div>
        </div>

        {/* Account Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Account Information
              </h2>
              <p className="text-sm text-white/70">
                View your account details
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
              <span className="text-white/70">
                Account ID
              </span>
              <span className="font-mono text-sm text-white">
                {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
              <span className="text-white/70">
                Data Storage
              </span>
              <span className="text-white">
                Encrypted & Secure
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
              <span className="text-white/70">
                Two-Factor Auth
              </span>
              <span className="text-white">
                Coming Soon
              </span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default SettingsPage;


