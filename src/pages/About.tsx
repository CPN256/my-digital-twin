import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Code2, Heart, Shield, Fingerprint, LockKeyhole, MessageCircle, Compass, Users, Gamepad2, Utensils, Shirt, Sparkles, Github, MapPin, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ScrollProgress from "@/components/ScrollProgress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSeo, SITE_URL } from "@/lib/seo";
import { aboutFallback, resolveAboutContent, isPublicProjectLink } from "@/lib/about-content";
import { GITHUB_PROFILE, identityStructuredData } from "@/lib/identity-seo";
import { useSiteContent } from "@/hooks/useSiteContent";
import { usePageTracking } from "@/hooks/usePageTracking";
import portraitAsset from "@/assets/nelson-oundo.webp.asset.json";
import shareAsset from "@/assets/nelson-oundo-share.jpg.asset.json";

const personalityIcons = [Heart, Shield, Fingerprint, Sparkles, LockKeyhole, MessageCircle];
const interestIcons = [Code2, Users, Compass, Gamepad2, Utensils, Shirt, Sparkles];
const chapters = [["story", "The person"], ["personality", "Personality"], ["interests", "Interests"], ["community", "Community"], ["developer", "The developer"]];
interface Project { title: string; description: string; image: string; link: string; category: string; status: string }

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div initial={false} whileInView={reduced ? undefined : { opacity: [0.65, 1], y: [12, 0] }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.55 }} className={className}>{children}</motion.div>;
}
function SectionHeading({ number, label, title }: { number: string; label: string; title: string }) {
  return <div className="mb-10 max-w-3xl"><p className="font-mono text-xs text-muted-foreground mb-5 uppercase">{number} / {label}</p><h2 className="text-3xl md:text-4xl font-medium leading-tight">{title}</h2></div>;
}

