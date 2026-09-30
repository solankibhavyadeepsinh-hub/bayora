import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "violet";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "secondary",
  size = "md",
  loading = false,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-[#4FD1C5] text-[#080A0D] font-semibold hover:bg-[#5EEAD4] active:bg-[#38B2AC] shadow-none disabled:bg-[#4FD1C5]/30 disabled:text-[#080A0D]/50",
    secondary:
      "bg-[#12171D] text-[#EEF2F5] border border-[#1C242C] hover:bg-[#171D24] hover:border-[#252D36] active:bg-[#12171D] disabled:opacity-50",
    outline:
      "bg-transparent text-[#A3ADB7] border border-[#252D36] hover:text-[#EEF2F5] hover:border-[#4FD1C5]/40 hover:bg-[#4FD1C5]/5 disabled:opacity-40",
    ghost:
      "bg-transparent text-[#A3ADB7] hover:text-[#EEF2F5] hover:bg-[#12171D] disabled:opacity-40",
    danger:
      "bg-[#E66A77]/12 text-[#E66A77] border border-[#E66A77]/25 hover:bg-[#E66A77]/20 hover:border-[#E66A77]/40 disabled:opacity-40",
    violet:
      "bg-[#7C8CFF] text-[#080A0D] font-semibold hover:bg-[#92A0FF] active:bg-[#6878FF] disabled:opacity-50",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    xs: "px-2 py-1 text-[11px] gap-1.5 rounded",
    sm: "px-2.5 py-1.5 text-xs gap-1.5 rounded",
    md: "px-3.5 py-2 text-xs font-medium gap-2 rounded",
    lg: "px-5 py-2.5 text-sm font-medium gap-2.5 rounded",
  };

  return (
    <button
      className={`inline-flex items-center justify-center transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed select-none font-sans ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
}
