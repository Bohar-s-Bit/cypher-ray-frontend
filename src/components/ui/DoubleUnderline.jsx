import { cn } from "../../lib/utils";

export default function DoubleUnderline({
  className,
  children,
  ...props
}) {
  const common =
    "absolute h-px w-full bg-purple-400 transition-all duration-200 group-hover:opacity-50";
  return (
    <span
      {...props}
      className={cn("group relative inline-block cursor-pointer text-purple-300", className)}
    >
      {children}
      <span
        className={cn(
          common,
          "pointer-events-none left-0 top-[calc(100%_-_2px)] group-hover:top-0",
        )}
      />
      <span className={cn(common, "-bottom-[2px] left-0")} />
    </span>
  );
}
