import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { describe, test } from 'node:test'
import { Browser } from '../scripts/browser.ts'
import { siteData } from './site-data.ts'

// Issue #6: public, typed siteData records are the only input. Annual counts are
// nonnegative integers; 2026 is partial through 18 August. The output is static
// HTML with an accessible annual table at #zdarzenia, metadata and working links.
// Test direct GET/refresh, no JS, keyboard use and 390/1440 px. Shared-data tests
// restore changed records and include zero counts and an empty annual series.
// No new road findings, private documents, live incident feed, deployment or
// Search Console work. There is no runtime user input or concurrent data editing.
const base = process.env.BROWSER_TEST_URL || 'http://127.0.0.1:8788/'
const path = '/ruch-i-wypadki-dw633/'

describe('ruch i zdarzenia na DW633', () => {
  test('czytelna tabela i nawigacja klawiaturą działają bez JS na telefonie i komputerze', async () => {
    const browser = new Browser()
    await browser.command('open')
    const cdp = await browser.instrument()
    try {
      await cdp.send('Emulation.setScriptExecutionDisabled', { value: true })
      await mkdir('test-results/agent-browser', { recursive: true })
      for (const [width, height] of [[390, 844], [1440, 900]]) {
        await browser.command('set', 'viewport', String(width), String(height))
        await browser.command('open', new URL('/#dane', base).href)
        const appearance = `({ background: getComputedStyle(document.body).backgroundColor, font: getComputedStyle(document.body).fontFamily })`
        const homeAppearance = await browser.evaluate(appearance)
        await browser.command('focus', '#dane a[href="/ruch-i-wypadki-dw633/#zdarzenia"]')
        assert.notEqual(await browser.evaluate('getComputedStyle(document.activeElement).outlineStyle'), 'none')
        await browser.command('press', 'Enter')
        assert.equal(await browser.evaluate('location.pathname + location.hash'), `${path}#zdarzenia`)
        await browser.command('reload')
        assert.deepEqual(await browser.evaluate(appearance), homeAppearance)
        assert.equal(await browser.evaluate(`document.querySelector('table').checkVisibility({ visibilityProperty: true }) && !document.querySelector('table').closest('details:not([open])')`), true)
        assert.equal(await browser.evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
        assert.equal(await browser.evaluate(`Array.from(document.querySelectorAll('nav a')).every(link => {
          const rect = link.getBoundingClientRect();
          return link.checkVisibility({ visibilityProperty: true }) && rect.left >= 0 && rect.right <= innerWidth;
        })`), true)
        assert.equal(await browser.evaluate(`document.querySelector('nav a[aria-current="page"]').getAttribute('href')`), path)
        const region = '.table-scroll'
        await browser.command('focus', region)
        assert.notEqual(await browser.evaluate('getComputedStyle(document.activeElement).outlineStyle'), 'none')
        await browser.command('screenshot', `test-results/agent-browser/traffic-no-js-${width}-table.png`)
        if (width === 390) {
          await browser.command('press', 'ArrowRight')
          await browser.command('wait', '--fn', `document.querySelector('${region}').scrollLeft > 0`)
          await browser.evaluate(`document.querySelector('${region}').scrollLeft = document.querySelector('${region}').scrollWidth`)
          assert.equal(await browser.evaluate(`document.querySelector('tfoot td:last-child').getBoundingClientRect().right <= innerWidth`), true)
          await browser.command('screenshot', `test-results/agent-browser/traffic-no-js-${width}-table-end.png`)
        }
        for (const id of ['traffic-page-title', 'gpr-title']) {
          await browser.evaluate(`document.getElementById('${id}').scrollIntoView({ behavior: 'instant', block: 'center' })`)
          await browser.command('screenshot', `test-results/agent-browser/traffic-no-js-${width}-${id}.png`)
        }
        await browser.evaluate(`document.querySelector('.pedestrian-events').scrollIntoView({ behavior: 'instant', block: 'center' })`)
        await browser.command('screenshot', `test-results/agent-browser/traffic-no-js-${width}-pedestrians.png`)
        await browser.command('open', new URL(path, base).href)
        await browser.command('press', 'Tab')
        assert.equal(await browser.evaluate('document.activeElement.className'), 'skip-link')
        await browser.command('press', 'Enter')
        assert.equal(await browser.evaluate('location.hash'), '#tresc')
        await browser.command('focus', 'nav a[href="/#zrodla"]')
        await browser.command('press', 'Enter')
        assert.equal(await browser.evaluate('location.pathname + location.hash'), '/#zrodla')
        await browser.command('open', new URL(path, base).href)
        await browser.command('focus', 'footer a')
        await browser.command('press', 'Enter')
        assert.equal(await browser.evaluate('location.pathname'), '/')
      }
      assert.deepEqual((await browser.command('errors')).errors, [])
    } finally {
      cdp.close()
      await browser.command('close')
    }
  })

  test('menu, skrót głównej i sitemap prowadzą do istniejących stron i kotwic', async () => {
    for (const currentPath of ['/', '/chodnik-stanislawow-pierwszy/', path]) {
      const html = await (await fetch(new URL(currentPath, base))).text()
      const nav = html.match(/<nav\b[\s\S]*?<\/nav>/)?.[0] || ''
      assert.match(nav, /href="\/ruch-i-wypadki-dw633\/"[^>]*>Ruch i zdarzenia<\/a>/)
      assert.doesNotMatch(html, /href="\/dokumenty-dw633\//)
      if (currentPath === path) {
        assert.match(nav, /href="\/ruch-i-wypadki-dw633\/" aria-current="page"/)
        assert.equal((nav.match(/aria-current="page"/g) || []).length, 1)
        assert.match(html, /href="\/chodnik-stanislawow-pierwszy\/"/)
        assert.match(html, /href="\/#zrodla"/)
      }
      if (currentPath === '/') {
        assert.match(html, /id="dane"/)
        assert.match(html, /href="\/ruch-i-wypadki-dw633\/#zdarzenia"/)
        assert.match(html, /class="traffic__stream"/)
      }
      const links = [...new Set([...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1]).filter(href => href.startsWith('/') || href.startsWith('#')))]
      for (const href of links) {
        const target = new URL(href, new URL(currentPath, base))
        const response = await fetch(target, { redirect: 'manual' })
        assert.equal(response.status, 200, href)
        if (target.hash) assert.ok((await response.text()).includes(`id="${target.hash.slice(1)}"`), href)
      }
    }
    const xml = await (await fetch(new URL('/sitemap.xml', base))).text()
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
    assert.equal(locations.filter(location => location === `https://dw633.pl${path}`).length, 1)
    for (const location of locations) assert.equal((await fetch(new URL(new URL(location).pathname, base))).status, 200)
  })

  test('wyjaśnia kategorie zdarzeń i zachowuje informacje o pieszych', async () => {
    const html = await (await fetch(new URL(path, base))).text()
    assert.match(html, /Kolizja.*szkody materialne/)
    assert.match(html, /Wypadek.*ranną lub zabitą/)
    assert.match(html, /href="https:\/\/ksp\.policja\.gov\.pl\/wrd\/sprawy\/informacje-dla-obywateli\/zdarzenia-drogowe\//)
    for (const entry of siteData.pedestrianEntries) {
      assert.ok(html.includes(entry.category))
      assert.ok(html.includes(entry.description))
    }
  })

  test('udostępnia roczną tabelę KPP, GPR i objaśnienia z zakresem oraz źródłami', async () => {
    const html = await (await fetch(new URL(path, base))).text()
    assert.match(html, /id="zdarzenia"/)
    const table = html.match(/<table\b[\s\S]*?<\/table>/)?.[0] || ''
    assert.match(table, /<caption>[^<]+<\/caption>/)
    assert.equal((table.match(/scope="col"/g) || []).length, 4)
    for (const row of siteData.kppByYear) {
      assert.ok(table.includes(`<th scope="row">${row.label}</th>`))
      assert.match(table, new RegExp(`<th scope="row">${row.label}</th>\\s*<td>${row.collisions}</td>\\s*<td>${row.accidents}</td>\\s*<td>${row.collisions + row.accidents}</td>`))
    }
    assert.match(table, /<tfoot><tr><th scope="row">Razem<\/th><td>35<\/td><td>3<\/td><td>38<\/td>/)
    for (const content of [siteData.asOf, siteData.traffic.caveat, siteData.traffic.dailyVehicles.toLocaleString('pl-PL'), siteData.pedestrianCaveat, '4 osoby ranne', '25 maja 2026 r.', '1.01.2020-18.08.2026', 'Generalny Pomiar Ruchu', 'Systemu Ewidencji Wypadków i Kolizji', 'Kolizje', 'wypadki']) {
      assert.ok(html.includes(content), content)
    }
    assert.match(html, /dłuższy od/)
    assert.match(html, /przeliczenie średniej dobowej/)
    assert.match(html, /lokalny profil godzinowy/)
    const events = html.slice(html.indexOf('id="zdarzenia"'))
    assert.match(events, /Przyleśna/)
    assert.match(events, /Sonaty/)
    assert.ok(html.includes(siteData.sources.find(source => source.id === 'gpr-2025')!.url!))
    assert.match(events, /KPP Legionowo/)
    assert.match(events, /19\.08\.2026/)
    assert.doesNotMatch(html, /(?:sprawa-dw633|odpowiedzi|wyslane)\/|AE:PL-/)
  })

  test('ma własny tytuł, opis i adres kanoniczny w gotowym HTML', async () => {
    const html = await (await fetch(new URL(path, base))).text()
    const title = 'Ruch, kolizje i wypadki na DW633 | Stanisławów Pierwszy'
    assert.equal(html.match(/<title>(.*?)<\/title>/)?.[1], title)
    assert.deepEqual([...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(match => match[1]), [`https://dw633.pl${path}`])
    const meta = Object.fromEntries([...html.matchAll(/<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]+)"/g)].map(match => [match[1], match[2]]))
    assert.equal(meta['og:url'], `https://dw633.pl${path}`)
    for (const prefix of ['og', 'twitter']) {
      assert.equal(meta[`${prefix}:title`], title)
      assert.equal(meta[`${prefix}:description`], meta.description)
    }
    assert.ok(meta.description.length > 50)
    assert.ok(!/noindex/.test(meta.robots || ''))
    for (const other of ['/', '/chodnik-stanislawow-pierwszy/']) {
      const otherHtml = await (await fetch(new URL(other, base))).text()
      assert.notEqual(otherHtml.match(/name="description"\s+content="([^"]+)"/)?.[1], meta.description)
    }
    assert.equal((html.match(/<h1\b/g) || []).length, 1)
  })

  test('bezpośrednie wejście i odświeżenie zwracają temat podstrony w HTML z kodem 200', async () => {
    for (let visit = 0; visit < 2; visit++) {
      const response = await fetch(new URL(path, base), { redirect: 'manual' })
      assert.equal(response.status, 200)
      assert.match(response.headers.get('content-type') || '', /text\/html/)
      assert.match(await response.text(), /<h1[^>]*>Ruch, kolizje i wypadki na DW633 w Stanisławowie Pierwszym<\/h1>/)
    }
  })
})
