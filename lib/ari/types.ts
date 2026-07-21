// ── Ari session storage types ─────────────────────────────────────────────────
// Mirrors the IWorkflowStorage pattern so a backend adapter can be swapped
// in without touching the UI layer.

export type MessageRole = "user" | "assistant";

export interface AriMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string; // ISO-8601
}

export interface AriSession {
  id: string;
  messages: AriMessage[];
  createdAt: string;
  updatedAt: string;
  /** Optional context label, e.g. "CEO", "CFO", "Workflows" */
  context?: string;
}

export interface IAriStorage {
  getSession(sessionId: string): Promise<AriSession | null>;
  saveSession(session: AriSession): Promise<void>;
  listSessions(): Promise<AriSession[]>;
  deleteSession(sessionId: string): Promise<void>;
}
