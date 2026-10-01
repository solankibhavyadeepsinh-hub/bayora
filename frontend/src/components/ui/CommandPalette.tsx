"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Cpu,
  ShieldCheck,
  Flame,
  Activity,
  FileCheck,
  Award,
  Layers,
  Sparkles,
  BookOpen,
  Settings,
  UserCheck,
  CornerDownLeft,
  X,
  FileText,
  Lock,
  Zap,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Actions" | "Security & Audit" | "Assurance";
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigateTo = (path: string) => {
    onClose();
    router.push(path);
  };

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "nav-overview",
      title: "Overview Command Center",
      category: "Navigation",
      shortcut: "G O",
      icon: <LayoutDashboard className="w-3.5 h-3.5 text-[#4BC7B5]" />,
      action: () => navigateTo("/"),
    },
    {
      id: "nav-models",
      title: "Model Lab & Airgap Sandboxes",
      category: "Navigation",
      shortcut: "G M",
      icon: <Cpu className="w-3.5 h-3.5 text-[#6675D9]" />,
      action: () => navigateTo("/models"),
    },
    {
      id: "nav-security",
      title: "Security Center & Threat Feed",
      category: "Navigation",
      shortcut: "G S",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#5B91D6]" />,
      action: () => navigateTo("/blue"),
    },
    {
      id: "nav-evaluation",
      title: "Evaluation Center & Campaigns",
      category: "Navigation",
      shortcut: "G E",
      icon: <Flame className="w-3.5 h-3.5 text-[#D96573]" />,
      action: () => navigateTo("/red"),
    },
    {
      id: "nav-activity",
      title: "Live Activity & Telemetry",
      category: "Navigation",
      shortcut: "G L",
      icon: <Activity className="w-3.5 h-3.5 text-[#42B883]" />,
      action: () => navigateTo("/observability"),
    },
    {
      id: "nav-audit",
      title: "Cryptographic Evidence Ledger",
      category: "Navigation",
      shortcut: "G A",
      icon: <FileCheck className="w-3.5 h-3.5 text-[#D6A856]" />,
      action: () => navigateTo("/audit"),
    },
    {
      id: "nav-compliance",
      title: "Regulatory Assurance & Reports",
      category: "Navigation",
      shortcut: "G R",
      icon: <Award className="w-3.5 h-3.5 text-[#4BC7B5]" />,
      action: () => navigateTo("/compliance"),
    },
    {
      id: "nav-control",
      title: "System Health & Control Plane",
      category: "Navigation",
      shortcut: "G H",
      icon: <Layers className="w-3.5 h-3.5 text-[#42B883]" />,
      action: () => navigateTo("/control"),
    },
    {
      id: "nav-taxonomy",
      title: "OWASP LLM Taxonomy Directory",
      category: "Assurance",
      shortcut: "G T",
      icon: <BookOpen className="w-3.5 h-3.5 text-[#5B91D6]" />,
      action: () => navigateTo("/taxonomy"),
    },
    {
      id: "nav-demo",
      title: "Interactive Attack Walkthrough",
      category: "Assurance",
      shortcut: "G D",
      icon: <Sparkles className="w-3.5 h-3.5 text-[#6675D9]" />,
      action: () => navigateTo("/demo"),
    },
    {
      id: "nav-settings",
      title: "Operational Configuration",
      category: "Assurance",
      shortcut: "G C",
      icon: <Settings className="w-3.5 h-3.5 text-[#707B85]" />,
      action: () => navigateTo("/settings"),
    },
    {
      id: "nav-identity",
      title: "Identity & RBAC Role Switcher",
      category: "Assurance",
      shortcut: "G I",
      icon: <UserCheck className="w-3.5 h-3.5 text-[#4BC7B5]" />,
      action: () => navigateTo("/login"),
    },

    // Actions
    {
      id: "act-new-attack",
      title: "Launch Adversarial Attack Probe",
      category: "Actions",
      icon: <Flame className="w-3.5 h-3.5 text-[#D96573]" />,
      action: () => navigateTo("/red?tab=workbench"),
    },
    {
      id: "act-new-rule",
      title: "Deploy Input/Output Defense Guardrail",
      category: "Actions",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#42B883]" />,
      action: () => navigateTo("/blue?tab=guardrails"),
    },
    {
      id: "act-run-eval",
      title: "Execute OWASP Penetration Suite",
      category: "Actions",
      icon: <Zap className="w-3.5 h-3.5 text-[#D6A856]" />,
      action: () => navigateTo("/red?tab=campaigns"),
    },
    {
      id: "act-verify-audit",
      title: "Verify SHA-256 Ledger Integrity",
      category: "Security & Audit",
      icon: <Lock className="w-3.5 h-3.5 text-[#42B883]" />,
      action: () => navigateTo("/audit"),
    },
    {
      id: "act-export-evidence",
      title: "Export Cryptographic Audit Bundle (JSON)",
      category: "Security & Audit",
      icon: <FileText className="w-3.5 h-3.5 text-[#4BC7B5]" />,
      action: () => navigateTo("/audit"),
    },
    {
      id: "act-generate-report",
      title: "Generate Compliance Audit Package",
      category: "Security & Audit",
      icon: <Award className="w-3.5 h-3.5 text-[#6675D9]" />,
      action: () => navigateTo("/compliance"),
    },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#07090C]/80 backdrop-blur-[2px] transition-opacity"
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-2xl bg-[#11161B] border border-[#2A333C] rounded-lg shadow-2xl overflow-hidden z-10 animate-fade-in flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#1B2229] bg-[#0A0D10] gap-3">
          <Search className="w-4 h-4 text-[#4BC7B5] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search pages, models, telemetry..."
            className="flex-1 bg-transparent text-xs text-[#F1F4F6] placeholder-[#707B85] outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#707B85] hover:text-[#F1F4F6] rounded transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Command List */}
        <div className="overflow-y-auto p-1.5 divide-y divide-[#1B2229]/40 flex-1">
          {filteredCommands.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#707B85] font-mono">
              No matching commands found for "{query}".
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredCommands.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={cmd.id}
                    onClick={() => cmd.action()}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-colors text-xs ${
                      isSelected
                        ? "bg-[#171D23] text-[#F1F4F6] border border-[#2A333C]"
                        : "text-[#A6B0BA] hover:bg-[#171D23]/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 rounded bg-[#0A0D10] border border-[#1B2229]">
                        {cmd.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#F1F4F6]">
                          {cmd.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#707B85]">
                          {cmd.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {cmd.shortcut && (
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#0A0D10] text-[#707B85] border border-[#1B2229]">
                          {cmd.shortcut}
                        </span>
                      )}
                      {isSelected && (
                        <CornerDownLeft className="w-3 h-3 text-[#4BC7B5]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Palette Footer */}
        <div className="px-4 py-2 border-t border-[#1B2229] bg-[#0A0D10] flex items-center justify-between text-[10px] font-mono text-[#707B85]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[#11161B] border border-[#2A333C] text-[9px]">
                ↑
              </kbd>{" "}
              <kbd className="px-1 py-0.5 rounded bg-[#11161B] border border-[#2A333C] text-[9px]">
                ↓
              </kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[#11161B] border border-[#2A333C] text-[9px]">
                ↵
              </kbd>{" "}
              Select
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[#11161B] border border-[#2A333C] text-[9px]">
                ESC
              </kbd>{" "}
              Close
            </span>
          </div>
          <span className="text-[#4BC7B5]">BAYORA PALETTE</span>
        </div>
      </div>
    </div>
  );
}
