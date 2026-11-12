import { useEffect } from "react";

export const SITE_URL = "https://catcpn.cc.cd";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/pwa-512x512.png`;

export interface SeoOptions {
  title: string;
  description: string;
  path: string; // e.g. "/about"
  noindex?: boolean;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export const canonicalFor = (path: string) =>
  path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path.replace(/\/+$/, "")}`;

export const breadcrumb = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: canonicalFor(it.path),
  })),
});

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

export function useSeo(o: SeoOptions) {
  const ld = JSON.stringify(o.jsonLd ?? null);
  useEffect(() => {
    const url = canonicalFor(o.path);
    const image = o.image || DEFAULT_OG_IMAGE;
    document.title = o.title;
    setMeta("name", "description", o.description);
    setMeta("name", "robots", o.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    setMeta("property", "og:title", o.title);
    setMeta("property", "og:description", o.description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", o.type ?? "website");
    setMeta("property", "og:image", image);
    setMeta("property", "og:site_name", "CAT CPN");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", o.title);
    setMeta("name", "twitter:description", o.description);
    setMeta("name", "twitter:image", image);

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (o.noindex) {
      link?.remove();
    } else {
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = url;
    }

    document.getElementById("page-jsonld")?.remove();
    const data = JSON.parse(ld);
    if (data) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = "page-jsonld";
      s.text = JSON.stringify(data);
      document.head.appendChild(s);
    }
  }, [o.title, o.description, o.path, o.noindex, o.image, o.type, ld]);
}
