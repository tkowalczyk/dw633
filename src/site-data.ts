export type Source = {
  id: string
  title: string
  owner: string
  scope: string
  asOf: string
  note: string
  url?: string
  links?: Array<{ label: string; url: string }>
}

type RoutePoint = {
  label: string
  shortLabel: string
  kind: string
  description: string
  progress: number
  sourceId: string
}

export type KppYear = {
  label: string
  shortLabel: string
  collisions: number
  accidents: number
}

export type InitiativeEvent = {
  date: string
  title: string
  status: string
  confirmed: string
  pending: string
  sourceId: string
}

export type SocialUpdate = {
  title: string
  description: string
  url: string
}

export type KnowledgeItem = {
  type: 'known' | 'unknown'
  title: string
  description: string
  sourceId?: string
}

type SiteData = {
  asOf: string
  hero: {
    eyebrow: string
    title: string
    lead: {
      beforeLocation: string
      locationLabel: string
      afterLocation: string
      locationUrl: string
    }
    scope: string
    snapshot: Array<{ label: string; value: string }>
  }
  traffic: {
    dailyVehicles: number
    caveat: string
    observationWindows: Array<{ label: string; description: string }>
    scenarioCaveat: string
    sourceId: string
  }
  route: {
    intro: string
    points: RoutePoint[]
  }
  kppIntro: string
  kppByYear: KppYear[]
  pedestrianEntries: Array<{ category: string; description: string }>
  pedestrianCaveat: string
  initiative: InitiativeEvent[]
  updates: {
    intro: string
    items: SocialUpdate[]
  }
  knowledge: {
    known: KnowledgeItem[]
    unknown: KnowledgeItem[]
  }
  limits: {
    title: string
    description: string
  }
  nextIntro: string
  nextSteps: Array<{ title: string; description: string }>
  sources: Source[]
}

