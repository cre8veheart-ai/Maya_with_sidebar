"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ISuggestionStorage } from "./ISuggestionStorage";
import { LocalStorageSuggestionAdapter } from "./LocalStorageSuggestionAdapter";

const defaultAdapter = new LocalStorageSuggestionAdapter();

const SuggestionStorageContext = createContext<ISuggestionStorage>(defaultAdapter);

export function SuggestionStorageProvider({
  children,
  adapter = defaultAdapter,
}: {
  children: ReactNode;
  adapter?: ISuggestionStorage;
}) {
  return (
    <SuggestionStorageContext.Provider value={adapter}>
      {children}
    </SuggestionStorageContext.Provider>
  );
}

export function useSuggestionStorage(): ISuggestionStorage {
  return useContext(SuggestionStorageContext);
}
