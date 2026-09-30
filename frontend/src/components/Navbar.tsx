"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ZoneBadge } from "./ZoneBadge";
import { 
  Shield, 
  Terminal, 
  Database, 
  Eye, 
  Activity, 
  Lock, 
  Layers, 
  Play, 
  UserCheck, 
  ChevronDown,
  ShieldAlert,
  Cpu,
  Award,
  MoreHorizontal
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, switchRole } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const primaryNavLinks = [
    { href: "/", label: "Architecture", icon: Layers },
    { href: "/demo", label: "Demo", icon: Play, highlight: true },
    { href: "/red", label: "Red Console", icon: Terminal, roleReq: "red_operator", zoneColor: "#E5484D" },
    { href: "/blue", label: "Blue Console", icon: Shield, roleReq: "blue_operator", zoneColor: "#3B82F6" },
    { href: "/control", label: "Control Plane", icon: Database, roleReq: "admin", zoneColor: "#10B981" },
    { href: "/audit", label: "Audit & Ledger", icon: Eye, roleReq: "auditor", zoneColor: "#F59E0B" },
  ];

  const secondaryNavLinks = [
    { href: "/taxonomy", label: "OWASP Threat Directory", icon: ShieldAlert, desc: "OWASP Top 10 for LLMs directory" },
    { href: "/models", label: "Model Security Cards", icon: Cpu, desc: "Sandbox model cards & canaries" },
    { href: "/compliance", label: "Compliance Hub", icon: Award, desc: "EU AI Act, SOC2 & NIST AI RMF" },
    { href: "/observability", label: "Observability", icon: Activity, desc: "Latency & traffic profiler" },
  ];

  const roles = [
    { key: "red_operator" as const, label: "Red Operator", desc: "Adversarial workbench & campaigns", zone: "red_zone" },
    { key: "blue_operator" as const, label: "Blue Operator", desc: "Defenses & sanitized threat feed", zone: "blue_zone" },
    { key: "admin" as const, label: "Control Administrator", desc: "Sandboxes, quotas & policies", zone: "control_plane" },
    { key: "auditor" as const, label: "Compliance Auditor", desc: "SHA-256 integrity verification", zone: "audit_zone" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1E293B] bg-[#070B12]/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-md">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-wider text-white">BAYORA</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                  AIRGAP v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Isolated AI Security Lab</p>
            </div>
          </Link>

          {/* Primary Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 ml-2">
            {primaryNavLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isLocked = item.roleReq && user && user.role !== "admin" && user.role !== item.roleReq;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#131E35] text-white border border-[#1E293B]"
                      : item.highlight
                      ? "bg-purple-950/40 text-purple-300 border border-purple-500/30 hover:bg-purple-900/50"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  } ${isLocked ? "opacity-60" : ""}`}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: isActive && item.zoneColor ? item.zoneColor : undefined }} />
                  {item.label}
                  {isLocked && <Lock className="w-2.5 h-2.5 text-slate-500 ml-0.5" />}
                </Link>
              );
            })}

            {/* Knowledge & Assurance Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  ["/taxonomy", "/models", "/compliance", "/observability"].includes(pathname)
                    ? "bg-[#131E35] text-white border border-[#1E293B]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <span>Assurance & Hub</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {moreDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-64 rounded-xl border border-[#1E293B] bg-[#0D1322] p-2 shadow-2xl z-50 space-y-1"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  {secondaryNavLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`flex items-start gap-2.5 p-2 rounded-lg text-xs transition ${
                          isActive ? "bg-[#131E35] text-white" : "hover:bg-slate-800 text-slate-300"
                        }`}
                      >
                        <Icon className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-white">{item.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Action: Role Switcher & User Profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1E293B] bg-[#0D1322] hover:bg-[#131E35] transition text-xs"
            >
              <span className="text-slate-400 font-mono text-[11px]">Role:</span>
              <ZoneBadge zone={user?.role || "red_operator"} size="sm" />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-lg border border-[#1E293B] bg-[#0D1322] p-2 shadow-2xl z-50"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-2 py-1.5 border-b border-[#1E293B] mb-1">
                  <p className="text-xs font-semibold text-slate-200">Switch Operator Role</p>
                  <p className="text-[11px] text-slate-400">Enforces RBAC zone boundary switching</p>
                </div>
                {roles.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      switchRole(r.key);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex flex-col text-left px-2.5 py-2 rounded-md text-xs transition mb-0.5 ${
                      user?.role === r.key
                        ? "bg-[#131E35] border border-slate-700 text-white"
                        : "hover:bg-slate-800/60 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{r.label}</span>
                      {user?.role === r.key && <UserCheck className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5">{r.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/login"
            className="text-xs font-mono text-slate-400 hover:text-slate-200 px-2 py-1 rounded border border-transparent hover:border-slate-800 transition"
          >
            {user ? user.username : "Login"}
          </Link>
        </div>
      </div>

      {/* Sub-bar for mobile/tablet responsive nav */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 border-t border-[#1E293B] gap-2 bg-[#090D16]">
        {[...primaryNavLinks, ...secondaryNavLinks].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap px-2.5 py-1 text-xs rounded ${
              pathname === item.href ? "bg-slate-800 text-white" : "text-slate-400"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
