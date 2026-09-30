"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Cpu,
  ShieldCheck,
  Flame,
  Activity,
  FileCheck,
  Award,
  Layers,
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCheck,
  Server,
  Settings,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface SidebarProps {
  onOpenCommandPalette: () => void;
}

export function Sidebar({ onOpenCommandPalette }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const mainNavigation = [
    { name: "OVERVIEW", href: "/", icon: LayoutDashboard },
    { name: "MODEL LAB", href: "/models", icon: Cpu },
    { name: "SECURITY CENTER", href: "/blue", icon: ShieldCheck },
    { name: "EVALUATION", href: "/red", icon: Flame },
    { name: "LIVE ACTIVITY", href: "/observability", icon: Activity },
    { name: "EVIDENCE", href: "/audit", icon: FileCheck },
    { name: "REPORTS", href: "/compliance", icon: Award },
    { name: "SYSTEM HEALTH", href: "/control", icon: Server },
  ];

  const workspaceNavigation = [
    { name: "TAXONOMY / OWASP", href: "/taxonomy", icon: BookOpen },
    { name: "WALKTHROUGH DEMO", href: "/demo", icon: Sparkles },
    { name: "IDENTITY & RBAC", href: "/login", icon: UserCheck },
    { name: "CONFIGURATION", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#080A0D] border-r border-[#1C242C] flex flex-col justify-between transition-all duration-200 select-none ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Top Header / Brand */}
      <div>
        <div className="h-14 px-4 border-b border-[#1C242C] flex items-center justify-between bg-[#080A0D]">
          {!collapsed ? (
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded bg-[#12171D] border border-[#252D36] flex items-center justify-center text-[#4FD1C5]">
                <Shield className="w-3.5 h-3.5 text-[#4FD1C5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xs tracking-wider text-[#EEF2F5] flex items-center gap-1">
                  BAYORA
                  <span className="h-1 w-1 rounded-full bg-[#4FD1C5]" />
                </span>
                <span className="text-[9px] font-mono text-[#68737E] tracking-widest uppercase">
                  AI Security Lab
                </span>
              </div>
            </Link>
          ) : (
            <div className="mx-auto">
              <div className="h-7 w-7 rounded bg-[#12171D] border border-[#252D36] flex items-center justify-center text-[#4FD1C5]">
                <Shield className="w-3.5 h-3.5 text-[#4FD1C5]" />
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded text-[#68737E] hover:text-[#EEF2F5] hover:bg-[#12171D] transition hidden lg:flex"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="p-2.5 space-y-5 overflow-y-auto max-h-[calc(100vh-190px)]">
          {/* Main Console Links */}
          <div className="space-y-0.5">
            {!collapsed && (
              <div className="px-2.5 pb-1 text-[9px] font-mono text-[#68737E] tracking-wider uppercase">
                Core Modules
              </div>
            )}
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-mono transition-colors border ${
                    isActive
                      ? "bg-[#171D24] border-[#252D36] text-[#EEF2F5] font-semibold"
                      : "border-transparent text-[#A3ADB7] hover:text-[#EEF2F5] hover:bg-[#12171D]"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? "text-[#4FD1C5]" : "text-[#68737E]"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {/* Workspace Links */}
          <div className="space-y-0.5">
            {!collapsed && (
              <div className="px-2.5 pb-1 text-[9px] font-mono text-[#68737E] tracking-wider uppercase">
                Assurance & Hub
              </div>
            )}
            {workspaceNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-mono transition-colors border ${
                    isActive
                      ? "bg-[#171D24] border-[#252D36] text-[#EEF2F5] font-semibold"
                      : "border-transparent text-[#A3ADB7] hover:text-[#EEF2F5] hover:bg-[#12171D]"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? "text-[#4FD1C5]" : "text-[#68737E]"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Profile & Status Section */}
      <div className="p-2.5 border-t border-[#1C242C] bg-[#080A0D] space-y-2">
        {/* System Heartbeat */}
        {!collapsed ? (
          <div className="p-2 rounded bg-[#0D1116] border border-[#1C242C] flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#45C995]" />
              <span className="text-[#A3ADB7]">mTLS Mesh</span>
            </div>
            <span className="text-[9px] px-1 py-0.5 rounded bg-[#12171D] text-[#4FD1C5] border border-[#1C242C]">
              SANDBOX
            </span>
          </div>
        ) : (
          <div className="flex justify-center" title="mTLS Mesh Active">
            <span className="h-2 w-2 rounded-full bg-[#45C995]" />
          </div>
        )}

        {/* User Session */}
        {!collapsed && user && (
          <div className="flex items-center justify-between p-2 rounded bg-[#12171D] border border-[#1C242C]">
            <div className="flex flex-col min-w-0 pr-1.5">
              <span className="text-xs font-medium text-[#EEF2F5] truncate font-sans">
                {user.username}
              </span>
              <span className="text-[9px] font-mono text-[#68737E] uppercase">
                {user.role}
              </span>
            </div>

            <Link
              href="/login"
              className="text-[10px] font-mono text-[#4FD1C5] hover:underline shrink-0"
              title="Switch role"
            >
              Switch
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
