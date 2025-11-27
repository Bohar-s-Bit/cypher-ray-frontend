import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";

export default function ContactPage() {
  const [selectedService, setSelectedService] = useState("Firmware Analysis");
  const [selectedPricing, setSelectedPricing] = useState("Tier 1");

  const services = [
    "Firmware Analysis",
    "Vulnerability Detection",
    "SDK Integration",
    "API Access",
    "Enterprise Solutions",
    "Security Consultancy",
  ];

  const pricingTiers = ["Tier 1", "Tier 2", "Others"];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)" }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="pt-32 md:pt-36 pb-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="max-w-6xl w-full">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-sm font-semibold text-purple-400 mb-2 uppercase tracking-wide">
              Request Our Services
            </h2>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent mb-4">
              Explore Our Diverse Services
            </h1>
            <p className="max-w-2xl mx-auto text-purple-200/60 text-sm md:text-base leading-relaxed">
              From firmware security analysis to SDK integration and consultancy, we
              cover a broad spectrum to ensure your security requirements are fully met.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
            {/* Left Column: Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Service Selection */}
              <div>
                <label className="block text-white text-xs font-bold mb-3 uppercase tracking-wide">
                  Select Service
                </label>
                <div className="flex flex-wrap gap-2">
                  {services.map((service) => (
                    <button
                      key={service}
                      onClick={() => setSelectedService(service)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-all duration-200 border
                        ${
                          selectedService === service
                            ? "border-purple-500 text-white bg-purple-600 shadow-lg shadow-purple-500/20"
                            : "border-purple-500/30 text-purple-300 hover:border-purple-400 bg-white/5 backdrop-blur-sm hover:bg-purple-500/10"
                        }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing Selection */}
              <div>
                <label className="block text-white text-xs font-bold mb-3 uppercase tracking-wide">
                  Pricing Tier
                </label>
                <div className="flex flex-wrap gap-2">
                  {pricingTiers.map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSelectedPricing(tier)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-all duration-200 border
                        ${
                          selectedPricing === tier
                            ? "border-purple-500 text-white bg-purple-600 shadow-lg shadow-purple-500/20"
                            : "border-purple-500/30 text-purple-300 hover:border-purple-400 bg-white/5 backdrop-blur-sm hover:bg-purple-500/10"
                        }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full p-3 text-sm bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full p-3 text-sm bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    Your Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    className="w-full p-3 text-sm bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all"
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Your Message
                </label>
                <textarea
                  rows="5"
                  placeholder="Tell us about your security requirements..."
                  className="w-full p-3 text-sm bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white placeholder-purple-300/40 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button className="bg-purple-600 text-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-purple-700 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50">
                  Send Request
                </button>
              </div>
            </motion.div>

            {/* Right Column: Cypher Ray Logo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hidden lg:block h-full relative"
            >
              <div className="h-full w-full rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/30 to-purple-950/30 border border-purple-500/20 shadow-2xl shadow-purple-900/30">
                <img
                  src="/images/Cypher-ray_BG.png"
                  alt="Cypher Ray Logo"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-purple-600/20"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
