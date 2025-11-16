import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CreditCard,
  Activity,
  Trophy,
  Shield,
} from "lucide-react";
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
import { QUERY_KEYS } from "../config/constants";
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
      title: "Current Tier",
      value: userData?.tier || "Loading...",
      icon: Trophy,
      bgColor: "bg-primary-50 dark:bg-primary-900/20",
      color: "text-primary-600 dark:text-primary-400",
      isString: true,
    },
    {
      title: "Available Credits",
      value: userData?.credits?.available || 0,
      icon: CreditCard,
      bgColor: "bg-secondary-50 dark:bg-secondary-900/20",
      color: "text-secondary-600 dark:text-secondary-400",
    },
    {
      title: "Total Scans",
      value: userData?.totalScans || 0,
      icon: Activity,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Account Status",
      value: userData?.isActive ? "Active" : "Inactive",
      icon: Shield,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      color: "text-purple-600 dark:text-purple-400",
      isString: true,
    },
  ];

  return (
    <div className="space-y-8 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white">
          Welcome back, {userData?.username || "User"}!
        </h1>
        <p className="text-white/70 mt-2">
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
                  <CardContent className="p-6 bg-black/20 backdrop-blur-sm border-white/10">
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
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.isString ? stat.value : formatNumber(stat.value)}
                    </div>
                    <div className="text-sm text-white/70">
                      {stat.title}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Recent Credit History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <CardDescription className="text-white/70">Your latest credit transactions</CardDescription>
        </CardHeader>
        <CardContent className="bg-black/20 backdrop-blur-sm border-white/10">
          {historyLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-white/5 backdrop-blur-sm rounded-lg animate-pulse border border-white/10"
                ></div>
              ))}
            </div>
          ) : creditHistory.length > 0 ? (
            <div className="space-y-3">
              {creditHistory.slice(0, 5).map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                >
                  <div>
                    <p className="font-medium text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-white/70">
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
                          ? "text-success-400"
                          : "text-error-400"
                      }`}
                    >
                      {transaction.amount >= 0 ? "+" : ""}
                      {transaction.amount}
                    </p>
                    <p className="text-sm text-white/70">
                      Balance: {transaction.balanceAfter}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/70">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;

