const fs = require("fs");
const path = require("path");

const baseUrl = "https://socialmediamanager.nl"; 

const rootDir = path.resolve(__dirname, "..");
const blogDir = path.join(rootDir, "blog");
const sitemapPath = path.join(rootDir, "sitemap.xml");

function getHtmlFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Map niet gevonden: ${dir}`);
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter(file => file.endsWith(".html") && file !== "sitemap.xml");
}

try {
  const rootPages = getHtmlFiles(rootDir);
  const blogPages = getHtmlFiles(blogDir);

  const urls = [];

  // Homepage
  urls.push(`
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

  // Root pagina's
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

  // Blog pagina's
  blogPages.forEach(file => {
    const slug = file.replace(".html", "");
    urls.push(`
  <url>
    <loc>${baseUrl}/blog/${slug}.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });

  // Combineer
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  fs.writeFileSync(sitemapPath, sitemap.trim(), "utf-8");
  console.log(`✅ Sitemap gegenereerd met ${urls.length} pagina's: sitemap.xml`);
} catch (err) {
  console.error("❌ Fout bij genereren sitemap:", err);
}
