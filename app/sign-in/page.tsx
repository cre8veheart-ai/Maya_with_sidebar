"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────────

const EyeIcon = ({ visible }: { visible: boolean }) =>
  visible ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 2l12 12M6.7 6.8A2 2 0 0010 10M4.1 4.2C2.5 5.3 1 8 1 8s2.5 5 7 5c1.4 0 2.7-.4 3.8-1M7 3.1C7.3 3 7.7 3 8 3c4.5 0 7 5 7 5s-.7 1.4-1.9 2.7" />
    </svg>
  );

// ── Inner form (needs useSearchParams — wrapped in Suspense) ──────────────────

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials. Check your email and password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-[12px] font-medium text-[#A1A1A6] mb-1.5 tracking-wide uppercase">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/25 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-[12px] font-medium text-[#A1A1A6] mb-1.5 tracking-wide uppercase">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 pr-11 text-[14px] text-white placeholder-white/25 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon visible={showPassword} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-[13px] text-red-400">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !email || !password}
        className="w-full mt-2 bg-white text-[#1D1D1F] font-semibold text-[14px] py-3 rounded-xl hover:bg-white/90 active:bg-white/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0110 10" />
            </svg>
            Signing in…
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center px-4">
      {/* Subtle radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,102,204,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-[400px]">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-5">
            <span className="text-white text-2xl font-light select-none tracking-tight">✦</span>
          </div>
          <h1 className="text-[26px] font-semibold text-white tracking-tight">MAYA</h1>
          <p className="text-[13px] text-white/35 mt-1 tracking-wide">Executive Intelligence OS</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-8 py-8 backdrop-blur-xl">
          <h2 className="text-[17px] font-semibold text-white mb-1">Welcome back</h2>
          <p className="text-[13px] text-white/40 mb-7">Sign in to your workspace</p>

          <Suspense fallback={<div className="h-48" />}>
            <SignInForm />
          </Suspense>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-white/20 mt-6">
          Access is by invitation only.
        </p>
      </div>
    </div>
  );
}
