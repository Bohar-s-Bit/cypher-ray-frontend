import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUIStore = create(
  persist(
    (set) => ({
      // Sidebar state
      sidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Mobile menu state
      mobileMenuOpen: false,
      toggleMobileMenu: () =>
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      // Theme
      theme: "light",
      setTheme: (theme) => {
        // Update document class for Tailwind dark mode
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        set({ theme });
      },
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";
          // Update document class for Tailwind dark mode
          if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { theme: newTheme };
        }),

      // Initialize theme from storage
      initTheme: () =>
        set((state) => {
          if (state.theme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return state;
        }),

      // Loading states
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      // Modal states
      modals: {},
      openModal: (modalName) =>
        set((state) => ({
          modals: { ...state.modals, [modalName]: true },
        })),
      closeModal: (modalName) =>
        set((state) => ({
          modals: { ...state.modals, [modalName]: false },
        })),
    }),
    {
      name: "cypher-ray-ui",
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

export default useUIStore;
