import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

interface FounderContent {
  name: string;
  role: string;
  bio: string;
  location: string;
  tagline: string;
  skills: { name: string; percent: number }[];
}

const fallback: FounderContent = {
  name: "Oundo Nelson",
  role: "Founder & Lead Developer",
  bio: "Passionate about creating innovative digital solutions that make a difference. With over 4 years of experience in full-stack development, I build tools that empower communities and simplify workflows across Africa and beyond.",
  location: "Uganda, East Africa",
  tagline: "Creator & Problem Solver",
  skills: [
    { name: "Full-Stack Development", percent: 92 },
    { name: "Bot Development", percent: 88 },
    { name: "UI/UX Design", percent: 85 },
    { name: "Cloud Infrastructure", percent: 78 },
    { name: "Mobile Development", percent: 75 },
  ],
};

const FounderSection = () => {
  const { data: c } = useSiteContent<FounderContent>("founder", fallback);

  return (
    <section id="founder" className="py-24 px-4 section-gradient">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <span className="text-xs text-primary tracking-[0.2em] uppercase font-mono">Leadership</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">Meet The Founder</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/30 shadow-[0_0_40px_hsl(168_100%_47%/0.15)]">
                <img
                  src="https://lh3.googleusercontent.com/p/AF1QipMIKVFTe6U5MmG016lFmSidB1tRi7-Cfx7UOvGL=s680-w680-h510-rw"
                  alt={`${c.name} - ${c.role}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-medium tracking-wider uppercase whitespace-nowrap">
                Core Founder
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">{c.name}</h3>
            <p className="text-primary text-sm font-mono mb-4">{c.role}</p>
            <p className="text-muted-foreground mb-6 leading-relaxed">{c.bio}</p>

            <div className="flex flex-wrap gap-4 mb-8">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={14} className="text-primary" /> {c.location}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Sparkles size={14} className="text-primary" /> {c.tagline}
              </span>
            </div>

            <h4 className="text-lg font-semibold mb-6">What I Can Do For You</h4>
            <div className="space-y-4">
              {c.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-foreground">{skill.name}</span>
                    <span className="text-sm text-primary font-mono">{skill.percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.percent}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }} className="h-full rounded-full bg-primary" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
