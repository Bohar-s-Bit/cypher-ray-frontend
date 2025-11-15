import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/utils";

const widthClasses = {
  sm: "w-full sm:w-[300px]",
  md: "w-full sm:w-[300px] md:w-[500px]",
  lg: "w-full sm:w-[300px] md:w-[500px] lg:w-[768px]",
  xl: "w-full sm:w-[300px] md:w-[500px] lg:w-[768px] xl:w-[1024px]",
};

const outerRadiusClasses = {
  normal: "rounded-[16px]",
  rounded: "rounded-[24px]",
  moreRounded: "rounded-[32px]",
};

const paddingClasses = {
  small: "p-2",
  medium: "p-3",
  large: "p-4",
};

const innerRadiusClasses = {
  normal: "rounded-xl",
  rounded: "rounded-2xl",
  moreRounded: "rounded-3xl",
};

export default function Pricing({
  plans,
  width = "lg",
  outerRadius = "rounded",
  padding = "medium",
}) {
  const [selectedPlan, setSelectedPlan] = useState("Tier 1");
  const [billingCycle, setBillingCycle] = useState("Monthly");

  const handlePlanSelect = (planName) => {
    setSelectedPlan(planName);
  };

  const handleCycleChange = (cycle) => {
    setBillingCycle(cycle);
  };

  return (
    <div
      className={cn(
        "mx-auto shadow-xl border border-purple-800/20",
        "bg-gradient-to-br from-purple-900/10 to-black",
        widthClasses[width],
        outerRadiusClasses[outerRadius],
        paddingClasses[padding],
      )}
    >
      <div className="mb-6 flex justify-center">
        <div className="relative w-3/4 rounded-full bg-purple-800/30 p-1 pb-2">
          <motion.div
            className="absolute h-[38px] w-[calc(50%-6px)] rounded-full bg-gradient-to-r from-purple-600 to-purple-500"
            layoutId="cycleBackground"
            initial={billingCycle === "Monthly" ? { x: 2 } : { x: "calc(100% + 2px)" }}
            animate={billingCycle === "Monthly" ? { x: 2 } : { x: "calc(100% + 2px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <div className="relative z-10 flex">
            {["Monthly", "Yearly"].map((cycle) => (
              <motion.button
                key={cycle}
                className={cn(
                  "z-20 w-1/2 rounded-full py-1 text-lg font-extrabold transition-colors duration-200",
                  billingCycle === cycle ? "text-white" : "text-purple-300",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCycleChange(cycle);
                }}
                whileTap={{ scale: 0.95 }}
              >
                {cycle}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {plans.map((plan) => (
        <motion.div
          key={plan.name}
          className={cn(
            "relative mb-4 cursor-pointer border-2 p-6",
            innerRadiusClasses[outerRadius],
            selectedPlan === plan.name 
              ? "border-purple-500 bg-gradient-to-br from-purple-900/20 to-purple-800/10" 
              : "border-purple-800/30 bg-gradient-to-br from-purple-900/5 to-transparent",
          )}
          onClick={() => handlePlanSelect(plan.name)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          layout
        >
          <AnimatePresence>
            {selectedPlan === plan.name && (
              <motion.div
                className={cn(
                  "absolute inset-0 border-4 border-purple-500",
                  innerRadiusClasses[outerRadius],
                )}
                layoutId="selectedPlanBorder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
          
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div>
              <span className="font-bold text-white text-lg">{plan.name}</span>
              {plan.popular && (
                <span className="ml-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 px-3 py-1 text-xs text-white font-semibold">
                  Popular
                </span>
              )}
            </div>
            <motion.div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border-2",
                selectedPlan === plan.name ? "border-purple-500 bg-purple-500" : "border-purple-400",
              )}
              animate={{ scale: selectedPlan === plan.name ? 1 : 0.8 }}
            >
              {selectedPlan === plan.name && (
                <motion.div
                  className="h-3 w-3 rounded-full bg-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </motion.div>
          </div>

          <div className="relative z-10 mb-4">
            <AnimatedPrice
              monthlyPrice={plan.monthlyPrice}
              yearlyPrice={plan.yearlyPrice}
              billingCycle={billingCycle}
            />
            <p className="text-purple-300 text-sm mt-1">{plan.credits}</p>
          </div>

          <div className="relative z-10">
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-neutral-300 text-sm">
                  <svg className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}

      <motion.button
        className={cn(
          "w-full py-4 font-bold text-white mt-6",
          "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400",
          "transition-all duration-300",
          innerRadiusClasses[outerRadius]
        )}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
      >
        Get Started
      </motion.button>
    </div>
  );
}

function AnimatedPrice({
  monthlyPrice,
  yearlyPrice,
  billingCycle,
}) {
  const [price, setPrice] = useState(monthlyPrice);
  const animationRef = useRef(null);

  useEffect(() => {
    const targetPrice = billingCycle === "Monthly" ? monthlyPrice : yearlyPrice;
    const startValue = parseFloat(price.replace(/[^0-9.-]+/g, ""));
    const endValue = parseFloat(targetPrice.replace(/[^0-9.-]+/g, ""));
    const duration = 50;
    const startTime = Date.now();

    const animatePrice = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentValue = startValue + (endValue - startValue) * progress;

      setPrice(`₹${currentValue.toFixed(0)}`);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animatePrice);
      } else {
        setPrice(targetPrice);
      }
    };

    animatePrice();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [price, billingCycle, monthlyPrice, yearlyPrice]);

  return (
    <div>
      <span className="text-3xl font-bold text-white">{price}</span>
      <span className="text-purple-300 text-lg">/{billingCycle.toLowerCase().slice(0, -2)}</span>
    </div>
  );
}