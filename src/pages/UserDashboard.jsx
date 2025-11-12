import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CreditCard, TrendingUp, Activity, Clock } from "lucide-react";
import { format } from "date-fns";
import useAuthStore from "../store/authStore";
import { authService } from "../services/authService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { StatCardSkeleton } from "../components/ui/Skeleton";
import { QUERY_KEYS, TIERS } from "../config/constants";
import { formatNumber } from "../lib/utils";

const UserDashboard = () => {
  const { user } = useAuthStore();

  // Fetch user profile
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: authService.getUserProfile,
    retry: false, // Don't retry on failure
  });

  // Fetch credit history
  const { data: creditHistoryData, isLoading: historyLoading } = useQuery({
    queryKey: [QUERY_KEYS.CREDIT_HISTORY, { page: 1, limit: 10 }],
    queryFn: () => authService.getCreditHistory({ page: 1, limit: 10 }),
    retry: false, // Don't retry on failure
  });

  const userData = profileData?.data?.user || user;
  const creditHistory = creditHistoryData?.data?.transactions || [];

  const stats = [
    {
      title: "Total Credits",
      value: userData?.credits?.total || 0,
      icon: CreditCard,
      color: "text-primary-600",
      bgColor: "bg-primary-50",
      trend: "+12%",
    },
    {
      title: "Credits Used",
      value: userData?.credits?.used || 0,
      icon: TrendingUp,
      color: "text-secondary-600",
      bgColor: "bg-secondary-50",
      trend: "+8%",
    },
    {
      title: "Credits Remaining",
      value: userData?.credits?.remaining || 0,
      icon: Activity,
      color: "text-success-600",
      bgColor: "bg-success-50",
    },
    {
      title: "Current Tier",
      value: userData?.tierInfo?.name || "N/A",
      icon: Clock,
      color: "text-warning-600",
      bgColor: "bg-warning-50",
      isString: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-900">
          Welcome back, {userData?.username || "User"}!
        </h1>
        <p className="text-neutral-600 mt-2">
          Here's an overview of your account
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {profileLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </>
        ) : (
          stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      {stat.trend && (
                        <Badge variant="success" size="sm">
                          {stat.trend}
                        </Badge>
                      )}
                    </div>
                    <div className="text-3xl font-bold text-neutral-900 mb-1">
                      {stat.isString ? stat.value : formatNumber(stat.value)}
                    </div>
                    <div className="text-sm text-neutral-600">{stat.title}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Account Info & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details and tier information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Organization</p>
                <p className="font-medium text-neutral-900">
                  {userData?.organizationName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Email</p>
                <p className="font-medium text-neutral-900 truncate">
                  {userData?.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Account Status</p>
                <Badge variant={userData?.isActive ? "success" : "error"}>
                  {userData?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Last Login</p>
                <p className="font-medium text-neutral-900">
                  {userData?.lastLogin
                    ? format(new Date(userData.lastLogin), "MMM dd, yyyy")
                    : "N/A"}
                </p>
              </div>
            </div>

            {userData?.tier && (
              <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                <h4 className="font-semibold text-primary-900 mb-2">
                  {TIERS[userData.tier.toUpperCase()]?.name} Features
                </h4>
                <ul className="space-y-1">
                  {TIERS[userData.tier.toUpperCase()]?.features.map(
                    (feature, i) => (
                      <li
                        key={i}
                        className="text-sm text-primary-800 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                        {feature}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Credit History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest credit transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-neutral-100 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : creditHistory.length > 0 ? (
              <div className="space-y-3">
                {creditHistory.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-neutral-900">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {format(
                          new Date(transaction.createdAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.amount >= 0
                            ? "text-success-600"
                            : "text-error-600"
                        }`}
                      >
                        {transaction.amount >= 0 ? "+" : ""}
                        {transaction.amount}
                      </p>
                      <p className="text-sm text-neutral-600">
                        Balance: {transaction.balanceAfter}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
