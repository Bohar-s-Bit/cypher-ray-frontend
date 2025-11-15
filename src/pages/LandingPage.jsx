import React from "react";
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
import MagicBento from "../components/ui/MagicBento";
import FloatingLines from "../components/ui/FloatingLines";
import { ROUTES, APP_NAME } from "../config/constants";

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
          <FloatingLines 
            enabledWaves={['top', 'middle', 'bottom']}
            lineCount={[8, 12, 15]}
            lineDistance={[6, 5, 4]}
            bendRadius={8.0}
            bendStrength={-0.3}
            interactive={true}
            parallax={true}
            parallaxStrength={0.1}
            animationSpeed={0.8}
            mouseDamping={0.08}
            mixBlendMode="overlay"
            linesGradient={['#060010', '#0a0015', '#1a0d2e', '#2d1b47', '#7808d0']}
            topWavePosition={{ x: 8.0, y: 0.3, rotate: -0.2 }}
            middleWavePosition={{ x: 4.0, y: 0.0, rotate: 0.1 }}
            bottomWavePosition={{ x: 2.0, y: -0.5, rotate: 0.3 }}
          />
        </div>

        {/* Gradient Overlay for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent z-5"></div>

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
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Protect Your Future
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto">
              {APP_NAME} provides enterprise-grade firmware security analysis
              for government organizations and businesses across India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(ROUTES.LOGIN)}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/about")}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-transparent" style={{ background: 'linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)' }}>
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
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #7808d0 0%, #5c0699 50%, #4a0582 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Ready to Secure Your Firmware?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Join hundreds of organizations protecting their digital
              infrastructure
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(ROUTES.LOGIN)}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Start Your Journey
            </Button>
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
