import { motion } from "framer-motion";
import { Star, GitFork, Eye, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconMap: Record<string, any> = { Stars: Star, Forks: GitFork, Watchers: Eye, Issues: AlertCircle };

interface StatsContent {
  title: string;
  subtitle: string;
  github_url: string;
  items: { label: string; value: string }[];
}

const fallback: StatsContent = {
  title: "CAT-CPN-GO",
  subtitle: "Real-time statistics from our main repository",
  github_url: "https://github.com/Ph462/cpn-creative-hub",
  items: [
    { label: "Stars", value: "418" },
    { label: "Forks", value: "1,551" },
    { label: "Watchers", value: "418" },
    { label: "Issues", value: "44" },
  ],
};

const StatsSection = () => {
  const { data: c } = useSiteContent<StatsContent>("stats", fallback);

  return (
    <section id="stats" className="py-24 px-4 section-gradient">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-4">
          <span className="text-xs text-primary tracking-[0.2em] uppercase">Real-Time Data</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{c.title}</h2>
        <p className="text-muted-foreground text-center mb-10">{c.subtitle}</p>

        <div className="flex justify-center mb-10">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all text-sm">
            <RefreshCw size={14} /> REFRESH
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {c.items.map((stat, i) => {
            const Icon = iconMap[stat.label] || Star;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-surface rounded-xl p-6 border border-border/50 border-glow text-center">
                <Icon size={20} className="text-primary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <span className="inline-block mt-2 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full animate-pulse-glow">LIVE</span>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center mt-8">
          <a href={c.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary text-sm hover:underline">
            View on GitHub <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
