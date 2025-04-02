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
    <meta name="description" content="${data.excerpt || ""}">
    <title>${data.title} - Social Media Manager</title>
    <link href="https://fonts.googleapis.com/css2?family=Anonymous+Pro&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon_io/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon_io/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon_io/favicon-16x16.png">
    <link rel="manifest" href="/images/favicon_io/site.webmanifest">
    <link rel="shortcut icon" href="/images/favicon_io/favicon.ico" type="image/x-icon">
    <meta name="theme-color" content="#0f172a">
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
  
    <header>
      <nav class="navbar">
        <div class="logo">
          <a href="/Index.html"><img src="/Images/Logo_los_transparant.png" alt="Social Media Manager logo" class="nav-logo"/></a>
        </div>
        <ul class="nav-links">
          <li><a href="/Index.html">Home</a></li>
          <li><a href="/About.html">Over ons</a></li>
          <li><a href="/Diensten.html">Diensten</a></li>
          <li><a href="/Portfolio.html">Portfolio</a></li>
          <li><a href="/Blog.html">Blog</a></li>
        </ul>
        <a href="/Contact.html" class="btn contact-btn">Contact</a>
      </nav>
    </header>
  
    <main class="blog-post-detail container">
      <h1 class="page-title">${data.title}</h1>
      <p class="blog-date">${new Date(data.date).toLocaleDateString("nl-NL", {
        year: "numeric", month: "long", day: "numeric"
      })}</p>
      <div class="blog-body">
        ${htmlContent}
      </div>
      <a href="/Blog.html" class="btn purple-btn mt-6">← Terug naar blogoverzicht</a>
    </main>
  
    <footer>
      <div class="footer-container">
        <div class="footer-logo">
          <img src="/Images/Logo_volledig_wit.png" alt="Social Media Manager logo" />
        </div>
        <div class="footer-links">
          <h3>Navigatie</h3>
          <ul>
            <li><a href="/Index.html">Home</a></li>
            <li><a href="/About.html">Over ons</a></li>
            <li><a href="/Diensten.html">Diensten</a></li>
            <li><a href="/Portfolio.html">Portfolio</a></li>
            <li><a href="/Blog.html">Blog</a></li>
            <li><a href="/Contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h3>Contact</h3>
          <p><a href="tel:+31629812928"><i class="fas fa-phone"></i> +31 629 812 928</a></p>
          <p><a href="https://maps.app.goo.gl/9tiDGBhQmoLtqPJu5" target="_blank"><i class="fas fa-map-marker-alt"></i> Dorpsplein 1, 6733 AV Wekerom</a></p>
        </div>
        <div class="footer-social">
          <h3>Volg ons</h3>
          <div class="social-icons">
            <a href="https://www.instagram.com/rocket.network.agency/" target="_blank"><i class="ab fab fa-instagram fa-sm"></i></a>
            <a href="https://www.linkedin.com/in/julian-van-beek-35276b241/" target="_blank"><i class="ab fab fa-linkedin-in fa-sm"></i></a>
            <a href="https://wa.me/31629812928?text=Hallo%20ik%20heb%20interesse%20in%20jullie%20social%20media%20dienst" target="_blank"><i class="ab fab fa-whatsapp fa-sm"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 socialmediamanager.nl | <a href="https://twinpixel.nl/">Made with ❤️ by TwinPixel</a></p>
      </div>
    </footer>
  
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
