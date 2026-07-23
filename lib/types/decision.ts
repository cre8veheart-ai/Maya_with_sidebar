export type DecisionStatus = "open" | "decided" | "archived";

export interface Decision {
  id: string;
  title: string;
  context?: string;
  rationale?: string;
  outcome?: string;
  status: DecisionStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
