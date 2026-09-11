"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Stage = "specification" | "implementation" | "verification" | "approval" | "release";

interface WorkPackage {
  id: string;
  title: string;
  objective: string;
  stage: Stage;
  evidence: Record<string, boolean>;
  createdAt: string;
  actionLog: ActionLogEntry[];
}

interface ActionLogEntry {
  id: string;
  at: string;
  author: string;
  action: "create" | "evidence" | "advance";
  detail: string;
}

const STORAGE_KEY = "maya.cto.work-packages.v1";

const STAGES: Array<{ id: Stage; label: string }> = [
  { id: "specification", label: "Specification" },
  { id: "implementation", label: "Implementation" },
  { id: "verification", label: "Verification" },
  { id: "approval", label: "CTO Gate" },
  { id: "release", label: "Release Ready" },
];

const EVIDENCE = [
  "Scope and acceptance criteria defined",
  "Build and lint checks passed",
  "Automated tests passed",
  "Security boundaries reviewed",
  "Rollback path recorded",
];
const DEFAULT_ACTION_AUTHOR = "Copilot";

function makeEvidence(): Record<string, boolean> {
  return Object.fromEntries(EVIDENCE.map((item) => [item, false]));
}

function canAdvance(item: WorkPackage) {
  return item.stage !== "release";
}

function cleanAuthor(value: string) {
  const cleaned = value.trim().replace(/[\x00-\x1f\x7f]/g, " ");
  return cleaned ? cleaned.slice(0, 60) : DEFAULT_ACTION_AUTHOR;
}

function createAction(
  author: string,
  action: ActionLogEntry["action"],
  detail: string,
): ActionLogEntry {
  return {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    author,
    action,
    detail,
  };
}

function withAction(
  item: WorkPackage,
  author: string,
  action: ActionLogEntry["action"],
  detail: string,
): WorkPackage {
  return {
    ...item,
    actionLog: [createAction(author, action, detail), ...item.actionLog].slice(0, 20),
  };
}

function formatActionAt(iso: string): string {
  const value = new Date(iso);
  return Number.isNaN(value.valueOf()) ? iso : value.toLocaleString();
}

function normalizeActionLog(raw: unknown): ActionLogEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => {
      const value = entry as Record<string, unknown>;
      return {
        id: typeof value.id === "string" ? value.id : crypto.randomUUID(),
        at: typeof value.at === "string" ? value.at : new Date().toISOString(),
        author: cleanAuthor(typeof value.author === "string" ? value.author : DEFAULT_ACTION_AUTHOR),
        action: value.action === "create" || value.action === "evidence" || value.action === "advance"
          ? value.action
          : "create",
        detail: typeof value.detail === "string" ? value.detail : "Recovered action",
      };
    })
    .slice(0, 20);
}

function normalizePackages(raw: unknown): WorkPackage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const value = item as Record<string, unknown>;
      return {
        id: typeof value.id === "string" ? value.id : crypto.randomUUID(),
        title: typeof value.title === "string" ? value.title : "Untitled",
        objective: typeof value.objective === "string" ? value.objective : "",
        stage: value.stage === "specification" || value.stage === "implementation" || value.stage === "verification" || value.stage === "approval" || value.stage === "release"
          ? value.stage
          : "specification",
        evidence: typeof value.evidence === "object" && value.evidence
          ? { ...makeEvidence(), ...(value.evidence as Record<string, boolean>) }
          : makeEvidence(),
        createdAt: typeof value.createdAt === "string" ? value.createdAt : new Date().toISOString(),
        actionLog: normalizeActionLog(value.actionLog),
      };
    })
    .filter((item) => item.title.trim() && item.objective.trim());
}

