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
      icon: <LayoutDashboard className="w-3.5 h-3.5 text-[#4FD1C5]" />,
      action: () => navigateTo("/"),
    },
    {
      id: "nav-models",
      title: "Model Lab & Security Cards",
      category: "Navigation",
      shortcut: "G M",
      icon: <Cpu className="w-3.5 h-3.5 text-[#7C8CFF]" />,
      action: () => navigateTo("/models"),
    },
    {
      id: "nav-security",
      title: "Security Center & Threat Feed",
      category: "Navigation",
      shortcut: "G S",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#6EA8FE]" />,
      action: () => navigateTo("/blue"),
    },
    {
      id: "nav-evaluation",
      title: "Evaluation Center & Campaigns",
      category: "Navigation",
      shortcut: "G E",
      icon: <Flame className="w-3.5 h-3.5 text-[#E66A77]" />,
      action: () => navigateTo("/red"),
    },
    {
      id: "nav-live",
      title: "Live Activity & Telemetry",
      category: "Navigation",
      shortcut: "G L",
      icon: <Activity className="w-3.5 h-3.5 text-[#4FD1C5]" />,
      action: () => navigateTo("/observability"),
    },
    {
      id: "nav-evidence",
      title: "Evidence & Cryptographic Ledger",
      category: "Navigation",
      shortcut: "G A",
      icon: <FileCheck className="w-3.5 h-3.5 text-[#E6B35A]" />,
      action: () => navigateTo("/audit"),
    },
    {
      id: "nav-reports",
      title: "Regulatory Assurance & Reports",
      category: "Navigation",
      shortcut: "G R",
      icon: <Award className="w-3.5 h-3.5 text-[#45C995]" />,
      action: () => navigateTo("/compliance"),
    },
    {
      id: "nav-control",
      title: "System Health & Topology",
      category: "Navigation",
      shortcut: "G C",
      icon: <Layers className="w-3.5 h-3.5 text-[#45C995]" />,
      action: () => navigateTo("/control"),
    },
    {
      id: "nav-taxonomy",
      title: "OWASP Top 10 for LLMs Directory",
      category: "Navigation",
      shortcut: "G T",
      icon: <BookOpen className="w-3.5 h-3.5 text-[#6EA8FE]" />,
      action: () => navigateTo("/taxonomy"),
    },
    {
      id: "nav-demo",
      title: "Dual-Blind Interactive Walkthrough",
      category: "Navigation",
      shortcut: "G D",
      icon: <Sparkles className="w-3.5 h-3.5 text-[#7C8CFF]" />,
      action: () => navigateTo("/demo"),
    },
    {
      id: "nav-login",
      title: "RBAC Identity & Role Switcher",
      category: "Navigation",
      shortcut: "G U",
      icon: <UserCheck className="w-3.5 h-3.5 text-[#A3ADB7]" />,
      action: () => navigateTo("/login"),
    },
    {
      id: "nav-settings",
      title: "Operational Configuration & Settings",
      category: "Navigation",
      shortcut: "G S",
      icon: <Settings className="w-3.5 h-3.5 text-[#4FD1C5]" />,
      action: () => navigateTo("/settings"),
    },
    // Actions
    {
      id: "act-attack",
      title: "Simulate Adversarial Injection Vector",
      category: "Actions",
      icon: <Zap className="w-3.5 h-3.5 text-[#E66A77]" />,
      action: () => navigateTo("/red"),
    },
    {
      id: "act-defense",
      title: "Deploy Defensive Guardrail Rule",
      category: "Actions",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#6EA8FE]" />,
      action: () => navigateTo("/blue"),
    },
    {
      id: "act-verify",
      title: "Run SHA-256 Ledger Integrity Verification",
      category: "Security & Audit",
      icon: <Lock className="w-3.5 h-3.5 text-[#E6B35A]" />,
      action: () => navigateTo("/audit"),
    },
    {
      id: "act-export",
      title: "Export Verifiable Audit Evidence Certificate",
      category: "Security & Audit",
      icon: <FileText className="w-3.5 h-3.5 text-[#45C995]" />,
      action: () => navigateTo("/audit"),
    },
  ];

  const filteredCommands = commands.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          onClose();
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
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
        className="fixed inset-0 bg-[#080A0D]/80 backdrop-blur-[2px] transition-opacity"
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-2xl bg-[#12171D] border border-[#252D36] rounded-lg shadow-2xl overflow-hidden z-10 animate-fade-in flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#1C242C] bg-[#0D1116] gap-3">
          <Search className="w-4 h-4 text-[#4FD1C5] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search pages, models, telemetry..."
            className="flex-1 bg-transparent text-xs text-[#EEF2F5] placeholder-[#68737E] outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#68737E] hover:text-[#EEF2F5] rounded transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Command List */}
        <div className="overflow-y-auto p-1.5 divide-y divide-[#1C242C]/40 flex-1">
          {filteredCommands.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#68737E] font-mono">
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
                        ? "bg-[#171D24] text-[#EEF2F5] border border-[#252D36]"
                        : "text-[#A3ADB7] hover:bg-[#171D24]/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 rounded bg-[#080A0D] border border-[#1C242C]">
                        {cmd.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#EEF2F5]">
                          {cmd.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#68737E]">
                          {cmd.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {cmd.shortcut && (
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#080A0D] text-[#68737E] border border-[#1C242C]">
                          {cmd.shortcut}
                        </span>
                      )}
                      {isSelected && (
                        <CornerDownLeft className="w-3 h-3 text-[#4FD1C5]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Palette Footer */}
        <div className="px-4 py-2 border-t border-[#1C242C] bg-[#080A0D] flex items-center justify-between text-[10px] font-mono text-[#68737E]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[#12171D] border border-[#252D36] text-[9px]">
                ↑
              </kbd>{" "}
              <kbd className="px-1 py-0.5 rounded bg-[#12171D] border border-[#252D36] text-[9px]">
                ↓
              </kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[#12171D] border border-[#252D36] text-[9px]">
                ↵
              </kbd>{" "}
              Select
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[#12171D] border border-[#252D36] text-[9px]">
                ESC
              </kbd>{" "}
              Close
            </span>
          </div>
          <span className="text-[#4FD1C5]">BAYORA PALETTE</span>
        </div>
      </div>
    </div>
  );
}
