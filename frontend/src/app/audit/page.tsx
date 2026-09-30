"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { ZoneBadge } from "@/components/ZoneBadge";
import { 
  apiGetAuditBlocks, 
  apiVerifyAuditIntegrity, 
  apiSimulateTamper, 
  apiRepairChain, 
  apiExportAuditEvidence 
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
  Wrench
} from "lucide-react";

export default function AuditPage() {
  const { user, switchRole } = useAuth();

  const [blocks, setBlocks] = useState<any[]>([]);
  const [verification, setVerification] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [tampering, setTampering] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const [exporting, setExporting] = useState(false);

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
    if (!confirm("This will intentionally mutate the metadata of block #1 in the database to test the cryptographic tamper detection algorithm. Proceed?")) return;
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
      const blob = new Blob([JSON.stringify(evidence, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bayora-audit-evidence-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || "Evidence export failed");
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
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="rounded-2xl border border-amber-500/40 bg-[#0D1322] p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center border border-amber-500/40">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Zone Policy Violation (403 Forbidden)</h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            You are currently authenticated as <span className="font-mono text-purple-400 font-medium">{user?.role || "anonymous"}</span>.
            Under Bayora's 4-pillar isolation architecture, access to the Audit & Evidence Zone requires Compliance Auditor or Admin privileges.
          </p>
          <div className="pt-2">
            <button
              onClick={() => switchRole("auditor")}
              className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs shadow-lg transition"
            >
              Switch to Auditor Role
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Cryptographic Audit & Evidence Ledger</h1>
              <ZoneBadge zone="audit_zone" size="sm" />
            </div>
            <p className="text-xs text-slate-400">
              SHA-256 hash-chained append-only log ensuring mathematical non-repudiation and tamper detection.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${verifying ? "animate-spin" : ""}`} />
            Verify Chain Integrity
          </button>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-3.5 py-2 rounded-lg border border-slate-700 bg-[#0D1322] hover:bg-slate-800 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            Export Evidence JSON
          </button>

          <button
            onClick={handleSimulateTamper}
            disabled={tampering}
            className="px-3.5 py-2 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono font-medium flex items-center gap-1.5 transition"
            title="Deliberately corrupts block #1 to prove tamper detection works"
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            Simulate Tamper
          </button>

          {verification?.tamper_detected && (
            <button
              onClick={handleRepairChain}
              disabled={repairing}
              className="px-3.5 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-mono font-medium flex items-center gap-1.5 transition"
            >
              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
              Repair Chain
            </button>
          )}
        </div>
      </div>

      {/* Cryptographic Verification Proof Banner */}
      {verification && (
        <div className={`p-5 rounded-xl border text-xs font-mono transition-all ${
          verification.tamper_detected
            ? "border-red-500 bg-red-500/10 text-red-200"
            : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {verification.tamper_detected ? (
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">
                    {verification.tamper_detected ? "CRITICAL: CRYPTOGRAPHIC TAMPER DETECTED" : "SHA-256 HASH CHAIN INTEGRITY: 100% VALID"}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    verification.tamper_detected ? "bg-red-500 text-white" : "bg-emerald-500/20 text-emerald-300"
                  }`}>
                    {verification.status}
                  </span>
                </div>
                <p className="text-slate-300 mt-1">
                  {verification.tamper_detected
                    ? `Corrupted block identified at Block #${verification.corrupted_block_index} (${verification.failure_type}). Unbroken mathematical continuity broken.`
                    : `All ${verification.total_blocks} sequential blocks verified from Genesis (0000000...) to Head.`
                  }
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1">
              <div>Verified Blocks: <strong className="text-white">{verification.verified_blocks} / {verification.total_blocks}</strong></div>
              <div>Digital Seal: <span className="text-purple-300">{verification.seal?.slice(0, 24)}...</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Ledger Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-white">Append-Only Sequential Block Ledger</h3>
          <button
            onClick={loadBlocks}
            className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" /> Refresh Blocks
          </button>
        </div>

        <div className="rounded-xl border border-[#1E293B] bg-[#0D1322] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#090D16] border-b border-[#1E293B] text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Block #</th>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">Actor Role</th>
                  <th className="py-3 px-4">Previous Hash</th>
                  <th className="py-3 px-4">Current Block Hash</th>
                  <th className="py-3 px-4">Payload SHA-256</th>
                  <th className="py-3 px-4">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {blocks.map((b) => (
                  <tr key={b.block_index} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-white">
                      #{b.block_index}
                      {b.block_index === 0 && <span className="ml-1 text-[9px] text-amber-400 font-normal">(GENESIS)</span>}
                    </td>
                    <td className="py-3 px-4 text-purple-300">{b.action_type}</td>
                    <td className="py-3 px-4">
                      <span className="text-slate-300">{b.actor_role}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 truncate max-w-[120px]" title={b.prev_block_hash}>
                      {b.prev_block_hash.slice(0, 14)}...
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold truncate max-w-[120px]" title={b.block_hash}>
                      {b.block_hash.slice(0, 14)}...
                    </td>
                    <td className="py-3 px-4 text-slate-400 truncate max-w-[120px]" title={b.payload_sha256}>
                      {b.payload_sha256.slice(0, 14)}...
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sealed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
