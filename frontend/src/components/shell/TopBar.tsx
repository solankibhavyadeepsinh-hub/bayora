"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShieldCheck,
  Command,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface TopBarProps {
  onOpenCommandPalette: () => void;
}

export function TopBar({ onOpenCommandPalette }: TopBarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const pathTitles: Record<string, { title: string; section: string }> = {
    "/": { title: "Overview Command Center", section: "System" },
    "/models": { title: "Model Lab & Security Cards", section: "Models" },
    "/blue": { title: "Security Center & Threat Feed", section: "Defenses" },
    "/red": { title: "Evaluation Center & Attacks", section: "Adversarial" },
    "/observability": { title: "Live Activity & Telemetry", section: "Observability" },
    "/audit": { title: "Cryptographic Evidence Ledger", section: "Audit" },
    "/compliance": { title: "Regulatory Assurance & Reports", section: "Compliance" },
    "/control": { title: "System Health & Sandboxes", section: "Infrastructure" },
    "/taxonomy": { title: "OWASP Top 10 for LLMs Directory", section: "Taxonomy" },
    "/demo": { title: "Dual-Blind Interactive Walkthrough", section: "Simulator" },
    "/settings": { title: "Operational Configuration", section: "Configuration" },
    "/login": { title: "RBAC Identity & Role Switcher", section: "Authentication" },
  };

  const current = pathTitles[pathname] || { title: "Control Panel", section: "Bayora" };

  return (
    <header className="h-14 border-b border-[#1C242C] bg-[#080A0D]/90 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Breadcrumb & Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#68737E]">
          <span>BAYORA</span>
          <span>/</span>
          <span className="text-[#A3ADB7]">{current.section}</span>
          <span>/</span>
        </div>
        <h1 className="text-xs font-semibold font-heading text-[#EEF2F5] truncate">
          {current.title}
        </h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        {/* Command Search Bar Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#12171D] border border-[#1C242C] text-xs font-mono text-[#A3ADB7] hover:text-[#EEF2F5] hover:border-[#252D36] transition-colors group"
          title="Open Command Palette (Cmd + K)"
        >
          <Search className="w-3 h-3 text-[#4FD1C5]" />
          <span className="text-xs">Search or jump to...</span>
          <span className="px-1 py-0.5 rounded bg-[#080A0D] text-[9px] text-[#68737E] border border-[#252D36] flex items-center gap-0.5 font-sans">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </button>

        {/* Environment Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#12171D] border border-[#1C242C] text-[10px] font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-[#45C995]" />
          <span className="text-[#68737E]">ENV:</span>
          <span className="text-[#4FD1C5] font-semibold">SANDBOX</span>
        </div>

        {/* Global Security Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#45C995]/10 border border-[#45C995]/25 text-[10px] font-mono text-[#45C995]">
          <ShieldCheck className="w-3 h-3" />
          <span className="font-semibold tracking-wide">SYSTEM SECURE</span>
        </div>

        {/* Role Switcher Pill */}
        <Link
          href="/login"
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#12171D] border border-[#252D36] hover:border-[#4FD1C5]/40 text-xs font-mono text-[#EEF2F5] transition"
        >
          <UserCheck className="w-3 h-3 text-[#4FD1C5]" />
          <span className="hidden sm:inline text-[#68737E]">Role:</span>
          <span className="font-semibold text-[#4FD1C5]">
            {user?.role ? user.role.replace("_operator", "") : "guest"}
          </span>
        </Link>
      </div>
    </header>
  );
}
