"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import ProviderControls from "@/components/ProviderControls";
import { loadLens } from "@/lib/maya/lensStorage";
import {
  getProviderModel,
  loadProviderSettings,
  saveProviderSettings,
} from "@/lib/maya/providerStorage";
import type { ProviderSettings } from "@/lib/maya/types";

interface IntelSource {
  id: string;
  source: "decisions" | "knowledge" | "intel";
  title: string;
  summary: string;
  content: string;
  updatedAt: string;
  confidence: "high" | "medium";
  tags: string[];
}

const QUICK_QUERIES = [
  "What does MAYA think I should focus on this week as CEO?",
  "Where is cross-functional drift most likely to hurt execution right now?",
  "What internal evidence should shape the next board narrative?",
];

const SOURCE_META: Record<IntelSource["source"], { label: string; accent: string }> = {
  decisions: { label: "Decisions", accent: "text-[#a6e3a1]" },
  knowledge: { label: "Knowledge", accent: "text-[#89b4fa]" },
  intel: { label: "Intel", accent: "text-[#f9e2af]" },
};

export default function CeoIntelConsole() {
  const [providerSettings, setProviderSettings] = useState<ProviderSettings>({
    provider: "anthropic",
    anthropicModel: "",
    openClawModel: "",
    ludicrousMode: false,
  });
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState(
    "MAYA CEO hardened intel is ready. Ask for a recommendation, board view, risk readout, or execution synthesis."
  );
  const [sources, setSources] = useState<IntelSource[]>([]);
  const [mode, setMode] = useState<"provider-synthesis" | "fallback-synthesis" | null>(null);
  const [loading, setLoading] = useState(false);
  const lens = useMemo(() => loadLens("ceo"), []);

  useEffect(() => {
    setProviderSettings(loadProviderSettings());
  }, []);

  function updateProviderSettings(next: ProviderSettings) {
    setProviderSettings(next);
    saveProviderSettings(next);
  }

  async function runQuery(nextQuery: string) {
    const trimmed = nextQuery.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setQuery(trimmed);

    try {
      const res = await fetch("/api/ceo-intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          lens,
          provider: providerSettings.provider,
          model: getProviderModel(providerSettings),
          ludicrousMode: providerSettings.ludicrousMode,
        }),
      });

      const payload = (await res.json()) as {
        answer?: string;
        error?: string;
        mode?: "provider-synthesis" | "fallback-synthesis";
        sources?: IntelSource[];
      };

      if (!res.ok) {
        throw new Error(payload.error || "CEO intel request failed");
      }

      setAnswer(payload.answer || "No MAYA synthesis returned.");
      setSources(Array.isArray(payload.sources) ? payload.sources : []);
      setMode(payload.mode || null);
    } catch (error) {
      setAnswer(
        error instanceof Error
          ? error.message
          : "CEO intel request failed."
      );
      setSources([]);
      setMode("fallback-synthesis");
    } finally {
      setLoading(false);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    void runQuery(query);
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-4 py-2.5 border-b border-[#313244] shrink-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a6e3a1]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">
            MAYA · CEO Hardened Intel
          </span>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <span className="text-[11px] text-[#89b4fa] uppercase tracking-[0.07em]">
            Intel-first
          </span>
          <span className="text-[11px] text-[#a6adc8] uppercase tracking-[0.07em]">
            {providerSettings.provider === "anthropic" ? "Claude" : "OpenClaw"}
          </span>
          {mode && (
            <span className="text-[11px] text-[#f9e2af] uppercase tracking-[0.07em]">
              {mode === "provider-synthesis" ? "Synthesized" : "Fallback"}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 py-3 border-b border-[#313244] shrink-0">
        <ProviderControls
          settings={providerSettings}
          onChange={updateProviderSettings}
          compact
        />
      </div>

      <div className="px-4 py-3 border-b border-[#313244] shrink-0">
        <div className="flex flex-wrap gap-2">
          {QUICK_QUERIES.map((quickQuery) => (
            <button
              key={quickQuery}
              type="button"
              onClick={() => void runQuery(quickQuery)}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#313244] text-[#a6adc8] hover:bg-[#45475a] hover:text-[#cdd6f4] transition-colors"
            >
              {quickQuery}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        <div className="rounded-xl border border-[#313244] bg-[#181825] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-2">
            MAYA Readout
          </p>
          <div className="text-[13px] leading-relaxed whitespace-pre-wrap text-[#cdd6f4]">
            {loading ? "Pulling from MAYA hardened intel layer…" : answer}
          </div>
        </div>

        <div className="rounded-xl border border-[#313244] bg-[#1e1e2e] p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">
                Retrieved Internal Sources
              </p>
              <p className="text-[12px] text-[#585b70] mt-1">
                CEO answers are grounded in MAYA Decisions, Knowledge, and Intel before synthesis.
              </p>
            </div>
            <span className="text-[11px] text-[#89b4fa]">
              {sources.length} source{sources.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="space-y-3">
            {sources.length === 0 ? (
              <p className="text-[12px] text-[#585b70]">
                Run a CEO query to inspect the hardened evidence MAYA used.
              </p>
            ) : (
              sources.map((source) => (
                <div
                  key={source.id}
                  className="rounded-lg border border-[#313244] bg-[#181825] p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-semibold text-[#cdd6f4]">
                        {source.title}
                      </p>
                      <p className="text-[11px] text-[#585b70] mt-1">
                        {source.summary}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-[11px] font-semibold uppercase tracking-[0.07em] ${SOURCE_META[source.source].accent}`}>
                        {SOURCE_META[source.source].label}
                      </p>
                      <p className="text-[10px] text-[#585b70] mt-1">
                        {source.confidence} · {source.updatedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {source.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#313244] text-[#a6adc8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="px-4 py-3 border-t border-[#313244] shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Query MAYA hardened CEO intel…"
            rows={1}
            className="flex-1 bg-[#313244] border border-[#45475a] rounded-xl px-3 py-2.5 text-[13px] text-[#cdd6f4] placeholder-[#585b70] resize-none focus:outline-none focus:border-[#89b4fa] transition-colors"
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="px-4 py-2.5 bg-[#89b4fa] text-[#1e1e2e] rounded-xl text-[12px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b4d0fb] transition-colors shrink-0"
          >
            Query
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-[#585b70]">
          Internal intel first · Provider only synthesizes retrieved MAYA evidence
        </p>
      </form>
    </div>
  );
}
