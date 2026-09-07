import { renderNavigation } from './render-navigation.ts'
import { analysisLink, sourceAnchor } from './render-actions.ts'
import { siteData, type Source } from './site-data.ts'

function renderSource(source: Source, index: number): string {
  const title = source.url
    ? `<a href="${source.url}">${source.title}</a>`
    : `<span>${source.title}</span>`
  const links = source.links
    ?.map(link => `<a href="${link.url}">${link.label}</a>`)
    .join(', ')

  return `
    <li class="source-card" id="${sourceAnchor(source.id)}">
      <span class="source-card__number">${String(index + 1).padStart(2, '0')}</span>
      <div>
        <h3>${title}</h3>
        <p>${source.owner} · ${source.scope}</p>
        <small>Stan danych: ${source.asOf}. ${source.note}</small>
        ${links ? `<small class="source-card__links">Odnośniki: ${links}</small>` : ''}
        ${analysisLink(source.id)}
      </div>
    </li>
  `
}

export function renderDocuments(): string {
  return `
    ${renderNavigation('documents')}
    <main id="tresc" class="documents-page">
      <section class="section" aria-labelledby="documents-title">
        <p class="eyebrow">Stan na ${siteData.asOf}</p>
        <h1 id="documents-title">${siteData.documents.title}</h1>
        <p>${siteData.documents.intro}</p>
      </section>
      <section class="section" aria-labelledby="catalogue-title">
        <h2 id="catalogue-title">Katalog źródeł</h2>
        <ol class="source-list">${siteData.sources.map(renderSource).join('')}</ol>
      </section>
    </main>
    <footer>
      <p><strong>DW633 · Stanisławów Pierwszy</strong></p>
      <p>Stan informacji: ${siteData.asOf}</p>
      <a href="/">Wróć na stronę główną</a>
    </footer>
  `
}
