import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "../config/constants";
import toast from "react-hot-toast";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    const currentPath = window.location.pathname;

    // Handle specific error codes
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on the login page
      if (currentPath !== "/login" && currentPath !== "/") {
        // Unauthorized - clear local storage and redirect to login
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = "/login";
        toast.error("Session expired. Please login again.");
      }
      // Don't show toast on login page - let the page handle it
    } else if (error.response?.status === 403) {
      toast.error("Access denied. You do not have permission.");
    } else if (error.response?.status === 404) {
      toast.error("Resource not found.");
    } else if (error.response?.status === 500) {
      toast.error("Server error. Please try again later.");
    } else if (currentPath !== "/login" && currentPath !== "/") {
      // Only show generic error toast if not on login page
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
