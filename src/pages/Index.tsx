import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ConnectSection from "@/components/ConnectSection";
import FounderSection from "@/components/FounderSection";
import { usePageTracking } from "@/hooks/usePageTracking";

const Index = () => {
  usePageTracking('/');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ProjectsSection />
      <TestimonialsSection />
      <ConnectSection />
      <FounderSection />
      <footer className="py-8 text-center text-muted-foreground text-xs border-t border-border/50">
        © 2026 CAT-CPN. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
