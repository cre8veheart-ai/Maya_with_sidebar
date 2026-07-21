// ── Org memory types ──────────────────────────────────────────────────────────
// MemoryFact represents a persistent piece of intelligence MAYA has extracted
// from conversations with the executive. This is the layer that makes MAYA
// adaptive — it compounds across sessions rather than starting fresh each time.

export type MemoryCategory =
  | "org-context"       // How the org is structured, what it does, who the players are
  | "exec-pattern"      // How this executive thinks, their priorities, decision style
  | "active-priority"   // What they're focused on right now
  | "cross-functional"  // How functions relate, tensions, dependencies
  | "strategic-context" // Key facts about the business, market, or competitive position
  | "decision-pattern"; // How decisions get made, what criteria matter

export type MemoryConfidence = "high" | "medium" | "low";

export interface MemoryFact {
  id: string;
  category: MemoryCategory;
  content: string;            // The extracted fact or pattern, in plain language
  confidence: MemoryConfidence;
  sourceSessionId?: string;   // Which conversation this was extracted from
  createdAt: string;          // ISO 8601
  updatedAt: string;          // ISO 8601
}
