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
      "bg-[#39D9FF] text-[#070A0F] font-semibold hover:bg-[#5CE0FF] active:bg-[#28C5EB] shadow-sm disabled:bg-[#39D9FF]/40 disabled:text-[#070A0F]/60",
    secondary:
      "bg-[#101720] text-[#F5F7FA] border border-[#1B252F] hover:bg-[#151D27] hover:border-[#25303C] active:bg-[#101720] disabled:opacity-50",
    outline:
      "bg-transparent text-[#A4AFBC] border border-[#25303C] hover:text-[#F5F7FA] hover:border-[#39D9FF]/40 hover:bg-[#39D9FF]/5 disabled:opacity-40",
    ghost:
      "bg-transparent text-[#A4AFBC] hover:text-[#F5F7FA] hover:bg-[#101720] disabled:opacity-40",
    danger:
      "bg-[#FF6074]/15 text-[#FF6074] border border-[#FF6074]/30 hover:bg-[#FF6074]/25 hover:border-[#FF6074]/50 disabled:opacity-40",
    violet:
      "bg-[#8C7DFF] text-white font-semibold hover:bg-[#9E91FF] active:bg-[#7D6DF5] shadow-sm disabled:opacity-50",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    xs: "px-2 py-1 text-[11px] gap-1.5 rounded",
    sm: "px-2.5 py-1.5 text-xs gap-1.5 rounded-md",
    md: "px-3.5 py-2 text-xs font-medium gap-2 rounded-md",
    lg: "px-5 py-2.5 text-sm font-medium gap-2.5 rounded-md",
  };

  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:cursor-not-allowed select-none font-sans ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
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
