export function renderNavigation(home: boolean): string {
  return `
  <a class="skip-link" href="#tresc">Przejdź do treści</a>

  <header class="site-header">
    <a class="site-brand" href="${home ? '#start' : '/'}" aria-label="DW633: strona główna">
      <span class="site-brand__route">633</span>
      <span>Bezpieczeństwo pieszych</span>
    </a>
    <nav aria-label="Główna nawigacja">
      <a href="${home ? '' : '/'}#odcinek">Odcinek</a>
      <a href="${home ? '' : '/'}#dane">Dane</a>
      <a href="${home ? '' : '/'}#dzialania">Działania</a>
      <a href="${home ? '' : '/'}#zrodla">Źródła</a>
      <a href="/chodnik-stanislawow-pierwszy/"${home ? '' : ' aria-current="page"'}>Chodnik i przejścia</a>
    </nav>
  </header>
  `
}
