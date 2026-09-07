import { siteData, type InitiativeEvent, type SocialUpdate } from './site-data.ts'

const sourceById = new Map(siteData.sources.map(source => [source.id, source]))

export function sourceAnchor(sourceId: string): string {
  return sourceId === 'kpp-response' ? 'kpp' : sourceId
}

export function analysisLink(sourceId: string): string {
  const reading = siteData.documents.readings.find(item => item.sourceIds.includes(sourceId))
  return reading ? `<a class="text-link" href="${reading.url}">${reading.label}</a>` : ''
}

export function sourceLink(sourceId: string, prefix = 'Źródło'): string {
  const source = sourceById.get(sourceId)

  if (!source) {
    throw new Error(`Brak źródła: ${sourceId}`)
  }

  const label = `${source.owner}, ${source.scope}; stan danych: ${source.asOf}`
  const linkedReferences = source.links
    ?.map((link) => `<a href="${link.url}">${link.label}</a>`)
    .join(', ')
  const content = source.url
    ? `<a href="${source.url}">${label}</a>`
    : `<span>${label}${linkedReferences ? ` (${linkedReferences})` : ''}</span>`

  return `<small class="source-note"><span>${prefix}:</span> ${content} · <a href="/dokumenty-dw633/#${sourceAnchor(sourceId)}">Opis źródła</a></small>`
}

export function renderInitiativeEvent(event: InitiativeEvent): string {
  return `
    <li class="history-card">
      <div class="history-card__date">${event.date}</div>
      <div>
        <p class="eyebrow">${event.status}</p>
        <h3>${event.title}</h3>
        <p>${event.confirmed}</p>
        <p class="history-card__pending"><strong>Następny krok:</strong> ${event.pending}</p>
        ${sourceLink(event.sourceId)}
        ${event.sourceId === 'kpp-response' ? analysisLink(event.sourceId) : ''}
      </div>
    </li>
  `
}

export function renderSocialUpdate(update: SocialUpdate, index: number): string {
  const number = String(index + 1).padStart(2, '0')

  return `
    <li class="update-card">
      <a href="${update.url}" target="_blank" rel="noreferrer" aria-label="Przeczytaj post ${index + 1} na Facebooku: ${update.title}">
        <span class="update-card__number" aria-hidden="true">${number}</span>
        <div>
          <h4>${update.title}</h4>
          <p>${update.description}</p>
          <span class="update-card__link">Przeczytaj post <span aria-hidden="true">↗</span></span>
        </div>
      </a>
    </li>
  `
}
