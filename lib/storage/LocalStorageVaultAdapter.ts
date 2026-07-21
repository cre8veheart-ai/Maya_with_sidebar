import type { IVaultStorage } from "./IVaultStorage";
import type {
  VaultAccessRecord,
  VaultAuditEntry,
  VaultExportRequest,
} from "@/lib/types/vault";

const KEYS = {
  access:  "maya-vault-access",
  exports: "maya-vault-exports",
  audit:   "maya-vault-audit",
} as const;

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore write errors (quota, private browsing)
  }
}

export class LocalStorageVaultAdapter implements IVaultStorage {
  // ── Access control ─────────────────────────────────────────────────────

  async getAccess(userId: string): Promise<VaultAccessRecord | null> {
    return read<VaultAccessRecord>(KEYS.access).find((r) => r.userId === userId) ?? null;
  }

  async listAccess(): Promise<VaultAccessRecord[]> {
    return read<VaultAccessRecord>(KEYS.access);
  }

  async grantAccess(record: VaultAccessRecord): Promise<VaultAccessRecord> {
    const all = read<VaultAccessRecord>(KEYS.access);
    const idx = all.findIndex((r) => r.userId === record.userId);
    if (idx >= 0) {
      all[idx] = record;
    } else {
      all.push(record);
    }
    write(KEYS.access, all);
    return record;
  }

  async revokeAccess(userId: string, revokedBy: string): Promise<void> {
    const all = read<VaultAccessRecord>(KEYS.access).map((r) =>
      r.userId === userId
        ? { ...r, accessLevel: "revoked" as const, revokedAt: new Date().toISOString(), revokedBy }
        : r
    );
    write(KEYS.access, all);
  }

  // ── Export approval ────────────────────────────────────────────────────

  async requestExport(request: VaultExportRequest): Promise<VaultExportRequest> {
    const all = read<VaultExportRequest>(KEYS.exports);
    all.push(request);
    write(KEYS.exports, all);
    return request;
  }

  async approveExport(requestId: string, approvedBy: string): Promise<VaultExportRequest> {
    const all = read<VaultExportRequest>(KEYS.exports);
    const idx = all.findIndex((r) => r.id === requestId);
    if (idx < 0) throw new Error(`Export request ${requestId} not found`);
    all[idx] = {
      ...all[idx],
      status: "approved",
      resolvedBy: approvedBy,
      resolvedAt: new Date().toISOString(),
    };
    write(KEYS.exports, all);
    return all[idx];
  }

  async denyExport(requestId: string, deniedBy: string, reason: string): Promise<VaultExportRequest> {
    const all = read<VaultExportRequest>(KEYS.exports);
    const idx = all.findIndex((r) => r.id === requestId);
    if (idx < 0) throw new Error(`Export request ${requestId} not found`);
    all[idx] = {
      ...all[idx],
      status: "denied",
      resolvedBy: deniedBy,
      resolvedAt: new Date().toISOString(),
      reason,
    };
    write(KEYS.exports, all);
    return all[idx];
  }

  async listExportRequests(): Promise<VaultExportRequest[]> {
    return read<VaultExportRequest>(KEYS.exports);
  }

  // ── Audit log ──────────────────────────────────────────────────────────

  async logAccess(entry: VaultAuditEntry): Promise<void> {
    const all = read<VaultAuditEntry>(KEYS.audit);
    all.push(entry);
    // Cap audit log at 500 entries — oldest drop first
    if (all.length > 500) all.splice(0, all.length - 500);
    write(KEYS.audit, all);
  }

  async getAuditLog(limit = 100): Promise<VaultAuditEntry[]> {
    const all = read<VaultAuditEntry>(KEYS.audit);
    return all.slice(-limit).reverse();
  }
}
