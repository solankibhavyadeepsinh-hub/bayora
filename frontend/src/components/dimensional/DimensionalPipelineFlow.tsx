"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  FileCheck,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface PipelineStage {
  step: string;
  name: string;
  stageType: string;
  latency: string;
  status: "NORMAL" | "ENFORCED" | "VERIFIED";
  description: string;
}

export function DimensionalPipelineFlow({ className = "" }: { className?: string }) {
  const [selectedStage, setSelectedStage] = useState<number>(1);

  const stages: PipelineStage[] = [
    {
      step: "01",
      name: "REQUEST INGRESS",
      stageType: "Client Payload Auth",
      latency: "1.2 ms",
      status: "NORMAL",
      description: "JWT Bearer token verification, caller zone validation, and token quota deduction.",
    },
    {
      step: "02",
      name: "INPUT POLICY",
      stageType: "Blue Input Filter",
      latency: "5.8 ms",
      status: "ENFORCED",
      description: "Deterministic regex scanning, prompt injection detection, and DAN heuristics analysis.",
    },
    {
      step: "03",
      name: "MODEL EXECUTION",
      stageType: "Airgapped LLM Pod",
      latency: "128 ms",
      status: "NORMAL",
      description: "Isolated container mock inference, temperature clamp, and synthetic canary register check.",
    },
    {
      step: "04",
      name: "OUTPUT VALIDATION",
      stageType: "Blue Output Filter",
      latency: "4.6 ms",
      status: "ENFORCED",
      description: "Canary token exfiltration barrier and sensitive PII/credential redaction.",
    },
    {
      step: "05",
      name: "EVIDENCE SEAL",
      stageType: "SHA-256 Ledger",
      latency: "2.8 ms",
      status: "VERIFIED",
      description: "Merkle hash linking H(N) = SHA256(H(N-1) || EventPayload) and auditor notification.",
    },
  ];

  return (
    <div className={`surface-panel p-5 space-y-4 bg-[#11161B] border border-[#2A333C] rounded-lg ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2A333C]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-sm text-[#F1F4F6]">
              Dimensional Model Request Pipeline
            </h3>
            <Badge variant="teal" size="xs">
              SEQUENTIAL ENFORCEMENT
            </Badge>
          </div>
          <p className="text-[11px] text-[#A6B0BA] font-mono mt-0.5">
            5-stage non-bypassable request conduit from ingress auth to immutable evidence write.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#707B85]">
          <span>Total Pipeline P50:</span>
          <span className="text-[#4BC7B5] font-semibold">142.4 ms</span>
        </div>
      </div>

      {/* 5-Stage Visual Conduit Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
        {stages.map((stage, idx) => {
          const isSelected = selectedStage === idx;
          return (
            <div
              key={stage.step}
              onClick={() => setSelectedStage(idx)}
              className={`p-3.5 rounded-md border transition-all duration-160 cursor-pointer flex flex-col justify-between space-y-2.5 ${
                isSelected
                  ? "bg-[#171D23] border-[#4BC7B5] shadow-sm shadow-[#4BC7B5]/10 translate-y-[-1px]"
                  : "bg-[#0A0D10] border-[#2A333C] hover:border-[#384450]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#4BC7B5]">{stage.step}</span>
                <span
                  className={`text-[9px] font-mono px-1 py-0.5 rounded ${
                    stage.status === "ENFORCED"
                      ? "bg-[#D6A856]/15 text-[#D6A856]"
                      : stage.status === "VERIFIED"
                      ? "bg-[#42B883]/15 text-[#42B883]"
                      : "bg-[#1B2229] text-[#A6B0BA]"
                  }`}
                >
                  {stage.status}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold font-sans text-[#F1F4F6] block truncate">
                  {stage.name}
                </span>
                <span className="text-[10px] font-mono text-[#707B85] block truncate">
                  {stage.stageType}
                </span>
              </div>

              <div className="pt-2 border-t border-[#1B2229] flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#707B85]">Latency</span>
                <span className={isSelected ? "text-[#4BC7B5] font-semibold" : "text-[#A6B0BA]"}>
                  {stage.latency}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Stage Detail Dossier */}
      <div className="p-3.5 rounded bg-[#0A0D10] border border-[#2A333C] flex items-center justify-between gap-4 font-mono text-xs">
        <div className="space-y-0.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[#4BC7B5] font-bold">
              Stage {stages[selectedStage].step}: {stages[selectedStage].name}
            </span>
            <span className="text-[#707B85]">•</span>
            <span className="text-[#A6B0BA]">{stages[selectedStage].stageType}</span>
          </div>
          <p className="text-[11px] text-[#A6B0BA] font-sans">
            {stages[selectedStage].description}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] shrink-0 text-[#42B883]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Stage Passed</span>
        </div>
      </div>
    </div>
  );
}
