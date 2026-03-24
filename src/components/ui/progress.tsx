import * as React from "react";
import { cn } from "@/lib/utils";

type ProgressVariant = "default" | "success" | "warning" | "danger";

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  variant?: ProgressVariant;
}

const variantClasses: Record<ProgressVariant, string> = {
  default: "bg-indigo-600 dark:bg-indigo-400",
  success: "bg-emerald-500 dark:bg-emerald-400",
  warning: "bg-amber-500 dark:bg-amber-400",
  danger: "bg-rose-500 dark:bg-rose-400",
};

export function Progress({ className, value, variant = "default", ...props }: ProgressProps) {
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full transition-all", variantClasses[variant])}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
