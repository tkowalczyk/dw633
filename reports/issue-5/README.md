# Zadanie #5: podstrona chodnika i przejść

Kontrola lokalna z 6.09.2026, na gałęzi `main`, po commicie `67a897e`. Raport opisuje implementację przed wdrożeniem. Wynik produkcji wymaga osobnej kontroli po publikacji.

`/chodnik-stanislawow-pierwszy/` zawiera dziewięć wydarzeń, sześć aktualizacji z permalinkami, datę stanu i odpowiedzi na trzy pytania z issue. Wnioski o dokumenty i działania są opisane osobno. Dane pozostają według stanu z 2.09.2026; implementacja nie dopisuje ustaleń o drodze.

Na głównej zachowano `#dzialania`, trzy najnowsze wydarzenia oraz link „Historia działań i odpowiedzi instytucji”. Oba widoki korzystają z tych samych rekordów i funkcji renderowania wydarzeń. Pełna lista aktualizacji znajduje się na podstronie.

## Przebieg TDD

Założenia zapisano przed RED w `src/render-walk.browser.test.ts`: statyczny GET, działanie bez JS, kolejność wydarzeń z danych, trzy najnowsze na głównej i brak nowych ustaleń terenowych. Testy powstawały kolejno, po przejściu poprzedniego cyklu.

| Zachowanie | RED | GREEN |
|---|---|---|
| Wejście i odświeżenie | 404 zamiast 200 | Vite tworzy osobny dokument pod nowym adresem |
| Pełna treść | Brak daty stanu i historii | Treść z publicznego `siteData` |
| Wspólny rekord w obu widokach | Główna zawierała 9 wydarzeń zamiast 3 | Skrót, pełna lista i zmiana statusu korzystają z jednego źródła |
| Metadane | Brak tytułu | Unikalny tytuł, opis, canonical, Open Graph i Twitter |
| Menu i sitemap | Brak linku w menu | Działające odnośniki i jeden nowy canonical w XML |
| Czytelność bez JS | Podstrona używała domyślnej czcionki Times | Wspólny CSS, układ tekstu i widoczna nawigacja |

Po przeniesieniu aktualizacji stary test sprawdzający tekst implementacji głównej wymagał zmiany. Sprawdza teraz wynikowy HTML podstrony i permalinki. Osobny test obejmuje pustą historię i listę krótszą niż trzy wydarzenia.

## Wyniki

`pnpm install --frozen-lockfile` zakończyło się powodzeniem. `pnpm check` przeszło: lint, 21 testów Vitest, TypeScript, build i 16 testów HTTP oraz agent-browser na podglądzie Pages.

- Bezpośrednie żądanie i ponowny GET nowej podstrony: 200 z gotowym HTML. Odświeżenie w przeglądarce zachowuje stronę przy wyłączonym JS.
- Jeden H1 i canonical `https://dw633.pl/chodnik-stanislawow-pierwszy/`. Unikalny opis i zgodne metadane udostępniania.
- Wszystkie lokalne linki z obu stron zwracają 200, a kotwice mają cel. Podstrona odsyła do `/#dane` i `/#zrodla`. Brak odnośników do przyszłych podstron.
- Klawiatura pozwala wejść z głównej, przejść do danych i źródeł oraz wrócić na główną. Skrót do treści i widoczny fokus działają bez JS.
- Przy 390 × 844 i 1440 × 900 px menu mieści się w oknie, a dokument nie ma poziomego przepełnienia. Lista błędów JS jest pusta.
- Dotychczasowe testy głównej i 404 przeszły, w tym opóźniony JS oraz ograniczenie animacji.

Oprócz testu jednostkowego tymczasowo zmieniono datę i status ostatniego wydarzenia w pliku danych. Rzeczywisty build umieścił nową datę i status w obu dokumentach. Źródło odtworzono bajt w bajt, a końcowy `pnpm check` zbudował oryginalne dane. W wyniku nie ma markerów próbnej zmiany.

## Kontrola wizualna

Obejrzano wszystkie osiem zrzutów bez JS: pierwszy ekran, stan wniosków, początek chronologii i aktualizacje, w obu rozmiarach.

| Widok | 390 × 844 | 1440 × 900 |
|---|---|---|
| Pierwszy ekran | [Telefon](walk-no-js-390-start.png) | [Komputer](walk-no-js-1440-start.png) |
| Stan wniosków | [Telefon](walk-no-js-390-waiting-title.png) | [Komputer](walk-no-js-1440-waiting-title.png) |
| Chronologia | [Telefon](walk-no-js-390-history-title.png) | [Komputer](walk-no-js-1440-history-title.png) |
| Aktualizacje | [Telefon](walk-no-js-390-updates-title.png) | [Komputer](walk-no-js-1440-updates-title.png) |

Kontrola treści zachowała rozróżnienie zawiadomień o terminie i odpowiedzi merytorycznych oraz potwierdzenie przejść na obu końcach. Nowy opis nie zapowiada budowy. Prywatne źródła nadal są opisami bez adresów do skanów.
