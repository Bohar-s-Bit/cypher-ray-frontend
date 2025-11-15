import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  FileText,
  TrendingUp,
  Code,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import { analysisService } from "../services/analysisService";
import { QUERY_KEYS, ROUTES } from "../config/constants";
import { format } from "date-fns";

const ResultDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // Fetch job result
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.ANALYSIS_JOB, jobId],
    queryFn: () => analysisService.getJobResult(jobId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data?.data?.job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          Result Not Found
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          The analysis result you're looking for doesn't exist or has been
          deleted.
        </p>
        <Button onClick={() => navigate(ROUTES.RESULTS)}>
          Back to Results
        </Button>
      </div>
    );
  }

  const job = data.data.job;
  const results = job.results;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.RESULTS)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-white">
          {job.filename}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Analyzed on{" "}
          {format(new Date(job.createdAt), "MMMM dd, yyyy 'at' HH:mm")}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg ${
                  results?.vulnerability_assessment?.has_vulnerabilities
                    ? "bg-error-50 dark:bg-error-900/20"
                    : "bg-success-50 dark:bg-success-900/20"
                }`}
              >
                {results?.vulnerability_assessment?.has_vulnerabilities ? (
                  <AlertTriangle className="w-6 h-6 text-error-600 dark:text-error-400" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Status
                </p>
                <p className="text-lg font-bold text-neutral-900 dark:text-white">
                  {results?.vulnerability_assessment?.has_vulnerabilities
                    ? "Vulnerabilities Found"
                    : "Secure"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg ${
                  results?.vulnerability_assessment?.severity === "High"
                    ? "bg-error-50 dark:bg-error-900/20"
                    : results?.vulnerability_assessment?.severity === "Medium"
                    ? "bg-warning-50 dark:bg-warning-900/20"
                    : "bg-success-50 dark:bg-success-900/20"
                }`}
              >
                <Shield
                  className={`w-6 h-6 ${
                    results?.vulnerability_assessment?.severity === "High"
                      ? "text-error-600 dark:text-error-400"
                      : results?.vulnerability_assessment?.severity === "Medium"
                      ? "text-warning-600 dark:text-warning-400"
                      : "text-success-600 dark:text-success-400"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Severity
                </p>
                <p className="text-lg font-bold text-neutral-900 dark:text-white">
                  {results?.vulnerability_assessment?.severity || "Low"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary-50 dark:bg-secondary-900/20">
                <Clock className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Processing Time
                </p>
                <p className="text-lg font-bold text-neutral-900 dark:text-white">
                  {job.completedAt && job.startedAt
                    ? `${Math.round(
                        (new Date(job.completedAt) - new Date(job.startedAt)) /
                          1000
                      )}s`
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Metadata */}
      {results?.file_metadata && (
        <Card>
          <CardHeader>
            <CardTitle>File Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  File Type
                </p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {results.file_metadata.file_type || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Size
                </p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {(results.file_metadata.size_bytes / 1024).toFixed(2)} KB
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  MD5
                </p>
                <p className="font-mono text-xs text-neutral-900 dark:text-white break-all">
                  {results.file_metadata.md5}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  SHA-256
                </p>
                <p className="font-mono text-xs text-neutral-900 dark:text-white break-all">
                  {results.file_metadata.sha256}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Security Analysis</CardTitle>
          <CardDescription>
            Detailed cryptographic security assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Vulnerabilities */}
          {results?.vulnerability_assessment?.vulnerabilities &&
            results.vulnerability_assessment.vulnerabilities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Vulnerabilities Detected (
                  {results.vulnerability_assessment.vulnerabilities.length})
                </h3>
                <div className="space-y-3">
                  {results.vulnerability_assessment.vulnerabilities.map(
                    (vuln, index) => (
                      <div
                        key={index}
                        className="p-4 border border-error-200 dark:border-error-800 rounded-lg bg-error-50 dark:bg-error-900/10"
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-error-700 dark:text-error-300">
                            {vuln}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Overall Assessment */}
          {results?.overall_assessment && (
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                Overall Assessment
              </h3>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                  {results.overall_assessment}
                </p>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {results?.vulnerability_assessment?.recommendations &&
            results.vulnerability_assessment.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                  Security Recommendations
                </h3>
                <ul className="space-y-2">
                  {results.vulnerability_assessment.recommendations.map(
                    (rec, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300"
                      >
                        <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          {/* Detected Algorithms */}
          {results?.detected_algorithms &&
            results.detected_algorithms.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                  Detected Cryptographic Algorithms
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.detected_algorithms.map((algo, index) => (
                    <div
                      key={index}
                      className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                          <Code className="w-4 h-4" />
                          {algo.algorithm_name}
                        </h4>
                        <Badge variant="secondary" size="sm">
                          {Math.round(algo.confidence_score * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {algo.algorithm_class}
                      </p>
                      {algo.structural_signature && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                          Pattern: {algo.structural_signature}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Function Analyses */}
          {results?.function_analyses &&
            results.function_analyses.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                  Function Analysis
                </h3>
                <div className="space-y-3">
                  {results.function_analyses.map((func, index) => (
                    <div
                      key={index}
                      className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-mono text-sm font-medium text-neutral-900 dark:text-white">
                          {func.function_name}
                        </h4>
                        <div className="flex items-center gap-2">
                          {func.is_crypto && (
                            <Badge variant="primary" size="sm">
                              Cryptographic
                            </Badge>
                          )}
                          <Badge variant="secondary" size="sm">
                            {Math.round(func.confidence_score * 100)}%
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
                        {func.function_summary}
                      </p>
                      {func.semantic_tags && func.semantic_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {func.semantic_tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* XAI Explanation */}
          {results?.xai_explanation && (
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                AI Analysis Explanation
              </h3>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                  {results.xai_explanation}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => navigate(ROUTES.RESULTS)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
        <Button onClick={() => navigate(ROUTES.ANALYZE)}>
          <FileText className="w-4 h-4 mr-2" />
          Analyze Another File
        </Button>
      </div>
    </div>
  );
};

export default ResultDetailPage;
