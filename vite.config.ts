import { defineConfig } from 'vite'
import { renderHome } from './src/render-home.ts'
import { siteData } from './src/site-data.ts'

export default defineConfig({
  build: {
    rolldownOptions: { input: ['index.html', '404.html'] },
  },
  plugins: [{
    name: 'render-pages',
    transformIndexHtml(html) {
      return html.replace('<div id="app"></div>', () => `<div id="app">${renderHome()}</div>`)
        .replace('<!-- not-found -->', () => `
          <h1>${siteData.notFound.title}</h1>
          <a class="text-link" href="/">${siteData.notFound.homeLink}</a>
        `)
    },
  }],
})
