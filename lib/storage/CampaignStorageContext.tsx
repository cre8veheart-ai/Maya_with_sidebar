"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ICampaignStorage } from "./ICampaignStorage";
import { LocalStorageCampaignAdapter } from "./LocalStorageCampaignAdapter";

const defaultAdapter = new LocalStorageCampaignAdapter();

const CampaignStorageContext = createContext<ICampaignStorage>(defaultAdapter);

export function CampaignStorageProvider({
  children,
  adapter = defaultAdapter,
}: {
  children: ReactNode;
  adapter?: ICampaignStorage;
}) {
  return (
    <CampaignStorageContext.Provider value={adapter}>
      {children}
    </CampaignStorageContext.Provider>
  );
}

export function useCampaignStorage(): ICampaignStorage {
  return useContext(CampaignStorageContext);
}
