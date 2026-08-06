import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/import-url?url=https://...
 * Server-side URL fetch → strips to clean text. Prevents CORS issues client-side.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "url param required" }, { status: 400 });

  // Basic allowlist — block localhost/internal
  try {
    const parsed = new URL(url);
    if (["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(parsed.hostname)) {
      return NextResponse.json({ error: "URL not allowed" }, { status: 400 });
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ error: "URL not allowed" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "MAYA/1.0 (content importer)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();

    // Detect platform from URL
    const hostname = new URL(url).hostname;
    let platform = "Article";
    if (hostname.includes("linkedin.com")) platform = "LinkedIn";
    else if (hostname.includes("twitter.com") || hostname.includes("x.com")) platform = "X / Twitter";
    else if (hostname.includes("instagram.com")) platform = "Instagram";

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, " ").slice(0, 120) : url;

    // Strip HTML to plain text
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s{3,}/g, "\n\n")
      .trim()
      .slice(0, 8000);

    return NextResponse.json({ title, text, platform, url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not import URL" },
      { status: 502 }
    );
  }
}
