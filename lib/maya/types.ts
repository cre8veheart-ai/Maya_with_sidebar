export type ExecRole = "ceo" | "coo" | "cmo" | "cfo" | "cto" | "cio" | "cro" | "cd" | "admin" | "hr" | "legal";

export interface RoleOverride {
  key: string;
  value: string;
}

export interface RoleLens {
  role: ExecRole;
  overrides: RoleOverride[];
}

export interface MayaMessage {
  role: "user" | "assistant";
  content: string;
}

// ── Client Vault ─────────────────────────────────────────────────────────────

export type ClientStatus = "active" | "prospect" | "on-hold" | "closed";

export interface ClientFile {
  id: string;
  name: string;
  /** Text content / extracted notes — stored in cloud memory, injected as context */
  content: string;
  addedAt: string; // ISO
  sizeLabel: string; // human-readable, e.g. "2.4 KB"
}

export interface ClientRecord {
  id: string;
  name: string;         // contact / account name
  company: string;
  industry: string;
  dealType: string;     // e.g. "Acquisition", "Campaign", "Consulting"
  status: ClientStatus;
  notes: string;        // free-form exec notes — also injected as context
  files: ClientFile[];  // attached documents/briefs stored as text in cloud
  tags: string[];
  createdAt: string;    // ISO
  updatedAt: string;    // ISO
}
