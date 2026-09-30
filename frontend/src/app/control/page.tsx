"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  apiGetSandboxes,
  apiCreateSandbox,
  apiGetUsers,
} from "@/lib/api";
import {
  Server,
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
  UserCheck,
  ArrowDown,
  ArrowRight,
  Activity,
  Zap,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { MetricCard } from "@/components/ui/MetricCard";

export default function SystemHealthControlPage() {
  const { user, switchRole } = useAuth();

  const [sandboxes, setSandboxes] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"topology" | "sandboxes" | "quotas" | "policies" | "users">("topology");
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

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
        apiGetUsers(),
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
        isolation_level: sbxIsolation,
      });
      setSandboxes([created, ...sandboxes]);
      setShowCreateSandbox(false);
      setSbxId(`sbx-eval-${Math.floor(100 + Math.random() * 900)}`);
      setSbxName("");
    } catch (err: any) {
      alert(err.message || "Failed to create sandbox");
    }
  };

  // Topology node model
  const topologyNodes = [
    {
      id: "node-user",
      name: "AUTHENTICATED CLIENT",
      type: "Ingress",
      health: "HEALTHY",
      latency: "1 ms",
      requests: "24,821 today",
      availability: "100%",
      lastCheck: "Just now",
      description: "External TLS connection authenticated via Bearer JWT with RBAC role claims.",
      icon: Globe,
    },
    {
      id: "node-frontend",
      name: "NEXT.JS 14 FRONTEND",
      type: "Edge UI / SSR",
      health: "HEALTHY",
      latency: "12 ms",
      requests: "18,400 pageviews",
      availability: "99.99%",
      lastCheck: "1s ago",
      description: "Server-side rendered React 18 client with zero client-side credential exposure.",
      icon: Server,
    },
    {
      id: "node-gateway",
      name: "7-STAGE API GATEWAY",
      type: "Enforcement Engine",
      health: "HEALTHY",
      latency: "24 ms",
      requests: "24,821 requests",
      availability: "99.98%",
      lastCheck: "2s ago",
      description: "Strict pipeline: Auth &rarr; Policy &rarr; Quota &rarr; Blue In &rarr; LLM &rarr; Blue Out &rarr; Audit.",
      icon: Zap,
    },
    {
      id: "node-engine",
      name: "TARGET MODEL ENGINE",
      type: "Sandbox Airgap",
      health: "HEALTHY",
      latency: "142 ms",
      requests: "3,120 inferences",
      availability: "100%",
      lastCheck: "5s ago",
      description: "Isolated mock and fine-tuned LLM execution pods with synthetic canary token registers.",
      icon: Cpu,
    },
    {
      id: "node-guardrails",
      name: "SECURITY GUARDRAILS",
      type: "Dual-Phase Inspection",
      health: "HEALTHY",
      latency: "6 ms",
      requests: "99.2% block rate",
      availability: "100%",
      lastCheck: "Just now",
      description: "Pre-inference prompt sanitization and post-inference output canary leak filtration.",
      icon: ShieldCheck,
    },
    {
      id: "node-database",
      name: "POSTGRESQL & REDIS",
      type: "Schema Isolation",
      health: "HEALTHY",
      latency: "4 ms",
      requests: "96.4% cache hit",
      availability: "100%",
      lastCheck: "Just now",
      description: "Isolated database schemas per operational zone (red, blue, control, audit).",
      icon: Database,
    },
  ];

  if (!isAuthorized) {
    return (
      <div className="p-12 rounded-lg border border-[#E66A77]/30 bg-[#E66A77]/5 text-center max-w-lg mx-auto my-12 space-y-4">
        <Lock className="w-8 h-8 text-[#E66A77] mx-auto" />
        <h2 className="text-base font-semibold font-heading text-[#EEF2F5]">
          ZONE ACCESS RESTRICTED: ADMIN ROLE
        </h2>
        <p className="text-xs text-[#A3ADB7] leading-relaxed">
          Current identity <span className="font-mono text-[#4FD1C5]">({user?.role})</span> lacks Admin privileges. Switch role to manage sandboxes and system infrastructure.
        </p>
        <Button variant="outline" size="sm" onClick={() => switchRole("admin")}>
          Switch to Admin Role
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#1C242C]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold font-heading text-[#EEF2F5]">
              SYSTEM HEALTH & CONTROL PLANE
            </h1>
            <Badge variant="success" size="xs">
              CONTROL PLANE
            </Badge>
          </div>
          <p className="text-xs text-[#A3ADB7] max-w-2xl font-sans">
            End-to-end zero-trust architecture topology, multi-tenant sandbox provisioning, and token quota enforcement.
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
            onClick={() => setShowCreateSandbox(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Provision Sandbox
          </Button>
        </div>
      </div>

      {/* Top KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="ACTIVE SANDBOXES"
          value={sandboxes.length}
          trend={{ value: "Airgapped", direction: "neutral", context: "Multi-tenant" }}
          statusColor="success"
          badgeText="CONTAINERIZED"
        />
        <MetricCard
          label="INFRASTRUCTURE HEALTH"
          value="100%"
          trend={{ value: "5/5 Nodes Normal", direction: "up", context: "Topology" }}
          statusColor="success"
          badgeText="ALL ACTIVE"
        />
        <MetricCard
          label="ACTIVE USERS"
          value={usersList.length}
          trend={{ value: "4 Roles", direction: "neutral", context: "RBAC Enforced" }}
          statusColor="cyan"
          badgeText="IDENTITIES"
        />
        <MetricCard
          label="GATEWAY LATENCY P50"
          value="24 ms"
          trend={{ value: "-4ms vs peak", direction: "down", context: "Optimized" }}
          statusColor="violet"
          badgeText="7-STAGE"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[#1C242C] gap-6 text-xs font-mono">
        <button
          onClick={() => setActiveTab("topology")}
          className={`pb-3 font-medium transition flex items-center gap-2 border-b-2 ${
            activeTab === "topology"
              ? "border-[#45C995] text-[#45C995]"
              : "border-transparent text-[#68737E] hover:text-[#A3ADB7]"
          }`}
        >
          <Server className="w-4 h-4" />
          Infrastructure Topology
        </button>
        <button
          onClick={() => setActiveTab("sandboxes")}
          className={`pb-3 font-medium transition flex items-center gap-2 border-b-2 ${
            activeTab === "sandboxes"
              ? "border-[#45C995] text-[#45C995]"
              : "border-transparent text-[#68737E] hover:text-[#A3ADB7]"
          }`}
        >
          <Cpu className="w-4 h-4" />
          Sandboxes ({sandboxes.length})
        </button>
        <button
          onClick={() => setActiveTab("quotas")}
          className={`pb-3 font-medium transition flex items-center gap-2 border-b-2 ${
            activeTab === "quotas"
              ? "border-[#45C995] text-[#45C995]"
              : "border-transparent text-[#68737E] hover:text-[#A3ADB7]"
          }`}
        >
          <Sliders className="w-4 h-4" />
          Token Quotas & Rate Limits
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 font-medium transition flex items-center gap-2 border-b-2 ${
            activeTab === "users"
              ? "border-[#45C995] text-[#45C995]"
              : "border-transparent text-[#68737E] hover:text-[#A3ADB7]"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Users & RBAC ({usersList.length})
        </button>
      </div>

      {/* TAB 1: Infrastructure Topology */}
      {activeTab === "topology" && (
        <div className="space-y-6">
          <div className="p-5 rounded-lg bg-[#12171D] border border-[#1C242C] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C242C]">
              <div>
                <h3 className="font-heading font-semibold text-sm text-[#EEF2F5]">
                  End-to-End Zero-Trust Service Topology
                </h3>
                <p className="text-[11px] text-[#A3ADB7] mt-0.5">
                  Click any service node to inspect live latency telemetry, health metrics, and isolation boundaries.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#45C995]">
                <span className="h-2 w-2 rounded-full bg-[#45C995] animate-pulse" />
                <span>Zero Bypass Sockets</span>
              </div>
            </div>

            {/* Visual Topology Diagram */}
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2 py-6 px-4 bg-[#080A0D] rounded-lg border border-[#1C242C]">
              {topologyNodes.map((node, idx) => {
                const Icon = node.icon;
                return (
                  <React.Fragment key={node.id}>
                    <div
                      onClick={() => setSelectedNode(node)}
                      className="w-full xl:w-44 p-3.5 rounded-lg bg-[#12171D] border border-[#1C242C] hover:border-[#4FD1C5] cursor-pointer transition space-y-2 flex flex-col justify-between group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-1.5 rounded bg-[#080A0D] border border-[#1C242C] text-[#4FD1C5] group-hover:text-[#EEF2F5] transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono text-[#68737E]">0{idx + 1}</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-[#45C995] animate-pulse" />
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-[#EEF2F5] font-sans block truncate">
                          {node.name}
                        </span>
                        <span className="text-[9px] font-mono text-[#68737E] block truncate">
                          {node.type}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-[#1C242C] flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#45C995]">{node.health}</span>
                        <span className="text-[#A3ADB7]">{node.latency}</span>
                      </div>
                    </div>

                    {idx < topologyNodes.length - 1 && (
                      <div className="hidden xl:flex items-center text-[#68737E] shrink-0">
                        <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Sandboxes Table */}
      {activeTab === "sandboxes" && (
        <div className="p-5 rounded-lg bg-[#12171D] border border-[#1C242C] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C242C]">
            <div>
              <h3 className="font-heading font-semibold text-sm text-[#EEF2F5]">
                Provisioned AI Target Sandboxes
              </h3>
              <p className="text-[11px] text-[#A3ADB7] mt-0.5">
                Isolated evaluation targets governed by quota limits and default-deny CNI rules.
              </p>
            </div>
            <span className="text-xs font-mono text-[#68737E]">
              {sandboxes.length} sandboxes active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#080A0D] border-b border-[#1C242C] text-[#68737E] uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Sandbox ID</th>
                  <th className="py-2.5 px-3">Display Name</th>
                  <th className="py-2.5 px-3">Target Model</th>
                  <th className="py-2.5 px-3">Quota (RPM)</th>
                  <th className="py-2.5 px-3">Daily Token Budget</th>
                  <th className="py-2.5 px-3">Isolation Level</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C242C]">
                {sandboxes.map((sbx) => (
                  <tr key={sbx.id} className="hover:bg-[#171D24]/50 transition">
                    <td className="py-2.5 px-3 font-semibold text-[#45C995]">{sbx.id}</td>
                    <td className="py-2.5 px-3 text-[#EEF2F5] font-sans">{sbx.name}</td>
                    <td className="py-2.5 px-3 text-[#7C8CFF]">{sbx.target_model}</td>
                    <td className="py-2.5 px-3 text-[#4FD1C5]">{sbx.quota_rpm} RPM</td>
                    <td className="py-2.5 px-3 text-[#A3ADB7]">{sbx.quota_tokens_daily} tokens</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="success" size="xs">
                        {sbx.isolation_level}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#4FD1C5] hover:underline cursor-pointer">
                      Configure
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Quotas & Limits */}
      {activeTab === "quotas" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sandboxes.map((sbx) => (
            <div
              key={sbx.id}
              className="p-5 rounded-lg bg-[#12171D] border border-[#1C242C] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#EEF2F5] font-sans">
                  {sbx.name}
                </span>
                <Badge variant="cyan" size="xs">
                  {sbx.quota_rpm} RPM
                </Badge>
              </div>

              <div className="space-y-2 text-xs font-mono pt-2">
                <div className="flex justify-between text-[#A3ADB7]">
                  <span>Daily Token Usage</span>
                  <span>14,200 / {sbx.quota_tokens_daily}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#080A0D] overflow-hidden">
                  <div
                    className="h-full bg-[#4FD1C5] rounded-full"
                    style={{
                      width: `${Math.min(100, (14200 / sbx.quota_tokens_daily) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Users & RBAC */}
      {activeTab === "users" && (
        <div className="p-5 rounded-lg bg-[#12171D] border border-[#1C242C] space-y-4">
          <h3 className="font-heading font-semibold text-sm text-[#EEF2F5]">
            Identities & Zone RBAC Permissions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#080A0D] border-b border-[#1C242C] text-[#68737E] uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Username</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Assigned Zone</th>
                  <th className="py-2.5 px-3">Permission Boundaries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C242C]">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-[#171D24]/50 transition">
                    <td className="py-2.5 px-3 font-semibold text-[#EEF2F5]">{u.username}</td>
                    <td className="py-2.5 px-3 text-[#4FD1C5]">{u.role}</td>
                    <td className="py-2.5 px-3 text-[#7C8CFF]">{u.zone}</td>
                    <td className="py-2.5 px-3 text-[#A3ADB7]">
                      {u.role === "admin"
                        ? "Full Control Plane & All Zones"
                        : u.role === "red_operator"
                        ? "Red Attacks & Campaigns Only (Dual-Blind)"
                        : u.role === "blue_operator"
                        ? "Blue Defenses & Sanitized Feeds Only"
                        : "Audit & SHA-256 Ledger Verification"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Topology Node Inspection Drawer */}
      <Drawer
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        title={selectedNode?.name || "Service Node"}
        subtitle={`Type: ${selectedNode?.type} • Latency: ${selectedNode?.latency}`}
        badge={{
          text: selectedNode?.health || "HEALTHY",
          variant: "success",
        }}
        rawJson={selectedNode}
        actions={
          <Button variant="primary" size="sm" onClick={() => setSelectedNode(null)}>
            Close
          </Button>
        }
      >
        {selectedNode && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-3.5 rounded bg-[#080A0D] border border-[#1C242C] space-y-1">
              <span className="text-[10px] text-[#68737E] uppercase block">
                Node Description
              </span>
              <p className="text-xs text-[#A3ADB7] font-sans leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded bg-[#080A0D] border border-[#1C242C]">
                <span className="text-[10px] text-[#68737E] block">Availability</span>
                <span className="text-xs font-bold text-[#45C995]">
                  {selectedNode.availability}
                </span>
              </div>
              <div className="p-3 rounded bg-[#080A0D] border border-[#1C242C]">
                <span className="text-[10px] text-[#68737E] block">Requests Handled</span>
                <span className="text-xs font-bold text-[#4FD1C5]">
                  {selectedNode.requests}
                </span>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create Sandbox Modal */}
      {showCreateSandbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowCreateSandbox(false)}
            className="fixed inset-0 bg-[#080A0D]/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg bg-[#12171D] border border-[#252D36] rounded-xl shadow-2xl p-6 z-10 space-y-4">
            <h3 className="font-heading font-semibold text-base text-[#EEF2F5]">
              Provision Isolated AI Sandbox
            </h3>
            <form onSubmit={handleCreateSandbox} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[#A3ADB7]">Sandbox Identifier</label>
                <input
                  type="text"
                  value={sbxId}
                  onChange={(e) => setSbxId(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#080A0D] border border-[#1C242C] text-[#EEF2F5] focus:border-[#45C995] outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#A3ADB7]">Display Name</label>
                <input
                  type="text"
                  value={sbxName}
                  onChange={(e) => setSbxName(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#080A0D] border border-[#1C242C] text-[#EEF2F5] focus:border-[#45C995] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#A3ADB7]">RPM Rate Limit</label>
                  <input
                    type="number"
                    value={sbxQuotaRpm}
                    onChange={(e) => setSbxQuotaRpm(Number(e.target.value))}
                    className="w-full p-2.5 rounded bg-[#080A0D] border border-[#1C242C] text-[#EEF2F5] outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#A3ADB7]">Daily Token Budget</label>
                  <input
                    type="number"
                    value={sbxQuotaTokens}
                    onChange={(e) => setSbxQuotaTokens(Number(e.target.value))}
                    className="w-full p-2.5 rounded bg-[#080A0D] border border-[#1C242C] text-[#EEF2F5] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1C242C]">
                <Button variant="ghost" size="sm" onClick={() => setShowCreateSandbox(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Provision Container
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
