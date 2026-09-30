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
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { Badge } from "./ui/Badge";

export function ArchitectureDiagram() {
  const [selectedZone, setSelectedZone] = useState<string>("gateway");

  const zones = [
    {
      id: "red_zone",
      name: "Red Team Zone",
      color: "#E66A77",
      borderColor: "border-[#E66A77]/40",
      bgColor: "bg-[#E66A77]/10",
      textColor: "text-[#E66A77]",
      icon: Terminal,
      schema: "red_attack_records, red_attack_campaigns",
      netPolicy: "Default-Deny Ingress; Egress restricted exclusively to Gateway IP",
      isolation:
        "Dual-Blind: Cannot query Blue defenses, cannot see defense rule names, receives generic 'blocked' response.",
      description:
        "Adversarial workbench executing automated jailbreaks, prompt injection, extraction probes, and baseline evaluations.",
    },
    {
      id: "gateway",
      name: "Enforcement Gateway Pipeline",
      color: "#E6B35A",
      borderColor: "border-[#E6B35A]/40",
      bgColor: "bg-[#E6B35A]/10",
      textColor: "text-[#E6B35A]",
      icon: Lock,
      schema: "Transient in-memory ring buffer & token quota counter",
      netPolicy: "mTLS proxy router, enforces ingress validation and egress redaction",
      isolation:
        "Enforces 7-stage sequential pipeline: Auth → Policy → Quota → Input Filter → LLM → Output Filter → Audit",
      description:
        "The sole authorized communication conduit into the Client LLM. Rejects unauthorized bypass attempts with immediate 403.",
    },
    {
      id: "blue_zone",
      name: "Blue Team Zone",
      color: "#6EA8FE",
      borderColor: "border-[#6EA8FE]/40",
      bgColor: "bg-[#6EA8FE]/10",
      textColor: "text-[#6EA8FE]",
      icon: Shield,
      schema: "blue_defense_rules, security_events (sanitized view)",
      netPolicy:
        "Default-Deny Ingress from Red & LLM; Ingress only from Control Plane & Sanitized Event Bus",
      isolation:
        "Dual-Blind: Cannot query raw attack payloads or Red operator identities. Receives tokenized OWASP-classified alerts.",
      description:
        "Defense builder configuring regex, keyword, canary leak guards, and real-time defense effectiveness metrics.",
    },
    {
      id: "llm_zone",
      name: "Client LLM Zone",
      color: "#7C8CFF",
      borderColor: "border-[#7C8CFF]/40",
      bgColor: "bg-[#7C8CFF]/10",
      textColor: "text-[#7C8CFF]",
      icon: Cpu,
      schema: "Isolated mock inference engine with canary token registers",
      netPolicy:
        "Strict Airgap: ZERO direct external ingress. Reachable ONLY via defended gateway egress socket.",
      isolation:
        "Target model personas: Financial Core LLM, Clinical Triage, Hardened Llama-3 with embedded canary protections.",
      description:
        "Protected client LLM target environment simulating real production workloads and canary leak vulnerabilities.",
    },
    {
      id: "audit_zone",
      name: "Audit & Evidence Zone",
      color: "#45C995",
      borderColor: "border-[#45C995]/40",
      bgColor: "bg-[#45C995]/10",
      textColor: "text-[#45C995]",
      icon: FileCheck,
      schema: "audit_blocks (SHA-256 hash linked ledger)",
      netPolicy: "Append-Only cryptographic store; Read-only compliance auditor ingress",
      isolation:
        "Immutable non-repudiation ledger: H(Block_N) = SHA256(Block_N || Payload || H(Block_N-1)). Tamper detection active.",
      description:
        "Cryptographic SHA-256 hash chain providing mathematical proof of non-repudiation and exportable compliance seals.",
    },
  ];

  const pipelineStages = [
    { num: 1, name: "Auth (JWT)", icon: Key, desc: "Validates bearer signature" },
    { num: 2, name: "Policy (RBAC)", icon: Lock, desc: "Enforces zone role boundaries" },
    { num: 3, name: "Quota Guard", icon: Activity, desc: "Token limits & RPM guard" },
    { num: 4, name: "Blue Input Filter", icon: Filter, desc: "Regex, keyword, canary probe detectors" },
    { num: 5, name: "LLM Inference", icon: Cpu, desc: "Isolated target model execution" },
    { num: 6, name: "Blue Output Filter", icon: Shield, desc: "Canary leak & PII interception" },
    { num: 7, name: "SHA-256 Audit Seal", icon: FileCheck, desc: "Cryptographic hash append" },
  ];

  const current = zones.find((z) => z.id === selectedZone) || zones[1];

  return (
    <div className="w-full rounded-lg border border-[#1C242C] bg-[#12171D] p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1C242C]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#45C995] animate-pulse" />
            <h3 className="font-heading font-semibold text-sm tracking-wide text-[#EEF2F5]">
              Zero-Trust 4-Pillar Zone Topology
            </h3>
          </div>
          <p className="text-xs text-[#A3ADB7] mt-0.5">
            Default-deny CNI boundaries, schema isolation, and dual-blind cryptographic evaluation.
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#68737E]">
          Click any zone card below to inspect boundary specifications
        </span>
      </div>

      {/* Main Zone Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {zones.map((zone, idx) => {
          const Icon = zone.icon;
          const isSelected = selectedZone === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone.id)}
              className={`p-4 rounded-lg border text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                isSelected
                  ? `bg-[#171D24] ${zone.borderColor} shadow-sm`
                  : "bg-[#080A0D] border-[#1C242C] hover:border-[#252D36]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase"
                  style={{
                    backgroundColor: `${zone.color}15`,
                    color: zone.color,
                    border: `1px solid ${zone.color}40`,
                  }}
                >
                  Zone {idx + 1}
                </span>
                <Icon className="w-4 h-4" style={{ color: zone.color }} />
              </div>

              <div>
                <h4 className="font-semibold text-xs text-[#EEF2F5] font-sans">
                  {zone.name}
                </h4>
                <p className="text-[10px] text-[#A3ADB7] truncate mt-0.5">
                  {zone.id === "gateway" ? "7-Stage Pipeline" : zone.schema.split(",")[0]}
                </p>
              </div>

              <div className="pt-2 border-t border-[#1C242C] flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#68737E]">mTLS</span>
                <span style={{ color: zone.color }}>ENFORCED</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 7-Stage Gateway Flow */}
      <div className="p-4 rounded-lg bg-[#080A0D] border border-[#1C242C] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#A3ADB7] uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#E6B35A]" />
            Sequential 7-Stage Enforcement Pipeline (Single Conduit)
          </span>
          <span className="text-[#68737E] text-[11px]">~48ms Avg Gateway Latency</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {pipelineStages.map((stg) => {
            const Icon = stg.icon;
            return (
              <div
                key={stg.num}
                className="p-2.5 rounded bg-[#12171D] border border-[#1C242C] text-xs font-mono space-y-1"
              >
                <div className="flex items-center justify-between text-[#68737E]">
                  <span className="text-[10px]">#{stg.num}</span>
                  <Icon className="w-3 h-3 text-[#A3ADB7]" />
                </div>
                <p className="text-[11px] font-semibold text-[#EEF2F5] truncate">
                  {stg.name}
                </p>
                <p className="text-[9px] text-[#68737E] truncate">
                  {stg.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Zone Detail Deep Dive */}
      <div className="p-5 rounded-lg bg-[#080A0D] border border-[#1C242C] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <current.icon className="w-4 h-4" style={{ color: current.color }} />
            <h4 className="font-heading font-semibold text-sm text-[#EEF2F5]">
              {current.name} Specifications
            </h4>
          </div>
          <Badge variant="cyan" size="xs">
            ACTIVE INSPECTION
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded bg-[#12171D] border border-[#1C242C]">
            <span className="text-[#68737E] block text-[10px] uppercase mb-1">
              Database Schema Boundary
            </span>
            <span className="text-[#EEF2F5]">{current.schema}</span>
          </div>

          <div className="p-3 rounded bg-[#12171D] border border-[#1C242C]">
            <span className="text-[#68737E] block text-[10px] uppercase mb-1">
              NetworkPolicy Ingress / Egress
            </span>
            <span className="text-[#EEF2F5]">{current.netPolicy}</span>
          </div>

          <div className="p-3 rounded bg-[#12171D] border border-[#1C242C]">
            <span className="text-[#68737E] block text-[10px] uppercase mb-1">
              Dual-Blind Guarantee
            </span>
            <span className="text-[#45C995]">{current.isolation}</span>
          </div>
        </div>

        <p className="text-xs text-[#A3ADB7] font-sans leading-relaxed">
          {current.description}
        </p>
      </div>
    </div>
  );
}
