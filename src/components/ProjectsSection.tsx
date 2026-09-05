import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Globe, Server, Smartphone, ExternalLink, MessageCircle, Code2, Clapperboard, Film, Cloud, Sparkles, ListChecks, LucideIcon } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const tabs = [
  { label: "Bots", icon: Bot },
  { label: "Web Tools", icon: Globe },
  { label: "Services", icon: Server },
  { label: "Apps", icon: Smartphone },
];

const toolIcons: Record<string, LucideIcon> = {
  "CPN Bot": Bot,
  "AI Bots": Sparkles,
  "CAT CHAT": MessageCircle,
  "Cat APIs": Code2,
  "Entertainment Surge": Clapperboard,
  "CPN Movies": Film,
  "CPN Media": Cloud,
  "CPN Mobile": Smartphone,
  "Task Tracker": ListChecks,
};

const categoryIcons: Record<string, LucideIcon> = {
  Bots: Bot,
  "Web Tools": Globe,
  Services: Server,
  Apps: Smartphone,
};

interface ProjectItem {
  title: string;
  description: string;
  status: string;
  category: string;
  image: string;
  link: string;
}

interface ProjectsContent {
  title: string;
  subtitle: string;
  items: ProjectItem[];
}

const fallback: ProjectsContent = {
  title: "What We Create",
  subtitle: "Check out everything we have made!",
  items: [
    { title: "CPN Bot", description: "A multi-purpose Discord bot with moderation, music, and fun commands.", status: "Active", category: "Bots", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80", link: "#" },
    { title: "Auto-Mod Bot", description: "Automated moderation bot for Telegram groups with spam detection.", status: "Active", category: "Bots", image: "https://images.unsplash.com/photo-1531746790095-e5e1408e10f8?w=600&q=80", link: "#" },
    { title: "WhatsApp Helper", description: "Customer support automation bot for WhatsApp Business.", status: "Active", category: "Bots", image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&q=80", link: "#" },
    { title: "Portfolio Builder", description: "Generate stunning developer portfolios in minutes.", status: "Active", category: "Web Tools", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80", link: "#" },
    { title: "Link Shortener", description: "Custom branded short URLs with analytics tracking.", status: "Active", category: "Web Tools", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80", link: "#" },
    { title: "SEO Analyzer", description: "Full website SEO audit with actionable improvement tips.", status: "Active", category: "Web Tools", image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=80", link: "#" },
    { title: "Cloud Hosting", description: "Affordable cloud hosting for small to medium projects.", status: "Active", category: "Services", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80", link: "#" },
    { title: "API Gateway", description: "Managed API gateway with rate limiting and monitoring.", status: "Active", category: "Services", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80", link: "#" },
    { title: "CPN Mobile", description: "All-in-one mobile companion app for CPN tools on the go.", status: "Beta", category: "Apps", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80", link: "#" },
    { title: "Task Tracker", description: "Lightweight task management app with team collaboration.", status: "Active", category: "Apps", image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80", link: "#" },
  ],
};

const ProjectsSection = () => {
  const [activeTab, setActiveTab] = useState("Bots");
  const { data: c } = useSiteContent<ProjectsContent>("projects", fallback);

  const currentProjects = c.items.filter((p) => p.category === activeTab);

  return (
    <section id="tools" className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{c.title}</h2>
        <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">{c.subtitle}</p>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button key={tab.label} onClick={() => setActiveTab(tab.label)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all border ${activeTab === tab.label ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-primary hover:border-primary/40"}`}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.length > 0 ? (
            currentProjects.map((project, i) => (
              <motion.a key={project.title} href={project.link} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group card-surface rounded-xl border border-border/50 overflow-hidden hover:border-primary/40 transition-all">
                <div className="aspect-video bg-muted/30 flex items-center justify-center overflow-hidden">
                  <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {(() => { const CIcon = categoryIcons[project.category] || Globe; return <CIcon size={11} />; })()}
                      {project.category}
                    </span>
                    <span className="text-[10px] text-primary animate-pulse-glow">LIVE</span>
                  </div>
                  <h3 className="flex items-center gap-2 font-semibold text-foreground mb-1">
                    {(() => { const TIcon = toolIcons[project.title] || categoryIcons[project.category] || Globe; return (
                      <span className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
                        <TIcon size={14} />
                      </span>
                    ); })()}
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex items-center gap-1 text-primary text-xs">
                    {project.status} <ExternalLink size={10} />
                  </div>
                </div>
              </motion.a>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-16">Coming soon...</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
