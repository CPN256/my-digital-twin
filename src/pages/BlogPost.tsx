import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePageTracking } from "@/hooks/usePageTracking";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  tags: string[];
  created_at: string;
}

const BlogPost = () => {
  const { slug } = useParams();
  usePageTracking(`/blog/${slug}`);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
      setPost((data as Post) ?? null);
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} — CAT CPN`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && post.excerpt) meta.setAttribute("content", post.excerpt);
  }, [post]);

  return (
    <main className="min-h-screen bg-background px-4 py-20">
      <div className="container mx-auto max-w-2xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={14} /> All articles
        </Link>

        {loading && <p className="text-muted-foreground text-sm">Loading…</p>}
        {!loading && !post && <p className="text-muted-foreground text-sm">Article not found.</p>}

        {post && (
          <article>
            {post.cover_image && (
              <img
                src={post.cover_image}
                alt={post.title}
                loading="lazy"
                className="w-full rounded-2xl mb-8 border border-border/50"
              />
            )}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono mb-3">
              <CalendarDays size={12} />
              {new Date(post.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ letterSpacing: "-0.02em" }}>{post.title}</h1>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {post.content.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-8">
              {post.tags?.map((t) => (
                <span key={t} className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">#{t}</span>
              ))}
            </div>
          </article>
        )}
      </div>
    </main>
  );
};

export default BlogPost;
