import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";

const skills = [
  { name: "Web Development", percent: 99 },
  { name: "Bot Development", percent: 92 },
  { name: "UI/UX Design", percent: 88 },
];

const FounderSection = () => {
  return (
    <section id="founder" className="py-24 px-4 section-gradient">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden border border-border/50 border-glow">
                <img
                  src="https://pikaso.cdnpk.net/private/production/2877050063/upload.png?token=exp=1770854400~hmac=45bbc65509ae60981a93ca0062570584741dfc60b51678494e235a084fdafc6e&preview=1&w=340"
                  alt="Oundo Nelson - Founder & Developer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium tracking-wider uppercase">
                Core Founder
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Oundo Nelson</h2>
            <p className="text-primary text-sm mb-4">Founder & Developer</p>
            <p className="text-muted-foreground mb-4">
              Passionate about creating innovative digital solutions that make a difference.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={14} className="text-primary" /> Uganda, East Africa
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Sparkles size={14} className="text-primary" /> Creator & Problem Solver
              </span>
            </div>

            <h3 className="text-lg font-semibold mb-6">What I Can Do For You</h3>

            <div className="space-y-5">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-foreground">{skill.name}</span>
                    <span className="text-sm text-primary font-mono">{skill.percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-primary"
                    />
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
