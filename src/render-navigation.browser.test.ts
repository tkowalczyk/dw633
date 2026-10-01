import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Browser } from '../scripts/browser.ts'

const base = process.env.BROWSER_TEST_URL || 'http://127.0.0.1:8788/'
const paths = ['/', '/chodnik-stanislawow-pierwszy/', '/ruch-i-wypadki-dw633/', '/dokumenty-dw633/']

test('hamburger na każdej stronie: dotyk, klawiatura, Escape i przejście do FAQ', async () => {
  const browser = new Browser()
  try {
    await browser.command('set', 'viewport', '390', '844')
    for (const path of paths) {
      await browser.command('open', new URL(path, base).href)
      await browser.command('wait', '.has-menu')
      assert.equal(await browser.evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`), 'false')
      assert.equal(await browser.evaluate(`document.querySelector('nav').checkVisibility()`), false)
      await browser.command('focus', '.menu-toggle')
      await browser.command('press', 'Enter')
      assert.equal(await browser.evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`), 'true')
      await browser.command('press', 'Tab')
      assert.equal(await browser.evaluate(`document.activeElement === document.querySelector('nav a')`), true)
      await browser.command('press', 'Escape')
      assert.equal(await browser.evaluate(`document.activeElement === document.querySelector('.menu-toggle')`), true)
      assert.equal(await browser.evaluate(`document.querySelector('nav').checkVisibility()`), false)
      await browser.command('click', '.menu-toggle')
      assert.equal(await browser.evaluate(`Array.from(document.querySelectorAll('nav a')).every(a => a.getBoundingClientRect().height >= 44)`), true)
      await browser.command('click', 'nav a[href="/chodnik-stanislawow-pierwszy/#faq"]')
      assert.equal(await browser.evaluate('location.pathname + location.hash'), '/chodnik-stanislawow-pierwszy/#faq')
      await browser.command('wait', '.has-menu')
      assert.equal(await browser.evaluate(`document.querySelector('nav').checkVisibility()`), false)
    }
    assert.deepEqual((await browser.command('errors')).errors, [])
  } finally {
    await browser.command('close')
  }
})

test('menu zamyka się poza panelem i po zmianie szerokości, działa w poziomie', async () => {
  const browser = new Browser()
  try {
    await browser.command('set', 'viewport', '390', '844')
    await browser.command('open', base)
    await browser.command('click', '.menu-toggle')
    await browser.command('click', '.hero__scope')
    assert.equal(await browser.evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`), 'false')
    await browser.command('click', '.menu-toggle')
    await browser.command('set', 'viewport', '1440', '900')
    await browser.command('wait', '--fn', `document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false'`)
    assert.equal(await browser.evaluate(`document.querySelector('nav').checkVisibility() && !document.querySelector('.menu-toggle').checkVisibility()`), true)
    await browser.command('focus', 'nav a')
    await browser.command('set', 'viewport', '320', '568')
    await browser.command('wait', '--fn', `document.activeElement === document.querySelector('.menu-toggle')`)
    assert.equal(await browser.evaluate(`document.activeElement === document.querySelector('.menu-toggle') && !document.querySelector('nav').checkVisibility()`), true)
    await browser.command('set', 'viewport', '844', '390')
    await browser.command('click', '.menu-toggle')
    await browser.command('focus', 'nav a:last-child')
    const position = await browser.evaluate<{ bottom: number, top: number }>(`document.activeElement.getBoundingClientRect().toJSON()`)
    assert.ok(position.bottom <= 390 && position.top >= 64)
    await browser.command('press', 'Tab')
    assert.equal(await browser.evaluate(`document.querySelector('nav').checkVisibility()`), false)
  } finally {
    await browser.command('close')
  }
})

test('wszystkie podstrony: 320, 390, 768, 1024 i 1440 px bez uciętego tekstu i tabel', async () => {
  const browser = new Browser()
  try {
    for (const width of [320, 390, 768, 1024, 1440]) {
      await browser.command('set', 'viewport', String(width), '900')
      for (const path of paths) {
        await browser.command('open', new URL(path, base).href)
        await browser.command('wait', '.has-menu')
        const state = await browser.evaluate<{ overflow: boolean, header: number, clipped: string[], tables: boolean, route: boolean }>(`({
          overflow: document.documentElement.scrollWidth > innerWidth,
          header: document.querySelector('header').getBoundingClientRect().height,
          clipped: [...document.querySelectorAll('h1, h2, h3, .source-card, .faq__item, .history-card, .chart')].filter(el => {
            if (el.closest('.facebook__track')) return false;
            const rect = el.getBoundingClientRect(); return rect.left < -1 || rect.right > innerWidth + 1;
          }).map(el => el.className || el.tagName),
          tables: [...document.querySelectorAll('.table-scroll')].every(el => !el.checkVisibility() || el.scrollWidth <= el.clientWidth),
          route: innerWidth > 900 || [...document.querySelectorAll('.route-step__card')].every(el => el.checkVisibility({ visibilityProperty: true, opacityProperty: true }))
        })`)
        assert.equal(state.overflow, false, `${width} ${path}`)
        assert.deepEqual(state.clipped, [], `${width} ${path}`)
        assert.equal(state.tables, true, `${width} ${path}`)
        assert.equal(state.route, true)
        if (width <= 1100) assert.ok(state.header <= 76, `${width}: nagłówek ${state.header}`)
      }
    }
    assert.deepEqual((await browser.command('errors')).errors, [])
  } finally {
    await browser.command('close')
  }
})
