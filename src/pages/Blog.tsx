import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePageTracking } from "@/hooks/usePageTracking";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[];
  created_at: string;
}

const Blog = () => {
  usePageTracking("/blog");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Blog — CAT CPN build logs, tutorials & updates";
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id,slug,title,excerpt,cover_image,tags,created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });
      setPosts((data as Post[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-background px-4 py-20">
      <div className="container mx-auto max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={14} /> Back home
        </Link>

        <span className="text-xs text-primary tracking-[0.2em] uppercase font-mono">Journal</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-10">The CAT CPN Blog</h1>

        {loading && <p className="text-muted-foreground text-sm">Loading articles…</p>}
        {!loading && posts.length === 0 && <p className="text-muted-foreground text-sm">No articles published yet.</p>}

        <div className="space-y-5">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link to={`/blog/${post.slug}`} className="glass glass-hover rounded-2xl p-6 block">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono mb-2">
                  <CalendarDays size={12} />
                  {new Date(post.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                </div>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags?.map((t) => (
                    <span key={t} className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">#{t}</span>
                  ))}
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Blog;
