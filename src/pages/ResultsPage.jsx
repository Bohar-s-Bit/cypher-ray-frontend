import React, { useState, useEffect } from "react";
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
import { useAnalysis } from "../contexts/AnalysisContext";
import { QUERY_KEYS, ROUTES } from "../config/constants";
import { format } from "date-fns";
import {
  ResizableTableContainer,
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
} from "../components/ui/Table";

const ResultsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // all, completed, processing, failed
  const { hasActiveJobs } = useAnalysis();

  // Fetch user's analysis history with auto-refresh and force refresh on page load
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [QUERY_KEYS.ANALYSIS_HISTORY],
    queryFn: () => analysisService.getAnalysisHistory({ page: 1, limit: 20 }),
    refetchInterval: hasActiveJobs ? 3000 : false, // Refresh every 3 seconds if there are active jobs
    refetchIntervalInBackground: true, // Continue refreshing even when tab is not active
    refetchOnWindowFocus: true, // Refresh when user returns to tab
    staleTime: 0, // Always consider data stale to ensure fresh data
  });

  // Force refresh data whenever the component mounts or becomes visible
  useEffect(() => {
    // Immediately refetch when the component mounts to ensure fresh data
    window.scrollTo(0, 0);
    refetch();
  }, [refetch]);

  // Also refetch when there are no active jobs (indicating a job just completed)
  useEffect(() => {
    if (!hasActiveJobs) {
      // Small delay to ensure backend has processed the completion
      const timer = setTimeout(() => {
        refetch();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasActiveJobs, refetch]);

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
      case "critical":
        return (
          <Badge variant="error" size="sm">
            Critical
          </Badge>
        );
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
      case "none":
      case "clean":
        return (
          <Badge variant="success" size="sm">
            Clean
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

  const getRiskScoreColor = (score) => {
    if (score >= 8) return "text-red-400";
    if (score >= 5) return "text-orange-400";
    if (score >= 3) return "text-yellow-400";
    if (score >= 1) return "text-green-400";
    return "text-emerald-400";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-emerald-500/10 blur-3xl -z-10"></div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-white via-purple-200 to-emerald-200 bg-clip-text text-transparent">
              Analysis Results
            </h1>
            {(hasActiveJobs && isFetching) && (
              <div className="flex items-center gap-1.5 text-sm text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
                <Spinner size="sm" />
                <span>Updating...</span>
              </div>
            )}
            {(!hasActiveJobs && isFetching) && (
              <div className="flex items-center gap-1.5 text-sm text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                <Spinner size="sm" />
                <span>Refreshing...</span>
              </div>
            )}
          </div>
          <p className="text-white/70 text-lg">
            View your analysis history and detailed results
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.ANALYZE)}>New Analysis</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Filter:
            </span>
            <div className="flex gap-2">
              {["all", "completed", "processing", "queued", "failed"].map((f) => (
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
            <h3 className="text-xl font-semibold text-white mb-2">
              No Results Found
            </h3>
            <p className="text-white/70 mb-6">
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
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              {filteredJobs.length} {filteredJobs.length === 1 ? 'result' : 'results'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border border-purple-500/20 bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-sm">
              <ResizableTableContainer>
                <Table aria-label="Analysis results table" className="w-full">
                  <TableHeader>
                    <Column isRowHeader className="text-white/90 text-sm font-semibold">Filename</Column>
                    <Column className="text-white/90 text-sm font-semibold">Status</Column>
                    <Column className="text-white/90 text-sm font-semibold">Date</Column>
                    <Column className="text-white/90 text-sm font-semibold">Risk Score</Column>
                    <Column className="text-white/90 text-sm font-semibold">Severity</Column>
                    <Column className="text-white/90 text-sm font-semibold">Actions</Column>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <Row key={job.jobId} className="border-white/10 hover:bg-neutral-800/50">
                        <Cell className="font-medium text-white text-sm">
                          {job.filename}
                        </Cell>
                        <Cell>
                          {getStatusBadge(job.status)}
                        </Cell>
                        <Cell className="text-white/70 text-sm">
                          {format(
                            new Date(job.createdAt),
                            "MMM dd, yyyy HH:mm"
                          )}
                        </Cell>
                        <Cell>
                          {job.status === "completed" && job.malScore != null ? (
                            <div className="flex items-center gap-2">
                              <span className={`font-bold text-sm ${getRiskScoreColor(job.malScore)}`}>
                                {job.malScore}/10
                              </span>
                              {job.riskLevel && (
                                <Badge variant={job.riskLevel === "Clean" ? "success" : job.riskLevel === "Low" ? "success" : job.riskLevel === "Medium" ? "warning" : "error"} size="sm">
                                  {job.riskLevel}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-white/50 text-sm">—</span>
                          )}
                        </Cell>
                        <Cell>
                          {job.status === "completed" && job.severity
                            ? getSeverityBadge(job.severity)
                            : <span className="text-white/50 text-sm">—</span>
                          }
                        </Cell>
                        <Cell>
                          {job.status === "completed" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`${ROUTES.RESULTS}/${job.jobId}`)
                              }
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          ) : (
                            <span className="text-white/50 text-sm">—</span>
                          )}
                        </Cell>
                      </Row>
                    ))}
                  </TableBody>
                </Table>
              </ResizableTableContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsPage;


