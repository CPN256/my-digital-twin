import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

interface TestimonialsContent {
  title: string;
  subtitle: string;
  items: { text: string; author: string; date: string }[];
}

const fallback: TestimonialsContent = {
  title: "What People Say",
  subtitle: "Feedback from our community and users",
  items: [],
};

const TestimonialsSection = () => {
  const { data: c } = useSiteContent<TestimonialsContent>("testimonials", fallback);

  return (
    <section id="feedback" className="py-24 px-4 section-gradient">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{c.title}</h2>
        <p className="text-muted-foreground text-center mb-12">{c.subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {c.items.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="card-surface rounded-xl p-6 border border-border/50 border-glow">
              <Quote size={20} className="text-primary/50 mb-4" />
              <p className="text-foreground mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{t.author[0].toUpperCase()}</div>
                <div>
                  <div className="text-sm font-medium text-foreground">{t.author}</div>
                  <div className="text-xs text-muted-foreground">{t.date}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
