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
  Eye,
  EyeOff,
} from "lucide-react"; // COMMENTED OUT - Theme icons disabled
import { authService } from "../services/authService";
import OTPModal from "../components/auth/OTPModal";
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
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Request OTP mutation
  const requestOTPMutation = useMutation({
    mutationFn: authService.requestPasswordOTP,
    onSuccess: (data) => {
      toast.success("OTP sent to your email!");
      setUserEmail(data.email || "your email");
      setShowOTPModal(true);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    },
  });

  // Verify OTP and change password mutation
  const verifyOTPMutation = useMutation({
    mutationFn: authService.verifyOTPAndChangePassword,
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setShowOTPModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
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

    // Request OTP
    requestOTPMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleVerifyOTP = (otp) => {
    verifyOTPMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      otp,
    });
  };

  const handleCloseModal = () => {
    if (!verifyOTPMutation.isLoading) {
      setShowOTPModal(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings - {APP_NAME}</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-red-500/10 blur-3xl -z-10"></div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-white via-purple-200 to-red-200 bg-clip-text text-transparent mb-3">
            Settings
          </h1>
          <p className="text-white/70 text-lg">
            Manage your account security settings
          </p>
        </div>

        {/* Security Settings - Change Password Only */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Change Password
              </h2>
              <p className="text-sm text-white/70">
                Update your account password
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

            <div className="relative">
              <Input
                label="Current Password"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                required
                icon={Key}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-[42px] text-neutral-500 hover:text-purple-600 transition-colors"
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                label="New Password"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your new password"
                required
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-[42px] text-neutral-500 hover:text-purple-600 transition-colors"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
                required
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-[42px] text-neutral-500 hover:text-purple-600 transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                loading={requestOTPMutation.isLoading}
                icon={Shield}
              >
                Change Password
              </Button>
            </div>
          </form>
        </Card>

        {/* OTP Modal */}
        <OTPModal
          isOpen={showOTPModal}
          onClose={handleCloseModal}
          onVerify={handleVerifyOTP}
          email={userEmail}
          isLoading={verifyOTPMutation.isLoading}
        />
      </div>
    </>
  );
};

export default SettingsPage;


