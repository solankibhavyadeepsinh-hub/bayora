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
  Server,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Lock,
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
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Model Lab", href: "/models", icon: Cpu },
    { name: "Security Center", href: "/blue", icon: ShieldCheck },
    { name: "Evaluation", href: "/red", icon: Flame },
    { name: "Live Activity", href: "/observability", icon: Activity },
    { name: "Evidence", href: "/audit", icon: FileCheck },
    { name: "Reports", href: "/compliance", icon: Award },
    { name: "System Health", href: "/control", icon: Server },
  ];

  const secondaryNavigation = [
    { name: "Configuration", href: "/settings", icon: Settings },
    { name: "Audit Logs", href: "/audit", icon: FileCheck },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#0A0D10] border-r border-[#2A333C] flex flex-col justify-between transition-all duration-200 select-none ${
        collapsed ? "w-[72px]" : "w-60"
      }`}
    >
      {/* Top Header / Brand */}
      <div>
        <div className="h-14 px-4 border-b border-[#2A333C] flex items-center justify-between bg-[#0A0D10]">
          {!collapsed ? (
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded bg-[#11161B] border border-[#2A333C] flex items-center justify-center text-[#4BC7B5]">
                <Shield className="w-3.5 h-3.5 text-[#4BC7B5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xs tracking-wider text-[#F1F4F6] flex items-center gap-1">
                  BAYORA
                  <span className="h-1 w-1 rounded-full bg-[#4BC7B5]" />
                </span>
                <span className="text-[9px] font-mono text-[#707B85] tracking-widest uppercase">
                  AI Security Control
                </span>
              </div>
            </Link>
          ) : (
            <div className="mx-auto">
              <Link href="/">
                <div className="h-7 w-7 rounded bg-[#11161B] border border-[#2A333C] flex items-center justify-center text-[#4BC7B5]">
                  <Shield className="w-3.5 h-3.5 text-[#4BC7B5]" />
                </div>
              </Link>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded text-[#707B85] hover:text-[#F1F4F6] hover:bg-[#11161B] transition hidden lg:flex"
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
        <div className="p-2.5 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)]">
          {/* Main Console Links */}
          <div className="space-y-0.5">
            {!collapsed && (
              <div className="px-2.5 pb-1 text-[9px] font-mono text-[#707B85] tracking-wider uppercase">
                Control Navigation
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
                      ? "bg-[#171D23] border-[#2A333C] border-l-2 border-l-[#4BC7B5] text-[#F1F4F6] font-semibold"
                      : "border-transparent text-[#A6B0BA] hover:text-[#F1F4F6] hover:bg-[#11161B]"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? "text-[#4BC7B5]" : "text-[#707B85]"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {/* Secondary Links */}
          <div className="space-y-0.5 pt-2 border-t border-[#1B2229]">
            {!collapsed && (
              <div className="px-2.5 pb-1 text-[9px] font-mono text-[#707B85] tracking-wider uppercase">
                Management
              </div>
            )}
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-mono transition-colors border ${
                    isActive
                      ? "bg-[#171D23] border-[#2A333C] text-[#F1F4F6] font-semibold"
                      : "border-transparent text-[#A6B0BA] hover:text-[#F1F4F6] hover:bg-[#11161B]"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? "text-[#4BC7B5]" : "text-[#707B85]"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Environment & User Info */}
      <div className="p-3 border-t border-[#2A333C] bg-[#07090C] space-y-2">
        {!collapsed ? (
          <>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#707B85]">ENV</span>
              <span className="text-[#4BC7B5] font-semibold">PROD-AIRGAP-01</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#707B85]">STATUS</span>
              <div className="flex items-center gap-1.5 text-[#42B883]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#42B883] animate-pulse" />
                <span>mTLS Healthy</span>
              </div>
            </div>
            <Link
              href="/login"
              className="flex items-center justify-between p-1.5 rounded bg-[#11161B] border border-[#2A333C] hover:border-[#4BC7B5]/40 text-xs font-mono text-[#F1F4F6] transition"
            >
              <div className="flex items-center gap-1.5 truncate">
                <UserCheck className="w-3.5 h-3.5 text-[#4BC7B5] shrink-0" />
                <span className="truncate">{user?.username || "admin"}</span>
              </div>
              <span className="text-[10px] px-1 py-0.5 rounded bg-[#0A0D10] text-[#4BC7B5] border border-[#2A333C] uppercase">
                {user?.role ? user.role.replace("_operator", "") : "adm"}
              </span>
            </Link>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#42B883] animate-pulse" title="mTLS Healthy" />
            <Link
              href="/login"
              className="p-1 rounded bg-[#11161B] border border-[#2A333C] text-[#4BC7B5]"
              title={`Role: ${user?.role || "admin"}`}
            >
              <UserCheck className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
