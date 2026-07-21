"use client";

import Link from "next/link";
import type { Workflow } from "@/lib/types/workflow";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-[#E8F5E9] text-[#1B5E20]",
  paused: "bg-[#FFF9C4] text-[#7B6B00]",
  completed: "bg-[#E3F2FD] text-[#0D47A1]",
  archived: "bg-[#F5F5F7] text-[#6E6E73]",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface WorkflowListProps {
  workflows: Workflow[];
  onDelete: (id: string) => void;
}

export default function WorkflowList({ workflows, onDelete }: WorkflowListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {workflows.map((wf) => (
        <div
          key={wf.id}
          className="group bg-[#F9F9FB] hover:bg-[#F0F0F2] border border-[#E5E5EA] rounded-xl p-4 transition-colors flex flex-col gap-2"
        >
          {/* Top row */}
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/workflow/${wf.id}`}
              className="text-[14px] font-medium text-[#1D1D1F] group-hover:text-[#0066CC] transition-colors leading-snug line-clamp-2"
            >
              {wf.title}
            </Link>
            <span
              className={`flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[wf.status] ?? STATUS_STYLES.archived}`}
            >
              {wf.status}
            </span>
          </div>

          {/* Description */}
          {wf.description && (
            <p className="text-[13px] text-[#6E6E73] line-clamp-2 leading-relaxed">
              {wf.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-[#AEAEB2]">
              Created {formatDate(wf.createdAt)}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                href={`/workflow/${wf.id}`}
                className="text-[12px] font-medium text-[#0066CC] hover:underline px-1"
              >
                Open
              </Link>
              <span className="text-[#E5E5EA]">·</span>
              <button
                onClick={() => onDelete(wf.id)}
                className="text-[12px] font-medium text-[#FF3B30] hover:underline px-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
