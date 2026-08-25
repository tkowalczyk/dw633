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

Wymagany jest Node.js 22 oraz npm.

```bash
npm ci
npm run dev
```

Vite wyświetli lokalny adres, zwykle `http://localhost:5173/`.

## Kontrola i build

```bash
npm run check
```

Polecenie uruchamia lint, testy oraz produkcyjny build. Wynik trafia do katalogu `dist/`. Podgląd gotowego buildu:

```bash
npm run preview
```

## Aktualizacja treści

Treści, liczby, oś czasu, punkty schematu, źródła i lista wpisów z Facebooka znajdują się w `src/site-data.ts`. Nowy wpis można dodać do `siteData.updates.items`, podając datę, tytuł, krótki opis i publiczny permalink.

Pozostałe pliki mają rozdzielone role:

- `src/main.ts`: semantyczny HTML i zachowanie animacji;
- `src/style.css`: układ, style responsywne i wariant `prefers-reduced-motion`;
- `src/site-data.test.ts`: kontrola liczb, linków, metadanych oraz granic publikacji;
- `public/`: Open Graph, favicony, manifest i nagłówki dla hostingu.

Po zmianie danych lub metadanych zawsze uruchom `npm run check`.

## Publikacja w Cloudflare Pages

Repozytorium jest gotowe do wdrożenia przez integrację Git w Cloudflare Pages:

| Ustawienie | Wartość |
|---|---|
| Repozytorium | `tkowalczyk/dw633` |
| Gałąź produkcyjna | `main` |
| Framework preset | `Vite` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

W panelu Cloudflare wybierz **Workers & Pages → Create application → Pages → Import an existing Git repository**, wskaż repozytorium i użyj ustawień z tabeli. Każdy kolejny push do `main` może wtedy uruchamiać nowy build.

Po sprawdzeniu wersji `*.pages.dev` dodaj `dw633.pl` w ustawieniach projektu Pages jako domenę niestandardową. Jeżeli domena nie jest jeszcze obsługiwana przez Cloudflare DNS, najpierw trzeba dodać jej strefę i wykonać zmianę serwerów nazw u rejestratora. Nie zmieniaj ręcznie rekordów DNS przed zakończeniem wdrożenia testowego.

Dokumentacja Cloudflare: [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/) · [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)

## Granice publikacji

- Schemat odcinka służy orientacji; dystans około 1 km pochodzi z pomocniczego pomiaru OSM.
- W repozytorium nie umieszczamy podpisanych pism, dowodów e-Doręczeń ani skanów zawierających dane prywatne.
- Odpowiedzi KPP i UMWM oraz rejestr wysyłki są opisane na stronie tylko w zakresie przeznaczonym do publicznej komunikacji.

Stan danych widoczny na stronie: 25 sierpnia 2026 r.
