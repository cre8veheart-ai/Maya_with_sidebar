"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      // localStorage unavailable (SSR, private browsing)
    }
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const next =
        typeof value === "function" ? (value as (p: T) => T)(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // ignore write errors
      }
      return next;
    });
  };

  return [storedValue, setValue];
}
