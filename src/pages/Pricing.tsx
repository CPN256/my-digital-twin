import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { usePageTracking } from "@/hooks/usePageTracking";

const plans = [
  {
    name: "Starter",
    price: "Free",
    note: "For trying things out",
    features: ["1 bot instance", "Community support", "Basic analytics", "Shared hosting"],
    cta: "Get started",
  },
  {
    name: "Pro",
    price: "$15",
    note: "per month",
    features: ["5 bot instances", "Priority support", "Advanced analytics", "Custom domain", "Uptime monitoring"],
    cta: "Choose Pro",
    featured: true,
  },
  {
    name: "Business",
    price: "Custom",
    note: "Tailored to you",
    features: ["Unlimited instances", "Dedicated engineer", "SLA & uptime guarantee", "Private deployment", "Custom development"],
    cta: "Talk to us",
  },
];

const Pricing = () => {
  usePageTracking("/pricing");

  useEffect(() => {
    document.title = "Pricing — CAT CPN plans for bots, tools & hosting";
  }, []);

  return (
    <main className="min-h-screen bg-background px-4 py-20">
      <div className="container mx-auto max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={14} /> Back home
        </Link>

        <div className="text-center mb-12">
          <span className="text-xs text-primary tracking-[0.2em] uppercase font-mono">Pricing</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-3">Simple plans, no surprises</h1>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">Start free. Upgrade when your community grows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`glass glass-hover rounded-2xl p-7 flex flex-col ${plan.featured ? "border-primary/50 shadow-[0_20px_60px_-25px_hsl(var(--glow)/0.6)]" : ""}`}
            >
              {plan.featured && (
                <span className="self-start text-[10px] uppercase tracking-wider text-primary-foreground bg-primary px-2 py-0.5 rounded-full mb-3">Most popular</span>
              )}
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <div className="mt-3 mb-1 flex items-end gap-1.5">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-xs text-muted-foreground mb-1">{plan.note}</span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check size={14} className="text-primary mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a
                href="/#connect"
                className={`mt-7 text-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-[0.98] ${plan.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border text-foreground hover:border-primary/50"}`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Pricing;
