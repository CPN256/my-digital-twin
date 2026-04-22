import { motion } from "framer-motion";

/**
 * Animated aurora gradient background.
 * Fixed, full-viewport, behind all content. Pointer-events disabled.
 */
const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background">
      {/* Subtle noise/grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Aurora blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-30"
        style={{ background: "hsl(var(--primary))" }}
        animate={{ x: [0, 120, -40, 0], y: [0, 80, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full blur-[140px] opacity-20"
        style={{ background: "hsl(190 100% 55%)" }}
        animate={{ x: [0, -100, 60, 0], y: [0, 60, -40, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-[480px] h-[480px] rounded-full blur-[140px] opacity-20"
        style={{ background: "hsl(260 80% 60%)" }}
        animate={{ x: [0, 80, -60, 0], y: [0, -80, 40, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
    </div>
  );
};

export default AuroraBackground;
