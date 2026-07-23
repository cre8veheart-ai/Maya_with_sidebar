import type { Suggestion, SuggestionStatus } from "@/lib/types/suggestion";

export interface ISuggestionStorage {
  list(): Promise<Suggestion[]>;
  save(suggestion: Suggestion): Promise<Suggestion>;
  remove(id: string): Promise<void>;
  vote(id: string, userId: string, direction: "up" | "down" | "none"): Promise<Suggestion>;
  setStatus(id: string, status: SuggestionStatus): Promise<Suggestion>;
}
