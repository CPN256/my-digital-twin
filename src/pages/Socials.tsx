import { motion } from "framer-motion";
import {
  Youtube, Instagram, Github, Mail, Phone, Send, Facebook, Twitter, Music2,
  Linkedin, MessageCircle, Globe, ExternalLink,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconMap: Record<string, any> = {
  YouTube: Youtube,
  Instagram: Instagram,
  WhatsApp: Phone,
  "WhatsApp Channel": MessageCircle,
  GitHub: Github,
  Email: Mail,
  Telegram: Send,
  Facebook: Facebook,
  X: Twitter,
  TikTok: Music2,
  LinkedIn: Linkedin,
  Website: Globe,
};

const brandMap: Record<string, { color: string; ring: string; bg: string }> = {
  YouTube: { color: "text-[#FF0000]", ring: "border-[#FF0000]/40 hover:border-[#FF0000]", bg: "bg-[#FF0000]/10" },
  Instagram: { color: "text-[#E1306C]", ring: "border-[#E1306C]/40 hover:border-[#E1306C]", bg: "bg-[#E1306C]/10" },
  WhatsApp: { color: "text-[#25D366]", ring: "border-[#25D366]/40 hover:border-[#25D366]", bg: "bg-[#25D366]/10" },
  "WhatsApp Channel": { color: "text-[#25D366]", ring: "border-[#25D366]/40 hover:border-[#25D366]", bg: "bg-[#25D366]/10" },
  GitHub: { color: "text-foreground", ring: "border-foreground/30 hover:border-foreground", bg: "bg-foreground/10" },
  Email: { color: "text-[#EA4335]", ring: "border-[#EA4335]/40 hover:border-[#EA4335]", bg: "bg-[#EA4335]/10" },
  Telegram: { color: "text-[#229ED9]", ring: "border-[#229ED9]/40 hover:border-[#229ED9]", bg: "bg-[#229ED9]/10" },
  Facebook: { color: "text-[#1877F2]", ring: "border-[#1877F2]/40 hover:border-[#1877F2]", bg: "bg-[#1877F2]/10" },
  X: { color: "text-foreground", ring: "border-foreground/30 hover:border-foreground", bg: "bg-foreground/10" },
  TikTok: { color: "text-[#00F2EA]", ring: "border-[#00F2EA]/40 hover:border-[#00F2EA]", bg: "bg-[#00F2EA]/10" },
  LinkedIn: { color: "text-[#0A66C2]", ring: "border-[#0A66C2]/40 hover:border-[#0A66C2]", bg: "bg-[#0A66C2]/10" },
  Website: { color: "text-primary", ring: "border-primary/40 hover:border-primary", bg: "bg-primary/10" },
};

interface Platform {
  label: string;
  handle?: string;
  url: string;
  description?: string;
  enabled?: boolean;
}

interface SocialsContent {
  title: string;
  subtitle: string;
  platforms: Platform[];
}

const fallback: SocialsContent = {
  title: "Social Platforms",
  subtitle: "All the places you can find CAT CPN — pick your favourite and come say hello.",
  platforms: [
    { label: "YouTube", handle: "@CatPhoenix", url: "https://www.youtube.com/@CatPhoenix", description: "Tutorials, build logs and product demos.", enabled: true },
    { label: "Instagram", handle: "@catphoenix3", url: "https://instagram.com/catphoenix3", description: "Behind the scenes and visual updates.", enabled: true },
    { label: "WhatsApp", handle: "+256 750 713 834", url: "https://wa.me/256750713834", description: "Chat with us directly about a project.", enabled: true },
    { label: "GitHub", handle: "Ph462", url: "https://github.com/Ph462", description: "Open-source code and live repositories.", enabled: true },
    { label: "Email", handle: "catphoenix6@gmail.com", url: "mailto:catphoenix6@gmail.com", description: "Partnerships, quotes and support.", enabled: true },
  ],
};

const Socials = () => {
  usePageTracking("/socials");
  const { data: c } = useSiteContent<SocialsContent>("socials", fallback);

  const platforms = (c.platforms || []).filter((p) => p.enabled !== false && p.url);

  return (
    <PageShell eyebrow="Follow us" title={c.title} subtitle={c.subtitle}>
      <section className="px-4 pb-24">
        <div className="container mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {platforms.map((p, i) => {
            const Icon = iconMap[p.label] || Globe;
            const b = brandMap[p.label] || brandMap.Website;
            return (
              <motion.a
                key={`${p.label}-${i}`}
                href={p.url}
                target={p.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className={`card-surface rounded-2xl border-2 p-6 flex flex-col gap-3 transition-all ${b.ring}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${b.bg} ${b.color}`}>
                  <Icon size={32} strokeWidth={1.8} />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground flex items-center gap-2">
                    {p.label} <ExternalLink size={13} className="text-muted-foreground" />
                  </h2>
                  {p.handle && <p className="text-xs font-mono text-primary mt-0.5">{p.handle}</p>}
                </div>
                {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
              </motion.a>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
};

export default Socials;
