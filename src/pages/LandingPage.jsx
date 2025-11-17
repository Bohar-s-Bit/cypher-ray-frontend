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
import { LayoutTextFlip } from "../components/ui/LayoutTextFlip";
import PricingCards from "../components/ui/PricingCards";
import { ROUTES, APP_NAME } from "../config/constants";

// Lazy load heavy components
const FloatingLines = lazy(() => import("../components/ui/FloatingLines"));
const MagicBento = lazy(() => import("../components/ui/MagicBento"));
const Terminal = lazy(() => import("../components/ui/Terminal").then(module => ({ default: module.Terminal })));
const TypingAnimation = lazy(() => import("../components/ui/Terminal").then(module => ({ default: module.TypingAnimation })));
const AnimatedSpan = lazy(() => import("../components/ui/Terminal").then(module => ({ default: module.AnimatedSpan })));

const LandingPage = () => {
  const navigate = useNavigate();

  // Pricing plans based on admin dashboard tiers
  const pricingPlans = [
    {
      name: "Tier 1",
      monthlyPrice: "₹999",
      yearlyPrice: "₹9990",
      popular: false,
      credits: "Basic security scanning",
      features: [
        "Basic firmware analysis",
        "Standard vulnerability detection",
        "Email support",
        "Monthly reports",
        "Up to 10 scans/month"
      ]
    },
    {
      name: "Tier 2",
      monthlyPrice: "₹2999",
      yearlyPrice: "₹29990",
      popular: true,
      credits: "Advanced security suite",
      features: [
        "Advanced firmware analysis",
        "Real-time vulnerability detection",
        "Priority support",
        "Weekly reports",
        "Unlimited scans",
        "API access",
        "Custom integrations"
      ]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Advanced Security Analysis",
      description:
        "Comprehensive firmware security scanning with cutting-edge threat detection",
      color: "text-purple-400",
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
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
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

            <div className="flex flex-col items-center gap-4 mb-6">
              <h1 className="text-5xl md:text-7xl font-display font-bold bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent leading-tight">
                Analyze the binaries
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <LayoutTextFlip
                  text="Secure your"
                  words={["firmware", "codebase", "software", "hardware"]}
                  duration={3000}
                />
              </div>
            </div>

            <p className="text-xl md:text-2xl text-purple-200/70 mb-10 max-w-3xl mx-auto">
              {APP_NAME} provides enterprise-grade firmware security analysis for government organizations and businesses across India.
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
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Advanced Security Features
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
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
              <Terminal className="bg-neutral-900 border-neutral-700 max-w-5xl w-full h-[500px]">
                <AnimatedSpan delay={0}>
                  <span className="text-green-400">mac@macs-MacBook-Pro cypherray-test %<span className="text-white"> npm run scan</span></span> 
                </AnimatedSpan>
                <TypingAnimation className="text-purple-400 font-bold">🔍 CypherRay SDK - Firmware Security Scanner</TypingAnimation>
                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>
                <AnimatedSpan className="text-neutral-500">
                  Using actual @cypherray/sdk package
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>
                <AnimatedSpan className="text-cyan-400">
                  Phase 1: Scanning for binary files...
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ Found 2 binary file(s)
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400 pl-4">
                  • firmware.bin (33.36 KB)
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400 pl-4">
                  • bootloader.bin (32.89 KB)
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>
                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>
                <AnimatedSpan className="text-cyan-400">
                  Phase 2: Analyzing with CypherRay backend...
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>
                <AnimatedSpan className="text-neutral-500 text-sm">
                  [SDK Debug] API URL: https://cypher-ray-backend.onrender.com/api/sdk
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-500 text-sm">
                  [SDK Debug] API Key: SET
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ firmware.bin - Cached (0 credits)
                </AnimatedSpan>
                <AnimatedSpan className="text-green-400 pl-6">
                  ✓ No vulnerabilities found (Risk: 0.0%)
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ bootloader.bin - Cached (0 credits)
                </AnimatedSpan>
                <AnimatedSpan className="text-green-400 pl-6">
                  ✓ No vulnerabilities found (Risk: 0.0%)
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>
                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>
                <AnimatedSpan className="text-cyan-400">
                  Phase 3: Generating report...
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>
                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>
                <AnimatedSpan className="text-purple-400 font-bold">
                  🔍 CypherRay Security Analysis Report
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>
                <AnimatedSpan className="text-neutral-300">
                  Summary:
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400 pl-4">
                  Total Files Scanned: 2
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400 pl-4">
                  Total Size: 0.06 MB
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500 pl-4">
                  Critical Issues: 0
                </AnimatedSpan>
                <AnimatedSpan className="text-yellow-500 pl-4">
                  High Issues: 1
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>
                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>
                <AnimatedSpan className="text-neutral-500">
                  ⠋ Saving JSON report...✓ Report saved to: cypherray-report.json
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ Report saved to cypherray-report.json
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400">
                  ✓ Report saved to: cypherray-report.md
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400 pl-2">
                  Markdown report: cypherray-report.md
                </AnimatedSpan>
                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>

                <TypingAnimation className="text-green-400 font-bold text-center">
                  Scan Complete!
                </TypingAnimation>

                <AnimatedSpan className="text-neutral-400">&nbsp;</AnimatedSpan>
                <TypingAnimation className="text-green-500">
                  ✓ Security scan passed!
                </TypingAnimation>
              </Terminal>
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative" style={{ background: 'linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)' }}>
        <PricingCards />
      </section>

      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

      {/* Footer */}
      <footer style={{ background: 'linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)' }}>
        <div className="mx-auto w-full max-w-screen-xl p-4 py-4 lg:py-6">
          <div className="md:flex md:justify-between">
            <div className="mb-4 md:mb-0 flex flex-col items-start">
              <a href="/" className="flex items-center mb-4">
                <img 
                  src="/images/Cypher-ray_horizontal.png" 
                  className="h-20 md:h-24 lg:h-28 xl:h-32 hover:scale-105 transition-transform duration-300" 
                  alt="Cypher Ray Logo" 
                />
              </a>
              <p className="text-neutral-400 text-sm max-w-md">
                Advanced firmware security analysis for modern organizations. 
                Protecting your digital infrastructure with cutting-edge technology.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-white uppercase">Resources</h2>
                <ul className="text-neutral-300 font-medium">
                  <li className="mb-4">
                    <a href="/docs" className="hover:underline hover:text-purple-400">Documentation</a>
                  </li>
                  <li>
                    <a href="/api" className="hover:underline hover:text-purple-400">API Reference</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-white uppercase">Follow us</h2>
                <ul className="text-neutral-300 font-medium">
                  <li className="mb-4">
                    <a href="https://github.com/cypher-ray" className="hover:underline hover:text-purple-400">Github</a>
                  </li>
                  <li>
                    <a href="/community" className="hover:underline hover:text-purple-400">Community</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-white uppercase">Legal</h2>
                <ul className="text-neutral-300 font-medium">
                  <li className="mb-4">
                    <a href="/privacy" className="hover:underline hover:text-purple-400">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="/terms" className="hover:underline hover:text-purple-400">Terms &amp; Conditions</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-purple-800/30 sm:mx-auto lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-neutral-300 sm:text-center">
              © 2025 <a href="/" className="hover:underline hover:text-purple-400">{APP_NAME}™</a>. A Government of India Initiative.
            </span>
            <div className="flex mt-4 sm:justify-center sm:mt-0">
              <a href="#" className="text-neutral-300 hover:text-purple-400">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clipRule="evenodd"/>
                </svg>
                <span className="sr-only">Facebook page</span>
              </a>
              <a href="#" className="text-neutral-300 hover:text-purple-400 ms-5">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z"/>
                </svg>
                <span className="sr-only">Twitter page</span>
              </a>
              <a href="#" className="text-neutral-300 hover:text-purple-400 ms-5">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clipRule="evenodd"/>
                </svg>
                <span className="sr-only">GitHub account</span>
              </a>
              <a href="#" className="text-neutral-300 hover:text-purple-400 ms-5">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2a10 10 0 1 0 10 10A10.009 10.009 0 0 0 12 2Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.093 20.093 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM10 3.707a8.82 8.82 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.755 45.755 0 0 0 10 3.707Zm-6.358 6.555a8.57 8.57 0 0 1 4.73-5.981 53.99 53.99 0 0 1 3.168 4.941 32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.641 31.641 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM12 20.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 15.113 13a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z" clipRule="evenodd"/>
                </svg>
                <span className="sr-only">Dribbble account</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


