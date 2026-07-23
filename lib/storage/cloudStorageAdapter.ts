// Cloud storage adapter — reads/writes via MAYA API routes backed by Vercel KV.
// Identity is a UUID stored in a secure cookie, assigned on beta approval.
import type { IVaultStorage } from "./IVaultStorage";
import type { BetaProfile } from "@/lib/beta/betaGate";
import type { RoleLens } from "@/lib/maya/types";

async function api<T>(path: string, body?: unknown): Promise<T | null> {
  try {
    const res = await fetch(path, {
      method: body !== undefined ? "POST" : "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json as T;
  } catch {
    return null;
  }
}

export class CloudStorageAdapter implements IVaultStorage {
  async getProfile(): Promise<BetaProfile | null> {
    const data = await api<{ profile: BetaProfile | null }>("/api/user/profile");
    return data?.profile ?? null;
  }

  async saveProfile(profile: BetaProfile): Promise<void> {
    await api("/api/user/profile", { profile });
  }

  async getLens(role: string): Promise<RoleLens | null> {
    const data = await api<{ lens: RoleLens | null }>(`/api/user/lens?role=${role}`);
    return data?.lens ?? null;
  }

  async saveLens(lens: RoleLens): Promise<void> {
    await api("/api/user/lens", { lens });
  }

  async getLastSurvey(): Promise<string | null> {
    const data = await api<{ lastSurvey: string | null }>("/api/user/survey");
    return data?.lastSurvey ?? null;
  }

  async saveLastSurvey(iso: string): Promise<void> {
    await api("/api/user/survey", { lastSurvey: iso });
  }

  async getBetaStatus(): Promise<"approved" | "pending"> {
    const data = await api<{ status: string }>("/api/user/profile");
    return data?.status === "approved" ? "approved" : "pending";
  }

  async setBetaApproved(): Promise<void> {
    // Status is set implicitly when profile is saved
  }

  async clear(): Promise<void> {
    await api("/api/user/profile", { clear: true });
  }
}
