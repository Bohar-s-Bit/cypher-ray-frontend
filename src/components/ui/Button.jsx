import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 focus:ring-primary-500 shadow-sm",
        secondary:
          "bg-secondary-500 text-white hover:bg-secondary-600 dark:bg-secondary-600 dark:hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm",
        success:
          "bg-success-500 text-white hover:bg-success-600 dark:bg-success-600 dark:hover:bg-success-700 focus:ring-success-500",
        warning:
          "bg-warning-500 text-white hover:bg-warning-600 dark:bg-warning-600 dark:hover:bg-warning-700 focus:ring-warning-500",
        error:
          "bg-error-500 text-white hover:bg-error-600 dark:bg-error-600 dark:hover:bg-error-700 focus:ring-error-500",
        outline:
          "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20 focus:ring-primary-500",
        ghost:
          "text-white/90 hover:bg-white/10 backdrop-blur-sm focus:ring-primary-500",
        link: "text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 underline-offset-4 hover:underline",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        xl: "px-8 py-4 text-xl",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

