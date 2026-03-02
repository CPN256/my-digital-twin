import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 overflow-hidden">
      {/* Dashed frame */}
      <div className="absolute inset-8 md:inset-16 lg:inset-24 dashed-frame pointer-events-none" />

      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mb-8"
      >
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-dashed border-primary/50 flex flex-col items-center justify-center">
          <span className="text-3xl md:text-4xl font-bold text-primary text-glow">CAT</span>
          <span className="text-xs text-primary/70 tracking-[0.3em]">✦CPN✦</span>
        </div>
      </motion.div>

      {/* Welcome badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs tracking-[0.2em] uppercase mb-8"
      >
        ◆ Welcome ◆
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold text-center leading-tight max-w-4xl"
      >
        Creative Productivity{" "}
        <br />
        Nexus <span className="text-primary text-glow">CPN</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-muted-foreground text-lg mt-6 text-center max-w-lg"
      >
        Building powerful digital tools and solutions for everyone
      </motion.p>

      {/* CTA */}
      <motion.a
        href="#tools"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-10 px-8 py-4 rounded-lg bg-secondary border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-3 group"
      >
        Explore Tools
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </motion.a>

      {/* Version */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-24 right-8 md:right-28 text-xs text-primary/60 font-mono"
      >
        v2.0.25
      </motion.span>

      {/* Scroll down */}
      <motion.a
        href="#stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-muted-foreground text-xs tracking-[0.2em] uppercase hover:text-primary transition-colors"
      >
        Scroll Down
        <ChevronDown size={18} className="animate-bounce" />
      </motion.a>
    </section>
  );
};

export default HeroSection;
