"use client";

import React from "react";
import Link from "next/link";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { 
  Shield, 
  Terminal, 
  Database, 
  FileCheck, 
  Play, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Cpu,
  Layers,
  Sparkles
} from "lucide-react";

export default function LandingPage() {
  const pillars = [
    {
      num: "01",
      title: "Sandbox Isolation",
      tag: "Zone Boundary",
      color: "border-[#E5484D]/40 text-[#E5484D]",
      desc: "Distinct database schemas and default-deny Kubernetes NetworkPolicies isolating Red, Blue, Client LLM, and Control Plane zones.",
      icon: Layers
    },
    {
      num: "02",
      title: "Policy Enforcement",
      tag: "Server-Side RBAC",
      color: "border-[#3B82F6]/40 text-[#3B82F6]",
      desc: "Granular roles (red_operator, blue_operator, admin, auditor) validated on every request. Cross-zone access immediately rejected with 403.",
      icon: Lock
    },
    {
      num: "03",
      title: "Security Events",
      tag: "Normalized Bus",
      color: "border-[#8B5CF6]/40 text-[#8B5CF6]",
      desc: "Real-time streaming telemetry with dual-blind sanitization: Blue sees only redacted tokenized threat patterns, Red sees only generic blocks.",
      icon: Shield
    },
    {
      num: "04",
      title: "Audit & Evidence",
      tag: "SHA-256 Hash Chain",
      color: "border-[#10B981]/40 text-[#10B981]",
      desc: "Append-only cryptographic ledger linking every evaluation to previous block hashes. Real-time integrity verification and tamper detection.",
      icon: FileCheck
    },
  ];

  const demoAccounts = [
    { role: "Red Operator", user: "red_operator", pass: "red_pass123", zone: "Red Zone", path: "/red", color: "#E5484D" },
    { role: "Blue Operator", user: "blue_operator", pass: "blue_pass123", zone: "Blue Zone", path: "/blue", color: "#3B82F6" },
    { role: "Control Admin", user: "admin", pass: "admin_pass123", zone: "Control Plane", path: "/control", color: "#10B981" },
    { role: "Compliance Auditor", user: "auditor", pass: "auditor_pass123", zone: "Audit Zone", path: "/audit", color: "#F59E0B" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-2xl border border-[#1E293B] bg-gradient-to-b from-[#0D1527] to-[#070B12] p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            ENTERPRISE AI RED / BLUE LAB
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Dual-Blind AI Security Laboratory & Evaluation Mesh
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            Bayora provides an enterprise-grade sandbox where Red Teams evaluate LLM vulnerabilities, 
            Blue Teams engineer real-time guardrails, and neither side can inspect the other's operational secrets.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-purple-900/30 transition"
            >
              <Play className="w-4 h-4" />
              Launch Interactive Demo
            </Link>
            <Link
              href="/red"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5484D]/40 bg-[#E5484D]/10 hover:bg-[#E5484D]/20 text-[#E5484D] font-mono text-sm transition"
            >
              <Terminal className="w-4 h-4" />
              Red Console
            </Link>
            <Link
              href="/blue"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#3B82F6]/40 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 text-[#3B82F6] font-mono text-sm transition"
            >
              <Shield className="w-4 h-4" />
              Blue Console
            </Link>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-mono text-sm transition"
            >
              <FileCheck className="w-4 h-4" />
              Audit Ledger
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Architectural Foundations (4 Core Pillars)
          </h2>
          <span className="text-xs font-mono text-slate-500">Zero-Trust AI Defense Model</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div 
                key={p.num} 
                className="p-5 rounded-xl border border-[#1E293B] bg-[#0A0F1D] flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-slate-500">{p.num}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${p.color} bg-slate-900/60`}>
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base text-white flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-300" />
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-[11px] font-mono text-emerald-400 gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enforced & Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architecture Topology Diagram */}
      <div className="space-y-4">
        <ArchitectureDiagram />
      </div>

      {/* Demo Credentials Quick Switcher Banner */}
      <div className="p-6 rounded-xl border border-[#1E293B] bg-[#0D1322]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#1E293B]">
          <div>
            <h3 className="font-semibold text-sm text-white">Pre-Configured Role Credentials</h3>
            <p className="text-xs text-slate-400">All demo accounts are seeded and ready for instantaneous role switching.</p>
          </div>
          <span className="text-xs font-mono text-slate-500">Server-Side Enforced RBAC</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {demoAccounts.map((acc) => (
            <Link
              key={acc.user}
              href={acc.path}
              className="p-3.5 rounded-lg border border-slate-800 bg-[#131E35]/60 hover:bg-[#131E35] transition block"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-xs text-slate-200">{acc.role}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: acc.color, backgroundColor: `${acc.color}20` }}>
                  {acc.zone}
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 mt-2 space-y-0.5">
                <p>User: <span className="text-slate-200">{acc.user}</span></p>
                <p>Pass: <span className="text-slate-200">{acc.pass}</span></p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Access Console</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
