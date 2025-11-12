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
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-white">
            User Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
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
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton rows={5} columns={6} />
            </div>
          ) : users.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        User
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Organization
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Type
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Tier
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Credits
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Status
                      </th>
                      <th className="text-right px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {user.username}
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {user.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-neutral-900 dark:text-white">
                            {user.organizationName || "N/A"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              user.userType === "admin" ? "primary" : "neutral"
                            }
                          >
                            {user.userType}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {user.tier ? (
                            <Badge variant="secondary">
                              {user.tierInfo?.name}
                            </Badge>
                          ) : (
                            <span className="text-neutral-500 dark:text-neutral-500">
                              N/A
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-neutral-900 dark:text-white font-medium">
                            {user.credits?.remaining || 0}
                          </p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            of {user.credits?.total || 0}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={user.isActive ? "success" : "error"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
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
                              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleStatus(user._id, user.isActive)
                              }
                              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                              title={user.isActive ? "Deactivate" : "Activate"}
                            >
                              {user.isActive ? (
                                <XCircle className="w-4 h-4 text-error-600 dark:text-error-400" />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-success-600 dark:text-success-400" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="p-2 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4 text-error-600 dark:text-error-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
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
              <p className="text-neutral-500 dark:text-neutral-500">
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
