"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ZoneBadge } from "@/components/ZoneBadge";
import { Lock, ArrowRight, ShieldCheck, Terminal, Shield, Database, Eye } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, switchRole, loading } = useAuth();
  const [username, setUsername] = useState("red_operator");
  const [password, setPassword] = useState("red_pass123");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickRole = async (role: "red_operator" | "blue_operator" | "admin" | "auditor", path: string) => {
    setError(null);
    try {
      await switchRole(role);
      router.push(path);
    } catch (err: any) {
      setError(err.message || "Failed to switch role");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: 1-Click Role Switcher */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#0D1322] p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Instant Demo Roles</h2>
            </div>
            <p className="text-xs text-slate-400">
              Select any role below to authenticate instantly and observe strict zone boundary enforcement.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleQuickRole("red_operator", "/red")}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#E5484D]/40 bg-[#E5484D]/10 hover:bg-[#E5484D]/20 transition text-left"
            >
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-[#E5484D]" />
                <div>
                  <div className="text-xs font-semibold text-white">Red Team Operator</div>
                  <div className="text-[11px] text-slate-400 font-mono">red_operator • red_zone</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#E5484D]" />
            </button>

            <button
              onClick={() => handleQuickRole("blue_operator", "/blue")}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#3B82F6]/40 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 transition text-left"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#3B82F6]" />
                <div>
                  <div className="text-xs font-semibold text-white">Blue Team Operator</div>
                  <div className="text-[11px] text-slate-400 font-mono">blue_operator • blue_zone</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#3B82F6]" />
            </button>

            <button
              onClick={() => handleQuickRole("admin", "/control")}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 hover:bg-[#10B981]/20 transition text-left"
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-[#10B981]" />
                <div>
                  <div className="text-xs font-semibold text-white">Control Plane Administrator</div>
                  <div className="text-[11px] text-slate-400 font-mono">admin • control_plane</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#10B981]" />
            </button>

            <button
              onClick={() => handleQuickRole("auditor", "/audit")}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 transition text-left"
            >
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-semibold text-white">Compliance Auditor</div>
                  <div className="text-[11px] text-slate-400 font-mono">auditor • audit_zone</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Right: Manual Login Form */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#0A0F1D] p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Manual Authentication</h2>
            <p className="text-xs text-slate-400 mt-1">
              Issue JWT token with role-embedded claims.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#1E293B] bg-[#070B12] text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md transition disabled:opacity-50"
            >
              {submitting ? "Authenticating..." : "Sign In with Credentials"}
            </button>
          </form>

          {user && (
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <span className="block mb-1">Currently Signed In:</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono">{user.username}</span>
                <ZoneBadge zone={user.role} size="sm" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
