import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import { authService } from "../services/authService";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import { APP_NAME, ROUTES, USER_TYPES } from "../config/constants";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Try user login first
      let response = await authService.userLogin(data);

      if (response.success) {
        const { user, token } = response.data;
        setAuth(user, token);

        toast.success("Login successful!");

        // Redirect based on user type
        if (user.userType === USER_TYPES.ADMIN) {
          navigate(ROUTES.ADMIN.DASHBOARD);
        } else {
          navigate(ROUTES.DASHBOARD);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      // Error toast is handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 mx-auto shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-display">{APP_NAME}</CardTitle>
            <CardDescription className="text-base">
              Sign in to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                leftIcon={<Lock className="w-5 h-5" />}
                error={errors.password?.message}
                {...register("password")}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-primary-800">
                <p className="font-medium mb-1">Note:</p>
                <p className="text-primary-700">
                  Use credentials provided by your administrator
                </p>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate(ROUTES.HOME)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Back to Home
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-600 mt-6">
          © 2025 {APP_NAME}. A Government of India Initiative.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
