import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
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
import PlanSelectionModal from "../components/payment/PlanSelectionModal";

const CreditsPage = () => {
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [limit] = useState(20);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  // Get credit statistics from user data
  // Backend uses: credits.remaining, credits.total, credits.used
  const currentBalance = userData?.credits?.remaining || 0;
  const totalCredits = userData?.credits?.total || 0;
  const totalSpent = userData?.credits?.used || 0;

  const handleAddCredits = () => {
    console.log("🔘 Add Credits button clicked");
    setShowPaymentModal(true);
    console.log("✅ Modal state set to true");
  };

  const getTransactionIcon = (transaction) => {
    // Determine if transaction is debit or credit
    const isDebit = transaction.type === "scan" || transaction.type === "debit" || transaction.amount < 0;
    return isDebit ? (
      <ArrowDownRight className="w-5 h-5" />
    ) : (
      <ArrowUpRight className="w-5 h-5" />
    );
  };

  const getTransactionColor = (transaction) => {
    // Determine if transaction is debit or credit
    const isDebit = transaction.type === "scan" || transaction.type === "debit" || transaction.amount < 0;
    return isDebit
      ? "text-red-400 bg-red-500/20"
      : "text-green-400 bg-green-500/20";
  };

  const getDisplayAmount = (transaction) => {
    // Determine if transaction is debit or credit
    const isDebit = transaction.type === "scan" || transaction.type === "debit" || transaction.amount < 0;
    
    // For display: debits should show as negative, credits as positive
    const displayAmount = isDebit && transaction.amount > 0 
      ? -transaction.amount 
      : transaction.amount;
    
    const isCredit = !isDebit && transaction.amount > 0;
    
    return {
      amount: displayAmount,
      prefix: isCredit ? "+" : "",
      isCredit
    };
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

      {/* Payment Modal */}
      <PlanSelectionModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Credits History
            </h1>
            <p className="text-white/80 mt-2">
              Track your credit transactions and usage
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleAddCredits}>
            Add Credits
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Balance */}
          <Card className="bg-gradient-to-br from-purple-900/40 to-purple-950/20 border-2 border-purple-500/40 shadow-2xl shadow-purple-500/10" variant="elevated">
            <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-white/80 mb-1">
                  Current Balance
                </p>
                <p className="text-4xl font-bold text-purple-300 mb-2">
                  {currentBalance}
                </p>
                <p className="text-sm text-white/70">
                  credits available
                </p>
                {currentBalance < 50 && (
                  <div className="mt-3 flex items-center gap-2 text-yellow-400 text-sm bg-yellow-500/10 px-3 py-2 rounded-lg border border-yellow-500/20">
                    <TrendingDown className="w-4 h-4" />
                    <span>Credits running low</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-purple-500/30 rounded-xl border border-purple-400/30 shadow-lg shadow-purple-500/20">
                <CreditCard className="w-6 h-6 text-purple-300" />
              </div>
            </div>
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleAddCredits}
              fullWidth
              className="mt-6 shadow-lg shadow-purple-500/30"
            >
              Add Credits
            </Button>
            </CardContent>
          </Card>

          {/* Credits Spent */}
          <Card variant="elevated">
            <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/80 mb-1">
                  Credits Spent
                </p>
                <p className="text-3xl font-bold text-white">
                  {totalSpent}
                </p>
                <p className="text-sm text-white/70 mt-2 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  Total used
                </p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30 shadow-lg shadow-red-500/10">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
            </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Spinner size="lg" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-800/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No transactions yet
              </h3>
              <p className="text-white/70">
                Your credit transaction history will appear here
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-white/10">
                {transactions.map((transaction) => {
                  const displayData = getDisplayAmount(transaction);
                  
                  return (
                  <div
                    key={transaction._id}
                    className="p-6 hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`p-2 rounded-lg ${getTransactionColor(transaction)}`}
                      >
                        {getTransactionIcon(transaction)}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium text-white">
                              {transaction.description || "Credit Transaction"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4 text-neutral-400" />
                              <p className="text-sm text-white/70">
                                {formatDate(transaction.createdAt)}
                              </p>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="text-right">
                            <p
                              className={`text-xl font-bold ${
                                displayData.isCredit
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {displayData.prefix}{displayData.amount}
                            </p>
                            <Badge
                              variant={displayData.isCredit ? "success" : "error"}
                              className="mt-1"
                            >
                              {displayData.isCredit ? "Added" : "Used"}
                            </Badge>
                          </div>
                        </div>

                        {/* Balance After */}
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/70">
                              Balance after transaction
                            </span>
                            <span className="font-semibold text-white">
                              {transaction.balanceAfter} credits
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="p-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/70">
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
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreditsPage;


