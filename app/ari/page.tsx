"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useDictation } from "@/lib/hooks/useDictation";
import type { AriMessage } from "@/lib/ari/types";

// ── Suggested prompts ─────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  "What should I focus on this week?",
  "Help me prepare for a board update",
  "Summarize key risks in our current strategy",
  "Help me think through a difficult personnel decision",
  "What's the best way to evaluate a new market opportunity?",
  "Draft a 3-point executive brief on our growth levers",
];

// ── Icons ─────────────────────────────────────────────────────────────────────

const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 2L7.5 12.5L6 7.5L1 6L13 2z" />
  </svg>
);

const MicIcon = ({ active }: { active: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="1" width="5" height="8" rx="2.5" fill={active ? "currentColor" : "none"} />
    <path d="M2 7.5a5.5 5.5 0 0011 0" />
    <path d="M7.5 13v1.5" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M11.5 3.5l-.7 8a1 1 0 01-1 .9H4.2a1 1 0 01-1-.9L2.5 3.5" />
  </svg>
);

// ── Lightweight markdown renderer ─────────────────────────────────────────────

function parseBold(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="font-semibold text-[#1D1D1F]">{part.slice(2, -2)}</strong>
      : part
  );
}

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("### ")) return <p key={i} className="font-semibold text-[#1D1D1F] mt-3 mb-0.5 text-[13.5px]">{line.slice(4)}</p>;
    if (line.startsWith("## "))  return <p key={i} className="font-semibold text-[#1D1D1F] mt-4 mb-1 text-[14px]">{line.slice(3)}</p>;
    if (line.startsWith("# "))   return <p key={i} className="font-semibold text-[#1D1D1F] mt-4 mb-1 text-[15px]">{line.slice(2)}</p>;
    if (line.match(/^[-•]\s/))   return <div key={i} className="flex gap-2 mt-1"><span className="text-[#AEAEB2] flex-shrink-0 mt-0.5">•</span><span className="flex-1">{parseBold(line.slice(2))}</span></div>;
    if (line.match(/^\d+\.\s/)) {
      const num = line.match(/^(\d+)\./)?.[1];
      return <div key={i} className="flex gap-2 mt-1"><span className="text-[#AEAEB2] flex-shrink-0 w-4 text-right">{num}.</span><span className="flex-1">{parseBold(line.replace(/^\d+\.\s/, ""))}</span></div>;
    }
    if (line.trim() === "")      return <div key={i} className="h-2" />;
    return <p key={i} className="mt-1 leading-relaxed">{parseBold(line)}</p>;
  });
}

// ── Message bubble ────────────────────────────────────────────────────────────

