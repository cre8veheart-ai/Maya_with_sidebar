"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { IWorkflowStorage } from "./IWorkflowStorage";
import { LocalStorageWorkflowAdapter } from "./LocalStorageWorkflowAdapter";

const defaultAdapter = new LocalStorageWorkflowAdapter();

const WorkflowStorageContext =
  createContext<IWorkflowStorage>(defaultAdapter);

export function WorkflowStorageProvider({
  children,
  adapter = defaultAdapter,
}: {
  children: ReactNode;
  adapter?: IWorkflowStorage;
}) {
  return (
    <WorkflowStorageContext.Provider value={adapter}>
      {children}
    </WorkflowStorageContext.Provider>
  );
}

export function useWorkflowStorage(): IWorkflowStorage {
  return useContext(WorkflowStorageContext);
}
