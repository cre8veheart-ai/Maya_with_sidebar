"use client";

import { useMemo, useState } from "react";
import {
  DIH_GOVERNANCE_RULES,
  type DihEvidenceItem,
  type DihExecutivePass,
  type DihSeverity,
} from "../../lib/maya/dih";

const statusStyles: Record<DihEvidenceItem["status"], string> = {
  verified: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  contradicted: "border-red-500/30 bg-red-500/10 text-red-300",
  unverified: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  unknown: "border-slate-500/30 bg-slate-500/10 text-slate-300",
};

export default function DihEventPage() {
  const [title, setTitle] = useState("MAYA incident");
  const [summary, setSummary] = useState("");
  const [severity, setSeverity] = useState<DihSeverity>("high");
  const [claim, setClaim] = useState("");
  const [source, setSource] = useState("");
  const [evidence, setEvidence] = useState<DihEvidenceItem[]>([]);
  const [passes, setPasses] = useState<DihExecutivePass[]>([]);
  const [round, setRound] = useState(1);

  const contradictions = useMemo(
    () => evidence.filter((item) => item.status === "contradicted").length,
    [evidence],
  );

  const addEvidence = (status: DihEvidenceItem["status"]) => {
    if (!claim.trim()) return;
    setEvidence((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        claim: claim.trim(),
        source: source.trim() || undefined,
        status,
      },
    ]);
    setClaim("");
    setSource("");
  };

  const addPass = (materiallyNew: boolean) => {
    setPasses((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        executive: "CTO 4",
        round,
        finding: materiallyNew
          ? "New technical or governance finding recorded for this round."
          : "No materially new finding in this round.",
        materiallyNew,
        confidence: materiallyNew ? 0.72 : 0.5,
      },
    ]);
    setRound((value) => value + 1);
  };

  return (
    <main className="min-h-screen bg-[#11111b] text-[#cdd6f4] p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[#313244] bg-[#181825] p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f38ba8]">
                DIH EVENT MAYA
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Governed Incident Mode</h1>
              <p className="mt-2 max-w-2xl text-sm text-[#a6adc8]">
                Claims do not become facts because a build passed or an agent said so. DIH keeps
                evidence, contradictions, executive reasoning, and human approval separate.
              </p>
            </div>
            <div className="rounded-xl border border-[#45475a] bg-[#1e1e2e] px-4 py-3 text-sm">
              <div className="text-[#a6adc8]">CTO 4</div>
              <div className="font-semibold text-[#89b4fa]">ACTIVE · Round {round}</div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 rounded-2xl border border-[#313244] bg-[#181825] p-5">
            <h2 className="font-semibold text-white">1. Event intake</h2>
            <div className="mt-4 grid gap-3">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 outline-none focus:border-[#89b4fa]"
                placeholder="Event title"
              />
              <textarea
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                className="min-h-28 rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 outline-none focus:border-[#89b4fa]"
                placeholder="What happened? Keep observation separate from interpretation."
              />
              <select
                value={severity}
                onChange={(event) => setSeverity(event.target.value as DihSeverity)}
                className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-[#313244] bg-[#181825] p-5">
            <h2 className="font-semibold text-white">Event pulse</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-[#a6adc8]">Severity</dt><dd className="uppercase">{severity}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#a6adc8]">Evidence</dt><dd>{evidence.length}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#a6adc8]">Contradictions</dt><dd className={contradictions ? "text-red-300" : ""}>{contradictions}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#a6adc8]">CTO passes</dt><dd>{passes.length}</dd></div>
            </dl>
          </div>
        </section>

        <section className="rounded-2xl border border-[#313244] bg-[#181825] p-5">
          <h2 className="font-semibold text-white">2. Evidence gate</h2>
          <p className="mt-1 text-sm text-[#a6adc8]">Classify first. Interpret second.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_0.55fr]">
            <input
              value={claim}
              onChange={(event) => setClaim(event.target.value)}
              className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 outline-none focus:border-[#89b4fa]"
              placeholder='Claim or observation, e.g. "production fully functional"'
            />
            <input
              value={source}
              onChange={(event) => setSource(event.target.value)}
              className="rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 outline-none focus:border-[#89b4fa]"
              placeholder="Source / screenshot / log"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["verified", "contradicted", "unverified", "unknown"] as const).map((status) => (
              <button
                key={status}
                onClick={() => addEvidence(status)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase ${statusStyles[status]}`}
              >
                Add {status}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-2">
            {evidence.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[#45475a] p-4 text-sm text-[#6c7086]">No evidence classified yet.</p>
            ) : (
              evidence.map((item) => (
                <div key={item.id} className="rounded-xl border border-[#313244] bg-[#11111b] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="font-medium text-white">{item.claim}</p>
                    <span className={`rounded-md border px-2 py-1 text-[10px] font-bold uppercase ${statusStyles[item.status]}`}>{item.status}</span>
                  </div>
                  {item.source && <p className="mt-2 text-xs text-[#6c7086]">Source: {item.source}</p>}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#313244] bg-[#181825] p-5">
            <h2 className="font-semibold text-white">3. CTO 4 passes</h2>
            <p className="mt-1 text-sm text-[#a6adc8]">Continue as long as the pass produces materially new information.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => addPass(true)} className="rounded-xl bg-[#89b4fa] px-4 py-2 text-sm font-semibold text-[#11111b]">Record new finding</button>
              <button onClick={() => addPass(false)} className="rounded-xl border border-[#45475a] px-4 py-2 text-sm">No new finding</button>
            </div>
            <div className="mt-4 space-y-2">
              {passes.map((pass) => (
                <div key={pass.id} className="rounded-xl border border-[#313244] bg-[#11111b] p-3 text-sm">
                  <div className="flex justify-between gap-3"><strong>Round {pass.round}</strong><span className={pass.materiallyNew ? "text-emerald-300" : "text-[#6c7086]"}>{pass.materiallyNew ? "MATERIAL" : "NO CHANGE"}</span></div>
                  <p className="mt-1 text-[#a6adc8]">{pass.finding}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#313244] bg-[#181825] p-5">
            <h2 className="font-semibold text-white">4. Governance lock</h2>
            <div className="mt-4 space-y-3">
              {DIH_GOVERNANCE_RULES.map((rule) => (
                <div key={rule} className="flex gap-3 rounded-xl border border-[#313244] bg-[#11111b] p-3 text-sm">
                  <span className="text-[#a6e3a1]">✓</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-[#f9e2af]/30 bg-[#f9e2af]/10 p-4 text-sm text-[#f9e2af]">
              Human approval required before any external action, deploy, merge, credential change, deletion, or notification.
            </div>
          </div>
        </section>

        <footer className="rounded-2xl border border-[#313244] bg-[#181825] p-5 text-sm text-[#a6adc8]">
          <strong className="text-white">Current event:</strong> {title || "Untitled"}
          {summary && <span> · {summary}</span>}
        </footer>
      </div>
    </main>
  );
}
