import { kppTotals, siteData, trafficScale } from './site-data.ts'
import { sourceLink } from './render-actions.ts'
import { renderNavigation } from './render-navigation.ts'

export function renderTraffic(): string {
  const totals = kppTotals()
  return `
    ${renderNavigation('traffic')}
    <main id="tresc" class="traffic-page">
      <section class="section" aria-labelledby="traffic-page-title">
        <p class="eyebrow">Stan na ${siteData.asOf}</p>
        <h1 id="traffic-page-title">${siteData.trafficPage.title}</h1>
        <p>${siteData.trafficPage.intro}</p>
      </section>
      <section class="section" id="ruch" aria-labelledby="gpr-title">
        <h2 id="gpr-title">${siteData.trafficPage.gprTitle}</h2>
        <p><strong>${siteData.traffic.dailyVehicles.toLocaleString('pl-PL')} pojazdów na dobę</strong></p>
        <p>${siteData.traffic.caveat} ${siteData.trafficPage.gprScope}</p>
        ${sourceLink(siteData.traffic.sourceId)}
        <p>Średnio około ${Math.round(trafficScale.averagePerMinute)} pojazdów na minutę, czyli jeden co ${trafficScale.averageSecondsBetween.toLocaleString('pl-PL', { maximumFractionDigits: 1 })} sekundy.</p>
        <p>${siteData.trafficPage.gprExplanation}</p>
      </section>
      <section class="section" id="zdarzenia" aria-labelledby="events-title">
        <p class="eyebrow">Dane historyczne KPP · ${siteData.trafficPage.kppPeriod}</p>
        <h2 id="events-title">Kolizje i wypadki w kolejnych latach</h2>
        <p>${siteData.trafficPage.kppScope}</p>
        ${sourceLink('kpp-response')}
        <p>${siteData.trafficPage.categories}</p>
        ${sourceLink('event-categories')}
        <div class="data-table">
          <div class="table-scroll" tabindex="0" role="region" aria-label="Roczne dane KPP">
            <table>
              <caption>Dane SEWiK przekazane przez KPP Legionowo · ${siteData.trafficPage.kppPeriod}</caption>
              <thead><tr><th scope="col">Rok</th><th scope="col">Kolizje</th><th scope="col">Wypadki</th><th scope="col">Razem</th></tr></thead>
              <tbody>${siteData.kppByYear.map(year => `
                <tr>
                  <th scope="row">${year.label}</th>
                  <td>${year.collisions}</td>
                  <td>${year.accidents}</td>
                  <td>${year.collisions + year.accidents}</td>
                </tr>
              `).join('')}</tbody>
              <tfoot><tr><th scope="row">Razem</th><td>${totals.collisions}</td><td>${totals.accidents}</td><td>${totals.total}</td></tr></tfoot>
            </table>
          </div>
        </div>
        <h3>Korekta roku wypadku i osoby ranne</h3>
        <p>${siteData.kppIntro}</p>
        <p>${siteData.pedestrianCaveat}</p>
        <div class="pedestrian-events">
          <h3>Piesi w danych SEWiK</h3>
          <ul>${siteData.pedestrianEntries.map(entry => `
            <li><strong>${entry.category}</strong><span>${entry.description}</span></li>
          `).join('')}</ul>
        </div>
      </section>
    </main>
    <footer>
      <p><strong>DW633 · Stanisławów Pierwszy</strong></p>
      <p>Stan informacji: ${siteData.asOf}</p>
      <a href="/">Wróć na stronę główną</a>
    </footer>
  `
}
