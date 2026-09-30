"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  Bell,
  Sparkles,
  Command,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface TopBarProps {
  onOpenCommandPalette: () => void;
}

export function TopBar({ onOpenCommandPalette }: TopBarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Compute clean breadcrumbs from pathname
  const pathTitles: Record<string, { title: string; section: string }> = {
    "/": { title: "Overview Command Center", section: "System" },
    "/models": { title: "Model Lab & Security Cards", section: "Models" },
    "/blue": { title: "Security Center & Threat Feed", section: "Defenses" },
    "/red": { title: "Evaluation Center & Attacks", section: "Adversarial" },
    "/observability": { title: "Live Activity & Pipeline Telemetry", section: "Observability" },
    "/audit": { title: "Cryptographic Evidence Ledger", section: "Audit" },
    "/compliance": { title: "Regulatory Assurance & Reports", section: "Compliance" },
    "/control": { title: "System Health & Sandboxes", section: "Infrastructure" },
    "/taxonomy": { title: "OWASP Top 10 for LLMs Directory", section: "Taxonomy" },
    "/demo": { title: "Dual-Blind Interactive Walkthrough", section: "Simulator" },
    "/login": { title: "RBAC Identity & Role Switcher", section: "Authentication" },
  };

  const current = pathTitles[pathname] || { title: "Control Panel", section: "Bayora" };

  return (
    <header className="h-16 border-b border-[#1B252F] bg-[#070A0F]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Breadcrumb & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#6C7886]">
          <span>BAYORA</span>
          <span>/</span>
          <span className="text-[#A4AFBC]">{current.section}</span>
          <span>/</span>
        </div>
        <h1 className="text-sm font-semibold font-heading text-[#F5F7FA] truncate">
          {current.title}
        </h1>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-3">
        {/* Command Search Bar Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#101720] border border-[#1B252F] text-xs font-mono text-[#A4AFBC] hover:text-[#F5F7FA] hover:border-[#25303C] transition shadow-inner group"
          title="Open Command Palette (Cmd + K)"
        >
          <Search className="w-3.5 h-3.5 text-[#39D9FF] group-hover:scale-105 transition-transform" />
          <span className="text-xs">Quick search or command...</span>
          <span className="px-1.5 py-0.5 rounded bg-[#070A0F] text-[10px] text-[#6C7886] border border-[#25303C] flex items-center gap-0.5 font-sans">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </button>

        {/* Environment Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#101720] border border-[#1B252F] text-[11px] font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-[#38D996]" />
          <span className="text-[#A4AFBC]">ENV:</span>
          <span className="text-[#39D9FF] font-semibold">SANDBOX</span>
        </div>

        {/* Global Security Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#38D996]/10 border border-[#38D996]/30 text-[11px] font-mono text-[#38D996]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-semibold tracking-wide">SYSTEM SECURE</span>
        </div>

        {/* Role Switcher Pill */}
        <Link
          href="/login"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#101720] border border-[#25303C] hover:border-[#39D9FF]/40 text-xs font-mono text-[#F5F7FA] transition"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#39D9FF]" />
          <span className="hidden sm:inline text-[#A4AFBC]">Role:</span>
          <span className="font-semibold text-[#39D9FF]">
            {user?.role ? user.role.replace("_operator", "") : "guest"}
          </span>
        </Link>
      </div>
    </header>
  );
}
