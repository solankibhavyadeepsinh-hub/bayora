"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShieldCheck,
  Command,
  UserCheck,
  Bell,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface TopBarProps {
  onOpenCommandPalette: () => void;
}

export function TopBar({ onOpenCommandPalette }: TopBarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const pathTitles: Record<string, { title: string; section: string }> = {
    "/": { title: "Overview Command Center", section: "System" },
    "/models": { title: "Model Lab & Airgap Sandboxes", section: "Models" },
    "/blue": { title: "Security Center & Threat Feed", section: "Defenses" },
    "/red": { title: "Evaluation Center & Campaigns", section: "Adversarial" },
    "/observability": { title: "Live Activity & Telemetry", section: "Observability" },
    "/audit": { title: "Cryptographic Evidence Ledger", section: "Audit" },
    "/compliance": { title: "Regulatory Assurance & Reports", section: "Compliance" },
    "/control": { title: "System Health & Control Plane", section: "Infrastructure" },
    "/taxonomy": { title: "OWASP Top 10 for LLMs Directory", section: "Taxonomy" },
    "/demo": { title: "Dual-Blind Interactive Walkthrough", section: "Simulator" },
    "/settings": { title: "System Configuration", section: "Management" },
    "/login": { title: "RBAC Identity & Role Switcher", section: "Authentication" },
  };

  const current = pathTitles[pathname] || { title: "Control Panel", section: "Bayora" };

  return (
    <header className="h-14 border-b border-[#2A333C] bg-[#0A0D10]/95 backdrop-blur-sm px-5 md:px-7 flex items-center justify-between sticky top-0 z-30">
      {/* Breadcrumb & Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#707B85]">
          <span>BAYORA</span>
          <span>/</span>
          <span className="text-[#A6B0BA]">{current.section}</span>
          <span>/</span>
        </div>
        <h1 className="text-xs font-semibold font-heading text-[#F1F4F6] truncate">
          {current.title}
        </h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        {/* Global Search Bar Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#11161B] border border-[#2A333C] text-xs font-mono text-[#A6B0BA] hover:text-[#F1F4F6] hover:border-[#384450] transition-colors group"
          title="Open Command Palette (Cmd + K)"
        >
          <Search className="w-3 h-3 text-[#4BC7B5]" />
          <span className="text-xs">Search commands & telemetry...</span>
          <span className="px-1 py-0.5 rounded bg-[#07090C] text-[9px] text-[#707B85] border border-[#2A333C] flex items-center gap-0.5 font-sans">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </button>

        {/* Environment Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#11161B] border border-[#2A333C] text-[10px] font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4BC7B5]" />
          <span className="text-[#707B85]">ENV:</span>
          <span className="text-[#4BC7B5] font-semibold">AIRGAP</span>
        </div>

        {/* Live Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#42B883]/10 border border-[#42B883]/25 text-[10px] font-mono text-[#42B883]">
          <ShieldCheck className="w-3 h-3" />
          <span className="font-semibold tracking-wide">SYSTEM ENFORCING</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded bg-[#11161B] border border-[#2A333C] text-[#A6B0BA] hover:text-[#F1F4F6] transition relative"
            title="System Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#4BC7B5]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 p-3 rounded-md bg-[#11161B] border border-[#2A333C] shadow-xl z-50 space-y-2 text-xs font-mono animate-fade-in">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#2A333C]">
                <span className="font-semibold text-[#F1F4F6]">Security Notifications</span>
                <span className="text-[10px] text-[#4BC7B5]">2 Active</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 rounded bg-[#0A0D10] border border-[#2A333C] space-y-0.5">
                  <span className="text-[#42B883] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ledger Block Sealed
                  </span>
                  <p className="text-[#A6B0BA]">SHA-256 Merkle root validated for 48 events.</p>
                </div>
                <div className="p-2 rounded bg-[#0A0D10] border border-[#2A333C] space-y-0.5">
                  <span className="text-[#D6A856] font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Canary Token Checked
                  </span>
                  <p className="text-[#A6B0BA]">Zero leakage across 12 adversarial probes.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile / Role Switcher Pill */}
        <Link
          href="/login"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#11161B] border border-[#2A333C] hover:border-[#4BC7B5]/40 text-xs font-mono text-[#F1F4F6] transition"
        >
          <UserCheck className="w-3 h-3 text-[#4BC7B5]" />
          <span className="hidden sm:inline text-[#707B85]">Role:</span>
          <span className="font-semibold text-[#4BC7B5]">
            {user?.role ? user.role.replace("_operator", "") : "guest"}
          </span>
        </Link>
      </div>
    </header>
  );
}
