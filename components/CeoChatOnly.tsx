"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import type { MayaMessage } from "@/lib/maya/types";
import {
  checkpointPocketOfficeSession,
  recoverPocketOfficeSession,
} from "@/lib/maya/sessionLifecycleClient";

type ChatError = {
  message: string;
  code?: string;
};

export default function CeoChatOnly() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MayaMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [restartPoint, setRestartPoint] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const sessionIdRef = useRef("");

  useEffect(() => {
    let cancelled = false;
    sessionIdRef.current = `ceo-${crypto.randomUUID()}`;
    void recoverPocketOfficeSession("personal", "ceo").then((saved) => {
      if (cancelled || !saved) return;
      if (saved.status === "active") {
        sessionIdRef.current = saved.id;
        setMessages(saved.transcript);
        return;
      }
      setRestartPoint(saved.closeout?.nextAction ?? "");
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
    setRestartPoint("");
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
          throw { message: "Your Maya session has expired. Please sign in again.", code: "AUTH_REQUIRED" };
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

      const completedThread: MayaMessage[] = [
        ...thread,
        { role: "assistant", content: full },
      ];
      setMessages(completedThread);
      const sessionId =
        sessionIdRef.current || `ceo-${crypto.randomUUID()}`;
      sessionIdRef.current = sessionId;
      checkpointPocketOfficeSession({
        id: sessionId,
        clientVaultId: "personal",
        role: "ceo",
        title: text.slice(0, 80),
        transcript: completedThread,
      });
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
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white px-4 py-8" aria-labelledby="ceo-title">
      <section className="w-full max-w-2xl -translate-y-[8vh]">
        <div className="mb-5 text-center">
          <h1
            id="ceo-title"
            className="text-4xl font-black text-[#16223b] font-serif"
            style={{ textShadow: "0 1px 0 #ffffff, 0 2px 0 rgba(15, 23, 42, 0.14)" }}
          >
            <span className="mr-1 align-top text-5xl leading-none">C</span>EO
          </h1>
          <p className="mt-1 text-sm text-[#475569]">Executive decision workspace</p>
        </div>

        {restartPoint && (
          <div className="mb-4 rounded-xl border border-[#93c5fd] bg-[#eff6ff] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#1d4ed8]">
              MAYA restart point
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-[#1e3a8a]">
              {restartPoint}
            </p>
          </div>
        )}

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
            className="flex-1 min-h-[88px] max-h-44 resize-none rounded-xl border border-black/15 bg-white px-4 py-3 text-[15px] text-[#1f2937] placeholder-[#94a3b8] focus:outline-none focus:border-[#1d4ed8] disabled:opacity-50"
          />
          {streaming ? (
            <button
              type="button"
              onClick={stop}
              className="shrink-0 rounded-xl border border-black/15 px-5 py-3 text-[13px] font-semibold text-[#1f2937] transition-colors hover:bg-[#f8fafc]"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="shrink-0 rounded-xl bg-[#1d4ed8] px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          )}
        </form>

        {error && (
          <div role="alert" className="mt-4 rounded-xl border border-[#fca5a5] bg-[#fef2f2] p-4 text-sm text-[#b91c1c]">
            {error.message}
          </div>
        )}

        {lastAssistant && (
          <div
            aria-live="polite"
            className="mt-5 rounded-xl border border-black/10 bg-[#f8fafc] p-5 text-[14px] leading-relaxed text-[#1f2937] whitespace-pre-wrap"
          >
            {lastAssistant.content}
            {streaming && <span className="ml-1 inline-block h-4 w-1.5 animate-pulse bg-[#1d4ed8] align-text-bottom" />}
          </div>
        )}
      </section>
    </main>
  );
}
