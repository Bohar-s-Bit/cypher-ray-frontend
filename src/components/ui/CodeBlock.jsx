import React from "react";
import { cn } from "../../lib/utils";
import CopyButton from "./CopyButton";

const CodeBlock = ({ code, language = "bash", className, title }) => {
  return (
    <div className={cn("relative group", className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-black/30 backdrop-blur-sm border-b border-white/10 rounded-t-lg">
          <span className="text-xs font-medium text-white/70">{title}</span>
          <span className="text-xs text-white/50">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre
          className={cn(
            "p-4 overflow-x-auto bg-black/40 backdrop-blur-sm text-sm border border-white/10",
            title ? "" : "rounded-t-lg",
            "rounded-b-lg"
          )}
        >
          <code className="text-white/90 font-mono">{code}</code>
        </pre>
        <div className="absolute top-2 right-2">
          <CopyButton text={code} size="sm" />
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;

