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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "relative rounded-2xl p-6 border-2 transition-all duration-300",
        popular
          ? "border-primary-500 bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-neutral-800 shadow-xl"
          : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-primary-300 dark:hover:border-primary-600",
        isSelected && "ring-4 ring-primary-200 dark:ring-primary-800"
      )}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge
            variant="primary"
            className="px-4 py-1.5 font-semibold shadow-lg"
          >
            <Star className="w-3.5 h-3.5 mr-1 fill-current" />
            Most Popular
          </Badge>
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

      <div className="space-y-4">
        {/* Plan Name */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {name}
          </h3>
          {popular && <Zap className="w-6 h-6 text-primary-500 fill-current" />}
        </div>

        {/* Credits */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            {credits}
          </span>
          <span className="text-lg text-neutral-600 dark:text-neutral-400">
            credits
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-neutral-900 dark:text-white">
            {formatCurrency(price)}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            one-time
          </span>
        </div>

        {/* Per Credit Cost */}
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          ₹{perCreditCost} per credit
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-200 dark:border-neutral-700" />

        {/* Features */}
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
            <span className="text-neutral-700 dark:text-neutral-300">
              {credits} firmware analysis credits
            </span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
            <span className="text-neutral-700 dark:text-neutral-300">
              Never expires
            </span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
            <span className="text-neutral-700 dark:text-neutral-300">
              Detailed security reports
            </span>
          </li>
          {popular && (
            <li className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
              <span className="text-neutral-700 dark:text-neutral-300">
                Best value for money
              </span>
            </li>
          )}
        </ul>

        {/* Select Button */}
        <Button
          variant={popular ? "primary" : "outline"}
          fullWidth
          onClick={() => onSelect(plan)}
          disabled={isLoading}
          className={cn(
            "mt-4 font-semibold",
            popular && "shadow-lg shadow-primary-500/30"
          )}
        >
          {isLoading ? "Processing..." : "Select Plan"}
        </Button>
      </div>
    </motion.div>
  );
};

export default PlanCard;
