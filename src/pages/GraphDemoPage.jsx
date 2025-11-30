import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Download } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import CryptoGraphVisualization from "../components/ui/CryptoGraphVisualization";
import {
  generateSampleGraphData,
  calculateGraphStats,
} from "../utils/graphUtils";

/**
 * GraphDemoPage
 * 
 * Demo page showcasing the graph visualization component with sample data.
 * Use this as a reference for integrating the graph into your own pages.
 */
const GraphDemoPage = () => {
  const [graphData, setGraphData] = useState(generateSampleGraphData());
  const [selectedNode, setSelectedNode] = useState(null);

  const handleRefresh = () => {
    setGraphData(generateSampleGraphData());
    setSelectedNode(null);
  };

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };

  const stats = calculateGraphStats(graphData);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-display font-bold text-white">
            Graph Visualization Demo
          </h1>
        </div>
        <p className="text-white/70 text-lg">
          Interactive cryptographic entity graph with radial layout
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-white/70 mb-1">Total Nodes</p>
            <p className="text-3xl font-bold text-white">{stats.totalNodes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-white/70 mb-1">Total Edges</p>
            <p className="text-3xl font-bold text-white">{stats.totalEdges}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-white/70 mb-1">Graph Density</p>
            <p className="text-3xl font-bold text-white">
              {(stats.density * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-center">
            <Button onClick={handleRefresh} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Graph */}
      <Card>
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

      {/* Selected Node Info */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Selected Node: {selectedNode.label}</CardTitle>
              <CardDescription className="capitalize">
                Type: {selectedNode.type} • Ring Level: {selectedNode.ring}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedNode.data &&
                  Object.entries(selectedNode.data).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-white/70 capitalize">{key}</p>
                      <p className="font-medium text-white">{String(value)}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Graph Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Graph Statistics</CardTitle>
          <CardDescription>
            Detailed metrics about the current graph
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Node Type Distribution */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Node Type Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(stats.typeCounts).map(([type, count]) => (
                <div
                  key={type}
                  className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg"
                >
                  <p className="text-white/70 text-sm capitalize">{type}</p>
                  <p className="text-white font-bold text-xl">{count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Most Connected Nodes */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Most Connected Nodes
            </h3>
            <div className="space-y-2">
              {stats.mostConnected.map((node, index) => (
                <div
                  key={node.nodeId}
                  className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-purple-500/30 transition-colors cursor-pointer"
                  onClick={() => {
                    const fullNode = graphData.nodes.find(
                      (n) => n.id === node.nodeId
                    );
                    if (fullNode) handleNodeSelect(fullNode);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400 font-bold">
                      #{index + 1}
                    </span>
                    <span className="text-white font-medium">{node.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {node.totalDegree}
                    </p>
                    <p className="text-white/60 text-xs">
                      {node.inDegree} in • {node.outDegree} out
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Guide</CardTitle>
          <CardDescription>
            How to integrate this component into your pages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-white font-semibold mb-2">
              1. Import the Component
            </h4>
            <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-sm text-white/80 overflow-x-auto">
              {`import CryptoGraphVisualization from "../components/ui/CryptoGraphVisualization";
import { transformAnalysisToGraph } from "../utils/graphUtils";`}
            </pre>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">
              2. Transform Your Data
            </h4>
            <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-sm text-white/80 overflow-x-auto">
              {`const graphData = transformAnalysisToGraph(analysisResult);`}
            </pre>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">
              3. Use the Component
            </h4>
            <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-sm text-white/80 overflow-x-auto">
              {`<CryptoGraphVisualization
  nodes={graphData.nodes}
  edges={graphData.edges}
  onNodeSelect={(node) => console.log(node)}
  height={600}
  showLegend={true}
  showControls={true}
/>`}
            </pre>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">
              4. Custom Node Data Format
            </h4>
            <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-sm text-white/80 overflow-x-auto">
              {`{
  nodes: [
    {
      id: "unique-id",
      label: "Display Name",
      type: "key" | "algorithm" | "protocol" | "storage" | "entity",
      ring: 0-3, // 0 = center, 3 = outer
      data: { /* custom properties */ }
    }
  ],
  edges: [
    {
      source: "source-node-id",
      target: "target-node-id",
      label: "relationship",
      weight: 1.0
    }
  ]
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraphDemoPage;
