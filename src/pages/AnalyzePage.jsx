import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Search, List } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import FileUpload from "../components/ui/FileUpload";
import Spinner from "../components/ui/Spinner";
import { MultiStepLoader } from "../components/ui/MultiStepLoader";
import { analysisService } from "../services/analysisService";
import { useAnalysis } from "../contexts/AnalysisContext";
import { ROUTES } from "../config/constants";

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
  const { startMonitoring, getActiveJob } = useAnalysis();

  // Check if there's any active analysis
  const currentJob = getActiveJob();
  const hasActiveAnalysis = !!currentJob;

  // Determine loader step based on analysis status
  const getLoaderStep = () => {
    if (analyzeMutation.isPending) {
      return 0; // Uploading binary file
    }
    if (!currentJob) {
      return 0;
    }
    
    switch (currentJob.status) {
      case 'queued':
        return 2; // Analyzing file structure
      case 'processing':
        return 5; // Analyzing dependencies
      case 'completed':
        return 7; // Finalizing analysis
      default:
        return 0;
    }
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
        // Start monitoring the job globally with auto-redirect
        startMonitoring(jobId, "queued", (completedJobId, status) => {
          // Auto-redirect to results page when analysis completes
          navigate(`${ROUTES.RESULTS}/${completedJobId}`);
        });
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl -z-10"></div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-3">
            Binary Analysis
          </h1>
          <p className="text-white/70 text-lg">
            Upload a binary file to analyze for security vulnerabilities
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(ROUTES.RESULTS)}>
          <List className="w-4 h-4 mr-2" />
          View History
        </Button>
      </div>

      {/* Upload Section */}
     <Card>
        {isAnalyzing ? (
          // --- ANALYSIS IN PROGRESS ---
          // This content is shown when isAnalyzing is true
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Spinner size="lg" />
              <div className="text-center">
                <p className="text-lg font-medium text-white">
                  {getAnalysisStatusText()}
                </p>
                <p className="text-sm text-white/70 mt-1">
                  {hasActiveAnalysis
                    ? "You can navigate freely while analysis is in progress."
                    : "Analysis will start shortly"}
                </p>
                {hasActiveAnalysis && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(ROUTES.RESULTS)}
                    className="mt-4"
                  >
                    View Results
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        ) : (
          // --- READY TO UPLOAD ---
          // This content is shown when isAnalyzing is false
          <>
            <CardContent className="space-y-6">
              <FileUpload
                onChange={handleFileSelect}
                accept=".bin,.elf,.hex,.out"
                maxSize={100 * 1024 * 1024}
              />

              {selectedFile && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleStartAnalysis}
                    size="lg"
                    disabled={!selectedFile}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Start Analysis
                  </Button>
                </div>
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


