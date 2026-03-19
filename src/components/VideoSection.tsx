import { motion } from "framer-motion";
import { Play } from "lucide-react";

const VideoSection = () => {
  return (
    <section id="video" className="py-16 px-4 section-gradient">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-xs text-primary tracking-[0.2em] uppercase font-mono">
            Featured
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-3 flex items-center justify-center gap-2">
            <Play size={22} className="text-primary" /> Watch Our Story
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-border/50 shadow-[0_0_60px_hsl(168_100%_47%/0.08)] aspect-video"
        >
          <iframe
            src="https://www.youtube.com/embed/LEeAfQha9TQ?autoplay=1&mute=1&loop=1&playlist=LEeAfQha9TQ&rel=0"
            title="CAT CPN Featured Video"
            className="w-full h-full absolute inset-0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
