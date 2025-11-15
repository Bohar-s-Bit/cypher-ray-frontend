import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Calendar,
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

const ResultsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // all, completed, processing, failed

  // Fetch user's analysis history
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ANALYSIS_HISTORY],
    queryFn: () => analysisService.getAnalysisHistory({ page: 1, limit: 20 }),
  });

  const jobs = data?.data?.jobs || [];

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    if (filter === "all") return true;
    return job.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case "processing":
      case "queued":
        return <Clock className="w-5 h-5 text-warning-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-error-600" />;
      default:
        return <FileText className="w-5 h-5 text-neutral-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "processing":
        return <Badge variant="warning">Processing</Badge>;
      case "queued":
        return <Badge variant="secondary">Queued</Badge>;
      case "failed":
        return <Badge variant="error">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity) => {
    if (!severity) return null;

    switch (severity.toLowerCase()) {
      case "high":
        return (
          <Badge variant="error" size="sm">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="warning" size="sm">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="success" size="sm">
            Low
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" size="sm">
            {severity}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-white">
            Analysis Results
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            View your analysis history and detailed results
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.ANALYZE)}>New Analysis</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Filter:
            </span>
            <div className="flex gap-2">
              {["all", "completed", "processing", "failed"].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              No Results Found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {filter === "all"
                ? "You haven't analyzed any files yet."
                : `No ${filter} analyses found.`}
            </p>
            <Button onClick={() => navigate(ROUTES.ANALYZE)}>
              Start Your First Analysis
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <motion.div
              key={job.jobId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        {getStatusIcon(job.status)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            {job.filename}
                          </h3>
                          {getStatusBadge(job.status)}
                          {job.status === "completed" &&
                            job.severity &&
                            getSeverityBadge(job.severity)}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(
                                new Date(job.createdAt),
                                "MMM dd, yyyy 'at' HH:mm"
                              )}
                            </span>
                          </div>

                          {job.completedAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {Math.round(
                                  (new Date(job.completedAt) -
                                    new Date(job.createdAt)) /
                                    1000
                                )}
                                s
                              </span>
                            </div>
                          )}

                          {job.status === "completed" &&
                            job.hasVulnerabilities && (
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4 text-warning-600" />
                                <span>
                                  {job.vulnerabilityCount || 0} vulnerabilities
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      {job.status === "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`${ROUTES.RESULTS}/${job.jobId}`)
                          }
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
