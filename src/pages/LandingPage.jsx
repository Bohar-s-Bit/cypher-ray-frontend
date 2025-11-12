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
import { ROUTES, APP_NAME } from "../config/constants";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Advanced Security Analysis",
      description:
        "Comprehensive firmware security scanning with cutting-edge threat detection",
      color: "text-primary-500",
      bgColor: "bg-primary-50",
    },
    {
      icon: Lock,
      title: "Vulnerability Detection",
      description:
        "Identify security vulnerabilities before they become threats",
      color: "text-secondary-500",
      bgColor: "bg-secondary-50",
    },
    {
      icon: CheckCircle,
      title: "Compliance Ready",
      description: "Meet government and industry security compliance standards",
      color: "text-success-500",
      bgColor: "bg-success-50",
    },
    {
      icon: TrendingUp,
      title: "Real-time Monitoring",
      description: "Continuous monitoring and instant threat notifications",
      color: "text-warning-500",
      bgColor: "bg-warning-50",
    },
    {
      icon: Users,
      title: "Multi-tenant Platform",
      description: "Secure, isolated environments for multiple organizations",
      color: "text-primary-600",
      bgColor: "bg-primary-100",
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Lightning-fast analysis powered by advanced algorithms",
      color: "text-secondary-600",
      bgColor: "bg-secondary-100",
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6 font-medium">
              <Shield className="w-4 h-4" />
              <span>Trusted by Government & Enterprise</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-neutral-900 mb-6 leading-tight">
              Secure Your Firmware
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Protect Your Future
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-neutral-600 mb-10 max-w-3xl mx-auto">
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

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center" padding="lg">
                  <Icon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-neutral-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600">{stat.label}</div>
                </Card>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Everything you need to ensure firmware security and compliance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hoverable padding="lg" className="h-full">
                    <div
                      className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}
                    >
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
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
      <footer className="bg-neutral-900 text-white py-12">
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
