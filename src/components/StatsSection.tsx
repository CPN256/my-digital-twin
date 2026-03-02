import { motion } from "framer-motion";
import { Star, GitFork, Eye, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";

const stats = [
  { label: "Stars", value: "418", icon: Star },
  { label: "Forks", value: "1,551", icon: GitFork },
  { label: "Watchers", value: "418", icon: Eye },
  { label: "Issues", value: "44", icon: AlertCircle },
];

const StatsSection = () => {
  return (
    <section id="stats" className="py-24 px-4 section-gradient">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-4">
          <span className="text-xs text-primary tracking-[0.2em] uppercase">Real-Time Data</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">CAT-CPN-GO</h2>
        <p className="text-muted-foreground text-center mb-10">Real-time statistics from our main repository</p>

        <div className="flex justify-center mb-10">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all text-sm">
            <RefreshCw size={14} />
            REFRESH
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-surface rounded-xl p-6 border border-border/50 border-glow text-center"
            >
              <stat.icon size={20} className="text-primary mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <span className="inline-block mt-2 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full animate-pulse-glow">
                LIVE
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <a
            href="https://github.com/Ph462/cpn-creative-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary text-sm hover:underline"
          >
            View on GitHub <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
