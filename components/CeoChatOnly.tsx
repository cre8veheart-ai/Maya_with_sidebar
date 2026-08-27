"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import type { MayaMessage } from "@/lib/maya/types";

type ChatError = {
  message: string;
  code?: string;
};

export default function CeoChatOnly() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MayaMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function send(e: FormEvent | KeyboardEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setError(null);

    const userMsg: MayaMessage = { role: "user", content: text };
    const thread = [...messages, userMsg];
    setInput("");
    setStreaming(true);
    setMessages([...thread, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        signal: controller.signal,
        body: JSON.stringify({
          messages: thread,
          lens: { role: "ceo", overrides: [] },
          workspace: "exec",
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { error?: string; code?: string }
          | null;

        if (res.status === 401) {
          const returnTo = `${window.location.pathname}${window.location.search}`;
          window.location.assign(`/beta?returnTo=${encodeURIComponent(returnTo)}`);
          return;
        }

        throw {
          message: payload?.error || "Maya could not complete that request.",
          code: payload?.code,
        };
      }

      if (!res.body) {
        throw { message: "Maya returned an empty response.", code: "EMPTY_RESPONSE" };
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: full };
          return next;
        });
      }
    } catch (cause) {
      if (controller.signal.aborted) return;

      const nextError: ChatError =
        cause && typeof cause === "object" && "message" in cause
          ? {
              message: String((cause as { message: unknown }).message),
              code:
                "code" in cause && typeof (cause as { code?: unknown }).code === "string"
                  ? (cause as { code: string }).code
                  : undefined,
            }
          : { message: "Something went wrong. Please try again." };

      setError(nextError);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      abortRef.current = null;
      setStreaming(false);
    }
  }

  function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8" aria-labelledby="ceo-title">
      <section className="w-full max-w-2xl -translate-y-[8vh]">
        <div className="mb-5 text-center">
          <h1 id="ceo-title" className="text-3xl font-semibold text-[#cdd6f4]">CEO</h1>
          <p className="mt-1 text-sm text-[#7f849c]">Executive decision workspace</p>
        </div>

        <form onSubmit={send} className="flex gap-2 items-end" aria-busy={streaming}>
          <label className="sr-only" htmlFor="ceo-prompt">Message your CEO</label>
          <textarea
            id="ceo-prompt"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) send(e);
            }}
            placeholder="Talk to your CEO…"
            rows={3}
            disabled={streaming}
            className="flex-1 min-h-[88px] max-h-44 resize-none rounded-xl border border-[#45475a] bg-[#313244] px-4 py-3 text-[15px] text-[#cdd6f4] placeholder-[#6c7086] focus:outline-none focus:border-[#89b4fa] disabled:opacity-50"
          />
          {streaming ? (
            <button
              type="button"
              onClick={stop}
              className="shrink-0 rounded-xl border border-[#585b70] px-5 py-3 text-[13px] font-semibold text-[#cdd6f4] transition-colors hover:bg-[#313244]"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="shrink-0 rounded-xl bg-[#89b4fa] px-5 py-3 text-[13px] font-semibold text-[#1e1e2e] transition-colors hover:bg-[#b4d0fb] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          )}
        </form>

        {error && (
          <div role="alert" className="mt-4 rounded-xl border border-[#f38ba8]/40 bg-[#f38ba8]/10 p-4 text-sm text-[#f5c2e7]">
            {error.message}
          </div>
        )}

        {lastAssistant && (
          <div
            aria-live="polite"
            className="mt-5 rounded-xl border border-[#313244] bg-[#181825] p-5 text-[14px] leading-relaxed text-[#cdd6f4] whitespace-pre-wrap"
          >
            {lastAssistant.content}
            {streaming && <span className="ml-1 inline-block h-4 w-1.5 animate-pulse bg-[#89b4fa] align-text-bottom" />}
          </div>
        )}
      </section>
    </main>
  );
}
