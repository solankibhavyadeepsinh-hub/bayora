"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Cpu,
  ShieldCheck,
  Lock,
  ArrowRight,
  Ban,
  CheckCircle2,
  Database,
  Layers,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function DimensionalSandboxMatrix() {
  const [selectedZone, setSelectedZone] = useState<"red" | "model" | "blue">("model");

  return (
    <div className="surface-panel p-5 space-y-5 bg-[#11161B] border border-[#2A333C] rounded-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2A333C]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-sm text-[#F1F4F6]">
              Tri-Zone Sandbox Isolation & Boundary Matrix
            </h3>
            <Badge variant="indigo" size="xs">
              DUAL-BLIND AIRGAP
            </Badge>
          </div>
          <p className="text-[11px] text-[#A6B0BA] font-mono mt-0.5">
            Default-deny network policy boundaries, schema isolation, and asymmetric dual-blind filters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedZone("red")}
            className={`px-2.5 py-1 rounded text-xs font-mono transition border ${
              selectedZone === "red"
                ? "bg-[#D96573]/15 text-[#D96573] border-[#D96573]/40"
                : "bg-[#0A0D10] text-[#707B85] border-[#2A333C] hover:text-[#A6B0BA]"
            }`}
          >
            Red Zone
          </button>
          <button
            onClick={() => setSelectedZone("model")}
            className={`px-2.5 py-1 rounded text-xs font-mono transition border ${
              selectedZone === "model"
                ? "bg-[#6675D9]/15 text-[#6675D9] border-[#6675D9]/40"
                : "bg-[#0A0D10] text-[#707B85] border-[#2A333C] hover:text-[#A6B0BA]"
            }`}
          >
            Model Airgap
          </button>
          <button
            onClick={() => setSelectedZone("blue")}
            className={`px-2.5 py-1 rounded text-xs font-mono transition border ${
              selectedZone === "blue"
                ? "bg-[#5B91D6]/15 text-[#5B91D6] border-[#5B91D6]/40"
                : "bg-[#0A0D10] text-[#707B85] border-[#2A333C] hover:text-[#A6B0BA]"
            }`}
          >
            Blue Zone
          </button>
        </div>
      </div>

      {/* 3-Slab Dimensional Architecture Rendering */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SLAB 1: RED SANDBOX */}
        <div
          onClick={() => setSelectedZone("red")}
          className={`p-4 rounded-md border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
            selectedZone === "red"
              ? "bg-[#171D23] border-[#D96573] shadow-md shadow-[#D96573]/5"
              : "bg-[#11161B] border-[#2A333C] hover:border-[#384450]"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-[#D96573]/10 border border-[#D96573]/25 text-[#D96573]">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-sans text-[#F1F4F6]">RED SANDBOX</h4>
                  <span className="text-[10px] font-mono text-[#D96573]">Adversarial Domain</span>
                </div>
              </div>
              <Badge variant="danger" size="xs">
                ISOLATED
              </Badge>
            </div>

            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-[#0A0D10] border border-[#2A333C] space-y-1">
                <span className="text-[9px] text-[#707B85] uppercase block">Database Schema</span>
                <span className="text-[#F1F4F6] block truncate">red_attacks, red_campaigns</span>
              </div>
              <div className="p-2 rounded bg-[#0A0D10] border border-[#2A333C] space-y-1">
                <span className="text-[9px] text-[#707B85] uppercase block">Dual-Blind Restriction</span>
                <span className="text-[#A6B0BA] block">
                  Cannot view Blue defenses. Receives generic <span className="text-[#D96573]">blocked</span> response.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1B2229] space-y-1.5 text-[10px] font-mono">
            <div className="flex items-center justify-between text-[#42B883]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Egress to Gateway
              </span>
              <span>ALLOWED</span>
            </div>
            <div className="flex items-center justify-between text-[#D96573]">
              <span className="flex items-center gap-1">
                <Ban className="w-3 h-3" /> Direct Model Ingress
              </span>
              <span>DENIED (403)</span>
            </div>
          </div>
        </div>

        {/* SLAB 2: MODEL AIRGAP SANDBOX */}
        <div
          onClick={() => setSelectedZone("model")}
          className={`p-4 rounded-md border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
            selectedZone === "model"
              ? "bg-[#171D23] border-[#6675D9] shadow-md shadow-[#6675D9]/5"
              : "bg-[#11161B] border-[#2A333C] hover:border-[#384450]"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-[#6675D9]/10 border border-[#6675D9]/25 text-[#6675D9]">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-sans text-[#F1F4F6]">MODEL AIRGAP</h4>
                  <span className="text-[10px] font-mono text-[#6675D9]">Execution Pods</span>
                </div>
              </div>
              <Badge variant="indigo" size="xs">
                STRICT_AIRGAP
              </Badge>
            </div>

            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-[#0A0D10] border border-[#2A333C] space-y-1">
                <span className="text-[9px] text-[#707B85] uppercase block">Protected Assets</span>
                <span className="text-[#F1F4F6] block truncate">Financial Core AI, Clinical EHR LLM</span>
              </div>
              <div className="p-2 rounded bg-[#0A0D10] border border-[#2A333C] space-y-1">
                <span className="text-[9px] text-[#707B85] uppercase block">Canary Token Register</span>
                <span className="text-[#4BC7B5] block truncate">BAYORA-SEC-CANARY-4091</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1B2229] space-y-1.5 text-[10px] font-mono">
            <div className="flex items-center justify-between text-[#42B883]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ingress from Filter
              </span>
              <span>FILTERED</span>
            </div>
            <div className="flex items-center justify-between text-[#D96573]">
              <span className="flex items-center gap-1">
                <Ban className="w-3 h-3" /> External Internet
              </span>
              <span>BLOCKED</span>
            </div>
          </div>
        </div>

        {/* SLAB 3: BLUE SANDBOX */}
        <div
          onClick={() => setSelectedZone("blue")}
          className={`p-4 rounded-md border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
            selectedZone === "blue"
              ? "bg-[#171D23] border-[#5B91D6] shadow-md shadow-[#5B91D6]/5"
              : "bg-[#11161B] border-[#2A333C] hover:border-[#384450]"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-[#5B91D6]/10 border border-[#5B91D6]/25 text-[#5B91D6]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-sans text-[#F1F4F6]">BLUE SANDBOX</h4>
                  <span className="text-[10px] font-mono text-[#5B91D6]">Defensive Controls</span>
                </div>
              </div>
              <Badge variant="steel" size="xs">
                SANITIZED
              </Badge>
            </div>

            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-[#0A0D10] border border-[#2A333C] space-y-1">
                <span className="text-[9px] text-[#707B85] uppercase block">Database Schema</span>
                <span className="text-[#F1F4F6] block truncate">blue_defenses, security_events</span>
              </div>
              <div className="p-2 rounded bg-[#0A0D10] border border-[#2A333C] space-y-1">
                <span className="text-[9px] text-[#707B85] uppercase block">Dual-Blind Restriction</span>
                <span className="text-[#A6B0BA] block">
                  Cannot view raw attack payloads. Receives tokenized OWASP threat events.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1B2229] space-y-1.5 text-[10px] font-mono">
            <div className="flex items-center justify-between text-[#42B883]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Sanitized Threat Feed
              </span>
              <span>REAL-TIME</span>
            </div>
            <div className="flex items-center justify-between text-[#D96573]">
              <span className="flex items-center gap-1">
                <Ban className="w-3 h-3" /> Raw Red Payload Query
              </span>
              <span>DENIED (403)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Boundary Policy Details Banner */}
      <div className="p-3.5 rounded bg-[#0A0D10] border border-[#2A333C] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-[#4BC7B5]/10 border border-[#4BC7B5]/30 flex items-center justify-center text-[#4BC7B5]">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="text-[#F1F4F6]">
            Active Enforcement: <span className="text-[#4BC7B5]">CNI Default-Deny Ingress</span> • PostgreSQL Schema Isolation
          </span>
        </div>
        <span className="text-[11px] text-[#707B85]">Zero-Bypass Policy Hash: 0x9f88c3a1</span>
      </div>
    </div>
  );
}
