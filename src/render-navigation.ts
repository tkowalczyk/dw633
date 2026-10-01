export function renderNavigation(page: 'home' | 'walk' | 'traffic' | 'documents'): string {
  const home = page === 'home'
  return `
  <a class="skip-link" href="#tresc">Przejdź do treści</a>

  <header class="site-header">
    <a class="site-brand" href="${home ? '#start' : '/'}" aria-label="DW633: strona główna">
      <span class="site-brand__route">633</span>
      <span>Bezpieczeństwo pieszych</span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" hidden>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <span>Menu</span>
    </button>
    <nav id="site-navigation" aria-label="Główna nawigacja">
      <a href="${home ? '' : '/'}#odcinek">Odcinek</a>
      <a href="${home ? '' : '/'}#dane">Dane</a>
      <a href="${home ? '' : '/'}#dzialania">Działania</a>
      <a href="${home ? '' : '/'}#zrodla">Źródła</a>
      <a href="/chodnik-stanislawow-pierwszy/"${page === 'walk' ? ' aria-current="page"' : ''}>Chodnik i przejścia</a>
      <a href="/ruch-i-wypadki-dw633/"${page === 'traffic' ? ' aria-current="page"' : ''}>Ruch i zdarzenia</a>
      <a href="/dokumenty-dw633/"${page === 'documents' ? ' aria-current="page"' : ''}>Dokumenty</a>
      <a href="/chodnik-stanislawow-pierwszy/#faq">FAQ</a>
    </nav>
  </header>
  `
}
