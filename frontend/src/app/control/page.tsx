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
  Activity,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { MetricCard } from "@/components/ui/MetricCard";
import { DimensionalTopology } from "@/components/dimensional/DimensionalTopology";

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



  if (!isAuthorized) {
    return (
      <div className="p-12 rounded-lg border border-[#D96573]/30 bg-[#D96573]/5 text-center max-w-lg mx-auto my-12 space-y-4">
        <Lock className="w-8 h-8 text-[#D96573] mx-auto" />
        <h2 className="text-base font-semibold font-heading text-[#F1F4F6]">
          ZONE ACCESS RESTRICTED: ADMIN ROLE
        </h2>
        <p className="text-xs text-[#A6B0BA] leading-relaxed">
          Current identity <span className="font-mono text-[#4BC7B5]">({user?.role})</span> lacks Admin privileges. Switch role to manage sandboxes and system infrastructure.
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#1B2229]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F1F4F6]">
              SYSTEM HEALTH & CONTROL PLANE
            </h1>
            <Badge variant="success" size="xs">
              CONTROL PLANE
            </Badge>
          </div>
          <p className="text-xs text-[#A6B0BA] max-w-2xl font-sans">
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
      <div className="flex items-center border-b border-[#1B2229] gap-6 text-xs font-mono">
        <button
          onClick={() => setActiveTab("topology")}
          className={`pb-3 font-medium transition flex items-center gap-2 border-b-2 ${
            activeTab === "topology"
              ? "border-[#42B883] text-[#42B883]"
              : "border-transparent text-[#707B85] hover:text-[#A6B0BA]"
          }`}
        >
          <Server className="w-4 h-4" />
          Infrastructure Topology
        </button>
        <button
          onClick={() => setActiveTab("sandboxes")}
          className={`pb-3 font-medium transition flex items-center gap-2 border-b-2 ${
            activeTab === "sandboxes"
              ? "border-[#42B883] text-[#42B883]"
              : "border-transparent text-[#707B85] hover:text-[#A6B0BA]"
          }`}
        >
          <Cpu className="w-4 h-4" />
          Sandboxes ({sandboxes.length})
        </button>
        <button
          onClick={() => setActiveTab("quotas")}
          className={`pb-3 font-medium transition flex items-center gap-2 border-b-2 ${
            activeTab === "quotas"
              ? "border-[#42B883] text-[#42B883]"
              : "border-transparent text-[#707B85] hover:text-[#A6B0BA]"
          }`}
        >
          <Sliders className="w-4 h-4" />
          Token Quotas & Rate Limits
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 font-medium transition flex items-center gap-2 border-b-2 ${
            activeTab === "users"
              ? "border-[#42B883] text-[#42B883]"
              : "border-transparent text-[#707B85] hover:text-[#A6B0BA]"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Users & RBAC ({usersList.length})
        </button>
      </div>

      {/* TAB 1: Infrastructure Topology */}
      {activeTab === "topology" && (
        <div className="space-y-6">
          <DimensionalTopology onSelectNode={(node) => setSelectedNode(node)} />
        </div>
      )}

      {/* TAB 2: Sandboxes Table */}
      {activeTab === "sandboxes" && (
        <div className="p-5 rounded-lg bg-[#11161B] border border-[#1B2229] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1B2229]">
            <div>
              <h3 className="font-heading font-semibold text-sm text-[#F1F4F6]">
                Provisioned AI Target Sandboxes
              </h3>
              <p className="text-[11px] text-[#A6B0BA] mt-0.5">
                Isolated evaluation targets governed by quota limits and default-deny CNI rules.
              </p>
            </div>
            <span className="text-xs font-mono text-[#707B85]">
              {sandboxes.length} sandboxes active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0A0D10] border-b border-[#1B2229] text-[#707B85] uppercase text-[10px]">
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
              <tbody className="divide-y divide-[#1B2229]">
                {sandboxes.map((sbx) => (
                  <tr key={sbx.id} className="hover:bg-[#171D23]/50 transition">
                    <td className="py-2.5 px-3 font-semibold text-[#42B883]">{sbx.id}</td>
                    <td className="py-2.5 px-3 text-[#F1F4F6] font-sans">{sbx.name}</td>
                    <td className="py-2.5 px-3 text-[#6675D9]">{sbx.target_model}</td>
                    <td className="py-2.5 px-3 text-[#4BC7B5]">{sbx.quota_rpm} RPM</td>
                    <td className="py-2.5 px-3 text-[#A6B0BA]">{sbx.quota_tokens_daily} tokens</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="success" size="xs">
                        {sbx.isolation_level}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#4BC7B5] hover:underline cursor-pointer">
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
              className="p-5 rounded-lg bg-[#11161B] border border-[#1B2229] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F1F4F6] font-sans">
                  {sbx.name}
                </span>
                <Badge variant="cyan" size="xs">
                  {sbx.quota_rpm} RPM
                </Badge>
              </div>

              <div className="space-y-2 text-xs font-mono pt-2">
                <div className="flex justify-between text-[#A6B0BA]">
                  <span>Daily Token Usage</span>
                  <span>14,200 / {sbx.quota_tokens_daily}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#0A0D10] overflow-hidden">
                  <div
                    className="h-full bg-[#4BC7B5] rounded-full"
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
        <div className="p-5 rounded-lg bg-[#11161B] border border-[#1B2229] space-y-4">
          <h3 className="font-heading font-semibold text-sm text-[#F1F4F6]">
            Identities & Zone RBAC Permissions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0A0D10] border-b border-[#1B2229] text-[#707B85] uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Username</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Assigned Zone</th>
                  <th className="py-2.5 px-3">Permission Boundaries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B2229]">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-[#171D23]/50 transition">
                    <td className="py-2.5 px-3 font-semibold text-[#F1F4F6]">{u.username}</td>
                    <td className="py-2.5 px-3 text-[#4BC7B5]">{u.role}</td>
                    <td className="py-2.5 px-3 text-[#6675D9]">{u.zone}</td>
                    <td className="py-2.5 px-3 text-[#A6B0BA]">
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
            <div className="p-3.5 rounded bg-[#0A0D10] border border-[#1B2229] space-y-1">
              <span className="text-[10px] text-[#707B85] uppercase block">
                Node Description
              </span>
              <p className="text-xs text-[#A6B0BA] font-sans leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded bg-[#0A0D10] border border-[#1B2229]">
                <span className="text-[10px] text-[#707B85] block">Availability</span>
                <span className="text-xs font-bold text-[#42B883]">
                  {selectedNode.availability}
                </span>
              </div>
              <div className="p-3 rounded bg-[#0A0D10] border border-[#1B2229]">
                <span className="text-[10px] text-[#707B85] block">Requests Handled</span>
                <span className="text-xs font-bold text-[#4BC7B5]">
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
            className="fixed inset-0 bg-[#0A0D10]/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg bg-[#11161B] border border-[#2A333C] rounded-xl shadow-2xl p-6 z-10 space-y-4">
            <h3 className="font-heading font-semibold text-base text-[#F1F4F6]">
              Provision Isolated AI Sandbox
            </h3>
            <form onSubmit={handleCreateSandbox} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[#A6B0BA]">Sandbox Identifier</label>
                <input
                  type="text"
                  value={sbxId}
                  onChange={(e) => setSbxId(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#0A0D10] border border-[#1B2229] text-[#F1F4F6] focus:border-[#42B883] outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#A6B0BA]">Display Name</label>
                <input
                  type="text"
                  value={sbxName}
                  onChange={(e) => setSbxName(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#0A0D10] border border-[#1B2229] text-[#F1F4F6] focus:border-[#42B883] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#A6B0BA]">RPM Rate Limit</label>
                  <input
                    type="number"
                    value={sbxQuotaRpm}
                    onChange={(e) => setSbxQuotaRpm(Number(e.target.value))}
                    className="w-full p-2.5 rounded bg-[#0A0D10] border border-[#1B2229] text-[#F1F4F6] outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#A6B0BA]">Daily Token Budget</label>
                  <input
                    type="number"
                    value={sbxQuotaTokens}
                    onChange={(e) => setSbxQuotaTokens(Number(e.target.value))}
                    className="w-full p-2.5 rounded bg-[#0A0D10] border border-[#1B2229] text-[#F1F4F6] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1B2229]">
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
