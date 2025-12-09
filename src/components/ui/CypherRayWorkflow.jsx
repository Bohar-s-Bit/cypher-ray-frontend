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
    title: "File Upload & Storage",
    description: "Binary files are securely uploaded to Cloudinary with SHA-256 hash-based deduplication. Each file undergoes initial validation for size (80MB max) and integrity before being stored with a unique identifier for later retrieval.",
    details: ["Cloudinary Cloud Storage", "SHA-256 Deduplication", "80MB File Limit"],
    icon: UploadCloud,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20"
  },
  {
    title: "Job Creation & Database Record",
    description: "A comprehensive analysis job record is created in MongoDB containing user metadata, file information, status tracking, and credit estimation. This serves as the central source of truth throughout the entire analysis lifecycle.",
    details: ["MongoDB Job Record", "User & File Metadata", "Real-time Status Tracking"],
    icon: Database,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/20"
  },
  {
    title: "Tier-Based Queue Management",
    description: "Jobs are added to Redis-backed Bull queues with tier-based prioritization. Tier 1 users get higher priority (concurrency: 10) while Tier 2 users have standard priority (concurrency: 5), ensuring fair resource allocation.",
    details: ["Bull Queue (Redis)", "Tier 1 Priority: High", "Tier 2 Priority: Standard"],
    icon: Layers,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/20"
  },
  {
    title: "Worker Process & File Download",
    description: "An isolated worker node claims the job from the queue and securely downloads the binary from Cloudinary to a temporary sandboxed environment. The worker manages retries (3 attempts) and emits progress updates via WebSocket.",
    details: ["Isolated Worker Nodes", "Cloudinary Download", "3 Retry Attempts"],
    icon: Cpu,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/20"
  },
  {
    title: "Model 1: Crypto Presence Detection",
    description: "The first ML model analyzes whether the binary contains cryptographic implementations. This binary classifier (trained on 66,000+ multi-architecture binaries) determines if further analysis is needed, saving credits on non-crypto files.",
    details: ["Binary Classifier", "66K+ Training Dataset", "Multi-Architecture Support"],
    icon: BrainCircuit,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/20"
  },
  {
    title: "Angr Structural Analysis",
    description: "Using the open-source Angr framework, the binary undergoes deep structural analysis including metadata extraction, function discovery, crypto string analysis, constant detection, and advanced pattern recognition (MIR, Feistel detection) at zero AI cost.",
    details: ["Angr Binary Analysis", "Function Discovery", "Constant Detection"],
    icon: Download,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    borderColor: "border-pink-400/20"
  },
  {
    title: "Model 2: Algorithm Classification",
    description: "The multi-class classifier identifies specific cryptographic algorithms (AES, RSA, SHA, ChaCha20, etc.) using structural signatures and pattern matching. Achieves 96% accuracy across symmetric/asymmetric encryption, hashing, and protocols with confidence scoring (60-99%).",
    details: ["Multi-class Classifier", "Known Algorithm Database", "96% Accuracy"],
    icon: BrainCircuit,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/20"
  },
  {
    title: "Model 3: Proprietary Detection (Deep Scan)",
    description: "When deep scan is enabled, Model 3 detects custom/proprietary cryptographic implementations using similarity scoring (< 75% threshold). Newly discovered algorithms are automatically added to Model 2's database, enabling cross-user learning.",
    details: ["Similarity-Based Detection", "Database Enrichment", "Cross-User Learning"],
    icon: BrainCircuit,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/20"
  },
  {
    title: "Function-to-Algorithm Mapping",
    description: "Detected functions are mapped to their corresponding cryptographic algorithms. This analysis identifies which functions implement specific encryption, hashing, or protocol operations with confidence scores and operational details.",
    details: ["Function Mapping", "Operation Identification", "Confidence Scoring"],
    icon: Layers,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    borderColor: "border-indigo-400/20"
  },
  {
    title: "Results Storage & Credit Deduction",
    description: "Analysis results are structured into a comprehensive JSON report and stored in MongoDB. Dynamic credit calculation based on file size and actual processing time determines the final cost, which is deducted from the user's balance (supports debt model).",
    details: ["JSON Report Generation", "Dynamic Credit Pricing", "Debt Model Support"],
    icon: Save,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/20"
  },
  {
    title: "WebSocket Notification & File Cleanup",
    description: "Users receive instant WebSocket notifications (job:completed event) with real-time dashboard updates. The binary file is automatically deleted from Cloudinary immediately after analysis, maintaining zero-retention privacy standards.",
    details: ["WebSocket Events", "Real-time Updates", "Auto-file Deletion"],
    icon: Bell,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/20"
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
            Three-Model ML Pipeline
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-400 max-w-3xl mx-auto"
          >
            Explore our progressive cryptographic detection system: Model 1 (Presence Detection) → Angr Structural Analysis → Model 2 (Algorithm Classification) → Model 3 (Proprietary Detection with Cross-User Learning).
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
