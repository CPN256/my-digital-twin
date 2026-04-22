import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase() });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        toast.error("You're already subscribed.");
      } else {
        toast.error("Could not subscribe. Try again.");
      }
      return;
    }
    setDone(true);
    setEmail("");
    toast.success("You're in! Welcome to CAT CPN.");
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-primary/20 bg-card/40 backdrop-blur-xl p-8 md:p-12 text-center overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 items-center justify-center mb-5">
              <Mail size={20} className="text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Stay in the loop
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Get fresh tools, project drops, and behind-the-scenes from CAT CPN — straight to your inbox.
            </p>

            {done ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm">
                <CheckCircle2 size={16} /> Subscribed — check your inbox soon.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 px-4 py-3 rounded-xl bg-background/60 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 active:scale-[0.97] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? "Subscribing..." : (<>Subscribe <Send size={14} /></>)}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
