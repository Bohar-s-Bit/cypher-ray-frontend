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

      // Theme - FORCED TO DARK MODE ONLY
      theme: "dark", // Always dark mode
      
      // COMMENTED OUT - Theme toggle functionality disabled
      // setTheme: (theme) => {
      //   // Update document class for Tailwind dark mode
      //   if (theme === "dark") {
      //     document.documentElement.classList.add("dark");
      //   } else {
      //     document.documentElement.classList.remove("dark");
      //   }
      //   set({ theme });
      // },
      // toggleTheme: () =>
      //   set((state) => {
      //     const newTheme = state.theme === "light" ? "dark" : "light";
      //     // Update document class for Tailwind dark mode
      //     if (newTheme === "dark") {
      //       document.documentElement.classList.add("dark");
      //     } else {
      //       document.documentElement.classList.remove("dark");
      //     }
      //     return { theme: newTheme };
      //   }),

      // Initialize theme - Always set to dark mode
      initTheme: () =>
        set(() => {
          // Always force dark mode
          document.documentElement.classList.add("dark");
          return { theme: "dark" };
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
