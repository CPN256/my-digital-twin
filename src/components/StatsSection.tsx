import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, GitFork, Eye, AlertCircle, RefreshCw, ExternalLink, Github } from "lucide-react";
import CountUp from "react-countup";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconMap: Record<string, any> = { Stars: Star, Forks: GitFork, Watchers: Eye, Issues: AlertCircle };

interface StatsContent {
  title: string;
  subtitle: string;
  github_user: string;
  github_url: string;
}

const fallback: StatsContent = {
  title: "CAT CPN on GitHub",
  subtitle: "Live statistics pulled straight from our public repositories",
  github_user: "Ph462",
  github_url: "https://github.com/Ph462",
};

interface Totals {
  Stars: number;
  Forks: number;
  Watchers: number;
  Issues: number;
  repos: number;
}

const StatsSection = () => {
  const { data: c } = useSiteContent<StatsContent>("stats", fallback);
  const user = c.github_user || fallback.github_user;

  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`);
      if (!res.ok) throw new Error("GitHub request failed");
      const repos = await res.json();
      const t: Totals = { Stars: 0, Forks: 0, Watchers: 0, Issues: 0, repos: repos.length };
      for (const r of repos) {
        t.Stars += r.stargazers_count || 0;
        t.Forks += r.forks_count || 0;
        t.Watchers += r.watchers_count || 0;
        t.Issues += r.open_issues_count || 0;
      }
      setTotals(t);
    } catch (e: any) {
      setError("Could not reach GitHub right now.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = [
    { label: "Stars", value: totals?.Stars ?? 0 },
    { label: "Forks", value: totals?.Forks ?? 0 },
    { label: "Watchers", value: totals?.Watchers ?? 0 },
    { label: "Issues", value: totals?.Issues ?? 0 },
  ];

  return (
    <section id="stats" className="py-24 px-4 section-gradient">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 text-xs text-primary tracking-[0.2em] uppercase">
            <Github size={14} /> Real-Time Data
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{c.title}</h2>
        <p className="text-muted-foreground text-center mb-4">{c.subtitle}</p>
        <p className="text-center text-xs text-muted-foreground mb-8 font-mono">
          github.com/{user}
          {totals ? ` · ${totals.repos} public repositories` : ""}
        </p>

        <div className="flex justify-center mb-10">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all text-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> REFRESH
          </button>
        </div>

        {error && <p className="text-center text-sm text-destructive mb-6">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = iconMap[stat.label] || Star;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl p-6 border border-border/50 bg-card/40 backdrop-blur-md text-center overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <Icon size={20} className="text-primary mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1 tabular-nums">
                    {loading && !totals ? "—" : <CountUp end={stat.value} duration={1.6} separator="," />}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <span className="inline-block mt-2 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full animate-pulse-glow">LIVE</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center mt-8">
          <a href={c.github_url || `https://github.com/${user}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary text-sm hover:underline">
            <Github size={14} /> View on GitHub <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
