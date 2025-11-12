import React from "react";
import { cn } from "../../lib/utils";
import { cva } from "class-variance-authority";

const cardVariants = cva(
  "rounded-xl bg-white dark:bg-neutral-800 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border border-neutral-200 dark:border-neutral-700",
        elevated: "shadow-lg dark:shadow-neutral-900/50",
        outline: "border-2 border-neutral-200 dark:border-neutral-700",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      hoverable: {
        true: "hover:shadow-lg dark:hover:shadow-neutral-900/50 cursor-pointer",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

const Card = ({
  className,
  variant,
  padding,
  hoverable,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(cardVariants({ variant, padding, hoverable, className }))}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight text-neutral-900 dark:text-white",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ className, children, ...props }) => {
  return (
    <p
      className={cn(
        "text-sm text-neutral-600 dark:text-neutral-400",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn("pt-4", className)} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ className, children, ...props }) => {
  return (
    <div className={cn("flex items-center pt-4", className)} {...props}>
      {children}
    </div>
  );
};

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
