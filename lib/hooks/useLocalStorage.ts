"use client";

import { useState, useCallback } from "react";

function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item !== null ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Read synchronously on first render — no useEffect, no flash of empty state.
  // typeof window guard makes this SSR-safe.
  const [storedValue, setStoredValue] = useState<T>(() =>
    readFromStorage(key, initialValue)
  );

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next =
          typeof value === "function" ? (value as (p: T) => T)(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // ignore write errors (private browsing, quota exceeded)
        }
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
