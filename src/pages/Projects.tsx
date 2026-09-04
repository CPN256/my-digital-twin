import PageShell from "@/components/PageShell";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import { useSiteContent } from "@/hooks/useSiteContent";
import { usePageTracking } from "@/hooks/usePageTracking";

interface PageIntro { title: string; subtitle: string }

const fallback: PageIntro = {
  title: "What We Create",
  subtitle: "Bots, web tools, cloud services and mobile apps — everything CAT CPN builds, in one place.",
};

const Projects = () => {
  usePageTracking("/projects");
  const { data: c } = useSiteContent<PageIntro>("projects_page", fallback);

  return (
    <PageShell eyebrow="Our work" title={c.title} subtitle={c.subtitle}>
      <ProjectsSection />
      <TestimonialsSection />
      <FAQSection />
    </PageShell>
  );
};

export default Projects;
