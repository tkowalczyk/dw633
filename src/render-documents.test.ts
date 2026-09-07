import { describe, expect, it } from 'vitest'
import { renderDocuments } from './render-documents.ts'
import { siteData } from './site-data.ts'

// Real public records, including sources with no public attachment. Stable ids
// survive title/date changes. Restore mutations; an empty catalogue is valid.
describe('katalog dokumentów', () => {
  it('przy każdym źródle wskazuje opracowanie, w którym czytelnik znajdzie jego kontekst', () => {
    const cards = [...renderDocuments().matchAll(/<li class="source-card"[^>]*>[\s\S]*?<\/li>/g)].map(match => match[0])
    for (const card of cards) {
      expect(card).toMatch(/href="\/(?:#odcinek|chodnik-stanislawow-pierwszy\/#dzialania|ruch-i-wypadki-dw633\/#(?:ruch|zdarzenia))"/)
    }
  })

  it('zachowuje komplet rekordów i stabilne kotwice także po zmianie opisu', () => {
    const kpp = siteData.sources.find(source => source.id === 'kpp-response')!
    const original = { ...kpp }
    const sources = siteData.sources
    try {
      kpp.title = 'Zmieniona nazwa źródła'
      kpp.asOf = 'Test zmiany daty'
      kpp.note = 'Test zmiany ograniczenia.'
      const html = renderDocuments()
      const cards = [...html.matchAll(/<li class="source-card"[^>]*>[\s\S]*?<\/li>/g)].map(match => match[0])
      expect(cards).toHaveLength(sources.length)
      sources.forEach((source, index) => {
        const card = cards[index]
        const anchor = source.id === 'kpp-response' ? 'kpp' : source.id
        expect(card).toContain(`id="${anchor}"`)
        for (const text of [source.title, source.owner, source.scope, source.asOf, source.note]) {
          expect(card).toContain(text)
        }
        for (const url of [source.url, ...source.links?.map(link => link.url) || []].filter(Boolean)) {
          expect(card).toContain(`href="${url}"`)
        }
        if (!source.url && !source.links?.length) {
          expect(card).not.toMatch(/href="(?!\/(?:ruch-i-wypadki-dw633|chodnik-stanislawow-pierwszy)\/)/)
        }
      })
      siteData.sources = []
      expect(renderDocuments()).not.toContain('class="source-card"')
    } finally {
      Object.assign(kpp, original)
      siteData.sources = sources
    }
  })
})
