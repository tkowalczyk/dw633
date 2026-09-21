# Bezpieczeństwo pieszych na DW633

Publiczna strona o odcinku ul. Jana Kazimierza między rejonem przystanków „Przyleśna” a ul. Sonaty w Stanisławowie Pierwszym. Łączy dane o ruchu i zdarzeniach, historię działań, źródła oraz kolejne aktualizacje publikowane dla mieszkańców.

![Podgląd strony udostępnianej w mediach społecznościowych](public/og.png)

Docelowy adres: [dw633.pl](https://dw633.pl/)

## Co zawiera strona

- schemat badanego odcinka i najważniejszych miejsc;
- obraz skali ruchu drogowego wraz z animacją dwukierunkowego ruchu i pieszych;
- dane GPR 2025 oraz zestawienie zdarzeń przekazane przez KPP Legionowo;
- chronologię dotychczasowych działań i listę następnych kroków;
- źródła oraz rozwijaną listę aktualizacji z Facebooka;
- komplet metadanych Open Graph, ikon i manifest dla urządzeń mobilnych.

Strona jest statyczna. Nie ma backendu, formularzy, analityki ani trackerów.

## Uruchomienie lokalne

Wymagany jest Node.js 22.18 lub nowszy, pnpm 11.25.0 oraz zainstalowany `agent-browser` z Chrome (sprawdzono wersję 0.36.0 CLI).

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Vite wyświetli lokalny adres, zwykle `http://localhost:5173/`.

## Kontrola i build

```bash
pnpm check
```

Testy korzystają z polecenia `agent-browser` dostępnego w PATH. Nie instalują osobnego narzędzia do sterowania przeglądarką.

Kontrola obejmuje lint, testy Vitest, TypeScript, produkcyjny build oraz testy przeglądarkowe. Skrypt uruchamia lokalny podgląd Cloudflare Pages na porcie 8788, testy przez zainstalowany `agent-browser` i zamyka sesje po kontroli. Zrzuty trafiają do `test-results/agent-browser/`. CDP własnej sesji służy wyłącznie do wyłączenia JS, opóźnienia skryptu i pomiarów wydajności. Wynik buildu znajduje się w `dist/`. Podgląd gotowego buildu:

```bash
pnpm exec wrangler pages dev dist
```

Ten podgląd odtwarza obsługę błędnych adresów przez hosting. `pnpm dev` i `pnpm preview` służą do pracy z Vite; nie potwierdzają reguł 404 w Pages.

## Aktualizacja treści

Treści, liczby, oś czasu, punkty schematu, źródła i lista wpisów z Facebooka znajdują się w `src/site-data.ts`. Nowy wpis można dodać do `siteData.updates.items`, podając datę, tytuł, krótki opis i publiczny permalink.

Pozostałe pliki mają rozdzielone role:

- `src/render-home.ts`: HTML głównej z trzema najnowszymi wydarzeniami i położeniem punktów schematu;
- `src/render-walk.ts`: podstrona chodnika z pełną historią, stanem wniosków i aktualizacjami;
- `src/render-actions.ts` i `src/render-navigation.ts`: wspólne renderowanie wydarzeń, źródeł i nawigacji;
- `vite.config.ts`: wstawianie treści do dokumentu podczas budowania i pracy serwera lokalnego;
- `src/main.ts`: interakcje na istniejącym dokumencie;
- `src/style.css`: układ, style responsywne i wariant `prefers-reduced-motion`;
- `src/site-data.test.ts`: kontrola liczb, linków, metadanych oraz granic publikacji;
- `src/render-home.browser.test.ts`: kontrola odpowiedzi HTTP, metadanych, klawiatury i treści z JS oraz bez JS;
- `404.html` i `404.browser.test.ts`: strona błędu oraz testy statusów HTTP, powrotu bez JS i sitemapy;
- `public/`: Open Graph, favicony, manifest i nagłówki dla hostingu.

Po zmianie danych lub metadanych zawsze uruchom `pnpm check`.

Treść strony znajduje się w pierwszej odpowiedzi HTML. Bez JS opisy odcinka są widoczne kolejno pod schematem. Przy włączonych interakcjach zachowana jest prezentacja sterowana przewijaniem. Raport pierwszej zmiany sposobu renderowania, pomiary i zrzuty: [zadanie #3](reports/issue-3/README.md).

Build tworzy także `dist/404.html`. Pages serwuje ten dokument z kodem 404 dla nieznanych ścieżek. Komunikat i link powrotu pochodzą z `siteData.notFound`; strona korzysta ze wspólnego CSS i działa bez JS. `pnpm check` sprawdza też błędny adres zagnieżdżony, dostępność zasobów i brak błędów w sitemapie. Wyniki lokalne: [zadanie #4](reports/issue-4/README.md).

Build tworzy `/chodnik-stanislawow-pierwszy/` z osobnymi metadanymi i wpisem w sitemapie. Treść wstępu i pytań pochodzi z `siteData.walk`, a data stanu, chronologia, terminy i aktualizacje z dotychczasowych rekordów. `initiative` zachowuje kolejność od najstarszego wydarzenia do najnowszego, także przy datach przybliżonych lub równych. Główna pokazuje trzy ostatnie rekordy w odwrotnej kolejności. Nowy tekst i testy: `src/render-walk.*`; wyniki kontroli: [zadanie #5](reports/issue-5/README.md).

## Publikacja w Cloudflare Pages

Repozytorium jest gotowe do wdrożenia przez integrację Git w Cloudflare Pages:

| Ustawienie | Wartość |
|---|---|
| Repozytorium | `tkowalczyk/dw633` |
| Gałąź produkcyjna | `main` |
| Framework preset | `Vite` |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Zmienna `PNPM_VERSION` | `11.25.0` |
| Zmienna `NODE_VERSION` | `22.18.0` |

Projekt Pages `dw633` jest połączony z repozytorium, a domena `dw633.pl` jest już skonfigurowana. Push do `main` uruchamia wdrożenie produkcyjne. Po zakończeniu buildu sprawdź opublikowany HTML i numer commita w Pages.

Dokumentacja Cloudflare: [Build image i wersje narzędzi](https://developers.cloudflare.com/pages/configuration/build-image/) · [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/) · [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)

## Granice publikacji

- Schemat odcinka służy orientacji; dystans około 1 km pochodzi z pomocniczego pomiaru OSM.
- W repozytorium nie umieszczamy podpisanych pism, dowodów e-Doręczeń ani skanów zawierających dane prywatne.
- Odpowiedzi KPP, MZDW, UMWM i Gminy oraz rejestr wysyłki są opisane na stronie tylko w zakresie przeznaczonym do publicznej komunikacji.

Stan danych widoczny na stronie: 21 września 2026 r.
