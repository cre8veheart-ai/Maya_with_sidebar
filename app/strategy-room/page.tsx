"use client";

import { useState } from "react";

// All 11 exec roles — the full room
const EXEC_ROLES = [
  { id: "ceo",          label: "CEO",          icon: "🏛️", desc: "Vision & direction" },
  { id: "coo",          label: "COO",          icon: "⚙️", desc: "Operations & execution" },
  { id: "cmo",          label: "CMO",          icon: "📣", desc: "Brand & market" },
  { id: "cfo",          label: "CFO",          icon: "💰", desc: "Finance & risk" },
  { id: "cto",          label: "CTO",          icon: "🖥️", desc: "Technology & systems" },
  { id: "cio",          label: "CIO",          icon: "🔷", desc: "Information & data" },
  { id: "cro",          label: "CRO",          icon: "📈", desc: "Revenue & growth" },
  { id: "cd",           label: "CD",           icon: "🎨", desc: "Creative & production" },
  { id: "hr",           label: "HR",           icon: "👥", desc: "People & org" },
  { id: "legal",        label: "Legal",        icon: "⚖️", desc: "Risk & compliance" },
  { id: "office-admin", label: "Office Admin", icon: "🗂️", desc: "Minutes & action items" },
] as const;

type RoleId = (typeof EXEC_ROLES)[number]["id"];
type RoomMode = "strategy" | "whiteboard" | "campaign";

// Campaign creation — each role contributes their defined piece
const CAMPAIGN_ROLES: { role: string; icon: string; field: string; placeholder: string }[] = [
  { role: "CMO",          icon: "📣", field: "brief",     placeholder: "Campaign brief, positioning, target audience, key message…" },
  { role: "CFO",          icon: "💰", field: "budget",    placeholder: "Budget envelope, approval conditions, spend allocation…" },
  { role: "CRO",          icon: "📈", field: "targets",   placeholder: "Revenue targets, conversion goals, pipeline contribution…" },
  { role: "COO",          icon: "⚙️", field: "resources", placeholder: "Resource allocation, vendor list, production capacity, timeline…" },
  { role: "CD",           icon: "🎨", field: "production",placeholder: "Creative direction, asset list, traffic schedule, deliverables…" },
  { role: "CEO",          icon: "🏛️", field: "approval",  placeholder: "Strategic alignment note, exec approval, go / no-go…" },
  { role: "Legal",        icon: "⚖️", field: "legal",     placeholder: "Compliance checks, usage rights, regulatory flags…" },
  { role: "HR",           icon: "👥", field: "people",    placeholder: "Headcount needs, contractor approvals, internal comms…" },
  { role: "Office Admin", icon: "🗂️", field: "logistics", placeholder: "Meeting coordination, distribution list, approval routing…" },
];

// Whiteboard sections — each lens adds their piece to the shared surface
const WHITEBOARD_SECTIONS = [
  { id: "objective",  label: "Objective",       icon: "🎯", placeholder: "What are we deciding or solving in this session?" },
  { id: "context",    label: "Context",          icon: "📋", placeholder: "Relevant background, constraints, prior decisions…" },
  { id: "options",    label: "Options",          icon: "🔀", placeholder: "Paths considered — with tradeoffs for each…" },
  { id: "risks",      label: "Risks & Flags",    icon: "⚠️", placeholder: "What could go wrong? Legal, financial, operational exposure…" },
  { id: "decision",   label: "Decision",         icon: "✅", placeholder: "The call. Owner, rationale, next step…" },
  { id: "actions",    label: "Action Items",     icon: "📌", placeholder: "Who does what by when — pulled to Decisions layer on approval…" },
];

function LensChip({ role, onRemove }: { role: typeof EXEC_ROLES[number]; onRemove: (id: RoleId) => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#1e1e2e] border border-[#89b4fa]/30 rounded-lg px-3 py-1.5">
      <span className="text-base">{role.icon}</span>
      <span className="text-[12px] font-semibold text-[#89b4fa]">{role.label}</span>
      <button
        onClick={() => onRemove(role.id)}
        className="text-[#585b70] hover:text-[#f38ba8] transition-colors text-xs leading-none ml-1"
        aria-label={`Remove ${role.label}`}
      >
        ✕
      </button>
    </div>
  );
}

