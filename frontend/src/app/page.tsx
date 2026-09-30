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
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Flame,
  Award,
  BookOpen,
  Filter,
  Eye,
  RefreshCw
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
  Cell
} from "recharts";
import { MetricCard } from "@/components/ui/MetricCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { apiGetObservabilityMetrics, apiGetThreatFeed } from "@/lib/api";

export default function OverviewPage() {
  const [mounted, setMounted] = useState(false);
  const [telemetryRange, setTelemetryRange] = useState<"1h" | "6h" | "24h">("24h");
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

  // Telemetry time series
  const telemetryData = [
    { time: "00:00", requests: 780, latency: 42, errors: 0 },
    { time: "03:00", requests: 520, latency: 38, errors: 0 },
    { time: "06:00", requests: 1100, latency: 45, errors: 1 },
    { time: "09:00", requests: 2450, latency: 54, errors: 4 },
    { time: "12:00", requests: 3120, latency: 61, errors: 2 },
    { time: "15:00", requests: 2890, latency: 50, errors: 3 },
    { time: "18:00", requests: 1950, latency: 44, errors: 1 },
    { time: "21:00", requests: 1420, latency: 41, errors: 0 },
    { time: "23:59", requests: 980, latency: 39, errors: 0 },
  ];

  // System status components
  const systemStatusMatrix = [
    {
      name: "Frontend Console",
      role: "Next.js 14 SSR",
      status: "HEALTHY",
      latency: "12 ms",
      lastChecked: "Just now",
      availability: "99.99%",
      icon: Server,
    },
    {
      name: "API Gateway",
      role: "7-Stage Pipeline",
      status: "HEALTHY",
      latency: "24 ms",
      lastChecked: "2s ago",
      availability: "99.98%",
      icon: Zap,
    },
    {
      name: "LLM Engine",
      role: "Isolated Personas",
      status: "SANDBOX READY",
      latency: "142 ms",
      lastChecked: "5s ago",
      availability: "100%",
      icon: Cpu,
    },
    {
      name: "Data Layer",
      role: "Schema Isolation",
      status: "ISOLATED",
      latency: "4 ms",
      lastChecked: "1s ago",
      availability: "100%",
      icon: Database,
    },
    {
      name: "Kubernetes CNI",
      role: "Default-Deny",
      status: "ENFORCING",
      latency: "18 ms",
      lastChecked: "3s ago",
      availability: "99.95%",
      icon: Layers,
    },
    {
      name: "Blue Guardrails",
      role: "Active Regex & Heuristics",
      status: "7 ACTIVE",
      latency: "9 ms",
      lastChecked: "Just now",
      availability: "100%",
      icon: ShieldCheck,
    },
  ];

  // Live real-time activity stream
  const liveActivities = [
    {
      id: "act-101",
      timestamp: "15:42:11",
      type: "MODEL EXECUTION",
      target: "Client-Finance-GPT-4",
      status: "COMPLETED",
      latency: "142 ms",
      details: "Direct financial query executed within sandbox boundary. Zero canary leakage detected.",
      severity: "info",
    },
    {
      id: "act-102",
      timestamp: "15:42:08",
      type: "GUARDRAIL EVENT",
      target: "Policy Check Stage 4",
      status: "BLOCKED",
      latency: "8 ms",
      details: "Adversarial DAN instruction pattern intercepted by Rule #BR-001 (DAN Jailbreak Guard).",
      severity: "danger",
    },
    {
      id: "act-103",
      timestamp: "15:42:03",
      type: "EVALUATION",
      target: "OWASP Top 10 Suite",
      status: "COMPLETED",
      latency: "310 ms",
      details: "Automated penetration batch completed across 10 vectors. Resilience score 98.2%.",
      severity: "success",
    },
    {
      id: "act-104",
      timestamp: "15:41:49",
      type: "AUDIT SEAL",
      target: "Block #108",
      status: "SEALED",
      latency: "2 ms",
      details: "SHA-256 hash continuous link sealed: e3b0c44298fc1c149afbf4c8996fb924...",
      severity: "warning",
    },
    {
      id: "act-105",
      timestamp: "15:41:12",
      type: "CANARY PROBE",
      target: "Client-Healthcare-LLM",
      status: "DEFENDED",
      latency: "11 ms",
      details: "Output filter intercepted synthetic SSN token match [SSN-CANARY-9821]. Content redacted.",
      severity: "violet",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header Region */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#1B252F]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[#38D996] animate-pulse" />
            <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F5F7FA]">
              BAYORA CONTROL CENTER
            </h1>
            <Badge variant="cyan" size="xs">
              AIRGAP v2.4
            </Badge>
          </div>
          <p className="text-xs text-[#A4AFBC] max-w-2xl font-sans">
            Real-time visibility across models, security, infrastructure, evaluation and system activity.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard
          label="TOTAL REQUESTS"
          value={liveMetrics ? "24,821" : "24,821"}
          trend={{ value: "+12.4%", direction: "up", context: "vs 24h" }}
          sparklineData={[30, 42, 38, 55, 62, 70, 85]}
          statusColor="cyan"
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
          trend={{ value: "48 ms", direction: "neutral", context: "Avg latency" }}
          sparklineData={[52, 49, 48, 50, 47, 48, 48]}
          statusColor="success"
          badgeText="mTLS MESH"
        />
      </div>

      {/* Request Telemetry & Pipeline Latency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Telemetry Chart */}
        <div className="lg:col-span-2 p-5 rounded-lg bg-[#101720] border border-[#1B252F] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1B252F]">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#39D9FF]" />
                <h3 className="font-heading font-semibold text-sm text-[#F5F7FA]">
                  Gateway Pipeline Telemetry
                </h3>
              </div>
              <p className="text-[11px] text-[#A4AFBC] mt-0.5">
                Ingress throughput (requests/min) and average latency across the 7-stage enforcement bus.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-[#070A0F] p-1 rounded-md border border-[#1B252F]">
              {(["1h", "6h", "24h"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTelemetryRange(r)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded transition ${
                    telemetryRange === r
                      ? "bg-[#151D27] text-[#39D9FF] font-semibold border border-[#25303C]"
                      : "text-[#6C7886] hover:text-[#A4AFBC]"
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 pt-2">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="reqGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#39D9FF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#39D9FF" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="latGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8C7DFF" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8C7DFF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fill: "#6C7886", fontSize: 10 }} axisLine={false} />
                  <YAxis tick={{ fill: "#6C7886", fontSize: 10 }} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B1017",
                      borderColor: "#25303C",
                      color: "#F5F7FA",
                      fontSize: 11,
                      fontFamily: "JetBrains Mono",
                      borderRadius: 6,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    name="Requests / min"
                    stroke="#39D9FF"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#reqGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="latency"
                    name="Latency (ms)"
                    stroke="#8C7DFF"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#latGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#6C7886] font-mono">
                Loading telemetry visualizer...
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1B252F] text-[11px] font-mono text-[#6C7886]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#39D9FF]" />
                Throughput (Req/m)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#8C7DFF]" />
                Pipeline Latency (ms)
              </span>
            </div>
            <span>P99: 72 ms • 0 Drops</span>
          </div>
        </div>

        {/* Security Signals Breakdown */}
        <div className="p-5 rounded-lg bg-[#101720] border border-[#1B252F] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1B252F]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FF6074]" />
                <h3 className="font-heading font-semibold text-sm text-[#F5F7FA]">
                  Active Security Signals
                </h3>
              </div>
              <Badge variant="danger" size="xs">
                DEFENDING
              </Badge>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-md bg-[#0B1017] border border-[#1B252F] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-[#FF6074]">
                    Prompt Injections (LLM01)
                  </span>
                  <p className="text-[10px] text-[#A4AFBC] mt-0.5">
                    DAN & instruction override vectors
                  </p>
                </div>
                <span className="text-sm font-mono font-bold text-[#F5F7FA]">42</span>
              </div>

              <div className="p-3 rounded-md bg-[#0B1017] border border-[#1B252F] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-[#FFB84D]">
                    Canary Leak Interceptions (LLM02)
                  </span>
                  <p className="text-[10px] text-[#A4AFBC] mt-0.5">
                    PII & financial canary exfiltration
                  </p>
                </div>
                <span className="text-sm font-mono font-bold text-[#F5F7FA]">18</span>
              </div>

              <div className="p-3 rounded-md bg-[#0B1017] border border-[#1B252F] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-[#8C7DFF]">
                    Model Extraction Probes (LLM10)
                  </span>
                  <p className="text-[10px] text-[#A4AFBC] mt-0.5">
                    System prompt reverse-engineering
                  </p>
                </div>
                <span className="text-sm font-mono font-bold text-[#F5F7FA]">7</span>
              </div>

              <div className="p-3 rounded-md bg-[#0B1017] border border-[#1B252F] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-[#38D996]">
                    SHA-256 Ledger Seals
                  </span>
                  <p className="text-[10px] text-[#A4AFBC] mt-0.5">
                    Continuous unbroken block seals
                  </p>
                </div>
                <span className="text-sm font-mono font-bold text-[#38D996]">100%</span>
              </div>
            </div>
          </div>

          <Link href="/blue" className="w-full">
            <Button variant="outline" size="sm" className="w-full justify-between">
              <span>Inspect Security Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* System Status Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#38D996]" />
            <h3 className="font-heading font-semibold text-sm text-[#F5F7FA]">
              Zero-Trust Infrastructure Status Matrix
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#6C7886]">
            All 6 isolated subsystems active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {systemStatusMatrix.map((sub, idx) => {
            const Icon = sub.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#101720] border border-[#1B252F] hover:border-[#25303C] transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F5F7FA] font-sans truncate">
                    {sub.name}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#38D996]" />
                </div>
                <p className="text-[10px] font-mono text-[#6C7886] truncate">
                  {sub.role}
                </p>
                <div className="pt-2 border-t border-[#1B252F] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#38D996] font-medium">{sub.status}</span>
                  <span className="text-[#A4AFBC]">{sub.latency}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="p-5 rounded-lg bg-[#101720] border border-[#1B252F] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1B252F]">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#39D9FF] animate-pulse" />
              <h3 className="font-heading font-semibold text-sm text-[#F5F7FA]">
                Live Operational Activity Feed
              </h3>
            </div>
            <p className="text-[11px] text-[#A4AFBC] mt-0.5">
              Live audit events, model executions, guardrail triggers, and verification receipts.
            </p>
          </div>

          <Link href="/observability">
            <Button variant="ghost" size="xs" icon={<Eye className="w-3.5 h-3.5" />}>
              Open Telemetry Console
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-[#1B252F]">
          {liveActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => setSelectedEvent(act)}
              className="py-3 px-2 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#151D27]/50 rounded-md transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#6C7886] shrink-0">
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
                      : "cyan"
                  }
                  size="xs"
                >
                  {act.type}
                </Badge>
                <span className="text-xs font-mono text-[#F5F7FA] font-medium">
                  {act.target}
                </span>
                <span className="hidden lg:inline text-xs text-[#A4AFBC] truncate max-w-md">
                  {act.details}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono shrink-0">
                <span className="text-[#6C7886]">{act.latency}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    act.status === "BLOCKED"
                      ? "bg-[#FF6074]/15 text-[#FF6074] border border-[#FF6074]/30"
                      : "bg-[#38D996]/15 text-[#38D996] border border-[#38D996]/30"
                  }`}
                >
                  {act.status}
                </span>
                <ArrowRight className="w-3 h-3 text-[#6C7886]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Architecture Diagram Explorer */}
      <div className="space-y-4">
        <div>
          <h3 className="font-heading font-semibold text-sm text-[#F5F7FA]">
            Airgapped Zero-Trust Architecture Diagram
          </h3>
          <p className="text-xs text-[#A4AFBC] mt-0.5">
            Click any zone to inspect isolation policies, CNI network boundaries, and role permissions.
          </p>
        </div>

        <ArchitectureDiagram />
      </div>

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
            Close Inspection
          </Button>
        }
      >
        {selectedEvent && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-3.5 rounded bg-[#070A0F] border border-[#1B252F] space-y-2">
              <span className="text-[#6C7886] uppercase text-[10px] block">
                Target Entity
              </span>
              <span className="text-sm font-bold text-[#F5F7FA]">
                {selectedEvent.target}
              </span>
            </div>

            <div className="p-3.5 rounded bg-[#070A0F] border border-[#1B252F] space-y-2">
              <span className="text-[#6C7886] uppercase text-[10px] block">
                Security Evaluation Summary
              </span>
              <p className="text-xs text-[#A4AFBC] font-sans leading-relaxed">
                {selectedEvent.details}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded bg-[#070A0F] border border-[#1B252F]">
                <span className="text-[10px] text-[#6C7886] block">Latency</span>
                <span className="text-sm font-bold text-[#39D9FF]">
                  {selectedEvent.latency}
                </span>
              </div>
              <div className="p-3 rounded bg-[#070A0F] border border-[#1B252F]">
                <span className="text-[10px] text-[#6C7886] block">Status</span>
                <span className="text-sm font-bold text-[#38D996]">
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
