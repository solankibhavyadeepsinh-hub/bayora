"use client";

import React, { useState } from "react";
import {
  Settings,
  Sliders,
  Shield,
  Key,
  Cpu,
  Bell,
  Eye,
  CheckCircle2,
  Lock,
  Globe,
  Database,
  Layers,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface SettingRowProps {
  title: string;
  description: string;
  value: string;
  actionText?: string;
  badge?: string;
  onAction?: () => void;
}

function SettingRow({
  title,
  description,
  value,
  actionText = "Configure",
  badge,
  onAction,
}: SettingRowProps) {
  return (
    <div className="py-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#151D27]/40 transition rounded-md">
      <div className="space-y-0.5 max-w-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#F5F7FA] font-sans">
            {title}
          </span>
          {badge && (
            <Badge variant="cyan" size="xs">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-[11px] text-[#A4AFBC] font-sans">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs font-mono text-[#39D9FF] px-2 py-0.5 rounded bg-[#070A0F] border border-[#1B252F]">
          {value}
        </span>
        {actionText && (
          <Button variant="outline" size="xs" onClick={onAction}>
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<
    "general" | "workspace" | "api" | "models" | "security" | "notifications" | "appearance"
  >("general");

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#1B252F]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-[#39D9FF]" />
            <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F5F7FA]">
              OPERATIONAL CONFIGURATION
            </h1>
            <Badge variant="cyan" size="xs">
              SYSTEM CONFIG
            </Badge>
          </div>
          <p className="text-xs text-[#A4AFBC] max-w-2xl font-sans">
            Manage platform environment settings, zero-trust perimeter policies, token quotas, and audit configurations.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          icon={saved ? <CheckCircle2 className="w-3.5 h-3.5 text-[#070A0F]" /> : <Save className="w-3.5 h-3.5" />}
        >
          {saved ? "Configuration Saved" : "Save Changes"}
        </Button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono border-b border-[#1B252F]">
        {[
          { id: "general", label: "General" },
          { id: "workspace", label: "Workspace" },
          { id: "api", label: "API Gateway" },
          { id: "models", label: "Models" },
          { id: "security", label: "Security & Dual-Blind" },
          { id: "notifications", label: "Notifications" },
          { id: "appearance", label: "Appearance" },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id as any)}
            className={`pb-3 px-2 font-medium transition border-b-2 whitespace-nowrap ${
              activeSection === sec.id
                ? "border-[#39D9FF] text-[#39D9FF]"
                : "border-transparent text-[#6C7886] hover:text-[#A4AFBC]"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="p-6 rounded-lg bg-[#101720] border border-[#1B252F] space-y-6">
        {/* GENERAL */}
        {activeSection === "general" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FA] font-heading">
                General System Parameters
              </h3>
              <p className="text-xs text-[#A4AFBC] mt-0.5">
                Core identity, versioning, and environment declarations.
              </p>
            </div>

            <div className="divide-y divide-[#1B252F]">
              <SettingRow
                title="Platform Name"
                description="Canonical application name displayed across telemetry streams and audit packages."
                value="Bayora Enterprise"
              />
              <SettingRow
                title="Environment Mode"
                description="Current operational deployment environment."
                value="SANDBOX / AIRGAP"
                badge="ISOLATED"
              />
              <SettingRow
                title="Firmware & CNI Build"
                description="Current immutable platform image version tag."
                value="v2.4.0-hardened"
              />
              <SettingRow
                title="System Timezone"
                description="Canonical timestamp standard for SHA-256 block ledger sealing."
                value="UTC (ISO-8601)"
              />
            </div>
          </div>
        )}

        {/* WORKSPACE */}
        {activeSection === "workspace" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FA] font-heading">
                Workspace & Sandboxing
              </h3>
              <p className="text-xs text-[#A4AFBC] mt-0.5">
                Default sandbox templates and network boundary constraints.
              </p>
            </div>

            <div className="divide-y divide-[#1B252F]">
              <SettingRow
                title="Default Evaluation Target"
                description="Default sandbox target selected for Red Team campaigns."
                value="sbx-finance-prod"
              />
              <SettingRow
                title="Multi-Tenant Database Isolation"
                description="PostgreSQL schema segregation mode."
                value="SCHEMA_PER_ZONE"
                badge="STRICT"
              />
              <SettingRow
                title="Kubernetes CNI Policy"
                description="Traffic drop rule applied to inter-zone pod traffic."
                value="DEFAULT_DENY_ALL"
              />
            </div>
          </div>
        )}

        {/* API */}
        {activeSection === "api" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FA] font-heading">
                API Gateway Configuration
              </h3>
              <p className="text-xs text-[#A4AFBC] mt-0.5">
                Gateway port parameters, token bucket limits, and mTLS verification.
              </p>
            </div>

            <div className="divide-y divide-[#1B252F]">
              <SettingRow
                title="FastAPI Gateway Endpoint"
                description="Base URL for 7-stage gateway proxy."
                value="http://127.0.0.1:8000/api"
              />
              <SettingRow
                title="JWT Bearer Token TTL"
                description="Session expiration window for operator credentials."
                value="8 Hours (28800s)"
              />
              <SettingRow
                title="Distributed Rate Limiter"
                description="Token bucket enforcement backing engine."
                value="Redis 7 Cluster"
                badge="ACTIVE"
              />
            </div>
          </div>
        )}

        {/* MODELS */}
        {activeSection === "models" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FA] font-heading">
                Target Model Guardrail Configuration
              </h3>
              <p className="text-xs text-[#A4AFBC] mt-0.5">
                Canary token patterns and context boundary rules.
              </p>
            </div>

            <div className="divide-y divide-[#1B252F]">
              <SettingRow
                title="Canary Token Prefix"
                description="Deterministic prefix used to intercept exfiltration in output stage 6."
                value="BAYORA-SEC-CANARY"
              />
              <SettingRow
                title="Context Window Safety Ceiling"
                description="Maximum allowable prompt tokens before input truncation."
                value="16,384 Tokens"
              />
              <SettingRow
                title="Mock LLM Persona Engine"
                description="Local standalone inference engine for offline evaluation."
                value="PERSONA_LOCAL_MOCK"
                badge="ZERO-KEY"
              />
            </div>
          </div>
        )}

        {/* SECURITY */}
        {activeSection === "security" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FA] font-heading">
                Security & Dual-Blind Policies
              </h3>
              <p className="text-xs text-[#A4AFBC] mt-0.5">
                Dual-blind secrecy guarantees and cryptographic audit sealing.
              </p>
            </div>

            <div className="divide-y divide-[#1B252F]">
              <SettingRow
                title="Dual-Blind Red Team Obfuscation"
                description="Red operators strictly receive generic error messages with zero defense disclosures."
                value="STRICT_DUAL_BLIND"
                badge="ENFORCED"
              />
              <SettingRow
                title="Blue Threat Feed Payload Sanitization"
                description="Raw adversarial prompts masked to prevent training data or defense exfiltration."
                value="MASK_RAW_PAYLOADS"
                badge="ENABLED"
              />
              <SettingRow
                title="SHA-256 Ledger Sealing"
                description="Cryptographic block chain algorithm."
                value="SHA256_APPEND_ONLY"
              />
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeSection === "notifications" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FA] font-heading">
                Security Alerts & Webhooks
              </h3>
              <p className="text-xs text-[#A4AFBC] mt-0.5">
                Dispatch normalized threat alerts to SIEM and incident response channels.
              </p>
            </div>

            <div className="divide-y divide-[#1B252F]">
              <SettingRow
                title="Critical Threat Webhook"
                description="Endpoint receiving real-time SSE threat notifications."
                value="https://siem.bayora.internal/hooks/threats"
              />
              <SettingRow
                title="Tamper Alert Channel"
                description="Instant high-priority notification if cryptographic ledger hash breaks."
                value="#security-alerts-p1"
              />
            </div>
          </div>
        )}

        {/* APPEARANCE */}
        {activeSection === "appearance" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#F5F7FA] font-heading">
                Design System & Interface Appearance
              </h3>
              <p className="text-xs text-[#A4AFBC] mt-0.5">
                Engineered dark-first enterprise security palette.
              </p>
            </div>

            <div className="divide-y divide-[#1B252F]">
              <SettingRow
                title="Color Theme"
                description="Near-black graphite environment (#070A0F) with semantic zone accents."
                value="Bayora Deep Graphite"
                badge="DARK-FIRST"
              />
              <SettingRow
                title="Typography Scale"
                description="Headings: Space Grotesk • Body: Inter • Technical: JetBrains Mono."
                value="Tri-Type System"
              />
              <SettingRow
                title="Reduced Motion Mode"
                description="Respects system prefers-reduced-motion for microinteractions."
                value="AUTO_DETECT"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
