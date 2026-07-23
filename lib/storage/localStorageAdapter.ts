import type { IVaultStorage } from "./IVaultStorage";
import type { BetaProfile } from "@/lib/beta/betaGate";
import type { RoleLens } from "@/lib/maya/types";

const KEYS = {
  status: "maya_beta_status",
  profile: "maya_beta_profile",
  survey: "maya_beta_last_survey",
  lens: (role: string) => `maya_lens_${role}`,
};

export class LocalStorageAdapter implements IVaultStorage {
  async getProfile(): Promise<BetaProfile | null> {
    try {
      const raw = localStorage.getItem(KEYS.profile);
      return raw ? (JSON.parse(raw) as BetaProfile) : null;
    } catch { return null; }
  }

  async saveProfile(profile: BetaProfile): Promise<void> {
    localStorage.setItem(KEYS.profile, JSON.stringify(profile));
  }

  async getLens(role: string): Promise<RoleLens | null> {
    try {
      const raw = localStorage.getItem(KEYS.lens(role));
      return raw ? (JSON.parse(raw) as RoleLens) : null;
    } catch { return null; }
  }

  async saveLens(lens: RoleLens): Promise<void> {
    localStorage.setItem(KEYS.lens(lens.role), JSON.stringify(lens));
  }

  async getLastSurvey(): Promise<string | null> {
    return localStorage.getItem(KEYS.survey);
  }

  async saveLastSurvey(iso: string): Promise<void> {
    localStorage.setItem(KEYS.survey, iso);
  }

  async getBetaStatus(): Promise<"approved" | "pending"> {
    return localStorage.getItem(KEYS.status) === "approved" ? "approved" : "pending";
  }

  async setBetaApproved(): Promise<void> {
    localStorage.setItem(KEYS.status, "approved");
  }

  async clear(): Promise<void> {
    Object.values(KEYS).forEach((k) => {
      if (typeof k === "string") localStorage.removeItem(k);
    });
  }
}
