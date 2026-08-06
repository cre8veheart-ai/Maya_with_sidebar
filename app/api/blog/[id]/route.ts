import { NextRequest, NextResponse } from "next/server";
import { getPostById, savePost, deletePost } from "@/lib/blog/store";

function isAdminRequest(req: NextRequest): boolean {
  const pin = req.headers.get("x-admin-pin") ?? "";
  const adminPin = process.env.NEXT_PUBLIC_ADMIN_PIN ?? "MAYA-ADMIN";
  return pin.toUpperCase() === adminPin.toUpperCase();
}

// GET /api/blog/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

// PUT /api/blog/[id] — update (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const existing = await getPostById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const wasPublished = existing.status === "published";
    const isPublishing = body.status === "published";

    const updated = {
      ...existing,
      ...body,
      id: existing.id,
      slug: existing.slug,
      updatedAt: now,
      publishedAt: isPublishing && !wasPublished ? now : existing.publishedAt,
    };
    await savePost(updated);
    return NextResponse.json({ post: updated });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE /api/blog/[id] — delete (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await deletePost(params.id);
  return NextResponse.json({ ok: true });
}
