const fs = require("fs");
const path = require("path");

const baseUrl = "https://socialmediamanager.netlify.app"; // Vervang later door je definitieve domein

const rootDir = path.join(__dirname, "..");
const blogDir = path.join(rootDir, "blog");
const sitemapPath = path.join(rootDir, "sitemap.xml");

// Haal alle .html bestanden uit root (bv: index.html, about.html, contact.html)
const rootPages = fs
  .readdirSync(rootDir)
  .filter(file => file.endsWith(".html") && file !== "sitemap.xml");

// Haal alle .html bestanden uit de blog map (bv: blog/post.html)
const blogPages = fs
  .existsSync(blogDir)
  ? fs.readdirSync(blogDir).filter(file => file.endsWith(".html"))
  : [];

// Maak een lijst van sitemap URL entries
const urls = [];

// Voeg homepage toe met hoge prioriteit
urls.push(`
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

// Voeg alle root .html bestanden toe behalve index.html
rootPages.forEach(file => {
  if (file === "index.html") return;
  const slug = file.replace(".html", "");
  urls.push(`
  <url>
    <loc>${baseUrl}/${slug}.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
});

// Voeg blog pagina’s toe
blogPages.forEach(file => {
  const slug = file.replace(".html", "");
  urls.push(`
  <url>
    <loc>${baseUrl}/blog/${slug}.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
});

// Combineer alles in sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

// Schrijf sitemap naar bestand
fs.writeFileSync(sitemapPath, sitemap.trim(), "utf-8");
console.log("✅ Sitemap gegenereerd: sitemap.xml");
