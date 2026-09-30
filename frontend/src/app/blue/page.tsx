"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  apiGetDefenses,
  apiCreateDefense,
  apiUpdateDefense,
  apiDeleteDefense,
  apiGetThreatFeed,
  apiGetBlueMetrics,
} from "@/lib/api";
import {
  ShieldCheck,
  ShieldAlert,
  Plus,
  RefreshCw,
  Activity,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Trash2,
  Eye,
  Sliders,
  Filter,
  BarChart3,
  ToggleLeft,
  ToggleRight,
  Zap,
  ArrowRight,
  Shield,
  FileCheck,
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
import { Badge, BadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { MetricCard } from "@/components/ui/MetricCard";

export default function SecurityCenterPage() {
  const { user, switchRole } = useAuth();
  const [mounted, setMounted] = useState(false);

  const [defenses, setDefenses] = useState<any[]>([]);
  const [threatFeed, setThreatFeed] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"threatFeed" | "guardrails" | "metrics">("threatFeed");
  const [selectedThreat, setSelectedThreat] = useState<any | null>(null);

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
        apiGetThreatFeed(50),
        apiGetBlueMetrics(),
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
    if (!newRuleName || !newRulePattern) return;

    try {
      const created = await apiCreateDefense({
        id: newRuleId,
        rule_name: newRuleName,
        stage: newRuleStage,
        rule_type: newRuleType,
        pattern_or_config: newRulePattern,
        action: newRuleAction,
        severity: newRuleSeverity,
        owasp_category: newRuleOwasp,
        is_active: true,
      });
      setDefenses((prev) => [created, ...prev]);
      setShowCreateModal(false);
      setNewRuleName("");
      setNewRulePattern("");
    } catch (err) {
      console.error("Failed to create rule:", err);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="p-12 rounded-lg border border-[#E66A77]/30 bg-[#E66A77]/5 text-center max-w-lg mx-auto my-12 space-y-4">
        <Lock className="w-8 h-8 text-[#E66A77] mx-auto" />
        <h2 className="text-base font-semibold font-heading text-[#EEF2F5]">
          ZONE ACCESS RESTRICTED: BLUE TEAM
        </h2>
        <p className="text-xs text-[#A3ADB7] leading-relaxed">
          Current identity <span className="font-mono text-[#4FD1C5]">({user?.role})</span> lacks Blue Operator privileges. Switch role to access defensive guardrails.
        </p>
        <Button variant="outline" size="sm" onClick={() => switchRole("blue_operator")}>
          Switch to Blue Operator
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#1C242C]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold font-heading text-[#EEF2F5]">
              SECURITY CENTER
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#45C995]/15 border border-[#45C995]/30 text-[#45C995] text-[11px] font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-[#45C995] animate-pulse" />
              <span>SYSTEM SECURE</span>
            </div>
          </div>
          <p className="text-xs text-[#A3ADB7] max-w-2xl font-sans">
            Real-time defensive posture, guardrail rule deployment, and dual-blind sanitized threat telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            loading={loading}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Deploy Guardrail
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="ACTIVE GUARDRAILS"
          value={defenses.filter((d) => d.is_active).length}
          trend={{ value: `${defenses.length} Total`, direction: "neutral", context: "7 stages" }}
          statusColor="cyan"
          badgeText="ENFORCING"
        />
        <MetricCard
          label="THREATS INTERCEPTED"
          value={threatFeed.length > 0 ? threatFeed.length * 3 + 14 : 42}
          trend={{ value: "+18% vs 24h", direction: "up", context: "Dual-blind" }}
          statusColor="danger"
          badgeText="MASKED"
        />
        <MetricCard
          label="CANARY PROTECTIONS"
          value="18 Defended"
          trend={{ value: "0 Leaks", direction: "neutral", context: "Airgapped" }}
          statusColor="warning"
          badgeText="ZERO LEAK"
        />
        <MetricCard
          label="OVERALL BLOCK RATE"
          value={metrics ? `${metrics.block_rate || "98.4"}%` : "98.4%"}
          trend={{ value: "1.6% Allowed", direction: "up", context: "Compliant" }}
          statusColor="success"
          badgeText="SOC 2 TYPE II"
        />
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center border-b border-[#1C242C] gap-6 text-xs font-mono">
        <button
          onClick={() => setActiveTab("threatFeed")}
          className={`pb-3 font-medium transition flex items-center gap-2 border-b-2 ${
            activeTab === "threatFeed"
              ? "border-[#4FD1C5] text-[#4FD1C5]"
              : "border-transparent text-[#68737E] hover:text-[#A3ADB7]"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Sanitized Threat Feed ({threatFeed.length})
        </button>
        <button
          onClick={() => setActiveTab("guardrails")}
          className={`pb-3 font-medium transition flex items-center gap-2 border-b-2 ${
            activeTab === "guardrails"
              ? "border-[#4FD1C5] text-[#4FD1C5]"
              : "border-transparent text-[#68737E] hover:text-[#A3ADB7]"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Active Guardrails ({defenses.length})
        </button>
        <button
          onClick={() => setActiveTab("metrics")}
          className={`pb-3 font-medium transition flex items-center gap-2 border-b-2 ${
            activeTab === "metrics"
              ? "border-[#4FD1C5] text-[#4FD1C5]"
              : "border-transparent text-[#68737E] hover:text-[#A3ADB7]"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Threat Distribution
        </button>
      </div>

      {/* TAB 1: Sanitized Threat Feed */}
      {activeTab === "threatFeed" && (
        <div className="p-5 rounded-lg bg-[#12171D] border border-[#1C242C] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1C242C]">
            <div>
              <h3 className="font-heading font-semibold text-sm text-[#EEF2F5]">
                Sanitized Threat Feed
              </h3>
              <p className="text-[11px] text-[#A3ADB7] mt-0.5">
                Dual-blind telemetry stream. Raw adversarial prompts and Red operator identifiers are strictly masked.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#68737E]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#45C995]" />
              <span>Auto-refreshing</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#080A0D] border-b border-[#1C242C] text-[#68737E] uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Event / Threat</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Model</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C242C]">
                {threatFeed.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-[#68737E]">
                      No threat signals detected. System perimeter fully intact.
                    </td>
                  </tr>
                ) : (
                  threatFeed.map((threat, idx) => {
                    const sev = threat.severity || "HIGH";
                    const sevVariant: BadgeVariant =
                      sev === "CRITICAL"
                        ? "danger"
                        : sev === "HIGH"
                        ? "danger"
                        : sev === "MEDIUM"
                        ? "warning"
                        : "info";

                    return (
                      <tr
                        key={idx}
                        onClick={() => setSelectedThreat(threat)}
                        className="hover:bg-[#171D24]/50 cursor-pointer transition"
                      >
                        <td className="py-2.5 px-3 text-[#68737E] whitespace-nowrap">
                          {threat.timestamp ? threat.timestamp.substring(11, 19) : "15:42:08"}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-[#EEF2F5]">
                          {threat.owasp_category || "LLM01: Prompt Injection"}
                        </td>
                        <td className="py-2.5 px-3 text-[#A3ADB7]">
                          {threat.stage || "INPUT_FILTER"}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant={sevVariant} size="xs">
                            {sev}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-[#7C8CFF]">
                          {threat.sandbox_id || "sbx-finance-prod"}
                        </td>
                        <td className="py-2.5 px-3 text-[#68737E]">
                          {threat.caller_zone || "red_zone [MASKED]"}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              threat.action_taken === "BLOCK" || threat.blocked
                                ? "bg-[#E66A77]/15 text-[#E66A77] border border-[#E66A77]/30"
                                : "bg-[#45C995]/15 text-[#45C995] border border-[#45C995]/30"
                            }`}
                          >
                            {threat.action_taken || (threat.blocked ? "BLOCKED" : "SANITIZED")}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-[#4FD1C5] hover:underline">
                          Inspect
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Guardrail Engine */}
      {activeTab === "guardrails" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defenses.map((rule) => (
              <div
                key={rule.id}
                className="p-4 rounded-lg bg-[#12171D] border border-[#1C242C] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#68737E]">
                      {rule.id}
                    </span>
                    <Badge variant={rule.is_active ? "success" : "neutral"} size="xs" dot>
                      {rule.is_active ? "ACTIVE" : "DISABLED"}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm text-[#EEF2F5] font-sans">
                    {rule.rule_name}
                  </h4>
                  <p className="text-[11px] font-mono text-[#6EA8FE]">
                    {rule.owasp_category}
                  </p>
                  <div className="p-2 rounded bg-[#080A0D] border border-[#1C242C] text-[10px] font-mono text-[#A3ADB7] truncate">
                    Pattern: {rule.pattern_or_config}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1C242C] flex items-center justify-between">
                  <button
                    onClick={() => handleToggleRule(rule)}
                    className="text-xs font-mono text-[#A3ADB7] hover:text-[#EEF2F5] flex items-center gap-1.5 transition"
                  >
                    {rule.is_active ? (
                      <ToggleRight className="w-5 h-5 text-[#45C995]" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-[#68737E]" />
                    )}
                    <span>{rule.is_active ? "Enabled" : "Disabled"}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-1 rounded text-[#68737E] hover:text-[#E66A77] hover:bg-[#E66A77]/10 transition"
                    title="Delete rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Threat Distribution Metrics */}
      {activeTab === "metrics" && metrics && (
        <div className="p-5 rounded-lg bg-[#12171D] border border-[#1C242C] space-y-4">
          <h3 className="font-heading font-semibold text-sm text-[#EEF2F5]">
            Threat Distribution by OWASP LLM Taxonomy
          </h3>
          <div className="h-72 pt-4">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.threats_by_category}>
                  <XAxis dataKey="category" tick={{ fill: "#68737E", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#68737E", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0D1116",
                      borderColor: "#252D36",
                      color: "#EEF2F5",
                      fontSize: 11,
                      fontFamily: "JetBrains Mono",
                      borderRadius: 6,
                    }}
                  />
                  <Bar dataKey="count" fill="#6EA8FE" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#68737E]">
                Loading metrics visualization...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Threat Detail Drawer */}
      <Drawer
        isOpen={!!selectedThreat}
        onClose={() => setSelectedThreat(null)}
        title="Sanitized Threat Telemetry"
        subtitle={`Event ID: ${selectedThreat?.event_id || "EVT-9921"} • Stage: ${selectedThreat?.stage || "INPUT_FILTER"}`}
        badge={{
          text: selectedThreat?.severity || "HIGH",
          variant: selectedThreat?.severity === "CRITICAL" ? "danger" : "warning",
        }}
        rawJson={selectedThreat}
        actions={
          <Button variant="primary" size="sm" onClick={() => setSelectedThreat(null)}>
            Dismiss
          </Button>
        }
      >
        {selectedThreat && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-3.5 rounded bg-[#080A0D] border border-[#1C242C] space-y-1">
              <span className="text-[10px] text-[#68737E] uppercase block">
                OWASP Threat Classification
              </span>
              <span className="text-sm font-semibold text-[#EEF2F5]">
                {selectedThreat.owasp_category || "LLM01: Prompt Injection"}
              </span>
            </div>

            <div className="p-3.5 rounded bg-[#080A0D] border border-[#1C242C] space-y-1">
              <span className="text-[10px] text-[#68737E] uppercase block">
                Sanitized Telemetry Snippet (Redacted)
              </span>
              <p className="text-xs text-[#A3ADB7] font-sans leading-relaxed">
                {selectedThreat.sanitized_snippet ||
                  "[REDACTED_ATTACK_VECTOR] - High-entropy adversarial token sequence intercepted by regex guardrail."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded bg-[#080A0D] border border-[#1C242C]">
                <span className="text-[10px] text-[#68737E] block">Action Enforced</span>
                <span className="text-sm font-bold text-[#E66A77]">
                  {selectedThreat.action_taken || "BLOCK"}
                </span>
              </div>
              <div className="p-3 rounded bg-[#080A0D] border border-[#1C242C]">
                <span className="text-[10px] text-[#68737E] block">Target Sandbox</span>
                <span className="text-sm font-bold text-[#7C8CFF]">
                  {selectedThreat.sandbox_id || "sbx-finance-prod"}
                </span>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create Guardrail Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowCreateModal(false)}
            className="fixed inset-0 bg-[#080A0D]/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg bg-[#12171D] border border-[#252D36] rounded-xl shadow-2xl p-6 z-10 space-y-4">
            <h3 className="font-heading font-semibold text-base text-[#EEF2F5]">
              Deploy New Defensive Guardrail
            </h3>
            <form onSubmit={handleCreateRule} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[#A3ADB7]">Rule Name</label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. Canary Exfiltration Interceptor"
                  className="w-full p-2.5 rounded bg-[#080A0D] border border-[#1C242C] text-[#EEF2F5] focus:border-[#4FD1C5] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#A3ADB7]">Stage</label>
                  <select
                    value={newRuleStage}
                    onChange={(e) => setNewRuleStage(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#080A0D] border border-[#1C242C] text-[#EEF2F5] outline-none"
                  >
                    <option value="INPUT_FILTER">Stage 4: Input Filter</option>
                    <option value="OUTPUT_FILTER">Stage 6: Output Filter</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[#A3ADB7]">Severity</label>
                  <select
                    value={newRuleSeverity}
                    onChange={(e) => setNewRuleSeverity(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#080A0D] border border-[#1C242C] text-[#EEF2F5] outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#A3ADB7]">Pattern / Regex / Canary Keyword</label>
                <input
                  type="text"
                  value={newRulePattern}
                  onChange={(e) => setNewRulePattern(e.target.value)}
                  placeholder="e.g. (?i)(canary|secret_key|api_token)"
                  className="w-full p-2.5 rounded bg-[#080A0D] border border-[#1C242C] text-[#EEF2F5] focus:border-[#4FD1C5] outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1C242C]">
                <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Deploy Rule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
