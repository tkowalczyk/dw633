import { writeFile } from 'node:fs/promises'
import { Browser } from './browser.ts'
import { setTimeout } from 'node:timers/promises'

const [url, output] = process.argv.slice(2)
if (!url || !output) throw new Error('Usage: node scripts/measure-performance.ts <url> <output.json>')

const browser = new Browser()
await browser.command('open')
const cdp = await browser.instrument()
const version = await cdp.send('Browser.getVersion')
await cdp.send('Page.enable')
const results = []
try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    for (let run = 1; run <= 3; run++) {
      await browser.command('open', 'about:blank')
      await browser.command('set', 'viewport', String(viewport.width), String(viewport.height))
      await cdp.send('Network.clearBrowserCache')
      await cdp.send('Network.enable')
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 93_750,
      })
      const observer = await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
        const metrics = { lcp: 0, cls: 0, sessionValue: 0, sessionStart: 0, lastShift: 0 }
        Object.assign(window, { measuredVitals: metrics })
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) metrics.lcp = entry.startTime
        }).observe({ type: 'largest-contentful-paint', buffered: true })
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.hadRecentInput) continue
            if (entry.startTime - metrics.lastShift > 1000 || entry.startTime - metrics.sessionStart > 5000) {
              metrics.sessionStart = entry.startTime
              metrics.sessionValue = 0
            }
            metrics.sessionValue += entry.value
            metrics.lastShift = entry.startTime
            metrics.cls = Math.max(metrics.cls, metrics.sessionValue)
          }
        }).observe({ type: 'layout-shift', buffered: true })
      })()` })
      await browser.command('open', url)
      await setTimeout(3000)
      const metrics = await browser.evaluate<Record<string, number>>(`(() => {
        const scripts = performance.getEntriesByType('resource')
          .filter((entry) => entry.initiatorType === 'script')
        const vitals = window.measuredVitals
        return {
          lcpMs: vitals.lcp, cls: vitals.cls,
          scriptEncodedBytes: scripts.reduce((sum, entry) => sum + entry.encodedBodySize, 0),
          scriptDecodedBytes: scripts.reduce((sum, entry) => sum + entry.decodedBodySize, 0),
        }
      })()` )
      results.push({ viewport, run, ...metrics })
      await cdp.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: observer.identifier })
    }
  }
  await writeFile(output, JSON.stringify({
    url, browser: version.product, automation: 'agent-browser', cpuSlowdown: 4, latencyMs: 150,
    downloadBytesPerSecond: 200_000, cache: 'disabled', sampleAfterLoadMs: 3000, results,
  }, null, 2) + '\n')
} finally {
  cdp.close()
  await browser.command('close')
}
