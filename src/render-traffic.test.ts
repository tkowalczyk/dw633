import { describe, expect, it } from 'vitest'
import { renderHome } from './render-home.ts'
import { renderTraffic } from './render-traffic.ts'
import { siteData } from './site-data.ts'

// Real public HTML is the interface. Counts are nonnegative integers; edits are
// editorial changes, not runtime input. Restore each fixture after rendering.
// Both the visible totals and prose must follow the same annual record.
describe('wspólne dane ruchu i zdarzeń', () => {
  it('pokazuje zera dla pustego zestawienia i roku bez zdarzeń', () => {
    const original = siteData.kppByYear
    try {
      for (const rows of [[], [{ label: '2020', shortLabel: '2020', collisions: 0, accidents: 0 }]]) {
        siteData.kppByYear = rows
        const home = renderHome()
        const traffic = renderTraffic()
        expect(home).toContain('<strong>0</strong><span>zdarzeń razem</span>')
        expect(traffic).toContain('<tfoot><tr><th scope="row">Razem</th><td>0</td><td>0</td><td>0</td>')
        expect(home).not.toMatch(/NaN|Infinity/)
      }
    } finally {
      siteData.kppByYear = original
    }
  })

  it('aktualizuje wartość GPR, przeliczenia i tempo animacji po zmianie średniej dobowej', () => {
    const original = siteData.traffic.dailyVehicles
    try {
      siteData.traffic.dailyVehicles = 28_800
      for (const html of [renderHome(), renderTraffic()]) {
        const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
        expect(text).toContain('28 800')
        expect(text).toMatch(/(?:≈|około) 20 pojazdów/)
        expect(text).toMatch(/co (?:około )?3 sekundy/)
        expect(text).not.toMatch(/15 753|10,9|≈ 11|5,5/)
      }
      const home = renderHome()
      const cars = (home.match(/class="traffic__car traffic__car--/g) || []).length
      const duration = Number(home.match(/--stream-duration: ([\d.]+)s/)?.[1])
      expect(duration / cars).toBeCloseTo(3, 2)
    } finally {
      siteData.traffic.dailyVehicles = original
    }
  })

  it('aktualizuje skrót głównej i tabelę po zmianie jednego roku', () => {
    const row = siteData.kppByYear[0]
    const original = { ...row }
    try {
      row.collisions = 42
      row.accidents = 2
      const home = renderHome()
      const traffic = renderTraffic()
      expect(home).toContain('<strong>72</strong><span>kolizji</span>')
      expect(home).toContain('<strong>5</strong><span>wypadki</span>')
      expect(home).toContain('<strong>77</strong><span>zdarzeń razem</span>')
      expect(traffic).toMatch(/<th scope="row">2020<\/th>\s*<td>42<\/td>\s*<td>2<\/td>\s*<td>44<\/td>/)
      expect(traffic).toContain('<tfoot><tr><th scope="row">Razem</th><td>72</td><td>5</td><td>77</td>')
      for (const html of [home, traffic]) {
        expect(html).not.toMatch(/38 (?:wpisów|zdarzeń)|35 kolizji|3 wypadki/)
      }
      expect(home).toContain('id="dane"')
      expect(home).toContain('href="/ruch-i-wypadki-dw633/#zdarzenia"')
      expect(home).not.toContain('<table>')
    } finally {
      Object.assign(row, original)
    }
  })
})
