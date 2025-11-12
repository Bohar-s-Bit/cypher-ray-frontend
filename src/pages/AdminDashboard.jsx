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
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useAuthStore from "../store/authStore";
import { adminService } from "../services/adminService";
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

const AdminDashboard = () => {
  // Fetch platform statistics
  const { data: statsData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PLATFORM_STATS],
    queryFn: adminService.getPlatformStats,
    retry: false, // Don't retry on failure
  });

  const stats = statsData?.data || {};

  // Prepare chart data
  const tierChartData = [
    {
      name: "Tier 1",
      users: stats?.tier1Users || 0,
      fill: "#3b82f6", // Primary blue
    },
    {
      name: "Tier 2",
      users: stats?.tier2Users || 0,
      fill: "#f97316", // Secondary orange
    },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded-lg shadow-lg">
          <p className="font-semibold text-neutral-900">{payload[0].name}</p>
          <p className="text-sm text-neutral-600">
            Users:{" "}
            <span className="font-bold text-primary-600">
              {payload[0].value}
            </span>
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {stats?.totalUsers > 0
              ? `${((payload[0].value / stats.totalUsers) * 100).toFixed(
                  1
                )}% of total`
              : "0% of total"}
          </p>
        </div>
      );
    }
    return null;
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-primary-600",
      bgColor: "bg-primary-50",
      change: "+12.5%",
      changeType: "increase",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      color: "text-success-600",
      bgColor: "bg-success-50",
      change: "+8.2%",
      changeType: "increase",
    },
    {
      title: "Inactive Users",
      value: stats?.inactiveUsers || 0,
      icon: UserX,
      color: "text-error-600",
      bgColor: "bg-error-50",
      change: "-3.1%",
      changeType: "decrease",
    },
    {
      title: "Total Credits Issued",
      value: stats?.credits?.totalCreditsDistributed || 0,
      icon: IndianRupee,
      color: "text-secondary-600",
      bgColor: "bg-secondary-50",
      change: "+15.3%",
      changeType: "increase",
    },
    {
      title: "Credits Used",
      value: stats?.credits?.totalCreditsUsed || 0,
      icon: TrendingUp,
      color: "text-warning-600",
      bgColor: "bg-warning-50",
    },
    {
      title: "Credits Remaining",
      value: stats?.credits?.totalCreditsRemaining || 0,
      icon: Activity,
      color: "text-primary-500",
      bgColor: "bg-primary-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-900">
          Admin Dashboard
        </h1>
        <p className="text-neutral-600 mt-2">
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
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      {stat.change && (
                        <Badge
                          variant={
                            stat.changeType === "increase" ? "success" : "error"
                          }
                          size="sm"
                        >
                          {stat.change}
                        </Badge>
                      )}
                    </div>
                    <div className="text-3xl font-bold text-neutral-900 mb-1">
                      {formatNumber(stat.value)}
                    </div>
                    <div className="text-sm text-neutral-600">{stat.title}</div>
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
        <CardContent>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Bar Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tierChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="users"
                      radius={[8, 8, 0, 0]}
                      animationDuration={800}
                    >
                      {tierChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
                {tierChartData.map((tier, index) => (
                  <div
                    key={index}
                    className="text-center p-3 bg-neutral-50 rounded-lg"
                  >
                    <div
                      className="w-3 h-3 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: tier.fill }}
                    ></div>
                    <div className="text-2xl font-bold text-neutral-900">
                      {formatNumber(tier.users)}
                    </div>
                    <div className="text-xs text-neutral-600 mt-1">
                      {tier.name} Users
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {stats?.totalUsers > 0
                        ? `${((tier.users / stats.totalUsers) * 100).toFixed(
                            1
                          )}%`
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
