import React from "react";
import { cn } from "../../lib/utils";
import { cva } from "class-variance-authority";

const cardVariants = cva(
  "rounded-2xl bg-gradient-to-br from-neutral-900/90 to-neutral-900/70 backdrop-blur-xl border shadow-xl transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border border-purple-500/20 shadow-purple-500/5",
        elevated: "shadow-2xl shadow-purple-500/10 border-purple-500/30",
        outline: "border-2 border-purple-500/40",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      hoverable: {
        true: "hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/50 hover:-translate-y-0.5 cursor-pointer",
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
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight text-white",
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
        "text-sm text-white/80",
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
    <div className={cn("", className)} {...props}>
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

