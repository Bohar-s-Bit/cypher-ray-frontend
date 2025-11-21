import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import {
  Book,
  BookOpen,
  Code,
  Terminal,
  Package,
  Zap,
  Shield,
  GitBranch,
  Download,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Copy,
  Check,
  Menu,
  X,
  Key,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Lock,
  FileText,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import CopyButton from "../components/ui/CopyButton";
import Spinner from "../components/ui/Spinner";
import { APP_NAME, QUERY_KEYS, API_BASE_URL } from "../config/constants";
import { cn } from "../lib/utils";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { analysisService } from "../services/analysisService";
import { DockNavigation } from "../components/layout/DockNavigation";

const SdkDocsPage = () => {
  const [activeSection, setActiveSection] = useState("api-keys");
  const [copiedCode, setCopiedCode] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyExpiry, setNewKeyExpiry] = useState(365);
  const [createdKey, setCreatedKey] = useState(null);
  const [showFullKey, setShowFullKey] = useState(false);
  const queryClient = useQueryClient();

  // Fetch API keys
  const { data: apiKeysData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USER_API_KEYS],
    queryFn: analysisService.getUserApiKeys,
  });

  // Create API key mutation
  const createKeyMutation = useMutation({
    mutationFn: analysisService.createApiKey,
    onSuccess: (data) => {
      setCreatedKey(data.data.apiKey);
      setShowFullKey(true);
      queryClient.invalidateQueries([QUERY_KEYS.USER_API_KEYS]);
      toast.success("API key created successfully!");
      setNewKeyName("");
      setNewKeyExpiry(365);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create API key");
    },
  });

  // Revoke API key mutation
  const revokeKeyMutation = useMutation({
    mutationFn: analysisService.revokeApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.USER_API_KEYS]);
      toast.success("API key revoked successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to revoke API key");
    },
  });

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }
    createKeyMutation.mutate({
      name: newKeyName,
      expiresInDays: newKeyExpiry > 0 ? newKeyExpiry : null,
    });
  };

  const handleRevokeKey = (keyId) => {
    if (
      confirm(
        "Are you sure you want to revoke this API key? This action cannot be undone."
      )
    ) {
      revokeKeyMutation.mutate(keyId);
    }
  };

  const apiKeys = apiKeysData?.data?.apiKeys || [];
  const apiUrl = `${API_BASE_URL}/sdk`;

  // Handle copy to clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    const scrollContainer = document.getElementById('docs-scroll-container');
    
    if (element && scrollContainer) {
      const elementTop = element.offsetTop;
      scrollContainer.scrollTo({
        top: elementTop - 100,
        behavior: "smooth"
      });
    }
    setSidebarOpen(false);
  };

  // Track active section on scroll
  useEffect(() => {
    const scrollContainer = document.getElementById('docs-scroll-container');
    
    const handleScroll = () => {
      const sections = [
        "api-keys",
        "overview",
        "installation",
        "configuration",
        "usage",
        "ci-cd",
        "api-reference",
        "use-cases",
        "performance",
        "examples",
      ];

      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element && scrollContainer) {
          const rect = element.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();
          // Check if section is in the top portion of the visible area
          return rect.top <= containerRect.top + 150 && rect.bottom >= containerRect.top + 150;
        }
        return false;
      });

      if (current && current !== activeSection) {
        setActiveSection(current);
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [activeSection]);

  // Sidebar navigation items
  const navItems = [
    { id: "api-keys", label: "API Keys", icon: Key },
    { id: "overview", label: "Overview", icon: Book },
    { id: "installation", label: "Installation", icon: Download },
    { id: "configuration", label: "Configuration", icon: Code },
    { id: "usage", label: "Basic Usage", icon: Terminal },
    { id: "ci-cd", label: "CI/CD Integration", icon: GitBranch },
    { id: "api-reference", label: "API Reference", icon: Package },
    { id: "use-cases", label: "Use Cases", icon: Zap },
    { id: "performance", label: "Performance", icon: Shield },
    { id: "examples", label: "Complete Examples", icon: CheckCircle },
  ];

  return (
    <>
      <Helmet>
        <title>SDK Documentation - {APP_NAME}</title>
      </Helmet>

      {/* Container with viewport height and minimal margins */}
      <div className="h-screen overflow-hidden bg-neutral-900">
        <div className="h-full flex overflow-hidden bg-neutral-900 rounded-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 m-2">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: sidebarOpen ? 280 : 80,
          }}
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
          className="hidden md:flex flex-col bg-neutral-800 border-r border-purple-500/20 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ease-in-out text-left group",
                      isActive
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/20 translate-x-1"
                        : "text-white/70 hover:bg-neutral-700 hover:text-white border border-transparent"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 flex-shrink-0 transition-all duration-300",
                      isActive ? "scale-110 text-purple-400" : "scale-100"
                    )} />
                    <motion.span
                      initial={false}
                      animate={{
                        opacity: sidebarOpen ? 1 : 0,
                        display: sidebarOpen ? "block" : "none",
                      }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden fixed inset-0 bg-neutral-900 z-50 flex flex-col rounded-2xl m-4"
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-white hover:text-purple-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                          isActive
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "text-white/70 hover:bg-neutral-800 hover:text-white"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-neutral-900">
          {/* Mobile Menu Button */}
          <div className="md:hidden flex-shrink-0 bg-neutral-900/95 backdrop-blur-sm border-b border-purple-500/20 p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-white hover:text-purple-400 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div id="docs-scroll-container" className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
            <main className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-12 pb-32">
          {/* Header */}
          <div className="mb-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 blur-3xl"></div>
              <div className="relative">
                <h1 className="text-4xl md:text-6xl font-display font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-6">
                  CypherRay SDK Documentation
                </h1>
                <p className="text-lg md:text-xl text-white/70 max-w-4xl leading-relaxed">
                  Powerful firmware binary security analysis for CI/CD pipelines. Automatically detect cryptographic algorithms, identify vulnerabilities, and secure your embedded systems.
                </p>
              </div>
            </div>
          </div>

          {/* API Keys Management Section */}
          <Section id="api-keys" title="API Keys Management" icon={Key}>
            <div className="space-y-6">
              <p className="text-white/80 leading-relaxed">
                Generate and manage API keys to authenticate your SDK requests. Each key can be configured with custom expiration periods and can be revoked at any time.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500/20 rounded-lg">
                      <Key className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Active API Keys</p>
                      <p className="text-2xl font-bold text-white">{apiKeys.filter(k => k.isActive).length}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/20 rounded-lg">
                      <Terminal className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">API Endpoints</p>
                      <p className="text-2xl font-bold text-white">4</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-green-500/20 rounded-lg">
                      <Code className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Languages Supported</p>
                      <p className="text-2xl font-bold text-white">3+</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Keys List */}
              <Card variant="elevated" className="bg-neutral-800/50 border-purple-500/20">
                <CardHeader className="border-b border-purple-500/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-xl">
                          <Key className="w-5 h-5 text-purple-400" />
                        </div>
                        Your API Keys
                      </CardTitle>
                      <CardDescription className="mt-2 text-white/60">
                        Securely manage your API keys for programmatic access
                      </CardDescription>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)} variant="primary" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create New Key
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <Spinner size="md" />
                      <p className="text-white/70 mt-4">Loading API keys...</p>
                    </div>
                  ) : apiKeys.length === 0 ? (
                    <div className="text-center py-12 px-6">
                      <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                        <Key className="w-10 h-10 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">No API Keys Yet</h3>
                      <p className="text-white/70 mb-6 max-w-md mx-auto">
                        Create your first API key to start integrating CypherRay into your applications
                      </p>
                      <Button onClick={() => setShowCreateModal(true)} variant="primary" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create Your First Key
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {apiKeys.map((key) => (
                        <div
                          key={key._id}
                          className="p-6 border border-purple-500/20 bg-gradient-to-br from-neutral-900/70 to-neutral-800/50 rounded-xl hover:border-purple-500/40 transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold text-white text-lg">
                                  {key.name}
                                </h4>
                                <Badge
                                  variant={key.isActive ? "success" : "error"}
                                  size="sm"
                                >
                                  {key.isActive ? "Active" : "Revoked"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3">
                                <code className="text-sm bg-black/40 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-lg font-mono text-purple-300">
                                  {key.keyPreview}
                                </code>
                                <CopyButton text={key.keyPreview} label="Key Preview" />
                              </div>
                              <div className="flex items-center gap-4 text-sm text-white/70">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4" />
                                  Created {format(new Date(key.createdAt), "MMM dd, yyyy")}
                                </span>
                                {key.expiresAt && (
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    Expires {format(new Date(key.expiresAt), "MMM dd, yyyy")}
                                  </span>
                                )}
                              </div>
                            </div>
                            {key.isActive && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRevokeKey(key._id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Revoke
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* Overview Section */}
          <Section id="overview" title="Overview" icon={BookOpen}>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              CypherRay SDK is a powerful tool for firmware binary security analysis that integrates seamlessly into CI/CD pipelines. 
              It automatically detects cryptographic algorithms, identifies vulnerabilities, and provides comprehensive security reports 
              for embedded systems and IoT devices.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard
                icon={Lock}
                title="Crypto Detection"
                description="Detects encryption algorithms (AES, RSA, ECC) and identifies weak/deprecated crypto (MD5, DES)"
              />
              <FeatureCard
                icon={Shield}
                title="Vulnerability Assessment"
                description="Finds security vulnerabilities with severity ratings (Critical, High, Medium, Low) and remediation recommendations"
              />
              <FeatureCard
                icon={Zap}
                title="Hash Deduplication"
                description="Instant cached results for unchanged files—zero credits charged"
              />
              <FeatureCard
                icon={GitBranch}
                title="CI/CD Integration"
                description="GitHub Actions, GitLab CI, Jenkins support with automatic pipeline failure on critical issues"
              />
              <FeatureCard
                icon={Package}
                title="Batch Processing"
                description="Analyze multiple binaries concurrently (5-10 files simultaneously)"
              />
              <FeatureCard
                icon={FileText}
                title="Multiple Formats"
                description="Console, JSON, Markdown, and HTML report outputs"
              />
            </div>
          </Section>

          {/* Installation Section */}
          <Section id="installation" title="Installation" icon={Download}>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">NPM</h3>
                <CodeBlock
                  language="bash"
                  code="npm install @cypherray/sdk --save-dev"
                  onCopy={(code) => copyToClipboard(code, "install-npm")}
                  copied={copiedCode === "install-npm"}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Yarn</h3>
                <CodeBlock
                  language="bash"
                  code="yarn add @cypherray/sdk --dev"
                  onCopy={(code) => copyToClipboard(code, "install-yarn")}
                  copied={copiedCode === "install-yarn"}
                />
              </div>
            </div>
          </Section>

          {/* Configuration Section */}
          <Section id="configuration" title="Configuration" icon={Code}>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Configuration File</h3>
                <p className="text-white/70 mb-4">
                  Create <code className="px-2 py-1 bg-neutral-800 rounded text-purple-400">cypherray.config.json</code> in your project root:
                </p>
                <CodeBlock
                  language="json"
                  code={`{
  "apiUrl": "https://cypher-ray-backend.onrender.com/api/sdk",
  "scanPatterns": [
    "build/**/*.bin",      // Your compiled firmware
    "dist/**/*.elf",       // ELF executables
    "output/**/*.hex"      // Intel HEX files
  ],
  "ignorePatterns": [
    "**/test/**",
    "**/node_modules/**"
  ],
  "failOnCritical": true,  // Stop build if critical issues found
  "failOnHigh": false,     // Allow high severity (can fix later)
  "reportFormat": "json",
  "outputFile": "security-report.json"
}`}
                  onCopy={(code) => copyToClipboard(code, "config")}
                  copied={copiedCode === "config"}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Environment Variables</h3>
                <p className="text-white/70 mb-4">
                  Create <code className="px-2 py-1 bg-neutral-800 rounded text-purple-400">.env</code> file:
                </p>
                <CodeBlock
                  language="bash"
                  code={`CYPHERRAY_API_KEY=your_api_key_here
CYPHERRAY_API_URL=https://cypher-ray-backend.onrender.com/api/sdk`}
                  onCopy={(code) => copyToClipboard(code, "env")}
                  copied={copiedCode === "env"}
                />
              </div>

              <ConfigTable />
            </div>
          </Section>

          {/* Basic Usage Section */}
          <Section id="usage" title="Basic Usage" icon={Terminal}>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">CLI Scan</h3>
                <CodeBlock
                  language="bash"
                  code="npx cypherray scan --directory ./build"
                  onCopy={(code) => copyToClipboard(code, "cli-basic")}
                  copied={copiedCode === "cli-basic"}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Add to package.json Scripts</h3>
                <CodeBlock
                  language="json"
                  code={`{
  "scripts": {
    "build": "make clean && make all",
    "scan": "cypherray scan --directory ./build --format json",
    "scan:verbose": "cypherray scan -d ./build -v --format console",
    "build:secure": "npm run build && npm run scan"
  }
}`}
                  onCopy={(code) => copyToClipboard(code, "npm-scripts")}
                  copied={copiedCode === "npm-scripts"}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Programmatic Usage</h3>
                <CodeBlock
                  language="javascript"
                  code={`import { Scanner, Analyzer, Reporter } from '@cypherray/sdk';

async function analyzeFirmware() {
  // 1. Scan for binaries
  const scanner = new Scanner();
  const files = await scanner.scan('./build');
  
  // 2. Analyze files
  const analyzer = new Analyzer({
    apiKey: process.env.CYPHERRAY_API_KEY
  });
  const results = await analyzer.analyzeBatch(files);
  
  // 3. Generate report
  const reporter = new Reporter({ format: 'console' });
  await reporter.generateReport(results);
  
  return results;
}

analyzeFirmware();`}
                  onCopy={(code) => copyToClipboard(code, "programmatic")}
                  copied={copiedCode === "programmatic"}
                />
              </div>
            </div>
          </Section>

          {/* CI/CD Integration Section */}
          <Section id="ci-cd" title="CI/CD Integration" icon={GitBranch}>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">GitHub Actions</h3>
                <p className="text-white/70 mb-4">
                  Add to <code className="px-2 py-1 bg-neutral-800 rounded text-purple-400">.github/workflows/firmware-security.yml</code>:
                </p>
                <CodeBlock
                  language="yaml"
                  code={`name: Build & Security Scan

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Firmware
        run: make all
      
      - name: CypherRay Security Scan
        env:
          CYPHERRAY_API_KEY: \${{ secrets.CYPHERRAY_API_KEY }}
        run: |
          npm install @cypherray/sdk
          npx cypherray scan --directory ./build --stop-on-critical
      
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: cypherray-report.json`}
                  onCopy={(code) => copyToClipboard(code, "github-actions")}
                  copied={copiedCode === "github-actions"}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">GitLab CI</h3>
                <p className="text-white/70 mb-4">
                  Add to <code className="px-2 py-1 bg-neutral-800 rounded text-purple-400">.gitlab-ci.yml</code>:
                </p>
                <CodeBlock
                  language="yaml"
                  code={`security-scan:
  stage: test
  script:
    - npm install @cypherray/sdk
    - npx cypherray scan --directory ./build --format json
  artifacts:
    reports:
      security: cypherray-report.json`}
                  onCopy={(code) => copyToClipboard(code, "gitlab-ci")}
                  copied={copiedCode === "gitlab-ci"}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Jenkins</h3>
                <p className="text-white/70 mb-4">
                  Add to your Jenkinsfile:
                </p>
                <CodeBlock
                  language="groovy"
                  code={`stage('Security Scan') {
  steps {
    sh 'npm install @cypherray/sdk'
    sh 'npx cypherray scan --directory ./build --format json'
  }
}`}
                  onCopy={(code) => copyToClipboard(code, "jenkins")}
                  copied={copiedCode === "jenkins"}
                />
              </div>
            </div>
          </Section>

          {/* API Reference Section */}
          <Section id="api-reference" title="API Reference" icon={Package}>
            <div className="space-y-8">
              <ApiReferenceCard
                className="Scanner"
                description="Scans directories for firmware binary files"
                methods={[
                  {
                    name: "scan(directory)",
                    description: "Scans directory for binary files matching configured patterns",
                    params: "directory: string",
                    returns: "Promise<FileInfo[]>",
                  },
                  {
                    name: "scanFile(filePath)",
                    description: "Scans a single file and returns file information",
                    params: "filePath: string",
                    returns: "Promise<FileInfo>",
                  },
                  {
                    name: "getStats(files)",
                    description: "Returns statistics about scanned files",
                    params: "files: FileInfo[]",
                    returns: "{ totalSizeMB, extensionCounts, fileCount }",
                  },
                ]}
                example={`const scanner = new Scanner({
  patterns: ['build/**/*.bin'],
  ignorePatterns: ['**/test/**']
});

const files = await scanner.scan('./build');
console.log(\`Found \${files.length} binaries\`);`}
                onCopy={(code) => copyToClipboard(code, "scanner-example")}
                copied={copiedCode === "scanner-example"}
              />

              <ApiReferenceCard
                className="Analyzer"
                description="Analyzes firmware binaries for security vulnerabilities"
                methods={[
                  {
                    name: "analyzeSingle(fileInfo)",
                    description: "Analyzes a single binary file",
                    params: "fileInfo: FileInfo",
                    returns: "Promise<AnalysisResult>",
                  },
                  {
                    name: "analyzeBatch(files)",
                    description: "Analyzes multiple files concurrently",
                    params: "files: FileInfo[]",
                    returns: "Promise<AnalysisResult[]>",
                  },
                  {
                    name: "checkHash(hash)",
                    description: "Checks if analysis results exist in cache",
                    params: "hash: string",
                    returns: "Promise<CachedResult | null>",
                  },
                ]}
                example={`const analyzer = new Analyzer({
  apiKey: process.env.CYPHERRAY_API_KEY,
  maxConcurrent: 5
});

const results = await analyzer.analyzeBatch(files);
console.log(\`Analyzed \${results.length} files\`);`}
                onCopy={(code) => copyToClipboard(code, "analyzer-example")}
                copied={copiedCode === "analyzer-example"}
              />

              <ApiReferenceCard
                className="Reporter"
                description="Generates security reports in various formats"
                methods={[
                  {
                    name: "generateReport(results, stats)",
                    description: "Generates report from analysis results",
                    params: "results: AnalysisResult[], stats: Stats",
                    returns: "Promise<ReportSummary>",
                  },
                  {
                    name: "shouldStopBuild(results, stopOnCritical)",
                    description: "Determines if build should fail based on severity",
                    params: "results: AnalysisResult[], stopOnCritical: boolean",
                    returns: "{ shouldStop: boolean, exitCode: number }",
                  },
                ]}
                example={`const reporter = new Reporter({
  format: 'json',
  outputPath: './security-report.json'
});

const summary = await reporter.generateReport(results);
console.log(\`Found \${summary.criticalIssues} critical issues\`);`}
                onCopy={(code) => copyToClipboard(code, "reporter-example")}
                copied={copiedCode === "reporter-example"}
              />
            </div>
          </Section>

          {/* Use Cases Section */}
          <Section id="use-cases" title="Use Cases" icon={Zap}>
            <div className="grid md:grid-cols-2 gap-4">
              <UseCaseCard
                title="IoT & Smart Devices"
                description="Scan router and smart home firmware before shipping"
                code={`scanPatterns: ["firmware/v*.bin"]`}
                tags={["IoT", "Routers", "Smart Home"]}
              />

              <UseCaseCard
                title="Automotive ECU"
                description="Analyze vehicle control unit binaries"
                code={`scanPatterns: ["ecu/**/*.hex"]`}
                tags={["Automotive", "ADAS"]}
              />

              <UseCaseCard
                title="Medical Devices"
                description="FDA compliance scanning"
                code={`failOnCritical: true,
failOnHigh: true`}
                tags={["FDA", "Medical"]}
              />

              <UseCaseCard
                title="Industrial Control"
                description="SCADA and PLC security analysis"
                code={`scanPatterns: ["plc/*.elf"]`}
                tags={["SCADA", "Industrial"]}
              />
            </div>
          </Section>

          {/* Performance Section */}
          <Section id="performance" title="Performance" icon={Shield}>
            <div className="space-y-6">
              <Card variant="bordered" className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/30">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Smart Caching & Deduplication</h3>
                  <p className="text-white/80 mb-4">
                    SHA-256 hash-based deduplication means if you've scanned the same binary before, results are instant—<strong>0.3s</strong> with <strong>zero credits</strong> charged.
                    Only NEW or CHANGED binaries consume credits.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-neutral-900/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">0.3s</div>
                      <div className="text-sm text-white/70">Cached Results</div>
                    </div>
                    <div className="bg-neutral-900/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-teal-400 mb-1">4-32s</div>
                      <div className="text-sm text-white/70">New Analysis</div>
                    </div>
                    <div className="bg-neutral-900/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-1">0 Credits</div>
                      <div className="text-sm text-white/70">For Cached</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="bordered" className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Optimized Backend Processing</h3>
                  <p className="text-white/80 mb-4">
                    Our buffer-mode backend eliminates the Cloudinary download bottleneck for faster analysis:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Before (Cloudinary Mode)</h4>
                      <ul className="text-sm text-white/70 space-y-1">
                        <li>• Upload to Cloudinary: 2-3s</li>
                        <li>• Download from Cloudinary: 2-5s ⏰</li>
                        <li>• ML Analysis: 3-30s</li>
                        <li className="font-semibold text-white/90">Total: 8-39 seconds</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">After (Buffer Mode)</h4>
                      <ul className="text-sm text-white/70 space-y-1">
                        <li>• Store in buffer: 0.1s</li>
                        <li>• Write to temp: 0.1-0.3s</li>
                        <li>• ML Analysis: 3-30s</li>
                        <li className="font-semibold text-green-400">Total: 4-32 seconds</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 grid md:grid-cols-3 gap-4">
                    <div className="bg-neutral-900/50 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-green-400 mb-1">50% faster</div>
                      <div className="text-xs text-white/70">Small files (5MB)</div>
                    </div>
                    <div className="bg-neutral-900/50 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-green-400 mb-1">33% faster</div>
                      <div className="text-xs text-white/70">Medium files (20MB)</div>
                    </div>
                    <div className="bg-neutral-900/50 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-green-400 mb-1">18% faster</div>
                      <div className="text-xs text-white/70">Large files (80MB)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* Complete Examples Section */}
          <Section id="examples" title="Complete Examples" icon={CheckCircle}>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Custom Build Script</h3>
                <CodeBlock
                  language="javascript"
                  code={`import { Scanner, Analyzer, Reporter } from '@cypherray/sdk';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function secureBuild() {
  // 1. Build firmware
  console.log('Building firmware...');
  await execAsync('make clean && make all');
  
  // 2. Scan for binaries
  console.log('Scanning for binaries...');
  const scanner = new Scanner();
  const files = await scanner.scan('./build');
  console.log(\`Found \${files.length} binaries\`);
  
  // 3. Analyze with progress tracking
  const analyzer = new Analyzer();
  const results = await analyzer.analyzeBatch(files);
  
  // 4. Check for critical issues
  const hasCritical = results.some(r => 
    r.results?.vulnerability_assessment?.severity === 'CRITICAL'
  );
  
  if (hasCritical) {
    console.error('CRITICAL vulnerabilities found!');
    process.exit(1);
  }
  
  // 5. Generate report
  const reporter = new Reporter({ format: 'markdown' });
  await reporter.generateReport(results);
  
  console.log('Security scan passed!');
}

secureBuild().catch(console.error);`}
                  onCopy={(code) => copyToClipboard(code, "build-script")}
                  copied={copiedCode === "build-script"}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Pre-Commit Hook</h3>
                <p className="text-white/70 mb-4">
                  Add to <code className="px-2 py-1 bg-neutral-800 rounded text-purple-400">.git/hooks/pre-commit</code>:
                </p>
                <CodeBlock
                  language="bash"
                  code={`#!/bin/bash

# Build firmware
echo "Building firmware..."
make all

# Scan binaries
echo "Running security scan..."
npx cypherray scan --directory ./build --format console

# Exit code determines if commit proceeds
exit $?`}
                  onCopy={(code) => copyToClipboard(code, "pre-commit")}
                  copied={copiedCode === "pre-commit"}
                />
              </div>
            </div>
          </Section>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-white/60 text-sm">
                Last updated: November 2025
              </div>
              <div className="flex gap-4">
                <a
                  href="https://github.com/Bohar-s-Bit/cypherray-sdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-sm hover:underline"
                >
                  GitHub Repository
                </a>
                <a
                  href="https://github.com/Bohar-s-Bit/cypherray-sdk/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-sm hover:underline"
                >
                  Report Issues
                </a>
              </div>
            </div>
          </div>
          </main>
          </div>
        </div>

        {/* Create API Key Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setNewKeyName("");
            setNewKeyExpiry(365);
          }}
          title="Create New API Key"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Key Name
              </label>
              <Input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production, Development, CI/CD"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Expires In (days)
              </label>
              <Input
                type="number"
                value={newKeyExpiry}
                onChange={(e) => setNewKeyExpiry(parseInt(e.target.value))}
                min="0"
                placeholder="365 (0 for no expiration)"
                className="w-full"
              />
              <p className="text-xs text-white/60 mt-1">
                Set to 0 for keys that never expire
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                onClick={handleCreateKey}
                disabled={createKeyMutation.isPending}
                className="flex-1"
              >
                {createKeyMutation.isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Key
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowCreateModal(false);
                  setNewKeyName("");
                  setNewKeyExpiry(365);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Display Created API Key Modal */}
        <Modal
          isOpen={showFullKey}
          onClose={() => {
            setShowFullKey(false);
            setCreatedKey(null);
            setShowCreateModal(false);
          }}
          title="API Key Created Successfully"
        >
          <div className="space-y-4">
            <Card variant="bordered" className="bg-yellow-500/10 border-yellow-500/30">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-200">
                    <p className="font-semibold mb-1">Important!</p>
                    <p>
                      Make sure to copy your API key now. You won't be able to see it
                      again!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {createdKey && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Your API Key
                </label>
                <div className="flex gap-2">
                  <code className="flex-1 text-sm bg-black/40 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-lg font-mono text-purple-300 break-all">
                    {createdKey.key}
                  </code>
                  <CopyButton text={createdKey.key} label="API Key" />
                </div>
              </div>
            )}

            <Button
              variant="primary"
              onClick={() => {
                setShowFullKey(false);
                setCreatedKey(null);
                setShowCreateModal(false);
              }}
              className="w-full"
            >
              Done
            </Button>
          </div>
        </Modal>
        </div>
        
        {/* Dock Navigation for page navigation */}
        <DockNavigation />
      </div>
    </>
  );
};

// Section Component with better visual separation
const Section = ({ id, title, icon: Icon, children }) => (
  <section id={id} className="mb-16 scroll-mt-20">
    <div className="relative mb-6">
      {/* Decorative line */}
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-500/50 via-purple-500 to-transparent rounded-full"></div>
      
      <div className="flex items-center gap-4 pl-6">
        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30 backdrop-blur-sm">
          <Icon className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
      </div>
    </div>
    
    <div className="bg-neutral-800/30 backdrop-blur-sm rounded-xl border border-purple-500/10 p-6 md:p-8 hover:border-purple-500/20 transition-colors">
      {children}
    </div>
  </section>
);

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }) => (
  <Card variant="bordered" className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
    <CardContent className="p-5">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex-shrink-0 border border-purple-500/20">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">{title}</h4>
          <p className="text-sm text-white/70 leading-relaxed">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Code Block Component with Syntax Highlighting
const CodeBlock = ({ language, code, onCopy, copied }) => {
  const customStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: '#1a1a1a',
      margin: 0,
      padding: '1rem',
    },
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      background: 'transparent',
    },
  };

  return (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => onCopy(code)}
          className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-purple-500/30 rounded-lg text-xs text-white transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="bg-neutral-900 border border-purple-500/20 rounded-lg overflow-hidden">
        <div className="px-4 py-2 bg-neutral-800/50 border-b border-purple-500/20 flex items-center justify-between">
          <span className="text-xs text-purple-400 font-mono uppercase">{language}</span>
        </div>
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={language}
            style={customStyle}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              background: '#1a1a1a',
            }}
            codeTagProps={{
              style: {
                fontSize: '0.875rem',
                lineHeight: '1.7',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              },
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

// Configuration Table Component
const ConfigTable = () => (
  <Card variant="bordered" className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-purple-500/20">
    <CardHeader className="border-b border-purple-500/20">
      <CardTitle className="text-xl">Configuration Options</CardTitle>
      <CardDescription>Complete reference for cypherray.config.json</CardDescription>
    </CardHeader>
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-500/20 bg-neutral-800/30">
              <th className="text-left py-4 px-6 text-sm font-semibold text-purple-300">Option</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-purple-300">Type</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-purple-300">Description</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-white/5 hover:bg-neutral-800/30 transition-colors">
              <td className="py-4 px-6 font-mono text-purple-400">apiUrl</td>
              <td className="py-4 px-6 text-blue-400">string</td>
              <td className="py-4 px-6 text-white/80">SDK API endpoint URL</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-neutral-800/30 transition-colors">
              <td className="py-4 px-6 font-mono text-purple-400">scanPatterns</td>
              <td className="py-4 px-6 text-blue-400">string[]</td>
              <td className="py-4 px-6 text-white/80">Glob patterns for files to scan</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-neutral-800/30 transition-colors">
              <td className="py-4 px-6 font-mono text-purple-400">ignorePatterns</td>
              <td className="py-4 px-6 text-blue-400">string[]</td>
              <td className="py-4 px-6 text-white/80">Glob patterns for files to ignore</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-neutral-800/30 transition-colors">
              <td className="py-4 px-6 font-mono text-purple-400">failOnCritical</td>
              <td className="py-4 px-6 text-blue-400">boolean</td>
              <td className="py-4 px-6 text-white/80">Stop build on critical severity issues</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-neutral-800/30 transition-colors">
              <td className="py-4 px-6 font-mono text-purple-400">failOnHigh</td>
              <td className="py-4 px-6 text-blue-400">boolean</td>
              <td className="py-4 px-6 text-white/80">Stop build on high severity issues</td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-neutral-800/30 transition-colors">
              <td className="py-4 px-6 font-mono text-purple-400">reportFormat</td>
              <td className="py-4 px-6 text-blue-400">string</td>
              <td className="py-4 px-6 text-white/80">Output format: json, console, markdown, html</td>
            </tr>
            <tr className="hover:bg-neutral-800/30 transition-colors">
              <td className="py-4 px-6 font-mono text-purple-400">outputFile</td>
              <td className="py-4 px-6 text-blue-400">string</td>
              <td className="py-4 px-6 text-white/80">Path to save report file</td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

// API Reference Card Component
const ApiReferenceCard = ({ className, description, methods, example, onCopy, copied }) => (
  <Card variant="bordered" className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-purple-500/20">
    <CardHeader className="border-b border-purple-500/10">
      <div className="flex items-center gap-3">
        <Code className="w-5 h-5 text-purple-400" />
        <CardTitle className="font-mono">{className}</CardTitle>
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
          <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
          Methods
        </h4>
        <div className="space-y-3">
          {methods.map((method, index) => (
            <div key={index} className="bg-neutral-800/50 border border-purple-500/10 p-4 rounded-lg hover:border-purple-500/30 transition-colors">
              <div className="font-mono text-sm text-purple-400 mb-2">
                {method.name}
              </div>
              <div className="text-xs text-white/70 mb-3 leading-relaxed">{method.description}</div>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-white/50">Params:</span>
                  <span className="text-blue-400 font-mono">{method.params}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/50">Returns:</span>
                  <span className="text-green-400 font-mono">{method.returns}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {example && (
        <div>
          <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
            <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
            Example
          </h4>
          <CodeBlock
            language="javascript"
            code={example}
            onCopy={onCopy}
            copied={copied}
          />
        </div>
      )}
    </CardContent>
  </Card>
);

// Use Case Card Component
const UseCaseCard = ({ title, description, code, tags }) => {
  const customStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: '#262626',
      margin: 0,
      padding: '0.75rem',
    },
  };

  return (
    <Card variant="bordered" className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
          <div className="flex-1">
            <h4 className="text-xl font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">{title}</h4>
            <p className="text-sm text-white/70 leading-relaxed">{description}</p>
          </div>
        </div>
        
        <div className="bg-neutral-950/80 border border-purple-500/20 rounded-lg overflow-hidden mb-4">
          <SyntaxHighlighter
            language="json"
            style={customStyle}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              background: '#0a0a0a',
            }}
            codeTagProps={{
              style: {
                fontSize: '0.8rem',
                lineHeight: '1.6',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              },
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SdkDocsPage;
