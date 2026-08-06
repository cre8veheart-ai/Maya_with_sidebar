import type { BetaProfile } from "@/lib/beta/betaGate";
import type { RoleLens, ClientRecord, ChatSession } from "@/lib/maya/types";

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

  // ── Client Vault ──────────────────────────────────────────────────────────
  getClients(): Promise<ClientRecord[]>;
  saveClient(client: ClientRecord): Promise<void>;
  deleteClient(id: string): Promise<void>;
  clearAllClients(): Promise<void>;

  // ── Chat Sessions ─────────────────────────────────────────────────────────
  getSessions(): Promise<ChatSession[]>;
  getSession(id: string): Promise<ChatSession | null>;
  saveSession(session: ChatSession): Promise<void>;
  deleteSession(id: string): Promise<void>;
}
