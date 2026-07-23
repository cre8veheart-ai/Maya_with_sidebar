import type { ICampaignStorage } from "./ICampaignStorage";
import type { Campaign } from "@/lib/types/campaign";

const STORAGE_KEY = "maya-campaigns";

function readAll(): Campaign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Campaign[]) : [];
  } catch {
    return [];
  }
}

function writeAll(campaigns: Campaign[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  } catch {
    // ignore write errors (storage quota, private browsing)
  }
}

export class LocalStorageCampaignAdapter implements ICampaignStorage {
  async list(): Promise<Campaign[]> {
    return readAll();
  }

  async get(id: string): Promise<Campaign | null> {
    return readAll().find((c) => c.id === id) ?? null;
  }

  async save(campaign: Campaign): Promise<Campaign> {
    const all = readAll();
    const idx = all.findIndex((c) => c.id === campaign.id);
    if (idx >= 0) {
      all[idx] = campaign;
    } else {
      all.push(campaign);
    }
    writeAll(all);
    return campaign;
  }

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((c) => c.id !== id));
  }
}
