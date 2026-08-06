"use client";

import { useState, useEffect, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BetaUser {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  companySize: string;
  primaryRole: string;
  useCase: string;
  approvedAt: string;
  inviteCode: string;
}

interface InviteCode {
  code: string;
  used: boolean;
  usedBy?: string;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalCodes: number;
  usedCodes: number;
  availableCodes: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `MAYA-${seg()}-${seg()}`;
}

const CODES_KEY = "maya_admin_codes";
const USERS_KEY = "maya_admin_users";

function loadCodes(): InviteCode[] {
  try {
    const raw = localStorage.getItem(CODES_KEY);
    return raw ? (JSON.parse(raw) as InviteCode[]) : [];
  } catch {
    return [];
  }
}

function saveCodes(codes: InviteCode[]) {
  localStorage.setItem(CODES_KEY, JSON.stringify(codes));
}

function loadUsers(): BetaUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as BetaUser[]) : [];
  } catch {
    return [];
  }
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-4 flex flex-col gap-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">{label}</p>
      <p className={`text-3xl font-bold ${accent ? "text-[#89b4fa]" : "text-[#cdd6f4]"}`}>{value}</p>
    </div>
  );
}

// ── Code row ──────────────────────────────────────────────────────────────────

function CodeRow({
  code,
  onCopy,
  onRevoke,
}: {
  code: InviteCode;
  onCopy: (c: string) => void;
  onRevoke: (c: string) => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#313244] group">
      <div className="flex items-center gap-3">
        <span
          className={`w-1.5 h-1.5 rounded-full ${code.used ? "bg-[#585b70]" : "bg-[#a6e3a1]"}`}
        />
        <span className="font-mono text-[12px] text-[#cdd6f4]">{code.code}</span>
        {code.used && code.usedBy && (
          <span className="text-[10px] text-[#585b70]">— {code.usedBy}</span>
        )}
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!code.used && (
          <>
            <button
              onClick={() => onCopy(code.code)}
              className="text-[11px] text-[#89b4fa] border border-[#89b4fa]/30 px-2 py-0.5 rounded hover:bg-[#89b4fa]/10"
            >
              Copy
            </button>
            <button
              onClick={() => onRevoke(code.code)}
              className="text-[11px] text-[#f38ba8] border border-[#f38ba8]/30 px-2 py-0.5 rounded hover:bg-[#f38ba8]/10"
            >
              Revoke
            </button>
          </>
        )}
        {code.used && (
          <span className="text-[10px] text-[#585b70] italic">Used</span>
        )}
      </div>
    </div>
  );
}

// ── User row ──────────────────────────────────────────────────────────────────

