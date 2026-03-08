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
  items: [
    { text: "CPN Bot completely transformed how we manage our Discord server. The moderation tools are incredible!", author: "Alex M.", date: "Feb 2026" },
    { text: "The portfolio builder saved me hours. I had a professional site up in under 10 minutes.", author: "Sarah K.", date: "Jan 2026" },
    { text: "Amazing support team. They helped me set up the API gateway for my startup in no time.", author: "James O.", date: "Mar 2026" },
    { text: "The link shortener with analytics is a game changer for our marketing campaigns.", author: "Priya R.", date: "Feb 2026" },
    { text: "I love the auto-mod bot. Our Telegram group has been spam-free since we set it up.", author: "David L.", date: "Jan 2026" },
    { text: "CPN Mobile is sleek and fast. Having all tools in one app on my phone is so convenient.", author: "Fatima N.", date: "Mar 2026" },
  ],
};

const TestimonialsSection = () => {
  const { data: c } = useSiteContent<TestimonialsContent>("testimonials", fallback);

  return (
    <section id="feedback" className="py-24 px-4 section-gradient">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{c.title}</h2>
        <p className="text-muted-foreground text-center mb-12">{c.subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
