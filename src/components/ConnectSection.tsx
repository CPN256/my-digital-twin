import { motion } from "framer-motion";
import { MessageCircle, Youtube, Instagram, Phone, Github, Mail, Send, Facebook, Twitter, Music2 } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconMap: Record<string, any> = {
  YouTube: Youtube,
  Instagram: Instagram,
  WhatsApp: Phone,
  GitHub: Github,
  Email: Mail,
  Telegram: Send,
  Facebook: Facebook,
  X: Twitter,
  TikTok: Music2,
};

interface ConnectContent {
  title: string;
  subtitle: string;
  whatsapp_channel: string;
  socials: { label: string; href: string }[];
}

const fallback: ConnectContent = {
  title: "Connect With Us",
  subtitle: "Follow us on social media for updates, tutorials, and new releases",
  whatsapp_channel: "https://whatsapp.com/channel/catcpn",
  socials: [
    { label: "YouTube", href: "https://www.youtube.com/@CatPhoenix" },
    { label: "Instagram", href: "https://instagram.com/catphoenix3" },
    { label: "WhatsApp", href: "https://wa.me/256750713834" },
    { label: "GitHub", href: "https://github.com/Ph462" },
    { label: "Email", href: "mailto:catphoenix6@gmail.com" },
  ],
};

const brandMap: Record<string, { color: string; bg: string; border: string }> = {
  YouTube: { color: "text-[#FF0000]", bg: "bg-[#FF0000]/10", border: "border-[#FF0000]/40 hover:border-[#FF0000]" },
  Instagram: { color: "text-[#E1306C]", bg: "bg-[#E1306C]/10", border: "border-[#E1306C]/40 hover:border-[#E1306C]" },
  WhatsApp: { color: "text-[#25D366]", bg: "bg-[#25D366]/10", border: "border-[#25D366]/40 hover:border-[#25D366]" },
  GitHub: { color: "text-foreground", bg: "bg-foreground/10", border: "border-foreground/30 hover:border-foreground" },
  Email: { color: "text-[#EA4335]", bg: "bg-[#EA4335]/10", border: "border-[#EA4335]/40 hover:border-[#EA4335]" },
  Telegram: { color: "text-[#229ED9]", bg: "bg-[#229ED9]/10", border: "border-[#229ED9]/40 hover:border-[#229ED9]" },
  Facebook: { color: "text-[#1877F2]", bg: "bg-[#1877F2]/10", border: "border-[#1877F2]/40 hover:border-[#1877F2]" },
  X: { color: "text-foreground", bg: "bg-foreground/10", border: "border-foreground/30 hover:border-foreground" },
  TikTok: { color: "text-[#00F2EA]", bg: "bg-[#00F2EA]/10", border: "border-[#00F2EA]/40 hover:border-[#00F2EA]" },
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

        <div className="flex flex-wrap justify-center gap-5 sm:gap-7">
          {c.socials.map((s) => {
            const Icon = iconMap[s.label] || MessageCircle;
            const b = brandMap[s.label] || { color: "text-primary", bg: "bg-primary/10", border: "border-primary/40 hover:border-primary" };
            return (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} aria-label={s.label} className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 flex items-center justify-center ${b.bg} ${b.border} ${b.color} hover:scale-110 transition-all`}>
                <Icon size={36} strokeWidth={1.8} />
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ConnectSection;
