import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Calendar,
  Shield,
  CreditCard,
  Edit2,
  X,
  Check,
} from "lucide-react";
import { authService } from "../services/authService";
import useAuthStore from "../store/authStore";
import { QUERY_KEYS, TIERS, APP_NAME } from "../config/constants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  // Fetch user profile
  const { data: profileData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: authService.getUserProfile,
  });

  const userData = profileData?.data?.user || user;
  const tierInfo = userData?.tier ? TIERS[userData.tier.toUpperCase()] : null;

  // Set form data when profile data is loaded
  React.useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
      });
    }
  }, [userData]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authService.updateUserProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.USER_PROFILE]);
      setUser(data.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: userData?.username || "",
      email: userData?.email || "",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile - {APP_NAME}</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Profile
          </h1>
          <p className="text-white/70 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Personal Information
                </h2>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    icon={Edit2}
                  >
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    required
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      loading={updateProfileMutation.isLoading}
                      icon={Check}
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      icon={X}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <User className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/70">
                        Username
                      </p>
                      <p className="font-medium text-white">
                        {userData?.username || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Mail className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/70">
                        Email Address
                      </p>
                      <p className="font-medium text-white">
                        {userData?.email || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/70">
                        Member Since
                      </p>
                      <p className="font-medium text-white">
                        {userData?.createdAt
                          ? new Date(userData.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/70">
                        Last Login
                      </p>
                      <p className="font-medium text-white">
                        {userData?.lastLogin
                          ? new Date(userData.lastLogin).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Account Details Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg">
                  <Shield className="w-5 h-5 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Account Status
                  </h3>
                </div>
              </div>
              <Badge
                variant={userData?.isActive ? "success" : "error"}
                className="w-full justify-center"
              >
                {userData?.isActive ? "Active" : "Inactive"}
              </Badge>
            </Card>

            {/* Subscription Tier */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Subscription Tier
                  </h3>
                </div>
              </div>

              {tierInfo ? (
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg border border-primary-200 dark:border-primary-800">
                    <p className="text-2xl font-bold text-purple-400">
                      {tierInfo.name}
                    </p>
                    <p className="text-sm text-white/70 mt-1">
                      {tierInfo.monthlyCredits} credits/month
                    </p>
                  </div>
                  <div className="text-sm text-white/70">
                    <p className="font-medium mb-2">Features:</p>
                    <ul className="space-y-1">
                      {tierInfo.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-400 mt-0.5">
                            •
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-white/70">
                  No subscription tier assigned
                </p>
              )}
            </Card>

            {/* Credits Overview */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
                  <CreditCard className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Credits
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">
                    Available
                  </span>
                  <span className="text-2xl font-bold text-white">
                    {userData?.credits?.available || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="text-white/70">
                    Used this month
                  </span>
                  <span className="font-semibold text-white">
                    {userData?.credits?.used || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">
                    Total earned
                  </span>
                  <span className="font-semibold text-white">
                    {userData?.credits?.total || 0}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;


