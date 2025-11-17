import React, { Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import { authService } from "../services/authService";
import LoginForm from "../components/ui/LoginForm";
import BackToHomeButton from "../components/ui/BackToHomeButton";
import { APP_NAME, ROUTES, USER_TYPES } from "../config/constants";

// Lazy load FloatingLines
const FloatingLines = lazy(() => import("../components/ui/FloatingLines"));

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = React.useState(false);

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
    <div className="min-h-screen w-full flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 w-full h-full" style={{ background: 'linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)' }}></div>
      
      {/* Back to Home Button - Top Left */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
        <BackToHomeButton />
      </div>
      
      {/* FloatingLines Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent animate-pulse" />
        }>
          <FloatingLines 
            enabledWaves={['top', 'middle', 'bottom']}
            lineCount={5}
            lineDistance={5}
            bendRadius={5.0}
            bendStrength={-0.5}
            interactive={true}
            parallax={true}
            parallaxStrength={0.2}
            animationSpeed={1}
            mouseDamping={0.05}
            mixBlendMode="screen"
            linesGradient={['#2d1b47', '#4a0582', '#7808d0', '#a855f7', '#c084fc']}
            topWavePosition={{ x: 10.0, y: 0.5, rotate: -0.4 }}
            middleWavePosition={{ x: 5.0, y: 0.0, rotate: 0.2 }}
            bottomWavePosition={{ x: 2.0, y: -0.7, rotate: -1 }}
          />
        </Suspense>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <LoginForm onSubmit={onSubmit} loading={loading} />
        
        {/* Footer */}
        <p className="text-center text-sm text-neutral-400 mt-6">
          © 2025 {APP_NAME}. A Government of India Initiative.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;


