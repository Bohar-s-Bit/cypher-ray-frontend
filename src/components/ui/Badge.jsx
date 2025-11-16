import { cn } from "../../lib/utils";
import { cva } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-200 dark:border dark:border-primary-600",
        secondary:
          "bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-200 dark:border dark:border-secondary-600",
        success:
          "bg-success-100 text-success-700 dark:bg-success-800 dark:text-success-200 dark:border dark:border-success-600",
        warning:
          "bg-warning-100 text-warning-700 dark:bg-warning-800 dark:text-warning-200 dark:border dark:border-warning-600",
        error:
          "bg-error-100 text-error-700 dark:bg-error-800 dark:text-error-200 dark:border dark:border-error-600",
        neutral:
          "bg-white/10 text-white/90 backdrop-blur-sm border border-white/20",
        outline:
          "border border-white/20 text-white/90",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
);

const Badge = ({ className, variant, size, children, ...props }) => {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

