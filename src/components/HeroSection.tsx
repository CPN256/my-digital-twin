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
  description: "Building powerful digital tools and solutions for everyone",
  badge: "◆ Welcome ◆",
  cta_text: "Explore Tools",
  version: "v2.0.25",
};

const HeroSection = () => {
  const { data: c } = useSiteContent<HeroContent>("hero", fallback);

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 overflow-hidden">
      <div className="absolute inset-8 md:inset-16 lg:inset-24 dashed-frame pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative mb-8">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-dashed border-primary/50 flex flex-col items-center justify-center">
          <span className="text-3xl md:text-4xl font-bold text-primary text-glow">CAT</span>
          <span className="text-xs text-primary/70 tracking-[0.3em]">✦CPN✦</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="px-6 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs tracking-[0.2em] uppercase mb-8">
        {c.badge}
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-4xl md:text-6xl lg:text-7xl font-bold text-center leading-tight max-w-4xl">
        {c.title} <br /> {c.subtitle} <span className="text-primary text-glow">CPN</span>
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-muted-foreground text-lg mt-6 text-center max-w-lg">
        {c.description}
      </motion.p>

      <motion.a href="#tools" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-10 px-8 py-4 rounded-lg bg-secondary border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-3 group">
        {c.cta_text}
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </motion.a>

      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="absolute bottom-24 right-8 md:right-28 text-xs text-primary/60 font-mono">
        {c.version}
      </motion.span>

      <motion.a href="#stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-8 flex flex-col items-center gap-2 text-muted-foreground text-xs tracking-[0.2em] uppercase hover:text-primary transition-colors">
        Scroll Down
        <ChevronDown size={18} className="animate-bounce" />
      </motion.a>
    </section>
  );
};

export default HeroSection;
