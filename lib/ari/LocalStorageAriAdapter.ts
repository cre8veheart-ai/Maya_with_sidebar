import type { IAriStorage, AriSession } from "./types";

const STORAGE_KEY = "maya-ari-sessions";

function readAll(): Record<string, AriSession> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, AriSession>) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, AriSession>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore write errors (private browsing, quota)
  }
}

export class LocalStorageAriAdapter implements IAriStorage {
  async getSession(sessionId: string): Promise<AriSession | null> {
    return readAll()[sessionId] ?? null;
  }

  async saveSession(session: AriSession): Promise<void> {
    const all = readAll();
    all[session.id] = session;
    writeAll(all);
  }

  async listSessions(): Promise<AriSession[]> {
    const all = readAll();
    return Object.values(all).sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt)
    );
  }

  async deleteSession(sessionId: string): Promise<void> {
    const all = readAll();
    delete all[sessionId];
    writeAll(all);
  }
}
