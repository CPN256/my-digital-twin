import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import FounderSection from "@/components/FounderSection";
import StatsSection from "@/components/StatsSection";
import SkillsMarquee from "@/components/SkillsMarquee";
import { useSiteContent } from "@/hooks/useSiteContent";
import { usePageTracking } from "@/hooks/usePageTracking";

interface AboutContent {
  title: string;
  subtitle: string;
  story: string[];
  values: { title: string; description: string }[];
}

const fallback: AboutContent = {
  title: "About CAT CPN",
  subtitle: "A Uganda-born studio building bots, web tools, cloud services and mobile apps that simplify digital life.",
  story: [
    "CAT CPN started as a single WhatsApp automation experiment and grew into a full studio shipping products used across Africa and beyond.",
    "We build for real network conditions: light payloads, offline-first thinking, and interfaces that stay fast on mid-range phones.",
    "Everything we make is designed to be practical first — tools people actually keep using after the first week.",
  ],
  values: [
    { title: "Build in the open", description: "We share our stack, our decisions and our build logs on the blog and forum." },
    { title: "Speed matters", description: "Every product is tuned for low-bandwidth connections and older devices." },
    { title: "Community first", description: "Our users shape the roadmap through the forum, comments and direct messages." },
    { title: "Ship, then refine", description: "Small releases, fast feedback loops, continuous improvement." },
  ],
};

const About = () => {
  usePageTracking("/about");
  const { data: c } = useSiteContent<AboutContent>("about", fallback);

  return (
    <PageShell eyebrow="Who we are" title={c.title} subtitle={c.subtitle}>
      <section className="px-4 py-10">
        <div className="container mx-auto max-w-3xl space-y-5">
          {c.story?.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-muted-foreground leading-relaxed"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="container mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-5">
          {c.values?.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="card-surface border border-border/50 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <SkillsMarquee />
      <StatsSection />
      <FounderSection />
    </PageShell>
  );
};

export default About;
