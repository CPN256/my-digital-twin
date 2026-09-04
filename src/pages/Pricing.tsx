import { useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ShoppingCart } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useSiteContent } from "@/hooks/useSiteContent";
import { usePageTracking } from "@/hooks/usePageTracking";

interface Tier {
  name: string;
  tool: string;
  price: string;
  period: string;
  note: string;
  features: string[];
  cta: string;
  checkout_url: string;
  featured?: boolean;
}

interface PricingContent {
  title: string;
  subtitle: string;
  tiers: Tier[];
  footnote: string;
}

const wa = (text: string) =>
  `https://wa.me/256750713834?text=${encodeURIComponent(text)}`;

const fallback: PricingContent = {
  title: "Pricing for every CAT CPN tool",
  subtitle:
    "Transparent plans for our bots, web tools and custom builds. Pay monthly, cancel anytime — no hidden setup fees.",
  footnote:
    "All plans are billed in USD and can be paid by Mobile Money, bank transfer or card. Need something different? Message us on +256 750 713 834.",
  tiers: [
    {
      name: "CPN Bot — Starter",
      tool: "WhatsApp Automation",
      price: "Free",
      period: "forever",
      note: "For personal groups and testing",
      features: [
        "1 WhatsApp bot instance",
        "Core command pack (media, tools, fun)",
        "Shared hosting on our cloud",
        "Community support in the forum",
        "Weekly uptime restarts",
      ],
      cta: "Start free",
      checkout_url: wa("Hi CAT CPN, I want to start the free CPN Bot Starter plan."),
    },
    {
      name: "CPN Bot — Pro",
      tool: "WhatsApp Automation",
      price: "$15",
      period: "per month",
      note: "For active communities and creators",
      features: [
        "5 bot instances with 24/7 uptime",
        "All premium command packs + AI replies",
        "Anti-spam, auto-reply and scheduler",
        "Custom bot name, prefix and branding",
        "Priority WhatsApp support (under 6h)",
      ],
      cta: "Checkout Pro",
      checkout_url: wa("Hi CAT CPN, I want to buy CPN Bot Pro at $15/month."),
      featured: true,
    },
    {
      name: "Cat APIs — Developer",
      tool: "API Access",
      price: "$9",
      period: "per month",
      note: "For developers building on our endpoints",
      features: [
        "100,000 API calls per month",
        "Media, downloader and AI endpoints",
        "API key dashboard and usage logs",
        "99.5% uptime target",
        "Email support",
      ],
      cta: "Checkout Developer",
      checkout_url: wa("Hi CAT CPN, I want the Cat APIs Developer plan at $9/month."),
    },
    {
      name: "CAT CHAT — Team",
      tool: "Chat Platform",
      price: "$25",
      period: "per month",
      note: "For teams and small businesses",
      features: [
        "Up to 50 team members",
        "Private rooms and file sharing",
        "Custom domain and branding",
        "Moderation and analytics dashboard",
        "Onboarding session included",
      ],
      cta: "Checkout Team",
      checkout_url: wa("Hi CAT CPN, I want the CAT CHAT Team plan at $25/month."),
    },
    {
      name: "Web & Mobile Build",
      tool: "Custom Development",
      price: "From $250",
      period: "per project",
      note: "Websites, PWAs and mobile apps",
      features: [
        "Discovery call and written scope",
        "Custom design plus responsive build",
        "Backend, auth and database setup",
        "Deployment and 30 days of fixes",
        "Optional monthly maintenance",
      ],
      cta: "Request a quote",
      checkout_url: wa("Hi CAT CPN, I would like a quote for a custom web/mobile build."),
    },
    {
      name: "Business — Everything",
      tool: "Full Suite",
      price: "Custom",
      period: "tailored to you",
      note: "All tools, dedicated engineering",
      features: [
        "Unlimited bot and API instances",
        "Dedicated engineer and private deployment",
        "SLA with uptime guarantee",
        "Staff training and documentation",
        "Direct line to the founder",
      ],
      cta: "Talk to us",
      checkout_url: wa("Hi CAT CPN, I want to discuss the Business suite."),
    },
  ],
};

const Pricing = () => {
  usePageTracking("/pricing");
  const { data: c } = useSiteContent<PricingContent>("pricing", fallback);

  useEffect(() => {
    document.title = "Pricing — CAT CPN bots, APIs and custom builds";
  }, []);

  return (
    <PageShell eyebrow="Pricing" title={c.title} subtitle={c.subtitle}>
      <section className="px-4 py-10">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(c.tiers || []).map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`card-surface border rounded-2xl p-7 flex flex-col ${
                plan.featured
                  ? "border-primary/50 shadow-[0_20px_60px_-25px_hsl(var(--glow)/0.6)]"
                  : "border-border/50"
              }`}
            >
              {plan.featured && (
                <span className="self-start text-[10px] uppercase tracking-wider text-primary-foreground bg-primary px-2 py-0.5 rounded-full mb-3">
                  Most popular
                </span>
              )}
              {plan.tool && (
                <span className="text-[11px] uppercase tracking-wide text-primary font-mono">{plan.tool}</span>
              )}
              <h2 className="text-lg font-semibold mt-1">{plan.name}</h2>
              <div className="mt-3 mb-1 flex items-end gap-1.5">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-xs text-muted-foreground mb-1">{plan.period}</span>
              </div>
              <p className="text-xs text-muted-foreground">{plan.note}</p>
              <ul className="mt-6 space-y-3 flex-1">
                {(plan.features || []).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check size={14} className="text-primary mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.checkout_url || wa(`Hi CAT CPN, I am interested in ${plan.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-7 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-[0.98] ${
                  plan.featured
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border text-foreground hover:border-primary/50"
                }`}
              >
                <ShoppingCart size={14} /> {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {c.footnote && (
          <p className="container mx-auto max-w-3xl text-center text-xs text-muted-foreground mt-10">
            {c.footnote}
          </p>
        )}
      </section>
    </PageShell>
  );
};

export default Pricing;
