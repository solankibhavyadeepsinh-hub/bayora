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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11161B] border border-[#1B2229] text-xs font-mono text-[#4BC7B5]">
          <Lock className="w-3.5 h-3.5" />
          <span>ZERO-TRUST IDENTITY GATEWAY</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F1F4F6]">
          Authentication & Role Enforcement
        </h1>
        <p className="text-xs text-[#A6B0BA] max-w-lg mx-auto">
          Authenticate with role-embedded JWT bearer credentials or switch instantly between demo operators.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-[#D96573]/15 border border-[#D96573]/30 text-[#D96573] text-xs font-mono flex items-center gap-2.5 max-w-2xl mx-auto">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left: 1-Click Role Switcher */}
        <div className="p-6 rounded-lg bg-[#11161B] border border-[#1B2229] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-heading font-semibold text-sm text-[#F1F4F6]">
                Instant Demo Roles
              </span>
              <Badge variant="cyan" size="xs">
                QUICK-SWITCH
              </Badge>
            </div>
            <p className="text-xs text-[#A6B0BA]">
              Select any role below to authenticate instantly and observe strict zone boundary enforcement.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => handleQuickRole("red_operator", "/red")}
              className="w-full flex items-center justify-between p-3 rounded-md bg-[#0A0D10] border border-[#1B2229] hover:border-[#D96573]/50 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-[#D96573]/10 text-[#D96573]">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#F1F4F6] block">
                    Red Team Operator
                  </span>
                  <span className="text-[10px] font-mono text-[#707B85]">
                    red_operator • red_zone
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#707B85] group-hover:text-[#D96573] transition" />
            </button>

            <button
              onClick={() => handleQuickRole("blue_operator", "/blue")}
              className="w-full flex items-center justify-between p-3 rounded-md bg-[#0A0D10] border border-[#1B2229] hover:border-[#5B91D6]/50 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-[#5B91D6]/10 text-[#5B91D6]">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#F1F4F6] block">
                    Blue Team Operator
                  </span>
                  <span className="text-[10px] font-mono text-[#707B85]">
                    blue_operator • blue_zone
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#707B85] group-hover:text-[#5B91D6] transition" />
            </button>

            <button
              onClick={() => handleQuickRole("admin", "/control")}
              className="w-full flex items-center justify-between p-3 rounded-md bg-[#0A0D10] border border-[#1B2229] hover:border-[#42B883]/50 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-[#42B883]/10 text-[#42B883]">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#F1F4F6] block">
                    Control Plane Admin
                  </span>
                  <span className="text-[10px] font-mono text-[#707B85]">
                    admin • control_plane
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#707B85] group-hover:text-[#42B883] transition" />
            </button>

            <button
              onClick={() => handleQuickRole("auditor", "/audit")}
              className="w-full flex items-center justify-between p-3 rounded-md bg-[#0A0D10] border border-[#1B2229] hover:border-[#D6A856]/50 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-[#D6A856]/10 text-[#D6A856]">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#F1F4F6] block">
                    Compliance Auditor
                  </span>
                  <span className="text-[10px] font-mono text-[#707B85]">
                    auditor • audit_zone
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#707B85] group-hover:text-[#D6A856] transition" />
            </button>
          </div>
        </div>

        {/* Right: Manual Login Form */}
        <div className="p-6 rounded-lg bg-[#11161B] border border-[#1B2229] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-heading font-semibold text-sm text-[#F1F4F6]">
              Manual Credentials
            </h3>
            <p className="text-xs text-[#A6B0BA]">
              Enter username and password to authenticate directly via POST /api/auth/login.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-[#A6B0BA]">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2.5 rounded bg-[#0A0D10] border border-[#1B2229] text-[#F1F4F6] focus:border-[#4BC7B5] outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#A6B0BA]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded bg-[#0A0D10] border border-[#1B2229] text-[#F1F4F6] focus:border-[#4BC7B5] outline-none"
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
            <div className="p-3 rounded bg-[#0A0D10] border border-[#1B2229] text-[11px] font-mono flex items-center justify-between">
              <span className="text-[#707B85]">Current Session:</span>
              <span className="text-[#4BC7B5] font-semibold">{user.username} ({user.role})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
