"use client";

import React, { useState } from "react";
import {
  Globe,
  Server,
  Zap,
  ShieldCheck,
  Cpu,
  FileCheck,
  ArrowRight,
  Lock,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface TopologyNode {
  id: string;
  name: string;
  layer: string;
  type: string;
  latency: string;
  status: "HEALTHY" | "OPTIMIZED" | "ENFORCING";
  description: string;
  specs: string;
  icon: any;
}

interface DimensionalTopologyProps {
  onSelectNode?: (node: TopologyNode) => void;
  className?: string;
}

export function DimensionalTopology({ onSelectNode, className = "" }: DimensionalTopologyProps) {
  const [activeNodeId, setActiveNodeId] = useState<string>("gateway");

  const nodes: TopologyNode[] = [
    {
      id: "user",
      name: "AUTHENTICATED CLIENT",
      layer: "INGRESS TIER",
      type: "External mTLS",
      latency: "1.2 ms",
      status: "HEALTHY",
      description: "Cryptographically verified TLS session passing Bearer token with RBAC role assertions.",
      specs: "TLS 1.3 • AES-256-GCM • Role-Tagged",
      icon: Globe,
    },
    {
      id: "frontend",
      name: "NEXT.JS 14 FRONTEND",
      layer: "PRESENTATION TIER",
      type: "SSR Edge Client",
      latency: "14 ms",
      status: "HEALTHY",
      description: "Server-side rendered control plane client with isolated memory and zero credentials exposure.",
      specs: "React 18 SSR • Node.js Edge • Strict CSP",
      icon: Server,
    },
    {
      id: "gateway",
      name: "7-STAGE API GATEWAY",
      layer: "ENFORCEMENT TIER",
      type: "Synchronous Pipeline",
      latency: "22 ms",
      status: "ENFORCING",
      description: "Sequential conduit: Auth &rarr; Policy &rarr; Quota &rarr; Blue In &rarr; LLM &rarr; Blue Out &rarr; Audit.",
      specs: "FastAPI Async • Redis Token Bucket • mTLS Proxy",
      icon: Zap,
    },
    {
      id: "policy",
      name: "POLICY & GUARDRAILS",
      layer: "INSPECTION TIER",
      type: "Pre/Post Inference Filters",
      latency: "6.8 ms",
      status: "ENFORCING",
      description: "Deterministic regex, semantic embeddings, and synthetic canary token leak guards.",
      specs: "Dual-Blind Filters • Zero Bypass • OWASP LLM01-10",
      icon: ShieldCheck,
    },
    {
      id: "model",
      name: "ISOLATED MODEL ENGINE",
      layer: "EXECUTION TIER",
      type: "Strict Airgap Sandbox",
      latency: "135 ms",
      status: "OPTIMIZED",
      description: "Airgapped execution environment running protected corporate personas with canary tokens.",
      specs: "Sandboxed Pods • Default-Deny CNI • Mock/Live LLM",
      icon: Cpu,
    },
    {
      id: "audit",
      name: "AUDIT & OBSERVABILITY",
      layer: "PERSISTENCE TIER",
      type: "Cryptographic Ledger",
      latency: "3.4 ms",
      status: "HEALTHY",
      description: "Append-only SHA-256 hash-chained proof records and real-time normalized telemetry stream.",
      specs: "SHA-256 Merkle Chain • Postgres Isolated Schemas",
      icon: FileCheck,
    },
  ];

  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[2];

  return (
    <div className={`surface-panel p-5 space-y-5 bg-[#11161B] border border-[#2A333C] rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2A333C]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-sm text-[#F1F4F6]">
              Dimensional System Architecture Topology
            </h3>
            <Badge variant="teal" size="xs">
              ZERO-BYPASS CONDUIT
            </Badge>
          </div>
          <p className="text-[11px] text-[#A6B0BA] font-mono mt-0.5">
            Interactive 6-stage telemetry model. Hover or click any layer to inspect isolation parameters.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#707B85]">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#42B883] animate-pulse" />
            <span className="text-[#42B883]">mTLS Active</span>
          </div>
          <span>•</span>
          <span>Airgap CNI Enforced</span>
        </div>
      </div>

      {/* 2.5D Dimensional Architecture Stage */}
      <div className="relative overflow-hidden rounded-lg bg-[#07090C] border border-[#2A333C] p-6 lg:p-8">
        {/* Subtle Perspective Grid Canvas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5 relative z-10">
          {nodes.map((node, idx) => {
            const Icon = node.icon;
            const isSelected = activeNodeId === node.id;
            return (
              <div
                key={node.id}
                onMouseEnter={() => setActiveNodeId(node.id)}
                onClick={() => {
                  setActiveNodeId(node.id);
                  if (onSelectNode) onSelectNode(node);
                }}
                className={`relative group cursor-pointer transition-all duration-200 rounded-md p-4 flex flex-col justify-between border ${
                  isSelected
                    ? "bg-[#171D23] border-[#4BC7B5] shadow-lg shadow-[#4BC7B5]/5 translate-y-[-2px]"
                    : "bg-[#11161B] border-[#2A333C] hover:border-[#384450] hover:bg-[#141A21]"
                }`}
              >
                {/* Stage number & status */}
                <div className="flex items-center justify-between pb-2 border-b border-[#1B2229]">
                  <span className="text-[9px] font-mono text-[#707B85]">0{idx + 1}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        node.status === "ENFORCING"
                          ? "bg-[#4BC7B5] animate-pulse"
                          : node.status === "OPTIMIZED"
                          ? "bg-[#6675D9]"
                          : "bg-[#42B883]"
                      }`}
                    />
                    <span className="text-[9px] font-mono text-[#707B85]">{node.status}</span>
                  </div>
                </div>

                {/* Node icon & Title */}
                <div className="my-3 space-y-1.5">
                  <div
                    className={`h-8 w-8 rounded flex items-center justify-center border transition-colors ${
                      isSelected
                        ? "bg-[#4BC7B5]/15 border-[#4BC7B5]/40 text-[#4BC7B5]"
                        : "bg-[#0A0D10] border-[#2A333C] text-[#A6B0BA] group-hover:text-[#F1F4F6]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className="text-xs font-bold font-sans text-[#F1F4F6] block leading-tight pt-1">
                    {node.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#707B85] block truncate">
                    {node.layer}
                  </span>
                </div>

                {/* Latency & Telemetry */}
                <div className="pt-2 border-t border-[#1B2229] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#707B85]">Latency:</span>
                  <span className={isSelected ? "text-[#4BC7B5] font-semibold" : "text-[#A6B0BA]"}>
                    {node.latency}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Layer Dossier / Metadata Panel */}
      <div className="p-4 rounded-md bg-[#0A0D10] border border-[#2A333C] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[#4BC7B5] font-semibold">{activeNode.name}</span>
            <span className="text-[#707B85]">•</span>
            <span className="text-[#A6B0BA] text-[11px]">{activeNode.type}</span>
          </div>
          <p className="text-[#A6B0BA] text-[11px] font-sans leading-relaxed">
            {activeNode.description}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-[11px] border-t md:border-t-0 pt-2 md:pt-0 border-[#1B2229]">
          <div className="space-y-0.5">
            <span className="text-[9px] text-[#707B85] uppercase block">Security Constraints</span>
            <span className="text-[#F1F4F6]">{activeNode.specs}</span>
          </div>
          <div className="space-y-0.5 pl-4 border-l border-[#2A333C]">
            <span className="text-[9px] text-[#707B85] uppercase block">Assurance State</span>
            <span className="text-[#42B883] font-semibold">ZERO BYPASS VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
