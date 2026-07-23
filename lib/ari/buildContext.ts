// ── buildContext ──────────────────────────────────────────────────────────────
// Assembles Knowledge Vault entries, logged Decisions, and extracted OrgMemory
// facts into a single context string for injection into the MAYA system prompt.
// Runs client-side before each API call so the model always has the latest state.

import type { KnowledgeEntry } from "@/lib/types/knowledge";
import type { Decision } from "@/lib/types/decision";
import type { MemoryFact } from "@/lib/types/memory";

export function buildContext(
  knowledge: KnowledgeEntry[],
  decisions: Decision[],
  memory: MemoryFact[]
): string {
  const parts: string[] = [];

  // ── Knowledge Vault ──────────────────────────────────────────────────────
  if (knowledge.length > 0) {
    const lines = knowledge.map(
      (e) => `[${e.category}] ${e.title}: ${e.content}`
    );
    parts.push(`### Knowledge Vault\n${lines.join("\n")}`);
  }

  // ── Decisions ────────────────────────────────────────────────────────────
  const activeDecisions = decisions.filter(
    (d) => d.status === "open" || d.status === "decided"
  );
  if (activeDecisions.length > 0) {
    const lines = activeDecisions.map((d) => {
      const parts = [`[${d.status}] ${d.title}`];
      if (d.context) parts.push(`Context: ${d.context}`);
      if (d.rationale) parts.push(`Rationale: ${d.rationale}`);
      if (d.outcome) parts.push(`Outcome: ${d.outcome}`);
      return parts.join(" | ");
    });
    parts.push(`### Decisions\n${lines.join("\n")}`);
  }

  // ── Org Memory ───────────────────────────────────────────────────────────
  // These are facts MAYA has extracted from past conversations — the adaptive
  // layer that makes the intelligence compound over time.
  if (memory.length > 0) {
    const lines = memory.map(
      (f) => `[${f.category}] ${f.content}`
    );
    parts.push(`### What Maya has learned about this org\n${lines.join("\n")}`);
  }

  return parts.join("\n\n");
}
