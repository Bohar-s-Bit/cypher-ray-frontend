import React from "react";
import { cn } from "../../lib/utils";
import CopyButton from "./CopyButton";

const CodeBlock = ({ code, language = "bash", className, title }) => {
  return (
    <div className={cn("relative group", className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 dark:bg-neutral-900 border-b border-neutral-700 rounded-t-lg">
          <span className="text-xs font-medium text-neutral-400">{title}</span>
          <span className="text-xs text-neutral-500">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre
          className={cn(
            "p-4 overflow-x-auto bg-neutral-900 dark:bg-neutral-950 text-sm",
            title ? "" : "rounded-t-lg",
            "rounded-b-lg"
          )}
        >
          <code className="text-neutral-100 font-mono">{code}</code>
        </pre>
        <div className="absolute top-2 right-2">
          <CopyButton text={code} size="sm" />
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
