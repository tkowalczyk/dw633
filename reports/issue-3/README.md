# Zadanie #3: gotowy HTML strony głównej

Data: 6.09.2026. [Zakres zadania](https://github.com/tkowalczyk/dw633/issues/3) wykonano i sprawdzono lokalnie na gałęzi `main`. Wersja wyjściowa: `a7fdb3b`. Raport opisuje implementację i lokalne kontrole przed wdrożeniem. Stan publikacji zapisujemy w issue #3.

`GET /` zwraca 200 i pełną treść. Vite wstawia wynik `renderHome()` do dokumentu podczas budowania, a ten sam mechanizm działa w serwerze developerskim. Skrypt przeglądarkowy uruchamia interakcje na istniejących elementach. Użyto mechanizmu [transformIndexHtml w Vite](https://vite.dev/guide/api-plugin.html#transformindexhtml); testy gotowego buildu korzystają z [lokalnego podglądu Pages](https://developers.cloudflare.com/pages/functions/local-development/).

Zachowano H1 „DW633 przyjazna pieszym”, wszystkie sekcje, dane, linki i animację ruchu. Tytuł, opis meta oraz początek opisu lokalizacji odpowiadają kryteriom zadania. Open Graph i Twitter używają tego samego tytułu i opisu. Link orientacyjny przystanków i dalsze wyjaśnienie celu pozostają na stronie.

Bez JavaScriptu opisy odcinka są widoczne kolejno pod schematem. Współrzędne jego punktów powstają podczas buildu; biblioteka `svg-path-properties` nie trafia do pakietu przeglądarkowego. Menu na telefonie pokazuje także „Działania”, wcześniej ukrywane przez CSS.

## TDD i kontrola

Założenia zapisano w komentarzu przed pierwszym testem: wejściem są istniejące, typowane dane publiczne i żądanie `/` bez parametrów. Wyjściem jest kompletny dokument HTML z kodem 200. Kontrola obejmuje wyłączony i opóźniony JS, dwa rozmiary okna oraz ograniczenie ruchu. Nowe podstrony, 404, Search Console i publikacja mają osobne zadania.

| Cykl | Zaobserwowane RED | Wynik GREEN |
|---|---|---|
| Pełna treść | HTML zawierał pusty `#app`, brakowało H1 | Pełne sekcje, nawigacja, tabela i źródła bez wykonania JS |
| Metadane | Tytuł odpowiadał wcześniejszej wersji | Dokładny tytuł i opis z zadania, spójne metadane |
| Lokalny opis | Pierwszy akapit miał wcześniejszą treść | Nowy opis z gminą Nieporęt i zachowanym linkiem przystanków |
| Opisy bez JS | Na telefonie opis Jodłowej był ukryty | Wszystkie opisy widoczne, działają klawiatura i odnośniki |
| Schemat bez JS | Brak położenia znaczników, błąd do 813,8 jednostki SVG | Odchylenie od geometrii przeglądarki mniejsze niż 0,5 jednostki |
| Interakcje i menu | Na telefonie nie można było wybrać „Działania” | Wszystkie pięć kotwic działa; uruchomienie JS zachowuje element `main` i jego treść |

Pierwsza kontrola, przed późniejszym poleceniem zmiany narzędzi, używała npm i Playwright. Zakończyła się powodzeniem: lint, 19 testów Vitest, TypeScript, build i 7 testów Playwright. Po doprecyzowaniu momentu wykonywania zrzutów ponownie przeszło wszystkich 7 testów przeglądarkowych. Testy sąsiadują z rendererem w `src/render-home.browser.test.ts`; nie używają atrap własnych modułów. W pierwszej wersji testu opóźnienie skryptu wymuszano na granicy sieci. Bieżący test wyłącza wykonywanie JS podczas ładowania, a następnie uruchamia rzeczywisty moduł produkcyjny i sprawdza zachowanie elementu `main` oraz jego treści. Na polecenie użytkownika zależności i testy przeniesiono następnie do pnpm oraz zainstalowanego agent-browser. Końcowe `pnpm check` przeszło przez lint, 19 testów Vitest, TypeScript, build i 7 testów uruchamianych przez agent-browser. Historyczne pomiary poniżej zachowano bez przeliczania.

Potwierdzono identyczny surowy HTML dla przeglądarki i żądania z nagłówkiem User-Agent ustawionym na Googlebot. Sprawdzono pojedynczy H1, język polski, jeden canonical, brak `noindex`, wszystkie istniejące kotwice i działanie natywnych elementów rozwijanych. Tabela pozostaje domyślnie zwinięta, a jej dane znajdują się w odpowiedzi HTTP.

Przy 390 × 844 i 1440 × 900 px nie stwierdzono poziomego przepełnienia. Sprawdzono z JS, bez JS i z ograniczeniem ruchu. Obejrzano pierwszy ekran, schemat oraz karty ze źródłami. Kontrola `agent-browser` nie wykazała błędów ani komunikatów konsoli. Odczyt serwera Vite i podglądu Pages potwierdził kod 200, H1, tabelę i wykaz źródeł.

Kontrola HTML oraz pakietu JS nie wykazała lokalnych ścieżek, katalogów prywatnej sprawy, adresów e-Doręczeń ani odnośników do prywatnej korespondencji. Publiczne dane nadal pochodzą wyłącznie z repozytorium strony.

## Porównanie wydajności

Pomiar wykonano w Chrome 152.0.7977.76 bez interfejsu okna, na lokalnym podglądzie Pages. Dla obu wersji zastosowano trzykrotne wejście w nowym kontekście, wyłączony cache, DPR 1, czterokrotne spowolnienie CPU, opóźnienie sieci 150 ms i pobieranie 200 000 B/s. Obserwatory LCP i CLS działały od początku dokumentu do trzech sekund po zdarzeniu `load`, bez przewijania. Poniżej mediany trzech prób.

| Wskaźnik | Przed | Po |
|---|---:|---:|
| LCP, 390 × 844 | 668 ms | 576 ms |
| LCP, 1440 × 900 | 656 ms | 568 ms |
| CLS, oba rozmiary | 0 | 0 |
| Pobrana treść skryptów po kompresji | 12 614 B | 923 B |
| Skrypty po rozpakowaniu | 39 673 B | 1 987 B |

LCP w tych próbach był niższy, a transfer skryptów zmalał o około 93%. Wnioskujemy, że pomogło przeniesienie treści do HTML i zmniejszenie pracy skryptu przy starcie. To krótki pomiar lokalny z naturalnym rozrzutem wyników, bez danych rzeczywistych użytkowników. HTML wzrósł z 2 584 do 55 384 B, ponieważ zawiera teraz treść; spadek rozmiaru JS nie jest równoważny spadkowi całego transferu strony.

Surowe wyniki: [przed](before-performance.json), [po](after-performance.json). Skrypt: [measure-performance.ts](../../scripts/measure-performance.ts). Powtórzenie pomiaru dla uruchomionego podglądu:

```bash
pnpm exec node scripts/measure-performance.ts http://127.0.0.1:8788/ wynik.json
```

## Zrzuty

| Tryb | Telefon: początek i odcinek | Komputer: początek i odcinek |
|---|---|---|
| JS włączony | [Początek](screenshots/js-390-start.png), [odcinek](screenshots/js-390-route.png) | [Początek](screenshots/js-1440-start.png), [odcinek](screenshots/js-1440-route.png) |
| JS wyłączony | [Początek](screenshots/no-js-390-start.png), [opisy](screenshots/no-js-390-route.png) | [Początek](screenshots/no-js-1440-start.png), [opisy](screenshots/no-js-1440-route.png) |
| Ograniczenie ruchu | [Początek](screenshots/reduced-390-start.png), [schemat](screenshots/reduced-390-route.png) | [Początek](screenshots/reduced-1440-start.png), [schemat](screenshots/reduced-1440-route.png) |

## Kontrola po zmianie narzędzi

Przeniesiony skrypt pomiarowy sprawdzono przez agent-browser 0.36.0 z jego Chrome 147.0.7727.50. Trzy próby dla każdego rozmiaru dały mediany LCP 600 ms i 604 ms, CLS 0 oraz transfer JS 923 B po kompresji. To osobna kontrola skryptu, na innej wersji przeglądarki niż historyczne porównanie przed i po zmianie. [Surowe wyniki](agent-browser-performance.json).

Projekt Pages `dw633` używa `pnpm build`, a środowiska produkcyjne i podglądowe mają `PNPM_VERSION=11.25.0` oraz `NODE_VERSION=22.18.0`. Zapis odczytano ponownie przez API. Instrukcje w issues #1–#8 i `AGENTS.md` wskazują pnpm oraz zainstalowany agent-browser.
