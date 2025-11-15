import React, { Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  CheckCircle,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Award,
  Globe,
} from "lucide-react";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import BookmarkButton from "../components/ui/BookmarkButton";
import { HyperText } from "../components/ui/HyperText";
import { ROUTES, APP_NAME } from "../config/constants";

// Lazy load heavy components
const FloatingLines = lazy(() => import("../components/ui/FloatingLines"));
const MagicBento = lazy(() => import("../components/ui/MagicBento"));
const Terminal = lazy(() => import("../components/ui/Terminal").then(module => ({ default: module.Terminal })));
const TypingAnimation = lazy(() => import("../components/ui/Terminal").then(module => ({ default: module.TypingAnimation })));
const AnimatedSpan = lazy(() => import("../components/ui/Terminal").then(module => ({ default: module.AnimatedSpan })));

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Advanced Security Analysis",
      description:
        "Comprehensive firmware security scanning with cutting-edge threat detection",
      color: "text-primary-500 dark:text-primary-400",
      bgColor: "bg-primary-50 dark:bg-primary-900/30",
    },
    {
      icon: Lock,
      title: "Vulnerability Detection",
      description:
        "Identify security vulnerabilities before they become threats",
      color: "text-secondary-500 dark:text-secondary-400",
      bgColor: "bg-secondary-50 dark:bg-secondary-900/30",
    },
    {
      icon: CheckCircle,
      title: "Compliance Ready",
      description: "Meet government and industry security compliance standards",
      color: "text-success-500 dark:text-success-400",
      bgColor: "bg-success-50 dark:bg-success-900/30",
    },
    {
      icon: TrendingUp,
      title: "Real-time Monitoring",
      description: "Continuous monitoring and instant threat notifications",
      color: "text-warning-500 dark:text-warning-400",
      bgColor: "bg-warning-50 dark:bg-warning-900/30",
    },
    {
      icon: Users,
      title: "Multi-tenant Platform",
      description: "Secure, isolated environments for multiple organizations",
      color: "text-primary-600 dark:text-primary-400",
      bgColor: "bg-primary-100 dark:bg-primary-900/30",
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Lightning-fast analysis powered by advanced algorithms",
      color: "text-secondary-600 dark:text-secondary-400",
      bgColor: "bg-secondary-100 dark:bg-secondary-900/30",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Firmware Analyzed", icon: Shield },
    { value: "99.9%", label: "Detection Accuracy", icon: Award },
    { value: "500+", label: "Organizations", icon: Users },
    { value: "24/7", label: "Support", icon: Globe },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Dark Background Base */}
        <div className="absolute inset-0 w-full h-full" style={{ background: 'linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)' }}></div>
        
        {/* FloatingLines Background */}
        <div className="absolute inset-0 w-full h-full">
          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent animate-pulse" />}>
            <FloatingLines 
              enabledWaves={['top', 'middle', 'bottom']}
              lineCount={5}
              lineDistance={5}
              bendRadius={5.0}
              bendStrength={-0.5}
              interactive={true}
              parallax={true}
              parallaxStrength={0.2}
              animationSpeed={1}
              mouseDamping={0.05}
              mixBlendMode="screen"
              linesGradient={['#2d1b47', '#4a0582', '#7808d0', '#a855f7', '#c084fc']}
              topWavePosition={{ x: 10.0, y: 0.5, rotate: -0.4 }}
              middleWavePosition={{ x: 5.0, y: 0.0, rotate: 0.2 }}
              bottomWavePosition={{ x: 2.0, y: -0.7, rotate: -1 }}
            />
          </Suspense>
        </div>

        {/* Gradient Overlay for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 z-5" style={{ background: 'linear-gradient(to top, #060010 0%, rgba(10, 0, 21, 0.6) 60%, transparent 100%)' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm border border-white/10 text-white px-4 py-2 rounded-full mb-6 font-medium">
              <Shield className="w-4 h-4" />
              <span>Trusted by Government & Enterprise</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              Secure Your Firmware
              <br />
              <HyperText 
                className="text-5xl md:text-7xl font-display font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                startOnView={true}
                delay={500}
                duration={1000}
                animateOnHover={true}
              >
                Protect Your Future
              </HyperText>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto">
              {APP_NAME} provides enterprise-grade firmware security analysis
              for government organizations and businesses across India.
            </p>

            <div className="flex justify-center items-center">
              <BookmarkButton
                onClick={() => navigate(ROUTES.LOGIN)}
                text="Get Started"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-transparent -mt-12 pt-20" style={{ background: 'linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 dark:text-white mb-4">
              Advanced Security Features
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Comprehensive firmware analysis powered by cutting-edge technology
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 bg-neutral-800 rounded-xl animate-pulse" />
                ))}
              </div>
            }>
              <MagicBento 
                textAutoHide={true}
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
                spotlightRadius={300}
                particleCount={12}
                glowColor="132, 0, 255"
              />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* SDK for Big Organizations Section */}
      <section className="py-20 bg-transparent" style={{ background: 'linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              SDK for Big Organizations
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Integrate Cypher-Ray's powerful security analysis directly into your development workflow
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <Suspense fallback={
              <div className="border border-purple-800/30 bg-gradient-to-br from-neutral-900 to-purple-900/20 max-w-6xl w-full rounded-xl shadow-2xl shadow-purple-900/20 h-96">
                <div className="border-b border-purple-800/30 flex flex-col gap-y-2 p-4">
                  <div className="flex flex-row gap-x-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-neutral-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-neutral-700 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-neutral-700 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            }>
              <Terminal className="bg-neutral-900 border-neutral-700 max-w-6xl w-full">
                <TypingAnimation>&gt; npm install @cypher-ray/security-sdk</TypingAnimation>
                <AnimatedSpan className="text-green-500">
                  ✔ Preflight checks.
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ Verifying framework compatibility.
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ Validating security configurations.
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ Validating API credentials.
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ Writing cypher-ray.config.js.
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ Checking registry.
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ Updating security.config.ts
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ Updating app/security.css
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ Installing dependencies.
                </AnimatedSpan>
                <AnimatedSpan className="text-blue-500">
                  <span>ℹ Updated 3 files:</span>
                  <span className="pl-2">- lib/security.ts</span>
                </AnimatedSpan>
                <TypingAnimation className="text-neutral-400">
                  Success! Cypher-Ray SDK initialization completed.
                </TypingAnimation>
                <TypingAnimation className="text-neutral-400">
                  You may now start scanning firmware.
                </TypingAnimation>
              </Terminal>
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ background: '#060010', color: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Shield className="w-6 h-6 text-primary-400" />
              <span className="text-xl font-display font-bold">{APP_NAME}</span>
            </div>
            <div className="text-neutral-400 text-sm">
              © 2025 {APP_NAME}. A Government of India Initiative.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
