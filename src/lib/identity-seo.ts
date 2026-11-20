import { AboutContent } from "@/lib/about-content";
import { SITE_URL, breadcrumb } from "@/lib/seo";

export const GITHUB_PROFILE = "https://github.com/Ph462";
export function identityStructuredData(content: AboutContent, image: string) {
  return [
    { "@context": "https://schema.org", "@type": "Person", "@id": `${SITE_URL}/about#person`,
      name: content.name, alternateName: content.publicName, url: `${SITE_URL}/about`, image,
      description: content.seoDescription, jobTitle: content.role,
      homeLocation: { "@type": "Country", name: content.location }, sameAs: [GITHUB_PROFILE],
      founderOf: { "@id": `${SITE_URL}/#organization` } },
    { "@context": "https://schema.org", "@type": "Organization", "@id": `${SITE_URL}/#organization`,
      name: "CAT CPN", url: `${SITE_URL}/`, founder: { "@id": `${SITE_URL}/about#person` } },
    breadcrumb([{ name: "About CAT PHOENIX", path: "/about" }]),
  ];
}