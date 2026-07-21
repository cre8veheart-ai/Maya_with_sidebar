"use client";

import type { Decision } from "@/lib/types/decision";

const STATUS_STYLES: Record<Decision["status"], string> = {
  open: "bg-[#FFF3CD] text-[#856404]",
  decided: "bg-[#D1FAE5] text-[#065F46]",
  archived: "bg-[#F5F5F7] text-[#6E6E73]",
};

const STATUS_LABELS: Record<Decision["status"], string> = {
  open: "Open",
  decided: "Decided",
  archived: "Archived",
};

interface DecisionListProps {
  decisions: Decision[];
  onDelete: (id: string) => void;
}

export default function DecisionList({ decisions, onDelete }: DecisionListProps) {
  return (
    <div className="space-y-3">
      {decisions.map((d) => (
        <div
          key={d.id}
          className="bg-white border border-[#E5E5EA] rounded-xl p-5 group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${STATUS_STYLES[d.status]}`}
                >
                  {STATUS_LABELS[d.status]}
                </span>
                <span className="text-[11px] text-[#AEAEB2]">
                  {new Date(d.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h3 className="text-[15px] font-semibold text-[#1D1D1F] leading-snug">
                {d.title}
              </h3>
            </div>
            <button
              onClick={() => onDelete(d.id)}
              className="opacity-0 group-hover:opacity-100 text-[#AEAEB2] hover:text-red-500 transition-all flex-shrink-0 p-1 rounded"
              aria-label="Delete decision"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M11.5 3.5l-.7 8a1 1 0 01-1 .9H4.2a1 1 0 01-1-.9L2.5 3.5" />
              </svg>
            </button>
          </div>

          {(d.context || d.rationale || d.outcome) && (
            <div className="mt-3 space-y-2 border-t border-[#F5F5F7] pt-3">
              {d.context && (
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#AEAEB2]">Context</span>
                  <p className="text-[13px] text-[#3D3D3D] mt-0.5 leading-relaxed">{d.context}</p>
                </div>
              )}
              {d.rationale && (
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#AEAEB2]">Rationale</span>
                  <p className="text-[13px] text-[#3D3D3D] mt-0.5 leading-relaxed">{d.rationale}</p>
                </div>
              )}
              {d.outcome && (
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#AEAEB2]">Outcome</span>
                  <p className="text-[13px] text-[#3D3D3D] mt-0.5 leading-relaxed">{d.outcome}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
