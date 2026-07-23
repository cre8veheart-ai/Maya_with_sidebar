import type { BetaProfile } from "@/lib/beta/betaGate";
import type { RoleLens } from "@/lib/maya/types";

export interface IVaultStorage {
  getProfile(): Promise<BetaProfile | null>;
  saveProfile(profile: BetaProfile): Promise<void>;
  getLens(role: string): Promise<RoleLens | null>;
  saveLens(lens: RoleLens): Promise<void>;
  getLastSurvey(): Promise<string | null>;
  saveLastSurvey(iso: string): Promise<void>;
  getBetaStatus(): Promise<"approved" | "pending">;
  setBetaApproved(): Promise<void>;
  clear(): Promise<void>;
}
