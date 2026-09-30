"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  FileCheck,
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  Layers,
  BookOpen,
  Filter,
  Eye,
  FileText,
  Copy,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { MetricCard } from "@/components/ui/MetricCard";

interface ReportDoc {
  id: string;
  name: string;
  category: "Security" | "Evaluation" | "Performance" | "Infrastructure" | "Audit";
  date: string;
  status: "SIGNED" | "VERIFIED" | "GENERATED";
  author: string;
  framework: string;
  score: string;
  executiveSummary: string;
  controlsChecked: number;
}

export default function ReportsAssurancePage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [selectedReport, setSelectedReport] = useState<ReportDoc | null>(null);
  const [copied, setCopied] = useState(false);

  const reports: ReportDoc[] = [
    {
      id: "REP-2025-EUAI-01",
      name: "EU AI Act High-Risk System Compliance Attestation",
      category: "Audit",
      date: "2025-09-28",
      status: "SIGNED",
      author: "Chief AI Safety Officer",
      framework: "EU AI Act (Regulation 2024/1689)",
      score: "98.4% Compliant",
      executiveSummary:
        "Formal compliance evaluation covering Article 9 (Risk Management System), Article 14 (Human Oversight), and Article 15 (Cybersecurity & Robustness). Verified dual-blind guardrails and immutable SHA-256 append-only logging.",
      controlsChecked: 14,
    },
    {
      id: "REP-2025-SOC2-02",
      name: "SOC 2 Type II Cryptographic Processing Integrity Audit",
      category: "Audit",
      date: "2025-09-26",
      status: "VERIFIED",
      author: "Enterprise Compliance Auditor",
      framework: "Trust Services Criteria (Security, Processing Integrity)",
      score: "100% Verified",
      executiveSummary:
        "Full audit of server-side RBAC enforcement, PostgreSQL schema isolation, and SHA-256 hash continuity. All 108 sealed blocks verified from Genesis anchor to head without discontinuity.",
      controlsChecked: 22,
    },
    {
      id: "REP-2025-PEN-03",
      name: "Adversarial Penetration & Jailbreak Resilience Assessment",
      category: "Security",
      date: "2025-09-24",
      status: "SIGNED",
      author: "Red Team Lead",
      framework: "OWASP Top 10 for LLMs 2025",
      score: "97.8% Resilience",
      executiveSummary:
        "Penetration testing across 12 automated campaigns including Direct Prompt Injection, DAN Jailbreaks, and Canary Token Probing. 98.2% of attacks intercepted at Stage 4 input filters.",
      controlsChecked: 18,
    },
    {
      id: "REP-2025-NIST-04",
      name: "NIST AI Risk Management Framework (RMF 1.0) Crosswalk",
      category: "Evaluation",
      date: "2025-09-20",
      status: "VERIFIED",
      author: "AI Governance Architect",
      framework: "NIST AI RMF 1.0 (Govern, Map, Measure, Manage)",
      score: "95.0% Aligned",
      executiveSummary:
        "Systematic risk mapping for high-stakes banking and clinical triage sandboxes. Evaluates continuous canary monitoring, dual-blind telemetry masking, and model extraction defenses.",
      controlsChecked: 16,
    },
    {
      id: "REP-2025-PERF-05",
      name: "Gateway Pipeline Latency & Infrastructure Benchmark",
      category: "Performance",
      date: "2025-09-18",
      status: "GENERATED",
      author: "Site Reliability Engineering",
      framework: "SLA Guarantee 99.9% / P99 < 80ms",
      score: "48ms P50 Latency",
      executiveSummary:
        "Performance telemetry profiling across all 7 gateway stages. Redis token bucket rate limiting handled 24,000 requests/day with 96.4% cache hit rate and zero cross-zone bypasses.",
      controlsChecked: 8,
    },
    {
      id: "REP-2025-CNI-06",
      name: "Kubernetes NetworkPolicy Zero-Trust Boundary Audit",
      category: "Infrastructure",
      date: "2025-09-15",
      status: "VERIFIED",
      author: "Cloud Infrastructure SecOps",
      framework: "Kubernetes Default-Deny Security Standard",
      score: "100% Enforced",
      executiveSummary:
        "Formal verification of CNI default-deny policies isolating red_zone, blue_zone, llm_zone, and control_plane namespaces. All direct inter-pod socket traffic blocked without gateway routing.",
      controlsChecked: 12,
    },
  ];

  const filteredReports = reports.filter((r) => {
    if (categoryFilter === "All") return true;
    return r.category === categoryFilter;
  });

  const exportAttestation = (rep: ReportDoc) => {
    const docData = {
      platform: "Bayora Enterprise AI Security Laboratory",
      specification: "Cryptographic Regulatory Assurance Package v1.0",
      report_id: rep.id,
      title: rep.name,
      framework: rep.framework,
      status: rep.status,
      compliance_score: rep.score,
      author: rep.author,
      issued_date: rep.date,
      summary: rep.executiveSummary,
      cryptographic_seal: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      verification_status: "MATHEMATICALLY_VERIFIED",
    };
    const blob = new Blob([JSON.stringify(docData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${rep.id.toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#1B252F]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F5F7FA]">
              REPORTS & ASSURANCE HUB
            </h1>
            <Badge variant="success" size="xs">
              VERIFIED COMPLIANCE
            </Badge>
          </div>
          <p className="text-xs text-[#A4AFBC] max-w-2xl font-sans">
            Regulatory compliance crosswalks for EU AI Act, SOC 2 Type II, and NIST AI RMF backed by cryptographic proofs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/audit">
            <Button variant="outline" size="sm" icon={<FileCheck className="w-3.5 h-3.5" />}>
              Ledger Proofs
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => exportAttestation(reports[0])}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Signed Package
          </Button>
        </div>
      </div>

      {/* Top KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="EU AI ACT READINESS"
          value="98.4%"
          trend={{ value: "High-Risk AI", direction: "up", context: "Regulation 2024/1689" }}
          statusColor="success"
          badgeText="ARTICLE 9 & 15"
        />
        <MetricCard
          label="SOC 2 TYPE II"
          value="100%"
          trend={{ value: "Verified", direction: "neutral", context: "Processing Integrity" }}
          statusColor="success"
          badgeText="CC6 & PI1"
        />
        <MetricCard
          label="NIST AI RMF"
          value="95.0%"
          trend={{ value: "Govern & Map", direction: "up", context: "Risk Management" }}
          statusColor="cyan"
          badgeText="ALIGNED"
        />
        <MetricCard
          label="SIGNED CERTIFICATES"
          value={reports.length}
          trend={{ value: "Immutable", direction: "neutral", context: "SHA-256 Sealed" }}
          statusColor="warning"
          badgeText="VERIFIED"
        />
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        <span className="text-[#6C7886] uppercase text-[10px] mr-1">Category:</span>
        {["All", "Audit", "Security", "Evaluation", "Performance", "Infrastructure"].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-md transition ${
                categoryFilter === cat
                  ? "bg-[#151D27] text-[#39D9FF] font-semibold border border-[#25303C]"
                  : "bg-[#101720] text-[#A4AFBC] border border-[#1B252F] hover:border-[#25303C]"
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Reports Table */}
      <div className="p-5 rounded-lg bg-[#101720] border border-[#1B252F] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1B252F]">
          <div>
            <h3 className="font-heading font-semibold text-sm text-[#F5F7FA]">
              Enterprise Assurance Reports & Attestations
            </h3>
            <p className="text-[11px] text-[#A4AFBC] mt-0.5">
              Click any report to view document summary, framework crosswalks, and cryptographic evidence.
            </p>
          </div>
          <span className="text-xs font-mono text-[#6C7886]">
            {filteredReports.length} reports available
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#070A0F] border-b border-[#1B252F] text-[#6C7886] uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Report ID</th>
                <th className="py-2.5 px-3">Report Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Score / Result</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B252F]">
              {filteredReports.map((rep) => (
                <tr
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className="hover:bg-[#151D27]/50 cursor-pointer transition"
                >
                  <td className="py-2.5 px-3 font-mono text-[#6C7886]">{rep.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#F5F7FA]">
                    {rep.name}
                  </td>
                  <td className="py-2.5 px-3 text-[#39D9FF]">{rep.category}</td>
                  <td className="py-2.5 px-3 text-[#6C7886]">{rep.date}</td>
                  <td className="py-2.5 px-3 text-[#38D996] font-bold">{rep.score}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant={rep.status === "SIGNED" ? "success" : "info"} size="xs" dot>
                      {rep.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-2">
                    <span className="text-[#39D9FF] hover:underline">Preview</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Preview Drawer */}
      <Drawer
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={selectedReport?.name || "Assurance Report"}
        subtitle={`ID: ${selectedReport?.id} • Standard: ${selectedReport?.framework}`}
        badge={{
          text: selectedReport?.status || "VERIFIED",
          variant: "success",
        }}
        rawJson={selectedReport}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectedReport && exportAttestation(selectedReport)}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Export Certificate
            </Button>
            <Button variant="primary" size="sm" onClick={() => setSelectedReport(null)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedReport && (
          <div className="space-y-5 text-xs font-mono">
            <div className="p-3.5 rounded bg-[#070A0F] border border-[#1B252F] space-y-1">
              <span className="text-[10px] text-[#6C7886] uppercase block">
                Executive Compliance Summary
              </span>
              <p className="text-xs text-[#A4AFBC] font-sans leading-relaxed">
                {selectedReport.executiveSummary}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded bg-[#070A0F] border border-[#1B252F]">
                <span className="text-[10px] text-[#6C7886] block">Author</span>
                <span className="text-xs font-bold text-[#F5F7FA]">
                  {selectedReport.author}
                </span>
              </div>
              <div className="p-3 rounded bg-[#070A0F] border border-[#1B252F]">
                <span className="text-[10px] text-[#6C7886] block">Controls Verified</span>
                <span className="text-xs font-bold text-[#38D996]">
                  {selectedReport.controlsChecked} / {selectedReport.controlsChecked} Passed
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded bg-[#070A0F] border border-[#1B252F] space-y-1">
              <span className="text-[10px] text-[#6C7886] uppercase block">
                Cryptographic Evidence Chain
              </span>
              <p className="text-[11px] text-[#A4AFBC] font-mono leading-relaxed">
                Seal Hash: <span className="text-[#FFB84D]">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                <br />
                Integrity Status: <span className="text-[#38D996]">MATHEMATICALLY CONTINUOUS</span>
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
