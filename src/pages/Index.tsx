import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ConnectSection from "@/components/ConnectSection";
import FounderSection from "@/components/FounderSection";
import CommentsSection from "@/components/CommentsSection";
import FooterSection from "@/components/FooterSection";
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
      <CommentsSection />
      <ConnectSection />
      <FounderSection />
      <FooterSection />
    </div>
  );
};

export default Index;
