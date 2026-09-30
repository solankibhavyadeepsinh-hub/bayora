"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Terminal, 
  Database, 
  Cpu, 
  Eye, 
  ArrowRight, 
  Lock, 
  Activity, 
  Filter, 
  Key, 
  FileCheck,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export function ArchitectureDiagram() {
  const [selectedZone, setSelectedZone] = useState<string>("gateway");

  const zones = [
    {
      id: "red_zone",
      name: "Red Team Zone",
      color: "#E5484D",
      borderColor: "border-[#E5484D]/40",
      bgColor: "bg-[#E5484D]/10",
      textColor: "text-[#E5484D]",
      icon: Terminal,
      schema: "red_attack_records, red_attack_campaigns",
      netPolicy: "Default-Deny Ingress; Egress restricted exclusively to Gateway IP",
      isolation: "Dual-Blind: Cannot query Blue defenses, cannot see defense rule names, receives generic 'blocked' response.",
      description: "Adversarial workbench executing automated jailbreaks, prompt injection, extraction probes, and baseline evaluations."
    },
    {
      id: "gateway",
      name: "Enforcement Gateway Pipeline",
      color: "#F59E0B",
      borderColor: "border-amber-500/40",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-400",
      icon: Lock,
      schema: "Transient in-memory ring buffer & token quota counter",
      netPolicy: "mTLS proxy router, enforces ingress validation and egress redaction",
      isolation: "Enforces 7-stage sequential pipeline: Auth → Policy → Quota → Input Filter → LLM → Output Filter → Audit",
      description: "The sole authorized communication conduit into the Client LLM. Rejects unauthorized bypass attempts with immediate 403."
    },
    {
      id: "blue_zone",
      name: "Blue Team Zone",
      color: "#3B82F6",
      borderColor: "border-[#3B82F6]/40",
      bgColor: "bg-[#3B82F6]/10",
      textColor: "text-[#3B82F6]",
      icon: Shield,
      schema: "blue_defense_rules, security_events (sanitized view)",
      netPolicy: "Default-Deny Ingress from Red & LLM; Ingress only from Control Plane & Sanitized Event Bus",
      isolation: "Dual-Blind: Cannot query raw attack payloads or Red operator identities. Receives tokenized OWASP-classified alerts.",
      description: "Defense builder configuring regex, keyword, canary leak guards, and real-time defense effectiveness metrics."
    },
    {
      id: "llm_zone",
      name: "Client LLM Zone",
      color: "#8B5CF6",
      borderColor: "border-[#8B5CF6]/40",
      bgColor: "bg-[#8B5CF6]/10",
      textColor: "text-[#8B5CF6]",
      icon: Cpu,
      schema: "Isolated mock inference engine with canary token registers",
      netPolicy: "Strict Airgap: ZERO direct external ingress. Reachable ONLY via defended gateway egress socket.",
      isolation: "Target model personas: Financial Core LLM, Clinical Triage, Hardened Llama-3 with embedded canary protections.",
      description: "Protected client LLM target environment simulating real production workloads and canary leak vulnerabilities."
    },
    {
      id: "audit_zone",
      name: "Audit & Evidence Zone",
      color: "#10B981",
      borderColor: "border-[#10B981]/40",
      bgColor: "bg-[#10B981]/10",
      textColor: "text-[#10B981]",
      icon: FileCheck,
      schema: "audit_blocks (SHA-256 hash linked ledger)",
      netPolicy: "Append-Only cryptographic store; Read-only compliance auditor ingress",
      isolation: "Immutable non-repudiation ledger: H(Block_N) = SHA256(Block_N || Payload || H(Block_N-1)). Tamper detection active.",
      description: "Cryptographic SHA-256 hash chain providing mathematical proof of non-repudiation and exportable compliance seals."
    }
  ];

  const pipelineStages = [
    { num: 1, name: "Auth (JWT)", icon: Key, zone: "Control Plane", desc: "Validates bearer signature and operator session" },
    { num: 2, name: "Policy (RBAC)", icon: Lock, zone: "Control Plane", desc: "Enforces zone role boundaries server-side" },
    { num: 3, name: "Rate Limit / Quota", icon: Activity, zone: "Control Plane", desc: "Token limits and RPM guard per sandbox" },
    { num: 4, name: "Blue Input Filters", icon: Filter, zone: "Blue Zone", desc: "Regex, keyword, canary probe detectors (BLOCK / SANITIZE)" },
    { num: 5, name: "Client LLM Inference", icon: Cpu, zone: "LLM Zone", desc: "Isolated target model execution" },
    { num: 6, name: "Blue Output Filters", icon: Shield, zone: "Blue Zone", desc: "Canary token leak & PII exfiltration interception" },
    { num: 7, name: "SHA-256 Audit Seal", icon: FileCheck, zone: "Audit Zone", desc: "Immutable cryptographic append to hash chain" }
  ];

  const current = zones.find((z) => z.id === selectedZone) || zones[1];

  return (
    <div className="w-full rounded-xl border border-[#1E293B] bg-[#0A0F1D] p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-mono text-sm tracking-widest uppercase text-slate-300">
              Interactive 4-Pillar Architecture Topology
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dual-Blind AI Security Laboratory with default-deny networking and cryptographic hash-chaining.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Click any zone to inspect isolation parameters</span>
        </div>
      </div>

      {/* Main Interactive Diagram Visualizer */}
      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch">
          {/* Zone 1: Red */}
          <button
            onClick={() => setSelectedZone("red_zone")}
            className={`text-left p-4 rounded-xl border transition-all ${
              selectedZone === "red_zone"
                ? "border-[#E5484D] bg-[#E5484D]/15 ring-1 ring-[#E5484D]"
                : "border-[#1E293B] bg-[#0D1322] hover:border-[#E5484D]/40"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#E5484D]/20 text-[#E5484D] border border-[#E5484D]/40">
                Zone 1
              </span>
              <Terminal className="w-4 h-4 text-[#E5484D]" />
            </div>
            <h4 className="font-semibold text-sm text-white">Red Team Zone</h4>
            <p className="text-[11px] text-slate-400 mt-1">Adversarial Workbench & Campaigns</p>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Port: 8000</span>
              <span className="text-[#E5484D]">DEFAULT-DENY</span>
            </div>
          </button>

          {/* Zone 2: Gateway */}
          <button
            onClick={() => setSelectedZone("gateway")}
            className={`text-left p-4 rounded-xl border transition-all ${
              selectedZone === "gateway"
                ? "border-amber-500 bg-amber-500/15 ring-1 ring-amber-500"
                : "border-[#1E293B] bg-[#0D1322] hover:border-amber-500/40"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40">
                Pillar 2
              </span>
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="font-semibold text-sm text-white">Gateway Pipeline</h4>
            <p className="text-[11px] text-slate-400 mt-1">7-Stage Policy & Guardrail Interceptor</p>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Auth + Quota</span>
              <span className="text-amber-400">ENFORCED</span>
            </div>
          </button>

          {/* Zone 3: Blue */}
          <button
            onClick={() => setSelectedZone("blue_zone")}
            className={`text-left p-4 rounded-xl border transition-all ${
              selectedZone === "blue_zone"
                ? "border-[#3B82F6] bg-[#3B82F6]/15 ring-1 ring-[#3B82F6]"
                : "border-[#1E293B] bg-[#0D1322] hover:border-[#3B82F6]/40"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40">
                Zone 2
              </span>
              <Shield className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <h4 className="font-semibold text-sm text-white">Blue Team Zone</h4>
            <p className="text-[11px] text-slate-400 mt-1">Defenses & Sanitized Threat Feed</p>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>OWASP Top 10</span>
              <span className="text-[#3B82F6]">DUAL-BLIND</span>
            </div>
          </button>

          {/* Zone 4: Client LLM */}
          <button
            onClick={() => setSelectedZone("llm_zone")}
            className={`text-left p-4 rounded-xl border transition-all ${
              selectedZone === "llm_zone"
                ? "border-[#8B5CF6] bg-[#8B5CF6]/15 ring-1 ring-[#8B5CF6]"
                : "border-[#1E293B] bg-[#0D1322] hover:border-[#8B5CF6]/40"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40">
                Zone 3
              </span>
              <Cpu className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <h4 className="font-semibold text-sm text-white">Client LLM Zone</h4>
            <p className="text-[11px] text-slate-400 mt-1">Airgapped Target Model Mock</p>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Canary Guards</span>
              <span className="text-[#8B5CF6]">AIRGAPPED</span>
            </div>
          </button>

          {/* Zone 5: Audit */}
          <button
            onClick={() => setSelectedZone("audit_zone")}
            className={`text-left p-4 rounded-xl border transition-all ${
              selectedZone === "audit_zone"
                ? "border-[#10B981] bg-[#10B981]/15 ring-1 ring-[#10B981]"
                : "border-[#1E293B] bg-[#0D1322] hover:border-[#10B981]/40"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                Pillar 4
              </span>
              <FileCheck className="w-4 h-4 text-[#10B981]" />
            </div>
            <h4 className="font-semibold text-sm text-white">Audit & Evidence</h4>
            <p className="text-[11px] text-slate-400 mt-1">SHA-256 Hash Chained Ledger</p>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>H(Block_N)</span>
              <span className="text-[#10B981]">IMMUTABLE</span>
            </div>
          </button>
        </div>

        {/* Sequential 7-Stage Gateway Pipeline Flow Bar */}
        <div className="mt-6 p-4 rounded-xl border border-[#1E293B] bg-[#0D1322]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              Gateway Pipeline Sequential Stages (Single Entry Conduit)
            </span>
            <span className="text-[11px] font-mono text-slate-500">Latency: ~146ms total</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {pipelineStages.map((stg) => {
              const Icon = stg.icon;
              return (
                <div
                  key={stg.num}
                  className="p-2.5 rounded-lg border border-slate-800 bg-[#131E35]/60 hover:bg-[#131E35] transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-slate-500">#{stg.num}</span>
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-xs font-medium text-slate-200 truncate">{stg.name}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{stg.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Zone Deep Dive Inspector */}
      <div className="mt-4 p-5 rounded-xl border border-slate-800 bg-[#070B14]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <current.icon className="w-5 h-5" style={{ color: current.color }} />
            <h4 className="font-semibold text-base text-white">{current.name} Specifications</h4>
          </div>
          <span 
            className="text-xs font-mono px-2.5 py-0.5 rounded border"
            style={{ 
              borderColor: `${current.color}60`, 
              backgroundColor: `${current.color}15`, 
              color: current.color 
            }}
          >
            ACTIVE ZONE INSPECTION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60">
            <span className="text-slate-500 block mb-1 uppercase text-[10px]">Database Schema Boundary</span>
            <span className="text-slate-200">{current.schema}</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60">
            <span className="text-slate-500 block mb-1 uppercase text-[10px]">Network Policy (K8s)</span>
            <span className="text-slate-200">{current.netPolicy}</span>
          </div>
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60">
            <span className="text-slate-500 block mb-1 uppercase text-[10px]">Dual-Blind Security Rule</span>
            <span className="text-slate-200">{current.isolation}</span>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-400 leading-relaxed font-sans">
          {current.description}
        </p>
      </div>
    </div>
  );
}
