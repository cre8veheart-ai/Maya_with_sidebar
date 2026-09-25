import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "continuity", "LESLIE_ARI_CONTEXT.md");
    const content = readFileSync(filePath, "utf-8");
    
    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response("Failed to load continuity context", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
