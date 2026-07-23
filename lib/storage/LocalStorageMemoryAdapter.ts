import type { IMemoryStorage } from "./IMemoryStorage";
import type { MemoryFact } from "@/lib/types/memory";

const STORAGE_KEY = "maya-org-memory";

function readAll(): MemoryFact[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MemoryFact[]) : [];
  } catch {
    return [];
  }
}

function writeAll(facts: MemoryFact[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(facts));
  } catch {
    // ignore write errors (storage quota, private browsing)
  }
}

export class LocalStorageMemoryAdapter implements IMemoryStorage {
  async list(): Promise<MemoryFact[]> {
    return readAll();
  }

  async save(fact: MemoryFact): Promise<MemoryFact> {
    const all = readAll();
    const idx = all.findIndex((f) => f.id === fact.id);
    if (idx >= 0) {
      all[idx] = fact;
    } else {
      all.push(fact);
    }
    writeAll(all);
    return fact;
  }

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((f) => f.id !== id));
  }

  async clear(): Promise<void> {
    writeAll([]);
  }
}
