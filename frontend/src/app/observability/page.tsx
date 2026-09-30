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
  ArrowRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

export default function ObservabilityPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    const interval = setInterval(loadMetrics, 8000);
    return () => clearInterval(interval);
  }, []);

  const STAGE_COLORS = ["#10B981", "#10B981", "#10B981", "#3B82F6", "#8B5CF6", "#3B82F6", "#F59E0B"];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Platform Observability & Telemetry</h1>
            <p className="text-xs text-slate-400">
              End-to-end pipeline latency telemetry, cross-zone traffic matrices, and distributed cache performance.
            </p>
          </div>
        </div>

        <button
          onClick={loadMetrics}
          className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-[#0D1322] hover:bg-slate-800 text-xs text-slate-300 font-mono flex items-center gap-1.5 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Telemetry
        </button>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322]">
              <span className="text-slate-400 text-xs font-mono uppercase">System Health Status</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-lg font-bold text-white font-mono">{data.system_status}</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 block mt-1">mTLS Zero-Trust Mesh</span>
            </div>

            <div className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322]">
              <span className="text-slate-400 text-xs font-mono uppercase">Avg Pipeline Latency</span>
              <p className="text-2xl font-bold text-white mt-1 font-mono">{data.average_pipeline_latency_ms} ms</p>
              <span className="text-[11px] font-mono text-purple-400 block mt-1">7 Stages Enforced</span>
            </div>

            <div className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322]">
              <span className="text-slate-400 text-xs font-mono uppercase">Redis Cache Hit Rate</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{data.redis_cache_hit_rate}%</p>
              <span className="text-[11px] font-mono text-slate-500 block mt-1">Token bucket limiter</span>
            </div>

            <div className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322]">
              <span className="text-slate-400 text-xs font-mono uppercase">Sealed Audit Blocks</span>
              <p className="text-2xl font-bold text-amber-400 mt-1 font-mono">{data.audit_blocks_sealed}</p>
              <span className="text-[11px] font-mono text-slate-500 block mt-1">SHA-256 Chained</span>
            </div>
          </div>

          {/* Pipeline Latency Stage Breakdown */}
          <div className="p-6 rounded-xl border border-[#1E293B] bg-[#0D1322] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Gateway Pipeline Latency by Stage (Milliseconds)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Breakdown across Auth, Policy, Quota, Blue Filters, LLM inference, and cryptographic sealing.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">Live Profiler</span>
            </div>

            <div className="h-64 pt-4">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.pipeline_latency_stages}>
                    <XAxis dataKey="stage" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} unit="ms" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0D1322", borderColor: "#1E293B", color: "#fff", fontSize: 12 }} 
                    />
                    <Bar dataKey="latency_ms" radius={[4, 4, 0, 0]}>
                      {data.pipeline_latency_stages.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={STAGE_COLORS[index % STAGE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                  Initializing pipeline latency charts...
                </div>
              )}
            </div>
          </div>

          {/* Cross-Zone Traffic Matrix */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-white">Cross-Zone Inter-Process Network Matrix</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Verifies that all ingress traffic is routed strictly through the gateway with zero bypass sockets.
              </p>
            </div>

            <div className="rounded-xl border border-[#1E293B] bg-[#0D1322] overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#090D16] border-b border-[#1E293B] text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Source Zone</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Transport Security</th>
                    <th className="py-3 px-4">Isolation State</th>
                    <th className="py-3 px-4">Traffic Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]">
                  {data.traffic_matrix.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-3.5 px-4 font-medium text-white">{row.source}</td>
                      <td className="py-3.5 px-4 text-slate-300">{row.destination}</td>
                      <td className="py-3.5 px-4 text-purple-300">{row.protocol}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-bold">{row.volume} payloads</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
