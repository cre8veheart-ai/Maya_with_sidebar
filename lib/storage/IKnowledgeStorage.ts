import type { KnowledgeEntry } from "@/lib/types/knowledge";

export interface IKnowledgeStorage {
  list(): Promise<KnowledgeEntry[]>;
  get(id: string): Promise<KnowledgeEntry | null>;
  save(entry: KnowledgeEntry): Promise<KnowledgeEntry>;
  remove(id: string): Promise<void>;
}
