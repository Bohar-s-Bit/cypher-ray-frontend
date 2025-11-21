import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users,
  IndianRupee,
  Activity,
} from "lucide-react";
import { adminService } from "../services/adminService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import { StatCardSkeleton } from "../components/ui/Skeleton";
import { QUERY_KEYS } from "../config/constants";
import { formatNumber } from "../lib/utils";

const AdminDashboard = () => {
  // Fetch platform statistics
  const { data: statsData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PLATFORM_STATS],
    queryFn: adminService.getPlatformStats,
    retry: false, // Don't retry on failure
  });

  const stats = statsData?.data || {};

  // Prepare chart data
  const tier1Users = stats?.tier1Users || 0;
  const tier2Users = stats?.tier2Users || 0;
  const totalTierUsers = tier1Users + tier2Users;

  const tier1Percentage = totalTierUsers > 0 ? (tier1Users / totalTierUsers) * 100 : 0;
  const tier2Percentage = totalTierUsers > 0 ? (tier2Users / totalTierUsers) * 100 : 0;

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Total Credits Issued",
      value: stats?.credits?.totalCreditsDistributed || 0,
      icon: IndianRupee,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Credits Remaining",
      value: stats?.credits?.totalCreditsRemaining || 0,
      icon: Activity,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
  ];

  return (
    <div className="space-y-8 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl -z-10"></div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-3">
          Admin Dashboard
        </h1>
        <p className="text-text-secondary text-lg">
          Platform overview and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </>
        ) : (
          statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-text-muted mb-2">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-text-primary">
                          {formatNumber(stat.value)}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Tier Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Distribution by Tier</CardTitle>
          <CardDescription>
            Visual breakdown of users across different tiers
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          {isLoading ? (
            <div className="h-24 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Visual Bar Chart */}
              <div className="space-y-3">
                {/* Tier 1 Bar */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Tier 1 Users
                    </span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {formatNumber(tier1Users)} ({tier1Percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-8">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium transition-all duration-500"
                      style={{ width: `${tier1Percentage}%` }}
                    >
                      {tier1Percentage > 10 && `${tier1Percentage.toFixed(0)}%`}
                    </div>
                  </div>
                </div>

                {/* Tier 2 Bar */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Tier 2 Users
                    </span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {formatNumber(tier2Users)} ({tier2Percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-8">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium transition-all duration-500"
                      style={{ width: `${tier2Percentage}%` }}
                    >
                      {tier2Percentage > 10 && `${tier2Percentage.toFixed(0)}%`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <div className="text-center p-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {formatNumber(tier1Users)}
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    Tier 1 Users
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
                    {stats?.totalUsers > 0
                      ? `${((tier1Users / stats.totalUsers) * 100).toFixed(1)}%`
                      : "0%"}
                  </div>
                </div>
                <div className="text-center p-2.5 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatNumber(tier2Users)}
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    Tier 2 Users
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
                    {stats?.totalUsers > 0
                      ? `${((tier2Users / stats.totalUsers) * 100).toFixed(1)}%`
                      : "0%"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;


