# Zadanie #6: ruch, kolizje i wypadki

Kontrola lokalna z 7.09.2026 na `main`, po commicie `82186f1`. Implementacja jest gotowa do przeglądu. Nie wykonano commita, pusha ani wdrożenia; issue pozostaje otwarte.

Nowy adres `/ruch-i-wypadki-dw633/` udostępnia GPR, tabelę roczną KPP pod `#zdarzenia`, korektę roku i informacje o pieszych. Tabela jest widoczna bez rozwijania i bez JavaScriptu. Główna zachowuje `#dane`, sumy, wykres roczny, zakres danych, animację ruchu oraz link do pełnej tabeli.

Stan informacji o drodze pozostaje z 2.09.2026. Wykorzystano publiczne rekordy projektu. Objaśnienie kategorii uzupełnia odczytana 7.09.2026 [strona Wydziału Ruchu Drogowego KSP](https://ksp.policja.gov.pl/wrd/sprawy/informacje-dla-obywateli/zdarzenia-drogowe/119593,ZDARZENIA-DROGOWE.html). Źródło jest przy definicjach; kwalifikacja lokalnych wpisów pochodzi z KPP Legionowo.

## Przebieg TDD

Założenia zapisano przed pierwszym RED w `src/render-traffic.browser.test.ts`. Testy obejmują publiczny HTML, odświeżenie, dane, metadane, linki, klawiaturę i dwa rozmiary ekranu. Kolejny test powstawał po przejściu poprzedniego cyklu.

| Zachowanie | RED | GREEN |
|---|---|---|
| Bezpośrednie wejście | 404 zamiast 200 | Osobny dokument generowany przez Vite |
| Metadane | Brak tytułu | Własny title, opis, canonical i metadane udostępniania |
| Dane roczne | Brak tabeli i kotwicy | Pełna tabela, okres KPP, GPR i źródła |
| Zmiana roku | Skrót zachowywał wcześniejsze sumy | Sumowanie przy renderowaniu obu widoków; opisy korzystają ze wspólnych wartości |
| Zmiana GPR | W przeliczeniach pozostawały wcześniejsze liczby | Przeliczenia i tempo sceny wynikają z aktualnej wartości dobowej |
| Rok bez zdarzeń | Wysokości słupków zawierały NaN | Zera i pusta lista dają prawidłowe sumy |
| Kategorie i piesi | Brak objaśnień oraz wpisów na podstronie | Definicje ze źródłem i dotychczasowe publiczne informacje o pieszych |
| Nawigacja | Brak pozycji w menu | „Ruch i zdarzenia”, linki i jeden nowy adres w sitemapie |
| Czytelność bez JS | Domyślna czcionka Times | Wspólny CSS, dostępna tabela i widoczny fokus |

Test tempa sceny sprawdza odstęp wynikający z liczby wyświetlanych pojazdów i czasu obiegu. Samo porównanie zmienionej długości animacji nie wystarczało. Dla obecnego GPR tempo pozostaje takie jak wcześniej.

Pierwsze pełne sprawdzenie zakończyło się wynikiem 21/22 w testach HTTP i przeglądarkowych. Starszy test głównej oczekiwał etykiety wiersza tabeli, która została przeniesiona. Sprawdza teraz okres danych widoczny przy skrócie. Test podstrony sprawdza wszystkie wiersze, w tym częściowy rok 2026. Końcowa kontrola przeszła w całości.

## Wyniki

`pnpm install --frozen-lockfile` oraz `pnpm check` przeszły: lint, 24 testy Vitest, TypeScript, build i 22 testy HTTP oraz agent-browser. [Zapis check](check.txt) zawiera wynik lokalnego podglądu Pages.

Tymczasowo zmieniono jeden rok na 42 kolizje i 2 wypadki, po czym wykonano rzeczywisty build. Oba dokumenty pokazały sumy 72, 5 i 77, a tabela prawidłowy wiersz roczny. Źródło odtworzono bajt w bajt; końcowy build zawiera ponownie 35 kolizji, 3 wypadki i 38 zdarzeń. [Zapis próby](shared-record-build.json).

Bezpośredni GET i odświeżenie dają 200. Testy potwierdzają jeden H1, unikalne metadane, wszystkie lokalne linki i kotwice oraz pojedynczy wpis nowego canonical w sitemapie. Istniejące testy głównej, 404 i podstrony chodnika również przeszły. Kontrola nie mierzy indeksacji ani pozycji w Google.

## Kontrola wizualna i treści

Obejrzano dziewięć zrzutów podstrony bez JS. Przy 390 × 844 i 1440 × 900 px menu i tekst mieszczą się w oknie. Na telefonie tabela przewija się we własnym obszarze, także klawiaturą. Nagłówki kolumn i wierszy mają atrybut `scope`; tabela ma podpis, a obszar przewijania nazwę dostępną dla czytnika ekranu.

| Widok | Telefon | Komputer |
|---|---|---|
| Pierwszy ekran | [390 px](traffic-no-js-390-traffic-page-title.png) | [1440 px](traffic-no-js-1440-traffic-page-title.png) |
| GPR | [390 px](traffic-no-js-390-gpr-title.png) | [1440 px](traffic-no-js-1440-gpr-title.png) |
| Tabela | [Początek](traffic-no-js-390-table.png), [prawa strona](traffic-no-js-390-table-end.png) | [1440 px](traffic-no-js-1440-table.png) |
| Informacje o pieszych | [390 px](traffic-no-js-390-pedestrians.png) | [1440 px](traffic-no-js-1440-pedestrians.png) |

Preflight `trust-advisor`: gotowe. Odbiorca ma zrozumieć zakres liczb i móc sprawdzić źródła. GPR, KPP i SEWiK rozwinięto przy pierwszym użyciu na podstronie. Dane KPP oznaczono jako historyczne; średnią dobową odróżniono od lokalnego pomiaru. Nowe dane lub korekta instytucji wymagałyby aktualizacji treści.

Audyt redakcyjny usunął powtórzenie wyjaśnienia korekty roku i potrzeby lokalnego pomiaru. Nie dopisano nowych zdarzeń ani wyników obserwacji. W zwykłych akapitach średnia długość zdania wynosi 10,84 słowa, maksimum 16; brak zdań ponad 25 słów. [Zapis pomiaru](plain-language.json).

| Materiał | Sloplint PL | Burstiness | TTR | Powtórzenia trigramów |
|---|---|---|---|---|
| [Tekst podstrony](tekst-podstrony.txt) | 0/100 | 0,62 | 0,59 | 0,03 |
| `src/site-data.ts` | 9/100 | 0,94 | 0,49 | 0,14 |
| `src/render-traffic.ts` | 6/100 | 0,90 | 0,42 | 0,10 |

Statystyki plików TypeScript obejmują składnię i powtarzane pola. Do oceny języka służy przede wszystkim wyodrębniony tekst strony; nie zmieniano struktury kodu dla wyniku lintera.
