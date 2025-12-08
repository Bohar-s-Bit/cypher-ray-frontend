import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { 
  Terminal, 
  Code, 
  PackageCheck, 
  Rocket,
  CheckCircle,
  GitBranch,
  Cpu,
  Shield
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import SDKTerminal from "../components/ui/SDKTerminal";

const SDKWorkflowPage = () => {
  const workflowSteps = [
    {
      icon: PackageCheck,
      title: "Install SDK",
      description: "Add CypherRay SDK to your project dependencies",
      command: "npm install @cypherray/sdk",
      color: "text-purple-400"
    },
    {
      icon: Code,
      title: "Configure",
      description: "Initialize SDK with your API key from dashboard",
      command: "cypherray init",
      color: "text-pink-400"
    },
    {
      icon: Terminal,
      title: "Scan Binaries",
      description: "Run security analysis on your firmware files",
      command: "npm run scan",
      color: "text-purple-300"
    },
    {
      icon: Rocket,
      title: "CI/CD Integration",
      description: "Automate security checks in your pipeline",
      command: "GitHub Actions / GitLab CI",
      color: "text-fuchsia-400"
    }
  ];



  return (
    <div className="min-h-screen">
      <Helmet>
        <title>SDK Workflow | CypherRay</title>
        <meta 
          name="description" 
          content="Integrate CypherRay's powerful binary analysis directly into your development workflow and CI/CD pipelines." 
        />
      </Helmet>
      <Navbar />
      
      <div className="w-full min-h-screen bg-[#0a0015] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0a0015] to-[#0a0015] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
        
        {/* Header */}
        <div className="max-w-6xl mx-auto text-center mb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-purple-500/10 text-purple-300 border-purple-500/20 px-4 py-1.5">
              Developer Workflow
            </Badge>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-6"
            >
              SDK Integration Workflow
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              Integrate CypherRay's powerful binary analysis directly into your development workflow and CI/CD pipelines.
            </motion.p>
          </motion.div>
        </div>

        {/* Quick Start Steps */}
        <div className="max-w-6xl mx-auto mb-16 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-neutral-900/50 border-purple-800/30 hover:border-purple-500/50 transition-all h-full backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-3 bg-purple-900/30 rounded-xl mb-4 ${step.color}`}>
                        <step.icon size={32} />
                      </div>
                      <div className="mb-2 text-sm font-mono text-purple-400">
                        Step {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        {step.description}
                      </p>
                      <code className="text-xs bg-neutral-950/80 px-3 py-2 rounded border border-purple-800/30 text-purple-300 font-mono break-all">
                        {step.command}
                      </code>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

        {/* Interactive Terminal Demo */}
        <div className="max-w-6xl mx-auto mb-16 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Try It Yourself</h2>
            <p className="text-gray-400">
              Interactive terminal demo. Try running <code className="text-purple-400 font-mono px-2 py-1 bg-neutral-900/50 rounded border border-purple-800/30">npm install @cypherray/sdk</code> and <code className="text-purple-400 font-mono px-2 py-1 bg-neutral-900/50 rounded border border-purple-800/30">npm run scan</code>
            </p>
          </div>
          <SDKTerminal />
        </div>

        {/* CI/CD Integration Examples */}
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">CI/CD Integration</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GitHub Actions */}
            <Card className="bg-neutral-900/50 border-purple-800/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch size={20} className="text-purple-400" />
                  <span>GitHub Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-neutral-950/80 p-4 rounded-lg border border-purple-800/30 overflow-x-auto">
                  <code className="text-sm text-neutral-300 font-mono">
{`name: Security Scan

on: [push, pull_request]

jobs:
  cypherray-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install SDK
        run: npm install @cypherray/sdk
        
      - name: Run Security Scan
        env:
          CYPHERRAY_API_KEY: \${{ secrets.CYPHERRAY_KEY }}
        run: npx cypherray scan --fail-on-critical`}
                  </code>
                </pre>
              </CardContent>
            </Card>

            {/* GitLab CI */}
            <Card className="bg-neutral-900/50 border-purple-800/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch size={20} className="text-pink-400" />
                  <span>GitLab CI</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-neutral-950/80 p-4 rounded-lg border border-purple-800/30 overflow-x-auto">
                  <code className="text-sm text-neutral-300 font-mono">
{`security_scan:
  stage: test
  image: node:18
  script:
    - npm install @cypherray/sdk
    - npx cypherray scan -d ./build
  artifacts:
    reports:
      cypherray: cypherray-report.json
  only:
    - merge_requests
    - main`}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDKWorkflowPage;
