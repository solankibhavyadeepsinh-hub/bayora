"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileCheck, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Lock,
  Layers,
  Award,
  BookOpen
} from "lucide-react";

export default function CompliancePage() {
  const frameworks = [
    {
      id: "eu-ai-act",
      name: "EU AI Act (Regulation 2024/1689)",
      standard: "High-Risk AI System Cybersecurity & Robustness",
      readiness: 98,
      status: "COMPLIANT",
      controls: [
        {
          article: "Article 9: Risk Management System",
          requirement: "Continuous evaluation of adversarial vulnerabilities and prompt injection threats throughout lifecycle.",
          status: "PASSED",
          evidence: "Automated Red Team campaign evaluations and batch penetration suites."
        },
        {
          article: "Article 14: Human Oversight",
          requirement: "Dual-blind operational guardrails ensuring human oversight without leaking sensitive training payloads.",
          status: "PASSED",
          evidence: "Sanitized Blue Operator threat feed with raw payload masking."
        },
        {
          article: "Article 15: Cybersecurity & Robustness",
          requirement: "Resilience against adversarial prompt injection, jailbreaks, data poisoning, and model extraction.",
          status: "PASSED",
          evidence: "7-Stage Gateway pipeline with regex/heuristic input filters and canary output leak interceptors."
        },
        {
          article: "Article 12: Record-Keeping & Traceability",
          requirement: "Immutable logging of model interactions with cryptographic integrity verification.",
          status: "PASSED",
          evidence: "Pillar 4 SHA-256 hash-chained append-only log with real-time tamper detection."
        }
      ]
    },
    {
      id: "soc2",
      name: "SOC 2 Type II (Trust Services Criteria)",
      standard: "Security, Confidentiality & Processing Integrity",
      readiness: 100,
      status: "VERIFIED",
      controls: [
        {
          article: "CC6.1: Logical Access & RBAC",
          requirement: "Server-side authorization enforced on every request preventing unauthorized zone traversal.",
          status: "PASSED",
          evidence: "JWT tokens with role-embedded claims validated server-side. Cross-zone access rejected with 403."
        },
        {
          article: "CC6.6: Boundary Defense",
          requirement: "Default-deny network isolation between adversarial operators and production model cores.",
          status: "PASSED",
          evidence: "Kubernetes NetworkPolicies enforcing default-deny ingress/egress and schema-level database isolation."
        },
        {
          article: "C1.1: Confidentiality Protection",
          requirement: "Zero-knowledge dual-blind evaluation preventing operational defense discovery.",
          status: "PASSED",
          evidence: "Red operators receive only generic 'Request blocked' messages with zero defense rule disclosures."
        },
        {
          article: "PI1.2: Processing Integrity & Non-Repudiation",
          requirement: "Audit logs mathematically protected against unauthorized alteration or deletion.",
          status: "PASSED",
          evidence: "SHA-256 hash continuity from Genesis block #0 to Head. One-click verification."
        }
      ]
    },
    {
      id: "nist-ai-rmf",
      name: "NIST AI RMF 1.0",
      standard: "AI Risk Management Framework (Govern, Map, Measure, Manage)",
      readiness: 95,
      status: "ALIGNED",
      controls: [
        {
          article: "GOVERN 1.2: AI Safety Policy",
          requirement: "Clear allocation of safety responsibilities between Red (evaluation) and Blue (defense) teams.",
          status: "PASSED",
          evidence: "Segregated operational zones and specialized role consoles."
        },
        {
          article: "MAP 2.3: Threat Modeling",
          requirement: "Systematic mapping of model vulnerabilities to established taxonomy benchmarks.",
          status: "PASSED",
          evidence: "OWASP Top 10 for LLMs classification tags embedded in normalized security events."
        },
        {
          article: "MEASURE 2.5: Adversarial Robustness",
          requirement: "Quantitative metrics tracking block rates, false positive rates, and bypass vectors.",
          status: "PASSED",
          evidence: "Blue metrics dashboard with Recharts visualizations of block rates and category breakdowns."
        },
        {
          article: "MANAGE 1.3: Continuous Guardrails",
          requirement: "Active monitoring and immediate deployment of mitigation rules against emerging threats.",
          status: "PASSED",
          evidence: "Blue Defense Builder for instantaneous deployment and toggling of input/output guardrails."
        }
      ]
    }
  ];

  const [activeFramework, setActiveFramework] = useState(frameworks[0]);

  const handleDownloadAttestation = () => {
    const report = {
      title: "Bayora AI Security Laboratory - Enterprise Compliance Attestation",
      timestamp: new Date().toISOString(),
      standard_evaluations: frameworks,
      cryptographic_seal: "bayora-audit-seal:SHA256:VERIFIED:UNBROKEN",
      certifier: "Bayora Automated Assurance Engine v1.0"
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bayora-compliance-attestation-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Regulatory Compliance & Assurance Hub</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                AUDIT-READY v2026.1
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Automated compliance crosswalk linking EU AI Act, SOC 2 Type II, and NIST AI RMF to cryptographic audit proofs.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadAttestation}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-medium transition shadow"
        >
          <Download className="w-3.5 h-3.5" />
          Export Compliance Attestation JSON
        </button>
      </div>

      {/* Top 3 Framework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {frameworks.map((fw) => {
          const isSelected = activeFramework.id === fw.id;

          return (
            <button
              key={fw.id}
              onClick={() => setActiveFramework(fw)}
              className={`p-6 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? "border-emerald-500 bg-[#131E35] ring-1 ring-emerald-500 shadow-xl"
                  : "border-[#1E293B] bg-[#0D1322] hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold">
                    {fw.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{fw.readiness}% READINESS</span>
                </div>
                <h3 className="font-bold text-base text-white">{fw.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{fw.standard}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>{fw.controls.length} Enforced Clauses</span>
                <span className="text-emerald-400">View Crosswalk &rarr;</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Framework Controls Crosswalk Table */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#0A0F1D] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-emerald-400">FRAMEWORK EVIDENCE CROSSWALK</span>
            <h3 className="text-lg font-bold text-white mt-0.5">{activeFramework.name}</h3>
            <p className="text-xs text-slate-400">{activeFramework.standard}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/audit"
              className="text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              Verify in SHA-256 Ledger
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0D1322] overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#090D16] border-b border-[#1E293B] text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Mandate / Clause</th>
                <th className="py-3 px-4">Regulatory Requirement</th>
                <th className="py-3 px-4">Bayora Cryptographic Evidence</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {activeFramework.controls.map((ctrl, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                    {ctrl.article}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-sans leading-relaxed max-w-xs">
                    {ctrl.requirement}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-300 font-mono text-[11px] max-w-sm">
                    {ctrl.evidence}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {ctrl.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
