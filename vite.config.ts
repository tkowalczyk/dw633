import { defineConfig } from 'vite'
import { renderHome } from './src/render-home.ts'
import { renderWalk } from './src/render-walk.ts'
import { renderTraffic } from './src/render-traffic.ts'
import { siteData } from './src/site-data.ts'

export default defineConfig({
  build: {
    rolldownOptions: { input: ['index.html', '404.html', 'chodnik-stanislawow-pierwszy/index.html', 'ruch-i-wypadki-dw633/index.html'] },
  },
  plugins: [{
    name: 'render-pages',
    transformIndexHtml(html) {
      return html.replace('<div id="app"></div>', () => `<div id="app">${renderHome()}</div>`)
        .replace('<!-- walk-page -->', () => renderWalk())
        .replace('<!-- traffic-page -->', () => renderTraffic())
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
