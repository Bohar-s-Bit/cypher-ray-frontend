import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Shield,
  Lock,
  Key,
  CheckCircle,
  Code,
  ArrowDown,
} from "lucide-react";
import Badge from "./Badge";

/**
 * ProtocolHandshakeTimeline Component
 * 
 * Visualizes cryptographic protocols as sequential algorithm execution timelines.
 * Shows algorithms in the order they were executed/detected, with category-based coloring:
 * - Handshake/Key Exchange (blue) - RSA, ECDH, Diffie-Hellman
 * - Authentication/Integrity (green) - SHA, HMAC, hashing algorithms
 * - Transport/Encryption (purple) - AES, ChaCha20, symmetric encryption
 * 
 * Props:
 * @param {Array} timelines - Array of protocol timeline objects from transformToProtocolTimeline()
 * 
 * Timeline Object Structure:
 * {
 *   protocolId: string,
 *   protocolName: string,
 *   version: string,
 *   description: string,
 *   algorithmSequence: [{
 *     sequenceId: number,
 *     name: string,
 *     type: string,
 *     category: string,
 *     categoryIcon: string,
 *     categoryColor: string,
 *     confidence: number,
 *     evidence: string[],
 *     functions: [{ name, operations, confidence }]
 *   }]
 * }
 * 
 * Features:
 * - Sequential algorithm display showing execution order
 * - Color-coded by category with glowing effects
 * - Expandable algorithms showing implementing functions
 * - Animated transitions and flow indicators
 */

/**
 * Color mapping for different categories
 */
const CATEGORY_COLORS = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    glow: "shadow-[0_0_15px_rgba(34,197,94,0.3)]",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
  },
};

/**
 * Category icons mapping
 */
const CATEGORY_ICONS = {
  "Handshake/Key Exchange": Key,
  "Authentication/Integrity": Shield,
  "Transport/Encryption": Lock,
};

/**
 * Individual Protocol Timeline Component
 */
