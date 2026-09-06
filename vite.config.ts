import { defineConfig } from 'vite'
import { renderHome } from './src/render-home.ts'

export default defineConfig({
  plugins: [{
    name: 'render-home',
    transformIndexHtml(html) {
      return html.replace('<div id="app"></div>', () => `<div id="app">${renderHome()}</div>`)
    },
  }],
})
