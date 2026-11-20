import { describe, expect, it } from "vitest";
import { aboutFallback, aboutSchema, isPublicProjectLink, resolveAboutContent } from "@/lib/about-content";
import { identityStructuredData } from "@/lib/identity-seo";

describe("public identity rules", () => {
  it("identifies Nelson Oundo as CAT PHOENIX in Uganda", () => {
    const person = identityStructuredData(aboutFallback, "https://catcpn.cc.cd/photo.webp")[0];
    expect(person.name).toBe("Nelson Oundo");
    expect(person.alternateName).toBe("CAT PHOENIX");
    expect(person.homeLocation).toEqual({ "@type": "Country", name: "Uganda" });
  });
  it("links the public identity to the existing GitHub profile", () => {
    expect(identityStructuredData(aboutFallback, "https://catcpn.cc.cd/photo.webp")[0].sameAs).toEqual(["https://github.com/Ph462"]);
  });
  it("uses the requested public About address", () => {
    expect(identityStructuredData(aboutFallback, "https://catcpn.cc.cd/photo.webp")[0].url).toBe("https://catcpn.cc.cd/about");
  });
  it("does not expose placeholders or executable destinations as project links", () => {
    expect(isPublicProjectLink("#")).toBe(false);
    expect(isPublicProjectLink("javascript:alert(1)")).toBe(false);
    expect(isPublicProjectLink("https://ph462.github.io/CAT-BOT/")).toBe(true);
  });
  it("accepts complete biography edits and safely resolves legacy content", () => {
    expect(resolveAboutContent({ ...aboutFallback, name: "Edited owner name" }).name).toBe("Edited owner name");
    expect(resolveAboutContent({ title: "Old about page" })).toEqual(aboutFallback);
    expect(aboutSchema.safeParse({ ...aboutFallback, communities: null }).success).toBe(false);
  });
});