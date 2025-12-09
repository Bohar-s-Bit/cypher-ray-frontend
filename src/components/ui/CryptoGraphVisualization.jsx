import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import RadialGraph from "./RadialGraph";
import GraphControls from "./GraphControls";
import { cn } from "../../lib/utils";

/**
 * CryptoGraphVisualization Component
 * 
 * Complete graph visualization wrapper with controls and legend.
 * Use this as the primary component for graph visualization in your app.
 * 
 * @param {Object} props
 * @param {Array} props.nodes - Array of node objects
 * @param {Array} props.edges - Array of edge objects
 * @param {Function} props.onNodeSelect - Callback when a node is selected
 * @param {Number} props.height - Graph height (default: 600)
 * @param {Boolean} props.showLegend - Show node type legend (default: true)
 * @param {Boolean} props.showControls - Show control panel (default: true)
 */
const CryptoGraphVisualization = ({
  nodes = [],
  edges = [],
  onNodeSelect,
  height = 600,
  showLegend = true,
  showControls = true,
  className,
}) => {
  const graphRef = useRef();
  // Always use tree layout
  const layout = "force";

  // Memoize config to prevent unnecessary re-renders
  const config = React.useMemo(() => ({
    chargeStrength: -1500,
    linkDistance: 150,
    radialStrength: 0.1,
    showArrows: true,
  }), []);

  // Node type legend based on the data
  const nodeTypes = React.useMemo(() => {
    const types = new Set(nodes.map((n) => n.type || "default"));
    return Array.from(types).map((type) => ({
      type,
      color: {
        key: "#a855f7",
        algorithm: "#ec4899",
        protocol: "#8b5cf6",
        storage: "#6366f1",
        entity: "#06b6d4",
        default: "#64748b",
      }[type] || "#64748b",
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  }, [nodes]);

  // Control handlers
  const handleZoomIn = useCallback(() => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom * 1.3, 300);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom / 1.3, 300);
    }
  }, []);

  const handleFitView = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 50);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.centerAt(0, 0, 1000);
      graphRef.current.zoom(1, 1000);
    }
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      switch (e.key) {
        case "+":
        case "=":
          e.preventDefault();
          handleZoomIn();
          break;
        case "-":
          e.preventDefault();
          handleZoomOut();
          break;
        case "f":
        case "F":
          e.preventDefault();
          handleFitView();
          break;
        case "r":
        case "R":
          e.preventDefault();
          handleReset();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleZoomIn, handleZoomOut, handleFitView, handleReset]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("space-y-4", className)}
    >
      {/* Header with controls */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Cryptographic Entity Graph
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-white/60 mt-1"
          >
            {nodes.length} nodes • {edges.length} relationships
          </motion.p>
        </div>

        {showControls && (
          <GraphControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFitView={handleFitView}
            onReset={handleReset}
            // Layout switching disabled
            currentLayout={layout}
          />
        )}
      </motion.div>

      {/* Graph visualization */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 rounded-2xl blur-xl" />
        <RadialGraph
          ref={graphRef}
          nodes={nodes}
          edges={edges}
          height={height}
          layout={layout}
          onNodeSelect={onNodeSelect}
          config={config}
        />

        {/* Legend */}
        {showLegend && nodeTypes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-4 left-4 z-10"
          >
            <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-lg p-4 shadow-2xl">
              <p className="text-white text-xs font-semibold mb-3 uppercase tracking-wider">
                Node Types
              </p>
              <div className="space-y-2">
                {nodeTypes.map((type, index) => (
                  <motion.div 
                    key={type.type} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-2 group cursor-pointer hover:translate-x-1 transition-transform"
                  >
                    <div
                      className="w-3 h-3 rounded-full shadow-lg transition-shadow group-hover:shadow-xl"
                      style={{ 
                        backgroundColor: type.color,
                        boxShadow: `0 0 10px ${type.color}60`
                      }}
                    />
                    <span className="text-white/80 text-xs group-hover:text-white transition-colors">{type.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions overlay (shown when no nodes) */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-center max-w-md px-6">
              <h3 className="text-xl font-bold text-white mb-2">
                No Graph Data
              </h3>
              <p className="text-white/70 text-sm">
                Load cryptographic analysis results to visualize relationships
                between keys, algorithms, protocols, and storage locations.
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Interaction hints */}
      {nodes.length > 0 && (
        <div className="flex items-center justify-center gap-6 text-xs text-white/50">
          <span>Click node to select</span>
          <span>•</span>
          <span>Drag to pan</span>
          <span>•</span>
          <span>Scroll to zoom</span>
          <span>•</span>
          <span>Press F to fit view</span>
        </div>
      )}
    </motion.div>
  );
};

export default CryptoGraphVisualization;
