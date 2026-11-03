import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "gradient";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
        variant === "default" && "bg-indigo-50 text-indigo-700",
        variant === "secondary" && "bg-gray-100 text-gray-600",
        variant === "gradient" &&
          "bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-pink-500/10 text-indigo-700 border border-indigo-100",
        className
      )}
      {...props}
    />
  );
}
