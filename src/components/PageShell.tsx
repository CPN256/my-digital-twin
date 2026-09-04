import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import AuroraBackground from "@/components/AuroraBackground";
import ScrollProgress from "@/components/ScrollProgress";

interface PageShellProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const PageShell = ({ eyebrow, title, subtitle, children }: PageShellProps) => (
  <div className="relative min-h-screen">
    <AuroraBackground />
    <ScrollProgress />
    <Navbar />
    <header className="pt-28 pb-10 px-4">
      <div className="container mx-auto max-w-5xl text-center">
        {eyebrow && (
          <span className="text-xs text-primary tracking-[0.2em] uppercase font-mono">{eyebrow}</span>
        )}
        <h1 className="text-3xl md:text-5xl font-bold mt-3">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>
    </header>
    <main>{children}</main>
    <FooterSection />
  </div>
);

export default PageShell;
