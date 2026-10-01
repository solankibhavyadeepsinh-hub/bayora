"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  apiGetAuditBlocks,
  apiVerifyAuditIntegrity,
  apiSimulateTamper,
  apiRepairChain,
  apiExportAuditEvidence,
} from "@/lib/api";
import {
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Download,
  Lock,
  CheckCircle2,
  XCircle,
  Hash,
  Database,
  ExternalLink,
  Flame,
  Wrench,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { MetricCard } from "@/components/ui/MetricCard";

export default function EvidenceLedgerPage() {
  const { user, switchRole } = useAuth();

  const [blocks, setBlocks] = useState<any[]>([]);
  const [verification, setVerification] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [tampering, setTampering] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<any | null>(null);

  const isAuthorized = user?.role === "auditor" || user?.role === "admin";

  const loadBlocks = async () => {
    if (!isAuthorized) return;
    setLoading(true);
    try {
      const data = await apiGetAuditBlocks(100);
      setBlocks(data);
    } catch (err) {
      console.error("Failed to load audit blocks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const rep = await apiVerifyAuditIntegrity();
      setVerification(rep);
    } catch (err: any) {
      alert(err.message || "Integrity verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleSimulateTamper = async () => {
    if (
      !confirm(
        "This will deliberately mutate the database payload of block #1 to demonstrate instant cryptographic tamper detection. Proceed?"
      )
    )
      return;

    setTampering(true);
    try {
      await apiSimulateTamper(1);
      await loadBlocks();
      await handleVerify();
    } catch (err: any) {
      alert(err.message || "Tamper simulation failed");
    } finally {
      setTampering(false);
    }
  };

  const handleRepairChain = async () => {
    setRepairing(true);
    try {
      await apiRepairChain();
      await loadBlocks();
      await handleVerify();
    } catch (err: any) {
      alert(err.message || "Repair chain failed");
    } finally {
      setRepairing(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const evidence = await apiExportAuditEvidence();
      const blob = new Blob([JSON.stringify(evidence, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bayora-evidence-${new Date().toISOString().substring(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      loadBlocks();
      handleVerify();
    }
  }, [user]);

  if (!isAuthorized) {
    return (
      <div className="p-12 rounded-lg border border-[#D96573]/30 bg-[#D96573]/5 text-center max-w-lg mx-auto my-12 space-y-4">
        <Lock className="w-8 h-8 text-[#D96573] mx-auto" />
        <h2 className="text-base font-semibold font-heading text-[#F1F4F6]">
          ZONE ACCESS RESTRICTED: AUDITOR ROLE
        </h2>
        <p className="text-xs text-[#A6B0BA] leading-relaxed">
          Current identity <span className="font-mono text-[#4BC7B5]">({user?.role})</span> lacks Auditor privileges. Switch role to inspect cryptographic proofs.
        </p>
        <Button variant="outline" size="sm" onClick={() => switchRole("auditor")}>
          Switch to Auditor Role
        </Button>
      </div>
    );
  }

  const isChainValid = verification?.status === "VALID" && !verification?.tamper_detected;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#1B2229]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F1F4F6]">
              EVIDENCE & CRYPTOGRAPHIC LEDGER
            </h1>
            <Badge variant="warning" size="xs">
              SHA-256 HASH CHAIN
            </Badge>
          </div>
          <p className="text-xs text-[#A6B0BA] max-w-2xl font-sans">
            Append-only immutable audit trail linking all evaluations, defense actions, and model inferences.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={handleVerify}
            loading={verifying}
            icon={<ShieldCheck className="w-3.5 h-3.5" />}
          >
            Verify Integrity
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleSimulateTamper}
            loading={tampering}
            icon={<Flame className="w-3.5 h-3.5" />}
          >
            Simulate Tamper
          </Button>

          {!isChainValid && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRepairChain}
              loading={repairing}
              icon={<Wrench className="w-3.5 h-3.5 text-[#42B883]" />}
            >
              Repair Ledger
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            loading={exporting}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Proof
          </Button>
        </div>
      </div>

      {/* Verification State Banner */}
      {verification && (
        <div
          className={`p-4 rounded-lg border transition ${
            isChainValid
              ? "bg-[#42B883]/10 border-[#42B883]/30 text-[#42B883]"
              : "bg-[#D96573]/10 border-[#D96573]/30 text-[#D96573]"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {isChainValid ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0" />
              )}
              <div>
                <h3 className="font-semibold text-sm font-sans">
                  {isChainValid
                    ? "Cryptographic Hash Chain: VERIFIED INTACT"
                    : `Cryptographic Tamper Detected in Block #${verification.corrupted_block_index}!`}
                </h3>
                <p className="text-xs text-[#A6B0BA] font-mono mt-0.5">
                  {isChainValid
                    ? `All ${verification.total_blocks} blocks cryptographically linked from Genesis to Head with unbroken SHA-256 continuity.`
                    : `Discontinuity discovered: ${verification.failure_type}. Hash recomputation mismatched stored block signature.`}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0A0D10] border border-[#1B2229] text-[#F1F4F6] shrink-0">
              {verification.verification_timestamp?.substring(11, 19)} UTC
            </span>
          </div>
        </div>
      )}

      {/* Top KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="SEALED BLOCKS"
          value={blocks.length}
          trend={{ value: "Append-only", direction: "neutral", context: "Blocks" }}
          statusColor="warning"
          badgeText="IMMUTABLE"
        />
        <MetricCard
          label="CHAIN INTEGRITY"
          value={isChainValid ? "VALID" : "CORRUPTED"}
          trend={{
            value: isChainValid ? "100% Intact" : "Tamper Alert",
            direction: isChainValid ? "up" : "down",
          }}
          statusColor={isChainValid ? "success" : "danger"}
          badgeText="SHA-256"
        />
        <MetricCard
          label="GENESIS BLOCK"
          value="00000000..."
          trend={{ value: "Immutable Anchor", direction: "neutral", context: "Block #0" }}
          statusColor="teal"
          badgeText="ROOT ANCHOR"
        />
        <MetricCard
          label="CHAIN HEAD"
          value={blocks.length > 0 ? blocks[blocks.length - 1].block_hash.substring(0, 10) + "..." : "Standby"}
          trend={{ value: "Latest Seal", direction: "neutral", context: "Continuous" }}
          statusColor="indigo"
          badgeText="VERIFIED"
        />
      </div>

      {/* Ledger Table */}
      <div className="p-5 rounded-lg bg-[#11161B] border border-[#1B2229] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1B2229]">
          <div>
            <h3 className="font-heading font-semibold text-sm text-[#F1F4F6]">
              SHA-256 Immutable Audit Ledger
            </h3>
            <p className="text-[11px] text-[#A6B0BA] mt-0.5">
              Click any block to inspect full cryptographic headers, previous hash links, and raw JSON evidence.
            </p>
          </div>
          <span className="text-xs font-mono text-[#707B85]">
            {blocks.length} blocks sealed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0A0D10] border-b border-[#1B2229] text-[#707B85] uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Block #</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Actor Role</th>
                <th className="py-2.5 px-3">Previous Block Hash</th>
                <th className="py-2.5 px-3">Current Block SHA-256</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2229]">
              {blocks.map((b) => (
                <tr
                  key={b.block_index}
                  onClick={() => setSelectedBlock(b)}
                  className="hover:bg-[#171D23]/50 cursor-pointer transition"
                >
                  <td className="py-2.5 px-3 font-bold text-[#D6A856]">
                    #{b.block_index}
                  </td>
                  <td className="py-2.5 px-3 text-[#707B85]">
                    {b.timestamp ? b.timestamp.substring(11, 19) : "15:42:01"}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#F1F4F6]">
                    {b.action_type}
                  </td>
                  <td className="py-2.5 px-3 text-[#4BC7B5]">{b.actor_role}</td>
                  <td className="py-2.5 px-3 text-[#707B85] truncate max-w-[120px]">
                    {b.prev_block_hash}
                  </td>
                  <td className="py-2.5 px-3 text-[#6675D9] truncate max-w-[140px]">
                    {b.block_hash}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#D6A856] hover:underline">
                    Inspect
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block Inspection Drawer */}
      <Drawer
        isOpen={!!selectedBlock}
        onClose={() => setSelectedBlock(null)}
        title={`Audit Block #${selectedBlock?.block_index}`}
        subtitle={`Action: ${selectedBlock?.action_type} • Actor: ${selectedBlock?.actor_role}`}
        badge={{
          text: "SEALED",
          variant: "warning",
        }}
        rawJson={selectedBlock}
        actions={
          <Button variant="primary" size="sm" onClick={() => setSelectedBlock(null)}>
            Dismiss
          </Button>
        }
      >
        {selectedBlock && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-3.5 rounded bg-[#0A0D10] border border-[#1B2229] space-y-1">
              <span className="text-[10px] text-[#707B85] uppercase block">
                Current Block SHA-256 Hash
              </span>
              <span className="text-xs font-bold text-[#4BC7B5] break-all">
                {selectedBlock.block_hash}
              </span>
            </div>

            <div className="p-3.5 rounded bg-[#0A0D10] border border-[#1B2229] space-y-1">
              <span className="text-[10px] text-[#707B85] uppercase block">
                Previous Block Hash (Link)
              </span>
              <span className="text-xs font-bold text-[#707B85] break-all">
                {selectedBlock.prev_block_hash}
              </span>
            </div>

            <div className="p-3.5 rounded bg-[#0A0D10] border border-[#1B2229] space-y-1">
              <span className="text-[10px] text-[#707B85] uppercase block">
                Actor Identity Hash
              </span>
              <span className="text-xs text-[#A6B0BA] break-all">
                {selectedBlock.actor_id_hash}
              </span>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
