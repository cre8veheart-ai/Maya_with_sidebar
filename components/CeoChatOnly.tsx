"use client";

import { FormEvent, useState } from "react";
import type { MayaMessage } from "@/lib/maya/types";

export default function CeoChatOnly() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MayaMessage[]>([]);
  const [streaming, setStreaming] = useState(false);

  async function send(e: FormEvent | React.KeyboardEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: MayaMessage = { role: "user", content: text };
    const thread = [...messages, userMsg];
    setInput("");
    setStreaming(true);
    setMessages([...thread, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: thread,
          lens: { role: "ceo", overrides: [] },
          workspace: "exec",
        }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

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
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        };
        return next;
      });
    } finally {
      setStreaming(false);
    }
  }

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl -translate-y-[8vh]">
        <div className="text-center mb-5">
          <h1 className="text-3xl font-semibold text-[#cdd6f4]">CEO</h1>
        </div>

        <form onSubmit={send} className="flex gap-2 items-end">
          <textarea
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
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            className="shrink-0 rounded-xl bg-[#89b4fa] px-5 py-3 text-[13px] font-semibold text-[#1e1e2e] transition-colors hover:bg-[#b4d0fb] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {streaming ? "…" : "Send"}
          </button>
        </form>

        {lastAssistant && (
          <div className="mt-5 rounded-xl border border-[#313244] bg-[#181825] p-5 text-[14px] leading-relaxed text-[#cdd6f4] whitespace-pre-wrap">
            {lastAssistant.content}
            {streaming && <span className="ml-1 inline-block h-4 w-1.5 animate-pulse bg-[#89b4fa] align-text-bottom" />}
          </div>
        )}
      </div>
    </div>
  );
}
