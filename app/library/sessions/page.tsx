"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";

const ROLES = ["All", "CEO", "COO", "CMO", "CFO", "CTO", "CIO", "CRO", "CD", "Strategy Room"];

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <span className="text-3xl">🗂️</span>
      <p className="text-[13px] text-[#585b70] text-center max-w-xs">
        Sessions save automatically as you work. Pick up exactly where you left off — every time.
      </p>
    </div>
  );
}

export default function SessionsPage() {
  const [activeRole, setActiveRole] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <PageShell
      title="Sessions"
      subtitle="Your full conversation history with Maya — never re-onboard"
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
              placeholder="Search sessions…"
              className="flex-1 bg-transparent text-[13px] text-[#cdd6f4] placeholder-[#585b70] focus:outline-none"
            />
          </div>

          {/* Role filter pills */}
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRole(r)}
                className={[
                  "text-[11px] font-semibold px-3 py-1 rounded-full transition-colors",
                  activeRole === r
                    ? "bg-[#89b4fa]/20 text-[#89b4fa] border border-[#89b4fa]/40"
                    : "bg-[#1e1e2e] border border-[#313244] text-[#585b70] hover:text-[#cdd6f4]",
                ].join(" ")}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Session list */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
              Recent Sessions
            </h2>
            <EmptyState />
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-4">
              Summary
            </h2>
            <div className="space-y-3">
              {[
                { label: "Total sessions", value: "0" },
                { label: "Roles active", value: "0" },
                { label: "Last session", value: "—" },
                { label: "Insights captured", value: "0" },
                { label: "Strategy Room sessions", value: "0" },
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
              How Sessions Work
            </h2>
            <div className="space-y-2">
              {[
                "Auto-saved — no manual action needed",
                "Filterable by exec role",
                "Resume from exactly where you left off",
                "Insights feed back into your Intel Vault",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2">
                  <span className="text-[#89b4fa] mt-0.5">·</span>
                  <span className="text-[12px] text-[#a6adc8]">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