export default function CtoWorkflow() {
  const [items, setItems] = useState<WorkPackage[]>([]);
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [actionAuthor, setActionAuthor] = useState(DEFAULT_ACTION_AUTHOR);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(normalizePackages(JSON.parse(stored)));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const summary = useMemo(
    () =>
      STAGES.map((stage) => ({
        ...stage,
        count: items.filter((item) => item.stage === stage.id).length,
      })),
    [items]
  );

  function createPackage(event: FormEvent) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanObjective = objective.trim();
    const author = cleanAuthor(actionAuthor);
    if (!cleanTitle || !cleanObjective) return;

    setItems((current) => [
      withAction({
        id: crypto.randomUUID(),
        title: cleanTitle,
        objective: cleanObjective,
        stage: "specification",
        evidence: makeEvidence(),
        createdAt: new Date().toISOString(),
        actionLog: [],
      }, author, "create", "Work package created"),
      ...current,
    ]);
    setTitle("");
    setObjective("");
  }

  function toggleEvidence(id: string, evidence: string) {
    const author = cleanAuthor(actionAuthor);
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? withAction(
              {
                ...item,
                evidence: { ...item.evidence, [evidence]: !item.evidence[evidence] },
              },
              author,
              "evidence",
              `${evidence}: ${item.evidence[evidence] ? "unchecked" : "checked"}`,
            )
          : item
      )
    );
  }

  function advance(id: string) {
    const author = cleanAuthor(actionAuthor);
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id || !canAdvance(item)) return item;
        const index = STAGES.findIndex((stage) => stage.id === item.stage);
        if (index < 0 || index === STAGES.length - 1) return item;
        const nextStage = STAGES[index + 1];
        return withAction(
          { ...item, stage: nextStage.id },
          author,
          "advance",
          `Advanced to ${nextStage.label}`,
        );
      })
    );
  }

  function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <section className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">
            CTO Delivery Command Center
          </h2>
          <p className="mt-1 text-[12px] text-[#a6adc8]">
            Copilot Ari override is active for all CTO workflow actions.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-[#45475a] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#89b4fa]">
          {items.length} active
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1 mb-5" aria-label="Workflow stage counts">
        {summary.map((stage) => (
          <div key={stage.id} className="rounded-lg bg-[#181825] px-2 py-2 text-center">
            <p className="text-base font-bold text-[#cdd6f4]">{stage.count}</p>
            <p className="text-[9px] leading-tight text-[#6c7086]">{stage.label}</p>
          </div>
        ))}
      </div>

      <form onSubmit={createPackage} className="space-y-2 mb-5">
        <input
          value={actionAuthor}
          onChange={(event) => setActionAuthor(event.target.value)}
          placeholder="Action author (default Copilot)"
          className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[12px] text-[#cdd6f4] placeholder:text-[#6c7086] focus:border-[#89b4fa] focus:outline-none"
        />
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Work package title"
          className="w-full rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[12px] text-[#cdd6f4] placeholder:text-[#6c7086] focus:border-[#89b4fa] focus:outline-none"
        />
        <textarea
          value={objective}
          onChange={(event) => setObjective(event.target.value)}
          placeholder="Objective and definition of done"
          rows={2}
          className="w-full resize-none rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[12px] text-[#cdd6f4] placeholder:text-[#6c7086] focus:border-[#89b4fa] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!title.trim() || !objective.trim()}
          className="w-full rounded-lg bg-[#89b4fa] px-3 py-2 text-[11px] font-bold text-[#1e1e2e] transition-colors hover:bg-[#b4d0fb] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Create controlled work package
        </button>
      </form>

      <div className="space-y-3">
        {ready && items.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#45475a] px-4 py-6 text-center">
            <p className="text-[12px] text-[#6c7086]">No controlled work packages yet.</p>
          </div>
        )}

        {items.map((item) => {
          const stageIndex = STAGES.findIndex((stage) => stage.id === item.stage);
          const released = item.stage === "release";

          return (
            <article key={item.id} className="rounded-lg border border-[#313244] bg-[#181825] p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[#cdd6f4]">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#a6adc8]">{item.objective}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.title}`}
                  className="text-[11px] text-[#6c7086] hover:text-[#f38ba8]"
                >
                  Remove
                </button>
              </div>

              <div className="my-3 flex gap-1" aria-label={`Current stage: ${STAGES[stageIndex]?.label}`}>
                {STAGES.map((stage, index) => (
                  <span
                    key={stage.id}
                    title={stage.label}
                    className={`h-1.5 flex-1 rounded-full ${
                      index <= stageIndex ? "bg-[#89b4fa]" : "bg-[#313244]"
                    }`}
                  />
                ))}
              </div>

              <div className="space-y-1.5">
                {EVIDENCE.map((evidence) => (
                  <label key={evidence} className="flex cursor-pointer items-start gap-2 text-[10px] text-[#a6adc8]">
                    <input
                      type="checkbox"
                      checked={Boolean(item.evidence[evidence])}
                      onChange={() => toggleEvidence(item.id, evidence)}
                      className="mt-0.5 accent-[#a6e3a1]"
                    />
                    <span>{evidence}</span>
                  </label>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#313244] pt-3">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${released ? "text-[#a6e3a1]" : "text-[#89b4fa]"}`}>
                  {released
                    ? "Release ready"
                    : "Copilot override active"}
                </span>
                {!released && (
                  <button
                    type="button"
                    onClick={() => advance(item.id)}
                    className="rounded-md border border-[#45475a] px-2.5 py-1 text-[10px] font-semibold text-[#cdd6f4] hover:border-[#89b4fa] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Advance (override)
                  </button>
                )}
              </div>

              <div className="mt-3 border-t border-[#313244] pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6c7086]">Truth trail</p>
                <ul className="mt-2 space-y-1.5">
                  {item.actionLog.slice(0, 6).map((entry) => (
                    <li key={entry.id} className="text-[10px] text-[#a6adc8]">
                      <span className="text-[#89b4fa]">{entry.author}</span>
                      {" · "}
                      <span>{entry.detail}</span>
                      {" · "}
                      <span className="text-[#6c7086]">{formatActionAt(entry.at)}</span>
                    </li>
                  ))}
                  {item.actionLog.length === 0 && (
                    <li className="text-[10px] text-[#6c7086]">No actions recorded yet.</li>
                  )}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
