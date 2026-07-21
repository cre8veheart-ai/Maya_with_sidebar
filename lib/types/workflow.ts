export type WorkflowStatus = "active" | "paused" | "completed" | "archived";

export interface Workflow {
  id: string;
  title: string;
  description?: string;
  status: WorkflowStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
