"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { IDecisionStorage } from "./IDecisionStorage";
import { LocalStorageDecisionAdapter } from "./LocalStorageDecisionAdapter";

const defaultAdapter = new LocalStorageDecisionAdapter();

const DecisionStorageContext =
  createContext<IDecisionStorage>(defaultAdapter);

export function DecisionStorageProvider({
  children,
  adapter = defaultAdapter,
}: {
  children: ReactNode;
  adapter?: IDecisionStorage;
}) {
  return (
    <DecisionStorageContext.Provider value={adapter}>
      {children}
    </DecisionStorageContext.Provider>
  );
}

export function useDecisionStorage(): IDecisionStorage {
  return useContext(DecisionStorageContext);
}
