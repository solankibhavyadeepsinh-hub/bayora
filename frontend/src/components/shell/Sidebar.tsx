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
  CheckCircle2,
  Server,
  Settings,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "../ui/Badge";

interface SidebarProps {
  onOpenCommandPalette: () => void;
}

export function Sidebar({ onOpenCommandPalette }: SidebarProps) {
  const pathname = usePathname();
  const { user, switchRole } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const mainNavigation = [
    {
      name: "OVERVIEW",
      href: "/",
      icon: LayoutDashboard,
      activeColor: "text-[#39D9FF]",
      activeBg: "bg-[#39D9FF]/10 border-[#39D9FF]/30",
    },
    {
      name: "MODEL LAB",
      href: "/models",
      icon: Cpu,
      activeColor: "text-[#8C7DFF]",
      activeBg: "bg-[#8C7DFF]/10 border-[#8C7DFF]/30",
    },
    {
      name: "SECURITY CENTER",
      href: "/blue",
      icon: ShieldCheck,
      activeColor: "text-[#5D9CFF]",
      activeBg: "bg-[#5D9CFF]/10 border-[#5D9CFF]/30",
    },
    {
      name: "EVALUATION",
      href: "/red",
      icon: Flame,
      activeColor: "text-[#FF6074]",
      activeBg: "bg-[#FF6074]/10 border-[#FF6074]/30",
    },
    {
      name: "LIVE ACTIVITY",
      href: "/observability",
      icon: Activity,
      activeColor: "text-[#39D9FF]",
      activeBg: "bg-[#39D9FF]/10 border-[#39D9FF]/30",
    },
    {
      name: "EVIDENCE",
      href: "/audit",
      icon: FileCheck,
      activeColor: "text-[#FFB84D]",
      activeBg: "bg-[#FFB84D]/10 border-[#FFB84D]/30",
    },
    {
      name: "REPORTS",
      href: "/compliance",
      icon: Award,
      activeColor: "text-[#38D996]",
      activeBg: "bg-[#38D996]/10 border-[#38D996]/30",
    },
    {
      name: "SYSTEM HEALTH",
      href: "/control",
      icon: Server,
      activeColor: "text-[#38D996]",
      activeBg: "bg-[#38D996]/10 border-[#38D996]/30",
    },
  ];

  const workspaceNavigation = [
    {
      name: "TAXONOMY / OWASP",
      href: "/taxonomy",
      icon: BookOpen,
      activeColor: "text-[#5D9CFF]",
      activeBg: "bg-[#5D9CFF]/10 border-[#5D9CFF]/30",
    },
    {
      name: "WALKTHROUGH DEMO",
      href: "/demo",
      icon: Sparkles,
      activeColor: "text-[#8C7DFF]",
      activeBg: "bg-[#8C7DFF]/10 border-[#8C7DFF]/30",
    },
    {
      name: "IDENTITY & RBAC",
      href: "/login",
      icon: UserCheck,
      activeColor: "text-[#A4AFBC]",
      activeBg: "bg-[#25303C] border-[#39D9FF]/30",
    },
    {
      name: "CONFIGURATION",
      href: "/settings",
      icon: Settings,
      activeColor: "text-[#39D9FF]",
      activeBg: "bg-[#39D9FF]/10 border-[#39D9FF]/30",
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#070A0F] border-r border-[#1B252F] flex flex-col justify-between transition-all duration-200 select-none ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Top Header / Brand */}
      <div>
        <div className="h-16 px-4 border-b border-[#1B252F] flex items-center justify-between bg-[#070A0F]">
          {!collapsed ? (
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#101720] border border-[#25303C] flex items-center justify-center text-[#39D9FF]">
                <Shield className="w-4 h-4 text-[#39D9FF]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-sm tracking-wider text-[#F5F7FA] flex items-center gap-1">
                  BAYORA
                  <span className="h-1.5 w-1.5 rounded-full bg-[#39D9FF]" />
                </span>
                <span className="text-[9px] font-mono text-[#6C7886] tracking-widest uppercase">
                  AI Security Lab
                </span>
              </div>
            </Link>
          ) : (
            <div className="mx-auto">
              <div className="h-8 w-8 rounded-lg bg-[#101720] border border-[#25303C] flex items-center justify-center text-[#39D9FF]">
                <Shield className="w-4 h-4 text-[#39D9FF]" />
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-[#6C7886] hover:text-[#F5F7FA] hover:bg-[#101720] transition hidden lg:flex"
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
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-210px)]">
          {/* Main Console Links */}
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1 text-[10px] font-mono text-[#6C7886] tracking-wider uppercase">
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-mono transition-all duration-150 border ${
                    isActive
                      ? `${item.activeBg} ${item.activeColor} font-semibold shadow-sm`
                      : "border-transparent text-[#A4AFBC] hover:text-[#F5F7FA] hover:bg-[#101720]"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? item.activeColor : "text-[#6C7886]"}`} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {/* Workspace Links */}
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1 text-[10px] font-mono text-[#6C7886] tracking-wider uppercase">
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-mono transition-all duration-150 border ${
                    isActive
                      ? `${item.activeBg} ${item.activeColor} font-semibold shadow-sm`
                      : "border-transparent text-[#A4AFBC] hover:text-[#F5F7FA] hover:bg-[#101720]"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? item.activeColor : "text-[#6C7886]"}`} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Profile & Status Section */}
      <div className="p-3 border-t border-[#1B252F] bg-[#070A0F] space-y-3">
        {/* System Heartbeat Pill */}
        {!collapsed ? (
          <div className="p-2 rounded bg-[#0B1017] border border-[#1B252F] flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#38D996] animate-pulse" />
              <span className="text-[#A4AFBC]">mTLS Mesh</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#101720] text-[#39D9FF] border border-[#1B252F]">
              SANDBOX
            </span>
          </div>
        ) : (
          <div className="flex justify-center" title="mTLS Zero-Trust Mesh Healthy">
            <span className="h-2.5 w-2.5 rounded-full bg-[#38D996] animate-pulse" />
          </div>
        )}

        {/* User Session Profile & Role Switcher */}
        {!collapsed && user && (
          <div className="flex items-center justify-between p-2 rounded-md bg-[#101720] border border-[#1B252F]">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs font-medium text-[#F5F7FA] truncate font-sans">
                {user.username}
              </span>
              <span className="text-[10px] font-mono text-[#6C7886] uppercase">
                {user.role}
              </span>
            </div>

            <Link
              href="/login"
              className="text-[10px] font-mono text-[#39D9FF] hover:underline shrink-0"
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
