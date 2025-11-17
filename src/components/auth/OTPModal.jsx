import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { cn } from "../../lib/utils";
import { Clock, Mail } from "lucide-react";

const OTPModal = ({ isOpen, onClose, onVerify, email, isLoading }) => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  // Reset OTP and timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setTimeLeft(120);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6 && !isLoading) {
      onVerify(otp);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const isExpired = timeLeft === 0;
  const isValid = otp.length === 6;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <form onSubmit={handleSubmit}>
        <ModalHeader onClose={onClose}>
          <ModalTitle>Enter OTP</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            {/* Email Display */}
            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
              <Mail className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/70">{email}</span>
            </div>

            {/* Timer */}
            <div
              className={cn(
                "flex items-center gap-2 p-3 rounded-lg border",
                isExpired
                  ? "bg-error-500/10 border-error-500/30"
                  : "bg-white/5 border-white/10"
              )}
            >
              <Clock
                className={cn(
                  "w-4 h-4",
                  isExpired ? "text-error-500" : "text-purple-400"
                )}
              />
              <span
                className={cn(
                  "text-sm font-mono font-semibold",
                  isExpired ? "text-error-500" : "text-white/90"
                )}
              >
                {isExpired ? "OTP Expired" : formatTime(timeLeft)}
              </span>
            </div>

            {/* OTP Input */}
            <div>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                label="Enter 6-digit OTP"
                disabled={isExpired || isLoading}
                className={cn(
                  "text-center text-2xl tracking-widest font-mono",
                  isValid && "border-success-500"
                )}
                maxLength={6}
                autoFocus
              />
            </div>

            {/* Instructions */}
            <p className="text-xs text-white/60 text-center">
              {isExpired ? (
                <span className="text-error-400">
                  This OTP has expired. Please close this window and request a
                  new OTP.
                </span>
              ) : (
                <>
                  We've sent a 6-digit code to your email.
                  <br />
                  Enter it above to verify your password change.
                </>
              )}
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isExpired || isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default OTPModal;
