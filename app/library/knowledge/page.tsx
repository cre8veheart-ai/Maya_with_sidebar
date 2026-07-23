"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";

const VAULT_TYPES = ["All", "Overrides", "Context", "Decisions", "Scope", "Other"];

export default function KnowledgePage() {
  const [activeType, setActiveType] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <PageShell
      title="Knowledge Vault"
      subtitle="Protected org knowledge — decisions, context, and institutional memory"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main panel */}
        <div className="md:col-span-2 space-y-4">
          {/* Search */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-[#585b70]">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search knowledge vault…"
              className="flex-1 bg-transparent text-[13px] text-[#cdd6f4] placeholder-[#585b70] focus:outline-none"
            />
          </div>

          {/* Type filter */}
          <div className="flex flex-wrap gap-2">
            {VAULT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={[
                  "text-[11px] font-semibold px-3 py-1 rounded-full transition-colors",
                  activeType === t
                    ? "bg-[#89b4fa]/20 text-[#89b4fa] border border-[#89b4fa]/40"
                    : "bg-[#1e1e2e] border border-[#313244] text-[#585b70] hover:text-[#cdd6f4]",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Entries */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
              Stored Knowledge
            </h2>
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <span className="text-3xl">🔒</span>
              <p className="text-[13px] text-[#585b70] text-center max-w-xs">
                Knowledge builds as you use Maya
              </p>
              <p className="text-[12px] text-[#585b70] text-center max-w-xs">
                Every correction, override, and context note is stored here — owned by your org, not by Maya
              </p>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
              Vault Stats
            </h2>
            <div className="space-y-3">
              {[
                { label: "Entries", value: "0" },
                { label: "Roles covered", value: "0" },
                { label: "Overrides stored", value: "0" },
                { label: "Context notes", value: "0" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-[#313244] pb-2 last:border-0"
                >
                  <span className="text-[13px] text-[#cdd6f4]">{label}</span>
                  <span className="text-[13px] text-[#585b70]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-3">
              Access Control
            </h2>
            <p className="text-[12px] text-[#585b70]">
              Vault access is org-controlled. VPN integration available in Phase 2.
            </p>
          </div>

          {/* Way Back Machine */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">⏪</span>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">
                Way Back Machine
              </h2>
            </div>
            <p className="text-[12px] text-[#a6adc8] leading-relaxed">
              A compressed, queryable record of your org over time — decisions, priority shifts, role overrides, outcomes.
            </p>
            <p className="text-[12px] text-[#585b70] mt-2">
              Retrieved on demand, not loaded wholesale. Browsable as your vault grows.
            </p>
            <p className="text-[11px] text-[#585b70] mt-3 italic">
              Available as knowledge accumulates.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
