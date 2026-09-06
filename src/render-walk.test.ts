import { describe, expect, it } from 'vitest'
import { renderHome } from './render-home.ts'
import { renderWalk } from './render-walk.ts'
import { siteData } from './site-data.ts'

// Render the public HTML with real records, no mocked internal modules.
// Array order is editorial chronology (dates may be approximate or tied).
// Empty or short history remains valid. Every temporary change is restored.
function history(html: string): string[] {
  return [...html.matchAll(/<li class="history-card">[\s\S]*?<\/li>/g)].map(match => match[0])
}

describe('historia działań w obu widokach', () => {
  it('zachowuje krótką i pustą historię bez powielania wydarzeń', () => {
    const original = siteData.initiative
    try {
      for (const events of [original.slice(-2), []]) {
        siteData.initiative = events
        expect(history(renderHome())).toHaveLength(events.length)
        expect(history(renderWalk())).toHaveLength(events.length)
        expect(siteData.initiative).toEqual(events)
      }
    } finally {
      siteData.initiative = original
    }
  })

  it('pokazuje trzy najnowsze wydarzenia na głównej i aktualizuje oba widoki po zmianie jednego rekordu', () => {
    const latest = siteData.initiative.at(-1)!
    const original = { ...latest }
    const originalAsOf = siteData.asOf
    try {
      Object.assign(latest, {
        date: '10.09.2026', status: 'Test zmiany statusu',
        confirmed: 'Test zmiany opisu odpowiedzi.', pending: 'Test zmiany następnego kroku.',
      })
      siteData.asOf = '10 września 2026 r.'
      const home = renderHome()
      const walk = renderWalk()
      expect(history(home)).toHaveLength(3)
      expect(history(walk)).toHaveLength(siteData.initiative.length)
      for (const html of [home, walk]) {
        for (const text of [siteData.asOf, latest.date, latest.status, latest.confirmed, latest.pending]) {
          expect(html).toContain(text)
        }
      }
      expect(history(home).map(card => card.match(/<h3>(.*?)<\/h3>/)?.[1]))
        .toEqual(siteData.initiative.slice(-3).reverse().map(event => event.title))
      expect(home).toContain('id="dzialania"')
      expect(home).toContain('href="/chodnik-stanislawow-pierwszy/">Historia działań i odpowiedzi instytucji</a>')
      expect(home).not.toContain('class="update-list"')
    } finally {
      Object.assign(latest, original)
      siteData.asOf = originalAsOf
    }
  })
})
