"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DIH_GOVERNANCE_RULES,
  canAssignEvidenceStatus,
  shouldPauseExecutivePasses,
  type DihApprovalRecord,
  type DihEvidenceItem,
  type DihEventRecord,
  type DihExecutivePass,
  type DihSeverity,
} from "../../lib/maya/dih";

const STORAGE_KEY = "maya:dih:event:v1";
const statusStyles: Record<DihEvidenceItem["status"], string> = {
  verified: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  contradicted: "border-red-500/30 bg-red-500/10 text-red-300",
  unverified: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  unknown: "border-slate-500/30 bg-slate-500/10 text-slate-300",
};

function newEvent(): DihEventRecord {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: "MAYA incident",
    createdAt: now,
    updatedAt: now,
    severity: "high",
    state: "intake",
    summary: "",
    evidence: [],
    passes: [],
    approvals: [],
  };
}

export default function DihEventPage() {
  const [eventRecord, setEventRecord] = useState<DihEventRecord | null>(null);
  const [claim, setClaim] = useState("");
  const [source, setSource] = useState("");
  const [observation, setObservation] = useState("");
  const [classifiedBy, setClassifiedBy] = useState("Human operator");
  const [finding, setFinding] = useState("");
  const [findingEvidence, setFindingEvidence] = useState("");
  const [action, setAction] = useState("");
  const [target, setTarget] = useState("");
  const [scope, setScope] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEventRecord(JSON.parse(saved) as DihEventRecord);
        return;
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setEventRecord(newEvent());
  }, []);

  useEffect(() => {
    if (eventRecord) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(eventRecord));
  }, [eventRecord]);

  const updateEvent = (patch: Partial<DihEventRecord>) => {
    setEventRecord((current) =>
      current ? { ...current, ...patch, updatedAt: new Date().toISOString() } : current,
    );
  };

  const contradictions = useMemo(
    () => eventRecord?.evidence.filter((item) => item.status === "contradicted").length ?? 0,
    [eventRecord],
  );
  const loopPaused = eventRecord ? shouldPauseExecutivePasses(eventRecord.passes) : false;
  const round = (eventRecord?.passes.length ?? 0) + 1;

  if (!eventRecord) {
    return <main className="min-h-screen bg-[#11111b] p-8 text-[#cdd6f4]">Loading governed event…</main>;
  }

  const addEvidence = (status: DihEvidenceItem["status"]) => {
    if (!claim.trim() || !classifiedBy.trim()) return;
    if (!canAssignEvidenceStatus(status, source, observation)) return;
    const item: DihEvidenceItem = {
      id: crypto.randomUUID(),
      claim: claim.trim(),
      source: source.trim() || undefined,
      observation: observation.trim() || undefined,
      status,
      classifiedBy: classifiedBy.trim(),
      classifiedAt: new Date().toISOString(),
    };
    updateEvent({ evidence: [...eventRecord.evidence, item], state: "investigating" });
    setClaim("");
    setSource("");
    setObservation("");
  };

  const addPass = (materiallyNew: boolean) => {
    if (materiallyNew && !finding.trim()) return;
    const evidenceIds = findingEvidence
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const pass: DihExecutivePass = {
      id: crypto.randomUUID(),
      executive: "CTO 4",
      round,
      finding: materiallyNew ? finding.trim() : "No materially new finding in this round.",
      evidenceIds,
      materiallyNew,
      confidence: materiallyNew ? 0.72 : 0.5,
      recordedAt: new Date().toISOString(),
    };
    updateEvent({
      passes: [...eventRecord.passes, pass],
      state: materiallyNew ? "investigating" : "paused",
    });
    setFinding("");
    setFindingEvidence("");
  };

  const reopenLoop = () => updateEvent({ state: "investigating" });

  const requestApproval = () => {
    if (!action.trim() || !target.trim() || !scope.trim()) return;
    const approval: DihApprovalRecord = {
      id: crypto.randomUUID(),
      action: action.trim(),
      target: target.trim(),
      scope: scope.trim(),
      requestedAt: new Date().toISOString(),
      requestedBy: "MAYA",
      decision: "pending",
    };
    updateEvent({ approvals: [...eventRecord.approvals, approval] });
    setAction("");
    setTarget("");
    setScope("");
  };

  const decideApproval = (id: string, decision: "approved" | "rejected") => {
    const now = new Date().toISOString();
    updateEvent({
      approvals: eventRecord.approvals.map((approval) =>
        approval.id === id
          ? { ...approval, decision, decidedAt: now, decidedBy: "Human operator" }
          : approval,
      ),
    });
  };

  return (
    <main className="min-h-screen bg-[#11111b] p-4 text-[#cdd6f4] md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[#313244] bg-[#181825] p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f38ba8]">DIH EVENT MAYA</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Governed Incident Mode</h1>
              <p className="mt-2 max-w-2xl text-sm text-[#a6adc8]">
                Claims, observations, executive passes, and human approvals remain separate and auditable.
              </p>
            </div>
            <div className="rounded-xl border border-[#45475a] bg-[#1e1e2e] px-4 py-3 text-sm">
              <div className="text-[#a6adc8]">CTO 4</div>
              <div className={loopPaused ? "font-semibold text-amber-300" : "font-semibold text-[#89b4fa]"}>
                {loopPaused ? "PAUSED · NO MATERIAL CHANGE" : `ACTIVE · Round ${round}`}
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#313244] bg-[#181825] p-5 md:col-span-2">
            <h2 className="font-semibold text-white">1. Event intake</h2>
            <div className="mt-4 grid gap-3">
              <input value={eventRecord.title} onChange={(e) => updateEvent({ title: e.target.value })} className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3" placeholder="Event title" />
              <textarea value={eventRecord.summary} onChange={(e) => updateEvent({ summary: e.target.value })} className="min-h-28 rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3" placeholder="What happened? Keep observation separate from interpretation." />
              <select value={eventRecord.severity} onChange={(e) => updateEvent({ severity: e.target.value as DihSeverity })} className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="rounded-2xl border border-[#313244] bg-[#181825] p-5">
            <h2 className="font-semibold text-white">Event pulse</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-[#a6adc8]">State</dt><dd className="uppercase">{eventRecord.state}</dd></div>
              <div className="flex justify-between"><dt className="text-[#a6adc8]">Severity</dt><dd className="uppercase">{eventRecord.severity}</dd></div>
              <div className="flex justify-between"><dt className="text-[#a6adc8]">Evidence</dt><dd>{eventRecord.evidence.length}</dd></div>
              <div className="flex justify-between"><dt className="text-[#a6adc8]">Contradictions</dt><dd className={contradictions ? "text-red-300" : ""}>{contradictions}</dd></div>
              <div className="flex justify-between"><dt className="text-[#a6adc8]">Pending approvals</dt><dd>{eventRecord.approvals.filter((a) => a.decision === "pending").length}</dd></div>
            </dl>
          </div>
        </section>

        <section className="rounded-2xl border border-[#313244] bg-[#181825] p-5">
          <h2 className="font-semibold text-white">2. Evidence gate</h2>
          <p className="mt-1 text-sm text-[#a6adc8]">VERIFIED and CONTRADICTED require both a source and a recorded observation.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input value={claim} onChange={(e) => setClaim(e.target.value)} className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3" placeholder="Claim" />
            <input value={classifiedBy} onChange={(e) => setClassifiedBy(e.target.value)} className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3" placeholder="Classified by" />
            <input value={source} onChange={(e) => setSource(e.target.value)} className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3" placeholder="Source / screenshot / log" />
            <input value={observation} onChange={(e) => setObservation(e.target.value)} className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3" placeholder="Observed reality" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["verified", "contradicted", "unverified", "unknown"] as const).map((status) => (
              <button key={status} onClick={() => addEvidence(status)} disabled={!claim.trim() || !classifiedBy.trim() || !canAssignEvidenceStatus(status, source, observation)} className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase disabled:cursor-not-allowed disabled:opacity-35 ${statusStyles[status]}`}>Add {status}</button>
            ))}
          </div>
          <div className="mt-5 space-y-2">
            {eventRecord.evidence.length === 0 ? <p className="rounded-xl border border-dashed border-[#45475a] p-4 text-sm text-[#6c7086]">No evidence classified yet.</p> : eventRecord.evidence.map((item) => (
              <div key={item.id} className="rounded-xl border border-[#313244] bg-[#11111b] p-4">
                <div className="flex flex-wrap justify-between gap-3"><p className="font-medium text-white">{item.claim}</p><span className={`rounded-md border px-2 py-1 text-[10px] font-bold uppercase ${statusStyles[item.status]}`}>{item.status}</span></div>
                {item.observation && <p className="mt-2 text-sm text-[#a6adc8]">Observed: {item.observation}</p>}
                <p className="mt-2 text-xs text-[#6c7086]">Source: {item.source || "not supplied"} · {item.classifiedBy} · {new Date(item.classifiedAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#313244] bg-[#181825] p-5">
            <h2 className="font-semibold text-white">3. CTO 4 passes</h2>
            <p className="mt-1 text-sm text-[#a6adc8]">A no-change pass pauses the loop. Only a human may reopen it after new evidence arrives.</p>
            <textarea value={finding} onChange={(e) => setFinding(e.target.value)} disabled={loopPaused} className="mt-4 min-h-24 w-full rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 disabled:opacity-40" placeholder="Actual materially-new finding" />
            <input value={findingEvidence} onChange={(e) => setFindingEvidence(e.target.value)} disabled={loopPaused} className="mt-3 w-full rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 disabled:opacity-40" placeholder="Supporting evidence IDs, comma separated" />
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => addPass(true)} disabled={loopPaused || !finding.trim()} className="rounded-xl bg-[#89b4fa] px-4 py-2 text-sm font-semibold text-[#11111b] disabled:opacity-35">Record new finding</button>
              <button onClick={() => addPass(false)} disabled={loopPaused} className="rounded-xl border border-[#45475a] px-4 py-2 text-sm disabled:opacity-35">No new finding · pause</button>
              {loopPaused && <button onClick={reopenLoop} className="rounded-xl border border-amber-400/40 px-4 py-2 text-sm text-amber-300">Human reopen after new evidence</button>}
            </div>
            <div className="mt-4 space-y-2">{eventRecord.passes.map((pass) => <div key={pass.id} className="rounded-xl border border-[#313244] bg-[#11111b] p-3 text-sm"><div className="flex justify-between"><strong>Round {pass.round}</strong><span className={pass.materiallyNew ? "text-emerald-300" : "text-amber-300"}>{pass.materiallyNew ? "MATERIAL" : "STOPPED"}</span></div><p className="mt-1 text-[#a6adc8]">{pass.finding}</p></div>)}</div>
          </div>

          <div className="rounded-2xl border border-[#313244] bg-[#181825] p-5">
            <h2 className="font-semibold text-white">4. Governance lock</h2>
            <div className="mt-4 space-y-2">{DIH_GOVERNANCE_RULES.map((rule) => <div key={rule} className="flex gap-3 rounded-xl border border-[#313244] bg-[#11111b] p-3 text-sm"><span className="text-[#a6e3a1]">✓</span><span>{rule}</span></div>)}</div>
            <h3 className="mt-5 font-semibold text-white">External-action approval ledger</h3>
            <div className="mt-3 grid gap-2">
              <input value={action} onChange={(e) => setAction(e.target.value)} className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3" placeholder="Exact action" />
              <input value={target} onChange={(e) => setTarget(e.target.value)} className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3" placeholder="Exact target" />
              <input value={scope} onChange={(e) => setScope(e.target.value)} className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3" placeholder="Exact scope" />
              <button onClick={requestApproval} disabled={!action.trim() || !target.trim() || !scope.trim()} className="rounded-xl border border-[#f9e2af]/40 px-4 py-2 text-sm text-[#f9e2af] disabled:opacity-35">Record pending request</button>
            </div>
            <div className="mt-4 space-y-2">{eventRecord.approvals.map((approval) => <div key={approval.id} className="rounded-xl border border-[#313244] bg-[#11111b] p-3 text-sm"><p className="font-medium text-white">{approval.action}</p><p className="mt-1 text-xs text-[#a6adc8]">Target: {approval.target} · Scope: {approval.scope}</p><p className="mt-1 text-xs uppercase text-[#f9e2af]">{approval.decision}</p>{approval.decision === "pending" && <div className="mt-2 flex gap-2"><button onClick={() => decideApproval(approval.id, "approved")} className="rounded-lg bg-emerald-400 px-3 py-1 text-xs font-semibold text-[#11111b]">Human approve</button><button onClick={() => decideApproval(approval.id, "rejected")} className="rounded-lg border border-red-400/40 px-3 py-1 text-xs text-red-300">Reject</button></div>}</div>)}</div>
          </div>
        </section>

        <footer className="rounded-2xl border border-[#313244] bg-[#181825] p-5 text-sm text-[#a6adc8]">
          <strong className="text-white">Persistent local event:</strong> {eventRecord.title} · Updated {new Date(eventRecord.updatedAt).toLocaleString()}
        </footer>
      </div>
    </main>
  );
}
