"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";
import type { ChatSession, ExecRole } from "@/lib/maya/types";
import { loadSessions, removeSession } from "@/lib/maya/sessionStorage";

const ROLE_FILTERS = ["All", "CEO", "COO", "CMO", "CFO", "CTO", "CIO", "CRO", "CD", "Strategy Room"];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function rolePillColor(role: ExecRole): string {
  const map: Record<string, string> = {
    ceo: "bg-[#f38ba8]/20 text-[#f38ba8]",
    coo: "bg-[#fab387]/20 text-[#fab387]",
    cmo: "bg-[#a6e3a1]/20 text-[#a6e3a1]",
    cfo: "bg-[#89dceb]/20 text-[#89dceb]",
    cto: "bg-[#89b4fa]/20 text-[#89b4fa]",
    cio: "bg-[#b4befe]/20 text-[#b4befe]",
    cro: "bg-[#cba6f7]/20 text-[#cba6f7]",
    cd:  "bg-[#f9e2af]/20 text-[#f9e2af]",
  };
  return map[role] ?? "bg-[#313244] text-[#a6adc8]";
}

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeRole, setActiveRole] = useState("All");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    loadSessions().then(setSessions);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const filtered = sessions.filter((s) => {
    const roleMatch = activeRole === "All" || s.role.toUpperCase() === activeRole;
    const searchMatch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.messages.some((m) => m.content.toLowerCase().includes(search.toLowerCase()));
    return roleMatch && searchMatch;
  });

  async function handleDelete(id: string) {
    setDeletingId(id);
    await removeSession(id);
    refresh();
    setDeletingId(null);
  }

  function handleResume(session: ChatSession) {
    router.push(`/chat?session=${session.id}`);
  }

  const rolesActive = new Set(sessions.map((s) => s.role)).size;
  const lastSession = sessions[0];

  return (
    <PageShell
      title="Sessions"
      subtitle="Your full conversation history with Maya — never re-onboard"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main panel */}
        <div className="md:col-span-2 space-y-4">
          {/* Search */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-[#585b70]">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sessions…"
              className="flex-1 bg-transparent text-[13px] text-[#cdd6f4] placeholder-[#585b70] focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-[#585b70] hover:text-[#cdd6f4] text-[12px]">✕</button>
            )}
          </div>

          {/* Role filter pills */}
          <div className="flex flex-wrap gap-2">
            {ROLE_FILTERS.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRole(r)}
                className={[
                  "text-[11px] font-semibold px-3 py-1 rounded-full transition-colors",
                  activeRole === r
                    ? "bg-[#89b4fa]/20 text-[#89b4fa] border border-[#89b4fa]/40"
                    : "bg-[#1e1e2e] border border-[#313244] text-[#585b70] hover:text-[#cdd6f4]",
                ].join(" ")}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Session list */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
              {filtered.length > 0 ? `${filtered.length} Session${filtered.length !== 1 ? "s" : ""}` : "Recent Sessions"}
            </h2>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <span className="text-3xl">🗂️</span>
                <p className="text-[13px] text-[#585b70] text-center max-w-xs">
                  {sessions.length === 0
                    ? "Sessions save automatically as you work. Pick up exactly where you left off — every time."
                    : "No sessions match your filter."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((session) => (
                  <div
                    key={session.id}
                    className="group flex items-start justify-between gap-3 p-4 rounded-xl border border-[#313244] hover:border-[#45475a] bg-[#181825] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${rolePillColor(session.role)}`}>
                          {session.role.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-[#585b70]">{timeAgo(session.updatedAt)}</span>
                        <span className="text-[11px] text-[#585b70]">·</span>
                        <span className="text-[11px] text-[#585b70]">{session.messages.length} messages</span>
                      </div>
                      <p className="text-[13px] text-[#cdd6f4] font-medium truncate">{session.title}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleResume(session)}
                        className="text-[12px] font-semibold px-3 py-1.5 bg-[#89b4fa]/10 text-[#89b4fa] border border-[#89b4fa]/30 rounded-lg hover:bg-[#89b4fa]/20 transition-colors"
                      >
                        Resume
                      </button>
                      <button
                        onClick={() => handleDelete(session.id)}
                        disabled={deletingId === session.id}
                        className="opacity-0 group-hover:opacity-100 text-[12px] px-2 py-1.5 text-[#585b70] hover:text-[#f38ba8] transition-all"
                        title="Delete session"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
              Summary
            </h2>
            <div className="space-y-3">
              {[
                { label: "Total sessions", value: String(sessions.length) },
                { label: "Roles active", value: String(rolesActive) },
                { label: "Last session", value: lastSession ? timeAgo(lastSession.updatedAt) : "—" },
                { label: "Messages captured", value: String(sessions.reduce((sum, s) => sum + s.messages.length, 0)) },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-[#313244] pb-2 last:border-0"
                >
                  <span className="text-[13px] text-[#cdd6f4]">{label}</span>
                  <span className="text-[13px] text-[#585b70]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-3">
              How Sessions Work
            </h2>
            <div className="space-y-2">
              {[
                "Auto-saved — no manual action needed",
                "Filterable by exec role",
                "Resume from exactly where you left off",
                "Full context reloaded — MAYA knows where you were",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2">
                  <span className="text-[#89b4fa] mt-0.5">·</span>
                  <span className="text-[12px] text-[#a6adc8]">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
