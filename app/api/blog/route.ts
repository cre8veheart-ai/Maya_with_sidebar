import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, getPublishedPosts, savePost, generateSlug } from "@/lib/blog/store";
import type { BlogPost } from "@/lib/blog/types";
import { randomUUID } from "crypto";

function isAdminRequest(req: NextRequest): boolean {
  const pin = req.headers.get("x-admin-pin") ?? "";
  const adminPin = process.env.NEXT_PUBLIC_ADMIN_PIN ?? "MAYA-ADMIN";
  return pin.toUpperCase() === adminPin.toUpperCase();
}

// GET /api/blog — returns published posts (or all posts for admin)
export async function GET(req: NextRequest) {
  const admin = isAdminRequest(req);
  const posts = admin ? await getAllPosts() : await getPublishedPosts();
  return NextResponse.json({ posts });
}

// POST /api/blog — create a new post (admin only)
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const title = String(body.title ?? "").trim();
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    const now = new Date().toISOString();
    const post: BlogPost = {
      id: randomUUID(),
      slug: generateSlug(title),
      title,
      excerpt: String(body.excerpt ?? "").trim(),
      content: String(body.content ?? "").trim(),
      tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
      status: body.status === "published" ? "published" : "draft",
      membersOnly: body.membersOnly === true,
      author: String(body.author ?? "MAYA Team"),
      createdAt: now,
      updatedAt: now,
      publishedAt: body.status === "published" ? now : undefined,
    };
    await savePost(post);
    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
