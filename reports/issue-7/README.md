# Zadanie #7: katalog dokumentów DW633

Kontrola lokalna z 7.09.2026 na `main`, po commicie `e37b9d2`. Powstała podstrona `/dokumenty-dw633/` z 15 opisami źródeł i odsyłaczami do opracowań. Przypisy na głównej i podstronach prowadzą do konkretnych pozycji. Sekcja `/#zrodla` zawiera krótkie objaśnienie i link do katalogu.

Zmiany są lokalne. Nie wykonano commita, pusha ani wdrożenia i nie zmieniono stanu issue #7. Dane o drodze zachowują datę 2.09.2026. Publiczne rekordy źródeł, w tym ich własne daty, pozostały bez zmian.

## Przebieg TDD

Założenia zapisano przed pierwszym RED w `src/render-documents.browser.test.ts`. Wejściem są publiczne rekordy z `site-data.ts`, a wynikiem gotowy HTML. Brak załącznika przy źródle niepublicznym jest zamierzony. Test renderera obejmuje zmianę nazwy, daty i ograniczenia oraz pustą listę źródeł; każdą zmianę odtwarza.

| Zachowanie | RED | GREEN |
|---|---|---|
| Wejście i metadane | 404 zamiast 200 | Gotowy katalog, własny H1, title, opis, canonical i og:url |
| Opisy źródeł | Brak kotwic kart | Stabilne identyfikatory, w tym `#kpp`, i zgodność wszystkich pól |
| Przypisy i menu | Brak odsyłacza do katalogu | Wszystkie strony połączone; bezpośrednie źródła przy twierdzeniach zachowane |
| Przejście KPP | Brak linku z chronologii do tabeli | Chronologia → tabela → opis KPP → tabela, także klawiaturą bez JS |
| Czytelność | Za duży nagłówek na komputerze | Rozmiary nagłówków zgodne z pozostałymi podstronami |
| Powrót do opracowań | Odsyłacz tylko przy KPP | Każdy z 15 opisów prowadzi do swojego kontekstu |
| Sitemap | Trzy adresy zamiast czterech | Jedna lista w Vite wyznacza wejścia HTML oraz wpisy XML |

Kontrola wariantów URL przeszła bez dodatkowych reguł przekierowań. Siedem wariantów, w tym `/index.html` oraz podstrony bez ukośnika i z `/index.html`, zwraca 308 i docelowo 200 pod własnym canonical. Jest to zachowanie lokalnego Pages, zgodne z [dokumentacją obsługi stron](https://developers.cloudflare.com/pages/configuration/serving-pages/).

Pierwszy pełny przebieg miał 28/29 testów HTTP i przeglądarkowych. Starszy test głównej oczekiwał tytułów wszystkich źródeł w miejscu przeniesionego katalogu. Sprawdza teraz objaśnienie i link na głównej; test nowej podstrony porównuje komplet rekordów. [Pierwszy przebieg](check-first-run.txt) zachowano obok wyniku końcowego.

## Wyniki kontroli

`pnpm install --frozen-lockfile` i końcowe `pnpm check` przeszły: lint, 26 testów Vitest, TypeScript, build oraz 29 testów HTTP i agent-browser. [Końcowy zapis check](check.txt). Lokalne ścieżki środowiska w obu logach zastąpiono oznaczeniem repozytorium.

[Raport odsyłaczy](internal-links.json) obejmuje 65 unikalnych odsyłaczy w obrębie każdej z czterech stron oraz strony błędu. Wszystkie cele zwracają 200, każda wskazana kotwica istnieje. [Kontrola 14 odsyłaczy zewnętrznych](external-links.json) potwierdziła 200 po przekierowaniach. Jest to kontrola dostępności dotychczasowych źródeł, bez nowych ustaleń o drodze.

Sitemap zawiera dokładnie cztery adresy kanoniczne, bez kotwic, 404, dawnych propozycji ścieżek i `lastmod`. Lista zgadza się z wygenerowanymi dokumentami HTML. Każda strona ma jeden własny canonical; katalog ma unikalny opis.

[Lista plików buildu](build-files.json) i odsyłacze nie zawierają prywatnych załączników. Pięć niepublicznych źródeł ma opisy oraz linki do opracowań. Wszystkie 15 kart zachowuje nazwę, właściciela, zakres, datę i ograniczenie publicznego rekordu.

## Zrzuty i treść

Obejrzano 12 zrzutów przy wyłączonym JS. Nawigacja, odświeżenie i powrót działają z klawiatury. Menu i karty mieszczą się w oknie; brak poziomego przepełnienia. Kotwica KPP pozostawia nagłówek karty poniżej stałego menu.

| Widok | 390 × 844 | 1440 × 900 |
|---|---|---|
| Początek | [Telefon](documents-no-js-390-start.png) | [Komputer](documents-no-js-1440-start.png) |
| Pierwsze źródła | [Telefon](documents-no-js-390-event-categories.png) | [Komputer](documents-no-js-1440-event-categories.png) |
| Placówki | [Telefon](documents-no-js-390-school-area.png) | [Komputer](documents-no-js-1440-school-area.png) |
| KPP | [Telefon](documents-no-js-390-kpp.png) | [Komputer](documents-no-js-1440-kpp.png) |
| MZDW | [Telefon](documents-no-js-390-mzdw-extension.png) | [Komputer](documents-no-js-1440-mzdw-extension.png) |
| Ostatnie źródło i stopka | [Telefon](documents-no-js-390-accident-date-check.png) | [Komputer](documents-no-js-1440-accident-date-check.png) |

Preflight `trust-advisor`: gotowe. Odbiorca może sprawdzić pochodzenie informacji i przejść do opracowania. Opisy odróżniają publiczne źródła od prywatnej korespondencji. Nie powstały nowe twierdzenia o zdarzeniach, inwestycjach ani terminach. Nowa odpowiedź lub korekta instytucji wymagałaby aktualizacji źródeł.

Audyt redakcyjny: powtarzane „Zobacz” jest etykietą nawigacji i pozostaje. Nowe opisy nie wprowadzają niewyjaśnionych terminów; DW633 określa temat strony. Nowe akapity i opis meta mają średnio 9,29 słowa na zdanie, maksimum 13, bez zdań ponad 25 słów. [Pomiar prostego języka](plain-language.json). Zachowano dotychczasowe brzmienie rekordów wymagane przez issue.

| Tekst | Sloplint PL | Burstiness | TTR | Powtórzenia trigramów |
|---|---|---|---|---|
| [Nowe opisy i etykiety](nowe-opisy.txt) | 6/100 | 0,48 | 0,62 | 0,11 |
| [Tekst katalogu](tekst-podstrony.txt) | 9/100 | 0,59 | 0,54 | 0,18 |

Linter nie wskazał trafień. Powtórzenia obejmują nazwy instytucji, daty i wspólne etykiety linków. Nie usuwano ich dla punktacji. Wyniki dotyczą treści lokalnej; kontroli na domenie produkcyjnej jeszcze nie wykonano.
