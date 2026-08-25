export type DihEvidenceStatus = "verified" | "contradicted" | "unverified" | "unknown";

export type DihSeverity = "low" | "medium" | "high" | "critical";
export type DihEventState = "intake" | "investigating" | "paused" | "contained" | "resolved";
export type DihApprovalDecision = "pending" | "approved" | "rejected";

export interface DihEvidenceItem {
  id: string;
  claim: string;
  source?: string;
  observation?: string;
  status: DihEvidenceStatus;
  note?: string;
  classifiedBy: string;
  classifiedAt: string;
}

export interface DihExecutivePass {
  id: string;
  executive: string;
  round: number;
  finding: string;
  evidenceIds: string[];
  materiallyNew: boolean;
  confidence: number;
  recordedAt: string;
}

export interface DihApprovalRecord {
  id: string;
  action: string;
  target: string;
  scope: string;
  requestedAt: string;
  requestedBy: string;
  decision: DihApprovalDecision;
  decidedAt?: string;
  decidedBy?: string;
  rationale?: string;
}

export interface DihEventRecord {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  severity: DihSeverity;
  state: DihEventState;
  summary: string;
  evidence: DihEvidenceItem[];
  passes: DihExecutivePass[];
  approvals: DihApprovalRecord[];
}

export const DIH_GOVERNANCE_RULES = [
  "Build success is not proof of working state.",
  "Bot status claims are evidence only when independently verified.",
  "VERIFIED and CONTRADICTED require a recorded source and observation.",
  "Contradictions remain visible until resolved; they are never silently overwritten.",
  "A no-materially-new pass pauses the loop until a human reopens it with new evidence.",
  "Every external action is denied by default until the exact action, target, and scope receive explicit human approval.",
] as const;

export function canAssignEvidenceStatus(
  status: DihEvidenceStatus,
  source?: string,
  observation?: string,
): boolean {
  if (status === "verified" || status === "contradicted") {
    return Boolean(source?.trim() && observation?.trim());
  }
  return true;
}

export function classifyEvidence(
  claim: string,
  source?: string,
  observation?: string,
  relationship?: "supports" | "contradicts" | "inconclusive",
): DihEvidenceStatus {
  if (!claim.trim()) return "unknown";
  if (!source?.trim() || !observation?.trim()) return "unverified";
  if (relationship === "supports") return "verified";
  if (relationship === "contradicts") return "contradicted";
  return "unknown";
}

export function shouldPauseExecutivePasses(passes: DihExecutivePass[]): boolean {
  return passes.length > 0 && passes[passes.length - 1].materiallyNew === false;
}

export function hasExactHumanApproval(
  approvals: readonly DihApprovalRecord[],
  action: string,
  target: string,
  scope: string,
): boolean {
  return approvals.some(
    (approval) =>
      approval.decision === "approved" &&
      approval.action === action &&
      approval.target === target &&
      approval.scope === scope &&
      Boolean(approval.decidedBy && approval.decidedAt),
  );
}
