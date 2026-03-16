import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import founderImg from "@/assets/founder.png";
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
  "image": "https://lh3.googleusercontent.com/p/AF1QipOpYUuYAEeczzNESG4MK8uf-juWw-8My_GrMW6-=s680-w680-h510-rw",
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex justify-center">
            <div className="relative">
              <div className="w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden border border-border/50 border-glow">
                <img src={founderImg} alt={`${c.name} - ${c.role}`} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium tracking-wider uppercase">Core Founder</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{c.name}</h2>
            <p className="text-primary text-sm mb-4">{c.role}</p>
            <p className="text-muted-foreground mb-4">{c.bio}</p>

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={14} className="text-primary" /> {c.location}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Sparkles size={14} className="text-primary" /> {c.tagline}
              </span>
            </div>

            <h3 className="text-lg font-semibold mb-6">What I Can Do For You</h3>
            <div className="space-y-5">
              {c.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
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
