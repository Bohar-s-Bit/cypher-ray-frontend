import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  FileText,
  TrendingUp,
  Code,
  Network,
  List,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import CryptoGraphVisualization from "../components/ui/CryptoGraphVisualization";
import { analysisService } from "../services/analysisService";
import { QUERY_KEYS, ROUTES } from "../config/constants";
import {
  transformAnalysisToGraph,
  calculateGraphStats,
} from "../utils/graphUtils";
import { format } from "date-fns";

const ResultDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("details"); // 'graph' or 'details'
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [graphStats, setGraphStats] = useState(null);

  // Fetch job result
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.ANALYSIS_JOB, jobId],
    queryFn: () => analysisService.getJobResult(jobId),
  });

  // Transform API data to graph format
  useEffect(() => {
    if (data?.data?.job) {
      const job = data.data.job;
      const transformed = transformAnalysisToGraph(job);
      setGraphData(transformed);

      if (transformed.nodes.length > 0) {
        const stats = calculateGraphStats(transformed);
        setGraphStats(stats);
      }
    }
  }, [data]);

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
    console.log("Selected node:", node);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data?.data?.job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Result Not Found</h2>
        <p className="text-white/70 mb-6">
          The analysis result you're looking for doesn't exist or has been
          deleted.
        </p>
        <Button onClick={() => navigate(ROUTES.RESULTS)}>
          Back to Results
        </Button>
      </div>
    );
  }

  const job = data.data.job;
  const results = job.results;

  // Check if results are empty or incomplete
  const hasResults = results && Object.keys(results).length > 0;
  const isProcessing = job.status === "processing" || job.status === "queued";
  const isFailed = job.status === "failed";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.RESULTS)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              {job.filename}
            </h1>
            <p className="text-white/70 mt-1 text-sm">
              Analyzed on{" "}
              {format(new Date(job.createdAt), "MMMM dd, yyyy 'at' HH:mm")}
            </p>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-1">
          <button
            onClick={() => setViewMode("graph")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              viewMode === "graph"
                ? "bg-purple-500/30 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Network className="w-4 h-4" />
            Graph View
          </button>
          <button
            onClick={() => setViewMode("details")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              viewMode === "details"
                ? "bg-purple-500/30 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            <List className="w-4 h-4" />
            Details View
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Graph View */}
        <motion.div
          initial={{ opacity: 0, display: "none" }}
          animate={{ 
            opacity: viewMode === "graph" ? 1 : 0,
            display: viewMode === "graph" ? "block" : "none"
          }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Graph Stats */}
          {graphStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="h-full"
              >
                <Card className="h-full hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 flex flex-col justify-center">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/70">Total Nodes</p>
                        <motion.p 
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          className="text-2xl font-bold text-white"
                        >
                          {graphStats.totalNodes}
                        </motion.p>
                      </div>
                      <Network className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="h-full"
              >
                <Card className="h-full hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 flex flex-col justify-center">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/70">Relationships</p>
                        <motion.p 
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: "spring" }}
                          className="text-2xl font-bold text-white"
                        >
                          {graphStats.totalEdges}
                        </motion.p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-pink-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="h-full"
              >
                <Card className="h-full hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20 flex flex-col justify-center">
                  <CardContent className="p-4">
                    <div>
                      <p className="text-sm text-white/70 mb-2">Node Types</p>
                      <div className="flex flex-wrap gap-1">
                        {graphStats.typeCounts && Object.entries(graphStats.typeCounts).map(
                          ([type, count], index) => (
                            <motion.div
                              key={type}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                            >
                              <Badge variant="secondary" size="sm" className="hover:scale-110 transition-transform">
                                {type}: {count}
                              </Badge>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="h-full"
              >
                <Card className="h-full hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 flex flex-col justify-center">
                  <CardContent className="p-4">
                    <div>
                      <p className="text-sm text-white/70 mb-2">Most Connected</p>
                      <motion.p 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-white font-medium text-sm"
                      >
                        {graphStats.mostConnected?.[0]?.label || "N/A"}
                      </motion.p>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-white/60 text-xs"
                      >
                        {graphStats.mostConnected?.[0]?.totalDegree || 0}{" "}
                        connections
                      </motion.p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Graph Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="overflow-hidden border-purple-500/20 shadow-xl shadow-purple-500/10">
              <CardContent className="p-6">
                <CryptoGraphVisualization
                  nodes={graphData.nodes}
                  edges={graphData.edges}
                  onNodeSelect={handleNodeSelect}
                height={600}
                showLegend={true}
                showControls={true}
              />
            </CardContent>
          </Card>
          </motion.div>

          {/* Selected Node Details */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
              <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-transparent shadow-lg shadow-purple-500/20">
                <CardHeader>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <CardTitle className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: selectedNode.type === 'algorithm' ? '#ec4899' : selectedNode.type === 'protocol' ? '#8b5cf6' : '#a855f7' }} />
                      Selected Node: {selectedNode.label}
                    </CardTitle>
                    <CardDescription className="capitalize">
                      Type: {selectedNode.type} • Ring Level: {selectedNode.ring}
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedNode.data &&
                      Object.entries(selectedNode.data).map(([key, value], index) => (
                        <motion.div 
                          key={key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          className="p-3 bg-black/20 rounded-lg border border-white/10 hover:border-purple-500/30 transition-colors"
                        >
                          <p className="text-sm text-white/70 capitalize">
                            {key.replace(/_/g, " ")}
                          </p>
                          <p className="font-medium text-white">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                          </p>
                        </motion.div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            )}
          </AnimatePresence>

          {/* Hint for empty graph */}
          {graphData.nodes.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Network className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  No Graph Data Available
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  This analysis doesn't contain enough data to generate a graph
                  visualization. Try the Details View instead.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setViewMode("details")}
                >
                  <List className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

      {/* Details View */}
      <motion.div
        initial={{ opacity: 0, display: "none" }}
        animate={{ 
          opacity: viewMode === "details" ? 1 : 0,
          display: viewMode === "details" ? "block" : "none"
        }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg ${
                  results?.vulnerability_assessment?.has_vulnerabilities
                    ? "bg-red-500/20"
                    : "bg-purple-500/20"
                }`}
              >
                {results?.vulnerability_assessment?.has_vulnerabilities ? (
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-white/70">Status</p>
                <p className="text-lg font-bold text-white">
                  {results?.vulnerability_assessment?.has_vulnerabilities
                    ? "Vulnerabilities Found"
                    : "Secure"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg ${
                  results?.vulnerability_assessment?.severity === "High"
                    ? "bg-red-500/20"
                    : results?.vulnerability_assessment?.severity === "Medium"
                    ? "bg-yellow-500/20"
                    : "bg-purple-500/20"
                }`}
              >
                <Shield
                  className={`w-6 h-6 ${
                    results?.vulnerability_assessment?.severity === "High"
                      ? "text-red-400"
                      : results?.vulnerability_assessment?.severity === "Medium"
                      ? "text-yellow-400"
                      : "text-purple-400"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm text-white/70">Severity</p>
                <p className="text-lg font-bold text-white">
                  {results?.vulnerability_assessment?.severity || "Low"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-white/70">Processing Time</p>
                <p className="text-lg font-bold text-white">
                  {job.completedAt && job.startedAt
                    ? (() => {
                        const seconds = Math.round(
                          (new Date(job.completedAt) -
                            new Date(job.startedAt)) /
                            1000
                        );
                        if (seconds < 60) return `${seconds}s`;
                        const minutes = Math.floor(seconds / 60);
                        const remainingSeconds = seconds % 60;
                        return `${minutes}m ${remainingSeconds}s`;
                      })()
                    : job.status === "processing"
                    ? "In Progress..."
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing/Failed Status Messages */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Analysis in Progress
                </h3>
                <p className="text-white/70">
                  Your file is being analyzed. This may take a few minutes.
                </p>
                <p className="text-white/50 text-sm mt-2">
                  Progress: {job.progress}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isFailed && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Analysis Failed
                </h3>
                <p className="text-white/70">
                  {job.error?.message || "An error occurred during analysis."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasResults && !isProcessing && !isFailed && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-yellow-500/20">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No Analysis Results Available
                </h3>
                <p className="text-white/70">
                  The analysis completed but no results were generated. This might be due to an incompatible file format or processing error.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Metadata */}
      {hasResults && results?.file_metadata && (
        <Card>
          <CardHeader>
            <CardTitle>File Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-white/70">File Type</p>
                <p className="font-medium text-white">
                  {results.file_metadata.file_type || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/70">Size</p>
                <p className="font-medium text-white">
                  {results.file_metadata.size_bytes
                    ? `${(results.file_metadata.size_bytes / 1024).toFixed(2)} KB`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/70">MD5</p>
                <p className="font-mono text-xs text-white break-all">
                  {results.file_metadata.md5 || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/70">SHA-256</p>
                <p className="font-mono text-xs text-white break-all">
                  {results.file_metadata.sha256 || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results */}
      {hasResults && (
        <Card>
          <CardHeader>
            <CardTitle>Security Analysis</CardTitle>
            <CardDescription>
              Detailed cryptographic security assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Check if we have any actual analysis data */}
            {!results?.vulnerability_assessment?.vulnerabilities?.length &&
              !results?.overall_assessment &&
              !results?.vulnerability_assessment?.recommendations?.length &&
              !results?.detected_algorithms?.length &&
              !results?.function_analyses?.length &&
              !results?.xai_explanation && (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-purple-500/20">
                      <FileText className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Analysis Complete - No Security Issues Found
                      </h3>
                      <p className="text-white/70">
                        The file was analyzed successfully. No cryptographic vulnerabilities or security concerns were detected.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* Vulnerabilities */}
            {results?.vulnerability_assessment?.vulnerabilities &&
              results.vulnerability_assessment.vulnerabilities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Vulnerabilities Detected (
                  {results.vulnerability_assessment.vulnerabilities.length})
                </h3>
                <div className="space-y-3 text-black">
                  {results.vulnerability_assessment.vulnerabilities.map(
                    (vuln, index) => (
                      <div
                        key={index}
                        className="p-4 border border-red-500/30 rounded-lg bg-red-500/10"
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-white">{vuln}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Overall Assessment */}
          {results?.overall_assessment && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Overall Assessment
              </h3>
              <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                <p className="text-white/90 whitespace-pre-wrap">
                  {results.overall_assessment}
                </p>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {results?.vulnerability_assessment?.recommendations &&
            results.vulnerability_assessment.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Security Recommendations
                </h3>
                <ul className="space-y-2">
                  {results.vulnerability_assessment.recommendations.map(
                    (rec, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-white/90"
                      >
                        <TrendingUp className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          {/* Detected Algorithms */}
          {results?.detected_algorithms &&
            results.detected_algorithms.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Detected Cryptographic Algorithms
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.detected_algorithms.map((algo, index) => (
                    <div
                      key={index}
                      className="p-4 border border-purple-500/30 rounded-lg bg-purple-500/5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white flex items-center gap-2">
                          <Code className="w-4 h-4 text-purple-400" />
                          {algo.algorithm_name}
                        </h4>
                        <Badge variant="secondary" size="sm">
                          {Math.round(algo.confidence_score * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-white/70">
                        {algo.algorithm_class}
                      </p>
                      {algo.structural_signature && (
                        <p className="text-xs text-white/50 mt-1">
                          Pattern: {algo.structural_signature}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Function Analyses */}
          {results?.function_analyses &&
            results.function_analyses.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Function Analysis
                </h3>
                <div className="space-y-3">
                  {results.function_analyses.map((func, index) => (
                    <div
                      key={index}
                      className="p-4 border border-purple-500/30 rounded-lg bg-purple-500/5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-mono text-sm font-medium text-white">
                          {func.function_name}
                        </h4>
                        <div className="flex items-center gap-2">
                          {func.is_crypto && (
                            <Badge variant="primary" size="sm">
                              Cryptographic
                            </Badge>
                          )}
                          <Badge variant="secondary" size="sm">
                            {Math.round(func.confidence_score * 100)}%
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-white/90 mb-2">
                        {func.function_summary}
                      </p>
                      {func.semantic_tags && func.semantic_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {func.semantic_tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-xs bg-white/5 backdrop-blur-sm border border-white/10 text-white/70 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* XAI Explanation */}
          {results?.xai_explanation && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                AI Analysis Explanation
              </h3>
              <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                <p className="text-sm text-white/90 whitespace-pre-wrap">
                  {results.xai_explanation}
                </p>
              </div>
            </div>
            )}
          </CardContent>
        </Card>
      )}
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => navigate(ROUTES.RESULTS)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
        <Button onClick={() => navigate(ROUTES.ANALYZE)}>
          <FileText className="w-4 h-4 mr-2" />
          Analyze Another File
        </Button>
      </div>
    </div>
  );
};

export default ResultDetailPage;
