import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Network,
  List,
  TrendingUp,
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

const ResultDetailGraphPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("graph"); // 'graph' or 'details'
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

      <AnimatePresence mode="wait">
        {/* Graph View */}
        {viewMode === "graph" && (
          <motion.div
            key="graph-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
          {/* Graph Stats */}
          {graphStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Total Nodes</p>
                      <p className="text-2xl font-bold text-white">
                        {graphStats.totalNodes}
                      </p>
                    </div>
                    <Network className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Relationships</p>
                      <p className="text-2xl font-bold text-white">
                        {graphStats.totalEdges}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div>
                    <p className="text-sm text-white/70 mb-2">Node Types</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(graphStats.typeCounts).map(
                        ([type, count]) => (
                          <Badge key={type} variant="secondary" size="sm">
                            {type}: {count}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div>
                    <p className="text-sm text-white/70 mb-2">Most Connected</p>
                    <p className="text-white font-medium text-sm">
                      {graphStats.mostConnected[0]?.label || "N/A"}
                    </p>
                    <p className="text-white/60 text-xs">
                      {graphStats.mostConnected[0]?.totalDegree || 0}{" "}
                      connections
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Graph Visualization */}
          <CryptoGraphVisualization
            nodes={graphData.nodes}
            edges={graphData.edges}
            onNodeSelect={handleNodeSelect}
            height={600}
            showLegend={true}
            showControls={true}
          />

          {/* Selected Node Details */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Node Details</CardTitle>
                    <CardDescription>{selectedNode.label}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-white/70">Type</p>
                        <p className="font-medium text-white capitalize">
                          {selectedNode.type}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-white/70">Ring Level</p>
                        <p className="font-medium text-white">
                          {selectedNode.ring}
                        </p>
                      </div>
                      {selectedNode.data &&
                        Object.entries(selectedNode.data).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-sm text-white/70 capitalize">
                              {key}
                            </p>
                            <p className="font-medium text-white">{String(value)}</p>
                          </div>
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

        {/* Details View (your existing detailed view) */}
        {viewMode === "details" && (
          <motion.div
            key="details-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
          {/* Your existing ResultDetailPage content goes here */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Details</CardTitle>
              <CardDescription>
                Complete cryptographic analysis results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                This would contain all the detailed analysis information from
                your existing ResultDetailPage component.
              </p>
              <p className="text-white/70 mt-2">
                You can copy the content from ResultDetailPage.jsx here, or
                refactor it into separate components.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
      </AnimatePresence>

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

export default ResultDetailGraphPage;
