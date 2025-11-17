import React from "react";
import { cn } from "../../lib/utils";
import CopyButton from "./CopyButton";

// Language-specific color mappings for basic syntax highlighting
const getLanguageStyles = (language) => {
  const styles = {
    javascript: "language-javascript",
    python: "language-python",
    bash: "language-bash",
    curl: "language-bash",
    http: "language-http",
    json: "language-json",
  };
  return styles[language] || "language-text";
};

// Simple syntax highlighting for common patterns
const highlightCode = (code, language) => {
  if (!code) return "";
  
  let highlighted = code;
  
  // Common patterns across languages
  const patterns = {
    // Strings (single and double quotes)
    string: /(['"`])((?:\\.|[^\\])*?)\1/g,
    // Comments
    comment: /(\/\/.*|#.*|\/\*[\s\S]*?\*\/)/g,
    // Keywords (common programming keywords)
    keyword: /\b(const|let|var|function|class|if|else|return|import|from|export|async|await|def|class|for|while|True|False|None|null|undefined|require|module|exports)\b/g,
    // Numbers
    number: /\b(\d+\.?\d*)\b/g,
    // Functions/Methods
    function: /\b([a-zA-Z_][\w]*)\s*\(/g,
    // HTTP methods
    httpMethod: /\b(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\b/g,
  };

  // Apply highlighting in specific order to avoid conflicts
  const replacements = [];
  
  // Find all matches and their positions
  for (const [type, regex] of Object.entries(patterns)) {
    let match;
    while ((match = regex.exec(code)) !== null) {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        type: type
      });
    }
  }

  // Sort by position and create non-overlapping highlights
  replacements.sort((a, b) => a.start - b.start);
  
  let result = [];
  let lastIndex = 0;
  
  for (let i = 0; i < replacements.length; i++) {
    const curr = replacements[i];
    
    // Skip if overlapping with previous
    if (curr.start < lastIndex) continue;
    
    // Add text before this match
    if (curr.start > lastIndex) {
      result.push(code.substring(lastIndex, curr.start));
    }
    
    // Add highlighted text
    const colorClass = {
      string: 'text-green-400',
      comment: 'text-gray-500 italic',
      keyword: 'text-purple-400',
      number: 'text-cyan-400',
      function: 'text-yellow-400',
      httpMethod: 'text-pink-400 font-semibold',
    }[curr.type] || '';
    
    result.push(<span key={i} className={colorClass}>{curr.text}</span>);
    lastIndex = curr.end;
  }
  
  // Add remaining text
  if (lastIndex < code.length) {
    result.push(code.substring(lastIndex));
  }
  
  return result.length > 0 ? result : code;
};

const CodeBlock = ({ code, language = "bash", className, title }) => {
  const highlightedCode = highlightCode(code, language);
  
  return (
    <div className={cn("relative group", className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/60 backdrop-blur-sm border-b border-purple-500/20 rounded-t-lg">
          <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">{title}</span>
          <span className="text-xs text-purple-400 font-mono">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre
          className={cn(
            "p-4 overflow-x-auto bg-black/60 backdrop-blur-sm text-sm border border-purple-500/20",
            title ? "" : "rounded-t-lg",
            "rounded-b-lg font-mono leading-relaxed"
          )}
        >
          <code className="text-white/90">{highlightedCode}</code>
        </pre>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={code} size="sm" />
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;

