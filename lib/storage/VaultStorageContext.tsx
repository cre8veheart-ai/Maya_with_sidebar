"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { IVaultStorage } from "./IVaultStorage";
import { LocalStorageVaultAdapter } from "./LocalStorageVaultAdapter";

const defaultAdapter = new LocalStorageVaultAdapter();

const VaultStorageContext = createContext<IVaultStorage>(defaultAdapter);

export function VaultStorageProvider({
  children,
  adapter = defaultAdapter,
}: {
  children: ReactNode;
  adapter?: IVaultStorage;
}) {
  return (
    <VaultStorageContext.Provider value={adapter}>
      {children}
    </VaultStorageContext.Provider>
  );
}

export function useVaultStorage(): IVaultStorage {
  return useContext(VaultStorageContext);
}
