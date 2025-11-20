// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:6005/api";
export const APP_NAME = import.meta.env.VITE_APP_NAME || "Cypher-Ray";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";

// User Types
export const USER_TYPES = {
  ADMIN: "admin",
  USER: "user",
};

// Tier Information
export const TIERS = {
  TIER1: {
    name: "Tier 1",
    value: "tier1",
    monthlyCredits: 50,
    pricePerYear: 5000,
    features: [
      "50 monthly credits",
      "Basic firmware analysis",
      "Email support",
      "Standard reports",
    ],
  },
  TIER2: {
    name: "Tier 2",
    value: "tier2",
    monthlyCredits: 100,
    pricePerYear: 9000,
    features: [
      "100 monthly credits",
      "Advanced firmware analysis",
      "Priority support",
      "Detailed reports",
      "API access",
    ],
  },
};

// Status Options
export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

// Credit Actions
export const CREDIT_ACTIONS = {
  ADD: "add",
  SET: "set",
  DEDUCT: "deduct",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "cypher_ray_token",
  USER: "cypher_ray_user",
  THEME: "cypher_ray_theme",
};

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  CREDITS: "/credits",
  SETTINGS: "/settings",
  ANALYZE: "/analyze",
  RESULTS: "/results",
  API_DOCS: "/api-docs",

  // Admin Routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    ACCESS_REQUESTS: "/admin/access-requests",
    CREATE_USER: "/admin/users/create",
    USER_DETAILS: "/admin/users/:userId",
    STATS: "/admin/stats",
  },
};

// Query Keys for React Query
export const QUERY_KEYS = {
  USER_PROFILE: "user_profile",
  CREDIT_HISTORY: "credit_history",
  USERS_LIST: "users_list",
  ACCESS_REQUESTS: "access_requests",
  USER_DETAILS: "user_details",
  PLATFORM_STATS: "platform_stats",
  PAYMENT_PLANS: "payment_plans",
  PAYMENT_HISTORY: "payment_history",
  USER_API_KEYS: "user_api_keys",
  ANALYSIS_JOB: "analysis_job",
  ANALYSIS_HISTORY: "analysis_history",
};

// API Endpoints
export const ENDPOINTS = {
  // Auth
  USER_LOGIN: "/user/login",
  ADMIN_LOGIN: "/admin/login",

  // User
  USER_PROFILE: "/user/profile",
  UPDATE_PROFILE: "/user/profile",
  CHANGE_PASSWORD: "/user/password/change",
  REQUEST_PASSWORD_OTP: "/user/password/request-otp",
  VERIFY_PASSWORD_OTP: "/user/password/verify-otp",
  REQUEST_ACCESS: "/user/request-access",
  CREDIT_HISTORY: "/user/credits/history",
  USER_ANALYZE: "/user/analyze",
  USER_JOB_RESULT: "/user/analyze/:jobId",
  USER_ANALYSIS_HISTORY: "/user/analyze",
  USER_API_KEYS: "/user/api-keys",
  CREATE_USER_API_KEY: "/user/api-keys",
  REVOKE_USER_API_KEY: "/user/api-keys/:keyId",

  // Admin
  CREATE_USER: "/admin/users/create",
  GET_USERS: "/admin/users",
  GET_ACCESS_REQUESTS: "/admin/access-requests",
  GET_USER_DETAILS: "/admin/users/:userId",
  GET_COMPREHENSIVE_USER_DETAILS: "/admin/users/:userId/details",
  UPDATE_USER_CREDITS: "/admin/users/:userId/credits",
  UPDATE_USER_STATUS: "/admin/users/:userId/status",
  DELETE_USER: "/admin/users/:userId",
  PLATFORM_STATS: "/admin/stats",
  GET_USER_API_KEYS: "/admin/users/:userId/api-keys",
  REVOKE_API_KEY: "/admin/api-keys/:keyId",
};
