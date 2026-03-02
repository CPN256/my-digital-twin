import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  { text: "Nice job", author: "popkid", date: "Jan 2026" },
  { text: "Amazing tools, very helpful for my projects!", author: "techuser", date: "Dec 2025" },
  { text: "The best WhatsApp bot I've ever used", author: "Cat Phoenix", date: "Nov 2025" },
];

const TestimonialsSection = () => {
  return (
    <section id="feedback" className="py-24 px-4 section-gradient">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What People Say</h2>
        <p className="text-muted-foreground text-center mb-12">Feedback from our community and users</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="card-surface rounded-xl p-6 border border-border/50 border-glow"
            >
              <Quote size={20} className="text-primary/50 mb-4" />
              <p className="text-foreground mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {t.author[0].toUpperCase()}
                </div>
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
