export type KnowledgeCategory =
  | "strategy"
  | "operations"
  | "finance"
  | "people"
  | "market"
  | "product"
  | "other";

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
