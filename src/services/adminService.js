import axiosInstance from "../lib/axios";
import { ENDPOINTS } from "../config/constants";

export const adminService = {
  // Create new user
  createUser: async (userData) => {
    const response = await axiosInstance.post(ENDPOINTS.CREATE_USER, userData);
    return response.data;
  },

  // Get all users with filters
  getUsers: async (params) => {
    const response = await axiosInstance.get(ENDPOINTS.GET_USERS, { params });
    return response.data;
  },

  // Get user details
  getUserDetails: async (userId) => {
    const endpoint = ENDPOINTS.GET_USER_DETAILS.replace(":userId", userId);
    const response = await axiosInstance.get(endpoint);
    return response.data;
  },

  // Update user credits
  updateUserCredits: async (userId, creditData) => {
    const endpoint = ENDPOINTS.UPDATE_USER_CREDITS.replace(":userId", userId);
    const response = await axiosInstance.put(endpoint, creditData);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (userId, statusData) => {
    const endpoint = ENDPOINTS.UPDATE_USER_STATUS.replace(":userId", userId);
    const response = await axiosInstance.patch(endpoint, statusData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const endpoint = ENDPOINTS.DELETE_USER.replace(":userId", userId);
    const response = await axiosInstance.delete(endpoint);
    return response.data;
  },

  // Get platform statistics
  getPlatformStats: async () => {
    const response = await axiosInstance.get(ENDPOINTS.PLATFORM_STATS);
    return response.data;
  },
};
