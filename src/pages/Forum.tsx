import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessagesSquare, Send, Trash2, CornerDownRight, Pin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePageTracking } from "@/hooks/usePageTracking";
import { toast } from "sonner";
import { format } from "date-fns";

interface Thread {
  id: string;
  user_id: string;
  display_name: string;
  title: string;
  body: string;
  category: string;
  pinned: boolean;
  created_at: string;
}

interface Reply {
  id: string;
  thread_id: string;
  user_id: string;
  display_name: string;
  body: string;
  created_at: string;
}

const CATEGORIES = ["General", "Bots", "Web Tools", "APIs", "Help"];

const Forum = () => {
  usePageTracking("/forum");
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("General");
  const [posting, setPosting] = useState(false);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    document.title = "Forum — Ask questions & discuss CAT CPN";
    load();

    const channel = supabase
      .channel("forum-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_threads" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_replies" }, () => load())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const load = async () => {
    const [{ data: t }, { data: r }] = await Promise.all([
      supabase.from("forum_threads").select("*").order("pinned", { ascending: false }).order("created_at", { ascending: false }).limit(100),
      supabase.from("forum_replies").select("*").order("created_at", { ascending: true }).limit(500),
    ]);
    setThreads((t as Thread[]) ?? []);
    setReplies((r as Reply[]) ?? []);
    setLoading(false);
  };

  const nameFor = async () => {
    if (!user) return "Anonymous";
    const { data: profile } = await supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle();
    return profile?.display_name || user.email?.split("@")[0] || "Anonymous";
  };

  const createThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;
    setPosting(true);
    const display_name = await nameFor();
    const { error } = await supabase.from("forum_threads").insert({
      user_id: user.id,
      display_name,
      title: title.trim(),
      body: body.trim(),
      category,
    });
    setPosting(false);
    if (error) return toast.error(error.message);
    setTitle("");
    setBody("");
    toast.success("Topic posted");
    load();
  };

  const postReply = async (threadId: string) => {
    if (!user || !replyText.trim()) return;
    const display_name = await nameFor();
    const { error } = await supabase.from("forum_replies").insert({
      thread_id: threadId,
      user_id: user.id,
      display_name,
      body: replyText.trim(),
    });
    if (error) return toast.error(error.message);
    setReplyText("");
    load();
  };

  const remove = async (table: "forum_threads" | "forum_replies", id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const visible = filter === "All" ? threads : threads.filter((t) => t.category === filter);

  return (
    <main className="min-h-screen bg-background px-4 py-20">
      <div className="container mx-auto max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={14} /> Back home
        </Link>

        <span className="text-xs text-primary tracking-[0.2em] uppercase font-mono">Community</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-3 flex items-center gap-3">
          <MessagesSquare className="text-primary" size={28} /> CAT CPN Forum
        </h1>
        <p className="text-muted-foreground text-sm mb-10 max-w-xl">
          Ask questions, report bugs, request features and discuss everything we build. Answers come from the team and the community.
        </p>

        {/* New topic */}
        {user ? (
          <form onSubmit={createThread} className="glass rounded-2xl p-5 mb-8 space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question?"
              maxLength={140}
              className="w-full bg-secondary/40 border border-border/50 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add more detail (optional)"
              rows={3}
              className="w-full bg-secondary/40 border border-border/50 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors resize-none"
            />
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-secondary/40 border border-border/50 rounded-lg px-3 py-2 text-xs outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={posting || !title.trim()}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50 active:scale-[0.98] transition-all"
              >
                {posting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} Post topic
              </button>
            </div>
          </form>
        ) : (
          <div className="glass rounded-2xl p-5 mb-8 text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">Sign in</Link> to start a topic or reply. Reading is open to everyone.
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs border transition-all ${
                filter === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-primary hover:border-primary/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading && <p className="text-muted-foreground text-sm">Loading discussions…</p>}
        {!loading && visible.length === 0 && (
          <p className="text-muted-foreground text-sm">No topics here yet — be the first to ask something.</p>
        )}

        <div className="space-y-4">
          {visible.map((t, i) => {
            const threadReplies = replies.filter((r) => r.thread_id === t.id);
            const open = openId === t.id;
            return (
              <motion.article
                key={t.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <button onClick={() => setOpenId(open ? null : t.id)} className="text-left flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      {t.pinned && <Pin size={12} className="text-primary" />}
                      <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t.category}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {format(new Date(t.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                    <h2 className="font-semibold text-foreground">{t.title}</h2>
                    {t.body && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t.body}</p>}
                    <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
                      <span>by {t.display_name}</span>
                      <span className="inline-flex items-center gap-1 text-primary">
                        <CornerDownRight size={11} /> {threadReplies.length} {threadReplies.length === 1 ? "reply" : "replies"}
                      </span>
                    </div>
                  </button>
                  {user?.id === t.user_id && (
                    <button onClick={() => remove("forum_threads", t.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-border/40 space-y-3">
                        {threadReplies.map((r) => (
                          <div key={r.id} className="flex items-start gap-3 bg-secondary/30 rounded-xl p-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono mb-1">
                                <span className="text-foreground">{r.display_name}</span>
                                {format(new Date(r.created_at), "MMM d, HH:mm")}
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
                            </div>
                            {user?.id === r.user_id && (
                              <button onClick={() => remove("forum_replies", r.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        ))}

                        {user ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && postReply(t.id)}
                              placeholder="Write a reply…"
                              className="flex-1 bg-secondary/40 border border-border/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50 transition-colors"
                            />
                            <button
                              onClick={() => postReply(t.id)}
                              className="p-2 rounded-lg bg-primary text-primary-foreground active:scale-95 transition-transform"
                            >
                              <Send size={14} />
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            <Link to="/login" className="text-primary hover:underline">Sign in</Link> to reply.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Forum;
