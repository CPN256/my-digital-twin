import { motion } from "framer-motion";
import { Bot, Zap, ShieldCheck, Globe2, Rocket, Clock } from "lucide-react";

const items = [
  {
    icon: Bot,
    title: "Bots that never sleep",
    body: "Moderation, support and automation bots running 24/7 across WhatsApp, Telegram and Discord.",
    className: "md:col-span-2 md:row-span-2",
    big: true,
  },
  { icon: Zap, title: "Fast by default", body: "Sub-second loads, lazy media and offline-ready PWA.", className: "" },
  { icon: ShieldCheck, title: "Secure", body: "Row-level security, role-based admin, encrypted auth.", className: "" },
  { icon: Globe2, title: "Built in Uganda", body: "Made for African connectivity — light, resilient, low-data.", className: "md:col-span-2" },
  { icon: Rocket, title: "Ship weekly", body: "New tools and improvements land continuously.", className: "" },
  { icon: Clock, title: "Always on", body: "99.9% uptime target with health checks and alerting.", className: "" },
];

const BentoSection = () => (
  <section id="why" className="py-24 px-4">
    <div className="container mx-auto max-w-5xl">
      <div className="text-center mb-12">
        <span className="text-xs text-primary tracking-[0.2em] uppercase font-mono">Why CAT CPN</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-3">Everything in one hub</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(150px,auto)] gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`glass glass-hover rounded-2xl p-6 flex flex-col justify-between ${item.className}`}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary mb-4">
              <item.icon size={18} />
            </div>
            <div>
              <h3 className={`font-semibold mb-1.5 ${item.big ? "text-xl md:text-2xl" : "text-base"}`}>{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BentoSection;
