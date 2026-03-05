import { motion } from "framer-motion";
import { MessageCircle, Youtube, Instagram, Phone } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconMap: Record<string, any> = { YouTube: Youtube, Instagram: Instagram, WhatsApp: Phone };

interface ConnectContent {
  title: string;
  subtitle: string;
  whatsapp_channel: string;
  socials: { label: string; href: string }[];
}

const fallback: ConnectContent = {
  title: "Connect With Us",
  subtitle: "Follow us on social media for updates, tutorials, and new releases",
  whatsapp_channel: "",
  socials: [],
};

const colorMap: Record<string, string> = {
  YouTube: "hover:text-red-400",
  Instagram: "hover:text-pink-400",
  WhatsApp: "hover:text-green-400",
};

const ConnectSection = () => {
  const { data: c } = useSiteContent<ConnectContent>("connect", fallback);

  return (
    <section id="connect" className="py-24 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.title}</h2>
        <p className="text-muted-foreground mb-10">{c.subtitle}</p>

        {c.whatsapp_channel && (
          <motion.a href={c.whatsapp_channel} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium mb-12 transition-all">
            <MessageCircle size={20} /> Join WhatsApp Channel
          </motion.a>
        )}

        <div className="flex justify-center gap-6">
          {c.socials.map((s) => {
            const Icon = iconMap[s.label] || MessageCircle;
            return (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={`w-14 h-14 rounded-full border border-border flex items-center justify-center text-muted-foreground ${colorMap[s.label] || "hover:text-primary"} hover:border-primary/40 transition-all`}>
                <Icon size={22} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
