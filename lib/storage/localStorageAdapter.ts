import type { IVaultStorage } from "./IVaultStorage";
import type { BetaProfile } from "@/lib/beta/betaGate";
import type { RoleLens, ClientRecord } from "@/lib/maya/types";

const KEYS = {
  status: "maya_beta_status",
  profile: "maya_beta_profile",
  survey: "maya_beta_last_survey",
  lens: (role: string) => `maya_lens_${role}`,
  clients: "maya_clients",
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

  // ── Client Vault ────────────────────────────────────────────────────────
  async getClients(): Promise<ClientRecord[]> {
    try {
      const raw = localStorage.getItem(KEYS.clients);
      return raw ? (JSON.parse(raw) as ClientRecord[]) : [];
    } catch { return []; }
  }

  async saveClient(client: ClientRecord): Promise<void> {
    const clients = await this.getClients();
    const idx = clients.findIndex((c) => c.id === client.id);
    if (idx >= 0) clients[idx] = client;
    else clients.unshift(client);
    localStorage.setItem(KEYS.clients, JSON.stringify(clients));
  }

  async deleteClient(id: string): Promise<void> {
    const clients = await this.getClients();
    localStorage.setItem(KEYS.clients, JSON.stringify(clients.filter((c) => c.id !== id)));
  }

  async clearAllClients(): Promise<void> {
    localStorage.removeItem(KEYS.clients);
  }
}
