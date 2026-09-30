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
      color: "#FF6074",
      borderColor: "border-[#FF6074]/40",
      bgColor: "bg-[#FF6074]/10",
      textColor: "text-[#FF6074]",
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
      color: "#FFB84D",
      borderColor: "border-[#FFB84D]/40",
      bgColor: "bg-[#FFB84D]/10",
      textColor: "text-[#FFB84D]",
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
      color: "#5D9CFF",
      borderColor: "border-[#5D9CFF]/40",
      bgColor: "bg-[#5D9CFF]/10",
      textColor: "text-[#5D9CFF]",
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
      color: "#8C7DFF",
      borderColor: "border-[#8C7DFF]/40",
      bgColor: "bg-[#8C7DFF]/10",
      textColor: "text-[#8C7DFF]",
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
      color: "#38D996",
      borderColor: "border-[#38D996]/40",
      bgColor: "bg-[#38D996]/10",
      textColor: "text-[#38D996]",
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
    <div className="w-full rounded-lg border border-[#1B252F] bg-[#101720] p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1B252F]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#38D996] animate-pulse" />
            <h3 className="font-heading font-semibold text-sm tracking-wide text-[#F5F7FA]">
              Zero-Trust 4-Pillar Zone Topology
            </h3>
          </div>
          <p className="text-xs text-[#A4AFBC] mt-0.5">
            Default-deny CNI boundaries, schema isolation, and dual-blind cryptographic evaluation.
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#6C7886]">
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
                  ? `bg-[#151D27] ${zone.borderColor} shadow-sm`
                  : "bg-[#070A0F] border-[#1B252F] hover:border-[#25303C]"
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
                <h4 className="font-semibold text-xs text-[#F5F7FA] font-sans">
                  {zone.name}
                </h4>
                <p className="text-[10px] text-[#A4AFBC] truncate mt-0.5">
                  {zone.id === "gateway" ? "7-Stage Pipeline" : zone.schema.split(",")[0]}
                </p>
              </div>

              <div className="pt-2 border-t border-[#1B252F] flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#6C7886]">mTLS</span>
                <span style={{ color: zone.color }}>ENFORCED</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 7-Stage Gateway Flow */}
      <div className="p-4 rounded-lg bg-[#070A0F] border border-[#1B252F] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#A4AFBC] uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#FFB84D]" />
            Sequential 7-Stage Enforcement Pipeline (Single Conduit)
          </span>
          <span className="text-[#6C7886] text-[11px]">~48ms Avg Gateway Latency</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {pipelineStages.map((stg) => {
            const Icon = stg.icon;
            return (
              <div
                key={stg.num}
                className="p-2.5 rounded bg-[#101720] border border-[#1B252F] text-xs font-mono space-y-1"
              >
                <div className="flex items-center justify-between text-[#6C7886]">
                  <span className="text-[10px]">#{stg.num}</span>
                  <Icon className="w-3 h-3 text-[#A4AFBC]" />
                </div>
                <p className="text-[11px] font-semibold text-[#F5F7FA] truncate">
                  {stg.name}
                </p>
                <p className="text-[9px] text-[#6C7886] truncate">
                  {stg.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Zone Detail Deep Dive */}
      <div className="p-5 rounded-lg bg-[#070A0F] border border-[#1B252F] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <current.icon className="w-4 h-4" style={{ color: current.color }} />
            <h4 className="font-heading font-semibold text-sm text-[#F5F7FA]">
              {current.name} Specifications
            </h4>
          </div>
          <Badge variant="cyan" size="xs">
            ACTIVE INSPECTION
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded bg-[#101720] border border-[#1B252F]">
            <span className="text-[#6C7886] block text-[10px] uppercase mb-1">
              Database Schema Boundary
            </span>
            <span className="text-[#F5F7FA]">{current.schema}</span>
          </div>

          <div className="p-3 rounded bg-[#101720] border border-[#1B252F]">
            <span className="text-[#6C7886] block text-[10px] uppercase mb-1">
              NetworkPolicy Ingress / Egress
            </span>
            <span className="text-[#F5F7FA]">{current.netPolicy}</span>
          </div>

          <div className="p-3 rounded bg-[#101720] border border-[#1B252F]">
            <span className="text-[#6C7886] block text-[10px] uppercase mb-1">
              Dual-Blind Guarantee
            </span>
            <span className="text-[#38D996]">{current.isolation}</span>
          </div>
        </div>

        <p className="text-xs text-[#A4AFBC] font-sans leading-relaxed">
          {current.description}
        </p>
      </div>
    </div>
  );
}
