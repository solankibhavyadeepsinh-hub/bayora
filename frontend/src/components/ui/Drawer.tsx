import React, { useEffect, useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { Button } from "./Button";
import { Badge, BadgeVariant } from "./Badge";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant: BadgeVariant;
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
        className="fixed inset-0 bg-[#080A0D]/75 backdrop-blur-[2px] transition-opacity duration-200"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-[#12171D] border-l border-[#252D36] shadow-2xl flex flex-col h-full z-10 animate-slide-in-right">
        {/* Header */}
        <div className="p-5 border-b border-[#1C242C] flex items-start justify-between gap-4 bg-[#0D1116]">
          <div className="space-y-1 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-[#EEF2F5] font-heading tracking-tight">
                {title}
              </h2>
              {badge && (
                <Badge variant={badge.variant} size="xs" dot>
                  {badge.text}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] text-[#A3ADB7] font-mono leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#68737E] hover:text-[#EEF2F5] hover:bg-[#171D24] transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Header if rawJson provided */}
        {rawJson && (
          <div className="flex items-center px-5 border-b border-[#1C242C] bg-[#0E1319] gap-4 text-xs font-mono">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-2 border-b-2 font-medium transition ${
                activeTab === "details"
                  ? "border-[#4FD1C5] text-[#4FD1C5]"
                  : "border-transparent text-[#68737E] hover:text-[#A3ADB7]"
              }`}
            >
              Inspection Telemetry
            </button>
            <button
              onClick={() => setActiveTab("json")}
              className={`py-2 border-b-2 font-medium transition flex items-center gap-1.5 ${
                activeTab === "json"
                  ? "border-[#4FD1C5] text-[#4FD1C5]"
                  : "border-transparent text-[#68737E] hover:text-[#A3ADB7]"
              }`}
            >
              Raw Cryptographic JSON
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === "details" ? (
            children
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#68737E]">
                  Canonical JSON Serialization
                </span>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={copyJson}
                  icon={copied ? <Check className="w-3 h-3 text-[#45C995]" /> : <Copy className="w-3 h-3" />}
                >
                  {copied ? "Copied" : "Copy Payload"}
                </Button>
              </div>
              <pre className="p-3.5 rounded bg-[#080A0D] border border-[#1C242C] text-[11px] font-mono text-[#A3ADB7] overflow-x-auto leading-relaxed">
                {JSON.stringify(rawJson, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {actions && (
          <div className="p-4 border-t border-[#1C242C] bg-[#0D1116] flex items-center justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
