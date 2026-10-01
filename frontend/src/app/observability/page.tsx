"use client";

import React, { useState, useEffect } from "react";
import { apiGetObservabilityMetrics } from "@/lib/api";
import {
  Activity,
  RefreshCw,
  Zap,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Server,
  Cpu,
  Database,
  Lock,
  ArrowRight,
  Play,
  Pause,
  Filter,
  Eye,
  FileCheck,
  RotateCcw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { MetricCard } from "@/components/ui/MetricCard";

interface ActivityItem {
  id: string;
  time: string;
  category: "Requests" | "Security" | "Models" | "Infrastructure" | "Evaluation";
  title: string;
  target: string;
  latency: string;
  status: "NORMAL" | "BLOCKED" | "VERIFIED" | "INTERCEPTED";
  details: string;
}

export default function LiveActivityPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const initialStream: ActivityItem[] = [
    {
      id: "ev-001",
      time: "15:43:02",
      category: "Requests",
      title: "Gateway Pipeline Ingress",
      target: "POST /api/red/attack",
      latency: "18 ms",
      status: "NORMAL",
      details: "Client token validated against JWT issuer. Policy check passed for role red_operator.",
    },
    {
      id: "ev-002",
      time: "15:42:58",
      category: "Security",
      title: "Blue Filter Guardrail Intercept",
      target: "Rule #BR-001 (DAN Guard)",
      latency: "6 ms",
      status: "BLOCKED",
      details: "Adversarial prompt injection pattern detected in input stage 4. Generic block returned.",
    },
    {
      id: "ev-003",
      time: "15:42:49",
      category: "Models",
      title: "Model Execution Completed",
      target: "Client-Finance-GPT-4",
      latency: "142 ms",
      status: "NORMAL",
      details: "Isolated container sandbox execution completed. 48 prompt tokens, 82 completion tokens.",
    },
    {
      id: "ev-004",
      time: "15:42:35",
      category: "Infrastructure",
      title: "Redis Token Bucket Refill",
      target: "RateLimiter (RPM Quota)",
      latency: "1 ms",
      status: "VERIFIED",
      details: "Quota bucket synchronized for tenant sandbox sbx-finance-prod. Available RPM: 60/60.",
    },
    {
      id: "ev-005",
      time: "15:42:20",
      category: "Evaluation",
      title: "Adversarial Batch Suite Executed",
      target: "Campaign #CMP-OWASP-10",
      latency: "320 ms",
      status: "NORMAL",
      details: "Automated penetration run across 12 test vectors completed. Zero canary tokens leaked.",
    },
    {
      id: "ev-006",
      time: "15:42:04",
      category: "Security",
      title: "Output Canary Interceptor",
      target: "Rule #BR-003 (Canary Seal)",
      latency: "8 ms",
      status: "INTERCEPTED",
      details: "Synthetic SSN token pattern identified in LLM output stream. Redacted before egress.",
    },
  ];

  const [stream, setStream] = useState<ActivityItem[]>(initialStream);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const res = await apiGetObservabilityMetrics();
      setData(res);
    } catch (err) {
      console.error("Failed to load observability metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadMetrics();
    const interval = setInterval(() => {
      if (isLive) {
        loadMetrics();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [isLive]);

  const filteredStream = stream.filter((item) => {
    if (categoryFilter === "All") return true;
    return item.category === categoryFilter;
  });

  const STAGE_COLORS = ["#42B883", "#42B883", "#42B883", "#5B91D6", "#6675D9", "#5B91D6", "#D6A856"];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#1B2229]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F1F4F6]">
              LIVE ACTIVITY & TELEMETRY
            </h1>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
                isLive
                  ? "bg-[#42B883]/15 border-[#42B883]/30 text-[#42B883]"
                  : "bg-[#D6A856]/15 border-[#D6A856]/30 text-[#D6A856]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isLive ? "bg-[#42B883] animate-pulse" : "bg-[#D6A856]"
                }`}
              />
              <span>{isLive ? "LIVE STREAMING" : "PAUSED"}</span>
            </div>
          </div>
          <p className="text-xs text-[#A6B0BA] max-w-2xl font-sans">
            Real-time operational event stream, 7-stage gateway profiler, and inter-zone zero-trust network matrix.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant={isLive ? "outline" : "primary"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            icon={isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          >
            {isLive ? "Pause Stream" : "Resume Stream"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadMetrics}
            loading={loading}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Top KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="SYSTEM STATUS"
          value={data ? data.system_status : "HEALTHY"}
          trend={{ value: "mTLS Mesh", direction: "up", context: "Zero-trust" }}
          statusColor="success"
          badgeText="ALL ZONES"
        />
        <MetricCard
          label="PIPELINE LATENCY"
          value={data ? `${data.average_pipeline_latency_ms} ms` : "48 ms"}
          trend={{ value: "7 Stages", direction: "neutral", context: "Gateway overhead" }}
          statusColor="violet"
          badgeText="ENFORCED"
        />
        <MetricCard
          label="CACHE HIT RATE"
          value={data ? `${data.redis_cache_hit_rate}%` : "96.4%"}
          trend={{ value: "Token Bucket", direction: "up", context: "Redis cluster" }}
          statusColor="cyan"
          badgeText="RATE LIMITER"
        />
        <MetricCard
          label="SEALED AUDIT BLOCKS"
          value={data ? data.audit_blocks_sealed : "108 Blocks"}
          trend={{ value: "SHA-256", direction: "neutral", context: "Immutable" }}
          statusColor="warning"
          badgeText="UNBROKEN"
        />
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        <span className="text-[#707B85] uppercase text-[10px] mr-1">Filter Stream:</span>
        {["All", "Requests", "Security", "Models", "Infrastructure", "Evaluation"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded-md transition ${
              categoryFilter === cat
                ? "bg-[#171D23] text-[#4BC7B5] font-semibold border border-[#2A333C]"
                : "bg-[#11161B] text-[#A6B0BA] border border-[#1B2229] hover:border-[#2A333C]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Operational Stream Table */}
      <div className="p-5 rounded-lg bg-[#11161B] border border-[#1B2229] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1B2229]">
          <div>
            <h3 className="font-heading font-semibold text-sm text-[#F1F4F6]">
              Operational Event Stream
            </h3>
            <p className="text-[11px] text-[#A6B0BA] mt-0.5">
              Click any event row to open the deep inspection drawer.
            </p>
          </div>
          <span className="text-xs font-mono text-[#707B85]">
            Showing {filteredStream.length} events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A0D10] border-b border-[#1B2229] text-[#707B85] uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Event Title</th>
                <th className="py-2.5 px-3">Target / Subsystem</th>
                <th className="py-2.5 px-3">Latency</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2229]">
              {filteredStream.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedActivity(item)}
                  className="hover:bg-[#171D23]/50 cursor-pointer transition"
                >
                  <td className="py-2.5 px-3 text-[#707B85]">{item.time}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[#4BC7B5] font-medium">{item.category}</span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#F1F4F6]">
                    {item.title}
                  </td>
                  <td className="py-2.5 px-3 text-[#A6B0BA]">{item.target}</td>
                  <td className="py-2.5 px-3 text-[#707B85]">{item.latency}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.status === "BLOCKED"
                          ? "bg-[#D96573]/15 text-[#D96573] border border-[#D96573]/30"
                          : item.status === "INTERCEPTED"
                          ? "bg-[#D6A856]/15 text-[#D6A856] border border-[#D6A856]/30"
                          : "bg-[#42B883]/15 text-[#42B883] border border-[#42B883]/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#4BC7B5] hover:underline">
                    Inspect
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latency Stage Breakdown */}
      {data && (
        <div className="p-6 rounded-lg bg-[#11161B] border border-[#1B2229] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1B2229]">
            <div>
              <h3 className="font-heading font-semibold text-sm text-[#F1F4F6]">
                7-Stage Gateway Pipeline Latency Profiler
              </h3>
              <p className="text-[11px] text-[#A6B0BA] mt-0.5">
                Latency contribution per enforcement stage: Auth &rarr; Policy &rarr; Quota &rarr; Blue In &rarr; LLM &rarr; Blue Out &rarr; Audit.
              </p>
            </div>
            <span className="text-xs font-mono text-[#707B85]">Live Profiler</span>
          </div>

          <div className="h-64 pt-4">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.pipeline_latency_stages}>
                  <XAxis dataKey="stage" tick={{ fill: "#707B85", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#707B85", fontSize: 10 }} unit="ms" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#07090C",
                      borderColor: "#2A333C",
                      color: "#F1F4F6",
                      fontSize: 11,
                      fontFamily: "IBM Plex Mono",
                      borderRadius: 6,
                    }}
                  />
                  <Bar dataKey="latency_ms" radius={[4, 4, 0, 0]}>
                    {data.pipeline_latency_stages.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={STAGE_COLORS[index % STAGE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#707B85] font-mono">
                Initializing pipeline latency charts...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cross-Zone Traffic Matrix */}
      {data && (
        <div className="p-5 rounded-lg bg-[#11161B] border border-[#1B2229] space-y-4">
          <div>
            <h3 className="font-heading font-semibold text-sm text-[#F1F4F6]">
              Zero-Trust Cross-Zone Network Matrix
            </h3>
            <p className="text-[11px] text-[#A6B0BA] mt-0.5">
              Verifies that all ingress traffic is routed strictly through the gateway with zero bypass sockets.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0A0D10] border-b border-[#1B2229] text-[#707B85] uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Source Zone</th>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">Transport Security</th>
                  <th className="py-2.5 px-3">Isolation State</th>
                  <th className="py-2.5 px-3">Traffic Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2229]">
                {data.traffic_matrix.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#171D23]/50">
                    <td className="py-2.5 px-3 font-semibold text-[#F1F4F6]">{row.source}</td>
                    <td className="py-2.5 px-3 text-[#A6B0BA]">{row.destination}</td>
                    <td className="py-2.5 px-3 text-[#6675D9]">{row.protocol}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#42B883]/15 text-[#42B883] border border-[#42B883]/30">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#F1F4F6] font-bold">{row.volume} payloads</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Inspection Drawer */}
      <Drawer
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title="Operational Event Inspection"
        subtitle={`Event ID: ${selectedActivity?.id} • Category: ${selectedActivity?.category}`}
        badge={{
          text: selectedActivity?.status || "NORMAL",
          variant: selectedActivity?.status === "BLOCKED" ? "danger" : "success",
        }}
        rawJson={selectedActivity}
        actions={
          <Button variant="primary" size="sm" onClick={() => setSelectedActivity(null)}>
            Dismiss
          </Button>
        }
      >
        {selectedActivity && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-3.5 rounded bg-[#0A0D10] border border-[#1B2229] space-y-1">
              <span className="text-[10px] text-[#707B85] uppercase block">
                Target Subsystem
              </span>
              <span className="text-sm font-semibold text-[#F1F4F6]">
                {selectedActivity.target}
              </span>
            </div>

            <div className="p-3.5 rounded bg-[#0A0D10] border border-[#1B2229] space-y-1">
              <span className="text-[10px] text-[#707B85] uppercase block">
                Event Description
              </span>
              <p className="text-xs text-[#A6B0BA] font-sans leading-relaxed">
                {selectedActivity.details}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded bg-[#0A0D10] border border-[#1B2229]">
                <span className="text-[10px] text-[#707B85] block">Latency</span>
                <span className="text-sm font-bold text-[#4BC7B5]">
                  {selectedActivity.latency}
                </span>
              </div>
              <div className="p-3 rounded bg-[#0A0D10] border border-[#1B2229]">
                <span className="text-[10px] text-[#707B85] block">Category</span>
                <span className="text-sm font-bold text-[#6675D9]">
                  {selectedActivity.category}
                </span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
