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
      title: "Go to Overview (Command Center)",
      category: "Navigation",
      shortcut: "G O",
      icon: <LayoutDashboard className="w-4 h-4 text-[#39D9FF]" />,
      action: () => navigateTo("/"),
    },
    {
      id: "nav-models",
      title: "Open Model Lab & Security Cards",
      category: "Navigation",
      shortcut: "G M",
      icon: <Cpu className="w-4 h-4 text-[#8C7DFF]" />,
      action: () => navigateTo("/models"),
    },
    {
      id: "nav-security",
      title: "Open Security Center (Blue Console)",
      category: "Navigation",
      shortcut: "G S",
      icon: <ShieldCheck className="w-4 h-4 text-[#5D9CFF]" />,
      action: () => navigateTo("/blue"),
    },
    {
      id: "nav-evaluation",
      title: "Open Evaluation Center (Red Console)",
      category: "Navigation",
      shortcut: "G E",
      icon: <Flame className="w-4 h-4 text-[#FF6074]" />,
      action: () => navigateTo("/red"),
    },
    {
      id: "nav-live",
      title: "View Live Activity & Observability",
      category: "Navigation",
      shortcut: "G L",
      icon: <Activity className="w-4 h-4 text-[#39D9FF]" />,
      action: () => navigateTo("/observability"),
    },
    {
      id: "nav-evidence",
      title: "Inspect Evidence & Cryptographic Ledger",
      category: "Navigation",
      shortcut: "G A",
      icon: <FileCheck className="w-4 h-4 text-[#FFB84D]" />,
      action: () => navigateTo("/audit"),
    },
    {
      id: "nav-reports",
      title: "Open Regulatory Assurance & Reports",
      category: "Navigation",
      shortcut: "G R",
      icon: <Award className="w-4 h-4 text-[#38D996]" />,
      action: () => navigateTo("/compliance"),
    },
    {
      id: "nav-control",
      title: "System Health & Sandbox Provisioning",
      category: "Navigation",
      shortcut: "G C",
      icon: <Layers className="w-4 h-4 text-[#38D996]" />,
      action: () => navigateTo("/control"),
    },
    {
      id: "nav-taxonomy",
      title: "Explore OWASP Top 10 for LLMs Directory",
      category: "Navigation",
      shortcut: "G T",
      icon: <BookOpen className="w-4 h-4 text-[#5D9CFF]" />,
      action: () => navigateTo("/taxonomy"),
    },
    {
      id: "nav-demo",
      title: "Launch Interactive Walkthrough Demo",
      category: "Navigation",
      shortcut: "G D",
      icon: <Sparkles className="w-4 h-4 text-[#8C7DFF]" />,
      action: () => navigateTo("/demo"),
    },
    {
      id: "nav-login",
      title: "RBAC Identity & Role Switcher",
      category: "Navigation",
      shortcut: "G U",
      icon: <UserCheck className="w-4 h-4 text-[#A4AFBC]" />,
      action: () => navigateTo("/login"),
    },
    {
      id: "nav-settings",
      title: "Open Operational Configuration & Settings",
      category: "Navigation",
      shortcut: "G S",
      icon: <Settings className="w-4 h-4 text-[#39D9FF]" />,
      action: () => navigateTo("/settings"),
    },
    // Actions
    {
      id: "act-attack",
      title: "Simulate Red Team Adversarial Attack",
      category: "Actions",
      icon: <Zap className="w-4 h-4 text-[#FF6074]" />,
      action: () => navigateTo("/red"),
    },
    {
      id: "act-defense",
      title: "Deploy Regex / Canary Guardrail Rule",
      category: "Actions",
      icon: <ShieldCheck className="w-4 h-4 text-[#5D9CFF]" />,
      action: () => navigateTo("/blue"),
    },
    {
      id: "act-verify",
      title: "Run SHA-256 Ledger Integrity Verification",
      category: "Security & Audit",
      icon: <Lock className="w-4 h-4 text-[#FFB84D]" />,
      action: () => navigateTo("/audit"),
    },
    {
      id: "act-export",
      title: "Export Verifiable Audit Evidence Certificate",
      category: "Security & Audit",
      icon: <FileText className="w-4 h-4 text-[#38D996]" />,
      action: () => navigateTo("/audit"),
    },
    {
      id: "act-eu-ai",
      title: "Audit EU AI Act (Regulation 2024/1689) Proofs",
      category: "Assurance",
      icon: <Award className="w-4 h-4 text-[#38D996]" />,
      action: () => navigateTo("/compliance"),
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
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          onClose(); // triggers toggle in parent
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
        className="fixed inset-0 bg-[#070A0F]/80 backdrop-blur-md transition-opacity"
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-2xl bg-[#101720] border border-[#25303C] rounded-xl shadow-2xl overflow-hidden z-10 animate-fade-in flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#1B252F] bg-[#0B1017] gap-3">
          <Search className="w-4 h-4 text-[#39D9FF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search pages, models, security signals..."
            className="flex-1 bg-transparent text-sm text-[#F5F7FA] placeholder-[#6C7886] outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#6C7886] hover:text-[#F5F7FA] rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="overflow-y-auto p-2 divide-y divide-[#1B252F]/40 flex-1">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#6C7886] font-mono">
              No matching commands or resources found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={cmd.id}
                    onClick={() => cmd.action()}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition text-xs ${
                      isSelected
                        ? "bg-[#151D27] text-[#F5F7FA] border border-[#25303C]"
                        : "text-[#A4AFBC] hover:bg-[#151D27]/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded bg-[#070A0F] border border-[#1B252F]">
                        {cmd.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#F5F7FA]">
                          {cmd.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#6C7886]">
                          {cmd.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {cmd.shortcut && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#070A0F] text-[#6C7886] border border-[#1B252F]">
                          {cmd.shortcut}
                        </span>
                      )}
                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-[#39D9FF]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Palette Footer */}
        <div className="px-4 py-2.5 border-t border-[#1B252F] bg-[#070A0F] flex items-center justify-between text-[11px] font-mono text-[#6C7886]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#101720] border border-[#25303C] text-[10px]">
                ↑
              </kbd>{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-[#101720] border border-[#25303C] text-[10px]">
                ↓
              </kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#101720] border border-[#25303C] text-[10px]">
                ↵
              </kbd>{" "}
              Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#101720] border border-[#25303C] text-[10px]">
                ESC
              </kbd>{" "}
              Close
            </span>
          </div>
          <span className="text-[#39D9FF]">BAYORA ENTERPRISE PALETTE</span>
        </div>
      </div>
    </div>
  );
}
