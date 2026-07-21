// ── Intel Vault access control types ─────────────────────────────────────────
// The vault is MAYA's protected intel store. These types govern who can access
// what, what operations require explicit approval, and maintain an audit trail.
// Phase 1 stores locally; Phase 2 enforces server-side.

export type VaultAccessLevel =
  | "owner"    // Full control — grants/revokes access, approves exports
  | "admin"    // Can manage access and approve exports
  | "exec"     // Read + write all categories
  | "client"   // Read designated categories only; export requires approval
  | "readonly" // Read-only
  | "revoked"; // Explicitly revoked — no operations permitted

export interface VaultAccessRecord {
  id: string;
  userId: string;
  displayName: string;
  accessLevel: VaultAccessLevel;
  grantedAt: string;  // ISO 8601
  grantedBy: string;
  revokedAt?: string; // ISO 8601 — set when access is revoked
  revokedBy?: string;
}

export type VaultAuditAction =
  | "read"
  | "write"
  | "export-requested"
  | "export-approved"
  | "export-denied"
  | "access-granted"
  | "access-revoked";

export interface VaultAuditEntry {
  id: string;
  action: VaultAuditAction;
  category: string;   // which vault category was touched
  recordId?: string;  // specific record, if applicable
  performedBy: string;
  performedAt: string; // ISO 8601
  note?: string;
}

export type ExportRequestStatus = "pending" | "approved" | "denied";

// All bulk data exports require owner/admin approval — a fired exec or
// departing client cannot self-serve a vault export.
export interface VaultExportRequest {
  id: string;
  requestedBy: string;
  requestedAt: string; // ISO 8601
  categories: string[];
  status: ExportRequestStatus;
  resolvedBy?: string;
  resolvedAt?: string; // ISO 8601
  reason?: string;     // denial reason
}
