import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "../services/paymentService";
import { QUERY_KEYS } from "../config/constants";
import toast from "react-hot-toast";

/**
 * Hook to fetch all credit plans
 */
export const usePaymentPlans = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENT_PLANS],
    queryFn: paymentService.getPlans,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to create payment order
 */
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (planId) => paymentService.createOrder(planId),
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to create payment order";
      toast.error(message);
    },
  });
};

/**
 * Hook to verify payment
 */
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentData) => paymentService.verifyPayment(paymentData),
    onSuccess: (data) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CREDIT_HISTORY] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PAYMENT_HISTORY],
      });

      const credits = data?.payment?.creditsAmount || 0;
      toast.success(
        `🎉 Payment successful! ${credits} credits added to your account`,
        {
          duration: 5000,
        }
      );
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Payment verification failed";
      toast.error(
        `${message}. Please contact support if amount was deducted.`,
        {
          duration: 8000,
        }
      );
    },
  });
};

/**
 * Hook to fetch payment history
 */
export const usePaymentHistory = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENT_HISTORY, params],
    queryFn: () => paymentService.getPaymentHistory(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
