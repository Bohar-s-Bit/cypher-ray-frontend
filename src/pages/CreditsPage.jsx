import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { authService } from "../services/authService";
import { QUERY_KEYS, APP_NAME, PAGINATION } from "../config/constants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";

const CreditsPage = () => {
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [limit] = useState(20);

  // Fetch user profile to get current credits
  const { data: profileData } = useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: authService.getUserProfile,
  });

  // Fetch credit history
  const { data: historyData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CREDIT_HISTORY, page, limit],
    queryFn: () => authService.getCreditHistory({ page, limit }),
  });

  const userData = profileData?.data?.user;
  const transactions = historyData?.data?.transactions || [];
  const pagination = historyData?.data?.pagination || {};

  // Get credit statistics from user data (not calculated from transactions)
  const availableCredits = userData?.credits?.available || 0;
  const totalEarned = userData?.credits?.total || 0;
  const totalSpent = userData?.credits?.used || 0;

  const handleAddCredits = () => {
    toast.success("Razorpay Integration Coming Soon!", {
      duration: 3000,
      icon: "🚀",
    });
  };

  const getTransactionIcon = (amount) => {
    return amount > 0 ? (
      <ArrowUpRight className="w-5 h-5" />
    ) : (
      <ArrowDownRight className="w-5 h-5" />
    );
  };

  const getTransactionColor = (amount) => {
    return amount > 0
      ? "text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/30"
      : "text-error-600 dark:text-error-400 bg-error-100 dark:bg-error-900/30";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Helmet>
        <title>Credits History - {APP_NAME}</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              Credits History
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Track your credit transactions and usage
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleAddCredits}>
            Add Credits
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Available Credits */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Available Credits
                </p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {availableCredits}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  Ready to use
                </p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </Card>

          {/* Credits Earned */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Credits Earned
                </p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {totalEarned}
                </p>
                <p className="text-sm text-success-600 dark:text-success-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  All time
                </p>
              </div>
              <div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </Card>

          {/* Credits Spent */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Credits Spent
                </p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {totalSpent}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  This month
                </p>
              </div>
              <div className="p-3 bg-error-100 dark:bg-error-900/30 rounded-lg">
                <TrendingDown className="w-6 h-6 text-error-600 dark:text-error-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Transactions List */}
        <Card>
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Transaction History
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Spinner size="lg" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                No transactions yet
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Your credit transaction history will appear here
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`p-2 rounded-lg ${getTransactionColor(
                          transaction.amount
                        )}`}
                      >
                        {getTransactionIcon(transaction.amount)}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {transaction.description || "Credit Transaction"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4 text-neutral-400" />
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {formatDate(transaction.createdAt)}
                              </p>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="text-right">
                            <p
                              className={`text-xl font-bold ${
                                transaction.amount > 0
                                  ? "text-success-600 dark:text-success-400"
                                  : "text-error-600 dark:text-error-400"
                              }`}
                            >
                              {transaction.amount > 0 ? "+" : ""}
                              {transaction.amount}
                            </p>
                            <Badge
                              variant={
                                transaction.amount > 0 ? "success" : "error"
                              }
                              className="mt-1"
                            >
                              {transaction.amount > 0 ? "credit" : "debit"}
                            </Badge>
                          </div>
                        </div>

                        {/* Balance After */}
                        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">
                              Balance after transaction
                            </span>
                            <span className="font-semibold text-neutral-900 dark:text-white">
                              {transaction.balanceAfter} credits
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="p-6 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Showing {(pagination.currentPage - 1) * limit + 1} to{" "}
                      {Math.min(
                        pagination.currentPage * limit,
                        pagination.totalItems
                      )}{" "}
                      of {pagination.totalItems} transactions
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={!pagination.hasPrevPage}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={!pagination.hasNextPage}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default CreditsPage;
