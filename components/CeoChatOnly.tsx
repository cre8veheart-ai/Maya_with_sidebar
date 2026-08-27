"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
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
  const [copiedMessage, setCopiedMessage] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function copyMessage(content: string, index: number) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessage(index);
      window.setTimeout(() => setCopiedMessage((current) => current === index ? null : current), 1600);
    } catch {
      setError({ message: "Copy was blocked. Press and hold the response text to select it." });
    }
  }

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

  return (
    <main className="flex min-h-[calc(100dvh-64px)] justify-center px-3 py-4 sm:px-4 sm:py-8" aria-labelledby="ceo-title">
      <section className="flex h-[calc(100dvh-96px)] min-h-[520px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#313244] bg-[#181825]">
        <div className="shrink-0 border-b border-[#313244] px-4 py-4 text-center">
          <h1 id="ceo-title" className="text-3xl font-semibold text-[#cdd6f4]">CEO</h1>
          <p className="mt-1 text-sm text-[#7f849c]">Executive decision workspace</p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 [-webkit-overflow-scrolling:touch]">
          {messages.length === 0 && (
            <p className="mt-10 text-center text-sm text-[#7f849c]">Ask your CEO anything.</p>
          )}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[92%] break-words whitespace-pre-wrap rounded-xl px-4 py-3 text-[14px] leading-relaxed ${
                  message.role === "user"
                    ? "bg-[#89b4fa] font-medium text-[#1e1e2e]"
                    : "select-text border border-[#313244] bg-[#1e1e2e] text-[#cdd6f4]"
                }`}>
                  <div className="select-text">
                    {message.content || <span className="inline-block h-4 w-1.5 animate-pulse bg-[#89b4fa]" />}
                    {message.role === "assistant" && streaming && index === messages.length - 1 && message.content && (
                      <span className="ml-1 inline-block h-4 w-1.5 animate-pulse bg-[#89b4fa] align-text-bottom" />
                    )}
                  </div>
                  {message.role === "assistant" && message.content && !streaming && (
                    <button
                      type="button"
                      onClick={() => copyMessage(message.content, index)}
                      className="mt-3 min-h-10 rounded-lg border border-[#45475a] bg-[#313244] px-3 py-2 text-[12px] font-semibold text-[#cdd6f4] active:bg-[#585b70]"
                    >
                      {copiedMessage === index ? "✓ Copied — paste into Notes" : "Copy response"}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        <form onSubmit={send} className="shrink-0 border-t border-[#313244] bg-[#181825] p-3" aria-busy={streaming}>
          <div className="flex gap-2 items-end">
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
          </div>
          <p className="mt-2 text-[11px] text-[#6c7086]">Scroll the full conversation · Press and hold to select · Copy responses to Notes</p>
        </form>

        {error && (
          <div role="alert" className="mx-3 mb-3 rounded-xl border border-[#f38ba8]/40 bg-[#f38ba8]/10 p-3 text-sm text-[#f5c2e7]">
            {error.message}
          </div>
        )}

      </section>
    </main>
  );
}
