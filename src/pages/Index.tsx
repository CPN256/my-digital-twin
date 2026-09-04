import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, User, FolderOpen, Newspaper, Tag, MessagesSquare, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import SkillsMarquee from "@/components/SkillsMarquee";
import StatsSection from "@/components/StatsSection";
import NewsletterSection from "@/components/NewsletterSection";
import FooterSection from "@/components/FooterSection";
import AuroraBackground from "@/components/AuroraBackground";
import ScrollProgress from "@/components/ScrollProgress";
import BentoSection from "@/components/BentoSection";
import { usePageTracking } from "@/hooks/usePageTracking";

const pages = [
  { to: "/about", icon: User, title: "About", desc: "Who we are, our story, values and the founder behind CAT CPN." },
  { to: "/projects", icon: FolderOpen, title: "What We Create", desc: "Bots, web tools, cloud services and mobile apps we ship." },
  { to: "/blog", icon: Newspaper, title: "Blog", desc: "Build logs, tutorials and engineering notes from the studio." },
  { to: "/forum", icon: MessagesSquare, title: "Forum", desc: "Ask questions and talk with the CAT CPN community." },
  { to: "/pricing", icon: Tag, title: "Pricing", desc: "Simple plans for individuals, teams and businesses." },
  { to: "/contact", icon: Mail, title: "Contact", desc: "Reach the team, follow our channels and leave a comment." },
];

const Index = () => {
  usePageTracking("/");

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <VideoSection />
      <SkillsMarquee />
      <BentoSection />
      <StatsSection />

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs text-primary tracking-[0.2em] uppercase font-mono">Explore</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3">Everything CAT CPN</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Each part of the studio now has its own page.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pages.map((p, i) => (
              <motion.div
                key={p.to}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={p.to} className="group card-surface border border-border/50 rounded-2xl p-6 block h-full hover:border-primary/40 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4">
                    <p.icon size={16} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    {p.title}
                    <ArrowRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
      <FooterSection />
    </div>
  );
};

export default Index;
