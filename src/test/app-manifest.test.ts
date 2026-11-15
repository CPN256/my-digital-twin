// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const manifest = JSON.parse(readFileSync("public/manifest.webmanifest", "utf8"));

describe("CAT CPN installation", () => {
  it("opens as a standalone app at the existing homepage", () => {
    expect(manifest.short_name).toBe("CAT CPN");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/");
    expect(manifest.scope).toBe("/");
  });

  it("provides real PNG icons in each declared size", () => {
    for (const icon of manifest.icons) {
      const bytes = readFileSync(`public${icon.src}`);
      expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      const [width, height] = icon.sizes.split("x").map(Number);
      expect(bytes.readUInt32BE(16)).toBe(width);
      expect(bytes.readUInt32BE(20)).toBe(height);
    }
  });
});