import React from "react";

export type BadgeVariant = "cyan" | "violet" | "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "xs" | "sm" | "md";
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
  dot = false,
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    cyan: {
      bg: "bg-[#39D9FF]/10",
      text: "text-[#39D9FF]",
      border: "border-[#39D9FF]/30",
      dotColor: "bg-[#39D9FF]",
    },
    violet: {
      bg: "bg-[#8C7DFF]/10",
      text: "text-[#8C7DFF]",
      border: "border-[#8C7DFF]/30",
      dotColor: "bg-[#8C7DFF]",
    },
    success: {
      bg: "bg-[#38D996]/10",
      text: "text-[#38D996]",
      border: "border-[#38D996]/30",
      dotColor: "bg-[#38D996]",
    },
    warning: {
      bg: "bg-[#FFB84D]/10",
      text: "text-[#FFB84D]",
      border: "border-[#FFB84D]/30",
      dotColor: "bg-[#FFB84D]",
    },
    danger: {
      bg: "bg-[#FF6074]/10",
      text: "text-[#FF6074]",
      border: "border-[#FF6074]/30",
      dotColor: "bg-[#FF6074]",
    },
    info: {
      bg: "bg-[#5D9CFF]/10",
      text: "text-[#5D9CFF]",
      border: "border-[#5D9CFF]/30",
      dotColor: "bg-[#5D9CFF]",
    },
    neutral: {
      bg: "bg-[#1B252F]",
      text: "text-[#A4AFBC]",
      border: "border-[#25303C]",
      dotColor: "bg-[#6C7886]",
    },
  };

  const sizeStyles = {
    xs: "px-1.5 py-0.5 text-[10px] gap-1",
    sm: "px-2 py-0.5 text-xs gap-1.5",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const current = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded border ${current.bg} ${current.text} ${current.border} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${current.dotColor}`} />}
      {children}
    </span>
  );
}
