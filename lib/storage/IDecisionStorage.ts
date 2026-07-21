import type { Decision } from "@/lib/types/decision";

export interface IDecisionStorage {
  list(): Promise<Decision[]>;
  get(id: string): Promise<Decision | null>;
  save(decision: Decision): Promise<Decision>;
  remove(id: string): Promise<void>;
}
