import axiosInstance from "../lib/axios";

export const paymentService = {
  // Get all credit plans
  getPlans: async () => {
    const response = await axiosInstance.get("/payment/plans");
    return response.data;
  },

  // Create payment order
  createOrder: async (planId) => {
    const response = await axiosInstance.post("/payment/create-order", {
      planId,
    });
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await axiosInstance.post("/payment/verify", paymentData);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async (params) => {
    const response = await axiosInstance.get("/payment/history", { params });
    return response.data;
  },
};
