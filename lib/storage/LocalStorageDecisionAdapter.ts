import type { IDecisionStorage } from "./IDecisionStorage";
import type { Decision } from "@/lib/types/decision";

const STORAGE_KEY = "maya-decisions";

function readAll(): Decision[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Decision[]) : [];
  } catch {
    return [];
  }
}

function writeAll(decisions: Decision[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  } catch {
    // ignore write errors (storage quota, private browsing)
  }
}

export class LocalStorageDecisionAdapter implements IDecisionStorage {
  async list(): Promise<Decision[]> {
    return readAll();
  }

  async get(id: string): Promise<Decision | null> {
    return readAll().find((d) => d.id === id) ?? null;
  }

  async save(decision: Decision): Promise<Decision> {
    const all = readAll();
    const idx = all.findIndex((d) => d.id === decision.id);
    if (idx >= 0) {
      all[idx] = decision;
    } else {
      all.push(decision);
    }
    writeAll(all);
    return decision;
  }

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((d) => d.id !== id));
  }
}
