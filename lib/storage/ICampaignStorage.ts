import type { Campaign } from "@/lib/types/campaign";

export interface ICampaignStorage {
  list(): Promise<Campaign[]>;
  get(id: string): Promise<Campaign | null>;
  save(campaign: Campaign): Promise<Campaign>;
  remove(id: string): Promise<void>;
}
