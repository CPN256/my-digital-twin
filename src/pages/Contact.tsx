import { Mail, Phone, MapPin, Clock } from "lucide-react";
import PageShell from "@/components/PageShell";
import ConnectSection from "@/components/ConnectSection";
import CommentsSection from "@/components/CommentsSection";
import NewsletterSection from "@/components/NewsletterSection";
import { useSiteContent } from "@/hooks/useSiteContent";
import { usePageTracking } from "@/hooks/usePageTracking";

interface ContactContent {
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  location: string;
  hours: string;
}

const fallback: ContactContent = {
  title: "Contact CAT CPN",
  subtitle: "Questions, project ideas or partnership requests — reach us through any channel below.",
  email: "catphoenix6@gmail.com",
  phone: "+256 750 713 834",
  location: "Kampala, Uganda",
  hours: "Mon – Sat, 9:00 – 18:00 EAT",
};

const Contact = () => {
  usePageTracking("/contact");
  const { data: c } = useSiteContent<ContactContent>("contact", fallback);

  const cards = [
    { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` },
    { icon: Phone, label: "Phone", value: c.phone, href: `tel:${c.phone?.replace(/\s/g, "")}` },
    { icon: MapPin, label: "Location", value: c.location },
    { icon: Clock, label: "Hours", value: c.hours },
  ];

  return (
    <PageShell eyebrow="Get in touch" title={c.title} subtitle={c.subtitle}>
      <section className="px-4 py-10">
        <div className="container mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map(({ icon: Icon, label, value, href }) => {
            const inner = (
              <>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-3">
                  <Icon size={16} />
                </div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="text-foreground mt-1 break-words">{value}</p>
              </>
            );
            return href ? (
              <a key={label} href={href} className="card-surface border border-border/50 rounded-2xl p-6 hover:border-primary/40 transition-all">
                {inner}
              </a>
            ) : (
              <div key={label} className="card-surface border border-border/50 rounded-2xl p-6">{inner}</div>
            );
          })}
        </div>
      </section>

      <ConnectSection />
      <CommentsSection />
      <NewsletterSection />
    </PageShell>
  );
};

export default Contact;