export const siteData = {
  asOf: '22 sierpnia 2026 r.',
  hero: {
    eyebrow: 'DW633 · ul. Jana Kazimierza · Stanisławów Pierwszy',
    title: 'Sprawdzamy bezpieczeństwo pieszych na DW633',
    lead: {
      beforeLocation: 'Między przejściem i przystankami ',
      locationLabel: '„Przyleśna”',
      afterLocation:
        ' a ul. Sonaty sprawdzamy warunki dojścia do szkoły, przedszkoli i przystanków oraz miejsca przekraczania jezdni.',
      locationUrl:
        'https://www.google.com/maps/search/?api=1&query=Przystanek+Przyle%C5%9Bna%2C+Stanis%C5%82aw%C3%B3w+Pierwszy',
    },
    scope:
      'Cel jest konkretny: ciągła, bezpieczna trasa piesza i dobre miejsce przekraczania jezdni. Sprawdzamy, które połączenie chodnika, przejścia, azylu, sygnalizacji, oświetlenia lub uspokojenia ruchu najlepiej odpowie na ten problem.',
    snapshot: [
      { label: 'Badany odcinek', value: 'około 1 km*' },
      { label: 'Pierwsza runda', value: '8 pism wysłanych' },
      { label: 'Odpowiedzi', value: '1 otrzymana' },
    ],
  },
  traffic: {
    dailyVehicles: 15_753,
    caveat:
      'GPR 2025 obejmuje odcinek DW633 km 9,678–15,885, wraz z trasą Przyleśna–Sonaty. Pokazuje skalę ruchu w średniej dobowej; lokalny profil godzinowy wymaga osobnej obserwacji.',
    observationWindows: [
      { label: '7:00–9:00', description: 'rano' },
      { label: '14:00–16:00', description: 'po południu' },
    ],
    scenarioCaveat:
      'Sprawdzimy wtedy dojścia do placówek oraz czas oczekiwania na możliwość przekroczenia jezdni.',
    sourceId: 'gpr-2025',
  },
  route: {
    intro:
      'Schemat prowadzi kolejno od Przyleśnej, przez Jodłową i rejon szkoły, do Sonaty.',
    points: [
      {
        label: 'Rejon przejścia i przystanków „Przyleśna”',
        shortLabel: 'Przyleśna',
        kind: 'Południowy koniec',
        description:
          'Przy Przyleśnej znajduje się przejście oraz dwa punkty przystankowe MZDW: km 10+417 i 10+528. To południowy początek badanego odcinka.',
        progress: 0.08,
        sourceId: 'stops-mzdw',
      },
      {
        label: 'Jodłowa i Leśny Zakątek',
        shortLabel: 'Jodłowa',
        kind: 'Otoczenie trasy',
        description:
          'Przy Jodłowej działa przedszkole Jodłowy Zakątek, a przy Leśnym Zakątku — Strefa Edukacji. Ten fragment włączamy do obserwacji dojść i przekraczania jezdni.',
        progress: 0.4,
        sourceId: 'education-places',
      },
      {
        label: 'Rejon szkoły, przedszkola i zajęć',
        shortLabel: 'Szkoła',
        kind: 'Jana Kazimierza 283–299',
        description:
          'Między numerami 283 i 299 mieszczą się Modelowe Przedszkole, szkoła podstawowa i Early Stage. W tym rejonie skupimy obserwację dojść dzieci oraz sposobu przekraczania jezdni.',
        progress: 0.72,
        sourceId: 'school-area',
      },
      {
        label: 'Przejście przy ul. Sonaty',
        shortLabel: 'Sonaty',
        kind: 'Północny koniec',
        description:
          'Przejście przy Sonaty wyznacza północny koniec badanego odcinka. Między nim a Przyleśną sprawdzamy ciągłość trasy pieszej i możliwe miejsca bezpiecznego przekraczania jezdni.',
        progress: 0.94,
        sourceId: 'bom-crossings',
      },
    ],
  },
  kppIntro:
    'KPP przekazała 38 wpisów SEWiK z lat 2020–2026, opisanych jako dotyczące badanego odcinka. Tabela pokazuje ich rozkład w kolejnych latach; do rozmieszczenia zdarzeń na trasie potrzebne są lokalizacje poszczególnych wpisów.',
  kppByYear: [
    { label: '2020', shortLabel: '2020', collisions: 5, accidents: 0 },
    { label: '2021', shortLabel: '2021', collisions: 5, accidents: 1 },
    { label: '2022', shortLabel: '2022', collisions: 5, accidents: 0 },
    { label: '2023', shortLabel: '2023', collisions: 9, accidents: 1 },
    { label: '2024', shortLabel: '2024', collisions: 4, accidents: 0 },
    { label: '2025', shortLabel: '2025', collisions: 3, accidents: 1 },
    {
      label: '2026, do 18 sierpnia',
      shortLabel: '2026*',
      collisions: 4,
      accidents: 0,
    },
  ],
  pedestrianEntries: [
    {
      category: 'Kolizja · 2025',
      description:
        'Wpis z rejonu Jana Kazimierza 285 dotyczy pieszego poniżej 18 lat.',
    },
    {
      category: 'Wypadek · 2025',
      description:
        'Wpis dotyczy dorosłego pieszego na przejściu przy Przyleśnej. Dokładna kwalifikacja skutku wymaga wyjaśnienia zapisu „1” w łącznej kolumnie rannych i zabitych.',
    },
  ],
  pedestrianCaveat:
    'W dalszej analizie sprawdzimy miejsce, widoczność, prędkość i sposób przekraczania jezdni.',
  initiative: [
    {
      date: '2020',
      title: 'Projekt BOM nr 266',
      status: 'Potwierdzone częściowo',
      confirmed:
        'Urzędowy wykaz potwierdza projekt przejścia, chodnika i doświetlenia na DW633 oraz negatywny wynik oceny.',
      pending:
        'Do pozyskania: uzasadnienie oceny, mapa i wskazanie strony drogi.',
      sourceId: 'bom-266',
    },
    {
      date: '2023',
      title: 'Niewykonane zadanie projektowe Gminy',
      status: 'Potwierdzone częściowo',
      confirmed:
        'Budżet przewidywał 50 tys. zł na projektowanie chodników wzdłuż DW633. Wykonanie wyniosło 0,00 zł; Gmina wskazała brak warunków od zarządcy drogi.',
      pending:
        'Do wyjaśnienia: treść warunków, przebieg korespondencji i zakres planowanego odcinka.',
      sourceId: 'budget-2023',
    },
    {
      date: '18.08.2026',
      title: 'Osiem pism pierwszej rundy',
      status: 'Wykonane',
      confirmed:
        'Wnioski o działania i osobne wnioski o istniejące dokumenty wysłano do MZDW, Marszałka, KPP Legionowo i Gminy Nieporęt. Na zachowanym zrzucie wszystkie mają status „Doręczona”.',
      pending:
        'Do uzupełnienia w rejestrze: dowody wysłania i otrzymania oraz identyfikatory ośmiu przesyłek.',
      sourceId: 'delivery-register',
    },
    {
      date: '19.08.2026',
      title: 'Pierwsza odpowiedź: KPP Legionowo',
      status: 'Odpowiedź częściowa',
      confirmed:
        'KPP przekazała tabelę SEWiK, opisała regularne patrole i pomiary stacjonarne oraz zapowiedziała analizę zasadności zmiany.',
      pending:
        'Do sprawdzenia: wyniki pomiarów, ocena konkretnego miejsca i przekazanie wniosków zarządcy drogi.',
      sourceId: 'kpp-response',
    },
  ],
  updates: {
    intro:
      'Wpisy w grupie Sołectwa Stanisławów Pierwszy, od pierwszego pytania po kolejne odpowiedzi i działania.',
    items: [
      {
        title: 'Pytanie o odcinek Przyleśna–Sonaty',
        description:
          'Początek rozmowy z mieszkańcami o codziennych przejściach, wcześniejszych projektach i miejscach wymagających sprawdzenia.',
        url: 'https://www.facebook.com/groups/1759173624939954/permalink/2287523548771623/',
      },
      {
        title: 'Pierwsze ustalenia i osiem pism',
        description:
          'Podsumowanie zebranych dokumentów oraz pism wysłanych do MZDW, Marszałka, KPP Legionowo i Gminy Nieporęt.',
        url: 'https://www.facebook.com/groups/1759173624939954/permalink/2293366984853946/',
      },
      {
        title: 'Pierwsza odpowiedź KPP Legionowo',
        description:
          'Dane z SEWiK, zapowiedź dalszej analizy i termin kolejnej kontroli sprawy.',
        url: 'https://www.facebook.com/groups/1759173624939954/permalink/2296400137883964/',
      },
    ],
  },
  knowledge: {
    known: [
      {
        type: 'known',
        title: 'Przejścia są na obu końcach',
        description:
          'Oficjalny projekt doświetlenia wymienia przejścia przy Przyleśnej i Sonaty. Pytanie dotyczy luki między nimi i ciągłości dojścia.',
        sourceId: 'bom-crossings',
      },
      {
        type: 'known',
        title: 'Publiczne mapy pokazują ciągłą działkę nr 87 po zachodniej stronie',
        description:
          'EGiB pokazuje ciągłą działkę nr 87, a orientacyjna kontrola 11 przekrojów dała około 3–12 m od krawędzi jezdni do granicy działki.',
        sourceId: 'spatial-data',
      },
      {
        type: 'known',
        title: 'KPP zarejestrowała 35 kolizji i 3 wypadki',
        description:
          'Zakres czasowy to 1.01.2020–18.08.2026. Dwa wpisy dotyczą udziału pieszych.',
        sourceId: 'kpp-response',
      },
    ],
    unknown: [
      {
        type: 'unknown',
        title: 'Potrzebny lokalny pomiar pieszych i prędkości V85',
        description:
          'Pomiar powinien objąć liczbę pieszych, czas oczekiwania, konflikty i prędkość pojazdów.',
      },
      {
        type: 'unknown',
        title: 'Potrzebna dokładna granica pasa i rozpoznanie kolizji technicznych',
        description:
          'Do porównania wariantów potrzebne są dane o własności, uzbrojeniu, odwodnieniu, wysokościach, zieleni i skrajni.',
        sourceId: 'spatial-data',
      },
      {
        type: 'unknown',
        title: 'Potrzebne dokumenty wcześniejszych prób',
        description:
          'Do pozyskania pozostają pełna ocena BOM nr 266 i dokumenty dotyczące warunków, których Gmina nie otrzymała w 2023 r.',
        sourceId: 'budget-2023',
      },
    ],
  },
  limits: {
    title: 'Każde źródło odpowiada na inne pytanie',
    description:
      'GPR pokazuje skalę ruchu na dłuższym odcinku, OSM pomaga oszacować długość trasy, mapy publiczne pokazują układ terenu, a SEWiK historię zdarzeń. Do wyboru rozwiązania potrzebne są jeszcze pomiary terenowe i analiza BRD.',
  },
  nextIntro:
    'Najbliższy etap to zebranie brakujących dokumentów, obserwacja ruchu pieszego i porównanie wariantów. Odpowiedzi instytucji sprawdzimy punkt po punkcie.',
  nextSteps: [
    {
      title: 'Sprawdzić odpowiedzi na informację publiczną',
      description:
        '1 września 2026 r. przypada robocza kontrola pism do MZDW, Marszałka i Gminy. Jeśli instytucja prawidłowo przedłuży termin, wpiszemy nową datę kontroli.',
    },
    {
      title: 'Sprawdzić wnioski o działania i zapowiedź KPP',
      description:
        '18 września 2026 r. trzeba sprawdzić stan wniosków KPA oraz to, czy KPP wykonała zapowiedzianą analizę i przekazała wnioski zarządcy drogi.',
    },
    {
      title: 'Uzupełnić dowody i dokumentację terenową',
      description:
        'Do rejestru powinny trafić dowody e-Doręczeń i numery spraw. Bezpieczne oględziny mają potwierdzić aktualne oznakowanie, ciągłość dojść i rzeczywiste miejsca przekraczania jezdni.',
    },
    {
      title: 'Porównać warianty po uzyskaniu danych',
      description:
        'Na tej podstawie będzie można porównać warianty, koszty, finansowanie i harmonogram, a następnie przygotować późniejszą petycję budżetową.',
    },
  ],
  sources: [
    {
      id: 'gpr-2025',
      title: 'Generalny Pomiar Ruchu 2025: wyniki podstawowe',
      owner: 'GDDKiA',
      scope: 'DW633, odcinek km 9,678–15,885; rekord 14107',
      asOf: 'GPR 2025',
      note: 'Zakres jest dłuższy od badanej trasy; dane opisują pojazdy w ujęciu dobowym.',
      url: 'https://www.gov.pl/web/gddkia/generalny-pomiar-ruchu-2025',
    },
    {
      id: 'stops-mzdw',
      title: 'Wykaz przystanków komunikacyjnych',
      owner: 'Mazowiecki Zarząd Dróg Wojewódzkich',
      scope: 'przystanki Przyleśna na DW633, km 10+417 i 10+528',
      asOf: '26.03.2026',
      note: 'Rejestr obejmuje lokalizacje przystanków; do odczytania kierunków potrzebna jest legenda L/P.',
      url: 'https://api.mzdw.pl/storage/files/2390/wykaz-przystank%C3%B3w-26.03.2026-%281%29.pdf',
    },
    {
      id: 'bom-crossings',
      title: 'Projekt BOM nr 249: doświetlenie przejść',
      owner: 'Budżet Obywatelski Mazowsza',
      scope: 'm.in. przejścia przy Przyleśnej i Sonaty w Stanisławowie Pierwszym',
      asOf: 'karta sprawdzona 12.08.2026',
      note: 'Karta potwierdza zakres projektu; aktualny stan sprawdzimy podczas oględzin.',
      url: 'https://bom.mazovia.pl/projekt/251',
    },
    {
      id: 'bom-266',
      title: 'Wykaz projektów BOM po ocenie: projekt nr 266',
      owner: 'Województwo Mazowieckie',
      scope: 'projekt przejścia, chodnika i doświetlenia na DW633; ocena negatywna',
      asOf: 'edycja 2020',
      note: 'Do pozyskania pozostają uzasadnienie, mapa i wskazanie strony drogi.',
      url: 'https://bom.mazovia.pl/gminy/mazovia/news/9/3q/ft/5/Wykaz_projekt%C3%B3w_BOM_po_ocenie.pdf?WFTH=',
    },
    {
      id: 'budget-2023',
      title: 'Budżet Gminy na 2023 r. i sprawozdanie z wykonania',
      owner: 'Gmina Nieporęt',
      scope: '50 tys. zł na projektowanie chodników przy DW633; wykonanie 0,00 zł',
      asOf: 'rok budżetowy 2023',
      note: 'Do wyjaśnienia pozostaje treść warunków od zarządcy i przebieg korespondencji.',
      url: 'https://nieporet.esesja.pl/zalaczniki/295600/zarz130sprawozdanie-wykonanie-budzetu_2782350.pdf',
    },
    {
      id: 'school-area',
      title: 'Szkoła Podstawowa, Modelowe Przedszkole i Early Stage',
      owner: 'Szkoła Podstawowa / Modelowa Edukacja / Early Stage',
      scope: 'Jana Kazimierza 283–299',
      asOf: 'strony sprawdzone 12–22.08.2026',
      note: 'Strony własne placówek potwierdzają ich adresy.',
      links: [
        { label: 'szkoła', url: 'https://spsp.nieporet.pl/' },
        {
          label: 'Modelowe Przedszkole',
          url: 'https://www.modelowaedukacja.eu/przedszkole',
        },
        {
          label: 'Early Stage',
          url: 'https://earlystage.pl/pl/szkola/stanislawow-pierwszy',
        },
      ],
    },
    {
      id: 'education-places',
      title: 'Jodłowy Zakątek i Strefa Edukacji',
      owner: 'Jodłowy Zakątek / Strefa Edukacji',
      scope: 'Jodłowa 1 i Leśny Zakątek 2',
      asOf: 'strony sprawdzone 20–22.08.2026',
      note: 'Strony własne potwierdzają lokalizacje; sposób dotarcia sprawdzimy w obserwacji.',
      links: [
        {
          label: 'Jodłowy Zakątek',
          url: 'https://jodlowyzakatek.edu.pl/kontakt/',
        },
        { label: 'Strefa Edukacji', url: 'https://strefa-edukacji.com/kontakt/' },
      ],
    },
    {
      id: 'spatial-data',
      title: 'Publiczne EGiB, ortofotomapa i MPZP nr 024 „Leszczyna”',
      owner: 'Gmina Nieporęt / GUGiK',
      scope: 'zachodnia strona DW633, 11 przekrojów pomocniczych',
      asOf: 'analiza 14.08.2026; ortofotomapa z 16.07.2024',
      note: 'Warstwy publiczne służą do orientacji; granice i warunki techniczne wymagają danych projektowych.',
      url: 'https://nieporet.e-mapa.net/',
    },
    {
      id: 'delivery-register',
      title: 'Rejestr wysyłki pierwszej rundy',
      owner: 'dokumentacja inicjatywy',
      scope: '8 osobnych przesyłek e-Doręczeń z 18.08.2026',
      asOf: '20.08.2026',
      note: 'Dokumentacja jest przechowywana niepublicznie ze względu na dane prywatne.',
    },
    {
      id: 'kpp-response',
      title: 'Pismo KPP-RD-1930/26',
      owner: 'KPP Legionowo, Wydział Ruchu Drogowego',
      scope: '38 wpisów SEWiK z okresu 1.01.2020–18.08.2026',
      asOf: '19.08.2026',
      note: 'Oryginał jest przechowywany niepublicznie ze względu na dane adresata.',
    },
  ],
} satisfies SiteData

const minutesPerDay = 24 * 60

export const trafficScale = {
  averagePerMinute: siteData.traffic.dailyVehicles / minutesPerDay,
  averageSecondsBetween:
    (minutesPerDay * 60) / siteData.traffic.dailyVehicles,
}

export const kppTotals = siteData.kppByYear.reduce(
  (totals, year) => ({
    collisions: totals.collisions + year.collisions,
    accidents: totals.accidents + year.accidents,
    total: totals.total + year.collisions + year.accidents,
  }),
  { collisions: 0, accidents: 0, total: 0 },
)
