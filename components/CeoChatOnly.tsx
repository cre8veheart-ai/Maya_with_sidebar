"use client";

import { FormEvent, KeyboardEvent, ReactNode, useRef, useState } from "react";
import type { MayaMessage } from "@/lib/maya/types";

type ChatError = {
  message: string;
  code?: string;
};

function renderInlineMarkdown(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-semibold text-[#e6e9f5]">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

function MarkdownResponse({ content }: { content: string }) {
  return (
    <div className="space-y-3 break-words [overflow-wrap:anywhere]">
      {content.split("\n").map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) return <div key={index} className="h-1" aria-hidden="true" />;

        const heading = trimmed.match(/^#{1,3}\s+(.+)$/);
        if (heading) {
          return (
            <p key={index} className="font-semibold text-[#e6e9f5]">
              {renderInlineMarkdown(heading[1])}
            </p>
          );
        }

        const bullet = trimmed.match(/^[-*]\s+(.+)$/);
        if (bullet) {
          return (
            <div key={index} className="flex items-start gap-2 pl-1">
              <span aria-hidden="true" className="text-[#89b4fa]">•</span>
              <p className="min-w-0 flex-1">{renderInlineMarkdown(bullet[1])}</p>
            </div>
          );
        }

        const numbered = trimmed.match(/^(\d+\.)\s+(.+)$/);
        if (numbered) {
          return (
            <div key={index} className="flex items-start gap-2 pl-1">
              <span className="shrink-0 text-[#89b4fa]">{numbered[1]}</span>
              <p className="min-w-0 flex-1">{renderInlineMarkdown(numbered[2])}</p>
            </div>
          );
        }

        return <p key={index}>{renderInlineMarkdown(line)}</p>;
      })}
    </div>
  );
}

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

      const updateAssistant = () => {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: full };
          return next;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        updateAssistant();
      }

      full += decoder.decode();
      updateAssistant();
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
    <main className="min-h-[calc(100dvh-64px)] px-3 py-5 sm:px-4 sm:py-8" aria-labelledby="ceo-title">
      <section className="mx-auto w-full max-w-2xl">
        <div className="mb-5 text-center">
          <h1 id="ceo-title" className="text-3xl font-semibold text-[#cdd6f4]">CEO</h1>
          <p className="mt-1 text-sm text-[#7f849c]">Executive decision workspace</p>
        </div>

        <form onSubmit={send} className="flex flex-col gap-2 sm:flex-row sm:items-end" aria-busy={streaming}>
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
            className="min-h-[88px] max-h-44 w-full min-w-0 flex-1 resize-none rounded-xl border border-[#45475a] bg-[#313244] px-4 py-3 text-[15px] text-[#cdd6f4] placeholder:text-[#9399b2] focus:border-[#89b4fa] focus:outline-none"
          />
          {streaming ? (
            <button
              type="button"
              onClick={stop}
              className="w-full shrink-0 rounded-xl border border-[#585b70] px-5 py-3 text-[13px] font-semibold text-[#cdd6f4] transition-colors hover:bg-[#313244] sm:w-auto"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-full shrink-0 rounded-xl bg-[#89b4fa] px-5 py-3 text-[13px] font-semibold text-[#1e1e2e] transition-colors hover:bg-[#b4d0fb] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
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
            aria-busy={streaming}
            className="mt-5 rounded-xl border border-[#313244] bg-[#181825] p-4 text-[15px] leading-relaxed text-[#cdd6f4] sm:p-5"
          >
            <MarkdownResponse content={lastAssistant.content} />
            {streaming && <span className="mt-2 inline-block h-4 w-1.5 animate-pulse bg-[#89b4fa] align-text-bottom" />}
          </div>
        )}
      </section>
    </main>
  );
}
