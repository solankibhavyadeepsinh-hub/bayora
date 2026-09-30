import React from "react";
import { Shield, Eye, Database, Terminal, Cpu } from "lucide-react";

interface ZoneBadgeProps {
  zone: "red_zone" | "blue_zone" | "llm_zone" | "control_plane" | "audit_zone" | string;
  size?: "sm" | "md";
}

export function ZoneBadge({ zone, size = "md" }: ZoneBadgeProps) {
  const isSm = size === "sm";

  switch (zone) {
    case "red_zone":
    case "red_operator":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border border-[#E5484D]/40 bg-[#E5484D]/10 text-[#E5484D] ${isSm ? "px-1.5 py-0.5 text-xs" : "px-2.5 py-1 text-xs tracking-wide uppercase"}`}>
          <Terminal className="w-3.5 h-3.5" />
          Red Zone
        </span>
      );
    case "blue_zone":
    case "blue_operator":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border border-[#3B82F6]/40 bg-[#3B82F6]/10 text-[#3B82F6] ${isSm ? "px-1.5 py-0.5 text-xs" : "px-2.5 py-1 text-xs tracking-wide uppercase"}`}>
          <Shield className="w-3.5 h-3.5" />
          Blue Zone
        </span>
      );
    case "llm_zone":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#8B5CF6] ${isSm ? "px-1.5 py-0.5 text-xs" : "px-2.5 py-1 text-xs tracking-wide uppercase"}`}>
          <Cpu className="w-3.5 h-3.5" />
          Client LLM Zone
        </span>
      );
    case "control_plane":
    case "admin":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981] ${isSm ? "px-1.5 py-0.5 text-xs" : "px-2.5 py-1 text-xs tracking-wide uppercase"}`}>
          <Database className="w-3.5 h-3.5" />
          Control Plane
        </span>
      );
    case "audit_zone":
    case "auditor":
      return (
        <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border border-amber-500/40 bg-amber-500/10 text-amber-400 ${isSm ? "px-1.5 py-0.5 text-xs" : "px-2.5 py-1 text-xs tracking-wide uppercase"}`}>
          <Eye className="w-3.5 h-3.5" />
          Audit & Evidence
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300 font-mono">
          {zone}
        </span>
      );
  }
}
