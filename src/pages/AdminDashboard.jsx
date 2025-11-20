import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  IndianRupee,
  Activity,
} from "lucide-react";
import { BarSegment, useChart } from "@chakra-ui/charts";
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

  // Prepare chart data for Chakra UI
  const chartData = [
    {
      name: "Tier 1 Users",
      value: stats?.tier1Users || 0,
      color: "purple.solid",
    },
    {
      name: "Tier 2 Users",
      value: stats?.tier2Users || 0,
      color: "blue.solid",
    },
  ];

  const chart = useChart({
    sort: { by: "value", direction: "desc" },
    data: chartData,
  });

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      changeType: "increase",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      color: "text-success-600 dark:text-success-400",
      bgColor: "bg-success-50 dark:bg-success-900/20",
      changeType: "increase",
    },
    {
      title: "Inactive Users",
      value: stats?.inactiveUsers || 0,
      icon: UserX,
      color: "text-error-600 dark:text-error-400",
      bgColor: "bg-error-50 dark:bg-error-900/20",
      changeType: "decrease",
    },
    {
      title: "Total Credits Issued",
      value: stats?.credits?.totalCreditsDistributed || 0,
      icon: IndianRupee,
      color: "text-secondary-600 dark:text-secondary-400",
      bgColor: "bg-secondary-50 dark:bg-secondary-900/20",
      changeType: "increase",
    },
    {
      title: "Credits Used",
      value: stats?.credits?.totalCreditsUsed || 0,
      icon: TrendingUp,
      color: "text-warning-600 dark:text-warning-400",
      bgColor: "bg-warning-50 dark:bg-warning-900/20",
    },
    {
      title: "Credits Remaining",
      value: stats?.credits?.totalCreditsRemaining || 0,
      icon: Activity,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
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
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-text-muted mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-text-primary">
                          {formatNumber(stat.value)}
                        </p>
                      </div>
                      <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
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
        <CardContent className="p-6">
          {isLoading ? (
            <div className="h-32 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Chakra UI Bar Segment Chart */}
              <BarSegment.Root chart={chart}>
                <BarSegment.Content>
                  <BarSegment.Value className="text-text-primary font-semibold" />
                  <BarSegment.Bar className="h-8" />
                  <BarSegment.Label className="text-text-secondary" />
                </BarSegment.Content>
              </BarSegment.Root>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-purple">
                {chartData.map((tier, index) => (
                  <div
                    key={index}
                    className="text-center p-3 bg-surface-dark rounded-lg border border-border-purple"
                  >
                    <div className="text-2xl font-bold text-text-primary">
                      {formatNumber(tier.value)}
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                      {tier.name}
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                      {stats?.totalUsers > 0
                        ? `${((tier.value / stats.totalUsers) * 100).toFixed(1)}%`
                        : "0%"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;


