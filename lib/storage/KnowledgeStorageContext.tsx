"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { IKnowledgeStorage } from "./IKnowledgeStorage";
import { LocalStorageKnowledgeAdapter } from "./LocalStorageKnowledgeAdapter";

const defaultAdapter = new LocalStorageKnowledgeAdapter();

const KnowledgeStorageContext =
  createContext<IKnowledgeStorage>(defaultAdapter);

export function KnowledgeStorageProvider({
  children,
  adapter = defaultAdapter,
}: {
  children: ReactNode;
  adapter?: IKnowledgeStorage;
}) {
  return (
    <KnowledgeStorageContext.Provider value={adapter}>
      {children}
    </KnowledgeStorageContext.Provider>
  );
}

export function useKnowledgeStorage(): IKnowledgeStorage {
  return useContext(KnowledgeStorageContext);
}
