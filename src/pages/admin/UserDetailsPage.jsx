import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  CreditCard,
  FileText,
  Key,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
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
import { adminService } from "../../services/adminService";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../../components/ui/Card";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { Modal, ModalHeader, ModalTitle, ModalBody } from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import { QUERY_KEYS, ROUTES } from "../../config/constants";
import { cn } from "../../lib/utils";

const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#f97316",
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",
  purple: "#a855f7",
  teal: "#14b8a6",
};

const TIME_FILTERS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
  { label: "All Time", value: "all" },
];

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [creditTimeFilter, setCreditTimeFilter] = useState("30");
  const [paymentTimeFilter, setPaymentTimeFilter] = useState("30");
  const [creditPage, setCreditPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);

  // Modals
  const [showEditCreditsModal, setShowEditCreditsModal] = useState(false);
  const [creditsAction, setCreditsAction] = useState("add");
  const [creditsAmount, setCreditsAmount] = useState("");

  // Fetch comprehensive user details
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      QUERY_KEYS.USER_DETAILS,
      userId,
      creditTimeFilter,
      paymentTimeFilter,
      creditPage,
      paymentPage,
    ],
    queryFn: () =>
      adminService.getComprehensiveUserDetails(userId, {
        creditDays: creditTimeFilter,
        paymentDays: paymentTimeFilter,
        creditPage,
        creditLimit: 10,
        paymentPage,
        paymentLimit: 10,
      }),
    staleTime: 30000,
  });

  // Update credits mutation
  const updateCreditsMutation = useMutation({
    mutationFn: ({ action, credits }) =>
      adminService.updateUserCredits(userId, { action, credits }),
    onSuccess: () => {
      toast.success("Credits updated successfully");
      setShowEditCreditsModal(false);
      setCreditsAmount("");
      refetch();
    },
  });

  // Revoke API key mutation
  const revokeApiKeyMutation = useMutation({
    mutationFn: (keyId) => adminService.revokeApiKey(keyId),
    onSuccess: () => {
      toast.success("API key revoked successfully");
      refetch();
    },
  });

  const handleUpdateCredits = () => {
    const amount = parseInt(creditsAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    updateCreditsMutation.mutate({ action: creditsAction, credits: amount });
  };

  const handleRevokeApiKey = (keyId, keyName) => {
    if (
      window.confirm(`Are you sure you want to revoke API key "${keyName}"?`)
    ) {
      revokeApiKeyMutation.mutate(keyId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        <TableSkeleton rows={5} columns={4} />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          User Not Found
        </h2>
        <Button onClick={() => navigate(ROUTES.ADMIN.USERS)}>
          Back to Users
        </Button>
      </div>
    );
  }

  const userDetails = data.data;
  const { user, credits, payments, analysis, apiKeys } = userDetails;

  // Tabs configuration
  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "credits", label: "Credit History", icon: CreditCard },
    { id: "payments", label: "Payment History", icon: DollarSign },
    { id: "analysis", label: "Analysis Stats", icon: Activity },
    { id: "apikeys", label: "API Keys", icon: Key },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN.USERS)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-white">
              {user.username}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            leftIcon={<Edit className="w-4 h-4" />}
            onClick={() => setShowEditCreditsModal(true)}
          >
            Edit Credits
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Available Credits
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  {credits.current.remaining.toLocaleString()}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  of {credits.current.total.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-primary-500/10 rounded-lg">
                <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all"
                style={{ width: `${credits.current.percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Total Spent
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  ₹{user.totalSpent.toLocaleString()}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  {payments.pagination.total} payments
                </p>
              </div>
              <div className="p-3 bg-success-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Analysis Jobs
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  {analysis.total}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  {analysis.completed} completed
                </p>
              </div>
              <div className="p-3 bg-secondary-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Active API Keys
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  {apiKeys.active}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  of {apiKeys.total} total
                </p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Key className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-4 font-medium transition-colors relative whitespace-nowrap",
                    activeTab === tab.id
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <CardContent className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <OverviewTab user={user} analysis={analysis} credits={credits} />
          )}

          {/* Credits Tab */}
          {activeTab === "credits" && (
            <CreditsTab
              credits={credits}
              timeFilter={creditTimeFilter}
              setTimeFilter={setCreditTimeFilter}
              page={creditPage}
              setPage={setCreditPage}
            />
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <PaymentsTab
              payments={payments}
              timeFilter={paymentTimeFilter}
              setTimeFilter={setPaymentTimeFilter}
              page={paymentPage}
              setPage={setPaymentPage}
            />
          )}

          {/* Analysis Tab */}
          {activeTab === "analysis" && <AnalysisTab analysis={analysis} />}

          {/* API Keys Tab */}
          {activeTab === "apikeys" && (
            <ApiKeysTab
              apiKeys={apiKeys}
              onRevokeKey={handleRevokeApiKey}
              isRevoking={revokeApiKeyMutation.isPending}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Credits Modal */}
      <Modal
        isOpen={showEditCreditsModal}
        onClose={() => setShowEditCreditsModal(false)}
      >
        <ModalHeader onClose={() => setShowEditCreditsModal(false)}>
          <ModalTitle>Edit User Credits</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Action
              </label>
              <div className="flex gap-2">
                <Button
                  variant={creditsAction === "add" ? "primary" : "outline"}
                  onClick={() => setCreditsAction("add")}
                  size="sm"
                >
                  Add Credits
                </Button>
                <Button
                  variant={creditsAction === "set" ? "primary" : "outline"}
                  onClick={() => setCreditsAction("set")}
                  size="sm"
                >
                  Set Credits
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Amount
              </label>
              <Input
                type="number"
                value={creditsAmount}
                onChange={(e) => setCreditsAmount(e.target.value)}
                placeholder="Enter credit amount"
                min="1"
              />
              {creditsAction === "add" && creditsAmount && (
                <p className="text-sm text-white/60 mt-2">
                  New balance will be:{" "}
                  {(
                    credits.current.remaining + parseInt(creditsAmount || 0)
                  ).toLocaleString()}
                </p>
              )}
              {creditsAction === "set" && creditsAmount && (
                <p className="text-sm text-white/60 mt-2">
                  New balance will be:{" "}
                  {parseInt(creditsAmount || 0).toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditCreditsModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateCredits}
                disabled={updateCreditsMutation.isPending}
              >
                {updateCreditsMutation.isPending
                  ? "Updating..."
                  : "Update Credits"}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ user, analysis, credits }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Information */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">
                Username
              </span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {user.username}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">
                Organization
              </span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {user.organizationName || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">
                Account Status
              </span>
              <Badge variant={user.isActive ? "success" : "error"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">
                Tier
              </span>
              <Badge variant="secondary">
                {user.tierInfo?.name || user.tier || "No Tier"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">
                Created
              </span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {format(new Date(user.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Credit Summary Chart */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Credit Usage Trend</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {credits.chartData && credits.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={credits.chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="_id"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => format(new Date(value), "MMM dd")}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="debits"
                    stroke={CHART_COLORS.error}
                    strokeWidth={2}
                    name="Used"
                  />
                  <Line
                    type="monotone"
                    dataKey="additions"
                    stroke={CHART_COLORS.success}
                    strokeWidth={2}
                    name="Added"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-neutral-500 py-8">
                No credit data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analysis Overview */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Analysis Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                {analysis.total}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Total Jobs
              </p>
            </div>
            <div className="text-center p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {analysis.completed}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Completed
              </p>
            </div>
            <div className="text-center p-4 bg-error-50 dark:bg-error-900/20 rounded-lg">
              <p className="text-3xl font-bold text-error-600 dark:text-error-400">
                {analysis.failed}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Failed
              </p>
            </div>
            <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {analysis.totalCreditsConsumed}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Credits Used
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Credits Tab Component
const CreditsTab = ({ credits, timeFilter, setTimeFilter, page, setPage }) => {
  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Transaction History
        </h3>
        <div className="flex gap-2">
          {TIME_FILTERS.map((filter) => (
            <Button
              key={filter.value}
              variant={timeFilter === filter.value ? "primary" : "outline"}
              size="sm"
              onClick={() => {
                setTimeFilter(filter.value);
                setPage(1);
              }}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Date
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Type
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Description
              </th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Amount
              </th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {credits.history.transactions.length > 0 ? (
              credits.history.transactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                    {format(
                      new Date(transaction.createdAt),
                      "MMM dd, yyyy HH:mm"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        transaction.type === "debit"
                          ? "error"
                          : transaction.type === "bonus"
                          ? "success"
                          : "secondary"
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                    {transaction.description}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 text-sm font-medium text-right",
                      transaction.type === "debit"
                        ? "text-error-600 dark:text-error-400"
                        : "text-success-600 dark:text-success-400"
                    )}
                  >
                    {transaction.type === "debit" ? "-" : "+"}
                    {transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white text-right">
                    {transaction.balanceAfter.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-neutral-500"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {credits.history.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Page {credits.history.pagination.page} of{" "}
            {credits.history.pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={credits.history.pagination.page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={
                credits.history.pagination.page ===
                credits.history.pagination.totalPages
              }
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Payments Tab Component
const PaymentsTab = ({
  payments,
  timeFilter,
  setTimeFilter,
  page,
  setPage,
}) => {
  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Payment History
        </h3>
        <div className="flex gap-2">
          {TIME_FILTERS.map((filter) => (
            <Button
              key={filter.value}
              variant={timeFilter === filter.value ? "primary" : "outline"}
              size="sm"
              onClick={() => {
                setTimeFilter(filter.value);
                setPage(1);
              }}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Date
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Plan
              </th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Amount
              </th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Credits
              </th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {payments.history.length > 0 ? (
              payments.history.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                    {format(new Date(payment.createdAt), "MMM dd, yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                    {payment.plan || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-white text-right">
                    {payment.currency} {payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white text-center">
                    {payment.credits?.toLocaleString() || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant={
                        payment.status === "success"
                          ? "success"
                          : payment.status === "pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-neutral-500"
                >
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {payments.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Page {payments.pagination.page} of {payments.pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={payments.pagination.page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={
                payments.pagination.page === payments.pagination.totalPages
              }
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Analysis Tab Component
const AnalysisTab = ({ analysis }) => {
  const statusData = [
    {
      name: "Completed",
      value: analysis.completed,
      color: CHART_COLORS.success,
    },
    { name: "Failed", value: analysis.failed, color: CHART_COLORS.error },
    {
      name: "Processing",
      value: analysis.processing,
      color: CHART_COLORS.warning,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution Chart */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Job Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Analysis Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <span className="text-neutral-700 dark:text-neutral-300">
                Total Jobs
              </span>
              <span className="text-xl font-bold text-neutral-900 dark:text-white">
                {analysis.total}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <span className="text-neutral-700 dark:text-neutral-300">
                Total Credits Consumed
              </span>
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {analysis.totalCreditsConsumed.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <span className="text-neutral-700 dark:text-neutral-300">
                Avg Processing Time
              </span>
              <span className="text-xl font-bold text-neutral-900 dark:text-white">
                {analysis.averageProcessingTime}s
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <span className="text-neutral-700 dark:text-neutral-300">
                Success Rate
              </span>
              <span className="text-xl font-bold text-success-600 dark:text-success-400">
                {analysis.total > 0
                  ? ((analysis.completed / analysis.total) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// API Keys Tab Component
const ApiKeysTab = ({ apiKeys, onRevokeKey, isRevoking }) => {
  return (
    <div className="space-y-6">
      {/* API Usage Chart */}
      {apiKeys.usageStats && apiKeys.usageStats.length > 0 && (
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>API Usage Statistics</CardTitle>
            <CardDescription>Request count by API key</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={apiKeys.usageStats}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar
                  dataKey="requestCount"
                  fill={CHART_COLORS.primary}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* API Keys List */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          API Keys ({apiKeys.total})
        </h3>
        <div className="space-y-3">
          {apiKeys.keys.length > 0 ? (
            apiKeys.keys.map((key) => (
              <Card key={key.id} variant="bordered">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-neutral-900 dark:text-white">
                          {key.name}
                        </h4>
                        <Badge variant={key.isActive ? "success" : "error"}>
                          {key.isActive ? "Active" : "Revoked"}
                        </Badge>
                      </div>
                      <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-3">
                        {key.keyPreview}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-neutral-500 dark:text-neutral-500">
                            Requests
                          </p>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {key.requestCount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-500 dark:text-neutral-500">
                            Last Used
                          </p>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {key.lastUsedAt
                              ? format(new Date(key.lastUsedAt), "MMM dd, yyyy")
                              : "Never"}
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-500 dark:text-neutral-500">
                            Created
                          </p>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {format(new Date(key.createdAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-500 dark:text-neutral-500">
                            Expires
                          </p>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {key.expiresAt
                              ? format(new Date(key.expiresAt), "MMM dd, yyyy")
                              : "Never"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {key.isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRevokeKey(key.id, key.name)}
                        disabled={isRevoking}
                        className="text-error-600 hover:text-error-700 hover:bg-error-50 dark:hover:bg-error-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-neutral-500 py-8">
              No API keys found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
