import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "indigo" | "violet";
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
  // Normalize alias
  const effVariant = variant === "violet" ? "indigo" : variant;

  const variantStyles: Record<"primary" | "secondary" | "outline" | "ghost" | "danger" | "indigo", string> = {
    primary:
      "bg-[#4BC7B5] text-[#0A0D10] font-semibold hover:bg-[#5BD9C7] active:bg-[#3BA898] shadow-none disabled:bg-[#4BC7B5]/30 disabled:text-[#0A0D10]/50",
    secondary:
      "bg-[#11161B] text-[#F1F4F6] border border-[#2A333C] hover:bg-[#171D23] hover:border-[#384450] active:bg-[#11161B] disabled:opacity-50",
    outline:
      "bg-transparent text-[#A6B0BA] border border-[#2A333C] hover:text-[#F1F4F6] hover:border-[#4BC7B5]/40 hover:bg-[#4BC7B5]/5 disabled:opacity-40",
    ghost:
      "bg-transparent text-[#A6B0BA] hover:text-[#F1F4F6] hover:bg-[#11161B] disabled:opacity-40",
    danger:
      "bg-[#D96573]/12 text-[#D96573] border border-[#D96573]/25 hover:bg-[#D96573]/20 hover:border-[#D96573]/40 disabled:opacity-40",
    indigo:
      "bg-[#6675D9] text-[#F1F4F6] font-semibold hover:bg-[#7A87E5] active:bg-[#5463C4] disabled:opacity-50",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    xs: "px-2 py-1 text-[11px] gap-1.5 rounded",
    sm: "px-2.5 py-1.5 text-xs gap-1.5 rounded",
    md: "px-3.5 py-2 text-xs font-medium gap-2 rounded",
    lg: "px-5 py-2.5 text-sm font-medium gap-2.5 rounded",
  };

  return (
    <button
      className={`inline-flex items-center justify-center transition-colors duration-160 cursor-pointer disabled:cursor-not-allowed select-none font-sans ${variantStyles[effVariant]} ${sizeStyles[size]} ${className}`}
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
