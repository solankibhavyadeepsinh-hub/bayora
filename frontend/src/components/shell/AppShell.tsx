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
    <div className="min-h-screen bg-[#080A0D] text-[#EEF2F5] flex flex-col font-sans">
      {/* Permanent Sidebar */}
      <Sidebar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col pl-16 lg:pl-60 transition-all duration-200 min-h-screen">
        <TopBar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        <main className="flex-1 p-5 md:p-7 max-w-[1550px] w-full mx-auto space-y-7">
          {children}
        </main>

        <footer className="border-t border-[#1C242C] bg-[#080A0D] py-3.5 px-6 text-[11px] font-mono text-[#68737E] flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#45C995]" />
            <span>BAYORA AI SECURITY PLATFORM • ENTERPRISE AIRGAP v2.4</span>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span>SHA-256 CONTINUITY</span>
            <span>•</span>
            <span>DEFAULT-DENY CNI</span>
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
