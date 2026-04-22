import { motion } from "framer-motion";

const skills = [
  "React", "TypeScript", "Node.js", "Supabase", "Tailwind CSS",
  "Framer Motion", "Vite", "PostgreSQL", "Edge Functions", "PWA",
  "Bot Development", "AI Integration", "REST APIs", "Realtime", "UI/UX",
];

const Row = ({ reverse = false }: { reverse?: boolean }) => (
  <motion.div
    animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
    className="flex whitespace-nowrap gap-3 w-max"
  >
    {[...skills, ...skills].map((s, i) => (
      <span
        key={`${s}-${i}`}
        className="px-5 py-2 rounded-full border border-primary/20 bg-card/40 backdrop-blur-sm text-sm text-foreground/80 hover:text-primary hover:border-primary/50 transition-colors"
      >
        {s}
      </span>
    ))}
  </motion.div>
);

const SkillsMarquee = () => {
  return (
    <section className="py-16 overflow-hidden">
      <div className="text-center mb-8 px-4">
        <span className="text-xs text-primary tracking-[0.2em] uppercase font-mono">Tech Stack</span>
        <h2 className="text-2xl md:text-3xl font-bold mt-2">Tools we craft with</h2>
      </div>
      <div className="space-y-3 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <Row />
        <Row reverse />
      </div>
    </section>
  );
};

export default SkillsMarquee;
