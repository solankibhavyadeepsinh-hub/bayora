"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiLogin, apiGetMe, setStoredToken, removeStoredToken, getStoredToken, UserSession } from "./api";

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  switchRole: (role: "red_operator" | "blue_operator" | "admin" | "auditor") => Promise<void>;
  logout: () => void;
}

const DEMO_CREDENTIALS = {
  red_operator: { username: "red_operator", password: "red_pass123", zone: "red_zone" as const },
  blue_operator: { username: "blue_operator", password: "blue_pass123", zone: "blue_zone" as const },
  admin: { username: "admin", password: "admin_pass123", zone: "control_plane" as const },
  auditor: { username: "auditor", password: "auditor_pass123", zone: "audit_zone" as const },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from storage or default to red_operator for demo convenience
  useEffect(() => {
    async function initAuth() {
      const token = getStoredToken();
      if (token) {
        try {
          const me = await apiGetMe();
          setUser({
            ...me,
            token,
          });
          setLoading(false);
          return;
        } catch {
          removeStoredToken();
        }
      }
      
      // Auto-login as red_operator for seamless instant onboarding
      try {
        const creds = DEMO_CREDENTIALS.red_operator;
        const res = await apiLogin(creds.username, creds.password);
        setStoredToken(res.access_token);
        setUser({
          ...res.user,
          token: res.access_token,
        });
      } catch (err) {
        console.warn("Backend not yet connected or initializing:", err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiLogin(username, password);
      setStoredToken(res.access_token);
      setUser({
        ...res.user,
        token: res.access_token,
      });
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (role: "red_operator" | "blue_operator" | "admin" | "auditor") => {
    setLoading(true);
    try {
      const creds = DEMO_CREDENTIALS[role];
      const res = await apiLogin(creds.username, creds.password);
      setStoredToken(res.access_token);
      setUser({
        ...res.user,
        token: res.access_token,
      });
    } catch (err) {
      console.error(`Failed to switch to role ${role}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
