import type { ISuggestionStorage } from "./ISuggestionStorage";
import type { Suggestion, SuggestionStatus } from "@/lib/types/suggestion";

const STORAGE_KEY = "maya-suggestions";

function readAll(): Suggestion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Suggestion[]) : [];
  } catch {
    return [];
  }
}

function writeAll(items: Suggestion[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota / private browsing errors
  }
}

export class LocalStorageSuggestionAdapter implements ISuggestionStorage {
  async list(): Promise<Suggestion[]> {
    return readAll();
  }

  async save(suggestion: Suggestion): Promise<Suggestion> {
    const all = readAll();
    const idx = all.findIndex((s) => s.id === suggestion.id);
    if (idx >= 0) {
      all[idx] = suggestion;
    } else {
      all.push(suggestion);
    }
    writeAll(all);
    return suggestion;
  }

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((s) => s.id !== id));
  }

  async vote(id: string, userId: string, direction: "up" | "down" | "none"): Promise<Suggestion> {
    const all = readAll();
    const idx = all.findIndex((s) => s.id === id);
    if (idx < 0) throw new Error(`Suggestion ${id} not found`);

    const s = { ...all[idx], votes: { ...all[idx].votes } };
    // Remove any existing vote first
    s.votes.up   = s.votes.up.filter((u) => u !== userId);
    s.votes.down = s.votes.down.filter((u) => u !== userId);
    if (direction === "up")   s.votes.up.push(userId);
    if (direction === "down") s.votes.down.push(userId);
    s.updatedAt = new Date().toISOString();

    all[idx] = s;
    writeAll(all);
    return s;
  }

  async setStatus(id: string, status: SuggestionStatus): Promise<Suggestion> {
    const all = readAll();
    const idx = all.findIndex((s) => s.id === id);
    if (idx < 0) throw new Error(`Suggestion ${id} not found`);
    all[idx] = { ...all[idx], status, updatedAt: new Date().toISOString() };
    writeAll(all);
    return all[idx];
  }
}
