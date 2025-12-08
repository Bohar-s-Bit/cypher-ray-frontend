import { AnimatePresence, motion } from "framer-motion";
import { X, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export function AnimatedModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  icon: Icon = AlertCircle,
  size = "lg",
  actions,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center overflow-y-scroll bg-black/60 p-8 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12deg", opacity: 0 }}
            animate={{
              scale: 1,
              rotate: "0deg",
              opacity: 1,
              transition: {
                type: "spring",
                bounce: 0.25,
                duration: 0.5,
              },
            }}
            exit={{ 
              scale: 0, 
              rotate: "-12deg", 
              opacity: 0,
              transition: {
                duration: 0.3,
              },
            }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full cursor-default overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-neutral-900 to-blue-500/20 border border-purple-500/30 p-6 text-white shadow-2xl shadow-purple-500/20",
              {
                "max-w-sm": size === "sm",
                "max-w-lg": size === "lg",
                "max-w-2xl": size === "xl",
              }
            )}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <X className="w-4 h-4 text-white/70 hover:text-white" />
            </button>

            {/* Content */}
            <div className="flex flex-col gap-4">
              {/* Icon */}
              {Icon && (
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                    <Icon className="w-12 h-12 text-purple-400" />
                  </div>
                </div>
              )}

              {/* Title */}
              {title && (
                <h3
                  className={cn("text-center font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent", {
                    "text-2xl": size === "sm",
                    "text-3xl": size === "lg",
                    "text-4xl": size === "xl",
                  })}
                >
                  {title}
                </h3>
              )}

              {/* Description */}
              {description && (
                <p className="text-center text-white/70 text-sm">
                  {description}
                </p>
              )}

              {/* Custom Content */}
              {children && (
                <div className="mt-2">
                  {children}
                </div>
              )}

              {/* Actions */}
              {actions && (
                <div className="flex gap-3 mt-4">
                  {actions}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AnimatedModal;
