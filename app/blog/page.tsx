import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog/store";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="px-8 py-10 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-[28px] font-semibold text-[#cdd6f4] tracking-tight">MAYA Blog</h1>
        <p className="mt-2 text-[14px] text-[#a6adc8]">
          Insights on executive AI partnership, decision intelligence, and the future of leadership.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="text-4xl">✍️</span>
          <p className="text-[14px] text-[#585b70]">No posts yet — check back soon.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block bg-[#1e1e2e] border border-[#313244] rounded-xl p-6 hover:border-[#89b4fa]/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {post.membersOnly && (
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-[#f9e2af] border border-[#f9e2af]/30 px-1.5 py-0.5 rounded">
                        Members
                      </span>
                    )}
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[9px] font-semibold uppercase tracking-wider text-[#585b70] border border-[#313244] px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-[16px] font-semibold text-[#cdd6f4] group-hover:text-[#89b4fa] transition-colors leading-snug">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-1.5 text-[13px] text-[#a6adc8] leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 text-[11px] text-[#585b70]">
                <span>{post.author}</span>
                <span>·</span>
                <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