function MessageBubble({ message, isStreaming }: { message: AriMessage; isStreaming: boolean }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-[#1D1D1F] text-white px-4 py-3 rounded-2xl rounded-tr-sm text-[14px] leading-relaxed max-w-[78%]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="w-6 h-6 rounded-md bg-[#1D1D1F] flex items-center justify-center flex-shrink-0 mt-1">
        <span className="text-white text-[9px] select-none">✦</span>
      </div>
      <div className="flex-1 text-[14px] text-[#1D1D1F] pt-0.5 min-w-0">
        {message.content
          ? <div className="space-y-0">{renderMarkdown(message.content)}</div>
          : null}
        {isStreaming && (
          <span className="inline-block w-[3px] h-[15px] bg-[#1D1D1F] rounded-sm animate-pulse align-middle ml-0.5" />
        )}
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onPrompt }: { onPrompt: (p: string) => void }) {
  return (
    <div className="max-w-2xl pt-2 pb-6">
      <div className="flex flex-col items-center text-center pb-10">
        <div className="w-14 h-14 rounded-2xl bg-[#1D1D1F] flex items-center justify-center mb-5">
          <span className="text-white text-xl select-none">✦</span>
        </div>
        <h2 className="text-[20px] font-semibold text-[#1D1D1F] mb-2">What can I help with?</h2>
        <p className="text-[14px] text-[#6E6E73] leading-relaxed max-w-xs">
          Strategy, decisions, analysis, communication. Maya thinks with you.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => onPrompt(p)}
            className="text-left px-4 py-3.5 bg-[#F9F9FB] hover:bg-[#F0F0F2] border border-[#E5E5EA] rounded-xl text-[13px] text-[#3D3D3D] hover:text-[#1D1D1F] transition-colors leading-snug"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function generateId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function AriPage() {
  const [messages, setMessages] = useLocalStorage<AriMessage[]>("maya-ari-messages", []);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef    = useRef<AbortController | null>(null);
  // Accumulate interim dictation so we can replace it with the final transcript
  const interimRef  = useRef("");

  // Auto-scroll on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  // ── Dictation ───────────────────────────────────────────────────────────────

  const handleTranscript = useCallback((text: string, isFinal: boolean) => {
    setInput((prev) => {
      // Remove the previous interim fragment, append new one
      const base = interimRef.current
        ? prev.slice(0, prev.length - interimRef.current.length)
        : prev;
      if (isFinal) {
        interimRef.current = "";
        return (base + (base && !base.endsWith(" ") ? " " : "") + text + " ").trimStart();
      } else {
        interimRef.current = text;
        return base + text;
      }
    });
  }, []);

  const { state: dictationState, toggle: toggleDictation } = useDictation({
    onTranscript: handleTranscript,
    onError: (err) => setError(`Dictation error: ${err}`),
  });

  // ── Send message ─────────────────────────────────────────────────────────────

  const sendMessage = useCallback(async (text: string) => {
    const userContent = text.trim();
    if (!userContent || streaming) return;

    setInput("");
    setError(null);
    interimRef.current = "";

    const userMsg: AriMessage = {
      id: generateId(),
      role: "user",
      content: userContent,
      timestamp: new Date().toISOString(),
    };

    const messagesWithUser = [...messages, userMsg];
    setMessages(messagesWithUser);
    setStreaming(true);

    // Placeholder for Ari's response — streams into this
    const ariPlaceholder: AriMessage = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };
    setMessages([...messagesWithUser, ariPlaceholder]);

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const res = await fetch("/api/ari", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesWithUser.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abort.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setMessages([
            ...messagesWithUser,
            { ...ariPlaceholder, content: accumulated },
          ]);
        }
      }

      // Persist final message with full content
      setMessages([
        ...messagesWithUser,
        { ...ariPlaceholder, content: accumulated, timestamp: new Date().toISOString() },
      ]);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        // User cancelled — keep partial content as-is
      } else {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        setError(msg);
        setMessages(messagesWithUser); // remove empty placeholder
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [messages, setMessages, streaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearHistory = () => {
    if (streaming) {
      abortRef.current?.abort();
      setStreaming(false);
    }
    setMessages([]);
    setError(null);
    interimRef.current = "";
  };

  const isEmpty = messages.length === 0;
  const isListening = dictationState === "listening";
  const dictationAvailable = dictationState !== "unsupported";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-4 flex-shrink-0">
        <div>
          <h1 className="text-[22px] font-semibold text-[#1D1D1F] tracking-tight leading-tight">Maya</h1>
          <p className="mt-1 text-[14px] text-[#6E6E73]">Your executive intelligence</p>
        </div>
        {!isEmpty && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-lg transition-colors"
            title="Clear conversation"
          >
            <TrashIcon />
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 pb-4">
        {isEmpty ? (
          <EmptyState onPrompt={sendMessage} />
        ) : (
          <div className="max-w-2xl space-y-6 pb-4">
            {messages.map((msg, idx) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isStreaming={streaming && idx === messages.length - 1 && msg.role === "assistant"}
              />
            ))}
            {error && (
              <div className="bg-[#FFF0F0] border border-[#FFCDD2] rounded-xl px-4 py-3 text-[13px] text-[#C0392B]">
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-8 pb-8 pt-2">
        <div className="max-w-2xl">
          <div className={[
            "bg-white border rounded-2xl shadow-sm transition-all",
            isListening
              ? "border-[#0066CC] ring-1 ring-[#0066CC]/20"
              : "border-[#E5E5EA] focus-within:border-[#0066CC] focus-within:ring-1 focus-within:ring-[#0066CC]/20",
          ].join(" ")}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening…" : "Ask Maya anything…"}
              rows={1}
              disabled={streaming}
              className="w-full px-5 pt-4 pb-1 text-[14px] text-[#1D1D1F] placeholder:text-[#AEAEB2] bg-transparent resize-none outline-none leading-relaxed"
            />
            <div className="flex items-center justify-between px-4 pb-3 pt-1">
              <span className="text-[11px] text-[#AEAEB2]">
                {isListening ? "Tap mic to stop" : streaming ? "Thinking…" : "↵ send  ·  ⇧↵ new line"}
              </span>
              <div className="flex items-center gap-2">
                {dictationAvailable && (
                  <button
                    onClick={toggleDictation}
                    className={[
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      isListening
                        ? "bg-[#0066CC] text-white"
                        : "text-[#8E8E93] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]",
                    ].join(" ")}
                    aria-label={isListening ? "Stop dictation" : "Start dictation"}
                    title={isListening ? "Stop dictation" : "Dictate with microphone"}
                  >
                    <MicIcon active={isListening} />
                  </button>
                )}
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || streaming}
                  className="w-8 h-8 bg-[#1D1D1F] hover:bg-[#3D3D3D] disabled:bg-[#E5E5EA] disabled:cursor-not-allowed text-white disabled:text-[#AEAEB2] rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Send message"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
