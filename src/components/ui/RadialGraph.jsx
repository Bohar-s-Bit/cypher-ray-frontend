import React, { useCallback, useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from "d3-force";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { cn } from "../../lib/utils";

/**
 * RadialGraph Component
 * 
 * Interactive force-directed graph visualization with radial layout.
 * Designed for visualizing cryptographic entities and their relationships.
 * 
 * @param {Object} props
 * @param {Array} props.nodes - Array of node objects: { id, label, type, ring?, data? }
 * @param {Array} props.edges - Array of edge objects: { source, target, label?, weight? }
 * @param {Function} props.onNodeSelect - Callback when a node is clicked
 * @param {Function} props.onNodeHover - Callback when hovering over a node
 * @param {Number} props.width - Graph width (defaults to container width)
 * @param {Number} props.height - Graph height (defaults to 600)
 * @param {Object} props.config - Additional configuration options
 */
const RadialGraph = forwardRef(({
  nodes = [],
  edges = [],
  onNodeSelect,
  onNodeHover,
  width,
  height = 600,
  config = {},
  className,
}, ref) => {
  const graphRef = useRef();
  
  // Expose graph instance to parent via ref
  useImperativeHandle(ref, () => graphRef.current);

  const containerRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: width || 800, height });

  // Node type color mapping - matches your purple theme
  const NODE_COLORS = {
    key: "#a855f7",        // Purple-500
    algorithm: "#ec4899",  // Pink-500
    protocol: "#8b5cf6",   // Violet-500
    storage: "#6366f1",    // Indigo-500
    entity: "#06b6d4",     // Cyan-500
    default: "#64748b",    // Slate-500
  };

  // Node type size mapping (radius in pixels)
  const NODE_SIZES = {
    key: 8,
    algorithm: 10,
    protocol: 12,
    storage: 9,
    entity: 7,
    default: 6,
  };

  // Handle container resize with ResizeObserver
  useEffect(() => {
    if (!width && containerRef.current) {
      const updateDimensions = () => {
        const { width: containerWidth } = containerRef.current.getBoundingClientRect();
        if (containerWidth > 0) {
          setDimensions({ width: containerWidth, height });
        }
      };

      // Initial check
      updateDimensions();

      // Use ResizeObserver to detect size changes (including visibility changes)
      const resizeObserver = new ResizeObserver(() => {
        updateDimensions();
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [width, height]);

  // Transform input data and apply radial layout
  useEffect(() => {
    if (!nodes.length) return;

    // Clone nodes and edges to avoid mutating props
    const transformedNodes = nodes.map((node) => ({
      ...node,
      id: node.id,
      name: node.label || node.id,
      type: node.type || "default",
      ring: node.ring || 0, // Ring level for radial layout (0 = center)
      val: NODE_SIZES[node.type] || NODE_SIZES.default, // Size
      color: NODE_COLORS[node.type] || NODE_COLORS.default,
    }));

    const transformedLinks = edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      label: edge.label || "",
      weight: edge.weight || 1,
    }));

    setGraphData({
      nodes: transformedNodes,
      links: transformedLinks,
    });

    // Apply radial force layout after a brief delay to let the graph initialize
    setTimeout(() => {
      if (graphRef.current) {
        applyRadialLayout(transformedNodes);
      }
    }, 100);
  }, [nodes, edges]);

  /**
   * Apply radial/hierarchical layout based on node.ring property
   * Inner rings (lower ring numbers) are closer to center
   */
  const applyRadialLayout = (nodes) => {
    if (!graphRef.current) return;

    const fg = graphRef.current;
    
    // Get max ring level
    const maxRing = Math.max(...nodes.map((n) => n.ring || 0));
    const ringGap = Math.min(dimensions.width, dimensions.height) / (maxRing + 2) / 2;

    nodes.forEach((node) => {
      const ring = node.ring || 0;
      const radius = ring * ringGap;
      
      // Distribute nodes evenly around their ring
      const nodesInRing = nodes.filter((n) => n.ring === ring);
      const index = nodesInRing.findIndex((n) => n.id === node.id);
      const angle = (index / nodesInRing.length) * 2 * Math.PI;

      // Set initial positions
      node.fx = radius * Math.cos(angle);
      node.fy = radius * Math.sin(angle);
    });

    // Update the graph
    fg.d3Force("charge").strength(config.chargeStrength || -300);
    fg.d3Force("link").distance(config.linkDistance || 50);
    
    // Add radial force to maintain ring structure
    fg.d3Force(
      "radial",
      d3.forceRadial((node) => {
        const ring = node.ring || 0;
        return ring * ringGap;
      }, 0, 0).strength(config.radialStrength || 0.8)
    );

    // Reheat simulation
    fg.d3ReheatSimulation();
    
    // Release fixed positions after layout stabilizes
    setTimeout(() => {
      nodes.forEach((node) => {
        node.fx = undefined;
        node.fy = undefined;
      });
    }, 2000);
  };

  // Node click handler
  const handleNodeClick = useCallback(
    (node) => {
      setSelectedNode(node);
      if (onNodeSelect) {
        onNodeSelect(node);
      }
      
      // Center on clicked node
      if (graphRef.current) {
        graphRef.current.centerAt(node.x, node.y, 1000);
        graphRef.current.zoom(2, 1000);
      }
    },
    [onNodeSelect]
  );

  // Node hover handler
  const handleNodeHover = useCallback(
    (node) => {
      setHoveredNode(node);
      if (onNodeHover) {
        onNodeHover(node);
      }
    },
    [onNodeHover]
  );



  // Custom node rendering with enhanced effects
  const paintNode = useCallback(
    (node, ctx, globalScale) => {
      // Safety check for coordinates
      if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

      const size = node.val || 5;
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;
      const time = Date.now() / 1000;

      // Draw outer glow for selected/hovered nodes
      if (isSelected || isHovered) {
        const glowSize = isSelected ? size + 8 : size + 6;
        if (Number.isFinite(node.x) && Number.isFinite(node.y) && Number.isFinite(size) && Number.isFinite(glowSize)) {
          // Optimization: Use simple arc with transparency instead of gradient
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowSize, 0, 2 * Math.PI);
          ctx.fillStyle = isSelected ? "rgba(168, 85, 247, 0.2)" : "rgba(255, 255, 255, 0.1)";
          ctx.fill();
          
          // Inner glow ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowSize * 0.7, 0, 2 * Math.PI);
          ctx.fillStyle = isSelected ? "rgba(168, 85, 247, 0.2)" : "rgba(255, 255, 255, 0.1)";
          ctx.fill();
        }
      }

      // Draw pulsing selection ring
      if (isSelected) {
        const pulse = Math.sin(time * 3) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 6 * pulse, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(168, 85, 247, ${0.8 * pulse})`;
        ctx.lineWidth = 2 / globalScale;
        ctx.stroke();
      }

      // Draw hover ring with shimmer effect
      if (isHovered) {
        const shimmer = Math.sin(time * 4) * 0.2 + 0.8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 4, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 * shimmer})`;
        ctx.lineWidth = 2 / globalScale;
        ctx.stroke();
      }

      // Draw main node (Solid color optimization for performance)
      if (Number.isFinite(node.x) && Number.isFinite(node.y) && Number.isFinite(size)) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        // Add a simple highlight reflection (lighter top-left) to mimic 3D effect without expensive gradients
        ctx.beginPath();
        ctx.arc(node.x - size * 0.3, node.y - size * 0.3, size * 0.4, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fill();
      } else {
        // Fallback
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.fill();
      }

      // Draw subtle border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 0.5 / globalScale;
      ctx.stroke();

      // Draw label with background
      if (globalScale >= 1.5 || isHovered || isSelected) {
        const label = node.name || node.id;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        const labelY = node.y - size - 8;
        const textWidth = ctx.measureText(label).width;
        const padding = 4 / globalScale;
        
        // Label background
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(
          node.x - textWidth / 2 - padding,
          labelY - fontSize / 2 - padding,
          textWidth + padding * 2,
          fontSize + padding * 2
        );
        
        // Label text with glow
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 4;
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fillText(label, node.x, labelY);
        ctx.shadowBlur = 0;
      }
    },
    [selectedNode, hoveredNode]
  );

  // Custom link rendering with animated flow
  const paintLink = useCallback(
    (link, ctx, globalScale) => {
      const start = link.source;
      const end = link.target;
      const time = Date.now() / 1000;

      // Skip rendering if nodes don't have positions yet
      if (typeof start !== "object" || typeof end !== "object") return;
      if (!Number.isFinite(start.x) || !Number.isFinite(start.y) || !Number.isFinite(end.x) || !Number.isFinite(end.y)) return;

      // Highlight links connected to selected node
      const isConnected =
        selectedNode &&
        (start.id === selectedNode.id || end.id === selectedNode.id);

      const linkColor = isConnected
        ? "rgba(168, 85, 247, 0.8)"
        : "rgba(255, 255, 255, 0.2)";
      const linkWidth = (isConnected ? 2.5 : 1.2) / globalScale;

      // Draw glow for connected links
      if (isConnected) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
        ctx.lineWidth = (linkWidth + 4) / globalScale;
        ctx.stroke();
      }

      // Draw main line
      ctx.strokeStyle = linkColor;
      ctx.lineWidth = linkWidth;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // Draw animated particles on connected links
      if (isConnected) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        
        // Draw 3 particles flowing along the link
        for (let i = 0; i < 3; i++) {
          const offset = (time * 0.3 + i * 0.33) % 1;
          const px = start.x + dx * offset;
          const py = start.y + dy * offset;
          const radius = 3 / globalScale;
          
          if (Number.isFinite(px) && Number.isFinite(py) && Number.isFinite(radius)) {
            // Optimization: Solid circle instead of gradient
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(168, 85, 247, 0.8)"; // Solid purple
            ctx.fill();
          }
        }
      }

      // Draw arrow
      if (config.showArrows !== false) {
        const arrowLength = 8;
        const arrowWidth = 4;
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const arrowEnd = {
          x: end.x - (end.val || 5) * Math.cos(angle),
          y: end.y - (end.val || 5) * Math.sin(angle),
        };

        ctx.save();
        ctx.translate(arrowEnd.x, arrowEnd.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowLength, arrowWidth);
        ctx.lineTo(-arrowLength, -arrowWidth);
        ctx.closePath();
        ctx.fillStyle = linkColor;
        ctx.fill();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
        ctx.restore();
      }
    },
    [selectedNode, config.showArrows]
  );

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-2xl animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="relative w-full overflow-hidden rounded-2xl border border-purple-500/20 bg-black/60 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
        {graphData.nodes.length > 0 ? (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            nodeCanvasObject={paintNode}
            linkCanvasObject={paintLink}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            onBackgroundClick={() => {
              setSelectedNode(null);
              if (onNodeSelect) onNodeSelect(null);
            }}
            enableNodeDrag={true}
            enableZoomInteraction={true}
            enablePanInteraction={true}
            cooldownTicks={100}
            d3VelocityDecay={0.6}
            d3AlphaDecay={0.05}
            {...config.forceGraphProps}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/50">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No data to display</p>
              <p className="text-sm">Add nodes and edges to visualize the graph</p>
            </div>
          </div>
        )}
      </div>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 left-4 z-10 pointer-events-none"
          >
            <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: hoveredNode.color }}
                />
                <div>
                  <p className="text-white font-medium text-sm">
                    {hoveredNode.name}
                  </p>
                  <p className="text-white/60 text-xs capitalize">
                    {hoveredNode.type}
                  </p>
                </div>
              </div>
              {hoveredNode.data && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <p className="text-white/80 text-xs">
                    {hoveredNode.data.description || "No description"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Node Info */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 z-10 max-w-xs"
          >
            <div className="bg-black/90 backdrop-blur-md border border-purple-500/30 rounded-lg p-4 shadow-2xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedNode.color }}
                  />
                  <div>
                    <p className="text-white font-semibold text-base">
                      {selectedNode.name}
                    </p>
                    <p className="text-purple-300 text-xs capitalize">
                      {selectedNode.type}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    if (onNodeSelect) onNodeSelect(null);
                  }}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
              
              {selectedNode.data && (
                <div className="space-y-2">
                  {Object.entries(selectedNode.data).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-white/50 text-xs capitalize">{key}</p>
                      <p className="text-white text-sm">{String(value)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

RadialGraph.displayName = "RadialGraph";

export default RadialGraph;
