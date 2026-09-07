import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { describe, test } from 'node:test'
import { Browser } from '../scripts/browser.ts'
import { siteData } from './site-data.ts'

// Issue #5: GET the canonical path directly or again on refresh. Both responses
// must contain complete HTML and work without JS. Public siteData is the only
// content input; initiative records are ordered oldest to newest, including ties
// and approximate dates. Home shows the last three (or all if fewer), newest first.
// Cover shared updates, metadata, links, keyboard access and both viewport sizes.
// New road findings, private files, future pages, deployment and Search Console
// are outside this local implementation. No APIs or user inputs are introduced.
const base = process.env.BROWSER_TEST_URL || 'http://127.0.0.1:8788/'
const path = '/chodnik-stanislawow-pierwszy/'

describe('chodnik i przejścia', () => {
  test('czytelna podstrona i nawigacja klawiaturą działają bez JS na telefonie i komputerze', async () => {
    const browser = new Browser()
    await browser.command('open')
    const cdp = await browser.instrument()
    try {
      await cdp.send('Emulation.setScriptExecutionDisabled', { value: true })
      await mkdir('test-results/agent-browser', { recursive: true })
      for (const [width, height] of [[390, 844], [1440, 900]]) {
        await browser.command('set', 'viewport', String(width), String(height))
        await browser.command('open', base)
        const appearance = `({ background: getComputedStyle(document.body).backgroundColor, font: getComputedStyle(document.body).fontFamily })`
        const homeAppearance = await browser.evaluate(appearance)
        const visibleNavigation = `Array.from(document.querySelectorAll('nav a')).every(link => {
          const rect = link.getBoundingClientRect();
          return link.checkVisibility({ visibilityProperty: true }) && rect.left >= 0 && rect.right <= innerWidth;
        })`
        assert.equal(await browser.evaluate(visibleNavigation), true, 'menu głównej mieści się w oknie')
        for (let tab = 0; tab < 7; tab++) await browser.command('press', 'Tab')
        assert.equal(await browser.evaluate(`document.activeElement.getAttribute('href')`), path)
        assert.notEqual(await browser.evaluate(`getComputedStyle(document.activeElement).outlineStyle`), 'none')
        await browser.command('press', 'Enter')
        assert.equal(await browser.evaluate('location.pathname'), path)
        await browser.command('reload')
        assert.equal(await browser.evaluate('location.pathname'), path)
        assert.deepEqual(await browser.evaluate(appearance), homeAppearance)
        assert.equal(await browser.evaluate(visibleNavigation), true)
        assert.equal(await browser.evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
        assert.equal(await browser.evaluate(`document.querySelector('h1').checkVisibility({ visibilityProperty: true })`), true)
        assert.equal(await browser.evaluate(`document.querySelector('main').innerText.includes(${JSON.stringify(siteData.initiative[0].confirmed)})`), true)
        assert.equal(await browser.evaluate(`document.querySelector('nav a[aria-current="page"]').getAttribute('href')`), path)
        await browser.command('screenshot', `test-results/agent-browser/walk-no-js-${width}-start.png`)
        for (const id of ['waiting-title', 'history-title', 'updates-title']) {
          await browser.evaluate(`document.getElementById('${id}').scrollIntoView({ behavior: 'instant', block: 'center' })`)
          await browser.command('screenshot', `test-results/agent-browser/walk-no-js-${width}-${id}.png`)
        }
        for (const anchor of ['dane', 'zrodla']) {
          await browser.command('open', new URL(path, base).href)
          await browser.command('focus', `nav a[href="/#${anchor}"]`)
          await browser.command('press', 'Enter')
          assert.equal(await browser.evaluate('location.pathname + location.hash'), `/#${anchor}`)
        }
        await browser.command('open', new URL(path, base).href)
        await browser.command('press', 'Tab')
        assert.equal(await browser.evaluate('document.activeElement.className'), 'skip-link')
        await browser.command('press', 'Enter')
        assert.equal(await browser.evaluate('location.hash'), '#tresc')
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

  test('menu i sitemap prowadzą do istniejących stron i sekcji', async () => {
    for (const currentPath of ['/', path]) {
      const html = await (await fetch(new URL(currentPath, base))).text()
      const nav = html.match(/<nav\b[\s\S]*?<\/nav>/)?.[0] || ''
      assert.ok(nav.includes(`href="${path}"`))
      assert.ok(nav.includes('Chodnik i przejścia'))
      assert.match(html, /href="\/dokumenty-dw633\/"/)
      if (currentPath === path) {
        assert.match(html, /href="\/">Wróć na stronę główną<\/a>/)
        assert.ok(nav.includes('href="/#dane"'))
        assert.ok(nav.includes('href="/#zrodla"'))
      }
      const localLinks = [...new Set([...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1]).filter(href => href.startsWith('/') || href.startsWith('#')))]
      for (const href of localLinks) {
        const target = new URL(href, new URL(currentPath, base))
        const response = await fetch(target, { redirect: 'manual' })
        assert.equal(response.status, 200, href)
        if (target.hash) assert.ok((await response.text()).includes(`id="${target.hash.slice(1)}"`), href)
      }
    }
    const xml = await (await fetch(new URL('/sitemap.xml', base))).text()
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
    assert.equal(locations.filter(location => location === `https://dw633.pl${path}`).length, 1)
  })

  test('ma własny tytuł, opis i canonical w gotowym HTML', async () => {
    const html = await (await fetch(new URL(path, base))).text()
    const title = 'Chodnik i przejścia w Stanisławowie Pierwszym | Stan działań na DW633'
    assert.equal(html.match(/<title>(.*?)<\/title>/)?.[1], title)
    const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(match => match[1])
    assert.deepEqual(canonical, [`https://dw633.pl${path}`])
    const meta = Object.fromEntries([...html.matchAll(/<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]+)"/g)].map(match => [match[1], match[2]]))
    assert.equal(meta['og:url'], canonical[0])
    assert.equal(meta['og:title'], title)
    assert.equal(meta['twitter:title'], title)
    assert.ok(meta.description.length > 50)
    assert.equal(meta['og:description'], meta.description)
    assert.equal(meta['twitter:description'], meta.description)
    assert.ok(!/noindex/.test(meta.robots || ''))
    const home = await (await fetch(base)).text()
    assert.notEqual(home.match(/name="description"\s+content="([^"]+)"/)?.[1], meta.description)
    assert.equal((html.match(/<h1\b/g) || []).length, 1)
  })

  test('pełna historia, pytania, stan wniosków i aktualizacje pochodzą z publicznych danych', async () => {
    const html = await (await fetch(new URL(path, base))).text()
    assert.ok(html.includes(siteData.asOf))
    for (const question of [
      'Co wiadomo o chodniku przy Jana Kazimierza?',
      'Jakiego odcinka dotyczą wnioski?',
      'Na jakie odpowiedzi czekamy?',
    ]) assert.ok(html.includes(question), question)
    assert.equal((html.match(/class="history-card"/g) || []).length, siteData.initiative.length)
    for (const event of siteData.initiative) {
      for (const text of [event.date, event.title, event.status, event.confirmed, event.pending]) {
        assert.ok(html.includes(text), text)
      }
    }
    for (const update of siteData.updates.items) {
      for (const text of [update.title, update.description, update.url]) assert.ok(html.includes(text), text)
    }
    for (const step of siteData.nextSteps) assert.ok(html.includes(step.description), step.title)
    assert.match(html, /Wnioski o dokumenty/)
    assert.match(html, /Wnioski o działania/)
    assert.match(html, /Zawiadomienia określają terminy udostępnienia dokumentów; odpowiedzi merytoryczne mają dopiero nadejść\./)
  })

  test('bezpośrednie wejście i odświeżenie zwracają gotowy HTML z kodem 200', async () => {
    for (let visit = 0; visit < 2; visit++) {
      const response = await fetch(new URL(path, base), { redirect: 'manual' })
      assert.equal(response.status, 200)
      assert.match(response.headers.get('content-type') || '', /text\/html/)
      assert.match(await response.text(), /<h1[^>]*>Chodnik i przejścia w Stanisławowie Pierwszym przy DW633<\/h1>/)
    }
  })
})
