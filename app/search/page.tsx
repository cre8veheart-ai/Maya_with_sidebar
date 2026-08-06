"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";

type Scope = "all" | "sessions" | "documents" | "decisions" | "tasks";

const SCOPES: { value: Scope; label: string; icon: string }[] = [
  { value: "all", label: "All", icon: "✦" },
  { value: "sessions", label: "Sessions", icon: "🗂️" },
  { value: "documents", label: "Documents", icon: "📄" },
  { value: "decisions", label: "Decisions", icon: "⚖️" },
  { value: "tasks", label: "Tasks", icon: "📋" },
];

interface ResultItem {
  id: number;
  title: string;
  excerpt: string;
  scope: Scope;
  role: string;
  date: string;
}

const SAMPLE_RESULTS: ResultItem[] = [
  {
    id: 1,
    title: "Q3 Budget Review — CFO Session",
    excerpt: "Revenue variance at 4.2% below projection. Discretionary freeze recommended pending Q4 outlook.",
    scope: "sessions",
    role: "CFO",
    date: "Aug 4, 2026",
  },
  {
    id: 2,
    title: "Brand Refresh Brief",
    excerpt: "Updated visual identity guidelines for the 2026 campaign cycle. Approved by CD and CMO.",
    scope: "documents",
    role: "CD",
    date: "Jul 28, 2026",
  },
  {
    id: 3,
    title: "Vendor contract — approved",
    excerpt: "Preferred vendor list updated. SaaS platform contract approved at $42k ARR. Legal reviewed.",
    scope: "decisions",
    role: "Legal",
    date: "Jul 20, 2026",
  },
  {
    id: 4,
    title: "Pipeline forecast update — CRO Session",
    excerpt: "Q3 pipeline at 118% capacity. Top deal: Meridian Corp ($1.2M). At risk: 2 deals stalled in legal.",
    scope: "sessions",
    role: "CRO",
    date: "Aug 2, 2026",
  },
  {
    id: 5,
    title: "Review Q3 budget variance report",
    excerpt: "Linked to CFO session. Due today. Priority: high.",
    scope: "tasks",
    role: "CFO",
    date: "Aug 6, 2026",
  },
];

const SCOPE_BADGE: Record<Scope, string> = {
  all: "text-[#cdd6f4] bg-[#313244]",
  sessions: "text-[#89b4fa] bg-[#89b4fa]/10",
  documents: "text-[#f9e2af] bg-[#f9e2af]/10",
  decisions: "text-[#a6e3a1] bg-[#a6e3a1]/10",
  tasks: "text-[#cba6f7] bg-[#cba6f7]/10",
};

const SCOPE_ICON: Record<Exclude<Scope, "all">, string> = {
  sessions: "🗂️",
  documents: "📄",
  decisions: "⚖️",
  tasks: "📋",
};

function ResultRow({ item }: { item: ResultItem }) {
  return (
    <div className="py-4 border-b border-[#313244] last:border-0 cursor-pointer hover:bg-[#181825] -mx-5 px-5 rounded-lg transition-colors">
      <div className="flex items-start justify-between gap-3 mb-1">
        <p className="text-[13px] font-semibold text-[#cdd6f4]">{item.title}</p>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${SCOPE_BADGE[item.scope]}`}>
          {SCOPE_ICON[item.scope as Exclude<Scope, "all">]} {item.scope}
        </span>
      </div>
      <p className="text-[12px] text-[#a6adc8] leading-relaxed line-clamp-2">{item.excerpt}</p>
      <p className="text-[11px] text-[#585b70] mt-1">{item.role} · {item.date}</p>
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<Scope>("all");
  const [submitted, setSubmitted] = useState(false);

  const results = SAMPLE_RESULTS.filter((r) => {
    const matchesScope = scope === "all" || r.scope === scope;
    const matchesQuery =
      !submitted ||
      !query.trim() ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.excerpt.toLowerCase().includes(query.toLowerCase());
    return matchesScope && matchesQuery;
  });

  function handleSearch() {
    setSubmitted(true);
  }

  return (
    <PageShell
      title="Search"
      subtitle="Find anything — sessions, documents, decisions, and tasks"
    >
      {/* Search bar */}
      <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl px-4 py-3 flex items-center gap-3 mb-5 focus-within:border-[#89b4fa]/50 transition-colors">
        <span className="text-[#585b70] text-base">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSubmitted(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search sessions, documents, decisions, tasks…"
          className="flex-1 bg-transparent text-[13px] text-[#cdd6f4] placeholder-[#585b70] focus:outline-none"
          autoFocus
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setSubmitted(false); }}
            className="text-[#585b70] hover:text-[#cdd6f4] transition-colors text-sm"
            aria-label="Clear"
          >
            ✕
          </button>
        )}
        <button
          onClick={handleSearch}
          className="text-[12px] font-semibold px-4 py-1.5 rounded-lg bg-[#89b4fa]/10 text-[#89b4fa] border border-[#89b4fa]/30 hover:bg-[#89b4fa]/20 transition-colors flex-shrink-0"
        >
          Search
        </button>
      </div>

      {/* Scope filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SCOPES.map((s) => (
          <button
            key={s.value}
            onClick={() => setScope(s.value)}
            className={[
              "text-[11px] font-semibold px-3 py-1 rounded-full transition-colors",
              scope === s.value
                ? "bg-[#89b4fa]/15 text-[#89b4fa] border border-[#89b4fa]/40"
                : "bg-[#1e1e2e] text-[#585b70] border border-[#313244] hover:text-[#cdd6f4]",
            ].join(" ")}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Results */}
        <div className="md:col-span-2 bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-2">
            {submitted && query ? `Results for "${query}"` : "Recent Activity"} ({results.length})
          </h2>
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <span className="text-3xl">🔍</span>
              <p className="text-[13px] text-[#585b70]">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-[#585b70]">Try a different scope or search term.</p>
            </div>
          ) : (
            results.map((r) => <ResultRow key={r.id} item={r} />)
          )}
        </div>

        {/* Tips */}
        <div className="space-y-4">
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-3">Search Scope</h2>
            <div className="space-y-2">
              {SCOPES.filter((s) => s.value !== "all").map((s) => (
                <div key={s.value} className="flex items-center gap-2">
                  <span className="text-base">{s.icon}</span>
                  <span className="text-[12px] text-[#a6adc8]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-4">
            <p className="text-[11px] text-[#585b70] leading-relaxed">
              MAYA search spans your full workspace — conversations, documents you&apos;ve uploaded, logged decisions, and active tasks.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
