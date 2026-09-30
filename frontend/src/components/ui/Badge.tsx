import React from "react";

export type BadgeVariant =
  | "accent"
  | "cyan" // alias for backward compatibility
  | "violet"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

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
  // Map cyan to accent
  const effectiveVariant = variant === "cyan" ? "accent" : variant;

  const variantStyles: Record<
    "accent" | "violet" | "success" | "warning" | "danger" | "info" | "neutral",
    { bg: string; text: string; border: string; dotColor: string }
  > = {
    accent: {
      bg: "bg-[#4FD1C5]/10",
      text: "text-[#4FD1C5]",
      border: "border-[#4FD1C5]/25",
      dotColor: "bg-[#4FD1C5]",
    },
    violet: {
      bg: "bg-[#7C8CFF]/10",
      text: "text-[#7C8CFF]",
      border: "border-[#7C8CFF]/25",
      dotColor: "bg-[#7C8CFF]",
    },
    success: {
      bg: "bg-[#45C995]/10",
      text: "text-[#45C995]",
      border: "border-[#45C995]/25",
      dotColor: "bg-[#45C995]",
    },
    warning: {
      bg: "bg-[#E6B35A]/10",
      text: "text-[#E6B35A]",
      border: "border-[#E6B35A]/25",
      dotColor: "bg-[#E6B35A]",
    },
    danger: {
      bg: "bg-[#E66A77]/10",
      text: "text-[#E66A77]",
      border: "border-[#E66A77]/25",
      dotColor: "bg-[#E66A77]",
    },
    info: {
      bg: "bg-[#6EA8FE]/10",
      text: "text-[#6EA8FE]",
      border: "border-[#6EA8FE]/25",
      dotColor: "bg-[#6EA8FE]",
    },
    neutral: {
      bg: "bg-[#171D24]",
      text: "text-[#A3ADB7]",
      border: "border-[#252D36]",
      dotColor: "bg-[#68737E]",
    },
  };

  const sizeStyles = {
    xs: "px-1.5 py-0.5 text-[10px] gap-1",
    sm: "px-2 py-0.5 text-xs gap-1.5",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const current = variantStyles[effectiveVariant];

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded border ${current.bg} ${current.text} ${current.border} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${current.dotColor}`} />}
      {children}
    </span>
  );
}
