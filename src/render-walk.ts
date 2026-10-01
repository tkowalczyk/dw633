import { renderNavigation } from './render-navigation.ts'
import { siteData } from './site-data.ts'
import { renderInitiativeEvent, renderSocialUpdate, sourceAnchor, sourceLink } from './render-actions.ts'

export function renderWalk(): string {
  return `
    ${renderNavigation('walk')}
    <main id="tresc" class="walk-page">
      <section class="section" aria-labelledby="walk-title">
        <p class="eyebrow">Stan na ${siteData.asOf}</p>
        <h1 id="walk-title">${siteData.walk.title}</h1>
        <p>${siteData.walk.intro}</p>
      </section>
      <section class="section faq" id="faq" aria-labelledby="faq-title">
        <h2 id="faq-title">${siteData.walk.faqTitle}</h2>
        <p>${siteData.walk.faqIntro}</p>
        <div class="faq__list">
          ${siteData.walk.questions.map(question => `
            <details class="faq__item" id="faq-${question.id}">
              <summary>${question.title}</summary>
              <div class="faq__answer">
                ${question.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}
                <div class="faq__sources">
                  <p>Źródła odpowiedzi:</p>
                  <ul>${question.sources.map(source => `<li><a href="/dokumenty-dw633/#${sourceAnchor(source.sourceId)}">${source.label}</a></li>`).join('')}</ul>
                </div>
              </div>
            </details>
          `).join('')}
        </div>
      </section>
      <section class="section" aria-labelledby="waiting-title">
        <h2 id="waiting-title">${siteData.walk.waiting.title}</h2>
        <h3>${siteData.walk.waiting.documents}</h3>
        <p>${siteData.nextSteps[0].description}</p>
        <p>${siteData.walk.waiting.note}</p>
        ${['umwm-extension-2', 'mzdw-documents', 'gmina-extension'].map(id => sourceLink(id)).join('')}
        <h3 class="section-subheading">${siteData.walk.waiting.actions}</h3>
        <p>${siteData.nextSteps[1].description}</p>
        ${sourceLink('umwm-inspection')}
        ${sourceLink('mzdw-sidewalk')}
        ${sourceLink('gmina-actions')}
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
