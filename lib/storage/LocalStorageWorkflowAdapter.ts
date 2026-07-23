import type { IWorkflowStorage } from "./IWorkflowStorage";
import type { Workflow } from "@/lib/types/workflow";

const STORAGE_KEY = "maya-workflows";

function readAll(): Workflow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Workflow[]) : [];
  } catch {
    return [];
  }
}

function writeAll(workflows: Workflow[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
  } catch {
    // ignore write errors (storage quota, private browsing)
  }
}

export class LocalStorageWorkflowAdapter implements IWorkflowStorage {
  async list(): Promise<Workflow[]> {
    return readAll();
  }

  async get(id: string): Promise<Workflow | null> {
    return readAll().find((w) => w.id === id) ?? null;
  }

  async save(workflow: Workflow): Promise<Workflow> {
    const all = readAll();
    const idx = all.findIndex((w) => w.id === workflow.id);
    if (idx >= 0) {
      all[idx] = workflow;
    } else {
      all.push(workflow);
    }
    writeAll(all);
    return workflow;
  }

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((w) => w.id !== id));
  }
}
