export type DihEvidenceStatus = "verified" | "contradicted" | "unverified" | "unknown";

export type DihSeverity = "low" | "medium" | "high" | "critical";

export interface DihEvidenceItem {
  id: string;
  claim: string;
  source?: string;
  status: DihEvidenceStatus;
  note?: string;
}

export interface DihExecutivePass {
  id: string;
  executive: string;
  round: number;
  finding: string;
  materiallyNew: boolean;
  confidence: number;
}

export interface DihEventRecord {
  id: string;
  title: string;
  createdAt: string;
  severity: DihSeverity;
  state: "intake" | "investigating" | "contained" | "resolved";
  summary: string;
  evidence: DihEvidenceItem[];
  passes: DihExecutivePass[];
}

export const DIH_GOVERNANCE_RULES = [
  "Build success is not proof of working state.",
  "Bot status claims are evidence only when independently verified.",
  "Contradictions remain visible until resolved; they are never silently overwritten.",
  "Executive passes continue only while they produce materially new information.",
  "No external action leaves MAYA without explicit human approval.",
] as const;

export function classifyEvidence(
  claim: string,
  observedReality?: string,
): DihEvidenceStatus {
  if (!claim.trim()) return "unknown";
  if (!observedReality?.trim()) return "unverified";

  const normalizedClaim = claim.trim().toLowerCase();
  const normalizedReality = observedReality.trim().toLowerCase();

  if (normalizedClaim === normalizedReality) return "verified";
  return "contradicted";
}

export function hasMateriallyNewPasses(passes: DihExecutivePass[]): boolean {
  return passes.some((pass) => pass.materiallyNew);
}
