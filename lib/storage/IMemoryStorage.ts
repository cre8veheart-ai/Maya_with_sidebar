import type { MemoryFact } from "@/lib/types/memory";

export interface IMemoryStorage {
  list(): Promise<MemoryFact[]>;
  save(fact: MemoryFact): Promise<MemoryFact>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}
