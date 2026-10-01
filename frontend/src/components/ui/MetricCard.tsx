import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    context?: string;
  };
  sparklineData?: number[];
  statusColor?: "teal" | "accent" | "cyan" | "indigo" | "violet" | "green" | "success" | "amber" | "warning" | "danger" | "red" | "info" | "steel";
  icon?: React.ReactNode;
  badgeText?: string;
  className?: string;
  onClick?: () => void;
}

export function MetricCard({
  label,
  value,
  trend,
  sparklineData,
  statusColor = "teal",
  icon,
  badgeText,
  className = "",
  onClick,
}: MetricCardProps) {
  // Sparkline generator
  const sparklineSvg =
    sparklineData && sparklineData.length > 1 ? (
      (() => {
        const min = Math.min(...sparklineData);
        const max = Math.max(...sparklineData);
        const range = max - min || 1;
        const width = 64;
        const height = 20;
        const points = sparklineData
          .map((d, i) => {
            const x = (i / (sparklineData.length - 1)) * width;
            const y = height - ((d - min) / range) * (height - 4) - 2;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(" ");

        return (
          <svg className="w-16 h-5 shrink-0 overflow-visible" viewBox="0 0 64 20">
            <polyline
              fill="none"
              stroke={trend?.direction === "down" ? "#D96573" : "#42B883"}
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        );
      })()
    ) : null;

  const colorDots: Record<string, string> = {
    teal: "bg-[#4BC7B5]",
    accent: "bg-[#4BC7B5]",
    indigo: "bg-[#6675D9]",
    violet: "bg-[#6675D9]",
    green: "bg-[#42B883]",
    success: "bg-[#42B883]",
    amber: "bg-[#D6A856]",
    warning: "bg-[#D6A856]",
    danger: "bg-[#D96573]",
    red: "bg-[#D96573]",
    info: "bg-[#5B91D6]",
    steel: "bg-[#5B91D6]",
  };

  const dotClass = colorDots[statusColor] || "bg-[#4BC7B5]";

  return (
    <div
      onClick={onClick}
      className={`p-3.5 rounded-md bg-[#11161B] border border-[#2A333C] hover:border-[#384450] transition-colors duration-160 flex flex-col justify-between ${
        onClick ? "cursor-pointer hover:bg-[#171D23]" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A6B0BA]">
            {label}
          </span>
        </div>
        {badgeText ? (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#171D23] text-[#707B85] border border-[#2A333C]">
            {badgeText}
          </span>
        ) : icon ? (
          <div className="text-[#707B85]">{icon}</div>
        ) : null}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <span className="text-xl font-mono font-bold text-[#F1F4F6] tracking-tight">
          {value}
        </span>
        {sparklineSvg}
      </div>

      {trend && (
        <div className="mt-2 pt-2 border-t border-[#1B2229] flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-1">
            {trend.direction === "up" ? (
              <TrendingUp className="w-3 h-3 text-[#42B883]" />
            ) : trend.direction === "down" ? (
              <TrendingDown className="w-3 h-3 text-[#D96573]" />
            ) : (
              <Minus className="w-3 h-3 text-[#707B85]" />
            )}
            <span
              className={
                trend.direction === "up"
                  ? "text-[#42B883]"
                  : trend.direction === "down"
                  ? "text-[#D96573]"
                  : "text-[#707B85]"
              }
            >
              {trend.value}
            </span>
          </div>
          {trend.context && (
            <span className="text-[10px] text-[#707B85] truncate">{trend.context}</span>
          )}
        </div>
      )}
    </div>
  );
}
