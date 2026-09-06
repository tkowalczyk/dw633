import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { describe, test } from 'node:test'
import { Browser } from './scripts/browser.ts'

// Issue #4 assumptions: GET requests for unknown paths, including nested paths,
// return an HTML error with status 404 and no redirect. Existing routes stay 200.
// The error and its ordinary home link work without JS; no home canonical or
// sitemap entry belongs to the error. Test the built site through Pages, not Vite.
// Future pages, production deployment, Search Console and non-GET methods are out of scope.
const url = process.env.BROWSER_TEST_URL || 'http://127.0.0.1:8788/'
const missingPaths = ['/seo-test-brak-20260906/', '/seo-test-brak-20260906/zagniezdzony/']

describe('strona 404', () => {
  test('nieznane adresy zwracają błąd 404 bez przekierowania', async () => {
    for (const path of missingPaths) {
      const response = await fetch(new URL(path, url), { redirect: 'manual' })
      assert.equal(response.status, 404, path)
      assert.equal(response.headers.get('location'), null)
      assert.match(response.headers.get('content-type') || '', /text\/html/)
      assert.match(await response.text(), /<h1[^>]*>Nie znaleziono strony<\/h1>/)
    }
  })

  test('komunikat i powrót klawiaturą działają bez JS na telefonie i komputerze', async () => {
    const browser = new Browser()
    await browser.command('open')
    const cdp = await browser.instrument()
    try {
      await cdp.send('Emulation.setScriptExecutionDisabled', { value: true })
      await browser.command('open', url)
      const appearance = `({ background: getComputedStyle(document.body).backgroundColor, font: getComputedStyle(document.body).fontFamily })`
      const homeAppearance = await browser.evaluate(appearance)
      await mkdir('test-results/agent-browser', { recursive: true })
      for (const { width, height } of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
        await browser.command('set', 'viewport', String(width), String(height))
        await browser.command('open', new URL(missingPaths[1], url).href)
        const content = await browser.evaluate(`({
          heading: document.querySelector('main h1')?.textContent,
          visible: document.querySelector('main h1')?.checkVisibility({ visibilityProperty: true, opacityProperty: true }),
          link: document.querySelector('main a')?.textContent,
          linkVisible: document.querySelector('main a')?.checkVisibility({ visibilityProperty: true, opacityProperty: true }),
          href: document.querySelector('main a')?.getAttribute('href'),
          canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
          overflow: document.documentElement.scrollWidth > innerWidth
        })`)
        assert.deepEqual(content, {
          heading: 'Nie znaleziono strony', visible: true,
          link: 'Wróć na stronę główną', linkVisible: true, href: '/',
          canonical: null, overflow: false,
        })
        assert.deepEqual(await browser.evaluate(appearance), homeAppearance)
        await browser.command('press', 'Tab')
        assert.equal(await browser.evaluate(`document.activeElement === document.querySelector('main a')`), true)
        assert.notEqual(await browser.evaluate(`getComputedStyle(document.activeElement).outlineStyle`), 'none')
        await browser.command('screenshot', `test-results/agent-browser/404-no-js-${width}.png`)
        await browser.command('press', 'Enter')
        assert.equal(await browser.evaluate('location.href'), new URL('/', url).href)
        assert.equal(await browser.evaluate(`document.querySelector('h1').textContent`), 'DW633 przyjazna pieszym')
      }
      assert.deepEqual((await browser.command('errors')).errors, [])
    } finally {
      cdp.close()
      await browser.command('close')
    }
  })

  test('strona główna, robots, sitemap i zasoby nadal zwracają właściwą treść z kodem 200', async () => {
    const home = await fetch(new URL('/', url), { redirect: 'manual' })
    assert.equal(home.status, 200)
    const html = await home.text()
    assert.match(html, /<h1[^>]*>DW633 przyjazna pieszym<\/h1>/)
    const robots = await fetch(new URL('/robots.txt', url), { redirect: 'manual' })
    assert.equal(robots.status, 200)
    assert.match(robots.headers.get('content-type') || '', /text\/plain/)
    assert.match(await robots.text(), /Sitemap: https:\/\/dw633\.pl\/sitemap\.xml/)
    const sitemap = await fetch(new URL('/sitemap.xml', url), { redirect: 'manual' })
    assert.equal(sitemap.status, 200)
    assert.match(sitemap.headers.get('content-type') || '', /(?:application|text)\/xml/)
    assert.match(await sitemap.text(), /<loc>https:\/\/dw633\.pl\/<\/loc>/)
    const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1])
    const styles = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(match => match[1])
    assert.ok(scripts.length > 0)
    assert.ok(styles.length > 0)
    for (const asset of [...scripts, ...styles]) {
      const response = await fetch(new URL(asset, url), { redirect: 'manual' })
      assert.equal(response.status, 200, asset)
      assert.match(response.headers.get('content-type') || '', styles.includes(asset) ? /text\/css/ : /javascript/)
      assert.ok((await response.text()).trim().length > 0, asset)
    }
  })

  test('sitemap pomija stronę błędu i adresy testowe', async () => {
    const xml = await (await fetch(new URL('/sitemap.xml', url))).text()
    const locations = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(match => match[1].trim())
    assert.ok(locations.length > 0)
    for (const location of locations) {
      const path = new URL(location).pathname
      assert.doesNotMatch(path, /\/404(?:\.html)?\/?$/)
      assert.ok(!missingPaths.includes(path), path)
      const response = await fetch(new URL(path, url), { redirect: 'manual' })
      assert.equal(response.status, 200, path)
    }
  })
})
