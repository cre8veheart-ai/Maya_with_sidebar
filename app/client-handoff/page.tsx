"use client";

import { useEffect, useMemo, useState } from "react";
import PageShell from "@/components/PageShell";
import { getRoleLabel } from "@/lib/maya/execRouting";
import { loadSavedSessions, type MayaSessionRecord } from "@/lib/maya/libraryData";

const HANDOFF_KEY = "maya_client_handoffs_v1";

interface ClientHandoff {
  id: string;
  clientName: string;
  engagement: string;
  sessionId: string;
  recommendations: string;
  nextActions: string;
  includeTranscript: boolean;
  privateNotes: string;
  approvedAt: string;
  deliveredAt?: string;
}

function formatHandoff(handoff: ClientHandoff, session?: MayaSessionRecord) {
  const role = session?.role === "strategy-room" ? "Strategy Room" : session ? getRoleLabel(session.role) : "MAYA";
  const lines = [
    `# Client Brief: ${handoff.clientName}`,
    "",
    `**Engagement:** ${handoff.engagement || "Consulting engagement"}`,
    `**Prepared with:** ${role}`,
    `**Approved:** ${new Date(handoff.approvedAt).toLocaleString()}`,
    handoff.deliveredAt ? `**Marked delivered:** ${new Date(handoff.deliveredAt).toLocaleString()}` : "",
    "",
    "## Findings and recommendations",
    handoff.recommendations.trim() || session?.answer.trim() || "No recommendations entered.",
    "",
    "## Next actions",
    handoff.nextActions.trim() || "No next actions entered.",
  ].filter(Boolean);

  if (handoff.includeTranscript && session?.transcript?.length) {
    lines.push("", "## Approved session transcript");
    session.transcript.forEach((message) => {
      lines.push("", `### ${message.role === "user" ? "Consultant" : role}`, message.content);
    });
  }
  return lines.join("\n");
}

