import React from "react";

export type BadgeVariant =
  | "accent"
  | "teal"
  | "indigo"
  | "violet"
  | "success"
  | "green"
  | "warning"
  | "amber"
  | "danger"
  | "red"
  | "info"
  | "steel"
  | "cyan"
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
  // Normalize aliases
  let normVariant: "teal" | "indigo" | "success" | "warning" | "danger" | "info" | "neutral" = "neutral";
  if (variant === "accent" || variant === "teal" || variant === "cyan") normVariant = "teal";
  else if (variant === "indigo" || variant === "violet") normVariant = "indigo";
  else if (variant === "success" || variant === "green") normVariant = "success";
  else if (variant === "warning" || variant === "amber") normVariant = "warning";
  else if (variant === "danger" || variant === "red") normVariant = "danger";
  else if (variant === "info" || variant === "steel") normVariant = "info";

  const variantStyles: Record<
    "teal" | "indigo" | "success" | "warning" | "danger" | "info" | "neutral",
    { bg: string; text: string; border: string; dotColor: string }
  > = {
    teal: {
      bg: "bg-[#4BC7B5]/10",
      text: "text-[#4BC7B5]",
      border: "border-[#4BC7B5]/25",
      dotColor: "bg-[#4BC7B5]",
    },
    indigo: {
      bg: "bg-[#6675D9]/10",
      text: "text-[#6675D9]",
      border: "border-[#6675D9]/25",
      dotColor: "bg-[#6675D9]",
    },
    success: {
      bg: "bg-[#42B883]/10",
      text: "text-[#42B883]",
      border: "border-[#42B883]/25",
      dotColor: "bg-[#42B883]",
    },
    warning: {
      bg: "bg-[#D6A856]/10",
      text: "text-[#D6A856]",
      border: "border-[#D6A856]/25",
      dotColor: "bg-[#D6A856]",
    },
    danger: {
      bg: "bg-[#D96573]/10",
      text: "text-[#D96573]",
      border: "border-[#D96573]/25",
      dotColor: "bg-[#D96573]",
    },
    info: {
      bg: "bg-[#5B91D6]/10",
      text: "text-[#5B91D6]",
      border: "border-[#5B91D6]/25",
      dotColor: "bg-[#5B91D6]",
    },
    neutral: {
      bg: "bg-[#171D23]",
      text: "text-[#A6B0BA]",
      border: "border-[#2A333C]",
      dotColor: "bg-[#707B85]",
    },
  };

  const sizeStyles = {
    xs: "px-1.5 py-0.5 text-[10px] gap-1",
    sm: "px-2 py-0.5 text-xs gap-1.5",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const current = variantStyles[normVariant];

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded border ${current.bg} ${current.text} ${current.border} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${current.dotColor}`} />}
      {children}
    </span>
  );
}
