import PageShell from "@/components/PageShell";
import ConnectSection from "@/components/ConnectSection";
import { usePageTracking } from "@/hooks/usePageTracking";

const Socials = () => {
  usePageTracking("/socials");

  return (
    <PageShell
      eyebrow="Follow us"
      title="Social Platforms"
      subtitle="All the places you can find CAT CPN — pick your favourite and come say hello."
    >
      <ConnectSection />
    </PageShell>
  );
};

export default Socials;
