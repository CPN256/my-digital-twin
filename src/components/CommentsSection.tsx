import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Trash2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface Comment {
  id: string;
  user_id: string;
  display_name: string;
  message: string;
  created_at: string;
}

const LAST_VISIT_KEY = "cat-cpn-comments-last-visit";

const CommentsSection = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [lastVisit, setLastVisit] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(LAST_VISIT_KEY);
    setLastVisit(stored);
    fetchComments();

    // Realtime subscription
    const channel = supabase
      .channel("comments-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setComments((prev) => [payload.new as Comment, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setComments((prev) => prev.filter((c) => c.id !== (payload.old as Comment).id));
          }
        }
      )
      .subscribe();

    return () => {
      localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString());
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setComments(data);
  };

  const newComments = lastVisit
    ? comments.filter((c) => c.created_at > lastVisit)
    : comments;
  const oldComments = lastVisit
    ? comments.filter((c) => c.created_at <= lastVisit)
    : [];

  const displayedComments = showOld ? comments : newComments.length > 0 ? newComments : comments;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    setLoading(true);

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .single();

    await supabase.from("comments").insert({
      user_id: user.id,
      display_name: profile?.display_name || user.email?.split("@")[0] || "Anonymous",
      message: message.trim(),
    });

    setMessage("");
    setLoading(false);
    // No need to fetchComments — realtime handles it
  };

  const handleDelete = async (id: string) => {
    await supabase.from("comments").delete().eq("id", id);
    // Realtime handles removal
  };

  return (
    <section id="comments" className="py-24 px-4 section-gradient">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-4">
          <span className="text-xs text-primary tracking-[0.2em] uppercase font-mono">Community</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <MessageCircle className="inline-block mr-2 text-primary" size={28} />
          Comments Feed
        </h2>
        <p className="text-muted-foreground text-center mb-10">Share your thoughts with the CAT CPN community</p>

        {/* Post form */}
        {user ? (
          <form onSubmit={handleSubmit} className="mb-8 card-surface rounded-2xl border border-border/50 border-glow p-5 flex gap-3 items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a comment..."
              maxLength={500}
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-2"
            >
              <Send size={14} /> Post
            </button>
          </form>
        ) : (
          <div className="mb-8 card-surface rounded-2xl border border-border/50 border-glow p-5 text-center text-muted-foreground text-sm">
            <a href="/login" className="text-primary hover:underline font-medium">Sign in</a> to post a comment
          </div>
        )}

        {/* New/Old toggle */}
        {lastVisit && oldComments.length > 0 && newComments.length > 0 && (
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowOld(!showOld)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
            >
              <Clock size={12} />
              {showOld ? "Show new only" : `Show all (${oldComments.length} older)`}
            </button>
          </div>
        )}

        {newComments.length > 0 && !showOld && lastVisit && (
          <div className="text-center mb-4 text-xs text-primary font-medium tracking-wider uppercase font-mono">
            ✦ {newComments.length} New {newComments.length === 1 ? "Comment" : "Comments"} ✦
          </div>
        )}

        {/* Comments feed */}
        <div className="space-y-3">
          <AnimatePresence>
            {displayedComments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.03 }}
                className="card-surface rounded-xl border border-border/50 p-4 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[11px] font-bold shrink-0">
                        {comment.display_name[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-foreground">{comment.display_name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {format(new Date(comment.created_at), "MMM d, h:mm a")}
                      </span>
                      {lastVisit && comment.created_at > lastVisit && (
                        <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-medium animate-pulse">NEW</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground pl-9 leading-relaxed">{comment.message}</p>
                  </div>
                  {user?.id === comment.user_id && (
                    <button onClick={() => handleDelete(comment.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {displayedComments.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-12">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommentsSection;
