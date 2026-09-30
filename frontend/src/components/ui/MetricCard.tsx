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
  statusColor?: "cyan" | "violet" | "success" | "warning" | "danger" | "info";
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
  statusColor = "cyan",
  icon,
  badgeText,
  className = "",
  onClick,
}: MetricCardProps) {
  // Generate simple sparkline SVG path if data is provided
  const sparklineSvg = sparklineData && sparklineData.length > 1 ? (() => {
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    const width = 80;
    const height = 24;
    const points = sparklineData.map((d, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((d - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

    return (
      <svg className="w-20 h-6 shrink-0 overflow-visible" viewBox="0 0 80 24">
        <polyline
          fill="none"
          stroke={trend?.direction === "down" ? "#FF6074" : "#38D996"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  })() : null;

  const colorDots = {
    cyan: "bg-[#39D9FF]",
    violet: "bg-[#8C7DFF]",
    success: "bg-[#38D996]",
    warning: "bg-[#FFB84D]",
    danger: "bg-[#FF6074]",
    info: "bg-[#5D9CFF]",
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg bg-[#101720] border border-[#1B252F] hover:border-[#25303C] transition-all duration-150 flex flex-col justify-between ${
        onClick ? "cursor-pointer hover:bg-[#151D27]" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${colorDots[statusColor]}`} />
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#A4AFBC]">
            {label}
          </span>
        </div>
        {badgeText ? (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1B252F] text-[#6C7886] border border-[#25303C]">
            {badgeText}
          </span>
        ) : icon ? (
          <div className="text-[#6C7886]">{icon}</div>
        ) : null}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-4">
        <span className="text-2xl font-mono font-bold text-[#F5F7FA] tracking-tight">
          {value}
        </span>
        {sparklineSvg}
      </div>

      {trend && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-mono">
          <span
            className={`inline-flex items-center gap-0.5 font-medium ${
              trend.direction === "up"
                ? "text-[#38D996]"
                : trend.direction === "down"
                ? "text-[#FF6074]"
                : "text-[#A4AFBC]"
            }`}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : trend.direction === "down" ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {trend.value}
          </span>
          {trend.context && (
            <span className="text-[#6C7886] truncate">{trend.context}</span>
          )}
        </div>
      )}
    </div>
  );
}
