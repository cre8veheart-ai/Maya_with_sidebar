/**
 * Blog storage — Vercel KV when available, in-memory fallback for dev/build.
 * KV key: "maya:blog:posts" → JSON array of BlogPost
 */

import type { BlogPost } from "./types";

const KV_KEY = "maya:blog:posts";

// ── In-memory fallback (dev / build time) ────────────────────────────────────
const memStore: BlogPost[] = [];

async function kvGet(): Promise<BlogPost[] | null> {
  try {
    const { kv } = await import("@vercel/kv");
    return await kv.get<BlogPost[]>(KV_KEY);
  } catch {
    return null;
  }
}

async function kvSet(posts: BlogPost[]): Promise<void> {
  try {
    const { kv } = await import("@vercel/kv");
    await kv.set(KV_KEY, posts);
  } catch {
    // no-op — KV not configured
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const kv = await kvGet();
  if (kv !== null) return kv;
  return [...memStore];
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const all = await getAllPosts();
  return all
    .filter((p) => p.status === "published")
    .sort((a, b) => (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const all = await getAllPosts();
  return all.find((p) => p.id === id) ?? null;
}

export async function savePost(post: BlogPost): Promise<void> {
  const all = await getAllPosts();
  const idx = all.findIndex((p) => p.id === post.id);
  if (idx >= 0) {
    all[idx] = post;
  } else {
    all.push(post);
  }
  // sync mem
  memStore.length = 0;
  all.forEach((p) => memStore.push(p));
  await kvSet(all);
}

export async function deletePost(id: string): Promise<void> {
  const all = await getAllPosts();
  const next = all.filter((p) => p.id !== id);
  memStore.length = 0;
  next.forEach((p) => memStore.push(p));
  await kvSet(next);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
