import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { UserPlus, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { adminService } from "../../services/adminService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/Card";
import { ROUTES } from "../../config/constants";

const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters"),
  userType: z.enum(["user", "admin"]),
  tier: z.enum(["tier1", "tier2", ""]),
});

const CreateUserPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTier, setSelectedTier] = React.useState("");

  // Get pre-filled data from location state (from access requests)
  const prefillData = location.state?.prefillData;
  const requestId = location.state?.requestId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: prefillData?.email || "",
      organizationName: prefillData?.organizationName || "",
      userType: "user",
      tier: "",
    },
  });

  const userType = watch("userType");

  const createUserMutation = useMutation({
    mutationFn: adminService.createUser,
    onSuccess: async (data) => {
      toast.success("User created successfully! Welcome email sent.");

      // If this was from an access request, delete the request
      if (requestId) {
        try {
          await adminService.deleteUser(requestId);
        } catch (error) {
          console.error("Failed to delete access request:", error);
        }
      }

      navigate(ROUTES.ADMIN.USERS);
    },
  });

  const onSubmit = (data) => {
    // Remove tier if user type is admin
    const submitData = {
      ...data,
      tier: data.userType === "admin" ? undefined : data.tier || undefined,
    };
    createUserMutation.mutate(submitData);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.ADMIN.USERS)}
          className="mb-4"
        >
          Back to Users
        </Button>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl -z-10"></div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-3">
            Create New User
          </h1>
          <p className="text-text-secondary text-lg">
            Add a new user or organization to the platform
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Enter the details for the new user. A welcome email with login
            credentials will be sent automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                placeholder="user@example.com"
                error={errors.email?.message}
                {...register("email")}
                required
              />

              {/* Organization Name */}
              <Input
                label="Organization Name"
                type="text"
                placeholder="Enter organization name"
                error={errors.organizationName?.message}
                {...register("organizationName")}
                required
              />

              {/* User Type */}
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">
                  User Type <span className="text-error-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      userType === "user"
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-border-purple hover:border-purple-500/50"
                    }`}
                  >
                    <input
                      type="radio"
                      value="user"
                      {...register("userType")}
                      className="sr-only"
                    />
                    <UserPlus
                      className={`w-6 h-6 mb-1.5 ${
                        userType === "user"
                          ? "text-purple-400"
                          : "text-text-muted"
                      }`}
                    />
                    <span
                      className={`font-semibold text-sm ${
                        userType === "user"
                          ? "text-purple-300"
                          : "text-text-primary"
                      }`}
                    >
                      Regular User
                    </span>
                    <span className="text-xs text-text-muted mt-0.5">
                      Standard access
                    </span>
                  </label>

                  <label
                    className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      userType === "admin"
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-border-purple hover:border-blue-500/50"
                    }`}
                  >
                    <input
                      type="radio"
                      value="admin"
                      {...register("userType")}
                      className="sr-only"
                    />
                    <UserPlus
                      className={`w-6 h-6 mb-1.5 ${
                        userType === "admin"
                          ? "text-blue-400"
                          : "text-text-muted"
                      }`}
                    />
                    <span
                      className={`font-semibold text-sm ${
                        userType === "admin"
                          ? "text-blue-300"
                          : "text-text-primary"
                      }`}
                    >
                      Administrator
                    </span>
                    <span className="text-xs text-text-muted mt-0.5">
                      Full access
                    </span>
                  </label>
                </div>
                {errors.userType && (
                  <p className="text-sm text-error-500 mt-1">
                    {errors.userType.message}
                  </p>
                )}
              </div>

              {/* Tier Selection - Only for regular users */}
              {userType === "user" && (
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    Select Tier (Optional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label
                      className={`relative flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        watch("tier") === "tier1"
                          ? "border-purple-500 bg-purple-500/20"
                          : "border-border-purple hover:border-purple-500/50"
                      }`}
                    >
                      <input
                        type="radio"
                        value="tier1"
                        {...register("tier")}
                        className="sr-only"
                      />
                      <span
                        className={`text-base font-semibold ${
                          watch("tier") === "tier1"
                            ? "text-purple-300"
                            : "text-text-primary"
                        }`}
                      >
                        Tier 1
                      </span>
                      <span className="text-base font-bold text-text-secondary">
                        500 credits
                      </span>
                    </label>

                    <label
                      className={`relative flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        watch("tier") === "tier2"
                          ? "border-purple-500 bg-purple-500/20"
                          : "border-border-purple hover:border-purple-500/50"
                      }`}
                    >
                      <input
                        type="radio"
                        value="tier2"
                        {...register("tier")}
                        className="sr-only"
                      />
                      <span
                        className={`text-base font-semibold ${
                          watch("tier") === "tier2"
                            ? "text-purple-300"
                            : "text-text-primary"
                        }`}
                      >
                        Tier 2
                      </span>
                      <span className="text-base font-bold text-text-secondary">
                        1000 credits
                      </span>
                    </label>
                  </div>
                  {errors.tier && (
                    <p className="text-sm text-error-500 mt-1">
                      {errors.tier.message}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={createUserMutation.isPending}
                  leftIcon={<UserPlus className="w-5 h-5" />}
                >
                  Create User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(ROUTES.ADMIN.USERS)}
                  disabled={createUserMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </div>
  );
};

export default CreateUserPage;
