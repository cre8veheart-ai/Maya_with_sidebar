import type { ExecRole, RoleLens } from "./types";
import { roleBaselines } from "./roleBaselines";

export interface ExecProfile {
  name: string;
  title: string;
  company: string;
  industry: string;
}

/**
 * Assembles the full system prompt for a given exec role.
 * Layer 1 (baseline) — the role's hardcoded thinking DNA.
 * Layer 2 (profile) — executive's personal + org context when available.
 * Layer 3 (overrides) — org-specific entries stored through use.
 */
export function buildExecSystemPrompt(lens: RoleLens, profile?: ExecProfile | null): string {
  const baseline = roleBaselines[lens.role];
  const parts: string[] = [baseline];

  if (profile?.name) {
    parts.push(
      `\nEXECUTIVE CONTEXT:\nYou are assisting ${profile.name}, ${profile.title} at ${profile.company} (${profile.industry} industry). Address them by first name when natural. Frame all responses through their specific role and industry context.`
    );
  }

  if (lens.overrides.length > 0) {
    const overrideBlock = lens.overrides
      .map((o) => `- ${o.key}: ${o.value}`)
      .join("\n");
    parts.push(`\nORG-SPECIFIC OVERRIDES (trained by this executive):\n${overrideBlock}`);
  }

  return parts.join("\n");
}

/**
 * Returns a fresh lens for a role with no overrides.
 */
export function createFreshLens(role: ExecRole): RoleLens {
  return { role, overrides: [] };
}
