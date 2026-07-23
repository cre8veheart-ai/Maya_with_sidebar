"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { IMemoryStorage } from "./IMemoryStorage";
import { LocalStorageMemoryAdapter } from "./LocalStorageMemoryAdapter";

const defaultAdapter = new LocalStorageMemoryAdapter();

const MemoryStorageContext = createContext<IMemoryStorage>(defaultAdapter);

export function MemoryStorageProvider({
  children,
  adapter = defaultAdapter,
}: {
  children: ReactNode;
  adapter?: IMemoryStorage;
}) {
  return (
    <MemoryStorageContext.Provider value={adapter}>
      {children}
    </MemoryStorageContext.Provider>
  );
}

export function useMemoryStorage(): IMemoryStorage {
  return useContext(MemoryStorageContext);
}