export default function StrategyRoomPage() {
  const [selected, setSelected]       = useState<Set<RoleId>>(new Set());
  const [roomActive, setRoomActive]   = useState(false);
  const [roomMode, setRoomMode]       = useState<RoomMode>("strategy");
  const [presentMode, setPresentMode] = useState(false);

  // Strategy mode
  const [input, setInput]   = useState("");
  const [entries, setEntries] = useState<{ roles: string; text: string; ts: string }[]>([]);

  // Whiteboard mode
  const [wbContent, setWbContent] = useState<Record<string, string>>({});

  // Campaign creation mode
  const [campaignName, setCampaignName] = useState("");
  const [campaignInputs, setCampaignInputs] = useState<Record<string, string>>({});
  const [campaignSaved, setCampaignSaved] = useState(false);

  const toggle = (id: RoleId) => {
    if (roomActive) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const activeRoles = EXEC_ROLES.filter((r) => selected.has(r.id));

  const enterRoom = () => {
    if (selected.size < 2) return;
    setRoomActive(true);
  };

  const exitRoom = () => {
    setRoomActive(false);
    setSelected(new Set());
    setInput("");
    setEntries([]);
    setWbContent({});
    setCampaignName("");
    setCampaignInputs({});
    setCampaignSaved(false);
    setPresentMode(false);
    setRoomMode("strategy");
  };

  const removeRole = (id: RoleId) => {
    const next = new Set(selected);
    next.delete(id);
    if (next.size < 2) { setRoomActive(false); }
    setSelected(next);
  };

  const submitStrategy = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setEntries((prev) => [
      ...prev,
      { roles: activeRoles.map((r) => r.label).join(" · "), text: trimmed, ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setInput("");
  };

  const saveCampaign = () => {
    if (!campaignName.trim()) return;
    setCampaignSaved(true);
  };

  const filledSections = WHITEBOARD_SECTIONS.filter((s) => wbContent[s.id]?.trim());
  const filledCampaignFields = CAMPAIGN_ROLES.filter((r) => campaignInputs[r.field]?.trim());

  // Present mode — clean full-page whiteboard view
  if (presentMode) {
    return (
      <div className="min-h-screen bg-[#11111b] px-12 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-[26px] font-semibold text-[#cdd6f4] tracking-tight">Executive Session</h1>
              <p className="text-[13px] text-[#585b70] mt-1">
                {activeRoles.map((r) => r.label).join(" · ")}
              </p>
            </div>
            <button
              onClick={() => setPresentMode(false)}
              className="text-[12px] text-[#585b70] hover:text-[#cdd6f4] border border-[#313244] px-4 py-2 rounded-lg transition-colors"
            >
              ← Exit Presentation
            </button>
          </div>
          {filledSections.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <p className="text-[#585b70] text-[14px]">Whiteboard is empty — add content before presenting.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filledSections.map((s) => (
                <div key={s.id} className="border-b border-[#313244] pb-8 last:border-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{s.icon}</span>
                    <h2 className="text-[14px] font-semibold text-[#89b4fa] uppercase tracking-[0.06em]">{s.label}</h2>
                  </div>
                  <p className="text-[15px] text-[#cdd6f4] leading-relaxed whitespace-pre-wrap">{wbContent[s.id]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full px-8 py-10 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-[#cdd6f4] tracking-tight leading-tight">
            Executive Strategy Room
          </h1>
          <p className="mt-1 text-[14px] text-[#a6adc8]">
            {roomActive
              ? `${activeRoles.length} lenses loaded — select a room mode below`
              : "Assemble any combination of exec roles. Select a mode. Drive the session."}
          </p>
        </div>
        {roomActive && (
          <button
            onClick={exitRoom}
            className="text-[12px] text-[#585b70] hover:text-[#f38ba8] border border-[#313244] px-3 py-1.5 rounded-lg transition-colors"
          >
            Exit Room
          </button>
        )}
      </div>

      {/* Role selector */}
      {!roomActive && (
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
            Assemble Your Room — Select Roles
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
            {EXEC_ROLES.map((role) => {
              const isSelected = selected.has(role.id);
              return (
                <button
                  key={role.id}
                  onClick={() => toggle(role.id)}
                  className={[
                    "flex flex-col items-start gap-1 p-4 rounded-xl border transition-all text-left",
                    isSelected
                      ? "border-[#89b4fa] bg-[#89b4fa]/10"
                      : "border-[#313244] bg-[#1e1e2e] hover:border-[#585b70]",
                  ].join(" ")}
                >
                  <span className="text-xl">{role.icon}</span>
                  <span className={`text-[13px] font-semibold ${isSelected ? "text-[#89b4fa]" : "text-[#cdd6f4]"}`}>{role.label}</span>
                  <span className={`text-[11px] ${isSelected ? "text-[#89b4fa]/70" : "text-[#585b70]"}`}>{role.desc}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={enterRoom}
            disabled={selected.size < 2}
            className={[
              "px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all",
              selected.size >= 2
                ? "bg-[#89b4fa] text-[#1e1e2e] hover:bg-[#89b4fa]/90"
                : "bg-[#313244] text-[#585b70] cursor-not-allowed",
            ].join(" ")}
          >
            {selected.size < 2
              ? `Select ${2 - selected.size} more role${selected.size === 1 ? "" : "s"} to enter`
              : `Enter Room — ${selected.size} lenses`}
          </button>
        </div>
      )}

      {/* Active room */}
      {roomActive && (
        <>
          {/* Active lens chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {activeRoles.map((r) => (
              <LensChip key={r.id} role={r} onRemove={removeRole} />
            ))}
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 mb-6 bg-[#1e1e2e] border border-[#313244] rounded-xl p-1 w-fit">
            {(["strategy", "whiteboard", "campaign"] as const).map((mode) => {
              const labels: Record<RoomMode, string> = {
                strategy: "🧩 Strategy",
                whiteboard: "🖊️ Whiteboard",
                campaign: "🚀 Campaign Creation",
              };
              return (
                <button
                  key={mode}
                  onClick={() => setRoomMode(mode)}
                  className={[
                    "px-4 py-2 rounded-lg text-[12px] font-semibold transition-colors",
                    roomMode === mode
                      ? "bg-[#89b4fa]/15 text-[#89b4fa]"
                      : "text-[#585b70] hover:text-[#cdd6f4]",
                  ].join(" ")}
                >
                  {labels[mode]}
                </button>
              );
            })}
          </div>

          {/* ── STRATEGY MODE ─────────────────────────────── */}
          {roomMode === "strategy" && (
            <>
              <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5 mb-4 min-h-[200px]">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
                  Multi-Lens Synthesis Feed
                </h2>
                {entries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 gap-2">
                    <p className="text-[13px] text-[#585b70] text-center">
                      {activeRoles.length} lenses loaded.
                    </p>
                    <p className="text-[12px] text-[#585b70] text-center max-w-sm">
                      Drive the strategy. MAYA synthesizes across every active role simultaneously.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries.map((entry, i) => (
                      <div key={i} className="border-l-2 border-[#89b4fa]/40 pl-4 py-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold text-[#89b4fa] uppercase tracking-wider">{entry.roles}</span>
                          <span className="text-[10px] text-[#585b70]">{entry.ts}</span>
                        </div>
                        <p className="text-[13px] text-[#cdd6f4]">{entry.text}</p>
                        <p className="text-[12px] text-[#585b70] mt-2 italic">
                          Multi-lens synthesis — MAYA responds through every active role simultaneously.
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitStrategy()}
                  placeholder={`Drive the room — ${activeRoles.map((r) => r.label).join(", ")} lenses active`}
                  className="flex-1 bg-[#1e1e2e] border border-[#313244] rounded-xl px-4 py-3 text-[13px] text-[#cdd6f4] placeholder-[#585b70] focus:outline-none focus:border-[#89b4fa] transition-colors"
                />
                <button
                  onClick={submitStrategy}
                  disabled={!input.trim()}
                  className={["px-5 py-3 rounded-xl text-[13px] font-semibold transition-all", input.trim() ? "bg-[#89b4fa] text-[#1e1e2e] hover:bg-[#89b4fa]/90" : "bg-[#313244] text-[#585b70] cursor-not-allowed"].join(" ")}
                >
                  Send
                </button>
              </div>
            </>
          )}

          {/* ── WHITEBOARD MODE ───────────────────────────── */}
          {roomMode === "whiteboard" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[12px] text-[#585b70]">
                  Shared canvas — each lens contributes their section. Approve and present when ready.
                </p>
                <button
                  onClick={() => setPresentMode(true)}
                  className="text-[12px] font-semibold px-4 py-2 rounded-lg bg-[#cba6f7]/10 text-[#cba6f7] border border-[#cba6f7]/30 hover:bg-[#cba6f7]/20 transition-colors flex-shrink-0"
                >
                  ▶ Present
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WHITEBOARD_SECTIONS.map((section) => (
                  <div key={section.id} className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{section.icon}</span>
                      <h3 className="text-[12px] font-semibold text-[#89b4fa] uppercase tracking-[0.06em]">{section.label}</h3>
                      {wbContent[section.id]?.trim() && (
                        <span className="ml-auto text-[10px] text-[#a6e3a1]">✓</span>
                      )}
                    </div>
                    <textarea
                      value={wbContent[section.id] ?? ""}
                      onChange={(e) => setWbContent((prev) => ({ ...prev, [section.id]: e.target.value }))}
                      placeholder={section.placeholder}
                      rows={3}
                      className="bg-[#181825] border border-[#313244] rounded-lg px-3 py-2 text-[12px] text-[#cdd6f4] placeholder-[#45475a] focus:outline-none focus:border-[#89b4fa]/50 resize-none transition-colors"
                    />
                  </div>
                ))}
              </div>
              {filledSections.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a6e3a1]" />
                  <p className="text-[11px] text-[#585b70]">
                    {filledSections.length} of {WHITEBOARD_SECTIONS.length} sections filled · Office Admin will extract action items on session close
                  </p>
                </div>
              )}
            </>
          )}

          {/* ── CAMPAIGN CREATION MODE ────────────────────── */}
          {roomMode === "campaign" && (
            <>
              {campaignSaved ? (
                <div className="bg-[#1e1e2e] border border-[#a6e3a1]/30 rounded-xl p-8 flex flex-col items-center gap-3">
                  <span className="text-4xl">🚀</span>
                  <h2 className="text-[16px] font-semibold text-[#cdd6f4]">&ldquo;{campaignName}&rdquo; created</h2>
                  <p className="text-[13px] text-[#585b70] text-center max-w-sm">
                    Campaign saved to the Campaigns layer. Each exec contribution is logged. CD owns the production track from here.
                  </p>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => { setCampaignSaved(false); setCampaignName(""); setCampaignInputs({}); }}
                      className="text-[12px] text-[#585b70] hover:text-[#cdd6f4] border border-[#313244] px-4 py-2 rounded-lg transition-colors"
                    >
                      New Campaign
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl px-4 py-3 flex items-center gap-3 mb-5">
                    <span className="text-[#585b70] text-sm">🚀</span>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Campaign name…"
                      className="flex-1 bg-transparent text-[14px] font-semibold text-[#cdd6f4] placeholder-[#45475a] focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-[#585b70] mb-4 uppercase tracking-[0.07em] font-semibold">
                    Each Role Contributes Their Piece
                  </p>
                  <div className="space-y-3">
                    {CAMPAIGN_ROLES.map((cr) => {
                      const isInRoom = activeRoles.some((r) => r.label === cr.role);
                      return (
                        <div
                          key={cr.field}
                          className={["bg-[#1e1e2e] border rounded-xl p-4", isInRoom ? "border-[#313244]" : "border-[#313244] opacity-40"].join(" ")}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-base">{cr.icon}</span>
                            <span className="text-[12px] font-semibold text-[#89b4fa]">{cr.role}</span>
                            {!isInRoom && (
                              <span className="text-[10px] text-[#585b70] ml-auto">Not in room</span>
                            )}
                            {isInRoom && campaignInputs[cr.field]?.trim() && (
                              <span className="text-[10px] text-[#a6e3a1] ml-auto">✓ Contributed</span>
                            )}
                          </div>
                          <textarea
                            value={campaignInputs[cr.field] ?? ""}
                            onChange={(e) => setCampaignInputs((prev) => ({ ...prev, [cr.field]: e.target.value }))}
                            placeholder={isInRoom ? cr.placeholder : "Add this role to the room to contribute"}
                            disabled={!isInRoom}
                            rows={2}
                            className="w-full bg-[#181825] border border-[#313244] rounded-lg px-3 py-2 text-[12px] text-[#cdd6f4] placeholder-[#45475a] focus:outline-none focus:border-[#89b4fa]/50 resize-none transition-colors disabled:cursor-not-allowed"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-[11px] text-[#585b70]">
                      {filledCampaignFields.length} of {CAMPAIGN_ROLES.filter((cr) => activeRoles.some((r) => r.label === cr.role)).length} active roles contributed
                    </p>
                    <button
                      onClick={saveCampaign}
                      disabled={!campaignName.trim() || filledCampaignFields.length === 0}
                      className={["px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all", campaignName.trim() && filledCampaignFields.length > 0 ? "bg-[#89b4fa] text-[#1e1e2e] hover:bg-[#89b4fa]/90" : "bg-[#313244] text-[#585b70] cursor-not-allowed"].join(" ")}
                    >
                      Save Campaign →
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
