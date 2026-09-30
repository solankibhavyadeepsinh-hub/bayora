"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  Terminal, 
  Lock, 
  Layers, 
  Activity, 
  CheckCircle2, 
  FileCheck,
  ArrowRight,
  Database
} from "lucide-react";

export default function ModelsPage() {
  const models = [
    {
      id: "Client-Finance-GPT-4",
      sandboxId: "sbx-finance-prod",
      name: "Bayora Financial Core AI v4",
      domain: "Fintech / Wealth Management",
      isolation: "STRICT_AIRGAP",
      canary: "BAYORA-SEC-CANARY-4091",
      secret: "LEDGER-SECRET-TX-99482",
      promptInjectionScore: 94,
      canaryLeakResistance: 98,
      jailbreakImmunity: 92,
      latencyMs: 120,
      compliance: ["PCI-DSS v4.0", "GLBA", "SOC 2 Type II", "FINRA AI Guidance"],
      description: "High-value banking core assistant processing authenticated account balances, wire authorizations, and confidential customer wealth ledgers.",
      canaryDescription: "Canary token embedded in model context. If adversarial extraction succeeds, output guard intercept prevents exfiltration."
    },
    {
      id: "Client-Healthcare-LLM",
      sandboxId: "sbx-clinical-ai",
      name: "Clinical Diagnostic Triage LLM v2",
      domain: "Healthcare / EHR Triage",
      isolation: "STRICT_AIRGAP",
      canary: "BAYORA-HIPAA-CANARY-8821",
      secret: "PATIENT-RECORD-MRN-90210",
      promptInjectionScore: 91,
      canaryLeakResistance: 96,
      jailbreakImmunity: 89,
      latencyMs: 110,
      compliance: ["HIPAA Security Rule", "HITECH Act", "FDA AI/ML SaMD", "ISO 27799"],
      description: "Clinical assistant analyzing patient symptoms, triaging emergency admission, and managing confidential electronic health records (EHR).",
      canaryDescription: "Synthetic HIPAA MRN token. Tested continuously against extraction attempts to guarantee zero unredacted disclosure."
    },
    {
      id: "Llama-3-8B-Secured",
      sandboxId: "sbx-llama3-hardened",
      name: "Hardened Llama-3 8B Enterprise",
      domain: "General Corporate Workflow",
      isolation: "DEFENDED_GATEWAY",
      canary: "BAYORA-LLAMA-CANARY-1049",
      secret: "API-KEY-PROD-ENC-38291",
      promptInjectionScore: 88,
      canaryLeakResistance: 92,
      jailbreakImmunity: 85,
      latencyMs: 95,
      compliance: ["NIST AI RMF", "ISO/IEC 42001", "EU AI Act Transparency"],
      description: "General enterprise baseline assistant configured with baseline alignment and gateway-enforced rate limits.",
      canaryDescription: "API key token used to assess prompt boundary leakage across open-weights architectures."
    }
  ];

  const [selectedModel, setSelectedModel] = useState(models[0]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Target LLM Model Cards & Benchmarks</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-purple-500/40 bg-purple-500/10 text-purple-300">
                CLIENT EVALUATION SUITE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Security scorecards, canary token registers, and compliance alignment for isolated sandbox targets.
            </p>
          </div>
        </div>

        <Link
          href="/red"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-medium transition shadow"
        >
          <Terminal className="w-3.5 h-3.5" />
          Launch Evaluation in Red Console
        </Link>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {models.map((m) => {
          const isSelected = selectedModel.id === m.id;

          return (
            <div
              key={m.id}
              onClick={() => setSelectedModel(m)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? "border-purple-500 bg-[#131E35] ring-1 ring-purple-500 shadow-xl"
                  : "border-[#1E293B] bg-[#0D1322] hover:border-slate-700"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-purple-500/40 bg-purple-500/10 text-purple-300 uppercase">
                    {m.isolation}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{m.sandboxId}</span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white">{m.name}</h3>
                  <span className="text-xs text-slate-400 font-mono block mt-0.5">{m.domain}</span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {m.description}
                </p>

                {/* Score Indicators */}
                <div className="space-y-2 pt-3 border-t border-slate-800 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Prompt Injection Resilience</span>
                      <span className="text-emerald-400 font-bold">{m.promptInjectionScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${m.promptInjectionScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Canary Leak Resistance</span>
                      <span className="text-blue-400 font-bold">{m.canaryLeakResistance}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${m.canaryLeakResistance}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Jailbreak Immunity</span>
                      <span className="text-purple-400 font-bold">{m.jailbreakImmunity}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-purple-500" style={{ width: `${m.jailbreakImmunity}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Avg Latency: {m.latencyMs}ms</span>
                <span className="text-purple-400">View Specs &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Model Deep Dive Specifications */}
      <div className="p-6 lg:p-8 rounded-2xl border border-[#1E293B] bg-[#0A0F1D] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-purple-400">SPECIFICATION DOSSIER</span>
            <h3 className="text-lg font-bold text-white mt-0.5">{selectedModel.name}</h3>
            <p className="text-xs text-slate-400 font-mono">Sandbox Environment ID: {selectedModel.sandboxId}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
              STATUS: AIRGAPPED MOCK ACTIVE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0D1322] space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Active Canary Register</span>
            <p className="text-xs font-mono text-amber-400 font-bold truncate">{selectedModel.canary}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0D1322] space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Confidential System Secret</span>
            <p className="text-xs font-mono text-red-400 font-bold truncate">{selectedModel.secret}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0D1322] space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Network Boundary</span>
            <p className="text-xs font-mono text-purple-300 font-bold">{selectedModel.isolation}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0D1322] space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Inference Baseline</span>
            <p className="text-xs font-mono text-emerald-400 font-bold">{selectedModel.latencyMs} ms / completion</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Regulatory Alignment & Mandate Controls</h4>
            <div className="flex flex-wrap gap-2">
              {selectedModel.compliance.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 rounded-lg border border-slate-700 bg-slate-900/60 text-xs font-mono text-slate-300 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Canary Token Verification Logic</h4>
            <div className="p-4 rounded-xl border border-slate-800 bg-[#070B12] text-xs font-mono text-slate-300 space-y-2">
              <p>
                In the event an adversary bypasses Blue input filters, the mock LLM produces output containing <code className="text-amber-400">[{selectedModel.canary}]</code>.
              </p>
              <p className="text-slate-400">
                Stage 6 Blue Output Filter intercepts the response before egress, neutralizing the leak with a generic output block and emitting an alert to the Blue threat feed without revealing raw prompt details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