export default function ClientHandoffPage() {
  const [sessions, setSessions] = useState<MayaSessionRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [clientName, setClientName] = useState("");
  const [engagement, setEngagement] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [nextActions, setNextActions] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
  const [includeTranscript, setIncludeTranscript] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [handoffs, setHandoffs] = useState<ClientHandoff[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loaded = loadSavedSessions();
    setSessions(loaded);
    if (loaded[0]) setSelectedId(loaded[0].id);
    try {
      const saved = JSON.parse(window.localStorage.getItem(HANDOFF_KEY) || "[]") as ClientHandoff[];
      if (Array.isArray(saved)) setHandoffs(saved);
    } catch {
      setHandoffs([]);
    }
  }, []);

  const selected = sessions.find((session) => session.id === selectedId);
  useEffect(() => {
    if (selected) setRecommendations(selected.answer);
  }, [selected]);

  const draft = useMemo<ClientHandoff>(() => ({
    id: `handoff-${selectedId || "draft"}`,
    clientName: clientName.trim(),
    engagement: engagement.trim(),
    sessionId: selectedId,
    recommendations,
    nextActions,
    includeTranscript,
    privateNotes,
    approvedAt: new Date().toISOString(),
  }), [clientName, engagement, includeTranscript, nextActions, recommendations, selectedId]);

  const sourceComplete = Boolean(selected?.transcript && selected.transcript.length >= 2);

  function saveApproved() {
    if (!clientName.trim() || !selected || !confirmed || !sourceComplete) return;
    const approved = { ...draft, id: `handoff-${crypto.randomUUID()}`, approvedAt: new Date().toISOString() };
    const next = [approved, ...handoffs].slice(0, 50);
    setHandoffs(next);
    window.localStorage.setItem(HANDOFF_KEY, JSON.stringify(next));
    setStatus("Approved client brief saved. Private notes were excluded.");
  }

  async function copyBrief(handoff = draft) {
    const source = sessions.find((session) => session.id === handoff.sessionId);
    await navigator.clipboard.writeText(formatHandoff(handoff, source));
    setStatus("Client brief copied — ready to paste into email, Notes, or a document.");
  }

  function downloadBrief(handoff = draft) {
    const source = sessions.find((session) => session.id === handoff.sessionId);
    const blob = new Blob([formatHandoff(handoff, source)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${handoff.clientName || "client"}-brief.md`.replace(/[^a-z0-9.-]+/gi, "-");
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Client brief downloaded.");
  }

  function markDelivered(id: string) {
    const next = handoffs.map((handoff) =>
      handoff.id === id ? { ...handoff, deliveredAt: new Date().toISOString() } : handoff
    );
    setHandoffs(next);
    window.localStorage.setItem(HANDOFF_KEY, JSON.stringify(next));
    setStatus("Delivery recorded.");
  }

  return (
    <PageShell
      title="Client Handoff"
      subtitle="Turn private executive work into a clean, approved client deliverable"
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-4 rounded-xl border border-[#313244] bg-[#1e1e2e] p-4 sm:p-5">
          <div className="rounded-lg border border-[#f9e2af]/30 bg-[#f9e2af]/10 p-3 text-[12px] text-[#f9e2af]">
            Private workspace. Nothing leaves MAYA until you approve and copy or download the brief.
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-[12px] text-[#a6adc8]">
              Client
              <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client or company name" className="mt-1.5 w-full rounded-lg border border-[#45475a] bg-[#181825] px-3 py-3 text-[14px] text-[#cdd6f4] outline-none focus:border-[#89b4fa]" />
            </label>
            <label className="text-[12px] text-[#a6adc8]">
              Engagement
              <input value={engagement} onChange={(e) => setEngagement(e.target.value)} placeholder="Project or engagement" className="mt-1.5 w-full rounded-lg border border-[#45475a] bg-[#181825] px-3 py-3 text-[14px] text-[#cdd6f4] outline-none focus:border-[#89b4fa]" />
            </label>
          </div>

          <label className="block text-[12px] text-[#a6adc8]">
            Source session
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="mt-1.5 w-full rounded-lg border border-[#45475a] bg-[#181825] px-3 py-3 text-[14px] text-[#cdd6f4]">
              {sessions.map((session) => <option key={session.id} value={session.id}>{session.savedAt} · {session.role.toUpperCase()} · {session.title}</option>)}
            </select>
          </label>
          {!sourceComplete && (
            <div role="alert" className="rounded-lg border border-[#f38ba8]/40 bg-[#f38ba8]/10 p-3 text-[12px] text-[#f5c2e7]">
              Handoff blocked: this source does not contain a complete saved transcript. Choose a complete session or return to the executive workspace.
            </div>
          )}
          {sourceComplete && (
            <div className="rounded-lg border border-[#a6e3a1]/30 bg-[#a6e3a1]/10 p-3 text-[12px] text-[#a6e3a1]">
              Context check passed: {selected?.transcript?.length} source messages are attached to this session.
            </div>
          )}

          <label className="block text-[12px] text-[#a6adc8]">
            Findings and recommendations
            <textarea value={recommendations} onChange={(e) => setRecommendations(e.target.value)} rows={9} className="mt-1.5 w-full select-text rounded-lg border border-[#45475a] bg-[#181825] px-3 py-3 text-[14px] leading-relaxed text-[#cdd6f4] outline-none focus:border-[#89b4fa]" />
          </label>

          <label className="block text-[12px] text-[#a6adc8]">
            Next actions, owners, and dates
            <textarea value={nextActions} onChange={(e) => setNextActions(e.target.value)} rows={5} placeholder={"• Action — Owner — Due date"} className="mt-1.5 w-full rounded-lg border border-[#45475a] bg-[#181825] px-3 py-3 text-[14px] leading-relaxed text-[#cdd6f4] outline-none focus:border-[#89b4fa]" />
          </label>

          <label className="block text-[12px] text-[#f38ba8]">
            Private consultant notes — never included in the client brief
            <textarea value={privateNotes} onChange={(e) => setPrivateNotes(e.target.value)} rows={4} placeholder="Concerns, internal strategy, follow-up thoughts…" className="mt-1.5 w-full rounded-lg border border-[#f38ba8]/30 bg-[#181825] px-3 py-3 text-[14px] text-[#cdd6f4] outline-none focus:border-[#f38ba8]" />
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-[#313244] bg-[#181825] p-3 text-[12px] text-[#a6adc8]">
            <input type="checkbox" checked={includeTranscript} onChange={(e) => setIncludeTranscript(e.target.checked)} className="mt-0.5 h-5 w-5" />
            Include the approved session transcript in the client brief
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-[#89b4fa]/30 bg-[#89b4fa]/10 p-3 text-[12px] text-[#cdd6f4]">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 h-5 w-5" />
            I reviewed this client-facing material and approve it for handoff.
          </label>

          <div className="flex flex-wrap gap-2">
            <button onClick={saveApproved} disabled={!clientName.trim() || !selected || !confirmed || !sourceComplete} className="min-h-11 rounded-lg bg-[#89b4fa] px-4 py-2 text-[13px] font-semibold text-[#1e1e2e] disabled:opacity-35">Approve and save brief</button>
            <button onClick={() => copyBrief()} disabled={!clientName.trim() || !confirmed || !sourceComplete} className="min-h-11 rounded-lg border border-[#45475a] px-4 py-2 text-[13px] font-semibold text-[#cdd6f4] disabled:opacity-35">Copy client brief</button>
            <button onClick={() => downloadBrief()} disabled={!clientName.trim() || !confirmed || !sourceComplete} className="min-h-11 rounded-lg border border-[#45475a] px-4 py-2 text-[13px] font-semibold text-[#cdd6f4] disabled:opacity-35">Download brief</button>
          </div>
          {status && <p role="status" className="text-[12px] text-[#a6e3a1]">{status}</p>}
        </section>

        <aside className="space-y-4">
          <section className="rounded-xl border border-[#313244] bg-[#1e1e2e] p-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">Client sees</h2>
            <div className="mt-3 max-h-[62dvh] overflow-y-auto rounded-lg border border-[#313244] bg-[#181825] p-4">
              <pre className="select-text whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-[#cdd6f4]">{formatHandoff(draft, selected)}</pre>
            </div>
          </section>

          <section className="rounded-xl border border-[#313244] bg-[#1e1e2e] p-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">Approved handoffs</h2>
            <div className="mt-3 space-y-3">
              {handoffs.length === 0 && <p className="text-[12px] text-[#585b70]">No approved client briefs yet.</p>}
              {handoffs.map((handoff) => (
                <div key={handoff.id} className="rounded-lg border border-[#313244] bg-[#181825] p-3">
                  <p className="text-[13px] font-medium text-[#cdd6f4]">{handoff.clientName}</p>
                  <p className="mt-1 text-[11px] text-[#6c7086]">Approved {new Date(handoff.approvedAt).toLocaleString()}</p>
                  {handoff.deliveredAt && <p className="mt-1 text-[11px] text-[#a6e3a1]">Delivered {new Date(handoff.deliveredAt).toLocaleString()}</p>}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button onClick={() => copyBrief(handoff)} className="text-[11px] text-[#89b4fa]">Copy</button>
                    <button onClick={() => downloadBrief(handoff)} className="text-[11px] text-[#89b4fa]">Download</button>
                    {!handoff.deliveredAt && <button onClick={() => markDelivered(handoff.id)} className="text-[11px] text-[#f9e2af]">Mark delivered</button>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </PageShell>
  );
}
