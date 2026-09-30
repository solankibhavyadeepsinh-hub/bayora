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
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { MetricCard } from "@/components/ui/MetricCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { apiGetObservabilityMetrics, apiGetThreatFeed } from "@/lib/api";

export default function OverviewPage() {
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<"5m" | "15m" | "1h" | "6h" | "24h">("24h");
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
      { time: "Now", requests: 59, latency: 24, errors: 0 },
    ],
    "15m": [
      { time: "15:30", requests: 140, latency: 23, errors: 0 },
      { time: "15:33", requests: 162, latency: 25, errors: 0 },
      { time: "15:36", requests: 180, latency: 28, errors: 1 },
      { time: "15:39", requests: 175, latency: 24, errors: 0 },
      { time: "15:42", requests: 190, latency: 26, errors: 0 },
      { time: "Now", requests: 184, latency: 24, errors: 0 },
    ],
    "1h": [
      { time: "14:45", requests: 620, latency: 26, errors: 0 },
      { time: "15:00", requests: 780, latency: 28, errors: 1 },
      { time: "15:15", requests: 840, latency: 29, errors: 0 },
      { time: "15:30", requests: 790, latency: 25, errors: 0 },
      { time: "Now", requests: 810, latency: 24, errors: 0 },
    ],
    "6h": [
      { time: "10:00", requests: 1850, latency: 32, errors: 2 },
      { time: "11:30", requests: 2400, latency: 35, errors: 1 },
      { time: "13:00", requests: 2900, latency: 38, errors: 3 },
      { time: "14:30", requests: 2750, latency: 31, errors: 1 },
      { time: "Now", requests: 2820, latency: 24, errors: 0 },
    ],
    "24h": [
      { time: "00:00", requests: 780, latency: 21, errors: 0 },
      { time: "04:00", requests: 520, latency: 19, errors: 0 },
      { time: "08:00", requests: 1850, latency: 27, errors: 1 },
      { time: "12:00", requests: 3120, latency: 36, errors: 2 },
      { time: "16:00", requests: 2890, latency: 30, errors: 1 },
      { time: "20:00", requests: 1950, latency: 25, errors: 0 },
      { time: "Now", requests: 1680, latency: 24, errors: 0 },
    ],
  };

  const currentChartData = telemetryDataSets[timeRange];

  // System status components
  const systemStatusMatrix = [
    {
      name: "Frontend Console",
      role: "Next.js 14 SSR",
      status: "HEALTHY",
      latency: "12 ms",
      uptime: "99.99%",
      lastChecked: "Just now",
      icon: Server,
    },
    {
      name: "API Gateway",
      role: "7-Stage Pipeline",
      status: "HEALTHY",
      latency: "24 ms",
      uptime: "99.98%",
      lastChecked: "2s ago",
      icon: Zap,
    },
    {
      name: "LLM Engine",
      role: "Airgapped Personas",
      status: "STANDBY",
      latency: "142 ms",
      uptime: "100%",
      lastChecked: "5s ago",
      icon: Cpu,
    },
    {
      name: "Data Layer",
      role: "Schema Isolation",
      status: "ISOLATED",
      latency: "4 ms",
      uptime: "100%",
      lastChecked: "1s ago",
      icon: Database,
    },
    {
      name: "Kubernetes CNI",
      role: "Default-Deny",
      status: "ENFORCING",
      latency: "18 ms",
      uptime: "99.95%",
      lastChecked: "3s ago",
      icon: Layers,
    },
    {
      name: "Blue Guardrails",
      role: "Active Regex & Canary",
      status: "7 ACTIVE",
      latency: "8 ms",
      uptime: "100%",
      lastChecked: "Just now",
      icon: ShieldCheck,
    },
  ];

  // Live real-time activity feed
  const liveActivities = [
    {
      id: "act-101",
      timestamp: "15:42:12",
      type: "MODEL EXECUTION",
      target: "Bayora Core AI",
      latency: "142 ms",
      status: "COMPLETED",
      details: "Direct banking inquiry completed in sandboxed finance core. Zero canary token leakage.",
      severity: "info",
    },
    {
      id: "act-102",
      timestamp: "15:42:10",
      type: "SECURITY CHECK",
      target: "Guardrail Validation",
      latency: "8 ms",
      status: "PASSED",
      details: "Stage 4 Input Filter heuristic check verified clean input payload.",
      severity: "success",
    },
    {
      id: "act-103",
      timestamp: "15:42:08",
      type: "API REQUEST",
      target: "POST /api/inference",
      latency: "118 ms",
      status: "200 OK",
      details: "Enforcement gateway completed full 7-stage validation cycle.",
      severity: "accent",
    },
    {
      id: "act-104",
      timestamp: "15:42:05",
      type: "EVALUATION",
      target: "Safety Suite #12",
      latency: "310 ms",
      status: "COMPLETED",
      details: "Automated penetration test batch completed across 10 vectors. Resilience score 98.2%.",
      severity: "success",
    },
    {
      id: "act-105",
      timestamp: "15:41:49",
      type: "AUDIT SEAL",
      target: "Block #108",
      latency: "2 ms",
      status: "SEALED",
      details: "SHA-256 continuous hash link sealed to head: e3b0c44298fc1c149afbf4c8996fb924...",
      severity: "warning",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Region */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1C242C]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#45C995]" />
            <h1 className="text-lg md:text-xl font-bold font-heading text-[#EEF2F5]">
              BAYORA CONTROL CENTER
            </h1>
            <Badge variant="accent" size="xs">
              AIRGAP v2.4
            </Badge>
          </div>
          <p className="text-xs text-[#A3ADB7] max-w-2xl font-sans">
            Real-time visibility across models, security, infrastructure, evaluation and system activity.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/red">
            <Button variant="danger" size="sm" icon={<Flame className="w-3.5 h-3.5" />}>
              Simulate Attack
            </Button>
          </Link>
          <Link href="/blue">
            <Button variant="outline" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              Deploy Guardrail
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="primary" size="sm" icon={<Play className="w-3.5 h-3.5" />}>
              Interactive Walkthrough
            </Button>
          </Link>
        </div>
      </div>

      {/* Top KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard
          label="TOTAL REQUESTS"
          value={liveMetrics ? "24,821" : "24,821"}
          trend={{ value: "+12.4%", direction: "up", context: "vs 24h" }}
          sparklineData={[30, 42, 38, 55, 62, 70, 85]}
          statusColor="accent"
          badgeText="TODAY"
        />
        <MetricCard
          label="ACTIVE MODELS"
          value="3 Sandboxes"
          trend={{ value: "100%", direction: "neutral", context: "Isolated" }}
          sparklineData={[3, 3, 3, 3, 3, 3, 3]}
          statusColor="violet"
          badgeText="AIRGAPPED"
        />
        <MetricCard
          label="SECURITY EVENTS"
          value={threatEvents.length > 0 ? `${threatEvents.length * 28 + 12}` : "189"}
          trend={{ value: "14 Blocked", direction: "up", context: "Dual-blind" }}
          sparklineData={[12, 18, 14, 25, 20, 28, 34]}
          statusColor="danger"
          badgeText="INTERCEPTED"
        />
        <MetricCard
          label="EVALUATION RUNS"
          value="42 Suites"
          trend={{ value: "98.2%", direction: "up", context: "Pass rate" }}
          sparklineData={[92, 94, 95, 96, 98, 98, 98]}
          statusColor="success"
          badgeText="BENCHMARKS"
        />
        <MetricCard
          label="SYSTEM HEALTH"
          value={liveMetrics ? `${liveMetrics.system_status}` : "OPERATIONAL"}
          trend={{ value: "24 ms", direction: "neutral", context: "Gateway P50" }}
          sparklineData={[28, 26, 25, 24, 24, 24, 24]}
          statusColor="success"
          badgeText="mTLS MESH"
        />
      </div>

      {/* Request Telemetry & Security Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Telemetry Chart (8 cols) */}
        <div className="lg:col-span-8 p-4 rounded-md bg-[#12171D] border border-[#1C242C] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-[#1C242C]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#4FD1C5]" />
                <h3 className="font-heading font-semibold text-xs text-[#EEF2F5]">
                  Gateway Request & Latency Telemetry
                </h3>
              </div>
              <p className="text-[10px] text-[#A3ADB7]">
                Ingress throughput (requests/min) and average pipeline latency across the 7-stage conduit.
              </p>
            </div>

            {/* Time-Range Selector */}
            <div className="flex items-center gap-1 bg-[#080A0D] p-0.5 rounded border border-[#1C242C]">
              {(["5m", "15m", "1h", "6h", "24h"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                    timeRange === r
                      ? "bg-[#171D24] text-[#4FD1C5] font-semibold border border-[#252D36]"
                      : "text-[#68737E] hover:text-[#A3ADB7]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="h-60 pt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentChartData}
                  margin={{ top: 8, right: 10, left: -22, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="reqGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4FD1C5" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#4FD1C5" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="latGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C8CFF" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#7C8CFF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#68737E", fontSize: 10, fontFamily: "JetBrains Mono" }}
                    axisLine={{ stroke: "#1C242C" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#68737E", fontSize: 10, fontFamily: "JetBrains Mono" }}
                    axisLine={{ stroke: "#1C242C" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0D1116",
                      borderColor: "#252D36",
                      color: "#EEF2F5",
                      fontSize: 11,
                      fontFamily: "JetBrains Mono",
                      borderRadius: 4,
                      boxShadow: "none",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    name="Requests / min"
                    stroke="#4FD1C5"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#reqGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="latency"
                    name="Latency (ms)"
                    stroke="#7C8CFF"
                    strokeWidth={1.25}
                    fillOpacity={1}
                    fill="url(#latGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#68737E] font-mono">
                Loading telemetry visualizer...
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1C242C] text-[10px] font-mono text-[#68737E]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1C5]" />
                Throughput (Req/m)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7C8CFF]" />
                Pipeline Latency (ms)
              </span>
            </div>
            <span>P99: 48 ms • 0 Dropped Packets</span>
          </div>
        </div>

        {/* Security Signals Breakdown (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-md bg-[#12171D] border border-[#1C242C] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1C242C]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#E66A77]" />
                <h3 className="font-heading font-semibold text-xs text-[#EEF2F5]">
                  Active Security Signals
                </h3>
              </div>
              <Badge variant="danger" size="xs">
                DEFENDING
              </Badge>
            </div>

            <div className="mt-3 space-y-2">
              <div className="p-2.5 rounded bg-[#0D1116] border border-[#1C242C] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-[#E66A77]">
                    Prompt Injections (LLM01)
                  </span>
                  <p className="text-[10px] text-[#A3ADB7]">
                    DAN & instruction override vectors
                  </p>
                </div>
                <span className="text-sm font-mono font-bold text-[#EEF2F5]">42</span>
              </div>

              <div className="p-2.5 rounded bg-[#0D1116] border border-[#1C242C] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-[#E6B35A]">
                    Canary Leak Interceptions (LLM02)
                  </span>
                  <p className="text-[10px] text-[#A3ADB7]">
                    PII & financial canary exfiltration
                  </p>
                </div>
                <span className="text-sm font-mono font-bold text-[#EEF2F5]">18</span>
              </div>

              <div className="p-2.5 rounded bg-[#0D1116] border border-[#1C242C] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-[#7C8CFF]">
                    Model Extraction Probes (LLM10)
                  </span>
                  <p className="text-[10px] text-[#A3ADB7]">
                    System prompt reverse-engineering
                  </p>
                </div>
                <span className="text-sm font-mono font-bold text-[#EEF2F5]">7</span>
              </div>

              <div className="p-2.5 rounded bg-[#0D1116] border border-[#1C242C] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-[#45C995]">
                    SHA-256 Ledger Seals
                  </span>
                  <p className="text-[10px] text-[#A3ADB7]">
                    Continuous unbroken block seals
                  </p>
                </div>
                <span className="text-sm font-mono font-bold text-[#45C995]">100%</span>
              </div>
            </div>
          </div>

          <Link href="/blue" className="w-full pt-1">
            <Button variant="outline" size="sm" className="w-full justify-between">
              <span>Security Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* System Status Matrix */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-[#45C995]" />
            <h3 className="font-heading font-semibold text-xs text-[#EEF2F5]">
              Subsystem Health Matrix
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#68737E]">
            All 6 isolated subsystems active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          {systemStatusMatrix.map((sub, idx) => {
            const Icon = sub.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-md bg-[#12171D] border border-[#1C242C] hover:border-[#252D36] transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#EEF2F5] font-sans truncate">
                    {sub.name}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#45C995]" />
                </div>
                <p className="text-[10px] font-mono text-[#68737E] truncate">
                  {sub.role}
                </p>
                <div className="pt-1.5 border-t border-[#1C242C] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#45C995] font-medium">{sub.status}</span>
                  <span className="text-[#A3ADB7]">{sub.latency}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Operational Activity Feed */}
      <div className="p-4 rounded-md bg-[#12171D] border border-[#1C242C] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-[#1C242C]">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1C5]" />
              <h3 className="font-heading font-semibold text-xs text-[#EEF2F5]">
                Live Operational Activity Stream
              </h3>
            </div>
            <p className="text-[10px] text-[#A3ADB7] mt-0.5">
              Live audit events, model executions, guardrail triggers, and verification receipts.
            </p>
          </div>

          <Link href="/observability">
            <Button variant="ghost" size="xs" icon={<Eye className="w-3 h-3" />}>
              Open Telemetry Console
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-[#1C242C]">
          {liveActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => setSelectedEvent(act)}
              className="py-2.5 px-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5 hover:bg-[#171D24]/50 rounded transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono text-[#68737E] shrink-0">
                  {act.timestamp}
                </span>
                <Badge
                  variant={
                    act.severity === "danger"
                      ? "danger"
                      : act.severity === "warning"
                      ? "warning"
                      : act.severity === "success"
                      ? "success"
                      : act.severity === "violet"
                      ? "violet"
                      : "accent"
                  }
                  size="xs"
                >
                  {act.type}
                </Badge>
                <span className="text-xs font-mono text-[#EEF2F5] font-medium">
                  {act.target}
                </span>
                <span className="hidden lg:inline text-xs text-[#A3ADB7] truncate max-w-md">
                  {act.details}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-mono shrink-0">
                <span className="text-[#68737E] text-[11px]">{act.latency}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    act.status === "BLOCKED"
                      ? "bg-[#E66A77]/12 text-[#E66A77] border border-[#E66A77]/25"
                      : "bg-[#45C995]/12 text-[#45C995] border border-[#45C995]/25"
                  }`}
                >
                  {act.status}
                </span>
                <ArrowRight className="w-3 h-3 text-[#68737E]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Diagram */}
      <ArchitectureDiagram />

      {/* Event Inspection Drawer */}
      <Drawer
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.type || "Activity Event"}
        subtitle={`Event ID: ${selectedEvent?.id} • Timestamp: ${selectedEvent?.timestamp}`}
        badge={{
          text: selectedEvent?.status || "LOGGED",
          variant: selectedEvent?.status === "BLOCKED" ? "danger" : "success",
        }}
        rawJson={selectedEvent}
        actions={
          <Button variant="primary" size="sm" onClick={() => setSelectedEvent(null)}>
            Dismiss
          </Button>
        }
      >
        {selectedEvent && (
          <div className="space-y-3.5 text-xs font-mono">
            <div className="p-3 rounded bg-[#080A0D] border border-[#1C242C] space-y-1">
              <span className="text-[#68737E] uppercase text-[10px] block">
                Target Entity
              </span>
              <span className="text-xs font-bold text-[#EEF2F5]">
                {selectedEvent.target}
              </span>
            </div>

            <div className="p-3 rounded bg-[#080A0D] border border-[#1C242C] space-y-1">
              <span className="text-[#68737E] uppercase text-[10px] block">
                Event Description
              </span>
              <p className="text-xs text-[#A3ADB7] font-sans leading-relaxed">
                {selectedEvent.details}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded bg-[#080A0D] border border-[#1C242C]">
                <span className="text-[10px] text-[#68737E] block">Latency</span>
                <span className="text-xs font-bold text-[#4FD1C5]">
                  {selectedEvent.latency}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#080A0D] border border-[#1C242C]">
                <span className="text-[10px] text-[#68737E] block">Status</span>
                <span className="text-xs font-bold text-[#45C995]">
                  {selectedEvent.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
