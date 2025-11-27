import React from 'react';
import { motion } from 'framer-motion';
import { Folder, HeartHandshake, Sparkles, Share2, Cpu, Brain, Bot, Terminal, Shield, FileCode } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility Function ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Helper Component for Top HTML Buttons ---
// This component handles the auto-sizing and centering logic
const TopBadge = ({ icon: Icon, text, leftPosition }) => {
  return (
    <div 
      className="absolute top-0 flex items-center justify-center -translate-x-1/2"
      style={{ left: leftPosition }}
    >
      <div className="flex items-center gap-4 px-8 py-4 bg-[#18181B] border border-white/10 rounded-full shadow-lg whitespace-nowrap z-10">
        <Icon className="w-6 h-6 text-purple-400" />
        <span className="text-sm sm:text-base font-medium text-gray-200">
          {text}
        </span>
      </div>
    </div>
  );
};

const DatabaseWithRestApi = ({
  className,
  circleText,
  badgeTexts,
  buttonTexts,
  title,
  lightColor,
}) => {
  return (
    <div
      className={cn(
        "relative flex h-[550px] md:h-[650px] w-full max-w-[1100px] flex-col items-center justify-end pb-16 md:pb-20",
        className
      )}
    >
      {/* --------------------------------------------------------------------
        LAYER 1: HTML BUTTONS (Auto-sizing & Centered)
        --------------------------------------------------------------------
        We position these using percentages to match the SVG line endpoints.
        This removes all manual width calculations.
      */}
      <div className="absolute top-[8%] w-full h-full max-w-[85%] mx-auto pointer-events-none">
        {/* Positions match SVG line ends:
           Line 1: 15%
           Line 2: 38% 
           Line 3: 62%
           Line 4: 85%
        */}
        <TopBadge icon={Brain} text={badgeTexts?.first || "CypherLLM"} leftPosition="15%" />
        <TopBadge icon={Bot} text={badgeTexts?.second || "Model 1"} leftPosition="38%" />
        <TopBadge icon={Cpu} text={badgeTexts?.third || "Model 2"} leftPosition="62%" />
        <TopBadge icon={Terminal} text={badgeTexts?.fourth || "SDK"} leftPosition="85%" />
      </div>


      {/* --------------------------------------------------------------------
        LAYER 2: SVG LINES & ANIMATION (Background)
        --------------------------------------------------------------------
        This layer handles the connecting lines and the light pulses.
      */}
      <svg
        className="absolute top-[8%] w-full h-full text-purple-500/30 max-w-[85%] mx-auto z-0"
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
      >
        <g
          stroke="currentColor"
          fill="none"
          strokeWidth="0.4"
          strokeDasharray="100 100"
          pathLength="100"
        >
          {/* PATHS: The 'M' (Start X) matches the % positions above.
            200 width * 0.15 = 30
            200 width * 0.38 = 76
            200 width * 0.62 = 124
            200 width * 0.85 = 170
          */}
          <path d="M 30 10 v 15 q 0 5 5 5 h 58 q 5 0 5 5 v 45" />
          <path d="M 76 10 v 10 q 0 5 5 5 h 12 q 5 0 5 5 v 45" />
          <path d="M 124 10 v 10 q 0 5 -5 5 h -14 q -5 0 -5 5 v 45" />
          <path d="M 170 10 v 15 q 0 5 -5 5 h -60 q -5 0 -5 5 v 45" />
          
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="1s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.25,0.1,0.5,1"
            keyTimes="0; 1"
          />
        </g>
        
        {/* Lights Definitions */}
        <defs>
          <mask id="db-mask-1"><path d="M 30 10 v 15 q 0 5 5 5 h 58 q 5 0 5 5 v 45" strokeWidth="0.5" stroke="white" /></mask>
          <mask id="db-mask-2"><path d="M 76 10 v 10 q 0 5 5 5 h 12 q 5 0 5 5 v 45" strokeWidth="0.5" stroke="white" /></mask>
          <mask id="db-mask-3"><path d="M 124 10 v 10 q 0 5 -5 5 h -14 q -5 0 -5 5 v 45" strokeWidth="0.5" stroke="white" /></mask>
          <mask id="db-mask-4"><path d="M 170 10 v 15 q 0 5 -5 5 h -60 q -5 0 -5 5 v 45" strokeWidth="0.5" stroke="white" /></mask>
          <radialGradient id="db-purple-grad" fx="1">
            <stop offset="0%" stopColor={lightColor || "#a855f7"} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Moving Lights */}
        <g mask="url(#db-mask-1)"><circle className="database db-light-1" cx="0" cy="0" r="12" fill="url(#db-purple-grad)" /></g>
        <g mask="url(#db-mask-2)"><circle className="database db-light-2" cx="0" cy="0" r="12" fill="url(#db-purple-grad)" /></g>
        <g mask="url(#db-mask-3)"><circle className="database db-light-3" cx="0" cy="0" r="12" fill="url(#db-purple-grad)" /></g>
        <g mask="url(#db-mask-4)"><circle className="database db-light-4" cx="0" cy="0" r="12" fill="url(#db-purple-grad)" /></g>
      </svg>
      
      {/* --------------------------------------------------------------------
        LAYER 3: BOTTOM COMPONENT (HTML)
        --------------------------------------------------------------------
      */}
      <div className="relative flex w-full flex-col items-center z-20">
        {/* Bottom shadow */}
        <div className="absolute -bottom-4 h-[100px] w-[62%] rounded-lg bg-purple-500/10" />
        
        {/* Box Title */}
        <div className="absolute -top-3 z-20 flex items-center justify-center rounded-lg border border-purple-500/20 bg-gray-950 px-3 py-1.5 shadow-xl">
          <Sparkles className="size-3 text-purple-400" />
          <span className="ml-2 text-[10px] font-medium text-gray-200">
            {title ? title : "Firmware Binary Analysis"}
          </span>
        </div>
        
        {/* Box Outer Circle */}
        <div className="absolute -bottom-8 z-30 grid h-[60px] w-[60px] place-items-center rounded-full border-t border-purple-500/30 bg-gray-900 font-semibold text-xs text-purple-200 shadow-xl">
          {circleText ? circleText : "AI"}
        </div>
        
        {/* Box Content - Badges Scattered */}
        <div className="relative z-10 flex h-[220px] w-full items-center justify-center overflow-hidden rounded-xl border border-purple-500/20 bg-gray-950/80 backdrop-blur-sm shadow-2xl">
          
          {/* Badge 1: Encryption */}
          <div className="absolute bottom-[15%] left-[15%] z-10 h-7 rounded-full bg-purple-900/20 px-3 text-xs border border-purple-500/30 flex items-center gap-2">
            <HeartHandshake className="size-4 text-purple-400" />
            <span className="text-purple-200 font-medium whitespace-nowrap">{buttonTexts?.first || "Encryption"}</span>
          </div>

          {/* Badge 2: Cryptography */}
          <div className="absolute bottom-[15%] right-[15%] z-10 hidden sm:flex h-7 rounded-full bg-purple-900/20 px-3 text-xs border border-purple-500/30 items-center gap-2">
            <Folder className="size-4 text-purple-400" />
            <span className="text-purple-200 font-medium whitespace-nowrap">{buttonTexts?.second || "Cryptography"}</span>
          </div>

          {/* Badge 3: Homologs */}
          <div className="absolute top-[15%] left-[8%] z-10 hidden sm:flex h-7 rounded-full bg-purple-900/20 px-3 text-xs border border-purple-500/30 items-center gap-2">
            <Share2 className="size-4 text-purple-400" />
            <span className="text-purple-200 font-medium whitespace-nowrap">{buttonTexts?.third || "Homologs"}</span>
          </div>

          {/* Badge 4: Algorithms */}
          <div className="absolute top-[15%] right-[8%] z-10 hidden sm:flex h-7 rounded-full bg-purple-900/20 px-3 text-xs border border-purple-500/30 items-center gap-2">
            <Cpu className="size-4 text-purple-400" />
            <span className="text-purple-200 font-medium whitespace-nowrap">{buttonTexts?.fourth || "Algorithms"}</span>
          </div>

          {/* Badge 5: Security */}
          <div className="absolute top-[45%] left-[4%] z-10 hidden sm:flex h-7 rounded-full bg-purple-900/20 px-3 text-xs border border-purple-500/30 items-center gap-2">
            <Shield className="size-4 text-purple-400" />
            <span className="text-purple-200 font-medium whitespace-nowrap">{buttonTexts?.fifth || "Security"}</span>
          </div>

          {/* Badge 6: Source Code */}
          <div className="absolute top-[45%] right-[4%] z-10 hidden sm:flex h-7 rounded-full bg-purple-900/20 px-3 text-xs border border-purple-500/30 items-center gap-2">
            <FileCode className="size-4 text-purple-400" />
            <span className="text-purple-200 font-medium whitespace-nowrap">{buttonTexts?.sixth || "Source Code"}</span>
          </div>
          
          {/* Ripples */}
          <motion.div
            className="absolute -bottom-14 h-[100px] w-[100px] rounded-full border-t border-purple-500/20 bg-purple-500/5"
            animate={{ scale: [0.98, 1.02, 0.98, 1, 1, 1, 1, 1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 h-[145px] w-[145px] rounded-full border-t border-purple-500/20 bg-purple-500/5"
            animate={{ scale: [1, 1, 1, 0.98, 1.02, 0.98, 1, 1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-[100px] h-[190px] w-[190px] rounded-full border-t border-purple-500/20 bg-purple-500/5"
            animate={{ scale: [1, 1, 1, 1, 1, 0.98, 1.02, 0.98, 1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-[120px] h-[235px] w-[235px] rounded-full border-t border-purple-500/20 bg-purple-500/5"
            animate={{ scale: [1, 1, 1, 1, 1, 1, 0.98, 1.02, 0.98, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
      
      {/* ANIMATION STYLES 
         These must match the new "Cleaner" path coordinates exactly 
      */}
      <style>
        {`
          .database {
            offset-anchor: 10px 0px;
            animation: database-animation-path;
            animation-iteration-count: infinite;
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
            animation-duration: 4s;
            animation-delay: 1s;
          }
          /* Updated offset paths to match the structured SVG paths */
          .db-light-1 { offset-path: path("M 30 10 v 15 q 0 5 5 5 h 58 q 5 0 5 5 v 45"); }
          .db-light-2 { offset-path: path("M 76 10 v 10 q 0 5 5 5 h 12 q 5 0 5 5 v 45"); }
          .db-light-3 { offset-path: path("M 124 10 v 10 q 0 5 -5 5 h -14 q -5 0 -5 5 v 45"); }
          .db-light-4 { offset-path: path("M 170 10 v 15 q 0 5 -5 5 h -60 q -5 0 -5 5 v 45"); }
          
          @keyframes database-animation-path {
            0% { offset-distance: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { offset-distance: 100%; opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default DatabaseWithRestApi;