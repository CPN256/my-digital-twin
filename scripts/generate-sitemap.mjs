// Generates public/sitemap.xml from the public routes plus published blog posts.
import fs from "node:fs";
const SITE = "https://catcpn.cc.cd";
const routes = ["/", "/about", "/projects", "/blog", "/pricing", "/forum", "/contact", "/socials"];

const env = {};
try {
  for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m) env[m[1]] = m[2];
  }
} catch {}
const url = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

let posts = [];
if (url && key) {
  try {
    const r = await fetch(`${url}/rest/v1/blog_posts?select=slug,updated_at&published=eq.true`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (r.ok) posts = await r.json();
  } catch (e) { console.warn("sitemap: could not fetch blog posts", e.message); }
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const entries = [
  ...routes.map((p) => `  <url>\n    <loc>${SITE}${p}</loc>\n  </url>`),
  ...posts.filter((p) => p.slug).map((p) =>
    `  <url>\n    <loc>${SITE}/blog/${esc(encodeURIComponent(p.slug))}</loc>${p.updated_at ? `\n    <lastmod>${p.updated_at.slice(0, 10)}</lastmod>` : ""}\n  </url>`),
];
fs.writeFileSync("public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`);
console.log(`sitemap: ${entries.length} URLs`);
