"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Layers,
  FileCheck,
  Zap,
  ArrowRight,
  Server,
  Database,
  Lock,
  Play,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Eye,
  RefreshCw,
  Box,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MetricCard } from "@/components/ui/MetricCard";
import { LiveCounter } from "@/components/ui/LiveCounter";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { DimensionalTopology } from "@/components/dimensional/DimensionalTopology";
import { DimensionalSandboxMatrix } from "@/components/dimensional/DimensionalSandboxMatrix";
import { apiGetObservabilityMetrics, apiGetThreatFeed } from "@/lib/api";

export default function OverviewPage() {
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<"5m" | "15m" | "1h" | "6h" | "24h">("24h");
  const [architectureTab, setArchitectureTab] = useState<"topology" | "sandboxes" | "pillars">("topology");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [liveMetrics, setLiveMetrics] = useState<any>(null);
  const [threatEvents, setThreatEvents] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const metrics = await apiGetObservabilityMetrics();
        setLiveMetrics(metrics);
        const threats = await apiGetThreatFeed(6);
        setThreatEvents(threats);
      } catch (err) {
        console.warn("API Telemetry initial load:", err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Time-range specific request telemetry data
  const telemetryDataSets: Record<
    "5m" | "15m" | "1h" | "6h" | "24h",
    Array<{ time: string; requests: number; latency: number; errors: number }>
  > = {
    "5m": [
      { time: "15:40", requests: 48, latency: 22, errors: 0 },
      { time: "15:41", requests: 52, latency: 24, errors: 0 },
      { time: "15:42", requests: 64, latency: 26, errors: 0 },
      { time: "15:43", requests: 58, latency: 23, errors: 0 },
      { time: "15:44", requests: 61, latency: 25, errors: 0 },
      { time: "NOW", requests: 59, latency: 24, errors: 0 },
    ],
    "15m": [
      { time: "15:30", requests: 140, latency: 23, errors: 0 },
      { time: "15:33", requests: 162, latency: 25, errors: 0 },
      { time: "15:36", requests: 180, latency: 28, errors: 1 },
      { time: "15:39", requests: 175, latency: 24, errors: 0 },
      { time: "15:42", requests: 190, latency: 26, errors: 0 },
      { time: "NOW", requests: 184, latency: 24, errors: 0 },
    ],
    "1h": [
      { time: "14:45", requests: 620, latency: 26, errors: 0 },
      { time: "15:00", requests: 780, latency: 28, errors: 1 },
      { time: "15:15", requests: 840, latency: 29, errors: 0 },
      { time: "15:30", requests: 790, latency: 25, errors: 0 },
      { time: "NOW", requests: 810, latency: 24, errors: 0 },
    ],
    "6h": [
      { time: "10:00", requests: 1850, latency: 32, errors: 2 },
      { time: "11:30", requests: 2400, latency: 35, errors: 1 },
      { time: "13:00", requests: 2900, latency: 38, errors: 3 },
      { time: "14:30", requests: 2750, latency: 31, errors: 1 },
      { time: "NOW", requests: 2820, latency: 24, errors: 0 },
    ],
    "24h": [
      { time: "00:00", requests: 780, latency: 21, errors: 0 },
      { time: "04:00", requests: 520, latency: 19, errors: 0 },
      { time: "08:00", requests: 1850, latency: 27, errors: 1 },
      { time: "12:00", requests: 3120, latency: 36, errors: 2 },
      { time: "16:00", requests: 2890, latency: 30, errors: 1 },
      { time: "20:00", requests: 1950, latency: 25, errors: 0 },
      { time: "NOW", requests: 1680, latency: 24, errors: 0 },
    ],
  };

  const currentChartData = telemetryDataSets[timeRange];

  // 7-Service System Health Matrix as requested in Section 12
  const systemStatusMatrix = [
    {
      name: "Frontend Console",
      role: "Next.js 14 SSR",
      status: "HEALTHY",
      latency: "12 ms",
      availability: "99.99%",
      lastChecked: "Just now",
      icon: Server,
    },
    {
      name: "API Gateway",
      role: "7-Stage Pipeline",
      status: "ENFORCING",
      latency: "22 ms",
      availability: "99.98%",
      lastChecked: "2s ago",
      icon: Zap,
    },
    {
      name: "LLM Engine",
      role: "Airgap Sandboxes",
      status: "STANDBY",
      latency: "135 ms",
      availability: "100%",
      lastChecked: "5s ago",
      icon: Cpu,
    },
    {
      name: "Policy Engine",
      role: "Dual-Blind Filters",
      status: "ENFORCING",
      latency: "6.8 ms",
      availability: "100%",
      lastChecked: "Just now",
      icon: ShieldCheck,
    },
    {
      name: "Data Layer",
      role: "Schema Isolation",
      status: "ISOLATED",
      latency: "3.8 ms",
      availability: "100%",
      lastChecked: "1s ago",
      icon: Database,
    },
    {
      name: "Kubernetes CNI",
      role: "Default-Deny",
      status: "ENFORCING",
      latency: "18 ms",
      availability: "99.95%",
      lastChecked: "3s ago",
      icon: Layers,
    },
    {
      name: "Audit Layer",
      role: "SHA-256 Ledger",
      status: "SEALED",
      latency: "2.8 ms",
      availability: "100%",
      lastChecked: "Just now",
      icon: FileCheck,
    },
  ];

  // Live real-time activity feed
  const liveActivities = [
    {
      id: "ev-001",
      timestamp: "15:42:12",
      type: "MODEL EXECUTED",
      actor: "sec_operator",
      resource: "Bayora Core AI (sbx-finance)",
      latency: "138 ms",
      decision: "COMPLETED",
      severity: "info",
      details: "Direct banking inquiry completed in sandboxed finance core. Zero canary token leakage.",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    {
      id: "ev-002",
      timestamp: "15:42:10",
      type: "GUARDRAIL TRIGGERED",
      actor: "red_eval_suite",
      resource: "Rule #BR-001 (DAN Interceptor)",
      latency: "6.4 ms",
      decision: "BLOCKED",
      severity: "danger",
      details: "Stage 4 Input Filter heuristic identified jailbreak override pattern. Request denied.",
      hash: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    },
    {
      id: "ev-003",
      timestamp: "15:42:08",
      type: "POLICY CHECK",
      actor: "blue_analyst",
      resource: "Gateway RBAC Validator",
      latency: "2.1 ms",
      decision: "PASSED",
      severity: "success",
      details: "Caller role blue_operator verified. Access to raw red payloads denied per dual-blind policy.",
      hash: "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
    },
    {
      id: "ev-004",
      timestamp: "15:42:05",
      type: "RESOURCE LIMIT",
      actor: "tenant_quota_daemon",
      resource: "RateLimiter (RPM Token Bucket)",
      latency: "1.0 ms",
      decision: "SYNCHRONIZED",
      severity: "amber",
      details: "Synchronized RPM bucket for tenant sbx-finance-prod. Available quota: 60/60 RPM.",
      hash: "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
    },
    {
      id: "ev-005",
      timestamp: "15:41:49",
      type: "AUDIT WRITTEN",
      actor: "gateway_evidence_pipeline",
      resource: "Block #108 (Merkle Head)",
      latency: "2.8 ms",
      decision: "SEALED",
      severity: "teal",
      details: "SHA-256 continuous hash link sealed to head: H(N) = SHA256(H(N-1) || EventPayload).",
      hash: "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Top Header Region */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#2A333C]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#42B883] animate-pulse" />
            <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F1F4F6]">
              BAYORA SECURITY CONTROL CENTER
            </h1>
            <Badge variant="teal" size="xs">
              AIRGAP v2.5
            </Badge>
          </div>
          <p className="text-xs text-[#A6B0BA] max-w-2xl font-sans">
            Enterprise visibility across isolated sandboxes, 7-stage enforcement pipelines, and cryptographic audit proofs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/red">
            <Button variant="danger" size="sm" icon={<Flame className="w-3.5 h-3.5" />}>
              Adversarial Probe
            </Button>
          </Link>
          <Link href="/blue">
            <Button variant="outline" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              Deploy Guardrail
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="primary" size="sm" icon={<Play className="w-3.5 h-3.5" />}>
              Security Walkthrough
            </Button>
          </Link>
        </div>
      </div>

      {/* Top KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard
          label="TOTAL INGRESS REQUESTS"
          value={<LiveCounter value={24821} />}
          trend={{ value: "+12.4%", direction: "up", context: "vs 24h peak" }}
          sparklineData={[30, 42, 38, 55, 62, 70, 85]}
          statusColor="teal"
          badgeText="TODAY"
        />
        <MetricCard
          label="ACTIVE AIRGAP PODS"
          value="3 Sandboxes"
          trend={{ value: "100%", direction: "neutral", context: "Airgap active" }}
          sparklineData={[3, 3, 3, 3, 3, 3, 3]}
          statusColor="indigo"
          badgeText="STRICT"
        />
        <MetricCard
          label="SECURITY THREATS"
          value={<LiveCounter value={threatEvents.length > 0 ? threatEvents.length * 28 + 12 : 189} />}
          trend={{ value: "18 Blocked", direction: "up", context: "Dual-blind" }}
          sparklineData={[12, 18, 14, 25, 20, 28, 34]}
          statusColor="danger"
          badgeText="INTERCEPTED"
        />
        <MetricCard
          label="EVALUATION BENCHMARKS"
          value="42 Suites"
          trend={{ value: "98.2%", direction: "up", context: "Pass rate" }}
          sparklineData={[92, 94, 95, 96, 98, 98, 98]}
          statusColor="green"
          badgeText="OWASP LLM"
        />
        <MetricCard
          label="GATEWAY LATENCY P50"
          value="22.4 ms"
          trend={{ value: "-3.2 ms", direction: "down", context: "Optimized" }}
          sparklineData={[28, 26, 25, 24, 23, 23, 22]}
          statusColor="green"
          badgeText="mTLS MESH"
        />
      </div>

      {/* Observability Telemetry & Security Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Observability Telemetry Chart (8 cols) */}
        <div className="lg:col-span-8 surface-panel p-5 space-y-3 bg-[#11161B] border border-[#2A333C] rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2A333C]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#4BC7B5]" />
                <h3 className="font-heading font-semibold text-xs text-[#F1F4F6]">
                  Gateway Pipeline Throughput & Latency Observability
                </h3>
              </div>
              <p className="text-[10px] text-[#A6B0BA] font-mono">
                Real-time ingress requests/minute and end-to-end 7-stage conduit execution time.
              </p>
            </div>

            {/* Time-Range Selector */}
            <div className="flex items-center gap-1 bg-[#0A0D10] p-1 rounded border border-[#2A333C]">
              {(["5m", "15m", "1h", "6h", "24h"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                    timeRange === r
                      ? "bg-[#171D23] text-[#4BC7B5] font-semibold border border-[#2A333C]"
                      : "text-[#707B85] hover:text-[#A6B0BA]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 pt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentChartData}
                  margin={{ top: 8, right: 10, left: -22, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="reqGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4BC7B5" stopOpacity={0.16} />
                      <stop offset="95%" stopColor="#4BC7B5" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="latGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6675D9" stopOpacity={0.14} />
                      <stop offset="95%" stopColor="#6675D9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#707B85", fontSize: 10, fontFamily: "IBM Plex Mono" }}
                    axisLine={{ stroke: "#2A333C" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#707B85", fontSize: 10, fontFamily: "IBM Plex Mono" }}
                    axisLine={{ stroke: "#2A333C" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0A0D10",
                      borderColor: "#2A333C",
                      color: "#F1F4F6",
                      fontSize: 11,
                      fontFamily: "IBM Plex Mono",
                      borderRadius: 4,
                      boxShadow: "none",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    name="Throughput (Req/m)"
                    stroke="#4BC7B5"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#reqGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="latency"
                    name="Pipeline Latency (ms)"
                    stroke="#6675D9"
                    strokeWidth={1.25}
                    fillOpacity={1}
                    fill="url(#latGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#707B85] font-mono">
                Loading live telemetry visualizer...
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1B2229] text-[10px] font-mono text-[#707B85]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4BC7B5]" />
                Throughput (Req/m)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6675D9]" />
                Pipeline Latency (ms)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#42B883] animate-pulse" />
              <span>LIVE "NOW" MARKER ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Security Analytics Breakdown (4 cols) */}
        <div className="lg:col-span-4 surface-panel p-5 bg-[#11161B] border border-[#2A333C] rounded-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#2A333C]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#D96573]" />
                <h3 className="font-heading font-semibold text-xs text-[#F1F4F6]">
                  Security Analytics Breakdown
                </h3>
              </div>
              <Badge variant="danger" size="xs">
                INTERCEPTING
              </Badge>
            </div>

            <div className="mt-3.5 space-y-2.5 font-mono text-xs">
              <div className="p-2.5 rounded bg-[#0A0D10] border border-[#2A333C] flex items-center justify-between">
                <div>
                  <span className="font-medium text-[#D96573]">Prompt Injections (LLM01)</span>
                  <p className="text-[10px] text-[#A6B0BA] font-sans">DAN & instruction overrides</p>
                </div>
                <span className="text-sm font-bold text-[#F1F4F6]">42</span>
              </div>

              <div className="p-2.5 rounded bg-[#0A0D10] border border-[#2A333C] flex items-center justify-between">
                <div>
                  <span className="font-medium text-[#D6A856]">Canary Leak Interceptions (LLM02)</span>
                  <p className="text-[10px] text-[#A6B0BA] font-sans">PII & internal ledger tokens</p>
                </div>
                <span className="text-sm font-bold text-[#F1F4F6]">18</span>
              </div>

              <div className="p-2.5 rounded bg-[#0A0D10] border border-[#2A333C] flex items-center justify-between">
                <div>
                  <span className="font-medium text-[#6675D9]">Model Extraction Probes (LLM10)</span>
                  <p className="text-[10px] text-[#A6B0BA] font-sans">Reverse-engineering queries</p>
                </div>
                <span className="text-sm font-bold text-[#F1F4F6]">7</span>
              </div>

              <div className="p-2.5 rounded bg-[#0A0D10] border border-[#2A333C] flex items-center justify-between">
                <div>
                  <span className="font-medium text-[#42B883]">Cryptographic Ledger Proofs</span>
                  <p className="text-[10px] text-[#A6B0BA] font-sans">Continuous SHA-256 integrity</p>
                </div>
                <span className="text-sm font-bold text-[#42B883]">100%</span>
              </div>
            </div>
          </div>

          <Link href="/blue" className="w-full pt-1">
            <Button variant="outline" size="sm" className="w-full justify-between">
              <span>Inspect Security Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Architecture Perspectives Tabs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A333C] pb-2 text-xs font-mono">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setArchitectureTab("topology")}
              className={`pb-2 px-1 font-semibold transition border-b-2 ${
                architectureTab === "topology"
                  ? "border-[#4BC7B5] text-[#4BC7B5]"
                  : "border-transparent text-[#707B85] hover:text-[#A6B0BA]"
              }`}
            >
              System Topology (Dimensional)
            </button>
            <button
              onClick={() => setArchitectureTab("sandboxes")}
              className={`pb-2 px-1 font-semibold transition border-b-2 ${
                architectureTab === "sandboxes"
                  ? "border-[#4BC7B5] text-[#4BC7B5]"
                  : "border-transparent text-[#707B85] hover:text-[#A6B0BA]"
              }`}
            >
              Sandbox Isolation Matrix
            </button>
            <button
              onClick={() => setArchitectureTab("pillars")}
              className={`pb-2 px-1 font-semibold transition border-b-2 ${
                architectureTab === "pillars"
                  ? "border-[#4BC7B5] text-[#4BC7B5]"
                  : "border-transparent text-[#707B85] hover:text-[#A6B0BA]"
              }`}
            >
              4-Pillar Zone Conduit
            </button>
          </div>

          <span className="hidden md:inline text-[11px] text-[#707B85]">
            Architectural Assurance: Default-Deny Ingress
          </span>
        </div>

        {architectureTab === "topology" && <DimensionalTopology />}
        {architectureTab === "sandboxes" && <DimensionalSandboxMatrix />}
        {architectureTab === "pillars" && <ArchitectureDiagram />}
      </div>

      {/* 7-Service Subsystem Health Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-[#42B883]" />
            <h3 className="font-heading font-semibold text-xs text-[#F1F4F6]">
              Subsystem Health Telemetry (7 Core Services)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#707B85]">
            All services operating within SLA boundaries
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
          {systemStatusMatrix.map((sub, idx) => {
            const Icon = sub.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-md bg-[#11161B] border border-[#2A333C] hover:border-[#384450] transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F1F4F6] font-sans truncate">
                    {sub.name}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#42B883] animate-pulse" />
                </div>
                <p className="text-[10px] font-mono text-[#707B85] truncate">
                  {sub.role}
                </p>
                <div className="pt-1.5 border-t border-[#1B2229] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#42B883] font-medium">{sub.status}</span>
                  <span className="text-[#A6B0BA]">{sub.latency}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Operational Activity Feed */}
      <div className="surface-panel p-5 bg-[#11161B] border border-[#2A333C] rounded-lg space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2A333C]">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4BC7B5] animate-pulse" />
              <h3 className="font-heading font-semibold text-xs text-[#F1F4F6]">
                Live Operational Activity Stream
              </h3>
            </div>
            <p className="text-[10px] text-[#A6B0BA] font-mono mt-0.5">
              Click any event row to inspect full telemetry, execution timeline, and cryptographic evidence.
            </p>
          </div>

          <Link href="/observability">
            <Button variant="ghost" size="xs" icon={<Eye className="w-3 h-3" />}>
              Open Telemetry Console
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-[#1B2229]">
          {liveActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => setSelectedEvent(act)}
              className="py-2.5 px-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5 hover:bg-[#171D23]/60 rounded transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-[#707B85] shrink-0">
                  {act.timestamp}
                </span>
                <Badge
                  variant={
                    act.severity === "danger"
                      ? "danger"
                      : act.severity === "amber"
                      ? "warning"
                      : act.severity === "teal"
                      ? "teal"
                      : act.severity === "indigo"
                      ? "indigo"
                      : "success"
                  }
                  size="xs"
                >
                  {act.type}
                </Badge>
                <span className="text-xs font-mono text-[#F1F4F6] font-medium truncate max-w-xs">
                  {act.resource}
                </span>
                <span className="hidden lg:inline text-xs text-[#A6B0BA] truncate max-w-sm">
                  {act.details}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono shrink-0">
                <span className="text-[#707B85] text-[11px]">{act.latency}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    act.decision === "BLOCKED"
                      ? "bg-[#D96573]/15 text-[#D96573] border border-[#D96573]/30"
                      : act.decision === "SYNCHRONIZED" || act.decision === "SEALED"
                      ? "bg-[#D6A856]/15 text-[#D6A856] border border-[#D6A856]/30"
                      : "bg-[#42B883]/15 text-[#42B883] border border-[#42B883]/30"
                  }`}
                >
                  {act.decision}
                </span>
                <ArrowRight className="w-3 h-3 text-[#707B85] group-hover:text-[#4BC7B5] transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Inspection Drawer */}
      <Drawer
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.type || "Security Event"}
        subtitle={`Event ID: ${selectedEvent?.id} • Timestamp: ${selectedEvent?.timestamp}`}
        badge={{
          text: selectedEvent?.decision || "LOGGED",
          variant: selectedEvent?.decision === "BLOCKED" ? "danger" : "teal",
        }}
        evidenceHash={selectedEvent?.hash}
        metadata={
          selectedEvent
            ? {
                EventId: selectedEvent.id,
                Timestamp: selectedEvent.timestamp,
                Actor: selectedEvent.actor,
                Resource: selectedEvent.resource,
                Decision: selectedEvent.decision,
                Latency: selectedEvent.latency,
              }
            : undefined
        }
        timeline={
          selectedEvent
            ? [
                { time: "00.0ms", stage: "Ingress Gateway Auth", status: "PASSED", detail: "JWT token verified" },
                { time: "02.1ms", stage: "RBAC Zone Policy", status: "PASSED", detail: "Zone boundary confirmed" },
                {
                  time: "06.4ms",
                  stage: "Guardrail Inspection",
                  status: selectedEvent.decision === "BLOCKED" ? "BLOCKED" : "PASSED",
                  detail: selectedEvent.details,
                },
                { time: "128.0ms", stage: "Evidence Seal", status: "EXECUTED", detail: "SHA-256 continuous hash link written" },
              ]
            : undefined
        }
        rawJson={selectedEvent}
        actions={
          <Button variant="primary" size="sm" onClick={() => setSelectedEvent(null)}>
            Dismiss Inspector
          </Button>
        }
      >
        {selectedEvent && (
          <div className="space-y-3.5 text-xs font-mono">
            <div className="p-3 rounded bg-[#0A0D10] border border-[#2A333C] space-y-1">
              <span className="text-[#707B85] uppercase text-[10px] block">Target Resource</span>
              <span className="text-xs font-bold text-[#F1F4F6]">{selectedEvent.resource}</span>
            </div>

            <div className="p-3 rounded bg-[#0A0D10] border border-[#2A333C] space-y-1">
              <span className="text-[#707B85] uppercase text-[10px] block">Event Description</span>
              <p className="text-xs text-[#A6B0BA] font-sans leading-relaxed">
                {selectedEvent.details}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded bg-[#0A0D10] border border-[#2A333C]">
                <span className="text-[10px] text-[#707B85] block">Latency</span>
                <span className="text-xs font-bold text-[#4BC7B5]">{selectedEvent.latency}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0A0D10] border border-[#2A333C]">
                <span className="text-[10px] text-[#707B85] block">Decision</span>
                <span className="text-xs font-bold text-[#42B883]">{selectedEvent.decision}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
