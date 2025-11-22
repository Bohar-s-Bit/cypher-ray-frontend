import React, { useState, useEffect, useRef } from "react";
import {
  X,
  CreditCard,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../ui/Modal";
import PlanCard from "./PlanCard";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import {
  usePaymentPlans,
  useCreateOrder,
  useVerifyPayment,
} from "../../hooks/usePayment";
import {
  openRazorpayCheckout,
  validatePaymentResponse,
  isRazorpayLoaded,
} from "../../utils/razorpayHelper";
import useCreditsStore from "../../store/creditsStore";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PlanSelectionModal = ({ isOpen, onClose }) => {
  const { width, height } = useWindowSize();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const { user } = useAuthStore();
  const { setPaymentInProgress, isPaymentInProgress } = useCreditsStore();

  // React Query hooks
  const {
    data: plansData,
    isLoading: isLoadingPlans,
    error: plansError,
  } = usePaymentPlans();
  const createOrder = useCreateOrder();
  const verifyPayment = useVerifyPayment();

  const plans = plansData?.plans || [];

  console.log("🎯 PlanSelectionModal - isOpen:", isOpen);

  // Scroll to plan
  const scrollToPlan = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const planWidth = container.scrollWidth / plans.length;
      container.scrollTo({
        left: planWidth * index,
        behavior: "smooth",
      });
      setCurrentPlanIndex(index);
    }
  };

  const handleNextPlan = () => {
    if (currentPlanIndex < plans.length - 1) {
      scrollToPlan(currentPlanIndex + 1);
    }
  };

  const handlePrevPlan = () => {
    if (currentPlanIndex > 0) {
      scrollToPlan(currentPlanIndex - 1);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedPlan(null);
      setShowConfetti(false);
      setCurrentPlanIndex(0);
    }
  }, [isOpen]);

  // Handle scroll to update current plan index
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.scrollWidth / plans.length;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentPlanIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [plans.length]);

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  // Handle payment initiation
  const handleProceedToPayment = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    // Check if Razorpay is loaded
    if (!isRazorpayLoaded()) {
      toast.error("Payment gateway unavailable. Please refresh the page.");
      return;
    }

    try {
      setPaymentInProgress(true);

      // Create order
      const orderData = await createOrder.mutateAsync(selectedPlan.id);

      if (!orderData?.order) {
        throw new Error("Failed to create payment order");
      }

      const { order, key } = orderData;

      // Razorpay options
      const options = {
        key: key, // Razorpay key from backend
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Cypher-Ray",
        description: `${selectedPlan.name} Plan - ${selectedPlan.credits} Credits`,
        order_id: order.id,
        prefill: {
          name: user?.username || user?.email?.split("@")[0] || "",
          email: user?.email || "",
          contact: "", // User can enter phone
        },
        theme: {
          color: "#3B82F6", // Primary blue
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: "Pay using bank account",
                instruments: [
                  {
                    method: "netbanking",
                  },
                  {
                    method: "upi",
                  },
                ],
              },
              card: {
                name: "Pay using card",
                instruments: [
                  {
                    method: "card",
                  },
                ],
              },
              wallet: {
                name: "Pay using wallet",
                instruments: [
                  {
                    method: "wallet",
                  },
                ],
              },
            },
            sequence: ["block.card", "block.banks", "block.wallet"],
            preferences: {
              show_default_blocks: false, // Disable Pay Later
            },
          },
        },
        notes: {
          userId: user?._id,
          planId: selectedPlan.id,
        },
      };

      // Open Razorpay checkout
      openRazorpayCheckout(
        options,
        // Success handler
        async (response) => {
          console.log("💳 Razorpay Payment Success:", response);
          try {
            // Validate response
            if (!validatePaymentResponse(response)) {
              throw new Error("Invalid payment response");
            }

            console.log("✅ Sending verification request to backend...");

            // Verify payment with backend
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            console.log("📤 Verification data:", verificationData);

            const result = await verifyPayment.mutateAsync(verificationData);

            console.log("✅ Payment verified successfully:", result);

            // Show confetti
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);

            // Close modal after 2 seconds
            setTimeout(() => {
              onClose();
            }, 2000);
          } catch (error) {
            console.error("❌ Payment verification error:", error);
            console.error("Error details:", error.response?.data);
          } finally {
            setPaymentInProgress(false);
          }
        },
        // Failure handler
        (error) => {
          setPaymentInProgress(false);

          if (error.message === "Payment cancelled by user") {
            toast("Payment cancelled", { icon: "ℹ️" });
          } else {
            toast.error(error.description || error.message || "Payment failed");
          }
        }
      );
    } catch (error) {
      setPaymentInProgress(false);
      console.error("Payment initiation error:", error);
    }
  };

  // Retry loading plans
  const handleRetryPlans = () => {
    window.location.reload();
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalHeader onClose={onClose}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <CreditCard className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Choose Your Plan
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Select a credit plan to continue analyzing firmware
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="pt-10 pb-6 px-6">
          {/* Loading State */}
          {isLoadingPlans && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton height={300} borderRadius={16} />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {plansError && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Failed to Load Plans
              </h3>
              <p className="text-gray-400 mb-6">
                Unable to fetch credit plans. Please try again.
              </p>
              <Button variant="primary" onClick={handleRetryPlans}>
                Retry
              </Button>
            </div>
          )}

          {/* Plans Grid - Scrollable */}
          {!isLoadingPlans && !plansError && plans.length > 0 && (
            <div className="relative px-2 pt-8 pb-4">
              {/* Navigation Buttons */}
              {plans.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPlan}
                    disabled={currentPlanIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-purple-900/50 backdrop-blur-sm rounded-full shadow-lg border border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-800/50 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-purple-400" />
                  </button>
                  <button
                    onClick={handleNextPlan}
                    disabled={currentPlanIndex === plans.length - 1}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-purple-900/50 backdrop-blur-sm rounded-full shadow-lg border border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-800/50 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-purple-400" />
                  </button>
                </>
              )}

              {/* Scrollable Container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {plans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-center flex"
                  >
                    <PlanCard
                      plan={plan}
                      onSelect={handlePlanSelect}
                      isSelected={selectedPlan?.id === plan.id}
                      isLoading={isPaymentInProgress}
                    />
                  </div>
                ))}
              </div>

              {/* Dots Indicator */}
              {plans.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {plans.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToPlan(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentPlanIndex
                          ? "w-8 bg-purple-500"
                          : "w-2 bg-purple-500/30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selected Plan Summary */}
          {selectedPlan && (
            <div className="mt-8 p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl border-2 border-purple-500/30 backdrop-blur-sm">
              <h3 className="font-semibold text-purple-300 mb-3">
                Selected Plan Summary
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Plan</p>
                  <p className="font-semibold text-white">
                    {selectedPlan.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">
                    Credits
                  </p>
                  <p className="font-semibold text-white">
                    {selectedPlan.credits}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">
                    Amount
                  </p>
                  <p className="font-semibold text-white">
                    ₹{selectedPlan.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <div className="flex items-center justify-between w-full gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isPaymentInProgress}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleProceedToPayment}
              disabled={!selectedPlan || isPaymentInProgress}
              icon={isPaymentInProgress ? Loader2 : CreditCard}
              className={isPaymentInProgress ? "animate-pulse" : ""}
            >
              {isPaymentInProgress ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default PlanSelectionModal;
