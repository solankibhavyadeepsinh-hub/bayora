const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface UserSession {
  id: string;
  username: string;
  email: string;
  role: "red_operator" | "blue_operator" | "admin" | "auditor";
  zone: "red_zone" | "blue_zone" | "control_plane" | "audit_zone";
  token: string;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bayora_token");
}

export function setStoredToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("bayora_token", token);
  }
}

export function removeStoredToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("bayora_token");
    localStorage.removeItem("bayora_user");
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errDetail = "API Request failed";
    try {
      const errJson = await res.json();
      errDetail = errJson.detail || JSON.stringify(errJson);
    } catch {
      errDetail = await res.text();
    }
    throw new Error(errDetail);
  }

  return res.json();
}

// Authentication
export async function apiLogin(username: string, password: string) {
  return request<{ access_token: string; token_type: string; user: any }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function apiGetMe() {
  return request<any>("/auth/me");
}

// Red Zone
export async function apiSendAttack(payload: { sandbox_id: string; prompt: string; attack_category?: string; campaign_id?: string }) {
  return request<any>("/red/attack", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiGetAttackHistory(limit = 50) {
  return request<any[]>(`/red/attacks?limit=${limit}`);
}

export async function apiGetCampaigns() {
  return request<any[]>("/red/campaigns");
}

export async function apiRunCampaignBatch(campaignId: string) {
  return request<any>(`/red/campaigns/${campaignId}/run-batch`, {
    method: "POST",
  });
}

// Blue Zone
export async function apiGetDefenses() {
  return request<any[]>("/blue/defenses");
}

export async function apiCreateDefense(rule: any) {
  return request<any>("/blue/defenses", {
    method: "POST",
    body: JSON.stringify(rule),
  });
}

export async function apiUpdateDefense(ruleId: string, rule: any) {
  return request<any>(`/blue/defenses/${ruleId}`, {
    method: "PUT",
    body: JSON.stringify(rule),
  });
}

export async function apiDeleteDefense(ruleId: string) {
  return request<any>(`/blue/defenses/${ruleId}`, {
    method: "DELETE",
  });
}

export async function apiGetThreatFeed(limit = 50) {
  return request<any[]>(`/blue/threat-feed?limit=${limit}`);
}

export async function apiGetBlueMetrics() {
  return request<any>("/blue/metrics");
}

// Control Plane
export async function apiGetSandboxes() {
  return request<any[]>("/control/sandboxes");
}

export async function apiCreateSandbox(data: any) {
  return request<any>("/control/sandboxes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetUsers() {
  return request<any[]>("/control/users");
}

// Audit & Evidence
export async function apiGetAuditBlocks(limit = 100) {
  return request<any[]>(`/audit/blocks?limit=${limit}`);
}

export async function apiVerifyAuditIntegrity() {
  return request<any>("/audit/verify", {
    method: "POST",
  });
}

export async function apiSimulateTamper(blockIndex = 1) {
  return request<any>(`/audit/simulate-tamper?block_index=${blockIndex}`, {
    method: "POST",
  });
}

export async function apiRepairChain() {
  return request<any>("/audit/repair-chain", {
    method: "POST",
  });
}

export async function apiExportAuditEvidence() {
  return request<any>("/audit/export");
}

// Observability
export async function apiGetObservabilityMetrics() {
  return request<any>("/observability/metrics");
}

// Demo Walkthrough
export async function apiRunDemoStepByStep() {
  return request<any>("/demo/run-step-by-step", {
    method: "POST",
  });
}
