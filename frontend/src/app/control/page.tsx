"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { ZoneBadge } from "@/components/ZoneBadge";
import { 
  apiGetSandboxes, 
  apiCreateSandbox, 
  apiGetUsers 
} from "@/lib/api";
import { 
  Database, 
  Plus, 
  RefreshCw, 
  Lock, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Check, 
  X, 
  Sliders,
  UserCheck
} from "lucide-react";

export default function ControlPlanePage() {
  const { user, switchRole } = useAuth();

  const [sandboxes, setSandboxes] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"sandboxes" | "quotas" | "policies" | "users">("sandboxes");

  // Create Sandbox modal
  const [showCreateSandbox, setShowCreateSandbox] = useState(false);
  const [sbxId, setSbxId] = useState("sbx-autonomous-agent");
  const [sbxName, setSbxName] = useState("Autonomous Corporate Task LLM");
  const [sbxModel, setSbxModel] = useState("Llama-3-8B-Secured");
  const [sbxQuotaRpm, setSbxQuotaRpm] = useState(60);
  const [sbxQuotaTokens, setSbxQuotaTokens] = useState(80000);
  const [sbxIsolation, setSbxIsolation] = useState("STRICT_AIRGAP");

  const isAuthorized = user?.role === "admin";

  const loadData = async () => {
    if (!isAuthorized) return;
    setLoading(true);
    try {
      const [sbxs, usrs] = await Promise.all([
        apiGetSandboxes(),
        apiGetUsers()
      ]);
      setSandboxes(sbxs);
      setUsersList(usrs);
    } catch (err) {
      console.error("Failed to load control plane data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      loadData();
    }
  }, [user]);

  const handleCreateSandbox = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await apiCreateSandbox({
        id: sbxId,
        name: sbxName,
        target_model: sbxModel,
        quota_rpm: Number(sbxQuotaRpm),
        quota_tokens_daily: Number(sbxQuotaTokens),
        isolation_level: sbxIsolation
      });
      setSandboxes([created, ...sandboxes]);
      setShowCreateSandbox(false);
      setSbxId(`sbx-eval-${Math.floor(100 + Math.random() * 900)}`);
      setSbxName("");
    } catch (err: any) {
      alert(err.message || "Failed to create sandbox");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="rounded-2xl border border-[#10B981]/40 bg-[#0D1322] p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#10B981]/15 flex items-center justify-center border border-[#10B981]/40">
            <Lock className="w-6 h-6 text-[#10B981]" />
          </div>
          <h2 className="text-xl font-bold text-white">Zone Policy Violation (403 Forbidden)</h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            You are currently authenticated as <span className="font-mono text-purple-400 font-medium">{user?.role || "anonymous"}</span>.
            Under Bayora's 4-pillar isolation architecture, access to the Control Plane is restricted exclusively to Administrators.
          </p>
          <div className="pt-2">
            <button
              onClick={() => switchRole("admin")}
              className="px-5 py-2.5 rounded-lg bg-[#10B981] hover:bg-[#34D399] text-white font-medium text-xs shadow-lg transition"
            >
              Switch to Administrator Role
            </button>
          </div>
        </div>
      </div>
    );
  }

  const rbacMatrix = [
    { role: "red_operator", redZone: "Full Access", blueZone: "DENIED (403)", llmZone: "Gateway Only", controlPlane: "DENIED (403)", auditZone: "DENIED (403)" },
    { role: "blue_operator", redZone: "DENIED (403)", blueZone: "Full Access", llmZone: "Inspection Only", controlPlane: "DENIED (403)", auditZone: "DENIED (403)" },
    { role: "admin", redZone: "Read-Only", blueZone: "Manage", llmZone: "Configure", controlPlane: "Full Control", auditZone: "Verify" },
    { role: "auditor", redZone: "Audit Seal", blueZone: "Audit Seal", llmZone: "Non-repudiation", controlPlane: "Read Specs", auditZone: "Cryptographic Proof" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Zone Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Control Plane & Governance</h1>
              <ZoneBadge zone="control_plane" size="sm" />
            </div>
            <p className="text-xs text-slate-400">
              Orchestrate isolated evaluation sandboxes, enforce token quotas, and audit RBAC boundaries.
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 bg-[#0A0F1D] p-1 rounded-lg border border-[#1E293B]">
          <button
            onClick={() => setActiveTab("sandboxes")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === "sandboxes" ? "bg-[#10B981] text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sandboxes ({sandboxes.length})
          </button>
          <button
            onClick={() => setActiveTab("quotas")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === "quotas" ? "bg-[#10B981] text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Quotas & Limits
          </button>
          <button
            onClick={() => setActiveTab("policies")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === "policies" ? "bg-[#10B981] text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Policy & RBAC Matrix
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === "users" ? "bg-[#10B981] text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Users ({usersList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: SANDBOXES */}
      {activeTab === "sandboxes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-white">Isolated Evaluation Sandboxes</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0D1322] hover:bg-slate-800 text-xs text-slate-300 font-mono flex items-center gap-1.5 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
              </button>
              <button
                onClick={() => setShowCreateSandbox(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#34D399] text-white text-xs font-medium flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Provision Sandbox
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sandboxes.map((sbx) => {
              const pctUsed = Math.min(100, Math.round((sbx.current_tokens_used / sbx.quota_tokens_daily) * 100));

              return (
                <div key={sbx.id} className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322] flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-400">{sbx.id}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 uppercase">
                        {sbx.isolation_level}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-white">{sbx.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{sbx.description}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                      <div className="flex justify-between text-slate-400 text-[11px]">
                        <span>Target Model:</span>
                        <span className="text-purple-300">{sbx.target_model}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[11px]">
                        <span>RPM Ceiling:</span>
                        <span className="text-slate-200">{sbx.quota_rpm} req/min</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[11px]">
                        <span>Canary Token:</span>
                        <span className="text-amber-400">{sbx.canary_token}</span>
                      </div>

                      {/* Quota Progress Bar */}
                      <div className="pt-2">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Token Quota Used:</span>
                          <span className="text-white">{sbx.current_tokens_used} / {sbx.quota_tokens_daily}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pctUsed > 80 ? "bg-red-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${pctUsed}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex justify-between">
                    <span>Status: OPERATIONAL</span>
                    <span>Airgap: DEFAULT_DENY</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: QUOTAS & LIMITS */}
      {activeTab === "quotas" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322]">
              <span className="text-slate-400 text-xs font-mono uppercase">Global Daily Token Budget</span>
              <p className="text-2xl font-bold text-white mt-1">250,000</p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">Sum across 3 active sandboxes</p>
            </div>
            <div className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322]">
              <span className="text-emerald-400 text-xs font-mono uppercase">Consumed Tokens Today</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                {sandboxes.reduce((acc, s) => acc + (s.current_tokens_used || 0), 0)}
              </p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">Live gateway meter</p>
            </div>
            <div className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322]">
              <span className="text-blue-400 text-xs font-mono uppercase">Max Concurrency Ceiling</span>
              <p className="text-2xl font-bold text-blue-400 mt-1">195 RPM</p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">Distributed Redis token bucket</p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-[#1E293B] bg-[#0D1322] space-y-4">
            <h4 className="font-semibold text-sm text-white">Sandbox Allocation Breakdown</h4>
            <div className="divide-y divide-[#1E293B]">
              {sandboxes.map((sbx) => (
                <div key={sbx.id} className="py-3 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-white font-medium">{sbx.name}</span>
                    <span className="text-slate-500 ml-2">({sbx.id})</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-slate-400">{sbx.quota_rpm} RPM</span>
                    <span className="text-emerald-400">{sbx.quota_tokens_daily.toLocaleString()} Daily Tokens</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POLICY & RBAC MATRIX */}
      {activeTab === "policies" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-white">Cross-Zone RBAC Policy Enforcement Matrix</h3>
            <p className="text-xs text-slate-400 mt-1">
              Evaluated server-side on every API request. Unauthorized access returns HTTP 403 Forbidden.
            </p>
          </div>

          <div className="rounded-xl border border-[#1E293B] bg-[#0D1322] overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#090D16] border-b border-[#1E293B] text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Operator Role</th>
                  <th className="py-3 px-4">Red Zone</th>
                  <th className="py-3 px-4">Blue Zone</th>
                  <th className="py-3 px-4">Client LLM Zone</th>
                  <th className="py-3 px-4">Control Plane</th>
                  <th className="py-3 px-4">Audit & Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {rbacMatrix.map((row) => (
                  <tr key={row.role} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <ZoneBadge zone={row.role} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={row.redZone.includes("DENIED") ? "text-red-400 font-bold" : "text-emerald-400"}>
                        {row.redZone}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={row.blueZone.includes("DENIED") ? "text-red-400 font-bold" : "text-emerald-400"}>
                        {row.blueZone}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-purple-300">{row.llmZone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={row.controlPlane.includes("DENIED") ? "text-red-400 font-bold" : "text-emerald-400"}>
                        {row.controlPlane}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={row.auditZone.includes("DENIED") ? "text-red-400 font-bold" : "text-amber-400"}>
                        {row.auditZone}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: USERS */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-white">Provisioned Lab Users & Credentials</h3>
            <button
              onClick={loadData}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" /> Refresh Users
            </button>
          </div>

          <div className="rounded-xl border border-[#1E293B] bg-[#0D1322] overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#090D16] border-b border-[#1E293B] text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">RBAC Role</th>
                  <th className="py-3 px-4">Zone Assignment</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-white">{u.username}</td>
                    <td className="py-3 px-4 text-slate-400">{u.email}</td>
                    <td className="py-3 px-4">
                      <ZoneBadge zone={u.role} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-300">{u.zone}</td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-400 font-medium">ACTIVE</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Provision Sandbox Modal */}
      {showCreateSandbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#1E293B] bg-[#0D1322] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-[#10B981]" /> Provision Isolated Evaluation Sandbox
              </h3>
              <button
                onClick={() => setShowCreateSandbox(false)}
                className="text-slate-500 hover:text-white text-xs font-mono"
              >
                ESC
              </button>
            </div>

            <form onSubmit={handleCreateSandbox} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Sandbox Identifier</label>
                <input
                  type="text"
                  value={sbxId}
                  onChange={(e) => setSbxId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white font-mono focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Healthcare Clinical Model Sandbox"
                  value={sbxName}
                  onChange={(e) => setSbxName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white font-mono focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Target Model Persona</label>
                  <select
                    value={sbxModel}
                    onChange={(e) => setSbxModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white font-mono focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Client-Finance-GPT-4">Client-Finance-GPT-4</option>
                    <option value="Client-Healthcare-LLM">Client-Healthcare-LLM</option>
                    <option value="Llama-3-8B-Secured">Llama-3-8B-Secured</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Isolation Policy</label>
                  <select
                    value={sbxIsolation}
                    onChange={(e) => setSbxIsolation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white font-mono focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="STRICT_AIRGAP">STRICT_AIRGAP</option>
                    <option value="DEFENDED_GATEWAY">DEFENDED_GATEWAY</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Quota RPM</label>
                  <input
                    type="number"
                    value={sbxQuotaRpm}
                    onChange={(e) => setSbxQuotaRpm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white font-mono focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Daily Token Budget</label>
                  <input
                    type="number"
                    value={sbxQuotaTokens}
                    onChange={(e) => setSbxQuotaTokens(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white font-mono focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateSandbox(false)}
                  className="px-4 py-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md"
                >
                  Deploy Sandbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
