// Static prerender (SSG) for every route → real HTML for Google, Bing and AI crawlers
// (GPTBot, PerplexityBot, ClaudeBot, Google-Extended) that don't execute JavaScript.
// Also writes sitemap.xml and robots.txt.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'dist/client')
const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
const { render, ROUTES_LIST, SITE } = await import(pathToFileURL(path.join(root, 'dist/server/entry-server.js')).href)

for (const url of [...ROUTES_LIST, '/404']) {
  const { html, head } = render(url)
  const page = template
    .replace(/<title>.*?<\/title>/s, '')
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html)
  const file = url === '/' ? 'index.html' : url === '/404' ? '404.html' : `${url.replace(/^\//, '')}/index.html`
  fs.mkdirSync(path.dirname(path.join(outDir, file)), { recursive: true })
  fs.writeFileSync(path.join(outDir, file), page)
  console.log('  prerendered', url)
}

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES_LIST.map((u) => `  <url><loc>${SITE.url}${u}</loc><lastmod>${today}</lastmod><priority>${u === '/' ? '1.0' : u.split('/').length > 2 ? '0.7' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap)

const robots = `# Search + AI answer engines are welcome
User-agent: *
Allow: /
Disallow: /quote?*

User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`
fs.writeFileSync(path.join(outDir, 'robots.txt'), robots)
console.log('  sitemap.xml + robots.txt written')
