import React from "react";
import { motion } from "framer-motion";
import { Home, RefreshCw, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "../components/ui/Empty";
import { ROUTES } from "../config/constants";

const PRIMARY_ORB_HORIZONTAL_OFFSET = 40;
const PRIMARY_ORB_VERTICAL_OFFSET = 20;

export default function ServerErrorPage() {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="w-full relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_70%)] text-white" style={{ background: 'linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)' }}>
      {/* Animated background orbs */}
      <div
        aria-hidden={true}
        className="-z-10 absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{
            x: [
              0,
              PRIMARY_ORB_HORIZONTAL_OFFSET,
              -PRIMARY_ORB_HORIZONTAL_OFFSET,
              0,
            ],
            y: [
              0,
              PRIMARY_ORB_VERTICAL_OFFSET,
              -PRIMARY_ORB_VERTICAL_OFFSET,
              0,
            ],
            rotate: [0, 10, -10, 0],
          }}
          className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-gradient-to-tr from-purple-500/20 to-purple-600/20 blur-3xl"
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 5,
            ease: "easeInOut",
          }}
        />
        <motion.div
          animate={{
            x: [
              0,
              -PRIMARY_ORB_HORIZONTAL_OFFSET,
              PRIMARY_ORB_HORIZONTAL_OFFSET,
              0,
            ],
            y: [
              0,
              -PRIMARY_ORB_VERTICAL_OFFSET,
              PRIMARY_ORB_VERTICAL_OFFSET,
              0,
            ],
          }}
          className="absolute right-1/4 bottom-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-purple-400/10 to-purple-600/10 blur-3xl"
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 5,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Multiple gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-purple-900/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_50%)]" />

      <Empty className="relative z-10">
        <EmptyHeader>
          <EmptyTitle className="font-extrabold text-8xl bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent">
            500
          </EmptyTitle>
          <EmptyDescription className="text-nowrap text-purple-200/70">
            Internal server error. Something went wrong <br />
            on our end. Please try again later.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleRefresh}
              className="inline-flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.FAQ)}
              className="inline-flex items-center"
            >
              <HelpCircle className="mr-2 h-4 w-4" /> FAQs
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
