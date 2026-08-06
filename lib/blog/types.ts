export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: BlogStatus;
  membersOnly: boolean;
  author: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  publishedAt?: string; // ISO
}
