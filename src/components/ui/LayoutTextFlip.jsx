"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export const LayoutTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [duration, words.length]);

  return (
    <>
      <motion.span
        layoutId="subtext"
        className="text-5xl md:text-7xl font-display font-bold tracking-tight drop-shadow-lg bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent whitespace-nowrap"
      >
        {text}
      </motion.span>

      <motion.span
        layout
        className="relative w-fit overflow-hidden rounded-2xl border border-purple-400/40 bg-gradient-to-r from-purple-600/30 to-purple-500/30 backdrop-blur-md px-6 py-3 font-display text-5xl md:text-7xl font-bold tracking-tight shadow-lg shadow-purple-500/30 ring-2 ring-purple-400/30 drop-shadow-lg whitespace-nowrap"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -40, filter: "blur(10px)" }}
            animate={{
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
            transition={{
              duration: 0.5,
            }}
            className={cn("inline-block whitespace-nowrap bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent")}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
};
