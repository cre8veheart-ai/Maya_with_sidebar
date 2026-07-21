import type { Workflow } from "@/lib/types/workflow";

export interface IWorkflowStorage {
  list(): Promise<Workflow[]>;
  get(id: string): Promise<Workflow | null>;
  save(workflow: Workflow): Promise<Workflow>;
  remove(id: string): Promise<void>;
}
