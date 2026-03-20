import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  cta_text: string;
  version: string;
}

const fallback: HeroContent = {
  title: "Creative Productivity",
  subtitle: "Nexus CPN",
  description: "Building powerful digital tools and solutions for everyone. We craft bots, web apps, and services that simplify your digital life.",
  badge: "◆ Welcome ◆",
  cta_text: "Explore Tools",
  version: "v2.0.25",
};

const HeroSection = () => {
  const { data: c } = useSiteContent<HeroContent>("hero", fallback);

  return (
    <section id="home" className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 pt-14 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/4 rounded-full blur-[160px] pointer-events-none" />

      {/* Logo mark */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-10"
      >
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col items-center justify-center">
          <span className="text-2xl md:text-3xl font-bold text-primary" style={{ lineHeight: 1 }}>CAT</span>
          <span className="text-[10px] text-primary/60 tracking-[0.3em] mt-1">CPN</span>
        </div>
      </motion.div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="px-4 py-1 rounded-full border border-border/50 bg-secondary/50 text-muted-foreground text-[11px] tracking-[0.15em] uppercase mb-6"
      >
        {c.badge}
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-3xl"
        style={{ lineHeight: 1.1, letterSpacing: '-0.02em', textWrap: 'balance' }}
      >
        {c.title}
        <span className="text-primary"> CPN</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-muted-foreground text-base md:text-lg mt-5 text-center max-w-md"
        style={{ textWrap: 'pretty' }}
      >
        {c.description}
      </motion.p>

      {/* CTA */}
      <motion.a
        href="#tools"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        className="mt-8 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all active:scale-[0.97] flex items-center gap-2 group"
      >
        {c.cta_text}
        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
      </motion.a>

      {/* Version */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-20 right-6 md:right-16 text-[10px] text-muted-foreground/50 font-mono"
      >
        {c.version}
      </motion.span>

      {/* Scroll indicator */}
      <motion.a
        href="#video"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-6 flex flex-col items-center gap-1.5 text-muted-foreground/40 text-[10px] tracking-[0.2em] uppercase hover:text-muted-foreground transition-colors"
      >
        Scroll
        <ChevronDown size={14} className="animate-bounce" />
      </motion.a>
    </section>
  );
};

export default HeroSection;
