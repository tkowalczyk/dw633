import { defineConfig } from 'vite'
import { renderHome } from './src/render-home.ts'
import { renderWalk } from './src/render-walk.ts'
import { siteData } from './src/site-data.ts'

export default defineConfig({
  build: {
    rolldownOptions: { input: ['index.html', '404.html', 'chodnik-stanislawow-pierwszy/index.html'] },
  },
  plugins: [{
    name: 'render-pages',
    transformIndexHtml(html) {
      return html.replace('<div id="app"></div>', () => `<div id="app">${renderHome()}</div>`)
        .replace('<!-- walk-page -->', () => renderWalk())
        .replaceAll('{{walk-title}}', () => siteData.walk.pageTitle)
        .replaceAll('{{walk-description}}', () => siteData.walk.description)
        .replace('<!-- not-found -->', () => `
          <h1>${siteData.notFound.title}</h1>
          <a class="text-link" href="/">${siteData.notFound.homeLink}</a>
        `)
    },
  }],
})
