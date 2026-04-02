"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, fullWidth = false, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]";

    const variants = {
      primary:
        "btn-shimmer relative overflow-hidden bg-gradient-to-r from-gold via-[#E8C97A] to-gold text-black hover:opacity-90 hover:scale-[1.02] shadow-lg shadow-gold/25 hover:shadow-gold/40",
      secondary:
        "bg-card border border-border text-white hover:border-gold/40 hover:bg-[#222] hover:shadow-md",
      ghost:
        "text-muted hover:text-white hover:bg-white/5",
      danger:
        "bg-red-900/30 border border-red-700/50 text-red-400 hover:bg-red-900/50",
      outline:
        "border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold/60 hover:shadow-md hover:shadow-gold/10",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-7 text-sm",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0"/>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