const ProtocolTimeline = ({ timeline, index }) => {
  const [expandedAlgorithms, setExpandedAlgorithms] = useState(new Set());

  const toggleAlgorithm = (sequenceId) => {
    const newExpanded = new Set(expandedAlgorithms);
    if (newExpanded.has(sequenceId)) {
      newExpanded.delete(sequenceId);
    } else {
      newExpanded.add(sequenceId);
    }
    setExpandedAlgorithms(newExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* Protocol Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full mb-3"
        >
          <Shield className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-bold text-white">{timeline.protocolName}</h3>
          {timeline.version !== "N/A" && (
            <Badge variant="secondary" size="sm">
              v{timeline.version}
            </Badge>
          )}
        </motion.div>
        <p className="text-white/60 text-sm max-w-2xl mx-auto">
          {timeline.description}
        </p>
        <p className="text-white/40 text-xs mt-2">
          Sequential execution of {timeline.algorithmSequence?.length || 0} algorithms
        </p>
      </div>

      {/* Handshake Insights */}
      {timeline.handshakeInsights && timeline.handshakeInsights.stages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-4 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/20 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-semibold text-white">Protocol Handshake Flow</h4>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {timeline.handshakeInsights.hasKeyExchange && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full">
                <Key className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-blue-300">Key Exchange</span>
              </div>
            )}
            {timeline.handshakeInsights.hasKeyExchange && timeline.handshakeInsights.hasAuthentication && (
              <ArrowDown className="w-4 h-4 text-white/30 rotate-[-90deg]" />
            )}
            {timeline.handshakeInsights.hasAuthentication && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                <Shield className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs text-green-300">Authentication</span>
              </div>
            )}
            {timeline.handshakeInsights.hasAuthentication && timeline.handshakeInsights.hasEncryption && (
              <ArrowDown className="w-4 h-4 text-white/30 rotate-[-90deg]" />
            )}
            {timeline.handshakeInsights.hasEncryption && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs text-purple-300">Secure Transport</span>
              </div>
            )}
          </div>
          <p className="text-xs text-white/50 mt-2">
            {timeline.handshakeInsights.hasKeyExchange && timeline.handshakeInsights.hasAuthentication && timeline.handshakeInsights.hasEncryption
              ? "✓ Complete handshake with key exchange, authentication, and encryption"
              : timeline.handshakeInsights.hasKeyExchange && timeline.handshakeInsights.hasEncryption
              ? "✓ Secure protocol with key exchange and encryption"
              : timeline.handshakeInsights.hasAuthentication && timeline.handshakeInsights.hasEncryption
              ? "✓ Authenticated and encrypted communication"
              : "✓ Cryptographic protocol implementation detected"}
          </p>
        </motion.div>
      )}

      {/* Timeline Container */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-purple-500/50"></div>

        {/* Algorithm Sequence */}
        <div className="space-y-4">
          {timeline.algorithmSequence?.map((algo, algoIndex) => {
            const isExpanded = expandedAlgorithms.has(algo.sequenceId);
            const colors = CATEGORY_COLORS[algo.categoryColor] || CATEGORY_COLORS.purple;
            const CategoryIcon = CATEGORY_ICONS[algo.category] || Shield;

            return (
              <div key={algo.sequenceId} className="relative">
                {/* Algorithm Node */}
                <div className="flex items-start gap-6">
                  {/* Timeline Node */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: algoIndex * 0.05 }}
                      className={`w-16 h-16 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center ${colors.glow}`}
                    >
                      <CategoryIcon className={`w-6 h-6 ${colors.text}`} />
                    </motion.div>
                    
                    {/* Sequence Number Badge */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-black border border-purple-500/50 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-400">
                        {algoIndex + 1}
                      </span>
                    </div>
                  </div>

                  {/* Algorithm Content */}
                  <div className="flex-1 pt-2">
                    <div
                      className={`p-4 rounded-lg border ${colors.border} ${colors.bg} hover:bg-white/5 transition-all ${
                        isExpanded ? colors.glow : ""
                      }`}
                    >
                      {/* Algorithm Header */}
                      <button
                        onClick={() => toggleAlgorithm(algo.sequenceId)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Code className={`w-4 h-4 ${colors.text}`} />
                            <span className="font-semibold text-white text-lg">
                              {algo.name}
                            </span>
                            <Badge variant="primary" size="sm">
                              {Math.round(algo.confidence * 100)}%
                            </Badge>
                            <span className={`text-xs px-2 py-1 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
                              {algo.category}
                            </span>
                          </div>
                          {algo.functions && algo.functions.length > 0 && (
                            <motion.div
                              animate={{ rotate: isExpanded ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="w-5 h-5 text-white/60" />
                            </motion.div>
                          )}
                        </div>
                      </button>

                      <p className="text-sm text-white/70 mb-2">
                        {algo.type}
                      </p>

                      {/* Evidence */}
                      {algo.evidence && algo.evidence.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {algo.evidence.slice(0, 3).map((ev, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded text-white/60"
                            >
                              {ev}
                            </span>
                          ))}
                          {algo.evidence.length > 3 && (
                            <span className="text-xs px-2 py-0.5 text-white/50">
                              +{algo.evidence.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Related Functions */}
                      <AnimatePresence>
                        {isExpanded && algo.functions && algo.functions.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mt-3 pt-3 border-t border-white/10"
                          >
                            <p className="text-xs text-white/60 mb-2 font-semibold">
                              Implementing Functions ({algo.functions.length}):
                            </p>
                            <div className="space-y-2">
                              {algo.functions.map((func, funcIndex) => (
                                <div
                                  key={funcIndex}
                                  className="p-2 bg-black/30 rounded border border-white/5"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <code className="text-xs font-mono text-purple-300">
                                      {func.name}
                                    </code>
                                    {func.confidence > 0 && (
                                      <Badge variant="secondary" size="sm">
                                        {Math.round(func.confidence * 100)}%
                                      </Badge>
                                    )}
                                  </div>
                                  {func.operations && func.operations.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {func.operations.map((op, opIndex) => (
                                        <span
                                          key={opIndex}
                                          className="text-xs px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-purple-300"
                                        >
                                          {op}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Arrow to next algorithm */}
                {algoIndex < timeline.algorithmSequence.length - 1 && (
                  <div className="flex items-center my-3 ml-8">
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: algoIndex * 0.1 }}
                      className={`${colors.text}`}
                    >
                      <ArrowDown className="w-5 h-5" />
                    </motion.div>
                    <div className="ml-3 text-xs text-white/40">
                      then executes
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Indicator */}
        <div className="flex justify-center mt-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full"
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">
              Protocol Execution Complete
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Main ProtocolHandshakeTimeline Component
 * Displays multiple protocol timelines in sequential execution order
 */
const ProtocolHandshakeTimeline = ({ timelines }) => {
  if (!timelines || timelines.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-white/30 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          No Protocol Data Available
        </h3>
        <p className="text-white/70 text-sm">
          No cryptographic protocols were detected in this analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {timelines.map((timeline, index) => (
        <ProtocolTimeline key={timeline.protocolId} timeline={timeline} index={index} />
      ))}
    </div>
  );
};

export default ProtocolHandshakeTimeline;
