import assert from 'node:assert/strict'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { describe, test } from 'node:test'
import { Browser } from '../scripts/browser.ts'
import { siteData } from './site-data.ts'

// Issue #7: input is the existing typed, public source records. Optional url/links
// may be absent: private material gets a description, never a file link. Output
// is complete static HTML, stable source anchors and links between four pages.
// Check GET/refresh, metadata, canonical redirects, no JS, keyboard and 390/1440 px.
// Empty source arrays and changed records are covered through real renderers.
// No runtime input/concurrency, new road findings, private archive imports,
// deployment or Search Console work. AFK scope follows the issue's plan.
const base = process.env.BROWSER_TEST_URL || 'http://127.0.0.1:8788/'
const path = '/dokumenty-dw633/'

describe('katalog dokumentów DW633', () => {
  test('wszystkie wewnętrzne odsyłacze gotowego serwisu mają działające adresy i kotwice', async () => {
    const paths = ['/', '/chodnik-stanislawow-pierwszy/', '/ruch-i-wypadki-dw633/', path, '/seo-test-brak-20260906/']
    const cache = new Map<string, { status: number; html: string }>()
    const get = async (target: URL) => {
      const url = new URL(target)
      url.hash = ''
      if (!cache.has(url.href)) {
        const response = await fetch(url, { redirect: 'manual' })
        cache.set(url.href, { status: response.status, html: await response.text() })
      }
      return cache.get(url.href)!
    }
    const results: Array<{ from: string; href: string; status: number; anchorFound: boolean }> = []
    for (const currentPath of paths) {
      const currentUrl = new URL(currentPath, base)
      const { html } = await get(currentUrl)
      const hrefs = [...new Set([...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1]))]
      for (const href of hrefs) {
        const target = new URL(href, currentUrl)
        if (target.origin === 'https://dw633.pl') target.host = new URL(base).host
        if (target.host !== new URL(base).host) continue
        target.protocol = new URL(base).protocol
        const result = await get(target)
        const ids = [...result.html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
        results.push({ from: currentPath, href, status: result.status, anchorFound: !target.hash || ids.includes(decodeURIComponent(target.hash.slice(1))) })
      }
    }
    await mkdir('test-results/agent-browser', { recursive: true })
    await writeFile('test-results/agent-browser/internal-links.json', JSON.stringify({ base, results }, null, 2) + '\n')
    assert.ok(results.length > 0)
    assert.deepEqual(results.filter(result => result.status !== 200 || !result.anchorFound), [])
  })

  test('gotowy katalog zachowuje publiczne rekordy, a build nie zawiera prywatnych załączników', async () => {
    const html = await (await fetch(new URL(path, base))).text()
    const cards = [...html.matchAll(/<li class="source-card"[^>]*>[\s\S]*?<\/li>/g)].map(match => match[0])
    assert.equal(cards.length, siteData.sources.length)
    siteData.sources.forEach((source, index) => {
      for (const text of [source.title, source.owner, source.scope, source.asOf, source.note]) assert.ok(cards[index].includes(text), `${source.id}: ${text}`)
    })
    const files = (await readdir('dist', { recursive: true })).sort()
    assert.deepEqual(files.filter(file => /\.(pdf|docx?|eml|msg|md|map)$/i.test(file) || /(?:odpowiedzi|wyslane|sprawa-dw633)/.test(file)), [])
    for (const file of files.filter(file => /\.(html|js|css|xml|webmanifest)$/.test(file))) {
      assert.doesNotMatch(await readFile(`dist/${file}`, 'utf8'), /AE:PL-|(?:sprawa-dw633|odpowiedzi|wyslane)\/|file:\/\/|\/Users\//, file)
    }
    await mkdir('test-results/agent-browser', { recursive: true })
    await writeFile('test-results/agent-browser/build-files.json', JSON.stringify(files, null, 2) + '\n')
  })

  test('warianty adresów prowadzą do kanonicznych URL z końcowym ukośnikiem', async () => {
    for (const canonicalPath of ['/', '/chodnik-stanislawow-pierwszy/', '/ruch-i-wypadki-dw633/', path]) {
      const variants = canonicalPath === '/' ? ['/index.html'] : [canonicalPath.slice(0, -1), `${canonicalPath}index.html`]
      for (const variant of variants) {
        const first = await fetch(new URL(variant, base), { method: 'HEAD', redirect: 'manual' })
        assert.ok([301, 302, 307, 308].includes(first.status), `${variant}: ${first.status}`)
        const final = await fetch(new URL(variant, base), { method: 'HEAD' })
        assert.equal(final.status, 200, variant)
        assert.equal(new URL(final.url).pathname, canonicalPath, variant)
      }
    }
  })

  test('sitemap zawiera dokładnie cztery wygenerowane strony z własnymi canonical', async () => {
    const xml = await (await fetch(new URL('/sitemap.xml', base))).text()
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
    const paths = ['/', '/chodnik-stanislawow-pierwszy/', '/ruch-i-wypadki-dw633/', path]
    assert.deepEqual(locations.sort(), paths.map(value => `https://dw633.pl${value}`).sort())
    assert.doesNotMatch(xml, /<lastmod>|#|404|https:\/\/dw633.pl\/(?:dane|dzialania|zrodla)\//)
    const files = (await readdir('dist', { recursive: true })).filter(file => file.endsWith('.html') && file !== '404.html')
    assert.deepEqual(files.sort(), paths.map(value => `${value.slice(1)}index.html`).sort())
    for (const currentPath of paths) {
      const response = await fetch(new URL(currentPath, base), { redirect: 'manual' })
      assert.equal(response.status, 200)
      const html = await response.text()
      assert.ok(html.includes(`<link rel="canonical" href="https://dw633.pl${currentPath}"`))
      assert.equal((html.match(/rel="canonical"/g) || []).length, 1)
    }
  })

  test('pozwala przejść klawiaturą od odpowiedzi KPP do tabeli, źródła i z powrotem bez JS', async () => {
    const browser = new Browser()
    await browser.command('open')
    const cdp = await browser.instrument()
    try {
      await cdp.send('Emulation.setScriptExecutionDisabled', { value: true })
      await mkdir('test-results/agent-browser', { recursive: true })
      for (const [width, height] of [[390, 844], [1440, 900]]) {
        await browser.command('set', 'viewport', String(width), String(height))
        await browser.command('open', new URL('/chodnik-stanislawow-pierwszy/#dzialania', base).href)
        await browser.command('focus', '.history-card a[href="/ruch-i-wypadki-dw633/#zdarzenia"]')
        await browser.command('press', 'Enter')
        assert.equal(await browser.evaluate('location.pathname + location.hash'), '/ruch-i-wypadki-dw633/#zdarzenia')
        await browser.command('focus', '#zdarzenia a[href="/dokumenty-dw633/#kpp"]')
        await browser.command('press', 'Enter')
        assert.equal(await browser.evaluate('location.pathname + location.hash'), `${path}#kpp`)
        await browser.command('reload')
        await browser.command('wait', '--fn', `(() => {
          const rect = document.querySelector('#kpp').getBoundingClientRect();
          const headerBottom = document.querySelector('header').getBoundingClientRect().bottom;
          return rect.top >= headerBottom && rect.top < headerBottom + 80;
        })()`)
        await browser.command('screenshot', `test-results/agent-browser/documents-no-js-${width}-kpp.png`)
        await browser.command('focus', '#kpp a[href="/ruch-i-wypadki-dw633/#zdarzenia"]')
        assert.notEqual(await browser.evaluate('getComputedStyle(document.activeElement).outlineStyle'), 'none')
        await browser.command('press', 'Enter')
        assert.equal(await browser.evaluate('location.pathname + location.hash'), '/ruch-i-wypadki-dw633/#zdarzenia')
        await browser.command('focus', 'nav a[href="/dokumenty-dw633/"]')
        await browser.command('press', 'Enter')
        await browser.command('reload')
        assert.equal(await browser.evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
        assert.equal(await browser.evaluate(`Array.from(document.querySelectorAll('nav a, h1, .source-card')).every(element => {
          const rect = element.getBoundingClientRect();
          return element.checkVisibility({ visibilityProperty: true }) && rect.left >= 0 && rect.right <= innerWidth;
        })`), true)
        assert.ok(await browser.evaluate<number>(`parseFloat(getComputedStyle(document.querySelector('h1')).fontSize) >= 40`))
        assert.ok(await browser.evaluate<number>(`parseFloat(getComputedStyle(document.querySelector('h1')).fontSize) <= 72`))
        await browser.command('screenshot', `test-results/agent-browser/documents-no-js-${width}-start.png`)
        for (const id of ['event-categories', 'school-area', 'mzdw-extension', 'accident-date-check']) {
          await browser.evaluate(`document.getElementById('${id}').scrollIntoView({ behavior: 'instant', block: 'center' })`)
          await browser.command('screenshot', `test-results/agent-browser/documents-no-js-${width}-${id}.png`)
        }
        await browser.command('open', new URL(path, base).href)
        await browser.command('press', 'Tab')
        assert.equal(await browser.evaluate('document.activeElement.className'), 'skip-link')
        await browser.command('press', 'Enter')
        assert.equal(await browser.evaluate('location.hash'), '#tresc')
        await browser.command('focus', 'footer a[href="/"]')
        await browser.command('press', 'Enter')
        assert.equal(await browser.evaluate('location.pathname'), '/')
      }
      assert.deepEqual((await browser.command('errors')).errors, [])
    } finally {
      cdp.close()
      await browser.command('close')
    }
  })

  test('łączy wszystkie strony i przypisy z katalogiem, zachowując bezpośrednie źródła', async () => {
    const paths = ['/', '/chodnik-stanislawow-pierwszy/', '/ruch-i-wypadki-dw633/', path]
    for (const currentPath of paths) {
      const html = await (await fetch(new URL(currentPath, base))).text()
      const nav = html.match(/<nav\b[\s\S]*?<\/nav>/)?.[0] || ''
      for (const target of paths.slice(1)) assert.ok(nav.includes(`href="${target}"`), `${currentPath} -> ${target}`)
      if (currentPath !== '/') assert.ok(nav.includes(`href="${currentPath}" aria-current="page"`))
      if (currentPath === path) continue
      const notes = [...html.matchAll(/<small class="source-note">[\s\S]*?<\/small>/g)].map(match => match[0])
      assert.ok(notes.length > 0)
      for (const note of notes) assert.match(note, /href="\/dokumenty-dw633\/#[^"]+"/)
      const links = [...html.matchAll(/href="([^"]+)"/g)].map(match => match[1])
      for (const source of siteData.sources) {
        if (!html.includes(`${source.owner}, ${source.scope}; stan danych: ${source.asOf}`)) continue
        for (const url of [source.url, ...source.links?.map(link => link.url) || []].filter(Boolean)) assert.ok(links.includes(url!))
      }
      if (currentPath === '/') {
        const sources = html.match(/<section class="sources section"[\s\S]*?<\/section>/)?.[0] || ''
        assert.match(sources, /id="zrodla"/)
        assert.match(sources, /href="\/dokumenty-dw633\/"/)
        assert.doesNotMatch(sources, /class="source-card"/)
      }
    }
  })

  test('udostępnia pełny HTML katalogu pod własnym adresem i z własnymi metadanymi', async () => {
    const response = await fetch(new URL(path, base), { redirect: 'manual' })
    assert.equal(response.status, 200)
    const html = await response.text()
    assert.match(html, /<title>Dokumenty w sprawie DW633 \| Stanisławów Pierwszy<\/title>/)
    assert.match(html, /<h1[^>]*>Dokumenty w sprawie DW633 w Stanisławowie Pierwszym<\/h1>/)
    assert.match(html, /<link rel="canonical" href="https:\/\/dw633.pl\/dokumenty-dw633\/"/)
    assert.match(html, /<meta property="og:url" content="https:\/\/dw633.pl\/dokumenty-dw633\/"/)
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]
    assert.ok(description)
    for (const other of ['/', '/chodnik-stanislawow-pierwszy/', '/ruch-i-wypadki-dw633/']) {
      const otherHtml = await (await fetch(new URL(other, base))).text()
      assert.notEqual(description, otherHtml.match(/<meta name="description" content="([^"]+)"/)?.[1])
    }
    assert.match(html, /Pismo KPP-RD-1930\/26/)
    assert.doesNotMatch(html, /<!-- documents-page -->|\{\{documents-/)
  })
})
