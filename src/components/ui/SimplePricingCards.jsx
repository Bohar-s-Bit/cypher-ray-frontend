import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export default function SimplePricingCards({ plans }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className={cn(
            "relative p-6 rounded-2xl border-2",
            "bg-gradient-to-br from-purple-900/20 to-purple-800/10",
            "border-purple-800/30 hover:border-purple-600/50",
            "transition-all duration-300 hover:transform hover:scale-105",
            plan.popular && "border-purple-500/50 shadow-2xl shadow-purple-500/20"
          )}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-purple-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
          )}
          
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-purple-300 text-sm mb-4">{plan.credits}</p>
            
            <div className="mb-4">
              <div className="text-3xl font-bold text-white mb-1">
                {plan.monthlyPrice}
              </div>
              <div className="text-purple-300 text-sm">per month</div>
              <div className="text-purple-400 text-xs mt-1">
                or {plan.yearlyPrice} yearly
              </div>
            </div>

            <ul className="space-y-2 text-left">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start text-neutral-300 text-sm">
                  <svg className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
}