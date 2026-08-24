import './style.css'
import {
  kppTotals,
  siteData,
  trafficScale,
  type InitiativeEvent,
  type KnowledgeItem,
  type SocialUpdate,
  type Source,
} from './site-data'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Nie znaleziono elementu #app.')
}

const sourceById = new Map(siteData.sources.map((source) => [source.id, source]))
const averageVehiclesPerMinute = Math.round(trafficScale.averagePerMinute)
const trafficStreamDuration =
  trafficScale.averageSecondsBetween * averageVehiclesPerMinute
const trafficGapPattern = [3.2, 7.8, 4.4, 6.9, 2.9, 8.6, 5.1, 4.2, 7.4, 3.5, 6.3]
const trafficGapPatternTotal = trafficGapPattern.reduce((sum, gap) => sum + gap, 0)
const trafficDirections: Array<'forward' | 'reverse'> = [
  'forward',
  'forward',
  'reverse',
  'forward',
  'reverse',
  'reverse',
  'forward',
  'forward',
  'reverse',
  'forward',
  'reverse',
]
const averageSecondsBetween = trafficScale.averageSecondsBetween.toLocaleString(
  'pl-PL',
  { maximumFractionDigits: 1 },
)

function publicSourceUrl(sourceId: string): string {
  const source = sourceById.get(sourceId)

  if (!source?.url) {
    throw new Error(`Brak publicznego adresu źródła: ${sourceId}`)
  }

  return source.url
}

function renderTrafficStream(): string {
  return trafficGapPattern
    .map((_, index) => {
      const direction = trafficDirections[index]
      const directionIndex = trafficDirections
        .slice(0, index)
        .filter((item) => item === direction).length
      const directionTotal = trafficDirections.filter((item) => item === direction).length
      const staticPosition = 7 + (directionIndex * 86) / (directionTotal - 1)
      const offset =
        (trafficGapPattern.slice(0, index).reduce((sum, gap) => sum + gap, 0) /
          trafficGapPatternTotal) *
        trafficStreamDuration

      return `
      <span class="traffic__car traffic__car--${direction}" style="--vehicle-delay: -${offset.toFixed(3)}s; --static-x: ${staticPosition.toFixed(1)}%; --car-direction: ${direction === 'forward' ? 1 : -1}">
        <i class="traffic__car-shape"></i>
      </span>
    `
    })
    .join('')
}

function renderPedestrians(): string {
  return [
    { direction: 'down', delay: -2.5, left: 43, staticTop: 4, small: false },
    { direction: 'up', delay: -11.2, left: 51, staticTop: 78, small: true },
    { direction: 'down', delay: -19.6, left: 58, staticTop: 4, small: true },
    { direction: 'waiting-top', delay: -1.4, left: 38, staticTop: 4, small: false },
    { direction: 'waiting-bottom', delay: -0.6, left: 63, staticTop: 76, small: true },
  ]
    .map(
      (person) => `
        <span class="traffic__person traffic__person--${person.direction}${person.small ? ' traffic__person--small' : ''}" style="--person-delay: ${person.delay}s; --person-left: ${person.left}%; --person-static-top: ${person.staticTop}%">
          <i class="traffic__person-shape"></i>
        </span>
      `,
    )
    .join('')
}

function renderObservationWindows(): string {
  return siteData.traffic.observationWindows
    .map(
      (window) => `
        <span class="observation-window">
          <strong>${window.label}</strong>
          <small>${window.description}</small>
        </span>
      `,
    )
    .join('')
}

function sourceLink(sourceId: string, prefix = 'Źródło'): string {
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

  return `<small class="source-note"><span>${prefix}:</span> ${content}</small>`
}

function renderRoutePointLabels(): string {
  return siteData.route.points
    .map((point, index) => {
      const isLeft = index % 2 === 0
      const lineDirection = isLeft ? -1 : 1
      const textX = lineDirection * 58
      const textAnchor = isLeft ? 'end' : 'start'

      return `
        <g class="route-marker" data-progress="${point.progress}" aria-hidden="true">
          <line x1="0" y1="0" x2="${lineDirection * 42}" y2="0" />
          <circle r="8" />
          <text x="${textX}" y="-8" text-anchor="${textAnchor}">${point.shortLabel}</text>
          <text class="route-marker__kind" x="${textX}" y="14" text-anchor="${textAnchor}">${point.kind}</text>
        </g>
      `
    })
    .join('')
}

