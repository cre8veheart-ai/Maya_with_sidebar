"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── Web Speech API types (not in all TS lib versions) ─────────────────────────
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export type DictationState = "idle" | "listening" | "unsupported";

interface UseDictationOptions {
  /** Called with each transcript fragment as speech is recognized */
  onTranscript: (text: string, isFinal: boolean) => void;
  /** Called if the browser reports a recognition error */
  onError?: (error: string) => void;
}

export function useDictation({ onTranscript, onError }: UseDictationOptions): {
  state: DictationState;
  toggle: () => void;
  stop: () => void;
} {
  const [state, setState] = useState<DictationState>("idle");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);

  // Keep refs current without re-creating the recognition instance
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const getOrCreate = useCallback((): SpeechRecognitionInstance | null => {
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRecognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setState("unsupported");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (ev: SpeechRecognitionEvent) => {
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const result = ev.results[i];
        const transcript = result[0].transcript;
        const isFinal = result.isFinal;
        onTranscriptRef.current(transcript, isFinal);
      }
    };

    recognition.onerror = (ev: SpeechRecognitionErrorEvent) => {
      // "aborted" fires when we call stop() intentionally — ignore it
      if (ev.error !== "aborted") {
        onErrorRef.current?.(ev.error);
      }
      setState("idle");
    };

    recognition.onend = () => {
      setState("idle");
    };

    recognitionRef.current = recognition;
    return recognition;
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setState("idle");
  }, []);

  const toggle = useCallback(() => {
    if (state === "listening") {
      stop();
      return;
    }
    const recognition = getOrCreate();
    if (!recognition) return;
    try {
      recognition.start();
      setState("listening");
    } catch {
      // Recognition already started — ignore
    }
  }, [state, stop, getOrCreate]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  return { state, toggle, stop };
}
