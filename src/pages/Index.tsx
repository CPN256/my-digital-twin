import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import SkillsMarquee from "@/components/SkillsMarquee";
import StatsSection from "@/components/StatsSection";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ConnectSection from "@/components/ConnectSection";
import FounderSection from "@/components/FounderSection";
import CommentsSection from "@/components/CommentsSection";
import ForumCTA from "@/components/ForumCTA";
import FAQSection from "@/components/FAQSection";
import NewsletterSection from "@/components/NewsletterSection";
import FooterSection from "@/components/FooterSection";
import AuroraBackground from "@/components/AuroraBackground";
import ScrollProgress from "@/components/ScrollProgress";
import BentoSection from "@/components/BentoSection";
import { usePageTracking } from "@/hooks/usePageTracking";

const Index = () => {
  usePageTracking('/');

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <VideoSection />
      <SkillsMarquee />
      <BentoSection />
      <StatsSection />
      <ProjectsSection />
      <TestimonialsSection />

      <FAQSection />
      <ForumCTA />
      <CommentsSection />
      <ConnectSection />
      <FounderSection />
      <NewsletterSection />
      <FooterSection />
    </div>
  );
};

export default Index;
