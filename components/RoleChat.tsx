"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import type { ExecRole, MayaMessage, RoleLens } from "@/lib/maya/types";
import { loadLens } from "@/lib/maya/lensStorage";

type ActionType = "email" | "task" | "decision" | "meeting";

interface PendingAction {
  id: string;
  type: ActionType;
  label: string;
  context: string;
  status: "pending" | "approved" | "dismissed";
}

const ACTION_LABELS: Record<ActionType, string> = {
  email: "Draft Email",
  task: "Create Task",
  decision: "Add to Decisions",
  meeting: "Schedule Meeting",
};

interface RoleChatProps {
  role: ExecRole;
}

export default function RoleChat({ role }: RoleChatProps) {
  const [lens, setLens] = useState<RoleLens>({ role, overrides: [] });
  const [messages, setMessages] = useState<MayaMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLens(loadLens(role));
    setMessages([]);
    setPendingActions([]);
  }, [role]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingActions]);

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

  function proposeAction(type: ActionType) {
    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");
    if (!lastAssistant) return;
    setPendingActions((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${type}`,
        type,
        label: ACTION_LABELS[type],
        context: lastAssistant.content.slice(0, 220),
        status: "pending",
      },
    ]);
  }

  function resolveAction(id: string, resolution: "approved" | "dismissed") {
    setPendingActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: resolution } : a))
    );
  }

  const lastIsAssistant =
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    !streaming;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-[#313244] shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a6e3a1]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#6c7086]">
            MAYA · {role.toUpperCase()} Lens
          </span>
        </div>
        {lens.overrides.length > 0 && (
          <span className="text-[11px] text-[#a6e3a1]">
            {lens.overrides.length} org context
            {lens.overrides.length !== 1 ? "s" : ""} loaded
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-[13px] text-[#585b70] text-center leading-relaxed">
              {role.toUpperCase()} lens active.
              <br />
              Ask anything.
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[88%] px-4 py-3 rounded-xl text-[13px] leading-relaxed whitespace-pre-wrap ${
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

        {/* Action proposal buttons — appear after last assistant message */}
        {lastIsAssistant && (
          <div className="flex gap-2 flex-wrap pl-1">
            {(Object.entries(ACTION_LABELS) as [ActionType, string][]).map(
              ([type, label]) => (
                <button
                  key={type}
                  onClick={() => proposeAction(type)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#313244] text-[#a6adc8] hover:bg-[#45475a] hover:text-[#cdd6f4] transition-colors"
                >
                  + {label}
                </button>
              )
            )}
          </div>
        )}

        {/* Pending action approval cards */}
        {pendingActions.map((action) => (
          <div
            key={action.id}
            className={`rounded-xl border p-4 text-[13px] transition-all ${
              action.status === "pending"
                ? "border-[#f9e2af] bg-[#1e1e2e]"
                : action.status === "approved"
                  ? "border-[#a6e3a1] bg-[#1e1e2e] opacity-60"
                  : "border-[#313244] bg-[#1e1e2e] opacity-40"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#f9e2af] mb-1">
                  Proposed · {action.label}
                </p>
                <p className="text-[#a6adc8] text-[12px] leading-relaxed line-clamp-2">
                  {action.context}
                  {action.context.length >= 220 ? "…" : ""}
                </p>
              </div>
              {action.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => resolveAction(action.id, "approved")}
                    className="px-3 py-1.5 rounded-lg bg-[#a6e3a1] text-[#1e1e2e] text-[11px] font-bold hover:bg-[#cdf0cb] transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => resolveAction(action.id, "dismissed")}
                    className="px-3 py-1.5 rounded-lg bg-[#313244] text-[#a6adc8] text-[11px] font-bold hover:bg-[#45475a] transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              {action.status === "approved" && (
                <span className="text-[11px] text-[#a6e3a1] font-semibold shrink-0">
                  ✓ Approved
                </span>
              )}
              {action.status === "dismissed" && (
                <span className="text-[11px] text-[#585b70] shrink-0">
                  Dismissed
                </span>
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={send}
        className="px-4 py-3 border-t border-[#313244] shrink-0"
      >
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) send(e);
            }}
            placeholder={`Ask your ${role.toUpperCase()} lens…`}
            rows={1}
            className="flex-1 bg-[#313244] border border-[#45475a] rounded-xl px-3 py-2.5 text-[13px] text-[#cdd6f4] placeholder-[#585b70] resize-none focus:outline-none focus:border-[#89b4fa] transition-colors"
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            className="px-4 py-2.5 bg-[#89b4fa] text-[#1e1e2e] rounded-xl text-[12px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b4d0fb] transition-colors shrink-0"
          >
            Send
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-[#585b70]">
          Enter to send · Shift+Enter for new line · Doesn&apos;t act without
          you
        </p>
      </form>
    </div>
  );
}
