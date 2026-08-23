import { describe, expect, it } from 'vitest'
import indexSource from '../index.html?raw'
import { kppTotals, siteData, trafficScale } from './site-data'
import mainSource from './main.ts?raw'

describe('dane publicznej strony DW633', () => {
  it('sumuje roczne dane KPP do 35 kolizji, 3 wypadków i 38 zdarzeń', () => {
    expect(kppTotals).toEqual({ collisions: 35, accidents: 3, total: 38 })
  })

  it('uwzględnia późniejsze doprecyzowanie KPP bez podtrzymywania bezwarunkowej zapowiedzi analizy', () => {
    expect(siteData.asOf).toBe('23 sierpnia 2026 r.')
    expect(siteData.kppIntro).toContain('4 osoby ranne')
    expect(siteData.pedestrianEntries[1].description).toContain(
      'obrażenia lub rozstrój zdrowia trwały powyżej siedmiu dni',
    )
    expect(siteData.initiative).toContainEqual(
      expect.objectContaining({
        date: 'po 20.08.2026',
        title: 'KPP doprecyzowała zakres swoich działań',
        confirmed: expect.stringContaining('na wniosek zarządcy drogi'),
      }),
    )
    expect(siteData.nextSteps[1].description).toContain('MZDW i Marszałka')
    expect(JSON.stringify(siteData)).not.toContain(
      'czy KPP wykonała zapowiedzianą analizę i przekazała wnioski',
    )
  })

  it('zachowuje zakres GPR 2025 i wartość 15 753 pojazdów na dobę', () => {
    expect(siteData.traffic.dailyVehicles).toBe(15_753)
    expect(siteData.traffic.caveat).toContain('km 9,678–15,885')
    expect(siteData.traffic.caveat).toContain('skalę ruchu w średniej dobowej')
  })

  it('przelicza średnią dobową na około 10,9 pojazdu na minutę', () => {
    expect(trafficScale.averagePerMinute).toBeCloseTo(10.94, 2)
    expect(trafficScale.averageSecondsBetween).toBeCloseTo(5.48, 2)
  })

  it('wybiera godziny szkolne do pierwszej obserwacji pieszych', () => {
    expect(siteData.traffic.observationWindows.map((window) => window.label)).toEqual([
      '7:00–9:00',
      '14:00–16:00',
    ])
    expect(siteData.traffic.scenarioCaveat).toContain('Sprawdzimy wtedy dojścia')
    expect(siteData.traffic.scenarioCaveat).toContain('czas oczekiwania')
  })

  it('prowadzi narrację od celu i działania zamiast od asekuracyjnych zastrzeżeń', () => {
    const visibleCopy = `${JSON.stringify(siteData)} ${mainSource}`
    const defensivePhrases = [
      'Nie przesądzamy dziś',
      'Piesi są symbolem obecności, nie liczbą',
      'schemat, nie mapa',
      'nie dowodzi „czarnego punktu”',
    ]

    expect(defensivePhrases.filter((phrase) => visibleCopy.includes(phrase))).toEqual([])
  })

  it('podaje lokalizację Przyleśnej w Google Maps jako pomoc orientacyjną', () => {
    expect(siteData.hero.lead.locationUrl).toBe(
      'https://www.google.com/maps/search/?api=1&query=Przystanek+Przyle%C5%9Bna%2C+Stanis%C5%82aw%C3%B3w+Pierwszy',
    )
    expect(mainSource).toContain('class="hero__map-link"')
    expect(mainSource).toContain('aria-label="Przyleśna — pokaż w Google Maps"')
  })

  it('zbiera opublikowane aktualizacje z Facebooka w rozszerzalnej liście', () => {
    expect(siteData.updates.items).toHaveLength(3)
    expect(siteData.updates.items.map((update) => update.url)).toEqual([
      'https://www.facebook.com/groups/1759173624939954/permalink/2287523548771623/',
      'https://www.facebook.com/groups/1759173624939954/permalink/2293366984853946/',
      'https://www.facebook.com/groups/1759173624939954/permalink/2296400137883964/',
    ])
    expect(mainSource).toContain('siteData.updates.items.map(renderSocialUpdate)')
    expect(mainSource).toContain('target="_blank" rel="noreferrer"')
  })

  it('ma komplet metadanych dla dużego podglądu w mediach społecznościowych', () => {
    expect(indexSource).toContain('property="og:image" content="https://dw633.pl/og.png"')
    expect(indexSource).toContain('property="og:image:width" content="1200"')
    expect(indexSource).toContain('property="og:image:height" content="630"')
    expect(indexSource).toContain('name="twitter:card" content="summary_large_image"')
    expect(indexSource).toContain('name="twitter:image" content="https://dw633.pl/og.png"')
    expect(indexSource).toContain('property="og:image:alt"')
    expect(indexSource).toContain('name="twitter:image:alt"')
  })

  it('podłącza favicon, ikonę Apple i manifest aplikacji', () => {
    expect(indexSource).toContain('href="/favicon.ico"')
    expect(indexSource).toContain('href="/favicon-32.png"')
    expect(indexSource).toContain('href="/favicon-16.png"')
    expect(indexSource).toContain('href="/apple-touch-icon.png"')
    expect(indexSource).toContain('href="/site.webmanifest"')
  })

  it('zwija opis danych i animacji, pozostawiając źródło na wierzchu', () => {
    const detailsStart = mainSource.indexOf('<details class="traffic__details">')
    const detailsEnd = mainSource.indexOf('</details>', detailsStart)
    const sourcePosition = mainSource.indexOf('${sourceLink(siteData.traffic.sourceId)}')
    const explanationPosition = mainSource.indexOf(
      '<p class="traffic__interval">Średnia dobowa',
    )

    expect(detailsStart).toBeGreaterThan(0)
    expect(detailsEnd).toBeGreaterThan(detailsStart)
    expect(sourcePosition).toBeGreaterThan(0)
    expect(sourcePosition).toBeLessThan(detailsStart)
    expect(explanationPosition).toBeGreaterThan(detailsStart)
    expect(explanationPosition).toBeLessThan(detailsEnd)
  })

  it('ma źródło dla każdego punktu schematu i wpisu chronologii', () => {
    const sourceIds = new Set(siteData.sources.map((source) => source.id))
    const referencedIds = [
      ...siteData.route.points.map((point) => point.sourceId),
      ...siteData.initiative.map((event) => event.sourceId),
    ]

    expect(referencedIds.every((sourceId) => sourceIds.has(sourceId))).toBe(true)
  })

  it('prowadzi bezpośrednio do placówek zamiast do zbiorczego wykazu przedszkoli', () => {
    const placeLinks = siteData.sources.flatMap((source) => source.links ?? [])

    expect(placeLinks).toContainEqual({
      label: 'Jodłowy Zakątek',
      url: 'https://jodlowyzakatek.edu.pl/kontakt/',
    })
    expect(placeLinks).toContainEqual({
      label: 'Modelowe Przedszkole',
      url: 'https://www.modelowaedukacja.eu/przedszkole',
    })
    expect(placeLinks.some((link) => link.url === 'https://nieporet.pl/przedszkola')).toBe(
      false,
    )
  })

  it('nie wystawia publicznego URL dla prywatnej odpowiedzi KPP i rejestru doręczeń', () => {
    const privateSources = siteData.sources.filter((source) =>
      ['kpp-response', 'delivery-register'].includes(source.id),
    )

    expect(privateSources).toHaveLength(2)
    expect(
      privateSources.every(
        (source) => source.url === undefined && source.links === undefined,
      ),
    ).toBe(true)
  })

  it('nie uruchamia animacji przewijania przy systemowym ograniczeniu ruchu', () => {
    expect(mainSource).toContain("matchMedia('(prefers-reduced-motion: reduce)')")
    expect(mainSource).toContain('if (!reduceMotion.matches)')
    expect(mainSource).toContain('positionRouteElements(reduceMotion.matches ? 0.5 : 0)')
  })
})
