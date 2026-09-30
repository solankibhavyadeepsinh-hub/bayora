"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "../ui/CommandPalette";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#070A0F] text-[#F5F7FA] flex flex-col font-sans">
      {/* Permanent Sidebar */}
      <Sidebar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* Main Workspace Frame (shifted right by sidebar width) */}
      <div className="flex-1 flex flex-col pl-16 lg:pl-64 transition-all duration-200 min-h-screen">
        <TopBar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-8">
          {children}
        </main>

        <footer className="border-t border-[#1B252F] bg-[#070A0F] py-4 px-8 text-xs font-mono text-[#6C7886] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38D996]" />
            <span>BAYORA ENTERPRISE AI SECURITY LABORATORY • AIRGAP EDITION v2.4</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>SHA-256 LEDGER</span>
            <span>•</span>
            <span>DEFAULT-DENY</span>
            <span>•</span>
            <span>mTLS ZERO-TRUST</span>
          </div>
        </footer>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
