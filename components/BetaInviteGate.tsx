"use client";

import { useState } from "react";
import { saveBetaProfile, type BetaProfile } from "@/lib/beta/betaGate";

const INDUSTRIES = [
  "Technology", "Finance & Banking", "Healthcare", "Legal & Professional Services",
  "Media & Creative", "Real Estate", "Manufacturing", "Retail & Consumer",
  "Education", "Government & Public Sector", "Energy", "Other",
];

const COMPANY_SIZES = [
  "1–10 (Startup)", "11–50 (Small)", "51–200 (Mid-Market)",
  "201–1000 (Growth)", "1000+ (Enterprise)",
];

const EXEC_ROLES = [
  { value: "ceo", label: "CEO — Chief Executive Officer" },
  { value: "coo", label: "COO — Chief Operating Officer" },
  { value: "cfo", label: "CFO — Chief Financial Officer" },
  { value: "cmo", label: "CMO — Chief Marketing Officer" },
  { value: "cto", label: "CTO — Chief Technology Officer" },
  { value: "cio", label: "CIO — Chief Information Officer" },
  { value: "cro", label: "CRO — Chief Revenue Officer" },
  { value: "cd", label: "CD — Creative Director" },
  { value: "admin", label: "Office Administrator / Executive Assistant" },
  { value: "hr", label: "HR / People Operations" },
  { value: "legal", label: "Legal / General Counsel" },
];

interface Props {
  onApproved: (profile: BetaProfile) => void;
}

type Step = "code" | "profile" | "welcome";