function UserRow({ user }: { user: BetaUser }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-[#313244] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#313244] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#89b4fa]/20 flex items-center justify-center text-[11px] font-bold text-[#89b4fa]">
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </span>
          <div className="text-left">
            <p className="text-[13px] font-semibold text-[#cdd6f4]">{user.name}</p>
            <p className="text-[11px] text-[#585b70]">{user.title} — {user.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#a6adc8] bg-[#313244] px-2 py-0.5 rounded">
            {user.primaryRole.toUpperCase()}
          </span>
          <span className="text-[10px] text-[#585b70]">
            {new Date(user.approvedAt).toLocaleDateString()}
          </span>
          <span className="text-[#585b70] text-[11px]">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-[#313244] grid grid-cols-2 gap-3">
          {[
            ["Industry", user.industry],
            ["Company Size", user.companySize],
            ["Invite Code", user.inviteCode],
            ["Approved", new Date(user.approvedAt).toLocaleString()],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6c7086]">{k}</p>
              <p className="text-[12px] text-[#a6adc8] mt-0.5">{v}</p>
            </div>
          ))}
          <div className="col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6c7086]">Use Case</p>
            <p className="text-[12px] text-[#a6adc8] mt-0.5">{user.useCase}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Tab = "overview" | "codes" | "users" | "billing";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [users, setUsers] = useState<BetaUser[]>([]);
  const [generateCount, setGenerateCount] = useState(5);
  const [copied, setCopied] = useState<string | null>(null);
  const [adminPin, setAdminPin] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState("");

  // Simple PIN gate — in production this would be a server-side auth check
  const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN ?? "MAYA-ADMIN";

  useEffect(() => {
    if (pinVerified) {
      setCodes(loadCodes());
      setUsers(loadUsers());
    }
  }, [pinVerified]);

  const stats: AdminStats = {
    totalUsers: users.length,
    totalCodes: codes.length,
    usedCodes: codes.filter((c) => c.used).length,
    availableCodes: codes.filter((c) => !c.used).length,
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin.trim().toUpperCase() === ADMIN_PIN.toUpperCase()) {
      setPinVerified(true);
      setPinError("");
    } else {
      setPinError("Incorrect PIN. Check your NEXT_PUBLIC_ADMIN_PIN env var.");
    }
  };

  const handleGenerate = useCallback(() => {
    const newCodes: InviteCode[] = Array.from({ length: generateCount }, () => ({
      code: generateCode(),
      used: false,
      createdAt: new Date().toISOString(),
    }));
    const updated = [...codes, ...newCodes];
    setCodes(updated);
    saveCodes(updated);
  }, [codes, generateCount]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyAll = () => {
    const available = codes.filter((c) => !c.used).map((c) => c.code);
    navigator.clipboard.writeText(available.join("\n")).catch(() => {});
    setCopied("all");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRevoke = (code: string) => {
    const updated = codes.filter((c) => c.code !== code);
    setCodes(updated);
    saveCodes(updated);
  };

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "codes", label: "Invite Codes", icon: "🔑" },
    { id: "users", label: "Beta Users", icon: "👥" },
    { id: "billing", label: "Billing", icon: "💳" },
  ];

  // ── PIN gate ────────────────────────────────────────────────────────────────
  if (!pinVerified) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
        <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-8 w-full max-w-sm space-y-5">
          <div className="text-center">
            <p className="text-2xl mb-2">🔐</p>
            <h1 className="text-[17px] font-bold text-[#cdd6f4]">Admin Access</h1>
            <p className="text-[12px] text-[#585b70] mt-1">MAYA Beta Dashboard</p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-3">
            <input
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="Enter admin PIN"
              className="w-full bg-[#181825] border border-[#313244] rounded-lg px-3 py-2.5 text-[13px] text-[#cdd6f4] placeholder-[#585b70] focus:outline-none focus:border-[#89b4fa]/50"
            />
            {pinError && <p className="text-[11px] text-[#f38ba8]">{pinError}</p>}
            <button
              type="submit"
              className="w-full bg-[#89b4fa]/20 text-[#89b4fa] border border-[#89b4fa]/30 rounded-lg py-2.5 text-[13px] font-semibold hover:bg-[#89b4fa]/30 transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#1a1a2e] text-[#cdd6f4]">
      {/* Header */}
      <div className="border-b border-[#313244] bg-[#1e1e2e] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[#89b4fa]">MAYA Admin</h1>
          <p className="text-[11px] text-[#585b70]">Beta Program Dashboard</p>
        </div>
        <a
          href="/"
          className="text-[12px] text-[#585b70] hover:text-[#a6adc8] border border-[#313244] px-3 py-1.5 rounded-lg transition-colors"
        >
          ← Back to MAYA
        </a>
      </div>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <nav className="w-48 border-r border-[#313244] bg-[#1e1e2e] p-3 flex flex-col gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors text-left",
                tab === t.id
                  ? "bg-[#313244] text-[#89b4fa]"
                  : "text-[#a6adc8] hover:bg-[#313244]",
              ].join(" ")}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* ── Overview ── */}
          {tab === "overview" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-[17px] font-bold text-[#cdd6f4]">Overview</h2>
                <p className="text-[12px] text-[#585b70] mt-1">MAYA beta program at a glance</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Beta Users" value={stats.totalUsers} accent />
                <StatCard label="Total Codes" value={stats.totalCodes} />
                <StatCard label="Used Codes" value={stats.usedCodes} />
                <StatCard label="Available" value={stats.availableCodes} />
              </div>
              <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5 space-y-3">
                <h3 className="text-[13px] font-semibold text-[#cdd6f4]">Quick Actions</h3>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setTab("codes")}
                    className="text-[12px] text-[#89b4fa] border border-[#89b4fa]/30 px-4 py-2 rounded-lg hover:bg-[#89b4fa]/10 transition-colors"
                  >
                    Generate Invite Codes
                  </button>
                  <button
                    onClick={() => setTab("users")}
                    className="text-[12px] text-[#a6adc8] border border-[#313244] px-4 py-2 rounded-lg hover:bg-[#313244] transition-colors"
                  >
                    View Beta Users
                  </button>
                  <button
                    onClick={() => setTab("billing")}
                    className="text-[12px] text-[#a6adc8] border border-[#313244] px-4 py-2 rounded-lg hover:bg-[#313244] transition-colors"
                  >
                    Billing Setup
                  </button>
                </div>
              </div>
              <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5">
                <h3 className="text-[13px] font-semibold text-[#cdd6f4] mb-3">Beta Status</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#a6e3a1] animate-pulse" />
                  <span className="text-[12px] text-[#a6e3a1] font-semibold">Active</span>
                  <span className="text-[12px] text-[#585b70]">— invite-only access enabled</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Invite Codes ── */}
          {tab === "codes" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-[17px] font-bold text-[#cdd6f4]">Invite Codes</h2>
                <p className="text-[12px] text-[#585b70] mt-1">
                  Generate and distribute MAYA beta invite codes
                </p>
              </div>

              {/* Generator */}
              <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5 space-y-4">
                <h3 className="text-[13px] font-semibold text-[#cdd6f4]">Generate New Codes</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={generateCount}
                    onChange={(e) => setGenerateCount(Math.max(1, Math.min(50, +e.target.value)))}
                    className="w-20 bg-[#181825] border border-[#313244] rounded-lg px-3 py-2 text-[13px] text-[#cdd6f4] focus:outline-none focus:border-[#89b4fa]/50"
                  />
                  <span className="text-[13px] text-[#585b70]">codes</span>
                  <button
                    onClick={handleGenerate}
                    className="text-[12px] font-semibold text-[#89b4fa] border border-[#89b4fa]/30 px-4 py-2 rounded-lg hover:bg-[#89b4fa]/10 transition-colors"
                  >
                    Generate
                  </button>
                  {codes.filter((c) => !c.used).length > 0 && (
                    <button
                      onClick={handleCopyAll}
                      className="text-[12px] text-[#a6adc8] border border-[#313244] px-4 py-2 rounded-lg hover:bg-[#313244] transition-colors"
                    >
                      {copied === "all" ? "Copied!" : "Copy All Available"}
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#585b70]">
                  Codes use format MAYA-XXXX-XXXX. Add generated codes to your{" "}
                  <code className="text-[#89b4fa]">BETA_INVITE_CODES</code> environment variable
                  (comma-separated) to activate them.
                </p>
              </div>

              {/* Code list */}
              <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5 space-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-semibold text-[#cdd6f4]">All Codes</h3>
                  <div className="flex gap-3 text-[11px] text-[#585b70]">
                    <span>
                      <span className="text-[#a6e3a1]">●</span> Available: {stats.availableCodes}
                    </span>
                    <span>
                      <span className="text-[#585b70]">●</span> Used: {stats.usedCodes}
                    </span>
                  </div>
                </div>
                {codes.length === 0 ? (
                  <p className="text-[12px] text-[#585b70] py-4 text-center">
                    No codes yet — generate some above
                  </p>
                ) : (
                  codes.map((c) => (
                    <CodeRow
                      key={c.code}
                      code={c}
                      onCopy={handleCopy}
                      onRevoke={handleRevoke}
                    />
                  ))
                )}
              </div>
              {copied && copied !== "all" && (
                <p className="text-[11px] text-[#a6e3a1]">✓ Copied: {copied}</p>
              )}
            </div>
          )}

          {/* ── Beta Users ── */}
          {tab === "users" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-[17px] font-bold text-[#cdd6f4]">Beta Users</h2>
                <p className="text-[12px] text-[#585b70] mt-1">
                  Approved beta participants and their profiles
                </p>
              </div>
              {users.length === 0 ? (
                <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-8 flex flex-col items-center gap-2">
                  <span className="text-3xl">👥</span>
                  <p className="text-[13px] text-[#585b70]">No beta users yet</p>
                  <p className="text-[12px] text-[#585b70] text-center max-w-xs">
                    Users who complete the beta invite flow will appear here. Their profiles are stored locally until Vercel KV is connected.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((u) => (
                    <UserRow key={u.id} user={u} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Billing ── */}
          {tab === "billing" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-[17px] font-bold text-[#cdd6f4]">Billing</h2>
                <p className="text-[12px] text-[#585b70] mt-1">
                  In-app purchases and source connector subscriptions
                </p>
              </div>

              {/* Stripe setup */}
              <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-semibold text-[#cdd6f4]">Stripe Integration</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#f9e2af] border border-[#f9e2af]/30 px-2 py-0.5 rounded">
                    Setup Required
                  </span>
                </div>
                <p className="text-[12px] text-[#a6adc8]">
                  MAYA uses Stripe for in-app purchases. Add your Stripe keys to enable billing.
                </p>
                <div className="space-y-2">
                  {[
                    { key: "STRIPE_SECRET_KEY", hint: "sk_live_... or sk_test_... from Stripe Dashboard → API Keys" },
                    { key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", hint: "pk_live_... or pk_test_... (safe to expose client-side)" },
                    { key: "STRIPE_WEBHOOK_SECRET", hint: "whsec_... from Stripe Dashboard → Webhooks" },
                  ].map(({ key, hint }) => (
                    <div key={key} className="bg-[#181825] border border-[#313244] rounded-lg p-3">
                      <p className="font-mono text-[11px] text-[#89b4fa]">{key}</p>
                      <p className="text-[10px] text-[#585b70] mt-0.5">{hint}</p>
                    </div>
                  ))}
                </div>
                <a
                  href="https://dashboard.stripe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[12px] text-[#89b4fa] border border-[#89b4fa]/30 px-4 py-2 rounded-lg hover:bg-[#89b4fa]/10 transition-colors"
                >
                  Open Stripe Dashboard ↗
                </a>
              </div>

              {/* Purchasable add-ons */}
              <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5 space-y-4">
                <h3 className="text-[13px] font-semibold text-[#cdd6f4]">Source Connector Add-ons</h3>
                <p className="text-[12px] text-[#a6adc8]">
                  These are the in-app purchasable add-ons — each unlocked per org. Beta users get all connectors free.
                </p>
                <div className="space-y-2">
                  {[
                    { name: "Westlaw", icon: "⚖️", price: "$149/mo per org", category: "Legal" },
                    { name: "LexisNexis", icon: "📰", price: "$129/mo per org", category: "Legal & News" },
                    { name: "Bloomberg Terminal", icon: "📊", price: "$299/mo per org", category: "Finance" },
                    { name: "FactSet", icon: "📈", price: "$249/mo per org", category: "Finance" },
                    { name: "IEEE Xplore", icon: "⚡", price: "$49/mo per org", category: "Engineering" },
                    { name: "JSTOR", icon: "📚", price: "$39/mo per org", category: "Academic" },
                    { name: "HBR", icon: "🎓", price: "$29/mo per org", category: "Business" },
                    { name: "PitchBook", icon: "🚀", price: "$199/mo per org", category: "VC / M&A" },
                  ].map((addon) => (
                    <div
                      key={addon.name}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#181825] border border-[#313244]"
                    >
                      <div className="flex items-center gap-2">
                        <span>{addon.icon}</span>
                        <div>
                          <p className="text-[12px] font-semibold text-[#cdd6f4]">{addon.name}</p>
                          <p className="text-[10px] text-[#585b70]">{addon.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[#a6adc8]">{addon.price}</span>
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-[#89b4fa] border border-[#89b4fa]/30 px-1.5 py-0.5 rounded">
                          Beta: Free
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#585b70]">
                  Pricing is indicative. Finalize before beta graduation. Stripe Products and Prices should be created in your Stripe Dashboard and linked via price IDs in env vars.
                </p>
              </div>

              {/* Cloud / Vercel KV */}
              <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-semibold text-[#cdd6f4]">Vercel KV (Cloud Storage)</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#f9e2af] border border-[#f9e2af]/30 px-2 py-0.5 rounded">
                    Setup Required
                  </span>
                </div>
                <p className="text-[12px] text-[#a6adc8]">
                  Vercel KV persists sessions, decisions, vault entries, and beta user data across devices. Without it, data lives in browser localStorage only.
                </p>
                <div className="space-y-2">
                  {[
                    { key: "KV_REST_API_URL", hint: "From Vercel Dashboard → Storage → KV → .env.local tab" },
                    { key: "KV_REST_API_TOKEN", hint: "From Vercel Dashboard → Storage → KV → .env.local tab" },
                    { key: "KV_REST_API_READ_ONLY_TOKEN", hint: "Optional — for read-only operations" },
                  ].map(({ key, hint }) => (
                    <div key={key} className="bg-[#181825] border border-[#313244] rounded-lg p-3">
                      <p className="font-mono text-[11px] text-[#89b4fa]">{key}</p>
                      <p className="text-[10px] text-[#585b70] mt-0.5">{hint}</p>
                    </div>
                  ))}
                </div>
                <a
                  href="https://vercel.com/docs/storage/vercel-kv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[12px] text-[#89b4fa] border border-[#89b4fa]/30 px-4 py-2 rounded-lg hover:bg-[#89b4fa]/10 transition-colors"
                >
                  Vercel KV Docs ↗
                </a>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
