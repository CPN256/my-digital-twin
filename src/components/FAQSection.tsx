import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "What does CAT CPN actually do?",
    a: "We design and build digital tools — bots, web apps, automation, and creative services — for individuals, communities, and small businesses across Africa and beyond.",
  },
  {
    q: "Can I request a custom project?",
    a: "Absolutely. Reach out via the Connect section with a quick brief and we'll get back to you with scope, timeline, and pricing.",
  },
  {
    q: "Do you offer support after delivery?",
    a: "Yes. Every project ships with a support window, and we offer ongoing maintenance plans for long-term partners.",
  },
  {
    q: "Is the platform free to use?",
    a: "Browsing, comments, and most public tools are completely free. Premium services are quoted per project.",
  },
  {
    q: "How can I follow your latest updates?",
    a: "Subscribe to the newsletter below or follow CAT CPN on YouTube, Instagram, and WhatsApp from the footer.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-xs text-primary tracking-[0.2em] uppercase font-mono">
            <HelpCircle size={14} /> FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">Questions, answered</h2>
          <p className="text-muted-foreground mt-3">Everything you might want to know before reaching out.</p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border border-border/50 rounded-xl px-5 bg-card/40 backdrop-blur-sm hover:border-primary/40 transition-colors"
            >
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
