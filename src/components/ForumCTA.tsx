import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessagesSquare, ArrowRight } from "lucide-react";

const ForumCTA = () => (
  <section id="forum" className="container mx-auto px-4 py-16">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="card-surface relative overflow-hidden rounded-2xl border border-border/50 p-8 sm:p-12 text-center"
    >
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      <div className="relative">
        <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
          <MessagesSquare size={22} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Join the CAT CPN Community Forum</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Ask questions, share builds, report bugs and discuss the tools with other developers.
        </p>
        <Link
          to="/forum"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all active:scale-[0.98]"
        >
          Open the Forum <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  </section>
);

export default ForumCTA;
