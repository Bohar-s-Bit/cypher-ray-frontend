import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  UploadCloud, 
  Database, 
  Layers, 
  Cpu, 
  Download, 
  BrainCircuit, 
  Save, 
  CreditCard, 
  Bell, 
  Trash2 
} from "lucide-react";

const workflowSteps = [
  {
    title: "Secure Upload & Deduplication",
    description: "The journey begins with a secure, encrypted upload of the firmware binary. We utilize enterprise-grade cloud storage with automatic hash-based deduplication to ensure efficiency. Every file is scanned for initial integrity before entering the pipeline.",
    details: ["AES-256 Encryption at Rest", "SHA-256 Hash Deduplication", "80MB+ File Support"],
    icon: UploadCloud,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20"
  },
  {
    title: "Job Initialization",
    description: "A dedicated analysis job is instantiated in our MongoDB cluster. This record acts as the central source of truth, tracking user metadata, file properties, and the real-time state of the analysis lifecycle from start to finish.",
    details: ["Atomic Job Creation", "Metadata Extraction", "State Tracking"],
    icon: Database,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/20"
  },
  {
    title: "Intelligent Queue Routing",
    description: "The job is dispatched to a high-performance Redis-backed Bull queue. Our smart routing algorithm prioritizes tasks based on user tiers (Enterprise, Pro, Free) and current system load to ensure optimal throughput.",
    details: ["Priority-based Scheduling", "Redis Persistence", "Load Balancing"],
    icon: Layers,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/20"
  },
  {
    title: "Worker Orchestration",
    description: "An isolated worker node claims the job from the queue. Our scalable worker pool dynamically adjusts to demand, ensuring that heavy analysis tasks are isolated from the main application thread to maintain responsiveness.",
    details: ["Isolated Processes", "Concurrency Management", "Auto-scaling Workers"],
    icon: Cpu,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/20"
  },
  {
    title: "Secure Retrieval",
    description: "The worker securely retrieves the binary from cloud storage into an ephemeral, sandboxed environment. This ensures that the analysis takes place in a clean state, preventing cross-contamination between different analysis jobs.",
    details: ["Ephemeral Sandboxes", "Secure Stream Download", "Temp File Management"],
    icon: Download,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/20"
  },
  {
    title: "Multi-Model AI Analysis",
    description: "The core of CypherRay. The binary undergoes deep inspection using a hybrid engine combining symbolic execution (Angr) with Large Language Models (OpenAI, Claude) to detect vulnerabilities and cryptographic patterns.",
    details: ["Symbolic Execution (Angr)", "LLM Vulnerability Detection", "Pattern Matching"],
    icon: BrainCircuit,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    borderColor: "border-pink-400/20"
  },
  {
    title: "Result Synthesis & Storage",
    description: "Raw analysis data is synthesized into a structured, human-readable report. Vulnerabilities are categorized by severity, and the final JSON report is securely persisted in the database for instant retrieval.",
    details: ["Structured JSON Reports", "Severity Categorization", "Persistent Storage"],
    icon: Save,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/20"
  },
  {
    title: "Dynamic Credit Billing",
    description: "Our fair billing engine calculates the exact cost of the analysis. Credits are deducted based on a combination of file size and the actual compute time consumed, ensuring users only pay for the resources they use.",
    details: ["Compute-time Calculation", "Size-based Tiers", "Atomic Transaction"],
    icon: CreditCard,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/20"
  },
  {
    title: "Real-time Notification",
    description: "As soon as the analysis concludes, the user is notified instantly via a dedicated WebSocket channel. The frontend dashboard updates in real-time, displaying the results without requiring a page refresh.",
    details: ["WebSocket Events", "Instant UI Update", "Push Notifications"],
    icon: Bell,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    borderColor: "border-indigo-400/20"
  },
  {
    title: "Privacy-First Cleanup",
    description: "To uphold strict data privacy standards, the uploaded binary is automatically purged from our storage systems immediately after analysis. We retain only the metadata and the generated report.",
    details: ["Auto-deletion Policy", "Zero-retention Storage", "Compliance Ready"],
    icon: Trash2,
    color: "text-gray-400",
    bgColor: "bg-gray-400/10",
    borderColor: "border-gray-400/20"
  }
];

