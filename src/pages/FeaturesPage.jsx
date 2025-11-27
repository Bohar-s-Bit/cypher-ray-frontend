import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Zap, BarChart3, Check } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import DatabaseWithRestApi from "../components/ui/DatabaseWithRestApi";
import { cn } from "../lib/utils";

const FeaturedIcon = ({ icon: Icon, className }) => {
  return (
    <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 shadow-lg shadow-purple-500/30 flex items-center justify-center", className)}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  );
};

const CheckItemText = ({ text }) => {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">
        <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
          <Check className="w-4 h-4 text-purple-400" />
        </div>
      </div>
      <span className="text-purple-200/80 text-base leading-relaxed">{text}</span>
    </li>
  );
};

const AlternateImageMockup = ({ children, className }) => {
  return (
    <div
      className={cn(
        "size-full rounded-lg bg-gradient-to-br from-purple-900/40 to-purple-950/40 p-[1px] shadow-2xl shadow-purple-900/50 ring-[0.5px] ring-purple-500/30 ring-inset md:rounded-2xl md:p-[2px] lg:absolute lg:w-auto lg:max-w-none",
        className
      )}
    >
      <div className="size-full rounded-[7px] bg-gradient-to-br from-purple-950/30 to-purple-900/20 p-[2px] md:rounded-[18px] md:p-[3.5px]">
        <div className="relative size-full overflow-hidden rounded-[6px] ring-[0.5px] ring-purple-500/20 md:rounded-[15px] md:ring-[1.25px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)" }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <section className="flex flex-col gap-12 overflow-hidden pt-32 md:pt-36 pb-16 sm:gap-16 md:gap-20 lg:gap-24">
        {/* Header Section */}
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
          >
            <span className="text-sm font-semibold text-purple-400 md:text-base uppercase tracking-wide">
              Features
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent">
              Advanced Security for Your Firmware
            </h2>
            <p className="mt-4 text-lg text-purple-200/60 md:mt-5 md:text-xl max-w-2xl">
              Powerful firmware security analysis platform with advanced threat detection, SDK integration, and flexible credit management. Trusted by government and enterprise organizations.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 sm:gap-24 md:gap-32 md:px-8 lg:gap-40">
          {/* Feature 1: Share team inboxes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-2 lg:gap-24 lg:items-center"
          >
            <div className="max-w-xl flex-1">
              <FeaturedIcon icon={MessageCircle} />
              <h2 className="mt-5 text-2xl md:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Firmware Binary Analysis
              </h2>
              <p className="mt-2 text-base md:text-lg text-purple-200/70 md:mt-4">
                Upload your firmware binaries and get comprehensive security analysis powered by advanced AI models. Detect vulnerabilities before deployment.
              </p>
              <ul className="mt-8 flex flex-col gap-4 md:gap-5">
                <CheckItemText text="AI-powered cryptographic algorithm detection" />
                <CheckItemText text="Real-time vulnerability scanning and threat analysis" />
                <CheckItemText text="Detailed reports with remediation recommendations" />
              </ul>
            </div>

            <div className="relative w-full flex-1 lg:h-[512px]">
              <AlternateImageMockup className="lg:left-0">
                <img
                  alt="Dashboard mockup showing application interface"
                  src="https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-dark-01.webp"
                  className="size-full object-cover lg:w-auto lg:max-w-none"
                />
              </AlternateImageMockup>
            </div>
          </motion.div>

          {/* Feature 2: Deliver instant answers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-2 lg:gap-24 lg:items-center"
          >
            <div className="max-w-xl flex-1 lg:order-last">
              <FeaturedIcon icon={Zap} />
              <h2 className="mt-5 text-2xl md:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                SDK for Your Big Codebase
              </h2>
              <p className="mt-2 text-base md:text-lg text-purple-200/70 md:mt-4">
                Integrate Cypher-Ray's powerful security analysis directly into your development workflow with our comprehensive SDK and API.
              </p>
              <ul className="mt-8 flex flex-col gap-4 md:gap-5">
                <CheckItemText text="Seamless CI/CD pipeline integration" />
                <CheckItemText text="RESTful API with comprehensive documentation" />
                <CheckItemText text="Automated security checks for every build" />
              </ul>
            </div>

            <div className="relative w-full flex-1 lg:h-[512px]">
              <AlternateImageMockup className="lg:right-0">
                <img
                  alt="Dashboard mockup showing application interface"
                  src="https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-dark-01.webp"
                  className="size-full object-cover lg:w-auto lg:max-w-none"
                />
              </AlternateImageMockup>
            </div>
          </motion.div>

          {/* Feature 3: Manage your team with reports */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-2 lg:gap-24 lg:items-center"
          >
            <div className="max-w-xl flex-1">
              <FeaturedIcon icon={BarChart3} />
              <h2 className="mt-5 text-2xl md:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Simplified Credit System
              </h2>
              <p className="mt-2 text-base md:text-lg text-purple-200/70 md:mt-4">
                Flexible credit-based pricing that scales with your needs. Pay only for what you use with transparent pricing and easy credit management.
              </p>
              <ul className="mt-8 flex flex-col gap-4 md:gap-5">
                <CheckItemText text="Flexible tier-based pricing plans" />
                <CheckItemText text="Real-time credit usage tracking and analytics" />
                <CheckItemText text="No hidden fees - credits never expire" />
              </ul>
            </div>

            <div className="relative w-full flex-1 lg:h-[512px]">
              <AlternateImageMockup className="lg:left-0">
                <img
                  alt="Dashboard mockup showing application interface"
                  src="https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-dark-01.webp"
                  className="size-full object-cover lg:w-auto lg:max-w-none"
                />
              </AlternateImageMockup>
            </div>
          </motion.div>
        </div>

        {/* API Integration Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center w-full pt-12 pb-20"
        >
          <DatabaseWithRestApi
            title="Firmware Binary Analysis"
            circleText="AI"
            badgeTexts={{
              first: "CypherLLM",
              second: "Model 1",
              third: "Model 2",
              fourth: "SDK",
            }}
            buttonTexts={{
              first: "Encryption",
              second: "Cryptography",
              third: "Homologs",
              fourth: "Algorithms",
              fifth: "Security",
              sixth: "Source Code",
            }}
            lightColor="#a855f7"
          />
        </motion.div>
      </section>
    </div>
  );
}
