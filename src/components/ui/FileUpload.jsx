import React, { useRef, useState } from "react";
import { Upload, File, X } from "lucide-react";
import { cn } from "../../lib/utils";
import Button from "./Button";

const FileUpload = ({
  onFileSelect,
  accept = "*",
  maxSize = 100 * 1024 * 1024, // 100MB default
  className,
  disabled = false,
}) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    if (file.size > maxSize) {
      setError(
        `File size must be less than ${(maxSize / (1024 * 1024)).toFixed(0)}MB`
      );
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileSelect(null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {!selectedFile ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
            dragActive
              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
              : "border-neutral-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-500 bg-neutral-50 dark:bg-neutral-800/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                dragActive
                  ? "bg-primary-100 dark:bg-primary-900/30"
                  : "bg-neutral-100 dark:bg-neutral-700"
              )}
            >
              <Upload
                className={cn(
                  "w-8 h-8",
                  dragActive
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-neutral-400 dark:text-neutral-500"
                )}
              />
            </div>
            <div>
              <p className="text-lg font-medium text-neutral-900 dark:text-white mb-1">
                Drop your binary file here
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                or click to browse
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                Maximum file size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-neutral-300 dark:border-neutral-600 rounded-xl p-6 bg-white dark:bg-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <File className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 dark:text-white truncate">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              disabled={disabled}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-error-600 dark:text-error-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
