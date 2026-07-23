"use client";

import { useState, useEffect, useCallback } from "react";
import PageShell from "@/components/PageShell";
import { useSuggestionStorage } from "@/lib/storage/SuggestionStorageContext";
import type { Suggestion, SuggestionCategory, SuggestionStatus, SuggestionVisibility } from "@/lib/types/suggestion";

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateId() {
  return `sug_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const CURRENT_USER = "You"; // Phase 2: replaced by real auth user

// ── Config ────────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<SuggestionCategory, string> = {
  strategic:   "Strategic",
  operational: "Operational",
  product:     "Product",
  talent:      "Talent",
  financial:   "Financial",
  other:       "Other",
};

const STATUS_STYLES: Record<SuggestionStatus, string> = {
  "open":         "bg-[#F0F5FF] text-[#0066CC]",
  "under-review": "bg-[#FFF8E6] text-[#996600]",
  "accepted":     "bg-[#F0FAF0] text-[#2D7D46]",
  "declined":     "bg-[#FFF0F0] text-[#C0392B]",
};

const STATUS_LABELS: Record<SuggestionStatus, string> = {
  "open":         "Open",
  "under-review": "Under Review",
  "accepted":     "Accepted",
  "declined":     "Declined",
};

// ── Icons ─────────────────────────────────────────────────────────────────────

const ThumbUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 7V13H3a1 1 0 01-1-1V9a1 1 0 011-1h2zm0 0l3-5.5a1.5 1.5 0 013 1V6h2.5a1 1 0 011 1.2l-1 5a1 1 0 01-1 .8H5"/>
  </svg>
);

const ThumbDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 9V3h2a1 1 0 011 1v3a1 1 0 01-1 1h-2zm0 0l-3 5.5a1.5 1.5 0 01-3-1V10H2.5a1 1 0 01-1-1.2l1-5A1 1 0 013.5 3H11"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M7 2v10M2 7h10" />
  </svg>
);

// ── Submit modal ──────────────────────────────────────────────────────────────

interface SubmitModalProps {
  onClose: () => void;
  onSubmit: (title: string, body: string, category: SuggestionCategory, visibility: SuggestionVisibility) => Promise<void>;
}

function SubmitModal({ onClose, onSubmit }: SubmitModalProps) {
  const [title, setTitle]           = useState("");
  const [body, setBody]             = useState("");
  const [category, setCategory]     = useState<SuggestionCategory>("strategic");
  const [visibility, setVisibility] = useState<SuggestionVisibility>("team");
  const [saving, setSaving]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await onSubmit(title.trim(), body.trim(), category, visibility);
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-[17px] font-semibold text-[#1D1D1F] mb-5">New Suggestion</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] mb-1.5">Title *</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="One clear sentence"
              className="w-full px-3 py-2.5 text-[13.5px] border border-[#E5E5EA] rounded-xl bg-white outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/20"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] mb-1.5">Detail</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Context, rationale, or supporting points"
              rows={4}
              className="w-full px-3 py-2.5 text-[13.5px] border border-[#E5E5EA] rounded-xl bg-white outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/20 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SuggestionCategory)}
                className="w-full px-3 py-2.5 text-[13.5px] border border-[#E5E5EA] rounded-xl bg-white outline-none focus:border-[#0066CC] cursor-pointer"
              >
                {(Object.keys(CATEGORY_LABELS) as SuggestionCategory[]).map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#6E6E73] mb-1.5">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as SuggestionVisibility)}
                className="w-full px-3 py-2.5 text-[13.5px] border border-[#E5E5EA] rounded-xl bg-white outline-none focus:border-[#0066CC] cursor-pointer"
              >
                <option value="team">Team</option>
                <option value="exec-only">Exec Only</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 text-[13px] font-medium border border-[#E5E5EA] rounded-xl text-[#3D3D3D] hover:bg-[#F5F5F7] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={!title.trim() || saving}
              className="flex-1 px-4 py-2.5 text-[13px] font-semibold bg-[#1D1D1F] text-white rounded-xl hover:bg-[#3D3D3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              {saving ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Suggestion card ───────────────────────────────────────────────────────────

interface CardProps {
  suggestion: Suggestion;
  onVote: (id: string, dir: "up" | "down" | "none") => void;
  onStatusChange: (id: string, status: SuggestionStatus) => void;
  onDelete: (id: string) => void;
}

function SuggestionCard({ suggestion: s, onVote, onStatusChange, onDelete }: CardProps) {
  const myVote = s.votes.up.includes(CURRENT_USER) ? "up"
               : s.votes.down.includes(CURRENT_USER) ? "down"
               : "none";
  const score = s.votes.up.length - s.votes.down.length;

  return (
    <div className="border border-[#EBEBED] rounded-2xl p-5 bg-white hover:border-[#C7C7CC] transition-colors">
      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#1D1D1F] leading-snug">{s.title}</p>
          <p className="text-[11.5px] text-[#AEAEB2] mt-0.5">
            {s.submittedBy} · {formatDate(s.submittedAt)}
            {s.visibility === "exec-only" && (
              <span className="ml-2 text-[10px] uppercase tracking-wide text-[#8E8E93] font-medium">Exec Only</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${STATUS_STYLES[s.status]}`}>
            {STATUS_LABELS[s.status]}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F5F5F7] text-[#6E6E73]">
            {CATEGORY_LABELS[s.category]}
          </span>
        </div>
      </div>

      {/* Body */}
      {s.body && (
        <p className="text-[13px] text-[#6E6E73] mb-4 leading-relaxed">{s.body}</p>
      )}

      {/* Footer — votes + status controls */}
      <div className="flex items-center gap-3 mt-3">
        {/* Votes */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onVote(s.id, myVote === "up" ? "none" : "up")}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[12px] transition-colors ${
              myVote === "up" ? "bg-[#F0F5FF] text-[#0066CC]" : "text-[#8E8E93] hover:bg-[#F5F5F7]"
            }`}
          >
            <ThumbUpIcon /> {s.votes.up.length}
          </button>
          <button
            onClick={() => onVote(s.id, myVote === "down" ? "none" : "down")}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[12px] transition-colors ${
              myVote === "down" ? "bg-[#FFF0F0] text-[#C0392B]" : "text-[#8E8E93] hover:bg-[#F5F5F7]"
            }`}
          >
            <ThumbDownIcon /> {s.votes.down.length}
          </button>
          <span className="text-[11px] text-[#AEAEB2] ml-1">
            {score > 0 ? `+${score}` : score}
          </span>
        </div>

        <div className="flex-1" />

        {/* Status changer */}
        <select
          value={s.status}
          onChange={(e) => onStatusChange(s.id, e.target.value as SuggestionStatus)}
          className="text-[12px] text-[#6E6E73] border border-[#E5E5EA] rounded-lg px-2 py-1 bg-white outline-none focus:border-[#0066CC] cursor-pointer"
        >
          {(Object.keys(STATUS_LABELS) as SuggestionStatus[]).map((st) => (
            <option key={st} value={st}>{STATUS_LABELS[st]}</option>
          ))}
        </select>

        {s.submittedBy === CURRENT_USER && (
          <button
            onClick={() => onDelete(s.id)}
            className="text-[12px] text-[#AEAEB2] hover:text-[#C0392B] transition-colors px-1.5"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

type FilterStatus = SuggestionStatus | "all";
type FilterCategory = SuggestionCategory | "all";

export default function SuggestionsPage() {
  const storage = useSuggestionStorage();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSubmit, setShowSubmit]   = useState(false);
  const [filterStatus, setFilterStatus]     = useState<FilterStatus>("all");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");

  const reload = useCallback(async () => {
    const all = await storage.list();
    setSuggestions(all.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)));
  }, [storage]);

  useEffect(() => { reload(); }, [reload]);

  const handleSubmit = async (
    title: string, body: string,
    category: SuggestionCategory, visibility: SuggestionVisibility
  ) => {
    const now = new Date().toISOString();
    await storage.save({
      id: generateId(), title, body, category, visibility,
      submittedBy: CURRENT_USER,
      submittedAt: now, updatedAt: now,
      status: "open",
      votes: { up: [], down: [] },
      tags: [],
    });
    setShowSubmit(false);
    reload();
  };

  const handleVote = async (id: string, dir: "up" | "down" | "none") => {
    await storage.vote(id, CURRENT_USER, dir);
    reload();
  };

  const handleStatusChange = async (id: string, status: SuggestionStatus) => {
    await storage.setStatus(id, status);
    reload();
  };

  const handleDelete = async (id: string) => {
    await storage.remove(id);
    reload();
  };

  const filtered = suggestions.filter((s) => {
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    if (filterCategory !== "all" && s.category !== filterCategory) return false;
    return true;
  });

  const statusFilters: { id: FilterStatus; label: string }[] = [
    { id: "all", label: "All" },
    { id: "open", label: "Open" },
    { id: "under-review", label: "Under Review" },
    { id: "accepted", label: "Accepted" },
    { id: "declined", label: "Declined" },
  ];

  const categoryFilters: { id: FilterCategory; label: string }[] = [
    { id: "all", label: "All Categories" },
    ...Object.entries(CATEGORY_LABELS).map(([id, label]) => ({ id: id as SuggestionCategory, label })),
  ];

  return (
    <>
      <PageShell
        title="Suggestions"
        subtitle="A shared pool — submit ideas, vote on priorities, track outcomes"
        action={
          <button
            onClick={() => setShowSubmit(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium bg-[#1D1D1F] text-white rounded-xl hover:bg-[#3D3D3D] transition-colors"
          >
            <PlusIcon />
            New Suggestion
          </button>
        }
      >
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex gap-1">
            {statusFilters.map((f) => (
              <button key={f.id} onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1.5 rounded-lg text-[12px] transition-colors ${
                  filterStatus === f.id
                    ? "bg-[#1D1D1F] text-white font-medium"
                    : "text-[#6E6E73] hover:bg-[#F5F5F7]"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
            className="text-[12px] text-[#6E6E73] border border-[#E5E5EA] rounded-lg px-3 py-1.5 bg-white outline-none focus:border-[#0066CC] cursor-pointer"
          >
            {categoryFilters.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {suggestions.length === 0 ? (
              <>
                <p className="text-[14px] font-medium text-[#6E6E73]">No suggestions yet</p>
                <p className="text-[13px] text-[#AEAEB2] mt-1 max-w-xs">
                  Submit the first one. Any vault-access team member can contribute.
                </p>
                <button
                  onClick={() => setShowSubmit(true)}
                  className="mt-5 flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium bg-[#1D1D1F] text-white rounded-xl hover:bg-[#3D3D3D] transition-colors"
                >
                  <PlusIcon /> New Suggestion
                </button>
              </>
            ) : (
              <p className="text-[14px] text-[#AEAEB2]">No suggestions match this filter</p>
            )}
          </div>
        ) : (
          <div className="space-y-3 max-w-3xl">
            {filtered.map((s) => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                onVote={handleVote}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </PageShell>

      {showSubmit && (
        <SubmitModal onClose={() => setShowSubmit(false)} onSubmit={handleSubmit} />
      )}
    </>
  );
}
