"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { ZoneBadge } from "@/components/ZoneBadge";
import { 
  apiGetDefenses, 
  apiCreateDefense, 
  apiUpdateDefense, 
  apiDeleteDefense, 
  apiGetThreatFeed, 
  apiGetBlueMetrics 
} from "@/lib/api";
import { 
  Shield, 
  Plus, 
  RefreshCw, 
  Activity, 
  AlertTriangle, 
  Lock, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  ToggleLeft, 
  ToggleRight,
  Filter,
  BarChart3,
  Sliders
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export default function BlueConsolePage() {
  const { user, switchRole } = useAuth();
  const [mounted, setMounted] = useState(false);

  const [defenses, setDefenses] = useState<any[]>([]);
  const [threatFeed, setThreatFeed] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"defenses" | "threatFeed" | "metrics">("defenses");

  // Create Rule Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRuleId, setNewRuleId] = useState("BLU-CUSTOM-001");
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleStage, setNewRuleStage] = useState("INPUT_FILTER");
  const [newRuleType, setNewRuleType] = useState("REGEX");
  const [newRulePattern, setNewRulePattern] = useState("");
  const [newRuleAction, setNewRuleAction] = useState("BLOCK");
  const [newRuleSeverity, setNewRuleSeverity] = useState("HIGH");
  const [newRuleOwasp, setNewRuleOwasp] = useState("LLM01: Prompt Injection");

  const isAuthorized = user?.role === "blue_operator" || user?.role === "admin";

  const loadData = async () => {
    if (!isAuthorized) return;
    setLoading(true);
    try {
      const [defs, feed, met] = await Promise.all([
        apiGetDefenses(),
        apiGetThreatFeed(40),
        apiGetBlueMetrics()
      ]);
      setDefenses(defs);
      setThreatFeed(feed);
      setMetrics(met);
    } catch (err) {
      console.error("Failed to load Blue console data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (isAuthorized) {
      loadData();
    }
  }, [user]);

  const handleToggleRule = async (rule: any) => {
    try {
      const updated = await apiUpdateDefense(rule.id, { is_active: !rule.is_active });
      setDefenses((prev) => prev.map((r) => (r.id === rule.id ? updated : r)));
    } catch (err) {
      console.error("Toggle rule failed:", err);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      await apiDeleteDefense(ruleId);
      setDefenses((prev) => prev.filter((r) => r.id !== ruleId));
    } catch (err) {
      console.error("Delete rule failed:", err);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await apiCreateDefense({
        id: newRuleId,
        name: newRuleName,
        stage: newRuleStage,
        rule_type: newRuleType,
        pattern: newRulePattern,
        action: newRuleAction,
        severity: newRuleSeverity,
        owasp_category: newRuleOwasp,
        is_active: true
      });
      setDefenses([created, ...defenses]);
      setShowCreateModal(false);
      setNewRuleName("");
      setNewRulePattern("");
      setNewRuleId(`BLU-CUSTOM-${Math.floor(100 + Math.random() * 900)}`);
    } catch (err: any) {
      alert(err.message || "Failed to create rule");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="rounded-2xl border border-[#3B82F6]/40 bg-[#0D1322] p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#3B82F6]/15 flex items-center justify-center border border-[#3B82F6]/40">
            <Lock className="w-6 h-6 text-[#3B82F6]" />
          </div>
          <h2 className="text-xl font-bold text-white">Zone Policy Violation (403 Forbidden)</h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            You are currently authenticated as <span className="font-mono text-purple-400 font-medium">{user?.role || "anonymous"}</span>.
            Under Bayora's 4-pillar isolation architecture, access to the Blue Team Zone is strictly prohibited for your current role.
          </p>
          <div className="pt-2">
            <button
              onClick={() => switchRole("blue_operator")}
              className="px-5 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-[#60A5FA] text-white font-medium text-xs shadow-lg transition"
            >
              Switch to Blue Operator Role
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Zone Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Blue Team Defense Console</h1>
              <ZoneBadge zone="blue_zone" size="sm" />
            </div>
            <p className="text-xs text-slate-400">
              Guardrail engineering, real-time threat neutralization, and dual-blind sanitized telemetry.
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 bg-[#0A0F1D] p-1 rounded-lg border border-[#1E293B]">
          <button
            onClick={() => setActiveTab("defenses")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === "defenses" ? "bg-[#3B82F6] text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Defense Builder ({defenses.length})
          </button>
          <button
            onClick={() => setActiveTab("threatFeed")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === "threatFeed" ? "bg-[#3B82F6] text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sanitized Threat Feed ({threatFeed.length})
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === "metrics" ? "bg-[#3B82F6] text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Defense Metrics
          </button>
        </div>
      </div>

      {/* Strict Dual-Blind Rule Notice */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-xs text-slate-300">
        <Lock className="w-4 h-4 text-[#3B82F6] shrink-0" />
        <span>
          <strong className="text-white">Dual-Blind Boundary Active:</strong> Blue operators receive tokenized threat telemetry classified under OWASP LLM taxonomy. Raw attack prompts, attacker IP addresses, and operator identities are redacted at the gateway boundary.
        </span>
      </div>

      {/* TAB 1: DEFENSE BUILDER */}
      {activeTab === "defenses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-white">Active Defense Guardrails</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0D1322] hover:bg-slate-800 text-xs text-slate-300 font-mono flex items-center gap-1.5 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#60A5FA] text-white text-xs font-medium flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Deploy Guardrail
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defenses.map((rule) => (
              <div 
                key={rule.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  rule.is_active 
                    ? "border-[#1E293B] bg-[#0D1322]" 
                    : "border-slate-800/40 bg-slate-900/30 opacity-70"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-400">{rule.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                      rule.severity === "CRITICAL"
                        ? "border-red-500/40 bg-red-500/10 text-red-400"
                        : rule.severity === "HIGH"
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                        : "border-blue-500/40 bg-blue-500/10 text-blue-400"
                    }`}>
                      {rule.severity}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-white">{rule.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{rule.description || "Active defense rule"}</p>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <div className="flex justify-between">
                      <span>Stage:</span>
                      <span className="text-slate-200">{rule.stage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="text-slate-200">{rule.rule_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Action:</span>
                      <span className="text-emerald-400 font-bold">{rule.action}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>OWASP Tag:</span>
                      <span className="text-purple-300 truncate max-w-[140px]" title={rule.owasp_category}>{rule.owasp_category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interceptions:</span>
                      <span className="text-white font-bold">{rule.trigger_count}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleRule(rule)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                  >
                    {rule.is_active ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 text-[11px] font-mono">ARMED</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-slate-500" />
                        <span className="text-slate-500 text-[11px] font-mono">STANDBY</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-1 rounded text-slate-500 hover:text-red-400 transition"
                    title="Delete rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SANITIZED THREAT FEED */}
      {activeTab === "threatFeed" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-white">Live Sanitized Security Telemetry</h3>
            <button
              onClick={loadData}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" /> Refresh Feed
            </button>
          </div>

          <div className="rounded-xl border border-[#1E293B] bg-[#0D1322] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#090D16] border-b border-[#1E293B] text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Decision</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">OWASP Classification</th>
                    <th className="py-3 px-4">Sanitized Threat Signature (Redacted)</th>
                    <th className="py-3 px-4">Rule ID</th>
                    <th className="py-3 px-4">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]">
                  {threatFeed.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            evt.decision === "BLOCK"
                              ? "bg-red-500/15 text-red-400 border border-red-500/30"
                              : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          {evt.decision}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{evt.stage}</td>
                      <td className="py-3 px-4 text-purple-300">{evt.owasp_category || "Unclassified"}</td>
                      <td className="py-3 px-4 text-slate-200 font-mono text-[11px] max-w-sm truncate" title={evt.sanitized_snippet}>
                        {evt.sanitized_snippet || "[TELEMETRY MASKED]"}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{evt.triggered_rule_id || "N/A"}</td>
                      <td className="py-3 px-4 text-slate-400">{evt.latency_ms?.toFixed(1) || 0}ms</td>
                    </tr>
                  ))}
                  {threatFeed.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No events in threat feed. Transmit attacks from Red Workbench to observe live ingestion.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEFENSE METRICS */}
      {activeTab === "metrics" && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322]">
              <span className="text-slate-400 text-xs font-mono uppercase">Total Ingested Telemetry</span>
              <p className="text-2xl font-bold text-white mt-1">{metrics.total_events}</p>
            </div>
            <div className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322]">
              <span className="text-red-400 text-xs font-mono uppercase">Threats Neutralized</span>
              <p className="text-2xl font-bold text-red-400 mt-1">{metrics.total_blocks}</p>
            </div>
            <div className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322]">
              <span className="text-blue-400 text-xs font-mono uppercase">Interception Rate</span>
              <p className="text-2xl font-bold text-blue-400 mt-1">{metrics.block_rate}%</p>
            </div>
            <div className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322]">
              <span className="text-emerald-400 text-xs font-mono uppercase">Est. False Positive Rate</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{metrics.estimated_false_positive_rate * 100}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OWASP Breakdown */}
            <div className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322] space-y-4">
              <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Interceptions by OWASP LLM Taxonomy
              </h4>
              <div className="h-64">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.category_breakdown}>
                      <XAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0D1322", borderColor: "#1E293B", color: "#fff" }} 
                      />
                      <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                    Loading telemetry chart...
                  </div>
                )}
              </div>
            </div>

            {/* Top Triggered Defenses */}
            <div className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322] space-y-4">
              <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Top Activated Guardrail Rules
              </h4>
              <div className="space-y-3 pt-2">
                {metrics.top_triggered_rules.map((r: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/60 font-mono text-xs">
                    <span className="text-slate-300 truncate max-w-xs">{r.name}</span>
                    <span className="text-blue-400 font-bold">{r.triggers} hits</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deploy Guardrail Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#1E293B] bg-[#0D1322] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#3B82F6]" /> Deploy New Blue Defense Rule
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-500 hover:text-white text-xs font-mono"
              >
                ESC
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Rule ID</label>
                  <input
                    type="text"
                    value={newRuleId}
                    onChange={(e) => setNewRuleId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white font-mono focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Stage</label>
                  <select
                    value={newRuleStage}
                    onChange={(e) => setNewRuleStage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white font-mono focus:border-blue-500 focus:outline-none"
                  >
                    <option value="INPUT_FILTER">INPUT_FILTER (Prompt)</option>
                    <option value="OUTPUT_FILTER">OUTPUT_FILTER (Completion)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Rule Name</label>
                <input
                  type="text"
                  placeholder="e.g. Heuristic Base64 Jailbreak Filter"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white font-mono focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Rule Type</label>
                  <select
                    value={newRuleType}
                    onChange={(e) => setNewRuleType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white font-mono focus:border-blue-500 focus:outline-none"
                  >
                    <option value="REGEX">REGEX Pattern</option>
                    <option value="KEYWORD">KEYWORD List</option>
                    <option value="CANARY_GUARD">CANARY_GUARD</option>
                    <option value="ENTROPY">ENTROPY / Obfuscation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Action</label>
                  <select
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white font-mono focus:border-blue-500 focus:outline-none"
                  >
                    <option value="BLOCK">BLOCK (Drop request)</option>
                    <option value="SANITIZE">SANITIZE (Mask match)</option>
                    <option value="ALERT">ALERT (Allow & Log)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Regex Pattern / Keywords</label>
                <input
                  type="text"
                  placeholder="e.g. (system\s+prompt|developer\s+mode)"
                  value={newRulePattern}
                  onChange={(e) => setNewRulePattern(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white font-mono focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Severity</label>
                  <select
                    value={newRuleSeverity}
                    onChange={(e) => setNewRuleSeverity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white font-mono focus:border-blue-500 focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">OWASP Category</label>
                  <select
                    value={newRuleOwasp}
                    onChange={(e) => setNewRuleOwasp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white font-mono focus:border-blue-500 focus:outline-none"
                  >
                    <option value="LLM01: Prompt Injection">LLM01: Prompt Injection</option>
                    <option value="LLM02: Sensitive Information Disclosure">LLM02: Sensitive Info Disclosure</option>
                    <option value="LLM04: Model Denial of Service">LLM04: Denial of Service</option>
                    <option value="LLM06: Excessive Agency">LLM06: Excessive Agency</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md"
                >
                  Save & Arm Guardrail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
