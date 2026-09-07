import { writeFile } from 'node:fs/promises'
import { setTimeout } from 'node:timers/promises'
import { Browser } from '../../scripts/browser.ts'

const browser = new Browser()
const base = process.env.BROWSER_TEST_URL || 'http://127.0.0.1:8788/'
const rows: unknown[] = []
await browser.command('open')
const cdp = await browser.instrument()
const sample = async (phase: string, width: number, iteration: number) => {
  const state = await browser.evaluate<Record<string, unknown>>(`({
    url: location.href, readyState: document.readyState, scrollY,
    target: document.querySelector('#kpp')?.getBoundingClientRect().toJSON(),
    header: document.querySelector('header')?.getBoundingClientRect().toJSON(),
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    scrollRestoration: history.scrollRestoration
  })`)
  rows.push({ phase, width, iteration, ...state })
  console.log(JSON.stringify(rows.at(-1)))
}
try {
  await cdp.send('Emulation.setScriptExecutionDisabled', { value: true })
  for (const [width, height] of [[390, 844], [1440, 900]]) {
    await browser.command('set', 'viewport', String(width), String(height))
    for (const iteration of [0, 100, 250, 500, 800]) {
      await browser.command('open', new URL('/chodnik-stanislawow-pierwszy/#dzialania', base).href)
      await browser.command('focus', '.history-card a[href="/ruch-i-wypadki-dw633/#zdarzenia"]')
      await browser.command('press', 'Enter')
      await browser.command('wait', '--url', new URL('/ruch-i-wypadki-dw633/#zdarzenia', base).href)
      await browser.command('wait', '--load', 'load')
      await browser.command('focus', '#zdarzenia a[href="/dokumenty-dw633/#kpp"]')
      await browser.command('press', 'Enter')
      await browser.command('wait', '--url', new URL('/dokumenty-dw633/#kpp', base).href)
      await browser.command('wait', '--load', 'load')
      await setTimeout(iteration)
      await sample('before-reload', width, iteration)
      await browser.command('reload')
      await sample('after-reload', width, iteration)
      await setTimeout(1000)
      await sample('after-one-second', width, iteration)
      await browser.command('screenshot', `reports/issue-9/diagnose-${width}-${iteration}.png`)
    }
  }
} finally {
  await writeFile('reports/issue-9/diagnose.json', JSON.stringify({ base, rows }, null, 2) + '\n')
  cdp.close()
  await browser.command('close')
}
