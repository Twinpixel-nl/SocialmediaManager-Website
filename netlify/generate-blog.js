const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");
const glob = require("glob");

// Mappen
const blogDir = path.join(__dirname, "..", "content", "blog");
const outputDir = path.join(__dirname, "..", "blog");
const indexFile = path.join(__dirname, "..", "blog-index.json");

// Zorg dat outputfolder bestaat
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Zoek alle .md bestanden (ook in subfolders)
const files = glob.sync(path.join(blogDir, "**/*.md"));

const index = [];

files.forEach(file => {
  const rawContent = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(rawContent);

  const slug = path.basename(path.dirname(file)) !== "blog"
    ? path.basename(path.dirname(file))
    : path.basename(file, ".md");

  const htmlContent = marked.parse(content);

  const html = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${data.excerpt || ""}" />
  <title>${data.title || "Blogpost"}</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <main class="blog-post">
    <h1>${data.title || ""}</h1>
    <p class="blog-date">${data.date || ""}</p>
    ${htmlContent}
    <p><a href="/Blog.html" class="btn">← Terug naar blogoverzicht</a></p>
  </main>
</body>
</html>
`;

  // Schrijf HTML bestand
  const outputHtmlFile = path.join(outputDir, `${slug}.html`);
  fs.writeFileSync(outputHtmlFile, html);

  // Voeg toe aan blog-index
  index.push({
    title: data.title || "",
    date: data.date || "",
    excerpt: data.excerpt || "",
    thumbnail: data.thumbnail || "",
    path: `/blog/${slug}.html`
  });
});

// Schrijf blog-index.json
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
console.log("✅ Blogpagina's en index gegenereerd.");
