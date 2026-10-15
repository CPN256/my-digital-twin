import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Search, X } from "lucide-react";

/* 1. Glowing cursor trail (desktop only) */
const CursorGlow = () => {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let x = 0, y = 0, rx = 0, ry = 0, raf = 0;
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    const loop = () => {
      rx += (x - rx) * 0.15; ry += (y - ry) * 0.15;
      if (dot.current) dot.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      if (ring.current) ring.current.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    loop();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={dot} className="pointer-events-none fixed top-0 left-0 z-[100] w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))] hidden md:block" />
      <div ref={ring} className="pointer-events-none fixed top-0 left-0 z-[100] w-9 h-9 rounded-full border border-primary/50 hidden md:block" />
    </>
  );
};


/* 3. Back to top */
const BackToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => { const f = () => setShow(window.scrollY > 600); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <AnimatePresence>{show && (
      <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"
        className="fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
        <ArrowUp size={18} />
      </motion.button>)}
    </AnimatePresence>
  );
};

/* 4. Intro splash */
const Preloader = () => {
  const [show, setShow] = useState(() => !sessionStorage.getItem("catcpn_intro"));
  useEffect(() => { if (!show) return; const t = setTimeout(() => { setShow(false); sessionStorage.setItem("catcpn_intro", "1"); }, 1800); return () => clearTimeout(t); }, [show]);
  return (
    <AnimatePresence>{show && (
      <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center gap-4">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl font-bold tracking-tight text-primary drop-shadow-[0_0_25px_hsl(var(--primary))]">CAT CPN</motion.div>
        <div className="w-40 h-1 bg-muted rounded overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5 }} className="h-full bg-primary" /></div>
        <p className="font-mono text-xs text-muted-foreground">booting the studio...</p>
      </motion.div>)}
    </AnimatePresence>
  );
};

/* 5. Command palette (Ctrl/Cmd + K) */
const pages = [["Home", "/"], ["About", "/about"], ["What We Create", "/projects"], ["Blog", "/blog"], ["Forum", "/forum"], ["Pricing", "/pricing"], ["Socials", "/socials"], ["Contact", "/contact"], ["My Profile", "/profile"], ["Sign In", "/login"]];
const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(o => !o); } if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", f); return () => window.removeEventListener("keydown", f);
  }, []);
  const list = pages.filter(([n]) => n.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Search pages" className="fixed bottom-20 right-5 z-50 w-11 h-11 rounded-full border border-primary/40 bg-background/80 backdrop-blur text-primary flex items-center justify-center hover:bg-primary/10">
        <Search size={16} />
      </button>
      <AnimatePresence>{open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[150] bg-background/70 backdrop-blur-sm flex items-start justify-center pt-32 px-4">
          <motion.div initial={{ y: -20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-primary/30 bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 border-b border-border">
              <Search size={16} className="text-muted-foreground" />
              <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Jump to a page..." className="flex-1 bg-transparent py-3 outline-none text-sm" onKeyDown={e => { if (e.key === "Enter" && list[0]) { nav(list[0][1]); setOpen(false); } }} />
              <button onClick={() => setOpen(false)}><X size={16} /></button>
            </div>
            <ul className="max-h-72 overflow-auto p-2">
              {list.map(([n, to]) => (
                <li key={to}><button onClick={() => { nav(to); setOpen(false); setQ(""); }} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-primary/10 hover:text-primary">{n}</button></li>
              ))}
            </ul>
            <p className="text-[10px] font-mono text-muted-foreground px-4 py-2 border-t border-border">Tip: press Ctrl + K anywhere</p>
          </motion.div>
        </motion.div>)}
      </AnimatePresence>
    </>
  );
};

/* 6. Cat mascot that peeks and waves */
const Mascot = () => {
  const [msg, setMsg] = useState<string | null>(null);
  const lines = ["Meow! Welcome to CAT CPN 🐾", "Try Ctrl + K to jump around!", "Check out our bots 🤖", "Join the forum and say hi!"];
  return (
    <div className="fixed bottom-20 left-5 z-50 hidden sm:flex items-end gap-2">
      <motion.button aria-label="CAT CPN mascot" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }}
        onClick={() => { setMsg(lines[Math.floor(Math.random() * lines.length)]); setTimeout(() => setMsg(null), 3000); }}
        className="text-4xl drop-shadow-[0_0_12px_hsl(var(--primary)/0.6)]">🐱</motion.button>
      <AnimatePresence>{msg && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mb-6 rounded-xl border border-primary/30 bg-card px-3 py-2 text-xs">{msg}</motion.div>)}
      </AnimatePresence>
    </div>
  );
};

/* 7. 3D tilt for any element with data-tilt */
const TiltEffect = () => {
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-tilt]");
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach(t => { if (t !== el) t.style.transform = ""; });
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) scale(1.02)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return null;
};

const SiteExtras = () => (
  <>
    <Preloader />
    <CursorGlow />
    <TiltEffect />
    <Mascot />
    <CommandPalette />
    <BackToTop />
  </>
);

export default SiteExtras;