const CypherRayWorkflow = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 80%"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="w-full min-h-screen bg-[#0a0015] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0a0015] to-[#0a0015] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10" ref={containerRef}>
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-6"
          >
            Analysis Pipeline
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Trace the journey of a binary file through our secure, AI-powered analysis infrastructure.
          </motion.p>
        </div>

        <div className="relative">
          {/* Central Line Track */}
          <div 
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-purple-900/30 -translate-x-1/2 rounded-full" 
            style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}
          />
          
          {/* Progressive Fill Line */}
          <motion.div 
            style={{ 
              height: lineHeight,
              maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
            }}
            className="absolute left-4 md:left-1/2 top-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 -translate-x-1/2 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)] origin-top"
          />

          <div className="space-y-6 md:space-y-8">
            {workflowSteps.map((step, index) => (
              <WorkflowStep 
                key={index} 
                step={step} 
                index={index} 
                isLast={index === workflowSteps.length - 1}
                totalSteps={workflowSteps.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkflowStep = ({ step, index, isLast, totalSteps, scrollYProgress }) => {
  const isEven = index % 2 === 0;
  
  // Calculate fill state based on scroll progress
  const progressTarget = index / (totalSteps - 1);
  const scale = useTransform(scrollYProgress, 
    [progressTarget - 0.05, progressTarget + 0.02], 
    [0, 1]
  );

  return (
    <div className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>
      
      {/* Timeline Node (Dot) */}
      <div className="absolute left-4 md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center z-20">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`relative w-6 h-6 rounded-full bg-[#0a0015] border-2 ${step.borderColor} flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
        >
          {/* Inner Fill - Driven by scroll progress */}
          <motion.div
            style={{ scale }}
            className={`w-3 h-3 rounded-full ${step.color} bg-current shadow-[0_0_12px_currentColor]`}
          />
        </motion.div>
      </div>

      {/* Content Card */}
      <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'}`}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -50 : 50, y: 50, scale: 0.9, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: false, margin: "100% 0px -20% 0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`relative group p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-500 ${step.borderColor} overflow-hidden shadow-2xl`}
        >
          {/* Hover Glow Effect */}
          <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${isEven ? 'from-transparent via-white/5 to-transparent' : 'from-transparent via-white/5 to-transparent'}`} />
          
          {/* Header Section */}
          <div className={`flex items-center gap-5 mb-4 ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
            <div className={`p-4 rounded-2xl ${step.bgColor} ${step.color} border ${step.borderColor} shadow-lg`}>
              <step.icon size={28} />
            </div>
            <h3 className={`text-2xl font-bold text-white group-hover:${step.color} transition-colors`}>
              {step.title}
            </h3>
          </div>
          
          {/* Description */}
          <p className="text-gray-300 leading-relaxed text-lg mb-6">
            {step.description}
          </p>

          {/* Details List */}
          {step.details && (
            <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
              {step.details.map((detail, i) => (
                <span 
                  key={i} 
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${step.borderColor} ${step.bgColor} ${step.color} bg-opacity-20`}
                >
                  {detail}
                </span>
              ))}
            </div>
          )}

          {/* Step Number Watermark - Improved */}
          <div className={`absolute -top-6 -right-6 text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/5 to-transparent select-none pointer-events-none z-0 ${isEven ? 'md:right-auto md:-left-6' : ''}`}>
            {String(index + 1).padStart(2, '0')}
          </div>
        </motion.div>
      </div>
      
      {/* Empty space for the other side on desktop */}
      <div className="hidden md:block w-1/2" />
    </div>
  );
};

export default CypherRayWorkflow;
