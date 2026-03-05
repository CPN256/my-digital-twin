import { useState } from "react";
import { Menu, X, Home, FolderOpen, User, MessageSquare, Link, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Home", icon: Home, href: "#home" },
  { label: "Projects", icon: FolderOpen, href: "#tools" },
  { label: "Founder", icon: User, href: "#founder" },
  { label: "Connect", icon: Link, href: "#connect" },
  { label: "Feedback", icon: MessageSquare, href: "#feedback" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#home" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">CAT</div>
          <div>
            <div className="font-semibold text-foreground text-sm tracking-wide">CAT CPN</div>
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Digital Innovation</div>
          </div>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-muted-foreground hover:text-primary hover:bg-secondary transition-all">
              <item.icon size={14} /> {item.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {isAdmin && (
            <a href="/admin" className="w-9 h-9 rounded-full border border-primary/40 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all" title="Admin Panel">
              <Shield size={16} />
            </a>
          )}
          <a href={user ? "/admin" : "/login"} className="px-5 py-2 rounded-full border border-primary/40 text-primary text-sm hover:bg-primary hover:text-primary-foreground transition-all">
            {user ? "Dashboard" : "Sign In"}
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-card border-b border-border">
            <div className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-all">
                  <item.icon size={16} /> {item.label}
                </a>
              ))}
              {isAdmin && (
                <a href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary hover:bg-secondary transition-all">
                  <Shield size={16} /> Admin Panel
                </a>
              )}
              <a href={user ? "/admin" : "/login"} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary hover:bg-secondary transition-all font-medium">
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
