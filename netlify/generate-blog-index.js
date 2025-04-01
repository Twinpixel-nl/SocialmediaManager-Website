const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const blogDir = path.join(__dirname, "..", "content", "blog");
const outputFile = path.join(__dirname, "..", "blog-index.json");

const files = fs.readdirSync(blogDir).filter(file => file.endsWith(".md"));
const index = [];

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(rawContent);

  index.push({
    title: data.title || "",
    date: data.date || "",
    excerpt: data.excerpt || "",
    thumbnail: data.thumbnail || "",
    path: `content/blog/${file}`
  });
});

fs.writeFileSync(outputFile, JSON.stringify(index, null, 2));
console.log("✅ blog-index.json gegenereerd.");
