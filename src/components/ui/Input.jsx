import React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("flex flex-col gap-1", fullWidth && "w-full")}>
        {label && (
          <label className="text-sm font-medium text-white/90">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "w-full rounded-lg border border-white/10 bg-black/20 backdrop-blur-sm px-4 py-2.5 text-white placeholder:text-white/40",
              "focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
              "disabled:bg-black/10 disabled:text-white/40 disabled:cursor-not-allowed",
              "transition-all duration-200",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error &&
                "border-error-500 focus:border-error-500 focus:ring-error-500/20",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-error-500">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-white/60">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

