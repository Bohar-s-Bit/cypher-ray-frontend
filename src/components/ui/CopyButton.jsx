import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "../../lib/utils";

const CopyButton = ({ text, label, className, size = "md" }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(label ? `${label} copied!` : "Copied to clipboard!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <button
      onClick={copyToClipboard}
      className={cn(
        "rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors border border-white/10",
        sizeClasses[size],
        className
      )}
      title={label ? `Copy ${label}` : "Copy to clipboard"}
    >
      {copied ? (
        <Check
          className={cn("text-green-400", iconSizes[size])}
        />
      ) : (
        <Copy
          className={cn(
            "text-white/70",
            iconSizes[size]
          )}
        />
      )}
    </button>
  );
};

export default CopyButton;

