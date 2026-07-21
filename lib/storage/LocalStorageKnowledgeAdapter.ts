import type { IKnowledgeStorage } from "./IKnowledgeStorage";
import type { KnowledgeEntry } from "@/lib/types/knowledge";

const STORAGE_KEY = "maya-knowledge";

function readAll(): KnowledgeEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as KnowledgeEntry[]) : [];
  } catch {
    return [];
  }
}

function writeAll(entries: KnowledgeEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore write errors (storage quota, private browsing)
  }
}

export class LocalStorageKnowledgeAdapter implements IKnowledgeStorage {
  async list(): Promise<KnowledgeEntry[]> {
    return readAll();
  }

  async get(id: string): Promise<KnowledgeEntry | null> {
    return readAll().find((e) => e.id === id) ?? null;
  }

  async save(entry: KnowledgeEntry): Promise<KnowledgeEntry> {
    const all = readAll();
    const idx = all.findIndex((e) => e.id === entry.id);
    if (idx >= 0) {
      all[idx] = entry;
    } else {
      all.push(entry);
    }
    writeAll(all);
    return entry;
  }

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((e) => e.id !== id));
  }
}