function renderRouteSteps(): string {
  return siteData.route.points
    .map(
      (point, index) => `
        <article class="route-step${index === 0 ? ' is-active' : ''}" data-route-step data-progress="${point.progress}" tabindex="0">
          <div class="route-step__card">
            <span class="route-step__index">${String(index + 1).padStart(2, '0')}</span>
            <p class="eyebrow">${point.kind}</p>
            <h3>${point.label}</h3>
            <p>${point.description}</p>
            ${sourceLink(point.sourceId)}
          </div>
        </article>
      `,
    )
    .join('')
}

function inflectCount(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}

function renderKppBars(): string {
  const maxEvents = Math.max(
    ...siteData.kppByYear.map((year) => year.collisions + year.accidents),
  )

  return siteData.kppByYear
    .map((year) => {
      const total = year.collisions + year.accidents
      const collisionsHeight = (year.collisions / maxEvents) * 100
      const accidentsHeight = (year.accidents / maxEvents) * 100

      return `
        <li class="chart-column" aria-label="${year.label}: ${inflectCount(year.collisions, 'kolizja', 'kolizji')}, ${inflectCount(year.accidents, 'wypadek', 'wypadków')}, razem ${total}">
          <span class="chart-column__total">${total}</span>
          <span class="chart-bar" aria-hidden="true">
            <span class="chart-bar__accidents" style="height: ${accidentsHeight}%"></span>
            <span class="chart-bar__collisions" style="height: ${collisionsHeight}%"></span>
          </span>
          <span class="chart-column__year">${year.shortLabel}</span>
        </li>
      `
    })
    .join('')
}

function renderKppRows(): string {
  return siteData.kppByYear
    .map(
      (year) => `
        <tr>
          <th scope="row">${year.label}</th>
          <td>${year.collisions}</td>
          <td>${year.accidents}</td>
          <td>${year.collisions + year.accidents}</td>
        </tr>
      `,
    )
    .join('')
}

function renderInitiativeEvent(event: InitiativeEvent): string {
  return `
    <li class="history-card">
      <div class="history-card__date">${event.date}</div>
      <div>
        <p class="eyebrow">${event.status}</p>
        <h3>${event.title}</h3>
        <p>${event.confirmed}</p>
        <p class="history-card__pending"><strong>Następny krok:</strong> ${event.pending}</p>
        ${sourceLink(event.sourceId)}
      </div>
    </li>
  `
}

