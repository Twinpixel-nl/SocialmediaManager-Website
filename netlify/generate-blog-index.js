const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

// Paden
const blogDir = path.join(__dirname, "..", "content", "blog");
const outputDir = path.join(__dirname, "..", "blog");
const indexFile = path.join(__dirname, "..", "blog-index.json");

// Zorg dat output folder bestaat
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(blogDir).filter(file => file.endsWith(".md"));
const index = [];

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const slug = file.replace(".md", "");
  const htmlContent = marked.parse(content);

  // Genereer HTML pagina
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
  </main>
</body>
</html>
`;

  // Schrijf HTML bestand
  const outputHtmlFile = path.join(outputDir, `${slug}.html`);
  fs.writeFileSync(outputHtmlFile, html);

  // Voeg toe aan index
  index.push({
    title: data.title || "",
    date: data.date || "",
    excerpt: data.excerpt || "",
    thumbnail: data.thumbnail || "",
    path: `/blog/${slug}.html`
  });
});

// Genereer JSON index
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
console.log("✅ Blogpagina's en index gegenereerd.");
