"use client";

import type { KnowledgeEntry } from "@/lib/types/knowledge";

const CATEGORY_STYLES: Record<KnowledgeEntry["category"], string> = {
  strategy: "bg-[#E5F0FF] text-[#0066CC]",
  operations: "bg-[#F0FDF4] text-[#166534]",
  finance: "bg-[#FEF9C3] text-[#854D0E]",
  people: "bg-[#FDF4FF] text-[#7E22CE]",
  market: "bg-[#FFF7ED] text-[#9A3412]",
  product: "bg-[#F0F9FF] text-[#075985]",
  other: "bg-[#F5F5F7] text-[#6E6E73]",
};

interface KnowledgeListProps {
  entries: KnowledgeEntry[];
  onDelete: (id: string) => void;
}

export default function KnowledgeList({ entries, onDelete }: KnowledgeListProps) {
  return (
    <div className="space-y-3">
      {entries.map((e) => (
        <div
          key={e.id}
          className="bg-white border border-[#E5E5EA] rounded-xl p-5 group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${CATEGORY_STYLES[e.category]}`}
                >
                  {e.category}
                </span>
                <span className="text-[11px] text-[#AEAEB2]">
                  {new Date(e.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h3 className="text-[15px] font-semibold text-[#1D1D1F] leading-snug">
                {e.title}
              </h3>
            </div>
            <button
              onClick={() => onDelete(e.id)}
              className="opacity-0 group-hover:opacity-100 text-[#AEAEB2] hover:text-red-500 transition-all flex-shrink-0 p-1 rounded"
              aria-label="Delete entry"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M11.5 3.5l-.7 8a1 1 0 01-1 .9H4.2a1 1 0 01-1-.9L2.5 3.5" />
              </svg>
            </button>
          </div>

          <p className="mt-3 text-[13px] text-[#3D3D3D] leading-relaxed whitespace-pre-wrap border-t border-[#F5F5F7] pt-3">
            {e.content}
          </p>
        </div>
      ))}
    </div>
  );
}
