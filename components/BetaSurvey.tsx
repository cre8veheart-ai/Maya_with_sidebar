"use client";

import { useState } from "react";
import { recordSurvey, getBetaProfile } from "@/lib/beta/betaGate";

const EXEC_ROLES = [
  "CEO", "COO", "CFO", "CMO", "CTO", "CIO", "CRO", "CD",
  "Office Admin", "HR", "Legal", "Multiple",
];

const FREQUENCIES = [
  "Daily", "Several times a week", "Weekly", "A few times this month", "Just getting started",
];

interface Props {
  onComplete: () => void;
}

export default function BetaSurvey({ onComplete }: Props) {
  const profile = getBetaProfile();
  const firstName = profile?.name?.split(" ")[0] ?? "there";

  const [form, setForm] = useState({
    frequency: "",
    topLens: "",
    rating: 0,
    working: "",
    missing: "",
    recommend: "",
    priorities: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function set(k: keyof typeof form, v: string | number) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    recordSurvey();
    setSubmitted(true);
  }

  const canSubmit =
    form.frequency && form.topLens && form.rating > 0 &&
    form.working.trim() && form.missing.trim() && form.recommend;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#1e1e2e] border border-[#313244] rounded-2xl p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#a6e3a1]/10 border border-[#a6e3a1]/20 mb-2">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-[18px] font-bold text-[#cdd6f4]">Thank you, {firstName}.</h2>
          <p className="text-[13px] text-[#a6adc8]">
            Your feedback shapes the next version of MAYA. Every response goes directly to the product team — no intermediary, no filter.
          </p>
          {profile && (
            <p className="text-[12px] text-[#585b70]">
              {profile.title} · {profile.company}
            </p>
          )}
          <button
            onClick={onComplete}
            className="w-full py-3 bg-[#89b4fa] text-[#1e1e2e] rounded-xl text-[13px] font-bold hover:bg-[#b4d0fb] transition-colors mt-2"
          >
            Return to MAYA →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#89b4fa]/10 border border-[#89b4fa]/20 mb-4">
            <span className="text-2xl">✦</span>
          </div>
          <h1 className="text-[20px] font-bold text-[#cdd6f4]">Monthly Beta Check-in</h1>
          <p className="text-[13px] text-[#585b70] mt-1">
            {firstName}
            {profile ? ` · ${profile.title}, ${profile.company}` : ""} · Required monthly to maintain access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-6 space-y-6">

          {/* Q1 Frequency */}
          <div>
            <p className="text-[13px] font-semibold text-[#cdd6f4] mb-3">
              1. How often did you use MAYA this month?
            </p>
            <div className="flex flex-wrap gap-2">
              {FREQUENCIES.map((f) => (
                <button
                  key={f} type="button"
                  onClick={() => set("frequency", f)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors border ${
                    form.frequency === f
                      ? "bg-[#89b4fa] text-[#1e1e2e] border-[#89b4fa]"
                      : "bg-[#313244] text-[#a6adc8] border-[#45475a] hover:bg-[#45475a]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Q2 Top lens */}
          <div>
            <p className="text-[13px] font-semibold text-[#cdd6f4] mb-3">
              2. Which exec lens did you use most?
            </p>
            <div className="flex flex-wrap gap-2">
              {EXEC_ROLES.map((r) => (
                <button
                  key={r} type="button"
                  onClick={() => set("topLens", r)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors border ${
                    form.topLens === r
                      ? "bg-[#89b4fa] text-[#1e1e2e] border-[#89b4fa]"
                      : "bg-[#313244] text-[#a6adc8] border-[#45475a] hover:bg-[#45475a]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Q3 Rating */}
          <div>
            <p className="text-[13px] font-semibold text-[#cdd6f4] mb-3">
              3. Overall experience this month
            </p>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n} type="button"
                  onClick={() => set("rating", n)}
                  className={`w-10 h-10 rounded-xl text-[14px] font-bold transition-colors border ${
                    form.rating === n
                      ? "bg-[#89b4fa] text-[#1e1e2e] border-[#89b4fa]"
                      : "bg-[#313244] text-[#a6adc8] border-[#45475a] hover:bg-[#45475a]"
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="text-[11px] text-[#585b70] self-center ml-1">1 = poor · 5 = excellent</span>
            </div>
          </div>

          {/* Q4 Working */}
          <div>
            <label className="block text-[13px] font-semibold text-[#cdd6f4] mb-2">
              4. What's working well?
            </label>
            <textarea
              value={form.working}
              onChange={(e) => set("working", e.target.value)}
              placeholder="What has MAYA done well for you this month…"
              rows={3}
              required
              className="w-full bg-[#313244] border border-[#45475a] rounded-xl px-3 py-2.5 text-[13px] text-[#cdd6f4] placeholder-[#585b70] resize-none focus:outline-none focus:border-[#89b4fa] transition-colors"
            />
          </div>

          {/* Q5 Missing */}
          <div>
            <label className="block text-[13px] font-semibold text-[#cdd6f4] mb-2">
              5. What's missing or frustrating?
            </label>
            <textarea
              value={form.missing}
              onChange={(e) => set("missing", e.target.value)}
              placeholder="Be direct — what's not working, what's missing, what's annoying…"
              rows={3}
              required
              className="w-full bg-[#313244] border border-[#45475a] rounded-xl px-3 py-2.5 text-[13px] text-[#cdd6f4] placeholder-[#585b70] resize-none focus:outline-none focus:border-[#89b4fa] transition-colors"
            />
          </div>

          {/* Q6 Recommend */}
          <div>
            <p className="text-[13px] font-semibold text-[#cdd6f4] mb-3">
              6. Would you recommend MAYA to a peer executive?
            </p>
            <div className="flex gap-2">
              {["Yes, already have", "Yes, planning to", "Maybe — not yet", "No"].map((opt) => (
                <button
                  key={opt} type="button"
                  onClick={() => set("recommend", opt)}
                  className={`flex-1 px-2 py-2 rounded-lg text-[11px] font-medium transition-colors border text-center ${
                    form.recommend === opt
                      ? "bg-[#89b4fa] text-[#1e1e2e] border-[#89b4fa]"
                      : "bg-[#313244] text-[#a6adc8] border-[#45475a] hover:bg-[#45475a]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Q7 Priorities */}
          <div>
            <label className="block text-[13px] font-semibold text-[#cdd6f4] mb-2">
              7. Any features you'd prioritise next? <span className="text-[#585b70] font-normal">(optional)</span>
            </label>
            <textarea
              value={form.priorities}
              onChange={(e) => set("priorities", e.target.value)}
              placeholder="Mobile app, deeper integrations, specific lens improvements…"
              rows={2}
              className="w-full bg-[#313244] border border-[#45475a] rounded-xl px-3 py-2.5 text-[13px] text-[#cdd6f4] placeholder-[#585b70] resize-none focus:outline-none focus:border-[#89b4fa] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-3 bg-[#89b4fa] text-[#1e1e2e] rounded-xl text-[13px] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b4d0fb] transition-colors"
          >
            Submit & Enter MAYA
          </button>
          <p className="text-center text-[10px] text-[#585b70]">
            Your responses go directly to the product team. Required every 30 days.
          </p>
        </form>
      </div>
    </div>
  );
}
