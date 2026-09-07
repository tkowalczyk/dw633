import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdir } from 'node:fs/promises'
import { Browser } from '../scripts/browser.ts'
import { siteData } from './site-data.ts'

// Issue #3: public siteData and GET / produce complete HTML (200), enhanced in place.
// Cover disabled/delayed JS, keyboard access, both viewport sizes and reduced motion.
// Private documents, 404, new routes and Search Console belong to separate tasks.
const url = process.env.BROWSER_TEST_URL || 'http://127.0.0.1:8788/'
const viewports = [{ width: 390, height: 844 }, { width: 1440, height: 900 }]
const artifacts = 'test-results/agent-browser'
await mkdir(artifacts, { recursive: true })

async function withBrowser(run: (browser: Browser, cdp: Awaited<ReturnType<Browser['instrument']>>) => Promise<void>) {
  const browser = new Browser()
  await browser.command('open')
  const cdp = await browser.instrument()
  try { await run(browser, cdp) } finally {
    cdp.close()
    await browser.command('close')
  }
}

async function visibleDescriptions(browser: Browser) {
  const visible = await browser.evaluate<string[]>(`Array.from(document.querySelectorAll('[data-route-step] p')).filter(el => el.checkVisibility({ visibilityProperty: true, opacityProperty: true })).map(el => el.textContent)`)
  for (const point of siteData.route.points) assert.ok(visible.includes(point.description), point.label)
}

