import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  Building2,
  MessageSquare,
  UserPlus,
  Trash2,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { adminService } from "../../services/adminService";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { QUERY_KEYS, ROUTES } from "../../config/constants";
import { cn } from "../../lib/utils";

const AccessRequestsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 10,
  });

  // Fetch access requests
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.ACCESS_REQUESTS, filters],
    queryFn: () => adminService.getAccessRequests(filters),
    retry: false,
    staleTime: 0,
    cacheTime: 0,
  });

  const requests = data?.data?.requests || [];
  const pagination = data?.data?.pagination || {};

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleApprove = (request) => {
    // Navigate to create user page with pre-filled data
    navigate(ROUTES.ADMIN.CREATE_USER, {
      state: {
        prefillData: {
          email: request.email,
          organizationName: request.organizationName,
          reasonForJoining: request.reasonForJoining,
        },
        requestId: request.id,
      },
    });
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this access request?"))
      return;

    try {
      await adminService.deleteUser(requestId);
      toast.success("Access request deleted successfully");
      refetch();
    } catch (error) {
      // Error handled by interceptor
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl -z-10"></div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-3">
            Access Requests
          </h1>
          <p className="text-text-secondary text-lg">
            Review and approve pending access requests
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {pagination.total || 0} Pending
        </Badge>
      </div>

      {/* Requests Grid */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <TableSkeleton rows={3} columns={4} />
            </CardContent>
          </Card>
        ) : requests.length > 0 ? (
          requests.map((request, index) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  {/* Request Info */}
                  <div className="flex-1 space-y-3">
                    {/* Name & Email */}
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-1">
                        {request.fullName}
                      </h3>
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{request.email}</span>
                      </div>
                    </div>

                    {/* Organization */}
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {request.organizationName}
                      </span>
                    </div>

                    {/* Reason */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-text-primary">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          Reason for Access:
                        </span>
                      </div>
                      <p className="text-sm text-text-muted pl-6 leading-relaxed">
                        {request.reasonForJoining}
                      </p>
                    </div>

                    {/* Request Date */}
                    <div className="flex items-center gap-2 text-text-muted">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">
                        Requested on{" "}
                        {format(
                          new Date(request.requestedAt),
                          "MMM dd, yyyy 'at' hh:mm a"
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 lg:justify-center">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<UserPlus className="w-4 h-4" />}
                      onClick={() => handleApprove(request)}
                      className="flex-1 lg:flex-none"
                    >
                      Add User
                    </Button>
                    <Button
                      variant="error"
                      size="sm"
                      leftIcon={<Trash2 className="w-4 h-4" />}
                      onClick={() => handleDelete(request.id)}
                      className="flex-1 lg:flex-none"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No Pending Requests
              </h3>
              <p className="text-text-secondary text-sm">
                All access requests have been processed
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page === 1}
            onClick={() => handlePageChange(filters.page - 1)}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={page === filters.page ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              )
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page === pagination.totalPages}
            onClick={() => handlePageChange(filters.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccessRequestsPage;
