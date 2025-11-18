import axiosInstance from "../lib/axios";
import { ENDPOINTS } from "../config/constants";

export const authService = {
  // User login
  userLogin: async (credentials) => {
    const response = await axiosInstance.post(
      ENDPOINTS.USER_LOGIN,
      credentials
    );
    return response.data;
  },

  // Admin login
  adminLogin: async (credentials) => {
    const response = await axiosInstance.post(
      ENDPOINTS.ADMIN_LOGIN,
      credentials
    );
    return response.data;
  },

  // Get user profile
  getUserProfile: async () => {
    const response = await axiosInstance.get(ENDPOINTS.USER_PROFILE);
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (data) => {
    const response = await axiosInstance.put(ENDPOINTS.UPDATE_PROFILE, data);
    return response.data;
  },

  // Change password
  changePassword: async (data) => {
    const response = await axiosInstance.put(ENDPOINTS.CHANGE_PASSWORD, data);
    return response.data;
  },

  // Request password change OTP
  requestPasswordOTP: async (data) => {
    const response = await axiosInstance.post(
      ENDPOINTS.REQUEST_PASSWORD_OTP,
      data
    );
    return response.data;
  },

  // Verify OTP and change password
  verifyOTPAndChangePassword: async (data) => {
    const response = await axiosInstance.put(
      ENDPOINTS.VERIFY_PASSWORD_OTP,
      data
    );
    return response.data;
  },

  // Get credit history
  getCreditHistory: async (params) => {
    const response = await axiosInstance.get(ENDPOINTS.CREDIT_HISTORY, {
      params,
    });
    return response.data;
  },

  // Request access to platform (public - no auth required)
  requestAccess: async (data) => {
    const response = await axiosInstance.post(ENDPOINTS.REQUEST_ACCESS, data);
    return response.data;
  },
};