export default function BetaInviteGate({ onApproved }: Props) {
  const [step, setStep] = useState<Step>("code");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [inviteCodes, setInviteCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", title: "", company: "", industry: "",
    companySize: "", primaryRole: "", useCase: "",
  });
  const [profile, setProfile] = useState<BetaProfile | null>(null);

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCodeError("");
    setCodeLoading(true);
    try {
      const res = await fetch("/api/beta-validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        setInviteCodes(data.inviteCodes ?? []);
        setStep("profile");
      } else {
        setCodeError("That code isn't recognised. Check with your contact and try again.");
      }
    } catch {
      setCodeError("Connection error. Please try again.");
    } finally {
      setCodeLoading(false);
    }
  }

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    const built: BetaProfile = {
      ...form,
      approvedAt: new Date().toISOString(),
      inviteCodes,
    };
    saveBetaProfile(built);
    setProfile(built);
    setStep("welcome");
  }

  function field(id: keyof typeof form) {
    return (v: string) => setForm((f) => ({ ...f, [id]: v }));
  }

  function copyCode(c: string) {
    navigator.clipboard.writeText(c).catch(() => {});
    setCopied(c);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#89b4fa]/10 border border-[#89b4fa]/20 mb-4">
            <span className="text-2xl">✦</span>
          </div>
          <h1 className="text-2xl font-bold text-[#cdd6f4] tracking-tight">MAYA</h1>
          <p className="text-[13px] text-[#585b70] mt-1">Executive Intelligence Platform · Private Beta</p>
        </div>

        {/* ── Step 1: Invite code ── */}
        {step === "code" && (
          <form onSubmit={handleCodeSubmit} className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-[15px] font-semibold text-[#cdd6f4]">You've been invited</h2>
              <p className="text-[13px] text-[#585b70] mt-1">
                MAYA is invite-only during beta. Enter the code shared with you to request access.
              </p>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-2">
                Invite Code
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="MAYA-EXEC-XXXX"
                className="w-full bg-[#313244] border border-[#45475a] rounded-xl px-4 py-3 text-[14px] text-[#cdd6f4] placeholder-[#585b70] focus:outline-none focus:border-[#89b4fa] transition-colors font-mono tracking-wider"
                autoComplete="off"
                spellCheck={false}
              />
              {codeError && (
                <p className="mt-2 text-[12px] text-[#f38ba8]">{codeError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={!code.trim() || codeLoading}
              className="w-full py-3 bg-[#89b4fa] text-[#1e1e2e] rounded-xl text-[13px] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b4d0fb] transition-colors"
            >
              {codeLoading ? "Verifying…" : "Verify Code"}
            </button>
            <p className="text-center text-[11px] text-[#585b70]">
              Don't have a code? Contact a current beta tester or the MAYA team.
            </p>
          </form>
        )}

        {/* ── Step 2: Profile ── */}
        {step === "profile" && (
          <form onSubmit={handleProfileSubmit} className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-[15px] font-semibold text-[#cdd6f4]">Tell us about yourself</h2>
              <p className="text-[13px] text-[#585b70] mt-1">
                MAYA personalises your experience based on your role and org. This takes 60 seconds.
              </p>
            </div>

            {[
              { id: "name" as const, label: "Full Name", placeholder: "Jane Smith" },
              { id: "title" as const, label: "Title / Position", placeholder: "Chief Executive Officer" },
              { id: "company" as const, label: "Company", placeholder: "Acme Corp" },
            ].map(({ id, label, placeholder }) => (
              <div key={id}>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-1.5">
                  {label}
                </label>
                <input
                  value={form[id]}
                  onChange={(e) => field(id)(e.target.value)}
                  placeholder={placeholder}
                  required
                  className="w-full bg-[#313244] border border-[#45475a] rounded-xl px-3 py-2.5 text-[13px] text-[#cdd6f4] placeholder-[#585b70] focus:outline-none focus:border-[#89b4fa] transition-colors"
                />
              </div>
            ))}

            {[
              { id: "industry" as const, label: "Industry", options: INDUSTRIES },
              { id: "companySize" as const, label: "Company Size", options: COMPANY_SIZES },
            ].map(({ id, label, options }) => (
              <div key={id}>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-1.5">
                  {label}
                </label>
                <select
                  value={form[id]}
                  onChange={(e) => field(id)(e.target.value)}
                  required
                  className="w-full bg-[#313244] border border-[#45475a] rounded-xl px-3 py-2.5 text-[13px] text-[#cdd6f4] focus:outline-none focus:border-[#89b4fa] transition-colors"
                >
                  <option value="">Select…</option>
                  {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-1.5">
                Primary Exec Role (which lens will you use most?)
              </label>
              <select
                value={form.primaryRole}
                onChange={(e) => field("primaryRole")(e.target.value)}
                required
                className="w-full bg-[#313244] border border-[#45475a] rounded-xl px-3 py-2.5 text-[13px] text-[#cdd6f4] focus:outline-none focus:border-[#89b4fa] transition-colors"
              >
                <option value="">Select your primary role…</option>
                {EXEC_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-1.5">
                What problem do you hope MAYA solves for you?
              </label>
              <textarea
                value={form.useCase}
                onChange={(e) => field("useCase")(e.target.value)}
                placeholder="e.g. Staying on top of decisions across functions without losing strategic altitude…"
                rows={3}
                required
                className="w-full bg-[#313244] border border-[#45475a] rounded-xl px-3 py-2.5 text-[13px] text-[#cdd6f4] placeholder-[#585b70] resize-none focus:outline-none focus:border-[#89b4fa] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={Object.values(form).some((v) => !v.trim())}
              className="w-full py-3 bg-[#89b4fa] text-[#1e1e2e] rounded-xl text-[13px] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b4d0fb] transition-colors"
            >
              Enter MAYA
            </button>
          </form>
        )}

        {/* ── Step 3: Personalised welcome ── */}
        {step === "welcome" && profile && (
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-6 space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#a6e3a1] mb-2">Access Granted</p>
              <h2 className="text-[18px] font-bold text-[#cdd6f4]">
                Welcome, {profile.name.split(" ")[0]}.
              </h2>
              <p className="text-[13px] text-[#a6adc8] mt-1">
                Your {profile.title} lens at {profile.company} is ready. MAYA adapts to you through use — the more context you give it, the sharper it gets.
              </p>
            </div>

            <div className="bg-[#313244] rounded-xl p-4 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">Your Role</p>
              <p className="text-[13px] text-[#cdd6f4]">{profile.title} · {profile.company}</p>
              <p className="text-[11px] text-[#585b70]">{profile.industry} · {profile.companySize}</p>
            </div>

            {inviteCodes.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086] mb-2">
                  Your 3 Invite Codes — Share with Fellow Executives
                </p>
                <div className="space-y-2">
                  {inviteCodes.map((c) => (
                    <button
                      key={c}
                      onClick={() => copyCode(c)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-[#313244] rounded-xl hover:bg-[#45475a] transition-colors group"
                    >
                      <span className="text-[13px] font-mono text-[#89b4fa] tracking-wider">{c}</span>
                      <span className="text-[11px] text-[#585b70] group-hover:text-[#a6adc8] transition-colors">
                        {copied === c ? "Copied ✓" : "Copy"}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#585b70] mt-2">
                  Each code is single-use. Share only with executives you'd vouch for personally.
                </p>
              </div>
            )}

            <button
              onClick={() => onApproved(profile)}
              className="w-full py-3 bg-[#89b4fa] text-[#1e1e2e] rounded-xl text-[13px] font-bold hover:bg-[#b4d0fb] transition-colors"
            >
              Enter MAYA →
            </button>
            <p className="text-center text-[10px] text-[#585b70]">Doesn't act without you.</p>
          </div>
        )}
      </div>
    </div>
  );
}
