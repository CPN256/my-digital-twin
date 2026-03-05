import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Globe, Server, Smartphone, ExternalLink } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const tabs = [
  { label: "Bots", icon: Bot },
  { label: "Web Tools", icon: Globe },
  { label: "Services", icon: Server },
  { label: "Apps", icon: Smartphone },
];

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
  subtitle: "Check out everything we've made!",
  items: [],
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
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">{project.category}</span>
                    <span className="text-[10px] text-primary animate-pulse-glow">LIVE</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{project.title}</h3>
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
