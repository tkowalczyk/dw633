# Zadanie #9: kotwica KPP po odświeżeniu

7.09.2026 poprawiono synchronizację testu katalogu na `main`. Odświeżenie następuje po dotarciu do widocznej karty KPP i ustaniu przewijania. Ta sama kontrola działa po odświeżeniu. Zachowano klawiaturę, wyłączony JavaScript strony, oba rozmiary okna i granicę położenia pod nagłówkiem.

Raport opisuje etap przed publikacją poprawki. `pnpm check` oraz pełny zestaw produkcji przeszły. Zmiany obejmują test i raport; treść, CSS i skrypty strony pozostały bez zmian. Na tym etapie nie wykonano commita, pusha ani wdrożenia i nie zmieniono issue #9.

## Plan i założenia przed RED

Zakres wynika z issue #9 odczytanego 7.09.2026, bez komentarzy. Praca na bieżącym `main` obejmuje odtworzenie błędu lub diagnostykę jego przyczyny, poprawkę i pełną kontrolę lokalną oraz produkcyjną.

Wejście: istniejące strony i odsyłacze, wyłączony JavaScript strony, okna 390 × 844 i 1440 × 900 px. Wyjście: po Enter przeglądarka wczytuje właściwy dokument, a karta KPP pozostaje widoczna poniżej nagłówka przed odświeżeniem i po nim. Brak kotwicy, zły adres lub zasłonięty początek karty mają kończyć test błędem.

Plan obejmował rozróżnienie zakończenia nawigacji i przewijania oraz zapis diagnostyki: URL, stan dokumentu, pozycje karty i nagłówka, PNG. Testy korzystają z rzeczywistego agent-browser, bez atrap wewnętrznych modułów.

Poza zakresem pozostają nowe dane o drodze, Search Console i inne silniki przeglądarki. Zachowano wcześniejszą lokalną zmianę oczekiwania na URL i wczytanie dokumentu. Jej kopia znajduje się w prywatnym archiwum kontroli.

## Co wykazała diagnostyka

Pierwsza pojedyncza próba i [pełny przebieg przed zmianą](baseline-full.txt) przeszły. Sześć pomiarów lokalnych wykazało, że `readyState: complete` i właściwy URL pojawiają się przed zakończeniem przewijania. Przykładowo na telefonie początek KPP znajdował się wtedy na wysokości 3269 px, a po zakończeniu ruchu na 136 px.

Kolejne próby objęły pięć momentów odświeżenia: 0, 100, 250, 500 i 800 ms po oczekiwaniu na wczytanie, w obu rozmiarach, lokalnie i na produkcji. [Dane lokalne](diagnose-local-delays.json) i [produkcyjne](diagnose-production.json) zawierają pozycje przed odświeżeniem, zaraz po nim i sekundę później. Pole `iteration` oznacza w tych dwóch plikach opóźnienie w milisekundach. Wszystkie 20 prób dotarło do właściwej pozycji. [Skrypt pomiarowy](diagnose.ts) pozwala powtórzyć eksperyment; jego stałe opóźnienia służą wyłącznie pomiarowi.

Potwierdzono błędne założenie testu, że po wczytaniu można już odświeżać kartę. Historycznego przekroczenia 25 sekund nie odtworzono, więc nie ma dowodu, że wszystkie wcześniejsze błędy miały tę przyczynę. Poprawka usuwa wykazaną lukę i zapisuje dane potrzebne przy ewentualnym nawrocie.

## TDD i kontrola wykrywania błędów

[RED](red.txt): nowa asercja widoczności przed odświeżeniem zawiodła. [GREEN](green.txt): oczekiwanie na widoczną KPP pozwoliło przejść obu rozmiarom. Po [refaktoryzacji](refactor.txt) wspólna funkcja obsługuje oba etapy i zachowuje pierwotny błąd także wtedy, gdy zapis diagnostyki zawiedzie.

Próba z usuniętym odstępem kotwicy pokazała, że karta może na chwilę spełnić warunek podczas przewijania i przejechać pod nagłówek. Końcowy test pobiera pomiary co 100 ms i wymaga dwóch zgodnych pozycji w tym samym dokumencie. Limit nadal wynosi 25 sekund; warunek `headerBottom <= top < headerBottom + 80` pozostał.

Dwie kontrolowane usterki w lokalnym `dist` zostały odrzucone: [zasłonięta karta](covered-anchor.txt) i [brak kotwicy](missing-anchor.txt). Diagnostyka pokazuje odpowiednio początek karty na 0,19 px przy nagłówku do 118,70 px oraz `target: null`. Oryginalny HTML odtworzono po każdej próbie i porównano z kopią. Plików źródłowych strony nie zmieniano.

## Wynik końcowy

| Kontrola | Wynik |
|---|---|
| [pnpm check](check.txt) | Lint, 26 testów Vitest, TypeScript, build, 29/29 testów HTTP i agent-browser |
| [Pełny zestaw produkcji](production.txt) | 29/29, bez pominięć i błędów |
| [Pozycje lokalne](anchors-local.json) i [produkcyjne](anchors-production.json) | KPP widoczna przed odświeżeniem i po nim, 390 × 844 oraz 1440 × 900 px |
| Produkcja po odświeżeniu | Początek KPP 136,19 / 136,27 px; dół nagłówka 118,70 / 74 px |

Obejrzano dwa końcowe zrzuty produkcji: [telefon](kpp-production-390.png) i [komputer](kpp-production-1440.png), a także zrzuty obu kontrolowanych usterek. KPP jest czytelna poniżej menu. Logi publicznego raportu mają usunięte prywatne ścieżki środowiska. Pełne surowe materiały przechowuje właściciel w katalogu kontroli #9 z 7.09.2026.
