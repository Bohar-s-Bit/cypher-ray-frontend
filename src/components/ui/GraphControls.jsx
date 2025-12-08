import React from "react";
import { motion } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Move,
  Grid3x3,
} from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * GraphControls Component
 * 
 * Control panel for graph interactions (zoom, pan, reset, layout)
 * 
 * @param {Object} props
 * @param {Function} props.onZoomIn - Zoom in callback
 * @param {Function} props.onZoomOut - Zoom out callback
 * @param {Function} props.onFitView - Fit graph to view callback
 * @param {Function} props.onReset - Reset graph callback
 * @param {Function} props.onLayoutChange - Change layout callback
 * @param {String} props.currentLayout - Current layout type
 * @param {Boolean} props.vertical - Vertical layout (default: false)
 */
const GraphControls = ({
  onZoomIn,
  onZoomOut,
  onFitView,
  onReset,
  onLayoutChange,
  currentLayout = "radial",
  vertical = false,
  className,
}) => {
  const controls = [
    {
      icon: ZoomIn,
      label: "Zoom In",
      action: onZoomIn,
      shortcut: "+",
    },
    {
      icon: ZoomOut,
      label: "Zoom Out",
      action: onZoomOut,
      shortcut: "-",
    },
    {
      icon: Maximize2,
      label: "Fit to View",
      action: onFitView,
      shortcut: "F",
    },
    {
      icon: RotateCcw,
      label: "Reset Graph",
      action: onReset,
      shortcut: "R",
    },
  ];

  const layouts = [
    { value: "radial", label: "Radial", icon: Grid3x3 },
    { value: "force", label: "Force", icon: Move },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex gap-2 bg-black/60 backdrop-blur-lg border border-white/10 rounded-xl p-2 shadow-xl",
        vertical ? "flex-col" : "flex-row items-center",
        className
      )}
    >
      {/* Layout selector */}
      {onLayoutChange && (
        <>
          <div
            className={cn(
              "flex gap-1 bg-white/5 rounded-lg p-1",
              vertical ? "flex-col" : "flex-row"
            )}
          >
            {layouts.map((layout) => {
              const Icon = layout.icon;
              const isActive = currentLayout === layout.value;
              return (
                <button
                  key={layout.value}
                  onClick={() => onLayoutChange(layout.value)}
                  className={cn(
                    "relative p-2 rounded-md transition-all duration-200",
                    "hover:bg-white/10",
                    isActive
                      ? "bg-purple-500/30 text-purple-300"
                      : "text-white/60 hover:text-white"
                  )}
                  title={layout.label}
                >
                  <Icon className="w-4 h-4" />
                  {isActive && (
                    <motion.div
                      layoutId="activeLayout"
                      className="absolute inset-0 bg-purple-500/20 rounded-md -z-10"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          {!vertical && (
            <div className="w-px h-8 bg-white/10" />
          )}
        </>
      )}

      {/* Control buttons */}
      <div
        className={cn(
          "flex gap-1",
          vertical ? "flex-col" : "flex-row"
        )}
      >
        {controls.map((control) => {
          const Icon = control.icon;
          if (!control.action) return null;
          
          return (
            <motion.button
              key={control.label}
              onClick={control.action}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative p-2 rounded-md transition-all duration-200",
                "text-white/60 hover:text-white hover:bg-white/10",
                "hover:shadow-lg hover:shadow-purple-500/50"
              )}
              title={`${control.label} ${control.shortcut ? `(${control.shortcut})` : ""}`}
            >
              <Icon className="w-4 h-4" />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default GraphControls;
