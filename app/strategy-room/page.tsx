"use client";

import { useState } from "react";

const EXEC_ROLES = [
  { id: "ceo", label: "CEO", icon: "🏛️", desc: "Vision & direction" },
  { id: "coo", label: "COO", icon: "⚙️", desc: "Operations & execution" },
  { id: "cmo", label: "CMO", icon: "📣", desc: "Brand & market" },
  { id: "cfo", label: "CFO", icon: "💰", desc: "Finance & risk" },
  { id: "cto", label: "CTO", icon: "🖥️", desc: "Technology & systems" },
  { id: "cio", label: "CIO", icon: "🔷", desc: "Information & data" },
  { id: "cro", label: "CRO", icon: "📈", desc: "Revenue & growth" },
  { id: "cd", label: "CD", icon: "🎨", desc: "Creative & production" },
] as const;

type RoleId = (typeof EXEC_ROLES)[number]["id"];

interface LensPanelProps {
  role: (typeof EXEC_ROLES)[number];
  onRemove: (id: RoleId) => void;
}

function LensPanel({ role, onRemove }: LensPanelProps) {
  return (
    <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{role.icon}</span>
          <span className="text-[13px] font-semibold text-[#89b4fa]">
            {role.label}
          </span>
        </div>
        <button
          onClick={() => onRemove(role.id)}
          title="Remove from room"
          className="text-[#585b70] hover:text-[#f38ba8] transition-colors text-sm leading-none"
        >
          ✕
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#a6e3a1] inline-block" />
        <span className="text-[11px] text-[#a6e3a1]">Lens active</span>
      </div>
      <p className="text-[12px] text-[#585b70]">{role.desc}</p>
    </div>
  );
}

export default function StrategyRoomPage() {
  const [selected, setSelected] = useState<Set<RoleId>>(new Set());
  const [roomActive, setRoomActive] = useState(false);
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<
    { roles: string; text: string; ts: string }[]
  >([]);

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
  };

  const removeRole = (id: RoleId) => {
    const next = new Set(selected);
    next.delete(id);
    if (next.size < 2) {
      setRoomActive(false);
      setSelected(next);
    } else {
      setSelected(next);
    }
  };

  const submit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const roleLabels = activeRoles.map((r) => r.label).join(" · ");
    setEntries((prev) => [
      ...prev,
      {
        roles: roleLabels,
        text: trimmed,
        ts: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInput("");
  };

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
              ? `${activeRoles.length} lenses loaded — multi-role synthesis active`
              : "Select two or more exec roles to load their lenses simultaneously"}
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

      {/* Role selector (shown when room is not yet active) */}
      {!roomActive && (
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
            Select Exec Roles
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {EXEC_ROLES.map((role) => {
              const isSelected = selected.has(role.id);
              return (
                <button
                  key={role.id}
                  onClick={() => toggle(role.id)}
                  className={[
                    "flex flex-col items-start gap-1 p-4 rounded-xl border transition-all text-left",
                    isSelected
                      ? "border-[#89b4fa] bg-[#89b4fa]/10 text-[#89b4fa]"
                      : "border-[#313244] bg-[#1e1e2e] text-[#cdd6f4] hover:border-[#585b70]",
                  ].join(" ")}
                >
                  <span className="text-xl">{role.icon}</span>
                  <span className="text-[13px] font-semibold">{role.label}</span>
                  <span
                    className={`text-[11px] ${isSelected ? "text-[#89b4fa]/70" : "text-[#585b70]"}`}
                  >
                    {role.desc}
                  </span>
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

      {/* Active room workspace */}
      {roomActive && (
        <>
          {/* Loaded lens panels */}
          <div
            className={`grid gap-4 mb-6 ${
              activeRoles.length <= 2
                ? "grid-cols-2"
                : activeRoles.length <= 4
                  ? "grid-cols-2 md:grid-cols-4"
                  : "grid-cols-2 md:grid-cols-4"
            }`}
          >
            {activeRoles.map((role) => (
              <LensPanel key={role.id} role={role} onRemove={removeRole} />
            ))}
          </div>

          {/* Whiteboard / synthesis area */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5 mb-4 min-h-[200px]">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
              Whiteboard — Synthesis Feed
            </h2>

            {entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <p className="text-[13px] text-[#585b70] text-center">
                  All {activeRoles.length} lenses loaded.
                </p>
                <p className="text-[12px] text-[#585b70] text-center max-w-sm">
                  Drive the strategy. Enter your prompt below and MAYA synthesizes
                  across every active role simultaneously.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry, i) => (
                  <div
                    key={i}
                    className="border-l-2 border-[#89b4fa]/40 pl-4 py-1"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-[#89b4fa] uppercase tracking-wider">
                        {entry.roles}
                      </span>
                      <span className="text-[10px] text-[#585b70]">
                        {entry.ts}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#cdd6f4]">{entry.text}</p>
                    <p className="text-[12px] text-[#585b70] mt-2 italic">
                      Multi-lens synthesis — adaptive response layer builds as training data accumulates.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={`Drive the room — ${activeRoles.map((r) => r.label).join(", ")} lenses active`}
              className="flex-1 bg-[#1e1e2e] border border-[#313244] rounded-xl px-4 py-3 text-[13px] text-[#cdd6f4] placeholder-[#585b70] focus:outline-none focus:border-[#89b4fa] transition-colors"
            />
            <button
              onClick={submit}
              disabled={!input.trim()}
              className={[
                "px-5 py-3 rounded-xl text-[13px] font-semibold transition-all",
                input.trim()
                  ? "bg-[#89b4fa] text-[#1e1e2e] hover:bg-[#89b4fa]/90"
                  : "bg-[#313244] text-[#585b70] cursor-not-allowed",
              ].join(" ")}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
