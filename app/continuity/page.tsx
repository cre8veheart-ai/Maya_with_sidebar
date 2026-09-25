"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";

interface ContinuityViewerProps {}

export default function ContinuityPage() {
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch content on mount
  if (loading && content === "") {
    fetch("/api/continuity/raw")
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch(() => {
        setContent("Failed to load continuity context.");
        setLoading(false);
      });
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <PageShell
      title="Founder Continuity Context"
      subtitle="Leslie + Ari working model and operational layers"
    >
      <div className="space-y-4 max-w-full">
        {/* Action bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleCopy}
            disabled={loading}
            className={[
              "px-4 py-2 rounded-lg text-[13px] font-semibold transition-all",
              copied
                ? "bg-[#a6e3a1] text-[#1e1e2e]"
                : "bg-[#89b4fa] text-[#1e1e2e] hover:bg-[#b4d0fb]",
              loading && "opacity-50 cursor-not-allowed",
            ].join(" ")}
          >
            {copied ? "✓ Copied to clipboard" : "Copy all to clipboard"}
          </button>
          <a
            href="/api/continuity/raw"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-[#313244] text-[#89b4fa] hover:bg-[#45475a] transition-colors"
          >
            Open raw text (Claude)
          </a>
          <span className="text-[12px] text-[#585b70]">
            or use Ctrl+A / Cmd+A to select all
          </span>
        </div>

        {/* Full-width selectable content viewer */}
        <div className="bg-white text-[#1e1e2e] rounded-xl p-8 border border-[#ccc] shadow-sm">
          {loading ? (
            <p className="text-[#585b70] text-[13px]">Loading context…</p>
          ) : (
            <div
              className="text-[13px] leading-relaxed whitespace-pre-wrap font-[monospace] select-all cursor-text"
              style={{
                userSelect: "all",
                WebkitUserSelect: "all",
              }}
            >
              {content}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="bg-[#181825] border border-[#313244] rounded-xl p-5">
          <p className="text-[12px] text-[#a6adc8] leading-relaxed">
            <strong>Full document view:</strong> Click anywhere in the white box and use Ctrl+A (or Cmd+A on Mac) to select all text, then paste into Notes, emails, or documents.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
