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
import { ROUTES, TIERS } from "../../config/constants";

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Enter the details for the new user. A welcome email with login
              credentials will be sent automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                  User Type <span className="text-error-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      userType === "user"
                        ? "border-primary-500 bg-purple-500/20"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value="user"
                      {...register("userType")}
                      className="sr-only"
                    />
                    <UserPlus
                      className={`w-8 h-8 mb-2 ${
                        userType === "user"
                          ? "text-purple-400"
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        userType === "user"
                          ? "text-primary-900 dark:text-primary-300"
                          : "text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      Regular User
                    </span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      Standard account access
                    </span>
                  </label>

                  <label
                    className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      userType === "admin"
                        ? "border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value="admin"
                      {...register("userType")}
                      className="sr-only"
                    />
                    <UserPlus
                      className={`w-8 h-8 mb-2 ${
                        userType === "admin"
                          ? "text-secondary-600 dark:text-secondary-400"
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        userType === "admin"
                          ? "text-secondary-900 dark:text-secondary-300"
                          : "text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      Administrator
                    </span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      Full platform access
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
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 block">
                    Select Tier (Optional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(TIERS).map((tier) => (
                      <label
                        key={tier.value}
                        className={`relative flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all ${
                          watch("tier") === tier.value
                            ? "border-primary-500 bg-purple-500/20"
                            : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                        }`}
                      >
                        <input
                          type="radio"
                          value={tier.value}
                          {...register("tier")}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between mb-3">
                          <h4
                            className={`text-lg font-semibold ${
                              watch("tier") === tier.value
                                ? "text-primary-900 dark:text-primary-300"
                                : "text-neutral-900 dark:text-white"
                            }`}
                          >
                            {tier.name}
                          </h4>
                          <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                            ₹{tier.pricePerYear.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                          {tier.monthlyCredits} credits per month
                        </p>
                        <ul className="space-y-2">
                          {tier.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                            >
                              <span className="w-1.5 h-1.5 bg-primary-500 dark:bg-primary-400 rounded-full"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </label>
                    ))}
                  </div>
                  {errors.tier && (
                    <p className="text-sm text-error-500 mt-1">
                      {errors.tier.message}
                    </p>
                  )}
                </div>
              )}

              {/* Info Box */}
              <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  <strong className="text-neutral-900 dark:text-white">
                    Note:
                  </strong>{" "}
                  A temporary password will be generated and sent to the user's
                  email address. They will be required to change it on first
                  login.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={createUserMutation.isPending}
                  leftIcon={<UserPlus className="w-5 h-5" />}
                >
                  Create User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(ROUTES.ADMIN.USERS)}
                  disabled={createUserMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateUserPage;
