import React from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";
import {
  formatCurrency,
  calculatePerCreditCost,
} from "../../utils/razorpayHelper";
import { cn } from "../../lib/utils";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const PlanCard = ({ plan, onSelect, isSelected, isLoading }) => {
  const { id, name, credits, price, popular, discount } = plan;
  const perCreditCost = calculatePerCreditCost(price, credits);
  const isFeatured = id === "standard"; // Show star for Standard plan

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        ...(popular && {
          boxShadow: [
            "0 0 15px rgba(168, 85, 247, 0.3)",
            "0 0 20px rgba(168, 85, 247, 0.4)",
            "0 0 15px rgba(168, 85, 247, 0.3)",
          ]
        })
      }}
      transition={{ 
        duration: 0.3,
        ...(popular && {
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        })
      }}
      className={cn(
        "relative rounded-2xl p-6 border transition-all duration-300 cursor-pointer",
        "flex flex-col h-full", // Make card flexible height
        popular
          ? "bg-gradient-to-br from-purple-500/20 via-purple-900/30 to-blue-900/20 backdrop-blur-lg border-purple-400 shadow-xl shadow-purple-500/30 ring-2 ring-purple-400/20"
          : "bg-gradient-to-br from-purple-900/20 to-purple-950/20 backdrop-blur-lg border-purple-500/30 hover:border-purple-400/50",
        isSelected && "ring-4 ring-purple-500/40 border-purple-400"
      )}
      onClick={() => onSelect(plan)}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1.5 text-xs font-semibold text-white border border-purple-300/50 shadow-lg shadow-purple-500/50">
            <Star className="w-3.5 h-3.5 mr-1 inline fill-current" />
            Most Popular
          </span>
        </div>
      )}

      {/* Featured Star Icon (top right) */}
      {isFeatured && !popular && (
        <div className="absolute top-4 right-4">
          <Star className="w-6 h-6 text-purple-400 fill-purple-400" />
        </div>
      )}

      {/* Discount Badge */}
      {discount && (
        <div className="absolute -top-3 -right-3">
          <Badge variant="success" className="px-3 py-1 font-bold shadow-md">
            Save {discount}%
          </Badge>
        </div>
      )}

      <div className="flex flex-col flex-grow">
        {/* Plan Name */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {name}
          </h3>
          {popular && <Zap className="w-6 h-6 text-purple-400 fill-current" />}
        </div>

        {/* Credits */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-4xl font-bold text-purple-400">
            {credits}
          </span>
          <span className="text-lg text-gray-400">
            credits
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-white">
            {formatCurrency(price)}
          </span>
          <span className="text-sm text-gray-400">
            one-time
          </span>
        </div>

        {/* Per Credit Cost */}
        <div className="text-sm text-gray-400 mb-4">
          ₹{perCreditCost} per credit
        </div>

        {/* Divider */}
        <div className="border-t border-purple-500/20 mb-4" />

        {/* Features - Flex grow to take available space */}
        <ul className="space-y-2 mb-4 flex-grow">
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-300">
              {credits} firmware analysis credits
            </span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-300">
              Never expires
            </span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-300">
              Detailed security reports
            </span>
          </li>
          {popular && (
            <li className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">
                Best value for money
              </span>
            </li>
          )}
        </ul>

        {/* Select Button - Stays at bottom */}
        <div className="mt-auto">
          <Button
            variant={popular ? "primary" : "outline"}
            fullWidth
            onClick={() => onSelect(plan)}
            disabled={isLoading}
            className={cn(
              "font-semibold",
              popular && "shadow-lg shadow-purple-500/30"
            )}
          >
            {isLoading ? "Processing..." : "Select Plan"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PlanCard;