async function noOverflow(browser: Browser) {
  assert.equal(await browser.evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
}

async function focused(browser: Browser, selector: string) {
  assert.equal(await browser.evaluate(`document.activeElement === document.querySelector(${JSON.stringify(selector)})`), true, selector)
}

async function screenshot(browser: Browser, name: string) {
  await browser.command('screenshot', `${artifacts}/${name}.png`)
}

test('pełna treść w odpowiedzi HTTP i przy wyłączonym JS', async () => {
  const response = await fetch(url)
  assert.equal(response.status, 200)
  const html = await response.text()
  assert.ok(html.includes('<h1'))
  const bot = await fetch(url, { headers: { 'User-Agent': 'Googlebot' } })
  assert.equal(await bot.text(), html)
  await withBrowser(async (browser, cdp) => {
    await cdp.send('Emulation.setScriptExecutionDisabled', { value: true })
    await browser.command('open', url)
    assert.equal(await browser.evaluate('document.querySelector(".is-enhanced") === null'), true)
    const data = await browser.evaluate<{ h1: string[], nav: number, text: string, ids: boolean }>(`({
      h1: [...document.querySelectorAll('h1')].map(el => el.textContent),
      nav: document.querySelectorAll('nav').length, text: document.querySelector('main').textContent,
      ids: ['start','odcinek','dane','dzialania','zrodla'].every(id => document.querySelectorAll('#'+id).length === 1 && document.querySelector('a[href="#'+id+'"]'))
    })`)
    assert.deepEqual(data.h1, ['DW633 przyjazna pieszym'])
    assert.equal(data.nav, 1)
    assert.equal(data.ids, true)
    for (const text of [
      siteData.trafficPage.kppPeriod, ...siteData.route.points.map(p => p.description),
      ...siteData.initiative.slice(-3).map(p => p.confirmed), siteData.documents.homeIntro, siteData.documents.linkLabel,
    ]) assert.ok(data.text.includes(text), text)
  })
})

test('lokalny tytuł, canonical i metadane udostępniania', async () => {
  await withBrowser(async (browser) => {
    await browser.command('open', url)
    const data = await browser.evaluate<{ title: string, lang: string, canonical: string[], meta: Record<string, string> }>(`({
      title: document.title, lang: document.documentElement.lang,
      canonical: [...document.querySelectorAll('link[rel="canonical"]')].map(el => el.href),
      meta: Object.fromEntries([...document.querySelectorAll('meta')].map(el => [el.name || el.getAttribute('property'), el.content]))
    })`)
    const title = 'DW633 w Stanisławowie Pierwszym | Bezpieczeństwo pieszych'
    const description = 'Chodnik i przejścia przy ul. Jana Kazimierza w Stanisławowie Pierwszym, gmina Nieporęt. Dane, dokumenty i stan działań na DW633'
    assert.equal(data.title, title)
    assert.equal(data.lang, 'pl')
    assert.deepEqual(data.canonical, ['https://dw633.pl/'])
    assert.ok(!/noindex/i.test(data.meta.robots || ''))
    for (const key of ['description', 'og:description', 'twitter:description']) assert.equal(data.meta[key], description)
    for (const key of ['og:title', 'twitter:title']) assert.equal(data.meta[key], title)
    assert.equal(data.meta['og:url'], 'https://dw633.pl/')
  })
})

test('lokalizacja, link przystanków i cel pod H1', async () => {
  await withBrowser(async (browser) => {
    await browser.command('open', url)
    const data = await browser.evaluate<{ lead: string, href: string, scope: string }>(`({
      lead: document.querySelector('.hero__lead').textContent.trim().replace(/\\s+/g, ' '),
      href: document.querySelector('.hero__lead a').href,
      scope: document.querySelector('.hero__scope').textContent.trim()
    })`)
    assert.equal(data.lead, 'Sprawdzamy bezpieczeństwo pieszych przy drodze wojewódzkiej nr 633 w Stanisławowie Pierwszym, w gminie Nieporęt. Chodzi o ulicę Jana Kazimierza, od rejonu przystanków «Przyleśna» do ulicy Sonaty.')
    assert.equal(data.href, siteData.hero.lead.locationUrl)
    assert.equal(data.scope, siteData.hero.scope)
  })
})

test('opisy, klawiatura i rozwijanie danych bez JS w obu rozmiarach', async () => {
  await withBrowser(async (browser, cdp) => {
    await cdp.send('Emulation.setScriptExecutionDisabled', { value: true })
    for (const { width, height } of viewports) {
      await browser.command('set', 'viewport', String(width), String(height))
      await browser.command('open', url)
      await visibleDescriptions(browser)
      await screenshot(browser, `no-js-${width}-start`)
      await browser.command('press', 'Tab')
      await focused(browser, '.skip-link')
      await browser.command('press', 'Tab')
      for (const id of ['odcinek', 'dane', 'dzialania', 'zrodla']) {
        await browser.command('press', 'Tab')
        await focused(browser, `nav a[href="#${id}"]`)
      }
      await browser.command('press', 'Enter')
      assert.equal(await browser.evaluate('location.hash'), '#zrodla')
      await browser.command('focus', 'nav a[href="#odcinek"]')
      await browser.command('press', 'Enter')
      assert.equal(await browser.evaluate('location.hash'), '#odcinek')
      await browser.command('focus', '[data-route-step]:first-child')
      await browser.evaluate(`document.querySelector('[data-route-step]:first-child').scrollIntoView({ behavior: 'instant', block: 'center' })`)
      await screenshot(browser, `no-js-${width}-route`)
      await browser.command('press', 'Tab')
      await focused(browser, '[data-route-step]:first-child a')
      await browser.command('focus', '.traffic__details summary')
      await browser.command('press', 'Enter')
      assert.equal(await browser.evaluate('document.querySelector(".traffic__details").open'), true)
      await noOverflow(browser)
    }
  })
})

test('punkty schematu leżą na drodze bez JS', async () => {
  await withBrowser(async (browser, cdp) => {
    await cdp.send('Emulation.setScriptExecutionDisabled', { value: true })
    await browser.command('open', url)
    const distances = await browser.evaluate<number[]>(`(() => {
      const path = document.querySelector('#route-line');
      return [...document.querySelectorAll('.route-marker')].map(marker => {
        const expected = path.getPointAtLength(path.getTotalLength() * Number(marker.dataset.progress));
        const position = marker.transform.baseVal.consolidate()?.matrix;
        return Math.hypot((position?.e ?? 0) - expected.x, (position?.f ?? 0) - expected.y);
      });
    })()`)
    assert.equal(distances.length, siteData.route.points.length)
    assert.ok(Math.max(...distances) < 0.5)
  })
})

test('opóźniony skrypt zachowuje dokument i uruchamia nawigację', async () => {
  await withBrowser(async (browser, cdp) => {
    for (const { width, height } of viewports) {
      await browser.command('set', 'viewport', String(width), String(height))
      await cdp.send('Emulation.setScriptExecutionDisabled', { value: true })
      await browser.command('open', url)
      await browser.command('wait', 'h1')
      assert.equal(await browser.evaluate(`(() => {
        window.originalMain = document.querySelector('main');
        window.originalText = window.originalMain.textContent;
        return document.querySelector('h1').checkVisibility({ visibilityProperty: true, opacityProperty: true }) && !document.querySelector('.is-enhanced');
      })()`), true)
      await cdp.send('Emulation.setScriptExecutionDisabled', { value: false })
      // Start the real production module after the complete document is visible.
      await browser.evaluate(`import(document.querySelector('script[type="module"]').src).then(() => true)`)
      await browser.command('wait', '--fn', 'document.querySelector(".is-enhanced") !== null')
      assert.equal(await browser.evaluate(`window.originalMain === document.querySelector('main') && window.originalMain.isConnected && window.originalText === window.originalMain.textContent && document.querySelectorAll('h1').length === 1`), true)
      await screenshot(browser, `js-${width}-start`)
      await browser.command('focus', '[data-route-step]:last-child')
      await browser.evaluate(`document.querySelector('[data-route-step]:last-child h3').scrollIntoView({ behavior: 'instant', block: 'center' })`)
      assert.equal(await browser.evaluate(`document.querySelector('[data-route-step]:last-child h3').checkVisibility({ visibilityProperty: true, opacityProperty: true })`), true)
      await screenshot(browser, `js-${width}-route`)
      await browser.command('press', 'Tab')
      await focused(browser, '[data-route-step]:last-child a')
      for (const id of ['start', 'odcinek', 'dane', 'dzialania', 'zrodla']) {
        await browser.command('find', 'first', `a[href="#${id}"]`, 'click')
        assert.equal(await browser.evaluate('location.hash'), `#${id}`)
      }
      await noOverflow(browser)
    }
    const errors = await browser.command('errors')
    assert.deepEqual(errors.errors, [])
  })
})

test('widoczne opisy i nieruchoma scena przy ograniczeniu animacji', async () => {
  await withBrowser(async (browser) => {
    await browser.command('set', 'media', 'reduced-motion')
    for (const { width, height } of viewports) {
      await browser.command('set', 'viewport', String(width), String(height))
      await browser.command('open', url)
      await visibleDescriptions(browser)
      await screenshot(browser, `reduced-${width}-start`)
      assert.equal(await browser.evaluate(`getComputedStyle(document.querySelector('.traffic__car')).animationName`), 'none')
      assert.equal(await browser.evaluate(`getComputedStyle(document.querySelector('[data-route-traveler]')).display`), 'none')
      await browser.evaluate(`document.querySelector('.route-visual').scrollIntoView({ behavior: 'instant', block: 'center' })`)
      await screenshot(browser, `reduced-${width}-route`)
      await noOverflow(browser)
    }
  })
})
