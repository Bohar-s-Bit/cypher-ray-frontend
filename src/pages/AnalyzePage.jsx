import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Search, List, Shield, Zap, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import BookmarkButton from "../components/ui/BookmarkButton";
import FileUpload from "../components/ui/FileUpload";
import Spinner from "../components/ui/Spinner";
import { MultiStepLoader } from "../components/ui/MultiStepLoader";
import { analysisService } from "../services/analysisService";
import { useAnalysis } from "../contexts/AnalysisContext";
import { ROUTES } from "../config/constants";
import { motion } from "framer-motion";

const loadingStates = [
  { text: "Uploading binary file..." },
  { text: "Extracting firmware image..." },
  { text: "Analyzing file structure..." },
  { text: "Scanning for vulnerabilities..." },
  { text: "Detecting security issues..." },
  { text: "Analyzing dependencies..." },
  { text: "Generating security report..." },
  { text: "Finalizing analysis..." },
];

const AnalyzePage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStartTime, setUploadStartTime] = useState(null);
  const { startMonitoring, getActiveJob } = useAnalysis();

  // Check if there's any active analysis
  const currentJob = getActiveJob();
  const hasActiveAnalysis = !!currentJob;

  // Calculate estimated duration based on file size (in milliseconds)
  const getEstimatedDuration = (fileSize) => {
    if (!fileSize) return 30000; // Default 30 seconds
    
    const sizeInMB = fileSize / (1024 * 1024);
    
    // Small files (< 5MB): 20-30s
    if (sizeInMB < 5) return 25000;
    // Medium files (5-20MB): 30-45s
    if (sizeInMB < 20) return 37000;
    // Large files (20-50MB): 45-60s
    if (sizeInMB < 50) return 52000;
    // Very large files (50MB+): 60-90s
    return 75000;
  };

  // Determine loader step based on time-based simulation
  const getLoaderStep = () => {
    // If upload is pending, show first step
    if (analyzeMutation.isPending) {
      if (!uploadStartTime) {
        setUploadStartTime(Date.now());
      }
      // Spend 2-3 seconds on upload step
      const uploadElapsed = uploadStartTime ? Date.now() - uploadStartTime : 0;
      return uploadElapsed < 2500 ? 0 : 1;
    }
    
    if (!currentJob || !currentJob.analysisStartTime) {
      return 0;
    }

    const elapsed = Date.now() - currentJob.analysisStartTime;
    const estimatedDuration = getEstimatedDuration(currentJob.fileSize || selectedFile?.size);
    
    // If analysis is complete, show final step
    if (currentJob.status === 'completed' || currentJob.status === 'failed') {
      return loadingStates.length - 1;
    }
    
    // Calculate progress ratio (0 to 1)
    // Cap at 0.85 to prevent reaching last step prematurely
    const progressRatio = Math.min(elapsed / estimatedDuration, 0.85);
    
    // Map progress to step (0 to length-2, reserving last step for completion)
    const maxStep = loadingStates.length - 2; // Reserve last step
    let calculatedStep = Math.floor(progressRatio * (maxStep + 1));
    
    // If we've exceeded estimated time, stay on second-to-last step
    if (elapsed > estimatedDuration) {
      calculatedStep = maxStep;
    }
    
    // Ensure we're at least on step 2 after upload completes
    const minStep = 2;
    return Math.max(minStep, Math.min(calculatedStep, maxStep));
  };

  // Analyze file mutation
  const analyzeMutation = useMutation({
    mutationFn: analysisService.analyzeFile,
    onSuccess: (response) => {
      // Backend returns: { success, cached, data: { job: { jobId, ... } } }
      const jobId = response?.data?.job?.jobId;

      if (!jobId) {
        console.error("No jobId in response:", response);
        toast.error("Failed to start analysis - no job ID received");
        return;
      }

      if (response.cached) {
        toast.success("Analysis result loaded from cache!");
        // If cached, redirect immediately
        navigate(`${ROUTES.RESULTS}/${jobId}`);
      } else {
        toast.success("Analysis started!");
        // Reset upload timer
        setUploadStartTime(null);
        // Start monitoring the job globally with auto-redirect
        startMonitoring(jobId, "queued", (completedJobId, status) => {
          // Auto-redirect to results page when analysis completes
          navigate(`${ROUTES.RESULTS}/${completedJobId}`);
        }, selectedFile?.size);
        // Clear selected file since analysis has started
        setSelectedFile(null);
      }
    },
    onError: (error) => {
      console.error("Analysis error:", error);
      toast.error(error.response?.data?.message || "Failed to analyze file");
    },
  });

  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleStartAnalysis = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    analyzeMutation.mutate(selectedFile);
  };

  const getAnalysisStatusText = () => {
    if (analyzeMutation.isPending) {
      return "Uploading and queuing analysis...";
    }

    if (hasActiveAnalysis) {
      switch (currentJob.status) {
        case "queued":
          return "Analysis queued...";
        case "processing":
          return "Analyzing binary file...";
        default:
          return "Analysis in progress...";
      }
    }

    return "Ready to analyze";
  };

  const isAnalyzing = analyzeMutation.isPending || hasActiveAnalysis;

  return (
    <>
      {/* Multi-Step Loader - Shows during analysis with real-time progress */}
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={isAnalyzing}
        currentStep={getLoaderStep()}
        loop={false}
      />

      <div className="space-y-8 min-h-screen">
        {/* Header with animated gradient */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 blur-3xl -z-10 animate-pulse"></div>
            <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-3">
              Binary Analysis
            </h1>
            <p className="text-white/70 text-lg">
              Upload a binary file to analyze for security vulnerabilities and cryptographic implementations
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(ROUTES.RESULTS)}>
            <List className="w-4 h-4 mr-2" />
            View History
          </Button>
        </div>

        {/* Feature Cards */}
        {!isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Vulnerability Detection</h3>
                  <p className="text-sm text-white/60">Identify security flaws and potential exploits</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Lock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Crypto Analysis</h3>
                  <p className="text-sm text-white/60">Detect encryption algorithms and key patterns</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Fast Processing</h3>
                  <p className="text-sm text-white/60">Results in minutes with ML-powered analysis</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Upload Section */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
          {isAnalyzing ? (
            // --- ANALYSIS IN PROGRESS ---
            <CardContent>
              <div className="flex flex-col items-center justify-center py-16 space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-2xl animate-pulse"></div>
                  <Spinner size="lg" className="relative" />
                </div>
                <div className="text-center max-w-md">
                  <p className="text-xl font-semibold text-white mb-2">
                    {getAnalysisStatusText()}
                  </p>
                  <p className="text-sm text-white/70">
                    {hasActiveAnalysis
                      ? "You can navigate freely while analysis is in progress. We'll notify you when it's complete."
                      : "Preparing your analysis..."}
                  </p>
                  {hasActiveAnalysis && (
                    <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <div className="flex items-center justify-center gap-2 text-purple-400 mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Analysis Running</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(ROUTES.RESULTS)}
                        className="mt-2"
                      >
                        View Results Dashboard
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          ) : (
            // --- READY TO UPLOAD ---
            <>
              <CardContent className="space-y-6 relative">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
                    <AlertTriangle className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-300">Supported: All executable files (max 100MB)</span>
                  </div>
                </div>

                <FileUpload
                  onChange={handleFileSelect}
                  maxSize={100 * 1024 * 1024}
                />

                {selectedFile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center mt-6"
                  >
                    <BookmarkButton
                      onClick={handleStartAnalysis}
                      text="Start Analysis"
                      icon={Search}
                      width="220px"
                      height="55px"
                      iconSize="45px"
                      fontSize="1.1em"
                    />
                  </motion.div>
                )}
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default AnalyzePage;