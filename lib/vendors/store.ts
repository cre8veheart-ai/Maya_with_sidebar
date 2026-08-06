/**
 * Vendor list storage — localStorage for beta, Vercel KV post-beta.
 * Lists are stored client-side; activated lists are injected as context in exec lenses.
 */

import type { VendorList, Vendor } from "./types";

const STORAGE_KEY = "maya_vendor_lists";

export function loadVendorLists(): VendorList[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VendorList[]) : [];
  } catch {
    return [];
  }
}

export function saveVendorLists(lists: VendorList[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

export function getActivatedVendorContext(): string {
  const lists = loadVendorLists().filter((l) => l.activated);
  if (lists.length === 0) return "";
  const lines: string[] = ["ACTIVATED VENDOR LISTS (exec's current vendor context):"];
  for (const list of lists) {
    lines.push(`\n[${list.name}] — ${list.category}`);
    for (const v of list.vendors.filter((v) => v.status === "active")) {
      lines.push(`  • ${v.name} (${v.company}) — ${v.type}, ${v.category}${v.rate ? `, ${v.rate}` : ""}${v.notes ? ` — ${v.notes}` : ""}`);
    }
  }
  return lines.join("\n");
}

export function createVendorList(name: string, description: string, category: string): VendorList {
  const now = new Date().toISOString();
  return {
    id: Math.random().toString(36).slice(2),
    name,
    description,
    category,
    vendors: [],
    activated: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function createVendor(data: Omit<Vendor, "id" | "createdAt" | "updatedAt">): Vendor {
  const now = new Date().toISOString();
  return { ...data, id: Math.random().toString(36).slice(2), createdAt: now, updatedAt: now };
}
