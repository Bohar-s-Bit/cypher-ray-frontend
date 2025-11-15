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
import { analysisService } from "../services/analysisService";
import { ROUTES } from "../config/constants";

const AnalyzePage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

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
      } else {
        toast.success("Analysis started!");
      }

      // Redirect to result detail page
      navigate(`${ROUTES.RESULTS}/${jobId}`);
    },
    onError: (error) => {
      console.error("Analysis error:", error);
      toast.error(error.response?.data?.message || "Failed to analyze file");
    },
  });

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleStartAnalysis = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    analyzeMutation.mutate(selectedFile);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-white">
            Binary Analysis
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
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
        <CardHeader>
          <CardTitle>Upload Binary File</CardTitle>
          <CardDescription>
            Select a binary file to analyze. We support firmware, executables,
            and other binary formats.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload
            onFileSelect={handleFileSelect}
            accept=".bin,.elf,.hex,.out"
            maxSize={100 * 1024 * 1024}
            disabled={analyzeMutation.isPending}
          />

          {selectedFile && !analyzeMutation.isPending && (
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

          {analyzeMutation.isPending && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Spinner size="lg" />
              <div className="text-center">
                <p className="text-lg font-medium text-neutral-900 dark:text-white">
                  Uploading and queuing analysis...
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  You will be redirected to the results page
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyzePage;
