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
import {
  Table,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  ResizableTableContainer,
} from "../components/ui/Table";

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
      bgColor: "bg-purple-500/20",
      color: "text-purple-400",
      isString: true,
    },
    {
      title: "Available Credits",
      value: userData?.credits?.available || 0,
      icon: CreditCard,
      bgColor: "bg-blue-500/20",
      color: "text-blue-400",
    },
    {
      title: "Total Scans",
      value: userData?.totalScans || 0,
      icon: Activity,
      bgColor: "bg-green-500/20",
      color: "text-green-400",
    },
    {
      title: "Account Status",
      value: userData?.isActive ? "Active" : "Inactive",
      icon: Shield,
      bgColor: "bg-amber-500/20",
      color: "text-amber-400",
      isString: true,
    },
  ];

  return (
    <div className="space-y-8 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl -z-10"></div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-3">
          Welcome back, {userData?.username || "User"}!
        </h1>
        <p className="text-text-secondary text-lg">
          Here's an overview of your account activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <Card className="hover:border-purple-500/50 transition-all group" padding="none">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor} ring-1 ring-white/10`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      {stat.trend && (
                        <Badge variant="success" size="sm">
                          {stat.trend}
                        </Badge>
                      )}
                    </div>
                    <div className="text-3xl font-bold text-text-primary mb-2 group-hover:text-purple-300 transition-colors">
                      {stat.isString ? stat.value : formatNumber(stat.value)}
                    </div>
                    <div className="text-sm text-text-muted">
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
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest credit transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-neutral-800/50 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : creditHistory.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-border-purple bg-surface-dark backdrop-blur-sm">
              <ResizableTableContainer>
                <Table aria-label="Recent transactions">
                  <TableHeader>
                    <Column isRowHeader className="text-text-primary text-sm font-semibold">Name</Column>
                    <Column className="text-text-primary text-sm font-semibold">Type</Column>
                    <Column className="text-text-primary text-sm font-semibold">Date</Column>
                    <Column className="text-text-primary text-sm font-semibold">Balance</Column>
                  </TableHeader>
                  <TableBody>
                    {creditHistory.slice(0, 5).map((transaction) => {
                      // Backend stores scan costs as positive but they are debits
                      // Check transaction type to determine if it's a debit or credit
                      const isDebit = transaction.type === "scan" || transaction.type === "debit" || transaction.amount < 0;
                      const isCredit = !isDebit && transaction.amount > 0;
                      
                      // For display: debits should show as negative, credits as positive
                      const displayAmount = isDebit && transaction.amount > 0 
                        ? -transaction.amount 
                        : transaction.amount;
                      
                      return (
                        <Row key={transaction._id} className="border-border-purple hover:bg-[#15051F]/50">
                          <Cell className="font-medium text-text-primary text-sm">
                            {transaction.type === "scan" 
                              ? `Scan #${transaction._id.slice(-6)}` 
                              : transaction.description}
                          </Cell>
                          <Cell>
                            <Badge 
                              variant="neutral"
                              size="sm"
                            >
                              {transaction.type || "Credit"}
                            </Badge>
                          </Cell>
                          <Cell className="text-text-secondary text-sm">
                            {format(
                              new Date(transaction.createdAt),
                              "MMM dd, yyyy HH:mm"
                            )}
                          </Cell>
                          <Cell>
                            <div className="flex flex-col">
                              <span
                                className={`font-semibold text-sm ${
                                  isCredit
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {isCredit ? "+" : ""}{displayAmount}
                              </span>
                              <span className="text-xs text-text-muted">
                                Bal: {transaction.balanceAfter}
                              </span>
                            </div>
                          </Cell>
                        </Row>
                      );
                    })}
                  </TableBody>
                </Table>
              </ResizableTableContainer>
            </div>
          ) : (
            <div className="text-center py-16 text-text-muted">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-base">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;


