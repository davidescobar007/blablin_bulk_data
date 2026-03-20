import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../../lib/utils";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "primary" | "danger";
  size?: "sm" | "md" | "lg";
  icon: ReactNode;
  tooltip?: string;
}

const iconButtonVariants = {
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900",
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  danger: "bg-red-100 text-red-600 hover:bg-red-200",
};

const iconButtonSizes = {
  sm: "p-1 w-6 h-6",
  md: "p-1.5 w-8 h-8",
  lg: "p-2 w-10 h-10",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = "ghost", size = "md", icon, tooltip, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
          iconButtonVariants[variant],
          iconButtonSizes[size],
          className,
        )}
        title={tooltip}
        {...props}
      >
        {icon}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
