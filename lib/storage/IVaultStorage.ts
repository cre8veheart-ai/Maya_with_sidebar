import type {
  VaultAccessRecord,
  VaultAuditEntry,
  VaultExportRequest,
} from "@/lib/types/vault";

export interface IVaultStorage {
  // ── Access control ───────────────────────────────────────────────────────
  getAccess(userId: string): Promise<VaultAccessRecord | null>;
  listAccess(): Promise<VaultAccessRecord[]>;
  grantAccess(record: VaultAccessRecord): Promise<VaultAccessRecord>;
  revokeAccess(userId: string, revokedBy: string): Promise<void>;

  // ── Export approval ──────────────────────────────────────────────────────
  // Bulk exports require explicit owner/admin approval — no self-serve export.
  requestExport(request: VaultExportRequest): Promise<VaultExportRequest>;
  approveExport(requestId: string, approvedBy: string): Promise<VaultExportRequest>;
  denyExport(requestId: string, deniedBy: string, reason: string): Promise<VaultExportRequest>;
  listExportRequests(): Promise<VaultExportRequest[]>;

  // ── Audit log ────────────────────────────────────────────────────────────
  logAccess(entry: VaultAuditEntry): Promise<void>;
  getAuditLog(limit?: number): Promise<VaultAuditEntry[]>;
}
