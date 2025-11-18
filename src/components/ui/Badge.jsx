import { cn } from "../../lib/utils";
import { cva } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        primary:
          "bg-purple-500/20 text-purple-300 backdrop-blur-sm border border-purple-500/30",
        secondary:
          "bg-neutral-800/50 text-neutral-200 backdrop-blur-sm border border-neutral-600/30",
        success:
          "bg-green-500/20 text-green-300 backdrop-blur-sm border border-green-500/30",
        warning:
          "bg-yellow-500/20 text-yellow-300 backdrop-blur-sm border border-yellow-500/30",
        error:
          "bg-red-500/20 text-red-300 backdrop-blur-sm border border-red-500/30",
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

