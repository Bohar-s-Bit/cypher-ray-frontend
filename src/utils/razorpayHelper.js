/**
 * Razorpay Helper Utilities
 * Handles Razorpay script loading and checkout initialization
 */

/**
 * Check if Razorpay script is loaded
 */
export const isRazorpayLoaded = () => {
  return typeof window.Razorpay !== "undefined";
};

/**
 * Wait for Razorpay script to load
 */
export const waitForRazorpay = () => {
  return new Promise((resolve, reject) => {
    if (isRazorpayLoaded()) {
      resolve(true);
      return;
    }

    // Wait for script to load (max 10 seconds)
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
      attempts++;
      if (isRazorpayLoaded()) {
        clearInterval(interval);
        resolve(true);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        reject(new Error("Razorpay script failed to load"));
      }
    }, 500);
  });
};

/**
 * Open Razorpay checkout
 * @param {Object} options - Razorpay checkout options
 * @param {Function} onSuccess - Success callback
 * @param {Function} onFailure - Failure callback
 */
export const openRazorpayCheckout = async (options, onSuccess, onFailure) => {
  try {
    // Ensure Razorpay is loaded
    await waitForRazorpay();

    const razorpay = new window.Razorpay({
      ...options,
      handler: (response) => {
        // Payment successful
        onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          // User closed modal without paying
          onFailure(new Error("Payment cancelled by user"));
        },
      },
    });

    razorpay.on("payment.failed", (response) => {
      // Payment failed
      onFailure(response.error);
    });

    razorpay.open();
  } catch (error) {
    onFailure(error);
  }
};

/**
 * Format amount to display in INR
 * @param {number} amount - Amount in rupees
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate per credit cost
 * @param {number} price - Total price in rupees
 * @param {number} credits - Number of credits
 */
export const calculatePerCreditCost = (price, credits) => {
  const cost = price / credits;
  return cost.toFixed(2);
};

/**
 * Validate Razorpay payment response
 * @param {Object} response - Razorpay payment response
 */
export const validatePaymentResponse = (response) => {
  return (
    response &&
    response.razorpay_payment_id &&
    response.razorpay_order_id &&
    response.razorpay_signature
  );
};
