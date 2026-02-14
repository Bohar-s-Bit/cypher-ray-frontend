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
  Activity,
  Bug,
  Key,
  Globe,
  HardDrive,
  Settings,
  Download,
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
import AlgorithmConfidenceChart from "../components/ui/AlgorithmConfidenceChart";
import ProtocolHandshakeTimeline from "../components/ui/ProtocolHandshakeTimeline";
import { analysisService } from "../services/analysisService";
import { QUERY_KEYS, ROUTES } from "../config/constants";
import {
  transformAnalysisToGraph,
  calculateGraphStats,
} from "../utils/graphUtils";
import {
  transformToProtocolTimeline,
  getProtocolStats,
} from "../utils/protocolUtils";
import { format } from "date-fns";

const ResultDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("details"); // 'graph', 'details', or 'protocol'
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [graphStats, setGraphStats] = useState(null);
  const [protocolTimelines, setProtocolTimelines] = useState([]);
  const [protocolStats, setProtocolStats] = useState(null);

  // Fetch job result
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.ANALYSIS_JOB, jobId],
    queryFn: () => analysisService.getJobResult(jobId),
  });

  // Detect dynamic-only mode
  const isDynamicOnly =
    data?.data?.job?.results?.dynamic_analysis?.mode === "primary";

  // Transform API data to graph format and protocol timeline (only for static results)
  useEffect(() => {
    if (data?.data?.job && !isDynamicOnly) {
      const job = data.data.job;

      // Graph transformation
      const transformed = transformAnalysisToGraph(job);
      setGraphData(transformed);

      if (transformed.nodes.length > 0) {
        const stats = calculateGraphStats(transformed);
        setGraphStats(stats);
      }

      // Protocol timeline transformation
      const timelines = transformToProtocolTimeline(job);
      setProtocolTimelines(timelines);

      if (timelines.length > 0) {
        const pStats = getProtocolStats(timelines);
        setProtocolStats(pStats);
      }
    }
  }, [data, isDynamicOnly]);

  // Default to details view for dynamic-only results
  useEffect(() => {
    if (isDynamicOnly && (viewMode === "graph" || viewMode === "protocol")) {
      setViewMode("details");
    }
  }, [isDynamicOnly, viewMode]);

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
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
  const dynamicAnalysis = results?.dynamic_analysis;

  // Check if results are empty or incomplete
  const hasResults = results && Object.keys(results).length > 0;
  const isProcessing = job.status === "processing" || job.status === "queued";
  const isFailed = job.status === "failed";

  const getRiskScoreColor = (score) => {
    if (score >= 8) return "text-red-400";
    if (score >= 5) return "text-orange-400";
    if (score >= 3) return "text-yellow-400";
    if (score >= 1) return "text-green-400";
    return "text-emerald-400";
  };

  const getRiskScoreBg = (score) => {
    if (score >= 8) return "from-red-500/20 to-red-900/10 border-red-500/30";
    if (score >= 5) return "from-orange-500/20 to-orange-900/10 border-orange-500/30";
    if (score >= 3) return "from-yellow-500/20 to-yellow-900/10 border-yellow-500/30";
    if (score >= 1) return "from-green-500/20 to-green-900/10 border-green-500/30";
    return "from-emerald-500/20 to-emerald-900/10 border-emerald-500/30";
  };

  const getSignatureSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "border-red-500/40 bg-red-500/10";
      case "high":
        return "border-red-500/30 bg-red-500/5";
      case "medium":
        return "border-yellow-500/30 bg-yellow-500/5";
      case "low":
        return "border-green-500/30 bg-green-500/5";
      default:
        return "border-white/10 bg-white/5";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">
            {job.filename}
          </h1>
          <p className="text-white/70 mt-1 text-sm">
            Analyzed on{" "}
            {format(new Date(job.createdAt), "MMMM dd, yyyy 'at' HH:mm")}
          </p>
        </div>

        {/* View toggle - hide Graph/Protocol for dynamic-only */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-1">
          {!isDynamicOnly && (
            <>
              <button
                onClick={() => setViewMode("graph")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === "graph"
                    ? "bg-purple-500/30 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Network className="w-4 h-4" />
                Graph
              </button>
              <button
                onClick={() => setViewMode("protocol")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === "protocol"
                    ? "bg-purple-500/30 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Shield className="w-4 h-4" />
                Protocol
              </button>
            </>
          )}
          <button
            onClick={() => setViewMode("details")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              viewMode === "details"
                ? "bg-purple-500/30 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            <List className="w-4 h-4" />
            Details
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Graph View */}
        {!isDynamicOnly && (
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
        )}

        {/* Protocol Timeline View */}
        {!isDynamicOnly && (
        <motion.div
          initial={{ opacity: 0, display: "none" }}
          animate={{
            opacity: viewMode === "protocol" ? 1 : 0,
            display: viewMode === "protocol" ? "block" : "none"
          }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Protocol Stats */}
          {protocolStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Card className="hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/70">Protocols</p>
                        <motion.p
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          className="text-2xl font-bold text-white"
                        >
                          {protocolStats.totalProtocols}
                        </motion.p>
                      </div>
                      <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card className="hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/70">Algorithms</p>
                        <motion.p
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: "spring" }}
                          className="text-2xl font-bold text-white"
                        >
                          {protocolStats.totalAlgorithms}
                        </motion.p>
                      </div>
                      <Code className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/70">Functions</p>
                        <motion.p
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                          className="text-2xl font-bold text-white"
                        >
                          {protocolStats.totalFunctions}
                        </motion.p>
                      </div>
                      <FileText className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className="hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20">
                  <CardContent className="p-4">
                    <div>
                      <p className="text-sm text-white/70 mb-2">Category Distribution</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(protocolStats.categoryDistribution || {}).map(
                          ([category, count], index) => (
                            <motion.div
                              key={category}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                            >
                              <Badge variant="secondary" size="sm">
                                {category.split('/')[0]}: {count}
                              </Badge>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Protocol Timeline Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="overflow-hidden border-blue-500/20 shadow-xl shadow-blue-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Protocol Handshake Timeline
                </CardTitle>
                <CardDescription>
                  Cryptographic algorithms mapped to their protocol stages
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ProtocolHandshakeTimeline timelines={protocolTimelines} />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        )}

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

      {/* Dynamic Analysis Overview (dynamic-only mode) */}
      {hasResults && isDynamicOnly && dynamicAnalysis && (
        <Card className={`border bg-gradient-to-br ${getRiskScoreBg(dynamicAnalysis.malScore)}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Dynamic Analysis Overview
            </CardTitle>
            <CardDescription>
              CAPEv2 sandbox behavioral analysis results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mal Score Gauge */}
              <div className="flex flex-col items-center justify-center p-4">
                <p className="text-sm text-white/70 mb-2">Malware Score</p>
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50" cy="50" r="40"
                      fill="none" stroke="currentColor"
                      className="text-white/10"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50" cy="50" r="40"
                      fill="none"
                      stroke="currentColor"
                      className={getRiskScoreColor(dynamicAnalysis.malScore)}
                      strokeWidth="8"
                      strokeDasharray={`${(dynamicAnalysis.malScore / 10) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${getRiskScoreColor(dynamicAnalysis.malScore)}`}>
                      {dynamicAnalysis.malScore}
                    </span>
                    <span className="text-xs text-white/50">/10</span>
                  </div>
                </div>
              </div>

              {/* Risk Level */}
              <div className="flex flex-col items-center justify-center p-4">
                <p className="text-sm text-white/70 mb-3">Risk Level</p>
                <Badge
                  variant={
                    dynamicAnalysis.riskLevel === "Clean" ? "success" :
                    dynamicAnalysis.riskLevel === "Low" ? "success" :
                    dynamicAnalysis.riskLevel === "Medium" ? "warning" : "error"
                  }
                  size="lg"
                >
                  {dynamicAnalysis.riskLevel}
                </Badge>
                <p className="text-xs text-white/50 mt-3">
                  {dynamicAnalysis.signatures?.length || 0} behavioral signatures detected
                </p>
              </div>

              {/* Task Info */}
              <div className="flex flex-col justify-center p-4 space-y-3">
                <div>
                  <p className="text-xs text-white/50">CAPE Task ID</p>
                  <p className="font-mono text-sm text-white">{dynamicAnalysis.taskId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Analysis Engine</p>
                  <p className="text-sm text-white">CAPEv2 Dynamic Sandbox</p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Security Score</p>
                  <p className="text-sm text-white">{results.vulnerability_assessment?.security_score ?? "N/A"}/10</p>
                </div>
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
                <p className="text-sm text-white/70">Processing Time</p>
                <p className="font-medium text-white">
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
              <div>
                <p className="text-sm text-white/70">Architecture</p>
                <p className="font-medium text-white">
                  {results.file_metadata.architecture || "N/A"}
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

      {/* Behavioral Signatures (dynamic-only) */}
      {hasResults && isDynamicOnly && dynamicAnalysis?.signatures?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-red-400" />
              Behavioral Signatures ({dynamicAnalysis.signatures.length})
            </CardTitle>
            <CardDescription>
              Suspicious behaviors detected during sandbox execution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dynamicAnalysis.signatures.map((sig, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${getSignatureSeverityColor(sig.severity)} transition-colors`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white text-sm">{sig.name}</h4>
                  <Badge
                    variant={
                      sig.severity === "critical" || sig.severity === "high" ? "error" :
                      sig.severity === "medium" ? "warning" : "secondary"
                    }
                    size="sm"
                  >
                    {sig.severity}
                  </Badge>
                </div>
                <p className="text-sm text-white/70">{sig.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Behavioral Analysis (dynamic-only) */}
      {hasResults && isDynamicOnly && dynamicAnalysis?.behavioralAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Behavioral Analysis
            </CardTitle>
            <CardDescription>
              Runtime behavior observed in the sandbox
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Process Tree */}
            {dynamicAnalysis.behavioralAnalysis.processTree?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-400" />
                  Process Tree ({dynamicAnalysis.behavioralAnalysis.processTree.length})
                </h4>
                <div className="space-y-2">
                  {dynamicAnalysis.behavioralAnalysis.processTree.map((proc, index) => (
                    <div
                      key={index}
                      className="p-3 bg-black/20 rounded-lg border border-white/10 font-mono text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400">PID {proc.pid || proc.process_id || index}</span>
                        <span className="text-white">{proc.name || proc.process_name || JSON.stringify(proc)}</span>
                      </div>
                      {proc.command_line && (
                        <p className="text-white/50 text-xs mt-1 break-all">{proc.command_line}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Network Activity */}
            {dynamicAnalysis.behavioralAnalysis.networkActivity && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Network Activity
                </h4>
                <div className="p-3 bg-black/20 rounded-lg border border-white/10">
                  {typeof dynamicAnalysis.behavioralAnalysis.networkActivity === "object" ? (
                    <div className="space-y-2">
                      {Object.entries(dynamicAnalysis.behavioralAnalysis.networkActivity).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2">
                          <span className="text-cyan-400 text-sm font-medium min-w-[80px]">{key}:</span>
                          <span className="text-white/70 text-sm break-all">
                            {Array.isArray(value)
                              ? value.length > 0 ? value.join(", ") : "None"
                              : typeof value === "object"
                              ? JSON.stringify(value, null, 2)
                              : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/70 text-sm">No network activity recorded</p>
                  )}
                </div>
              </div>
            )}

            {/* File Operations */}
            {dynamicAnalysis.behavioralAnalysis.fileOperations?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-green-400" />
                  File Operations ({dynamicAnalysis.behavioralAnalysis.fileOperations.length})
                </h4>
                <div className="space-y-1">
                  {dynamicAnalysis.behavioralAnalysis.fileOperations.map((op, index) => (
                    <div
                      key={index}
                      className="p-2 bg-black/20 rounded border border-white/10 font-mono text-xs text-white/70 break-all"
                    >
                      {op}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Registry Operations */}
            {dynamicAnalysis.behavioralAnalysis.registryOperations?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-orange-400" />
                  Registry Operations ({dynamicAnalysis.behavioralAnalysis.registryOperations.length})
                </h4>
                <div className="space-y-1">
                  {dynamicAnalysis.behavioralAnalysis.registryOperations.map((op, index) => (
                    <div
                      key={index}
                      className="p-2 bg-black/20 rounded border border-white/10 font-mono text-xs text-white/70 break-all"
                    >
                      {op}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state for behavioral analysis */}
            {!dynamicAnalysis.behavioralAnalysis.processTree?.length &&
              !dynamicAnalysis.behavioralAnalysis.networkActivity &&
              !dynamicAnalysis.behavioralAnalysis.fileOperations?.length &&
              !dynamicAnalysis.behavioralAnalysis.registryOperations?.length && (
                <p className="text-white/50 text-sm text-center py-4">
                  No behavioral data was captured during execution.
                </p>
              )}
          </CardContent>
        </Card>
      )}

      {/* Extracted Keys (dynamic-only) */}
      {hasResults && isDynamicOnly && dynamicAnalysis?.extractedKeys?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-yellow-400" />
              Extracted Keys ({dynamicAnalysis.extractedKeys.length})
            </CardTitle>
            <CardDescription>
              Cryptographic keys extracted during dynamic execution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dynamicAnalysis.extractedKeys.map((key, index) => (
              <div
                key={index}
                className="p-4 border border-yellow-500/30 rounded-lg bg-yellow-500/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="warning" size="sm">{key.type || "Unknown"}</Badge>
                  {key.sha256 && (
                    <span className="text-xs text-white/50 font-mono">{key.sha256.substring(0, 16)}...</span>
                  )}
                </div>
                <pre className="text-xs text-white/70 font-mono overflow-x-auto whitespace-pre-wrap break-all">
                  {typeof key.data === "object" ? JSON.stringify(key.data, null, 2) : String(key.data)}
                </pre>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Static Analysis Results (backward compatibility) */}
      {hasResults && !isDynamicOnly && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Detected cryptographic implementations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Check if we have any actual analysis data */}
            {!results?.detected_protocols?.length &&
              !results?.detected_algorithms?.length &&
              !results?.function_analyses?.length && (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-purple-500/20">
                      <FileText className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Analysis Complete
                      </h3>
                      <p className="text-white/70">
                        No cryptographic implementations detected in this file.
                      </p>
                    </div>
                  </div>
                </div>
              )}

          {/* Function Analyses - FIRST */}
          {results?.function_analyses &&
            results.function_analyses.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-pink-400" />
                  Cryptographic Functions ({results.function_analyses.length})
                </h3>
                <div className="space-y-3">
                  {results.function_analyses.map((func, index) => (
                    <div
                      key={index}
                      className="p-4 border border-pink-500/30 rounded-lg bg-pink-500/5 hover:bg-pink-500/10 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-mono text-sm font-semibold text-white">
                          {func.function_name}
                        </h4>
                        {func.is_crypto && (
                          <Badge variant="primary" size="sm">
                            Cryptographic
                          </Badge>
                        )}
                      </div>
                      {func.related_algorithm && (
                        <p className="text-sm text-pink-300 mb-2 flex items-center gap-1">
                          <span className="text-white/60">Implements:</span> {func.related_algorithm}
                        </p>
                      )}
                      {func.crypto_operations && func.crypto_operations.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-white/60 mb-1">Operations:</p>
                          <div className="flex flex-wrap gap-1">
                            {func.crypto_operations.map((op, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 text-xs bg-pink-500/10 border border-pink-500/20 text-pink-300 rounded"
                              >
                                {op}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Detected Algorithms - SECOND */}
          {results?.detected_algorithms &&
            results.detected_algorithms.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-purple-400" />
                  Detected Algorithms ({results.detected_algorithms.length})
                </h3>

                {/* Algorithm Confidence Visualization */}
                <div className="mb-6">
                  <AlgorithmConfidenceChart data={results.detected_algorithms} />
                </div>

                <h4 className="text-md font-semibold text-white mb-3 mt-6">Algorithm Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.detected_algorithms.map((algo, index) => (
                    <div
                      key={index}
                      className="p-4 border border-purple-500/30 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">
                          {algo.algorithm_name}
                        </h4>
                        <Badge variant="secondary" size="sm">
                          {Math.round((algo.confidence_score || 0) * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-white/70 mb-2">
                        {algo.algorithm_class}
                      </p>
                      {algo.locations && algo.locations.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-white/60 mb-1">Found in:</p>
                          <div className="flex flex-wrap gap-1">
                            {algo.locations.slice(0, 3).map((loc, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 text-xs bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded font-mono"
                              >
                                {loc.length > 30 ? `${loc.substring(0, 30)}...` : loc}
                              </span>
                            ))}
                            {algo.locations.length > 3 && (
                              <span className="px-2 py-0.5 text-xs text-white/50">
                                +{algo.locations.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detected Protocols - THIRD */}
            {results?.detected_protocols &&
              results.detected_protocols.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Detected Protocols ({results.detected_protocols.length})
                </h3>
                <div className="space-y-3">
                  {results.detected_protocols.map((proto, index) => (
                    <div
                      key={index}
                      className="p-4 border border-cyan-500/30 rounded-lg bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors"
                    >
                      <div className="mb-2">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          {proto.protocol} {proto.version && `v${proto.version}`}
                        </h4>
                      </div>
                      {proto.cipher_suites && proto.cipher_suites.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-white/60 mb-1">Cipher Suites:</p>
                          <div className="flex flex-wrap gap-1">
                            {proto.cipher_suites.map((suite, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded"
                              >
                                {suite}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {proto.implementation_status && (
                        <div className="mt-2">
                          <Badge
                            variant={proto.implementation_status === 'complete' ? 'primary' : 'secondary'}
                            size="sm"
                          >
                            {proto.implementation_status}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dynamic-only: empty crypto message */}
      {hasResults && isDynamicOnly && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Behavioral analysis summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/70 mb-1">Overall Assessment</p>
                <p className="text-white text-sm">{results.overall_assessment}</p>
              </div>
              {results.xai_explanation && (
                <div>
                  <p className="text-sm text-white/70 mb-1">Detailed Explanation</p>
                  <p className="text-white/80 text-sm">{results.xai_explanation}</p>
                </div>
              )}
              {results.key_findings?.length > 0 && (
                <div>
                  <p className="text-sm text-white/70 mb-2">Key Findings</p>
                  <div className="flex flex-wrap gap-2">
                    {results.key_findings.map((finding, i) => (
                      <Badge key={i} variant="secondary" size="sm">{finding}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {results.vulnerability_assessment?.recommendations?.length > 0 && (
                <div>
                  <p className="text-sm text-white/70 mb-2">Recommendations</p>
                  <ul className="space-y-1">
                    {results.vulnerability_assessment.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">&#8226;</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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
