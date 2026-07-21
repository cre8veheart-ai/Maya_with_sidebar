export type WorkflowStatus = "active" | "paused" | "completed" | "archived";

export type PhaseStatus = "pending" | "in-progress" | "complete";

export interface WorkflowPhase {
  id: string;
  name: string;
  status: PhaseStatus;
  dueDate?: string; // ISO 8601 date (YYYY-MM-DD)
}

export const DEFAULT_PHASES: Omit<WorkflowPhase, "id">[] = [
  { name: "Pre-Production", status: "pending" },
  { name: "Production", status: "pending" },
  { name: "Post-Production", status: "pending" },
  { name: "Delivery", status: "pending" },
];

export interface Workflow {
  id: string;
  title: string;
  description?: string;
  status: WorkflowStatus;
  phases?: WorkflowPhase[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
