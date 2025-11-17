import { create } from "zustand";

const useCreditsStore = create((set) => ({
  // Selected plan for payment
  selectedPlan: null,

  // Payment in progress status
  isPaymentInProgress: false,

  // Last payment result
  lastPaymentResult: null,

  // Actions
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),

  clearSelectedPlan: () => set({ selectedPlan: null }),

  setPaymentInProgress: (status) => set({ isPaymentInProgress: status }),

  setLastPaymentResult: (result) => set({ lastPaymentResult: result }),

  clearLastPaymentResult: () => set({ lastPaymentResult: null }),

  // Reset store
  reset: () =>
    set({
      selectedPlan: null,
      isPaymentInProgress: false,
      lastPaymentResult: null,
    }),
}));

export default useCreditsStore;
