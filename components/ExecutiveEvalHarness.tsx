"use client";

import { useEffect, useMemo, useState } from "react";
import { executiveRegistry } from "@/lib/maya/executives/registry";
import {
  EXECUTIVE_EVAL_STORAGE_KEY,
  summarizeExecutiveEvals,
  type ExecutiveEvalOutcome,
  type ExecutiveEvalRecord,
} from "@/lib/maya/executives/evaluation";

const outcomes: ExecutiveEvalOutcome[] = ["pass", "partial", "fail", "blocked"];

export default function ExecutiveEvalHarness() {
  const [moduleId, setModuleId] = useState(executiveRegistry[0]?.id ?? "");
  const activeModule = executiveRegistry.find((module) => module.id === moduleId) ?? executiveRegistry[0];
  const [testId, setTestId] = useState(activeModule?.stressTests[0]?.id ?? "");
  const [outcome, setOutcome] = useState<ExecutiveEvalOutcome>("pass");
  const [confidence, setConfidence] = useState(0.7);
  const [evidence, setEvidence] = useState("");
  const [notes, setNotes] = useState("");
  const [records, setRecords] = useState<ExecutiveEvalRecord[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(EXECUTIVE_EVAL_STORAGE_KEY);
    if (!stored) return;
    try {
      setRecords(JSON.parse(stored) as ExecutiveEvalRecord[]);
    } catch {
      window.localStorage.removeItem(EXECUTIVE_EVAL_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!activeModule) return;
    setTestId(activeModule.stressTests[0]?.id ?? "");
  }, [moduleId, activeModule]);

  const activeRecords = useMemo(
    () => records.filter((record) => record.moduleId === activeModule?.id),
    [records, activeModule],
  );
  const summary = useMemo(() => summarizeExecutiveEvals(activeRecords), [activeRecords]);

  const saveRecords = (next: ExecutiveEvalRecord[]) => {
    setRecords(next);
    window.localStorage.setItem(EXECUTIVE_EVAL_STORAGE_KEY, JSON.stringify(next));
  };

  const recordRun = () => {
    if (!activeModule || !testId || !evidence.trim()) return;
    const record: ExecutiveEvalRecord = {
      id: crypto.randomUUID(),
      moduleId: activeModule.id,
      testId,
      outcome,
      confidence,
      evidence: evidence.trim(),
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    saveRecords([record, ...records]);
    setEvidence("");
    setNotes("");
  };

  if (!activeModule) return null;

  return (
    <section className="rounded-2xl border border-[#313244] bg-[#1e1e2e] p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">Evaluation harness</p>
          <h2 className="mt-1 text-lg font-semibold text-[#cdd6f4]">Run → observe → score → patch → rerun</h2>
        </div>
        <div className="text-right text-xs text-[#a6adc8]">
          <div>{summary.score}% evidence-weighted score</div>
          <div className={summary.promotionReady ? "text-[#a6e3a1]" : "text-[#f9e2af]"}>
            {summary.promotionReady ? "Promotion candidate" : "Stay on workbench"}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <select value={moduleId} onChange={(event) => setModuleId(event.target.value)} className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 text-sm">
          {executiveRegistry.map((module) => <option key={module.id} value={module.id}>{module.displayName}</option>)}
        </select>
        <select value={testId} onChange={(event) => setTestId(event.target.value)} className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 text-sm">
          {activeModule.stressTests.map((test) => <option key={test.id} value={test.id}>{test.name}</option>)}
        </select>
        <select value={outcome} onChange={(event) => setOutcome(event.target.value as ExecutiveEvalOutcome)} className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 text-sm">
          {outcomes.map((value) => <option key={value} value={value}>{value.toUpperCase()}</option>)}
        </select>
        <label className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 text-xs text-[#a6adc8]">
          Confidence {Math.round(confidence * 100)}%
          <input type="range" min="0" max="1" step="0.05" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))} className="mt-2 w-full" />
        </label>
      </div>

      <textarea value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder="Evidence observed — quote the behavior, log, rendered state, or contradiction." className="mt-3 min-h-24 w-full rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 text-sm" />
      <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What did we learn? What should be patched or challenged next?" className="mt-3 min-h-20 w-full rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 text-sm" />
      <button onClick={recordRun} disabled={!evidence.trim()} className="mt-3 rounded-xl bg-[#89b4fa] px-4 py-2 text-sm font-semibold text-[#11111b] disabled:opacity-40">Record evaluation</button>

      <div className="mt-5 grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
        {([['Total', summary.total], ['Pass', summary.pass], ['Partial', summary.partial], ['Fail', summary.fail], ['Blocked', summary.blocked]] as const).map(([label, value]) => (
          <div key={label} className="rounded-lg bg-[#11111b] p-3"><div className="text-[#6c7086]">{label}</div><div className="mt-1 text-lg font-semibold text-white">{value}</div></div>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        {activeRecords.slice(0, 8).map((record) => (
          <div key={record.id} className="rounded-xl border border-[#313244] bg-[#11111b] p-4 text-xs">
            <div className="flex flex-wrap justify-between gap-2"><strong className="text-white">{record.testId}</strong><span className="uppercase text-[#a6adc8]">{record.outcome} · {Math.round(record.confidence * 100)}%</span></div>
            <p className="mt-2 text-[#cdd6f4]">{record.evidence}</p>
            {record.notes && <p className="mt-2 text-[#6c7086]">Learning: {record.notes}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
