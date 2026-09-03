"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import {
  loadSavedSessions,
  loadVaultClips,
  loadWorkItems,
} from "@/lib/maya/libraryData";

type SearchResult = {
  id: string;
  type: "Session" | "Vault clip" | "Work item";
  title: string;
  detail: string;
  href: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const records = useMemo<SearchResult[]>(() => {
    const sessions = loadSavedSessions()
      .filter((session) => !session.id.startsWith("seed-"))
      .map((session) => ({
        id: `session-${session.id}`,
        type: "Session" as const,
        title: session.title,
        detail: [session.query, session.answer].filter(Boolean).join(" "),
        href: "/library/sessions",
      }));

    const clips = loadVaultClips().map((clip) => ({
      id: `clip-${clip.id}`,
      type: "Vault clip" as const,
      title: clip.title,
      detail: [clip.content, clip.clipComment].filter(Boolean).join(" "),
      href: clip.vault === "decisions" ? "/decisions" : "/library/knowledge",
    }));

    const workItems = loadWorkItems().map((item) => ({
      id: `work-${item.id}`,
      type: "Work item" as const,
      title: item.title,
      detail: item.summary,
      href: item.type === "decision" ? "/decisions" : "/tasks",
    }));

    return [...sessions, ...clips, ...workItems];
  }, []);

  const normalized = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      normalized
        ? records.filter((record) =>
            [record.title, record.detail, record.type]
              .join(" ")
              .toLowerCase()
              .includes(normalized),
          )
        : [],
    [normalized, records],
  );

  return (
    <PageShell
      title="Search"
      subtitle="Find your saved MAYA sessions, approved clips, decisions, and work items."
    >
      <section className="rounded-2xl border border-[#313244] bg-[#1e1e2e] p-4 sm:p-6">
        <label htmlFor="maya-search" className="text-xs font-semibold uppercase tracking-wider text-[#6c7086]">
          Search General workspace
        </label>
        <input
          id="maya-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search your MAYA work…"
          className="mt-2 w-full rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 text-[#cdd6f4] outline-none placeholder:text-[#585b70] focus:border-[#89b4fa]"
          autoComplete="off"
        />
        <p className="mt-2 text-xs text-[#6c7086]">
          Client-vault search will activate only for the unlocked foreground client after encrypted retrieval is verified.
        </p>
      </section>

      <section className="mt-4 space-y-3" aria-live="polite">
        {!normalized && (
          <p className="rounded-xl border border-[#313244] bg-[#181825] p-5 text-sm text-[#7f849c]">
            Enter a word or phrase. Demo records are excluded.
          </p>
        )}
        {normalized && results.length === 0 && (
          <p className="rounded-xl border border-[#313244] bg-[#181825] p-5 text-sm text-[#7f849c]">
            No saved MAYA work matches “{query.trim()}”.
          </p>
        )}
        {results.map((result) => (
          <Link
            key={result.id}
            href={result.href}
            className="block rounded-xl border border-[#313244] bg-[#181825] p-4 transition-colors hover:border-[#89b4fa]/50 hover:bg-[#1e1e2e]"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-[#cdd6f4]">{result.title}</h2>
              <span className="shrink-0 rounded-full bg-[#313244] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#89b4fa]">
                {result.type}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#a6adc8]">{result.detail}</p>
          </Link>
        ))}
      </section>
    </PageShell>
  );
}
