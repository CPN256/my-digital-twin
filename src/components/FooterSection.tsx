import { Mail, Phone, MapPin, ExternalLink, Github, Youtube, Instagram, MessageCircle } from "lucide-react";

const contactLinks = [
  { icon: Mail, label: "catphoenix6@gmail.com", href: "mailto:catphoenix6@gmail.com" },
  { icon: Phone, label: "+256 750 713 834", href: "tel:+256750713834" },
  { icon: MapPin, label: "Kampala, Uganda", href: "https://maps.google.com/?q=Kampala,Uganda" },
];

const socialLinks = [
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@CatPhoenix", color: "hover:text-red-500" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/catphoenix3", color: "hover:text-pink-500" },
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/256750713834", color: "hover:text-green-500" },
  { icon: Github, label: "GitHub", href: "https://github.com/Ph462", color: "hover:text-foreground" },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "What We Create", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const FooterSection = () => {
  return (
    <footer className="pt-20 pb-0 px-4 border-t border-border/50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">CAT</div>
              <div>
                <div className="font-bold text-foreground tracking-wide">CAT CPN</div>
                <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Digital Innovation</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Building innovative digital solutions that empower communities across Africa and beyond.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <ExternalLink size={12} /> {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wider uppercase">Contact</h4>
            <ul className="space-y-3">
              {contactLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2.5">
                    <item.icon size={14} className="text-primary/70" /> {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className={`w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground ${s.color} hover:border-primary/40 transition-all`}
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/30 pt-6 pb-8 text-center">
          <p className="text-xs text-muted-foreground">© 2026 CAT CPN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
