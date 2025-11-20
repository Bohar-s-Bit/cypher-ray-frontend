import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import { adminService } from "../../services/adminService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import {
  ResizableTableContainer,
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
} from "../../components/ui/Table";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { QUERY_KEYS, ROUTES } from "../../config/constants";
import { cn } from "../../lib/utils";

const UsersListPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [showMenu, setShowMenu] = React.useState(null);

  // Fetch users
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.USERS_LIST, filters],
    queryFn: () => adminService.getUsers(filters),
    retry: false, // Don't retry on failure
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache
  });

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination || {};

  // Debug logging
  React.useEffect(() => {
    console.log("UsersListPage - Data:", data);
    console.log("UsersListPage - Users:", users);
    console.log("UsersListPage - Pagination:", pagination);
  }, [data, users, pagination]);

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await adminService.deleteUser(userId);
      toast.success("User deleted successfully");
      refetch();
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await adminService.updateUserStatus(userId, { isActive: !currentStatus });
      toast.success(
        `User ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
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
            User Management
          </h1>
          <p className="text-text-secondary text-lg">
            Manage all users and organizations
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<UserPlus className="w-5 h-5" />}
          onClick={() => navigate(ROUTES.ADMIN.CREATE_USER)}
        >
          Create User
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({pagination.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton rows={5} columns={6} />
            </div>
          ) : users.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-xl border border-purple-500/20 bg-gradient-to-br from-neutral-900/60 to-neutral-900/40 backdrop-blur-sm">
                <ResizableTableContainer>
                  <Table aria-label="Users management table" className="w-full">
                    <TableHeader>
                      <Column isRowHeader className="text-text-secondary text-sm font-semibold">
                        User
                      </Column>
                      <Column className="text-text-secondary text-sm font-semibold">
                        Organization
                      </Column>
                      <Column className="text-text-secondary text-sm font-semibold">
                        Type
                      </Column>
                      <Column className="text-text-secondary text-sm font-semibold">
                        Tier
                      </Column>
                      <Column className="text-text-secondary text-sm font-semibold">
                        Credits
                      </Column>
                      <Column className="text-text-secondary text-sm font-semibold">
                        Status
                      </Column>
                      <Column className="text-text-secondary text-sm font-semibold text-right">
                        Actions
                      </Column>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <Row
                          key={user._id}
                          className="border-white/10 hover:bg-neutral-800/50"
                        >
                          <Cell className="font-medium">
                            <div>
                              <p className="text-text-primary text-sm">
                                {user.username}
                              </p>
                              <p className="text-xs text-text-muted">
                                {user.email}
                              </p>
                            </div>
                          </Cell>
                          <Cell className="text-text-primary text-sm">
                            {user.organizationName || "N/A"}
                          </Cell>
                          <Cell>
                            <Badge
                              variant={
                                user.userType === "admin" ? "primary" : "neutral"
                              }
                              size="sm"
                            >
                              {user.userType}
                            </Badge>
                          </Cell>
                          <Cell>
                            {user.tier ? (
                              <Badge variant="secondary" size="sm">
                                {user.tierInfo?.name}
                              </Badge>
                            ) : (
                              <span className="text-text-muted text-sm">N/A</span>
                            )}
                          </Cell>
                          <Cell>
                            <div>
                              <p className="text-text-primary font-medium text-sm">
                                {user.credits?.remaining || 0}
                              </p>
                              <p className="text-xs text-text-muted">
                                of {user.credits?.total || 0}
                              </p>
                            </div>
                          </Cell>
                          <Cell>
                            <Badge
                              variant={user.isActive ? "success" : "error"}
                              size="sm"
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </Cell>
                          <Cell>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  navigate(
                                    ROUTES.ADMIN.USER_DETAILS.replace(
                                      ":userId",
                                      user._id
                                    )
                                  )
                                }
                                className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4 text-text-secondary" />
                              </button>
                              <button
                                onClick={() =>
                                  handleToggleStatus(user._id, user.isActive)
                                }
                                className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
                                title={user.isActive ? "Deactivate" : "Activate"}
                              >
                                {user.isActive ? (
                                  <XCircle className="w-4 h-4 text-red-400" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-2 hover:bg-error-900/20 rounded-lg transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </Cell>
                        </Row>
                      ))}
                    </TableBody>
                  </Table>
                </ResizableTableContainer>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-text-secondary">
                    Showing{" "}
                    {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.currentPage * pagination.limit,
                      pagination.totalUsers
                    )}{" "}
                    of {pagination.totalUsers} users
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasPrevPage}
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasNextPage}
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-muted">
                No users found
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersListPage;

