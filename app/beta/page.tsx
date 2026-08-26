"use client";

import { FormEvent, useEffect, useState } from "react";

export default function BetaAccessPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [returnTo, setReturnTo] = useState("/");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("returnTo");
    if (requested?.startsWith("/") && !requested.startsWith("//")) setReturnTo(requested);
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!code.trim() || submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/beta/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Beta access failed.");
      window.location.assign(returnTo);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Beta access failed.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#11111b] px-5 py-12 text-[#cdd6f4]">
      <section className="mx-auto max-w-md rounded-2xl border border-[#313244] bg-[#181825] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#89b4fa]">MAYA Private Beta</p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Enter your beta access code</h1>
        <p className="mt-2 text-sm text-[#a6adc8]">Your session remains private to this browser for fourteen days.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <label className="block text-sm">
            <span className="mb-2 block text-[#a6adc8]">Access code</span>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              autoComplete="one-time-code"
              className="w-full rounded-xl border border-[#45475a] bg-[#11111b] px-4 py-3 text-white outline-none focus:border-[#89b4fa]"
              placeholder="Beta access code"
            />
          </label>
          {error && <p role="alert" className="text-sm text-[#f38ba8]">{error}</p>}
          <button
            type="submit"
            disabled={!code.trim() || submitting}
            className="w-full rounded-xl bg-[#89b4fa] px-4 py-3 font-semibold text-[#11111b] disabled:opacity-40"
          >
            {submitting ? "Opening MAYA…" : "Enter MAYA"}
          </button>
        </form>
      </section>
    </main>
  );
}
