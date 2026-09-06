# Kontrola strony 404

6.09.2026 wykonano lokalnie [zadanie #4](https://github.com/tkowalczyk/dw633/issues/4) na gałęzi `main`. Raport opisuje kontrolę przed wdrożeniem.

Vite tworzy `404.html` ze wspólnym CSS i tekstem z `siteData.notFound`. Dokument zawiera komunikat „Nie znaleziono strony” i zwykły link „Wróć na stronę główną”. Działa bez JavaScriptu i nie ma canonical do głównej. Dodanie pliku w katalogu głównym buildu uruchamia [obsługę 404 w Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/).

## Testy TDD

Założenia i granice testów zapisano przed pierwszym RED w `404.browser.test.ts`.

1. Test nieznanego adresu wykazał `200 !== 404`. Po dodaniu strony błędu oba adresy zwróciły 404 z komunikatem, bez przekierowania.
2. Test bez JS wykazał brak linku powrotu. Po dodaniu linku i wspólnego CSS przeszedł dla 390 × 844 oraz 1440 × 900 px. Sprawdził widoczność, fokus klawiatury, przejście na główną i brak poziomego przepełnienia.
3. Kolejno dodano kontrole istniejących adresów i sitemapy. Obie przeszły bez dalszych zmian w aplikacji.

`pnpm install --frozen-lockfile` oraz `pnpm check` zakończyły się powodzeniem. Pełna kontrola objęła lint, 19 testów Vitest, TypeScript, build i 11 testów HTTP oraz agent-browser. Siedem dotychczasowych testów strony głównej nadal przechodzi. Sesje przeglądarki i lokalny serwer zostały zamknięte.

## Odpowiedzi lokalnego Pages

Adres bazowy: `http://127.0.0.1:8788`. Podgląd: Wrangler 4.129.0, domyślna data zgodności 2026-09-03.

| Ścieżka | HTTP | Treść |
|---|---|---|
| `/seo-test-brak-20260906/` | 404 | Komunikat błędu |
| `/seo-test-brak-20260906/zagniezdzony/` | 404 | Komunikat błędu |
| `/` | 200 | Pełna strona główna |
| `/robots.txt` | 200 | Reguły i adres sitemapy |
| `/sitemap.xml` | 200 | Jeden URL: `https://dw633.pl/` |
| `/assets/style-CY1Ic692.css` | 200 | CSS |
| `/assets/index-Dh5Hoycm.js` | 200 | JavaScript |

Sitemap pomija stronę 404 i adresy testowe. Obejrzano [zrzut telefonu](404-no-js-390.png) oraz [zrzut komputera](404-no-js-1440.png). Oba pokazują stronę bez JS, z zaznaczonym linkiem powrotu.

Kontrolę można powtórzyć przez `pnpm check`. Wyniki dotyczą lokalnego Pages; po wdrożeniu trzeba sprawdzić statusy na domenie produkcyjnej.
