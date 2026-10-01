"use client";

import React, { useEffect, useState } from "react";
import { X, Copy, Check, Terminal, Shield, Clock, FileText } from "lucide-react";
import { Button } from "./Button";
import { Badge, BadgeVariant } from "./Badge";

export interface DrawerTimelineItem {
  time: string;
  stage: string;
  status: "PASSED" | "BLOCKED" | "INTERCEPTED" | "EXECUTED";
  detail: string;
}

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant: BadgeVariant;
  };
  timeline?: DrawerTimelineItem[];
  metadata?: Record<string, string | number | boolean>;
  evidenceHash?: string;
  children?: React.ReactNode;
  rawJson?: any;
  actions?: React.ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  timeline,
  metadata,
  evidenceHash,
  children,
  rawJson,
  actions,
}: DrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "metadata" | "json">("overview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const copyJson = () => {
    if (!rawJson) return;
    navigator.clipboard.writeText(JSON.stringify(rawJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#07090C]/80 backdrop-blur-[2px] transition-opacity duration-200"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-[#11161B] border-l border-[#2A333C] shadow-2xl flex flex-col h-full z-10 animate-slide-in-right">
        {/* Header */}
        <div className="p-5 border-b border-[#2A333C] flex items-start justify-between gap-4 bg-[#0A0D10]">
          <div className="space-y-1 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-[#F1F4F6] font-heading tracking-tight">
                {title}
              </h2>
              {badge && (
                <Badge variant={badge.variant} size="xs" dot>
                  {badge.text}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] text-[#A6B0BA] font-mono leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#707B85] hover:text-[#F1F4F6] hover:bg-[#171D23] transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[#2A333C] px-5 bg-[#0A0D10]/50 text-xs font-mono">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
              activeTab === "overview"
                ? "border-[#4BC7B5] text-[#4BC7B5]"
                : "border-transparent text-[#707B85] hover:text-[#A6B0BA]"
            }`}
          >
            Overview
          </button>
          {timeline && timeline.length > 0 && (
            <button
              onClick={() => setActiveTab("timeline")}
              className={`py-2.5 px-3 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "timeline"
                  ? "border-[#4BC7B5] text-[#4BC7B5]"
                  : "border-transparent text-[#707B85] hover:text-[#A6B0BA]"
              }`}
            >
              <Clock className="w-3 h-3" />
              Timeline ({timeline.length})
            </button>
          )}
          {metadata && Object.keys(metadata).length > 0 && (
            <button
              onClick={() => setActiveTab("metadata")}
              className={`py-2.5 px-3 border-b-2 font-medium transition-colors ${
                activeTab === "metadata"
                  ? "border-[#4BC7B5] text-[#4BC7B5]"
                  : "border-transparent text-[#707B85] hover:text-[#A6B0BA]"
              }`}
            >
              Metadata
            </button>
          )}
          {rawJson && (
            <button
              onClick={() => setActiveTab("json")}
              className={`py-2.5 px-3 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "json"
                  ? "border-[#4BC7B5] text-[#4BC7B5]"
                  : "border-transparent text-[#707B85] hover:text-[#A6B0BA]"
              }`}
            >
              <Terminal className="w-3 h-3" />
              Payload JSON
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === "overview" && (
            <div className="space-y-4">
              {children}

              {evidenceHash && (
                <div className="p-3 rounded bg-[#0A0D10] border border-[#2A333C] space-y-1">
                  <span className="text-[10px] font-mono text-[#707B85] uppercase tracking-wider block">
                    Cryptographic Ledger Seal (SHA-256)
                  </span>
                  <p className="text-[11px] font-mono text-[#4BC7B5] break-all">
                    {evidenceHash}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "timeline" && timeline && (
            <div className="space-y-3 font-mono text-xs">
              <span className="text-[10px] text-[#707B85] uppercase tracking-wider block">
                7-Stage Pipeline Execution Trace
              </span>
              <div className="border-l border-[#2A333C] ml-2 pl-4 space-y-4">
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span
                      className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border border-[#0A0D10] ${
                        item.status === "PASSED" || item.status === "EXECUTED"
                          ? "bg-[#42B883]"
                          : item.status === "INTERCEPTED"
                          ? "bg-[#D6A856]"
                          : "bg-[#D96573]"
                      }`}
                    />
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#F1F4F6]">{item.stage}</span>
                      <span className="text-[#707B85]">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-[#A6B0BA]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "metadata" && metadata && (
            <div className="space-y-2 font-mono text-xs">
              <span className="text-[10px] text-[#707B85] uppercase tracking-wider block">
                Normalized Telemetry Attributes
              </span>
              <div className="divide-y divide-[#2A333C] rounded border border-[#2A333C] bg-[#0A0D10]">
                {Object.entries(metadata).map(([key, val]) => (
                  <div key={key} className="flex justify-between p-2.5 text-[11px]">
                    <span className="text-[#707B85]">{key}</span>
                    <span className="text-[#F1F4F6] font-semibold">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "json" && rawJson && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#707B85]">Structured Raw Buffer</span>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={copyJson}
                  icon={copied ? <Check className="w-3 h-3 text-[#42B883]" /> : <Copy className="w-3 h-3" />}
                >
                  {copied ? "Copied" : "Copy Payload"}
                </Button>
              </div>
              <pre className="p-3.5 rounded bg-[#07090C] border border-[#2A333C] text-[11px] font-mono text-[#A6B0BA] overflow-x-auto leading-relaxed">
                {JSON.stringify(rawJson, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {actions && (
          <div className="p-4 border-t border-[#2A333C] bg-[#0A0D10] flex items-center justify-end gap-2.5">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
