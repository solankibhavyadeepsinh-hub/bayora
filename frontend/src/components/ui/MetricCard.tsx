import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    context?: string;
  };
  sparklineData?: number[];
  statusColor?: "accent" | "cyan" | "violet" | "success" | "warning" | "danger" | "info";
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
  statusColor = "accent",
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
              stroke={trend?.direction === "down" ? "#E66A77" : "#45C995"}
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        );
      })()
    ) : null;

  const colorDots = {
    accent: "bg-[#4FD1C5]",
    cyan: "bg-[#4FD1C5]",
    violet: "bg-[#7C8CFF]",
    success: "bg-[#45C995]",
    warning: "bg-[#E6B35A]",
    danger: "bg-[#E66A77]",
    info: "bg-[#6EA8FE]",
  };

  return (
    <div
      onClick={onClick}
      className={`p-3.5 rounded-md bg-[#12171D] border border-[#1C242C] hover:border-[#252D36] transition-colors duration-150 flex flex-col justify-between ${
        onClick ? "cursor-pointer hover:bg-[#171D24]" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${colorDots[statusColor]}`} />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A3ADB7]">
            {label}
          </span>
        </div>
        {badgeText ? (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#171D24] text-[#68737E] border border-[#252D36]">
            {badgeText}
          </span>
        ) : icon ? (
          <div className="text-[#68737E]">{icon}</div>
        ) : null}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <span className="text-xl font-mono font-bold text-[#EEF2F5] tracking-tight">
          {value}
        </span>
        {sparklineSvg}
      </div>

      {trend && (
        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono">
          <span
            className={`inline-flex items-center gap-0.5 font-medium ${
              trend.direction === "up"
                ? "text-[#45C995]"
                : trend.direction === "down"
                ? "text-[#E66A77]"
                : "text-[#A3ADB7]"
            }`}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="w-2.5 h-2.5" />
            ) : trend.direction === "down" ? (
              <TrendingDown className="w-2.5 h-2.5" />
            ) : (
              <Minus className="w-2.5 h-2.5" />
            )}
            {trend.value}
          </span>
          {trend.context && (
            <span className="text-[#68737E] truncate">{trend.context}</span>
          )}
        </div>
      )}
    </div>
  );
}
