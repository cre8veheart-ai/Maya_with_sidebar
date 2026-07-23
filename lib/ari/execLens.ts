import type { ExecRole, RoleLens } from "./types";
import { roleBaselines } from "./roleBaselines";

/**
 * Assembles the full system prompt for a given exec role.
 * Layer 1 (baseline) is always present — the role's hardcoded thinking DNA.
 * Layer 2 (overrides) are org-specific entries the executive has stored through use.
 */
export function buildExecSystemPrompt(lens: RoleLens): string {
  const baseline = roleBaselines[lens.role];

  if (lens.overrides.length === 0) {
    return baseline;
  }

  const overrideBlock = lens.overrides
    .map((o) => `- ${o.key}: ${o.value}`)
    .join("\n");

  return `${baseline}

ORG-SPECIFIC OVERRIDES (trained by this executive):
${overrideBlock}`;
}

/**
 * Returns a fresh lens for a role with no overrides.
 * Used on first activation before any org context has been stored.
 */
export function createFreshLens(role: ExecRole): RoleLens {
  return { role, overrides: [] };
}
