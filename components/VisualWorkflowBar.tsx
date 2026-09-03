"use client";

import { useState } from "react";

const WORKFLOW_STEPS = [
  { label: "Assets", href: "#visual-assets", note: "Adobe and imported media" },
  { label: "Layout", href: "#page-layout", note: "Arrange visuals and text" },
  { label: "Pitch Deck", href: "#pitch-deck", note: "Build and save slides" },
  { label: "Present", href: "#present", note: "Open PowerPoint or Teams" },
] as const;

export default function VisualWorkflowBar({
  workspaceLabel = "General",
}: {
  workspaceLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <aside
      className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 md:bottom-auto md:top-24"
      aria-label="Vault visual workflow"
    >
      {open ? (
        <nav id="vault-visual-workflow" className="w-64 overflow-hidden rounded-2xl border border-black/15 bg-[#171717] text-white shadow-2xl">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Vault visual workflow
            </p>
            <p className="mt-1 truncate text-sm font-semibold">Workspace: {workspaceLabel}</p>
          </div>
          <ol className="grid">
            {WORKFLOW_STEPS.map((step, index) => (
              <li key={step.href} className="border-b border-white/10 last:border-0">
                <a
                  href={step.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-black">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{step.label}</span>
                    <span className="block truncate text-xs text-white/50">{step.note}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="vault-visual-workflow"
        className="rounded-full bg-black px-4 py-3 text-sm font-semibold text-white shadow-xl ring-1 ring-white/20 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#89b4fa]"
      >
        {open ? "Close workflow" : "Visual workflow"}
      </button>
    </aside>
  );
}
