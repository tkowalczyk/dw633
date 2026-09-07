import { renderNavigation } from './render-navigation.ts'
import { siteData } from './site-data.ts'
import { renderInitiativeEvent, renderSocialUpdate, sourceLink } from './render-actions.ts'

export function renderWalk(): string {
  return `
    ${renderNavigation('walk')}
    <main id="tresc" class="walk-page">
      <section class="section" aria-labelledby="walk-title">
        <p class="eyebrow">Stan na ${siteData.asOf}</p>
        <h1 id="walk-title">${siteData.walk.title}</h1>
        <p>${siteData.walk.intro}</p>
      </section>
      ${siteData.walk.questions.map((question, index) => `
        <section class="section" aria-labelledby="question-${index}">
          <h2 id="question-${index}">${question.title}</h2>
          ${question.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}
          ${question.sourceIds.map(id => sourceLink(id)).join('')}
        </section>
      `).join('')}
      <section class="section" aria-labelledby="waiting-title">
        <h2 id="waiting-title">${siteData.walk.waiting.title}</h2>
        <h3>${siteData.walk.waiting.documents}</h3>
        <p>${siteData.nextSteps[0].description}</p>
        <p>${siteData.walk.waiting.note}</p>
        ${['umwm-extension', 'mzdw-extension', 'gmina-extension'].map(id => sourceLink(id)).join('')}
        <h3>${siteData.walk.waiting.actions}</h3>
        <p>${siteData.nextSteps[1].description}</p>
        ${sourceLink('kpp-response')}
      </section>
      <section class="history section" id="dzialania" aria-labelledby="history-title">
        <div class="section-heading">
          <p class="eyebrow">Chronologia inicjatywy</p>
          <h2 id="history-title">Historia działań i odpowiedzi instytucji</h2>
        </div>
        <ol class="history-list">${siteData.initiative.map(renderInitiativeEvent).join('')}</ol>
        <div class="updates" aria-labelledby="updates-title">
          <div class="updates__heading">
            <div><p class="eyebrow">Aktualizacje</p><h3 id="updates-title">Rozmowa i kolejne kroki</h3></div>
            <p>${siteData.updates.intro}</p>
          </div>
          <ol class="update-list">${siteData.updates.items.map(renderSocialUpdate).join('')}</ol>
        </div>
      </section>
      <section class="next section" aria-labelledby="next-title">
        <div class="section-heading">
          <h2 id="next-title">Co dalej</h2>
          <p>${siteData.nextIntro}</p>
        </div>
        <ol class="next-list">${siteData.nextSteps.slice(2).map((step, index) => `
          <li><span>${String(index + 1).padStart(2, '0')}</span><div><h3>${step.title}</h3><p>${step.description}</p></div></li>
        `).join('')}</ol>
      </section>
    </main>
    <footer>
      <p><strong>DW633 · Stanisławów Pierwszy</strong></p>
      <p>Stan informacji: ${siteData.asOf}</p>
      <a href="/">Wróć na stronę główną</a>
    </footer>
  `
}