function renderSocialUpdate(update: SocialUpdate, index: number): string {
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

function renderKnowledgeCard(item: KnowledgeItem): string {
  return `
    <li class="knowledge-card">
      <span class="knowledge-card__icon" aria-hidden="true">${item.type === 'known' ? '•' : '?'}</span>
      <div>
        <h4>${item.title}</h4>
        <p>${item.description}</p>
        ${item.sourceId ? sourceLink(item.sourceId) : ''}
      </div>
    </li>
  `
}

function renderSource(source: Source, index: number): string {
  const title = source.url
    ? `<a href="${source.url}">${source.title}</a>`
    : `<span>${source.title}</span>`
  const links = source.links
    ?.map((link) => `<a href="${link.url}">${link.label}</a>`)
    .join(', ')

  return `
    <li class="source-card">
      <span class="source-card__number">${String(index + 1).padStart(2, '0')}</span>
      <div>
        <h3>${title}</h3>
        <p>${source.owner} · ${source.scope}</p>
        <small>Stan danych: ${source.asOf}. ${source.note}</small>
        ${links ? `<small class="source-card__links">Odnośniki: ${links}</small>` : ''}
      </div>
    </li>
  `
}

app.innerHTML = `
  <a class="skip-link" href="#tresc">Przejdź do treści</a>

  <header class="site-header">
    <a class="site-brand" href="#start" aria-label="DW633: początek strony">
      <span class="site-brand__route">633</span>
      <span>Bezpieczeństwo pieszych</span>
    </a>
    <nav aria-label="Główna nawigacja">
      <a href="#odcinek">Odcinek</a>
      <a href="#dane">Dane</a>
      <a href="#dzialania">Działania</a>
      <a href="#zrodla">Źródła</a>
    </nav>
  </header>

  <main id="tresc">
    <section class="hero section" id="start" aria-labelledby="hero-title">
      <div class="hero__copy">
        <p class="eyebrow">${siteData.hero.eyebrow}</p>
        <h1 id="hero-title">${siteData.hero.title}</h1>
        <p class="hero__lead">${siteData.hero.lead.beforeLocation}<a class="hero__map-link" href="${siteData.hero.lead.locationUrl}" aria-label="Przyleśna — pokaż w Google Maps">${siteData.hero.lead.locationLabel}</a>${siteData.hero.lead.afterLocation}</p>
        <p class="hero__scope">${siteData.hero.scope}</p>
        <a class="text-link" href="#odcinek">Zobacz badany odcinek <span aria-hidden="true">↓</span></a>
      </div>
      <aside class="hero__snapshot" aria-label="Stan sprawy w skrócie">
        <p class="eyebrow">Stan na ${siteData.asOf}</p>
        <div class="hero__traffic-signal">
          <span>GPR 2025 · km 9,678–15,885</span>
          <strong>${siteData.traffic.dailyVehicles.toLocaleString('pl-PL')}</strong>
          <small>pojazdów na dobę · <a href="${publicSourceUrl(siteData.traffic.sourceId)}">źródło</a></small>
        </div>
        <div class="hero__watch">
          <span>Godziny pierwszej obserwacji pieszych</span>
          <div class="observation-windows">${renderObservationWindows()}</div>
          <div class="hero__timeline" aria-hidden="true">
            <span class="hero__timeline-window hero__timeline-window--morning"></span>
            <span class="hero__timeline-window hero__timeline-window--afternoon"></span>
          </div>
          <div class="hero__timeline-labels" aria-hidden="true"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>
          <small>${siteData.traffic.scenarioCaveat}</small>
        </div>
        <dl>
          ${siteData.hero.snapshot
            .map(
              (item) => `
                <div>
                  <dt>${item.label}</dt>
                  <dd>${item.value}</dd>
                </div>
              `,
            )
            .join('')}
        </dl>
      </aside>
    </section>

    <section class="traffic section" aria-labelledby="traffic-title">
      <div class="section-heading">
        <p class="eyebrow">Ruch na DW633</p>
        <h2 id="traffic-title">Co oznacza dobowe natężenie ruchu?</h2>
      </div>
      <div class="traffic__layout">
        <div class="traffic__equation">
          <div class="traffic__metric">
            <strong>${siteData.traffic.dailyVehicles.toLocaleString('pl-PL')}</strong>
            <span>pojazdów<br />na dobę</span>
          </div>
          <span class="traffic__equals" aria-hidden="true">=</span>
          <div class="traffic__metric traffic__metric--minute">
            <strong>≈ ${averageVehiclesPerMinute}</strong>
            <span>pojazdów<br />na minutę*</span>
          </div>
        </div>
        <div class="traffic__translation">
          <div class="traffic__scene-header">
            <div>
              <p class="eyebrow">Okna obserwacji pieszych</p>
              <div class="observation-windows">${renderObservationWindows()}</div>
            </div>
            <span>dwa kierunki · naturalnie nierówne odstępy</span>
          </div>
          <div class="traffic__stream" style="--stream-duration: ${trafficStreamDuration.toFixed(3)}s" aria-hidden="true">
            ${renderTrafficStream()}
            ${renderPedestrians()}
          </div>
          ${sourceLink(siteData.traffic.sourceId)}
          <details class="traffic__details">
            <summary>Opis danych i animacji</summary>
            <div class="traffic__details-content">
              <p class="traffic__interval">Średnia dobowa odpowiada jednemu pojazdowi co około ${averageSecondsBetween} sekundy. Rzeczywiste odstępy są nierówne — tak działa też animacja.</p>
              <p class="traffic__scenario-caveat">${siteData.traffic.scenarioCaveat}</p>
              <p>${siteData.traffic.caveat}</p>
            </div>
          </details>
        </div>
      </div>
    </section>

    <section class="route section section--wide" id="odcinek" aria-labelledby="route-title">
      <div class="section-heading section-heading--route">
        <p class="eyebrow">Odcinek Przyleśna–Sonaty</p>
        <h2 id="route-title">Przewiń, aby przejść przez badany fragment</h2>
        <p>${siteData.route.intro}</p>
      </div>

      <div class="route-scrolly" data-route-scrolly>
        <div class="route-visual" aria-label="Schemat badanego odcinka">
          <div class="route-visual__topline">
            <span>Północ · Sonaty</span>
            <span class="route-visual__badge">schemat odcinka</span>
          </div>
          <svg class="route-svg" viewBox="0 0 520 900" role="img" aria-labelledby="route-svg-title route-svg-desc">
            <title id="route-svg-title">Schemat odcinka DW633 od Przyleśnej do Sonaty</title>
            <desc id="route-svg-desc">Droga biegnie z południa na północ. Zaznaczono przejścia na obu końcach, przystanki Przyleśna, rejon placówek edukacyjnych i szkołę. Animowane pojazdy przedstawiają przeliczenie dobowej średniej GPR na około 11 pojazdów na minutę. Punkty ułożono w kolejności występowania na trasie.</desc>
            <defs>
              <filter id="road-shadow" x="-30%" y="-20%" width="160%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="12" flood-opacity="0.13" />
              </filter>
              <g id="route-car-shape">
                <rect class="ambient-car__body" x="-15" y="-8" width="30" height="16" rx="6" />
                <path class="ambient-car__window" d="M -8 -5.5 L -3 -5.5 L -3 5.5 L -8 5.5 L -11 3.5 L -11 -3.5 Z" />
                <path class="ambient-car__window" d="M 3 -5.5 L 8 -5.5 L 11 -3.5 L 11 3.5 L 8 5.5 L 3 5.5 Z" />
                <path class="ambient-car__roofline" d="M 0 -5.5 V 5.5" />
                <circle class="ambient-car__light" cx="13" cy="-4" r="1.1" />
                <circle class="ambient-car__light" cx="13" cy="4" r="1.1" />
              </g>
            </defs>
            <path id="route-line" class="route-road" d="M 274 830 C 238 690, 302 570, 270 440 C 238 315, 292 200, 264 70" pathLength="1" />
            <path class="route-progress" d="M 274 830 C 238 690, 302 570, 270 440 C 238 315, 292 200, 264 70" pathLength="1" />
            <path class="route-centerline" d="M 274 830 C 238 690, 302 570, 270 440 C 238 315, 292 200, 264 70" pathLength="1" />
            <g class="route-traffic-stat route-traffic-stat--daily" aria-hidden="true" transform="translate(24 132)">
              <rect width="168" height="112" rx="18" />
              <text class="route-traffic-stat__label" x="16" y="25">GPR 2025</text>
              <text class="route-traffic-stat__value" x="16" y="69">15 753</text>
              <text class="route-traffic-stat__unit" x="16" y="94">pojazdy / dobę</text>
            </g>
            <g class="route-traffic-stat route-traffic-stat--minute" aria-hidden="true" transform="translate(348 326)">
              <rect width="148" height="112" rx="18" />
              <text class="route-traffic-stat__label" x="16" y="25">ŚREDNIA 24 H*</text>
              <text class="route-traffic-stat__value" x="16" y="69">≈ ${averageVehiclesPerMinute}</text>
              <text class="route-traffic-stat__unit" x="16" y="94">pojazdów / min</text>
            </g>
            ${renderRoutePointLabels()}
            <g class="route-traveler" data-route-traveler aria-hidden="true">
              <circle class="route-traveler__halo" r="22" />
              <circle class="route-traveler__core" r="8" />
            </g>
            <g class="ambient-car ambient-car--north-one" aria-hidden="true"><use href="#route-car-shape" /></g>
            <g class="ambient-car ambient-car--south-one" aria-hidden="true"><use href="#route-car-shape" /></g>
            <g class="ambient-car ambient-car--north-two" aria-hidden="true"><use href="#route-car-shape" /></g>
            <g class="ambient-car ambient-car--south-two" aria-hidden="true"><use href="#route-car-shape" /></g>
          </svg>
          <div class="route-visual__footer">
            <span>Południe · Przyleśna</span>
            <span>około 1 km**</span>
          </div>
          <div class="route-visual__notes">
            <p class="route-visual__note">* Tempo aut odpowiada dobowej średniej 10,9 pojazdu na minutę dla odcinka GPR km 9,678–15,885. <a href="${publicSourceUrl('gpr-2025')}">GPR 2025</a>.</p>
            <p class="route-visual__note">** Długość według geometrii OSM: ok. 996,9 m. © autorzy OpenStreetMap, <a href="https://www.openstreetmap.org/copyright">ODbL</a>.</p>
          </div>
        </div>

        <div class="route-steps" aria-label="Punkty na badanym odcinku">${renderRouteSteps()}</div>
      </div>
    </section>

    <section class="kpp section" id="dane" aria-labelledby="kpp-title">
      <div class="section-heading">
        <p class="eyebrow">Dane KPP Legionowo · 1.01.2020–18.08.2026</p>
        <h2 id="kpp-title">Kolizje i wypadki to dwie różne kategorie</h2>
        <p>${siteData.kppIntro}</p>
        ${sourceLink('kpp-response')}
      </div>

      <div class="kpp-totals" aria-label="Łączne dane KPP">
        <div><strong>${kppTotals.collisions}</strong><span>kolizji</span></div>
        <div><strong>${kppTotals.accidents}</strong><span>wypadki</span></div>
        <div class="kpp-totals__all"><strong>${kppTotals.total}</strong><span>zdarzeń razem</span></div>
      </div>

      <div class="chart-card">
        <div class="chart-legend" aria-hidden="true">
          <span><i class="legend-dot legend-dot--collision"></i> kolizje</span>
          <span><i class="legend-dot legend-dot--accident"></i> wypadki</span>
        </div>
        <ul class="chart" aria-label="Liczba kolizji i wypadków w kolejnych latach">${renderKppBars()}</ul>
      </div>

      <details class="data-table">
        <summary>Pełna tabela danych rocznych</summary>
        <div class="table-scroll" tabindex="0">
          <table>
            <caption>Dane SEWiK przekazane przez KPP Legionowo</caption>
            <thead><tr><th scope="col">Rok</th><th scope="col">Kolizje</th><th scope="col">Wypadki</th><th scope="col">Razem</th></tr></thead>
            <tbody>${renderKppRows()}</tbody>
            <tfoot><tr><th scope="row">Razem</th><td>${kppTotals.collisions}</td><td>${kppTotals.accidents}</td><td>${kppTotals.total}</td></tr></tfoot>
          </table>
        </div>
      </details>

      <div class="pedestrian-events">
        <div>
          <p class="eyebrow">Piesi w danych SEWiK</p>
          <h3>Dwa wpisy wymagają osobnej analizy</h3>
        </div>
        <ul>
          ${siteData.pedestrianEntries
            .map(
              (entry) => `
                <li><strong>${entry.category}</strong><span>${entry.description}</span></li>
              `,
            )
            .join('')}
        </ul>
        <p>${siteData.pedestrianCaveat}</p>
      </div>
    </section>

    <section class="history section" id="dzialania" aria-labelledby="history-title">
      <div class="section-heading">
        <p class="eyebrow">Chronologia inicjatywy</p>
        <h2 id="history-title">Co już się wydarzyło i jaki jest następny krok</h2>
      </div>
      <ol class="history-list">${siteData.initiative.map(renderInitiativeEvent).join('')}</ol>
      <div class="updates" aria-labelledby="updates-title">
        <div class="updates__heading">
          <div>
            <p class="eyebrow">Aktualizacje</p>
            <h3 id="updates-title">Rozmowa i kolejne kroki</h3>
          </div>
          <p>${siteData.updates.intro}</p>
        </div>
        <ol class="update-list">${siteData.updates.items.map(renderSocialUpdate).join('')}</ol>
      </div>
    </section>

    <section class="knowledge section" aria-labelledby="knowledge-title">
      <div class="section-heading">
        <p class="eyebrow">Stan wiedzy</p>
        <h2 id="knowledge-title">Co wiemy / czego potrzebujemy</h2>
      </div>
      <div class="knowledge-grid">
        <div>
          <h3 class="knowledge-grid__title">Co wiemy</h3>
          <ul>${siteData.knowledge.known.map(renderKnowledgeCard).join('')}</ul>
        </div>
        <div>
          <h3 class="knowledge-grid__title">Czego potrzebujemy</h3>
          <ul>${siteData.knowledge.unknown.map(renderKnowledgeCard).join('')}</ul>
        </div>
      </div>
      <aside class="limits" aria-label="Jak czytać dane">
        <strong>${siteData.limits.title}</strong>
        <p>${siteData.limits.description}</p>
      </aside>
    </section>

    <section class="next section" aria-labelledby="next-title">
      <div class="section-heading">
        <p class="eyebrow">Najbliższe kroki</p>
        <h2 id="next-title">Co dalej</h2>
        <p>${siteData.nextIntro}</p>
      </div>
      <ol class="next-list">
        ${siteData.nextSteps
          .map(
            (step, index) => `
              <li><span>${String(index + 1).padStart(2, '0')}</span><div><h3>${step.title}</h3><p>${step.description}</p></div></li>
            `,
          )
          .join('')}
      </ol>
    </section>

    <section class="sources section" id="zrodla" aria-labelledby="sources-title">
      <div class="section-heading">
        <p class="eyebrow">Dokumenty i dane pierwotne</p>
        <h2 id="sources-title">Źródła</h2>
        <p>Publiczne źródła są podlinkowane poniżej. Materiały zawierające dane prywatne przechowujemy w dokumentacji sprawy.</p>
      </div>
      <ol class="source-list">${siteData.sources.map(renderSource).join('')}</ol>
    </section>
  </main>

  <footer>
    <p><strong>DW633 · Stanisławów Pierwszy</strong></p>
    <p>Stan informacji: ${siteData.asOf} Stronę aktualizujemy wraz z kolejnymi odpowiedziami i ustaleniami.</p>
    <a href="#start">Wróć na początek <span aria-hidden="true">↑</span></a>
  </footer>
`

function positionRouteElements(progress: number): void {
  const path = document.querySelector<SVGPathElement>('#route-line')
  const traveler = document.querySelector<SVGGElement>('[data-route-traveler]')

  if (!path || !traveler) return

  const pathLength = path.getTotalLength()
  const travelerPoint = path.getPointAtLength(pathLength * progress)
  traveler.setAttribute('transform', `translate(${travelerPoint.x} ${travelerPoint.y})`)

  document.querySelectorAll<SVGGElement>('.route-marker').forEach((marker) => {
    const markerProgress = Number(marker.dataset.progress)
    const point = path.getPointAtLength(pathLength * markerProgress)
    marker.setAttribute('transform', `translate(${point.x} ${point.y})`)
  })
}

function setupRouteScroll(): void {
  const scrolly = document.querySelector<HTMLElement>('[data-route-scrolly]')
  const steps = Array.from(document.querySelectorAll<HTMLElement>('[data-route-step]'))
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let animationFrame = 0

  const update = (): void => {
    if (!scrolly) return

    const rect = scrolly.getBoundingClientRect()
    const scrollableDistance = Math.max(rect.height - window.innerHeight, 1)
    const progress = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1)
    scrolly.style.setProperty('--route-progress', progress.toString())
    positionRouteElements(progress)

    let activeStep = steps[0]
    let closestDistance = Number.POSITIVE_INFINITY

    steps.forEach((step) => {
      const stepRect = step.getBoundingClientRect()
      const distance = Math.abs(stepRect.top + stepRect.height / 2 - window.innerHeight / 2)
      if (distance < closestDistance) {
        closestDistance = distance
        activeStep = step
      }
    })

    steps.forEach((step) => step.classList.toggle('is-active', step === activeStep))
  }

  const scheduleUpdate = (): void => {
    cancelAnimationFrame(animationFrame)
    animationFrame = requestAnimationFrame(update)
  }

  positionRouteElements(reduceMotion.matches ? 0.5 : 0)

  if (!reduceMotion.matches) {
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    scheduleUpdate()
  }

  steps.forEach((step) => {
    step.addEventListener('focus', () => {
      steps.forEach((candidate) => candidate.classList.toggle('is-active', candidate === step))
      if (!reduceMotion.matches) {
        positionRouteElements(Number(step.dataset.progress))
      }
    })
  })
}

setupRouteScroll()
