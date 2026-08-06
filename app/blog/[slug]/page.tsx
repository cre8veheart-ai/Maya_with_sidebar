import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog/store";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post || post.status !== "published") notFound();

  return (
    <div className="px-8 py-10 max-w-2xl">
      {/* Back */}
      <Link href="/blog" className="text-[12px] text-[#585b70] hover:text-[#89b4fa] transition-colors mb-6 inline-flex items-center gap-1.5">
        ← All posts
      </Link>

      {/* Tags */}
      <div className="flex items-center gap-2 mt-4 mb-3">
        {post.membersOnly && (
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#f9e2af] border border-[#f9e2af]/30 px-1.5 py-0.5 rounded">
            Members
          </span>
        )}
        {post.tags.map((tag) => (
          <span key={tag} className="text-[9px] font-semibold uppercase tracking-wider text-[#585b70] border border-[#313244] px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-[26px] font-semibold text-[#cdd6f4] tracking-tight leading-tight mb-2">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-3 text-[12px] text-[#585b70] mb-8">
        <span>{post.author}</span>
        <span>·</span>
        <span>
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : ""}
        </span>
      </div>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-[15px] text-[#a6adc8] leading-relaxed mb-8 border-l-2 border-[#89b4fa]/40 pl-4 italic">
          {post.excerpt}
        </p>
      )}

      {/* Content */}
      <div className="prose prose-invert prose-sm max-w-none text-[#cdd6f4] leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>
    </div>
  );
}
