import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const Modal = ({ isOpen, onClose, children, size = "md", className }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full mx-4",
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-full",
            sizeClasses[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </div>
    </>
  );
};

const ModalHeader = ({ children, onClose, className }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-6 border-b border-white/10",
        className
      )}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

const ModalTitle = ({ children, className }) => {
  return (
    <h2
      className={cn(
        "text-2xl font-semibold text-white",
        className
      )}
    >
      {children}
    </h2>
  );
};

const ModalBody = ({ children, className }) => {
  return <div className={cn("p-6", className)}>{children}</div>;
};

const ModalFooter = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-black/20 rounded-b-2xl",
        className
      )}
    >
      {children}
    </div>
  );
};

export { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter };

