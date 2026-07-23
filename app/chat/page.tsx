"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import type { ExecRole, MayaMessage, RoleLens } from "@/lib/maya/types";
import { loadLens } from "@/lib/maya/lensStorage";

const ROLES: { value: ExecRole; label: string }[] = [
  { value: "ceo", label: "CEO" },
  { value: "coo", label: "COO" },
  { value: "cmo", label: "CMO" },
  { value: "cfo", label: "CFO" },
  { value: "cto", label: "CTO" },
  { value: "cio", label: "CIO" },
  { value: "cro", label: "CRO" },
  { value: "cd", label: "CD" },
];

export default function ChatPage() {
  const [role, setRole] = useState<ExecRole>("ceo");
  const [lens, setLens] = useState<RoleLens>({ role: "ceo", overrides: [] });
  const [messages, setMessages] = useState<MayaMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLens(loadLens(role));
    setMessages([]);
  }, [role]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: FormEvent | React.KeyboardEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: MayaMessage = { role: "user", content: text };
    const thread = [...messages, userMsg];
    setMessages(thread);
    setInput("");
    setStreaming(true);
    setMessages([...thread, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: thread, lens }),
      });

      if (!res.body) throw new Error("No response stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages([...thread, { role: "assistant", content: full }]);
      }
    } catch {
      setMessages([
        ...thread,
        {
          role: "assistant",
          content:
            "Connection error. Ensure OPENAI_API_KEY is set in your environment.",
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 0px)" }}>
      {/* Role lens selector */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[#313244] bg-[#181825] shrink-0 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">
          Active Lens
        </span>
        <div className="flex gap-2 flex-wrap">
          {ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRole(r.value)}
              className={`px-3 py-1 rounded-md text-[12px] font-semibold tracking-wide transition-colors ${
                role === r.value
                  ? "bg-[#89b4fa] text-[#1e1e2e]"
                  : "bg-[#313244] text-[#a6adc8] hover:bg-[#45475a]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        {lens.overrides.length > 0 && (
          <span className="ml-auto text-[11px] text-[#a6e3a1] shrink-0">
            {lens.overrides.length} org context
            {lens.overrides.length !== 1 ? "s" : ""} loaded
          </span>
        )}
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 min-h-0">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-[14px] text-[#585b70]">
              {role.toUpperCase()} lens active. Ask anything.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[72%] px-4 py-3 rounded-xl text-[14px] leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-[#89b4fa] text-[#1e1e2e] font-medium"
                  : "bg-[#1e1e2e] border border-[#313244] text-[#cdd6f4]"
              }`}
            >
              {m.content || (
                <span className="inline-block w-1.5 h-3.5 bg-[#89b4fa] animate-pulse rounded-sm align-middle" />
              )}
              {m.role === "assistant" &&
                streaming &&
                i === messages.length - 1 &&
                m.content && (
                  <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#89b4fa] animate-pulse rounded-sm align-middle" />
                )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={send}
        className="px-6 py-4 border-t border-[#313244] bg-[#181825] shrink-0"
      >
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                send(e);
              }
            }}
            placeholder={`Ask your ${role.toUpperCase()} lens...`}
            rows={1}
            className="flex-1 bg-[#313244] border border-[#45475a] rounded-xl px-4 py-3 text-[14px] text-[#cdd6f4] placeholder-[#585b70] resize-none focus:outline-none focus:border-[#89b4fa] transition-colors"
            style={{ minHeight: "44px", maxHeight: "160px" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            className="px-5 py-3 bg-[#89b4fa] text-[#1e1e2e] rounded-xl text-[13px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b4d0fb] transition-colors shrink-0"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-[11px] text-[#585b70]">
          Enter to send · Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}
