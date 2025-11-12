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

  // Admin Routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
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
  USER_DETAILS: "user_details",
  PLATFORM_STATS: "platform_stats",
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
  CREDIT_HISTORY: "/user/credits/history",

  // Admin
  CREATE_USER: "/admin/users/create",
  GET_USERS: "/admin/users",
  GET_USER_DETAILS: "/admin/users/:userId",
  UPDATE_USER_CREDITS: "/admin/users/:userId/credits",
  UPDATE_USER_STATUS: "/admin/users/:userId/status",
  DELETE_USER: "/admin/users/:userId",
  PLATFORM_STATS: "/admin/stats",
};
