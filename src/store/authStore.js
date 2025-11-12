import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS, USER_TYPES } from "../config/constants";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Set user and token after login
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      },

      // Update user data
      setUser: (user) => {
        set({ user });
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      },

      // Logout
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.userType === USER_TYPES.ADMIN;
      },

      // Get user type
      getUserType: () => {
        const { user } = get();
        return user?.userType;
      },

      // Initialize from localStorage
      initAuth: () => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({ user, token, isAuthenticated: true });
          } catch (error) {
            console.error("Failed to parse user data:", error);
            get().logout();
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
