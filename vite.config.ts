import { defineConfig } from 'vite'
import { renderHome } from './src/render-home.ts'
import { renderWalk } from './src/render-walk.ts'
import { renderTraffic } from './src/render-traffic.ts'
import { renderDocuments } from './src/render-documents.ts'
import { siteData } from './src/site-data.ts'

const publishedPages = ['/', '/chodnik-stanislawow-pierwszy/', '/ruch-i-wypadki-dw633/', '/dokumenty-dw633/']

export default defineConfig({
  build: {
    rolldownOptions: { input: [...publishedPages.map(path => `${path.slice(1)}index.html`), '404.html'] },
  },
  plugins: [{
    name: 'render-pages',
    generateBundle() {
      this.emitFile({
        type: 'asset', fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publishedPages.map(path => `  <url><loc>https://dw633.pl${path}</loc></url>`).join('\n')}\n</urlset>\n`,
      })
    },
    transformIndexHtml(html) {
      return html.replace('<div id="app"></div>', () => `<div id="app">${renderHome()}</div>`)
        .replace('<!-- walk-page -->', () => renderWalk())
        .replace('<!-- traffic-page -->', () => renderTraffic())
        .replace('<!-- documents-page -->', () => renderDocuments())
        .replaceAll('{{documents-title}}', () => siteData.documents.pageTitle)
        .replaceAll('{{documents-description}}', () => siteData.documents.description)
        .replaceAll('{{traffic-title}}', () => siteData.trafficPage.pageTitle)
        .replaceAll('{{traffic-description}}', () => siteData.trafficPage.description)
        .replaceAll('{{walk-title}}', () => siteData.walk.pageTitle)
        .replaceAll('{{walk-description}}', () => siteData.walk.description)
        .replace('<!-- not-found -->', () => `
          <h1>${siteData.notFound.title}</h1>
          <a class="text-link" href="/">${siteData.notFound.homeLink}</a>
        `)
    },
  }],
})
