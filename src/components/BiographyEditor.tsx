import { AboutContent } from "@/lib/about-content";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";

const labels: Record<keyof AboutContent, string> = {
  name: "Full name", publicName: "Public name", role: "Profession", location: "Country",
  title: "Biography heading", subtitle: "Introduction", portrait: "Profile photograph",
  biography: "Biography", personality: "Personality", humanTitle: "Human side heading",
  humanPoints: "The human side", humanQuote: "Human side quotation", interests: "Interests",
  communityTitle: "Community heading", communityIntro: "Community introduction", communities: "Personal communities and memories",
  growthTitle: "Personal growth heading", growthIntro: "Personal growth introduction", growthPoints: "Personal growth", growthQuote: "Growth quotation",
  developerTitle: "Developer heading", developerIntro: "Developer introduction", disciplines: "Development interests",
  messageTitle: "Closing heading", message: "Message to the world", seoTitle: "Search title", seoDescription: "Search description",
};

export default function BiographyEditor({ value, onChange }: { value: AboutContent; onChange: (content: AboutContent) => void }) {
  return <div className="space-y-6">
    <ImageUpload currentUrl={value.portrait || undefined} folder="founder" label="Profile photograph" onUpload={(url) => onChange({ ...value, portrait: url })} />
    {Object.entries(value).filter(([key]) => key !== "portrait").map(([key, field]) => {
      const label = labels[key as keyof AboutContent];
      const update = (next: unknown) => onChange({ ...value, [key]: next });
      return <fieldset key={key} className="space-y-2 border-t border-border pt-4">
        <legend className="text-sm font-medium px-1">{label}</legend>
        {typeof field === "string" ? <Textarea aria-label={label} value={field} onChange={(e) => update(e.target.value)} rows={field.length > 140 ? 3 : 2} /> :
          field.map((entry, index) => typeof entry === "string" ?
            <Textarea key={index} aria-label={`${label} ${index + 1}`} value={entry} onChange={(e) => update(field.map((old, i) => i === index ? e.target.value : old))} rows={entry.length > 140 ? 3 : 2} /> :
            <div key={index} className="grid gap-2 sm:grid-cols-[180px_1fr]">
              <Input aria-label={`${label} ${index + 1} title`} value={entry.title} onChange={(e) => update(field.map((old, i) => i === index ? { ...entry, title: e.target.value } : old))} />
              <Textarea aria-label={`${label} ${index + 1} description`} value={entry.description} onChange={(e) => update(field.map((old, i) => i === index ? { ...entry, description: e.target.value } : old))} rows={3} />
            </div>)}
      </fieldset>;
    })}
  </div>;
}