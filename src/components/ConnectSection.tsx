import { motion } from "framer-motion";
import { MessageCircle, Youtube, Instagram, Phone } from "lucide-react";

const socials = [
  { label: "YouTube", icon: Youtube, href: "https://www.youtube.com/@CatPhoenix", color: "hover:text-red-400" },
  { label: "Instagram", icon: Instagram, href: "https://www.instagram.com/catphoenix3", color: "hover:text-pink-400" },
  { label: "WhatsApp", icon: Phone, href: "https://wa.me/256750713834", color: "hover:text-green-400" },
];

const ConnectSection = () => {
  return (
    <section id="connect" className="py-24 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect With Us</h2>
        <p className="text-muted-foreground mb-10">Follow us on social media for updates, tutorials, and new releases</p>

        <motion.a
          href="https://whatsapp.com/channel/0029Vb7ARUq1iUxhqTjpPz0n"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium mb-12 transition-all"
        >
          <MessageCircle size={20} />
          Join WhatsApp Channel
        </motion.a>

        <div className="flex justify-center gap-6">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-14 h-14 rounded-full border border-border flex items-center justify-center text-muted-foreground ${s.color} hover:border-primary/40 transition-all`}
            >
              <s.icon size={22} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
