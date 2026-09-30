import React, { useEffect, useState } from "react";
import { X, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./Badge";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant: "cyan" | "violet" | "success" | "warning" | "danger" | "info" | "neutral";
  };
  children: React.ReactNode;
  rawJson?: any;
  actions?: React.ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  rawJson,
  actions,
}: DrawerProps) {
  const [activeTab, setActiveTab] = useState<"details" | "json">("details");
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

  // Prevent background scroll when drawer is open
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
        className="fixed inset-0 bg-[#070A0F]/80 backdrop-blur-sm transition-opacity duration-200"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-[#101720] border-l border-[#25303C] shadow-2xl flex flex-col h-full z-10 animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-[#1B252F] flex items-start justify-between gap-4 bg-[#0B1017]">
          <div className="space-y-1.5 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-[#F5F7FA] font-heading tracking-tight">
                {title}
              </h2>
              {badge && (
                <Badge variant={badge.variant} size="xs" dot>
                  {badge.text}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-[#A4AFBC] font-mono leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#6C7886] hover:text-[#F5F7FA] hover:bg-[#151D27] transition"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Header if rawJson provided */}
        {rawJson && (
          <div className="flex items-center px-6 border-b border-[#1B252F] bg-[#0E1520] gap-4 text-xs font-mono">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-2.5 border-b-2 font-medium transition ${
                activeTab === "details"
                  ? "border-[#39D9FF] text-[#39D9FF]"
                  : "border-transparent text-[#6C7886] hover:text-[#A4AFBC]"
              }`}
            >
              Inspection & Telemetry
            </button>
            <button
              onClick={() => setActiveTab("json")}
              className={`py-2.5 border-b-2 font-medium transition flex items-center gap-1.5 ${
                activeTab === "json"
                  ? "border-[#39D9FF] text-[#39D9FF]"
                  : "border-transparent text-[#6C7886] hover:text-[#A4AFBC]"
              }`}
            >
              Raw Cryptographic JSON
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "details" ? (
            children
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#6C7886]">
                  Canonical JSON Serialization
                </span>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={copyJson}
                  icon={copied ? <Check className="w-3 h-3 text-[#38D996]" /> : <Copy className="w-3 h-3" />}
                >
                  {copied ? "Copied" : "Copy Payload"}
                </Button>
              </div>
              <pre className="p-4 rounded-md bg-[#070A0F] border border-[#1B252F] text-[11px] font-mono text-[#A4AFBC] overflow-x-auto leading-relaxed">
                {JSON.stringify(rawJson, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {actions && (
          <div className="p-4 border-t border-[#1B252F] bg-[#0B1017] flex items-center justify-end gap-2.5">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