export default function About() {
  const { data } = useSiteContent("about", aboutFallback);
  const c = resolveAboutContent(data);
  const { data: projectContent, loading: projectsLoading } = useSiteContent<{ items?: Project[] }>("projects", { items: [] });
  const projects = (projectContent.items ?? []).filter((p) => isPublicProjectLink(p.link));
  const portrait = c.portrait || portraitAsset.url;
  const image = new URL(c.portrait || shareAsset.url, SITE_URL).href;
  useSeo({ title: c.seoTitle, description: c.seoDescription, path: "/about", image, jsonLd: identityStructuredData(c, new URL(portrait, SITE_URL).href) });
  usePageTracking("/about");

  return <div className="identity-page min-h-screen">
    <ScrollProgress /><Navbar />
    <main>
      <header className="relative overflow-hidden pt-24 pb-12 md:pt-36 md:pb-20">
        <div className="absolute inset-y-0 right-0 hidden md:block w-[57%]">
          <img src={portrait} alt={`${c.name}, known as ${c.publicName}, creator of CAT CPN in Uganda`} fetchPriority="high" className="identity-portrait h-full w-full object-cover object-[center_25%]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 md:px-10">
          <div className="max-w-xl md:min-h-[420px] flex flex-col justify-center">
            <p className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-2 mb-7"><span className="h-1.5 w-1.5 bg-primary rounded-full" /> The person behind CAT CPN</p>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05]">CAT<br />PHOENIX<span className="text-muted-foreground">.</span></h1>
            <p className="text-xl md:text-2xl mt-6">{c.name}</p>
            <p className="text-sm text-muted-foreground mt-3 max-w-xs leading-relaxed">{c.role}</p>
            <p className="flex gap-2 items-center text-sm text-muted-foreground mt-4"><MapPin size={14} /> {c.location}</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button asChild><a href="#story">Meet the person <ArrowDown /></a></Button>
              <Button variant="outline" asChild><a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer"><Github /> GitHub</a></Button>
            </div>
          </div>
          <img src={portrait} alt={`${c.name} — owner-supplied portrait`} className="identity-portrait md:hidden w-full h-[340px] mt-10 object-cover object-[center_20%]" />
          <p className="relative text-sm mt-10 text-muted-foreground max-w-sm">{c.subtitle}</p>
        </div>
      </header>

      <nav aria-label="About page chapters" className="identity-rule border-b border-border">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-wrap gap-x-7 gap-y-3 py-5">
          {chapters.map(([id, label], i) => <a key={id} href={`#${id}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors"><span className="font-mono mr-2 opacity-60">0{i + 1}</span>{label}</a>)}
        </div>
      </nav>

      <section id="story" className="identity-section max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <Reveal className="grid md:grid-cols-[1fr_1.1fr] gap-10 md:gap-16">
          <SectionHeading number="01" label="Who is CAT PHOENIX?" title={c.title} />
          <div className="space-y-5 text-muted-foreground leading-relaxed text-base">
            {c.biography.map((p, i) => <p key={i} className={i === 0 ? "text-foreground text-lg" : ""}>{p}</p>)}
          </div>
        </Reveal>
      </section>

      <section id="personality" className="identity-section identity-rule">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
          <SectionHeading number="02" label="Character" title="The personality behind the name." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.personality.map((trait, i) => { const Icon = personalityIcons[i % personalityIcons.length]; return <Reveal key={i} className="bg-card border border-border rounded-lg p-6 transition-colors hover:border-primary/50"><Icon size={22} strokeWidth={1.3} className="text-primary mb-7" /><h3 className="text-lg font-medium mb-3">{trait.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{trait.description}</p></Reveal>; })}
          </div>
        </div>
      </section>

      <section className="identity-rule bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
          <SectionHeading number="03" label="The human side" title={c.humanTitle} />
          <Reveal className="grid md:grid-cols-2 gap-12 md:gap-20">
            <blockquote className="text-2xl md:text-3xl leading-relaxed font-medium"><Quote size={28} strokeWidth={1} className="mb-6 text-muted-foreground" />“{c.humanQuote}”</blockquote>
            <div className="space-y-4">{c.humanPoints.map((p, i) => <p key={i} className="border-b border-border pb-4 text-muted-foreground leading-relaxed">{p}</p>)}</div>
          </Reveal>
        </div>
      </section>

      <section id="interests" className="identity-section identity-rule max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <SectionHeading number="04" label="Beyond work" title="The things that make life mine." />
        {c.interests.length > 0 && <Tabs defaultValue="0">
          <TabsList aria-label="Personal interests" className="h-auto flex flex-wrap justify-start gap-2 bg-transparent p-0">
            {c.interests.map((interest, i) => { const Icon = interestIcons[i % interestIcons.length]; return <TabsTrigger key={i} value={String(i)} className="gap-2 border border-border px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Icon size={16} />{interest.title}</TabsTrigger>; })}
          </TabsList>
          {c.interests.map((interest, i) => { const Icon = interestIcons[i % interestIcons.length]; return <TabsContent key={i} value={String(i)} className="mt-10 min-h-[180px] border-l-2 border-primary pl-6 md:pl-10"><Icon size={32} strokeWidth={1} className="text-muted-foreground mb-5" /><h3 className="text-2xl mb-3">{interest.title}</h3><p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{interest.description}</p></TabsContent>; })}
        </Tabs>}
      </section>

      <section id="community" className="identity-section identity-rule">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
          <SectionHeading number="05" label="Friendship & community" title={c.communityTitle} />
          <p className="text-muted-foreground max-w-2xl leading-relaxed mb-10">{c.communityIntro}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
            {c.communities.map((name, i) => <div key={i} className="flex items-center gap-4 py-5 border-b border-border"><span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span><span className="text-sm">{name}</span></div>)}
          </div>
          <Button variant="link" asChild className="px-0 mt-7"><Link to="/forum">Connect with the CAT CPN community <ArrowUpRight /></Link></Button>
        </div>
      </section>

      <section className="identity-rule bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
          <SectionHeading number="06" label="Personal growth" title={c.growthTitle} />
          <Reveal className="grid md:grid-cols-2 gap-12 md:gap-20">
            <div><p className="text-muted-foreground mb-6 leading-relaxed">{c.growthIntro}</p><ul className="space-y-4">{c.growthPoints.map((point, i) => <li key={i} className="flex gap-3 items-start text-sm"><span className="text-muted-foreground font-mono">↗</span>{point}</li>)}</ul></div>
            <blockquote className="text-2xl md:text-3xl leading-relaxed">“{c.growthQuote}”<footer className="font-mono text-xs text-muted-foreground mt-6">— {c.publicName}</footer></blockquote>
          </Reveal>
        </div>
      </section>

      <section id="developer" className="identity-section identity-rule">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
          <SectionHeading number="07" label="The developer" title={c.developerTitle} />
          <div className="grid md:grid-cols-2 gap-8 mb-10"><p className="text-muted-foreground leading-relaxed">{c.developerIntro}</p><ul className="grid grid-cols-2 gap-4 text-sm">{c.disciplines.map((d, i) => <li key={i} className="flex gap-2 items-start"><Code2 size={14} className="shrink-0 mt-1 text-muted-foreground" />{d}</li>)}</ul></div>
          {projectsLoading ? <p role="status" className="text-muted-foreground py-10">Loading projects…</p> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => <a key={project.title} href={project.link} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden border border-border rounded-lg bg-card transition-colors hover:border-primary/60">
              <img src={project.image} alt={`${project.title} — CAT CPN project artwork`} loading="lazy" width={640} height={360} className="aspect-video w-full object-cover" />
              <div className="p-5"><p className="font-mono text-xs text-muted-foreground mb-3">{project.category} / {project.status}</p><h3 className="text-lg flex items-center justify-between gap-3 mb-3">{project.title}<ArrowUpRight size={17} className="shrink-0 transition-transform motion-safe:group-hover:translate-x-1" /></h3><p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p></div>
            </a>)}
          </div>}
          <div className="flex flex-wrap gap-3 mt-8"><Button asChild><Link to="/projects">All CAT CPN projects <ArrowUpRight /></Link></Button><Button variant="outline" asChild><a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer"><Github /> GitHub</a></Button><Button variant="link" asChild><a href={SITE_URL}>catcpn.cc.cd <ArrowUpRight /></a></Button></div>
        </div>
      </section>

      <section className="identity-rule">
        <Reveal className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <SectionHeading number="08" label="An open letter" title={c.messageTitle} />
          <blockquote className="max-w-4xl space-y-7 text-xl md:text-3xl leading-relaxed">{c.message.map((p, i) => <p key={i} className={i === 0 ? "text-muted-foreground" : "text-foreground"}>{p}</p>)}</blockquote>
          <div className="flex flex-wrap justify-between gap-6 mt-12 pt-8 border-t border-border"><div><p className="text-xl font-medium">{c.name}</p><p className="text-xs font-mono text-muted-foreground mt-2">{c.publicName} / {c.location}</p></div><Button variant="outline" asChild><Link to="/contact">Get in touch <ArrowUpRight /></Link></Button></div>
        </Reveal>
      </section>
    </main>
    <FooterSection />
  </div>;
}