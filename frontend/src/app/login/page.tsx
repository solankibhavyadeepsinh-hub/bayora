"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Shield,
  Database,
  FileCheck,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

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

  const handleQuickRole = async (
    role: "red_operator" | "blue_operator" | "admin" | "auditor",
    path: string
  ) => {
    setError(null);
    try {
      await switchRole(role);
      router.push(path);
    } catch (err: any) {
      setError(err.message || "Failed to switch role");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101720] border border-[#1B252F] text-xs font-mono text-[#39D9FF]">
          <Lock className="w-3.5 h-3.5" />
          <span>ZERO-TRUST IDENTITY GATEWAY</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F5F7FA]">
          Authentication & Role Enforcement
        </h1>
        <p className="text-xs text-[#A4AFBC] max-w-lg mx-auto">
          Authenticate with role-embedded JWT bearer credentials or switch instantly between demo operators.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-[#FF6074]/15 border border-[#FF6074]/30 text-[#FF6074] text-xs font-mono flex items-center gap-2.5 max-w-2xl mx-auto">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left: 1-Click Role Switcher */}
        <div className="p-6 rounded-lg bg-[#101720] border border-[#1B252F] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-heading font-semibold text-sm text-[#F5F7FA]">
                Instant Demo Roles
              </span>
              <Badge variant="cyan" size="xs">
                QUICK-SWITCH
              </Badge>
            </div>
            <p className="text-xs text-[#A4AFBC]">
              Select any role below to authenticate instantly and observe strict zone boundary enforcement.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => handleQuickRole("red_operator", "/red")}
              className="w-full flex items-center justify-between p-3 rounded-md bg-[#070A0F] border border-[#1B252F] hover:border-[#FF6074]/50 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-[#FF6074]/10 text-[#FF6074]">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#F5F7FA] block">
                    Red Team Operator
                  </span>
                  <span className="text-[10px] font-mono text-[#6C7886]">
                    red_operator • red_zone
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6C7886] group-hover:text-[#FF6074] transition" />
            </button>

            <button
              onClick={() => handleQuickRole("blue_operator", "/blue")}
              className="w-full flex items-center justify-between p-3 rounded-md bg-[#070A0F] border border-[#1B252F] hover:border-[#5D9CFF]/50 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-[#5D9CFF]/10 text-[#5D9CFF]">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#F5F7FA] block">
                    Blue Team Operator
                  </span>
                  <span className="text-[10px] font-mono text-[#6C7886]">
                    blue_operator • blue_zone
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6C7886] group-hover:text-[#5D9CFF] transition" />
            </button>

            <button
              onClick={() => handleQuickRole("admin", "/control")}
              className="w-full flex items-center justify-between p-3 rounded-md bg-[#070A0F] border border-[#1B252F] hover:border-[#38D996]/50 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-[#38D996]/10 text-[#38D996]">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#F5F7FA] block">
                    Control Plane Admin
                  </span>
                  <span className="text-[10px] font-mono text-[#6C7886]">
                    admin • control_plane
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6C7886] group-hover:text-[#38D996] transition" />
            </button>

            <button
              onClick={() => handleQuickRole("auditor", "/audit")}
              className="w-full flex items-center justify-between p-3 rounded-md bg-[#070A0F] border border-[#1B252F] hover:border-[#FFB84D]/50 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-[#FFB84D]/10 text-[#FFB84D]">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#F5F7FA] block">
                    Compliance Auditor
                  </span>
                  <span className="text-[10px] font-mono text-[#6C7886]">
                    auditor • audit_zone
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6C7886] group-hover:text-[#FFB84D] transition" />
            </button>
          </div>
        </div>

        {/* Right: Manual Login Form */}
        <div className="p-6 rounded-lg bg-[#101720] border border-[#1B252F] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-heading font-semibold text-sm text-[#F5F7FA]">
              Manual Credentials
            </h3>
            <p className="text-xs text-[#A4AFBC]">
              Enter username and password to authenticate directly via POST /api/auth/login.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-[#A4AFBC]">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2.5 rounded bg-[#070A0F] border border-[#1B252F] text-[#F5F7FA] focus:border-[#39D9FF] outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#A4AFBC]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded bg-[#070A0F] border border-[#1B252F] text-[#F5F7FA] focus:border-[#39D9FF] outline-none"
                required
              />
            </div>

            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={submitting}
              className="w-full mt-2"
            >
              Authenticate & Issue JWT
            </Button>
          </form>

          {user && (
            <div className="p-3 rounded bg-[#070A0F] border border-[#1B252F] text-[11px] font-mono flex items-center justify-between">
              <span className="text-[#6C7886]">Current Session:</span>
              <span className="text-[#39D9FF] font-semibold">{user.username} ({user.role})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
