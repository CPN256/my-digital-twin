import { useState } from "react";
import { Menu, X, Home, FolderOpen, User, MessageSquare, Link, Shield, Download, Play, Newspaper, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { label: "Home", icon: Home, href: "/#home" },
  { label: "Video", icon: Play, href: "/#video" },
  { label: "Projects", icon: FolderOpen, href: "/#tools" },
  { label: "Founder", icon: User, href: "/#founder" },
  { label: "Connect", icon: Link, href: "/#connect" },
  { label: "Comments", icon: MessageSquare, href: "/#comments" },
  { label: "Blog", icon: Newspaper, href: "/blog" },
  { label: "Pricing", icon: Tag, href: "/pricing" },
];


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { canInstall, install } = usePWAInstall();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-2xl border-b border-border/30">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-[10px] tracking-tight group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
            CAT
          </div>
          <span className="font-semibold text-foreground text-sm tracking-wide hidden sm:block">
            CAT CPN
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-150 active:scale-[0.97]"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {canInstall && (

            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-foreground text-xs hover:bg-secondary/80 transition-all active:scale-[0.97]"
            >
              <Download size={12} /> Install
            </button>
          )}
          {isAdmin && (
            <a
              href="/admin"
              className="w-8 h-8 rounded-md border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all active:scale-[0.97]"
              title="Admin Panel"
            >
              <Shield size={14} />
            </a>
          )}
          <a
            href={user ? "/admin" : "/login"}
            className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all active:scale-[0.97]"
          >
            {user ? "Dashboard" : "Sign In"}
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground active:scale-95 transition-transform">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-background border-b border-border/30"
          >
            <div className="flex flex-col p-3 gap-0.5">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all active:scale-[0.98]"
                >
                  <item.icon size={15} /> {item.label}
                </a>
              ))}
              {canInstall && (
                <button
                  onClick={() => { install(); setOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-primary hover:bg-secondary/50 transition-all active:scale-[0.98]"
                >
                  <Download size={15} /> Install App
                </button>
              )}
              {isAdmin && (
                <a href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-primary hover:bg-secondary/50 transition-all">
                  <Shield size={15} /> Admin Panel
                </a>
              )}
              <a
                href={user ? "/admin" : "/login"}
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium active:scale-[0.98]"
              >
                {user ? "Dashboard" : "Sign In"}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
