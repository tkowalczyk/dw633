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
  month: string
  monthLabel: string
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
  documents: {
    title: string; pageTitle: string; description: string; intro: string; homeIntro: string; linkLabel: string
    readings: Array<{ sourceIds: string[]; url: string; label: string }>
  }
  trafficPage: {
    title: string; pageTitle: string; description: string; intro: string
    gprTitle: string; gprScope: string; gprExplanation: string
    kppPeriod: string; kppScope: string; categories: string
  }
  walk: {
    title: string
    pageTitle: string
    description: string
    intro: string
    questions: Array<{ title: string; paragraphs: string[]; sourceIds: string[] }>
    waiting: { title: string; documents: string; actions: string; note: string }
  }
  notFound: { title: string; homeLink: string }
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
    title: string
    intro: string
    hint: string
    previousLabel: string
    nextLabel: string
    linkLabel: string
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
  asOf: '17 września 2026 r.',
  documents: {
    title: 'Dokumenty w sprawie DW633 w Stanisławowie Pierwszym',
    pageTitle: 'Dokumenty w sprawie DW633 | Stanisławów Pierwszy',
    description: 'Źródła danych i historii działań przy DW633 w Stanisławowie Pierwszym. Dokumenty instytucji, zakres informacji i odsyłacze do opracowań.',
    intro: 'Tutaj sprawdzisz, skąd pochodzą dane i opisy działań przy DW633. Każda pozycja podaje autora, zakres informacji i datę. Publiczne materiały otworzysz z odnośników; korespondencję zawierającą dane prywatne opisujemy bez udostępniania załączników.',
    homeIntro: 'Katalog zbiera źródła danych i historii działań. Przy każdym materiale podajemy jego zakres, datę i ograniczenia.',
    linkLabel: 'Przejdź do katalogu dokumentów DW633',
    readings: [
      { sourceIds: ['kpp-response', 'event-categories', 'accident-date-check'], url: '/ruch-i-wypadki-dw633/#zdarzenia', label: 'Zobacz zestawienie zdarzeń KPP i korektę roku' },
      { sourceIds: ['gpr-2025'], url: '/ruch-i-wypadki-dw633/#ruch', label: 'Zobacz dane o natężeniu ruchu' },
      { sourceIds: ['bom-266', 'budget-2023', 'delivery-register', 'umwm-extension', 'gmina-extension', 'mzdw-extension', 'gmina-actions', 'umwm-extension-2'], url: '/chodnik-stanislawow-pierwszy/#dzialania', label: 'Zobacz historię działań i odpowiedzi instytucji' },
      { sourceIds: ['stops-mzdw', 'bom-crossings', 'school-area', 'education-places', 'spatial-data'], url: '/#odcinek', label: 'Zobacz opis badanego odcinka' },
    ],
  },
  trafficPage: {
    title: 'Ruch, kolizje i wypadki na DW633 w Stanisławowie Pierwszym',
    pageTitle: 'Ruch, kolizje i wypadki na DW633 | Stanisławów Pierwszy',
    description: 'Natężenie ruchu z GPR 2025 i dane KPP z okresu 1.01.2020-18.08.2026 dla DW633 w Stanisławowie Pierwszym. Tabela roczna, korekta daty i zakres danych.',
    intro: 'Zebraliśmy pomiar ruchu pojazdów i historię zdarzeń przy ulicy Jana Kazimierza. Te dane pomagają określić, co trzeba jeszcze sprawdzić przed wyborem rozwiązań dla pieszych.',
    gprTitle: 'Generalny Pomiar Ruchu (GPR) 2025',
    gprScope: 'Odcinek pomiarowy jest dłuższy od badanej trasy Przyleśna-Sonaty.',
    gprExplanation: 'To przeliczenie średniej dobowej, rozłożonej równomiernie na 24 godziny.',
    kppPeriod: '1.01.2020-18.08.2026',
    kppScope: 'Komenda Powiatowa Policji (KPP) w Legionowie opisała zestawienie jako dotyczące odcinka Przyleśna-Sonaty. Dane pochodzą z Systemu Ewidencji Wypadków i Kolizji (SEWiK). Ostatni rok obejmuje okres do 18 sierpnia 2026 r.',
    categories: 'Kolizja może oznaczać szkody materialne lub obrażenia powodujące rozstrój zdrowia nie dłuższy niż siedem dni. Wypadek to zdarzenie z osobą ranną lub zabitą. Kategorie w tabeli zachowują kwalifikację przekazaną przez KPP.',
  },
  walk: {
    title: 'Chodnik i przejścia w Stanisławowie Pierwszym przy DW633',
    pageTitle: 'Chodnik i przejścia w Stanisławowie Pierwszym | Stan działań na DW633',
    description: 'Historia sprawy chodnika i przejść przy Jana Kazimierza w Stanisławowie Pierwszym. Wnioski do instytucji, terminy odpowiedzi i dalsze kroki na DW633.',
    intro:
      'Zbieramy dokumenty i odpowiedzi w sprawie bezpiecznej trasy pieszej przy ulicy Jana Kazimierza. Tutaj można prześledzić wcześniejsze próby, wysłane wnioski i kolejne kroki.',
    questions: [
      {
        title: 'Co wiadomo o chodniku przy Jana Kazimierza?',
        paragraphs: [
          'Celem inicjatywy jest ciągła trasa piesza po stronie, po której brakuje chodnika, oraz bezpieczne przekraczanie jezdni pomiędzy istniejącymi przejściami.',
          'Gmina w piśmie z 11 września informuje o przygotowywaniu umów z MZDW dotyczących brakujących chodników. Wcześniejsze próby obejmowały projekt Budżetu Obywatelskiego Mazowsza (BOM) nr 266 i zadanie projektowe z 2023 r. Do wyboru rozwiązania potrzebne są oględziny, analiza bezpieczeństwa i porównanie wariantów.',
        ],
        sourceIds: ['gmina-actions', 'bom-266', 'budget-2023'],
      },
      {
        title: 'Co zawiera odpowiedź Gminy otrzymana 14 września?',
        paragraphs: [
          'Pismo sporządzono 11 września, a otrzymano 14 września. Gmina podaje, że na początku 2026 r. przekazała MZDW postulaty mieszkańców, także dotyczące odcinka Sonaty-Przyleśna. 29 lipca otrzymała propozycje umów o pomocy rzeczowej przy brakujących chodnikach wzdłuż DW633. Te działania poprzedzają nasze sierpniowe wnioski.',
          'Według pisma trwa przygotowanie zawarcia umów i planowanie zadań na 2027 r. oraz kolejne lata. Gmina zapowiada przekazanie planu Radzie Gminy w ramach prac nad budżetem i wieloletnią prognozą finansową, czyli planem finansów na kolejne lata. Sprawę prowadzi Dział Inwestycji.',
          'Gmina wskazuje też nowo wybudowaną sygnalizację przy szkole oraz odcinkowe remonty chodnika jako efekty dotychczasowej współpracy. Pismo nie podaje daty uruchomienia sygnalizacji ani dokładnego zakresu remontów.',
        ],
        sourceIds: ['gmina-actions'],
      },
      {
        title: 'Czego odpowiedź Gminy jeszcze nie wyjaśnia?',
        paragraphs: [
          'Brakuje dokładnego zakresu i strony drogi, kwot oraz harmonogramu. Pismo nie potwierdza podpisania umów ani przyznania pieniędzy. Rok 2027 oznacza horyzont planowania budżetu, a nie potwierdzony termin budowy.',
          'Gmina nie odniosła się do udziału w oględzinach i przekazania danych o dojściach dzieci. Nie wyjaśniła też zakresu koncepcji bezpiecznego przekraczania jezdni pomiędzy istniejącymi przejściami ani związku z niewykonanym zadaniem z 2023 r.',
          'W piśmie Gmina opisuje odcinek od Sonaty w Stanisławowie Pierwszym do ul. Przyleśnej w Kątach Węgierskich. Wysłano pytanie o to, czy rozmowy i przygotowywane umowy obejmują zachodni chodnik na odcinku Przyleśna-Sonaty. Czekamy na doprecyzowanie zakresu.',
        ],
        sourceIds: ['gmina-actions', 'budget-2023'],
      },
      {
        title: 'Jakiego odcinka dotyczą wnioski?',
        paragraphs: [
          'Chodzi o DW633, ulicę Jana Kazimierza w Stanisławowie Pierwszym, w gminie Nieporęt: od rejonu przejścia i przystanków „Przyleśna” do ulicy Sonaty. Przyleśna to nazwa przystanków.',
          'Oficjalny projekt doświetlenia wymienia przejścia przy Przyleśnej i Sonaty. Wnioski dotyczą ciągłości dojścia i luki pomiędzy tymi przejściami.',
        ],
        sourceIds: ['stops-mzdw', 'bom-crossings'],
      },
    ],
    waiting: {
      title: 'Na jakie odpowiedzi czekamy?',
      documents: 'Wnioski o dokumenty',
      actions: 'Wnioski o działania',
      note: 'To terminy zapisane w otrzymanych zawiadomieniach. Odpowiedź Gminy otrzymana 14 września, sporządzona 11 września, dotyczy osobnego wniosku o działania. Nie zmienia terminu 12 października dla dokumentów.',
    },
  },
  notFound: {
    title: 'Nie znaleziono strony',
    homeLink: 'Wróć na stronę główną',
  },
  hero: {
    eyebrow: 'DW633 · ul. Jana Kazimierza · Stanisławów Pierwszy',
    title: 'DW633 przyjazna pieszym',
    lead: {
      beforeLocation:
        'Sprawdzamy bezpieczeństwo pieszych przy drodze wojewódzkiej nr 633 w Stanisławowie Pierwszym, w gminie Nieporęt. Chodzi o ulicę Jana Kazimierza, od rejonu przystanków ',
      locationLabel: '«Przyleśna»',
      afterLocation: ' do ulicy Sonaty.',
      locationUrl:
        'https://www.google.com/maps/search/?api=1&query=Przystanek+Przyle%C5%9Bna%2C+Stanis%C5%82aw%C3%B3w+Pierwszy',
    },
    scope:
      'Cel jest konkretny: ciągła, bezpieczna trasa piesza i dobre miejsce przekraczania jezdni. Sprawdzamy, które połączenie chodnika, przejścia, azylu, sygnalizacji, oświetlenia lub uspokojenia ruchu najlepiej odpowie na ten problem.',
    snapshot: [
      { label: 'Badany odcinek', value: 'około 1 km*' },
      { label: 'Pierwsza runda', value: '8 pism wysłanych' },
      { label: 'Pisma z instytucji', value: '6 otrzymanych' },
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
          'Przy Jodłowej działa przedszkole Jodłowy Zakątek, a przy Leśnym Zakątku działa Strefa Edukacji. Ten fragment włączamy do obserwacji dojść i przekraczania jezdni.',
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
    'Według tabeli i późniejszych wyjaśnień KPP są wśród nich 4 osoby ranne; nie wykazano osoby zabitej. Policja potwierdziła datę wypadku z pieszą przy Przyleśnej: 25 maja 2026 r.',
  kppByYear: [
    { label: '2020', shortLabel: '2020', collisions: 5, accidents: 0 },
    { label: '2021', shortLabel: '2021', collisions: 5, accidents: 1 },
    { label: '2022', shortLabel: '2022', collisions: 5, accidents: 0 },
    { label: '2023', shortLabel: '2023', collisions: 9, accidents: 1 },
    { label: '2024', shortLabel: '2024', collisions: 4, accidents: 0 },
    { label: '2025', shortLabel: '2025', collisions: 3, accidents: 0 },
    {
      label: '2026, do 18 sierpnia',
      shortLabel: '2026',
      collisions: 4,
      accidents: 1,
    },
  ],
  pedestrianEntries: [
    {
      category: 'Kolizja · 2025',
      description:
        'Wpis z rejonu Jana Kazimierza 285 dotyczy pieszego poniżej 18 lat.',
    },
    {
      category: 'Wypadek · 2026',
      description:
        'Wypadek przy przejściu w rejonie Przyleśnej miał miejsce 25 maja 2026 r. KPP potwierdziła jedną osobę ranną, u której obrażenia lub rozstrój zdrowia trwały powyżej siedmiu dni.',
    },
  ],
  pedestrianCaveat:
    'KPP potwierdziła, że rok 2025 w pierwotnej tabeli był omyłką pisarską. Korekta przenosi jeden wypadek do 2026 r. bez zmiany łącznej liczby zdarzeń, wypadków ani osób rannych.',
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
        'KPP przekazała tabelę SEWiK, opisała regularne patrole i pomiary stacjonarne oraz zapowiedziała analizę zasadności proponowanej zmiany.',
      pending:
        'Późniejszy e-mail doprecyzował zakres tej zapowiedzi.',
      sourceId: 'kpp-response',
    },
    {
      date: 'po 20.08.2026',
      title: 'KPP doprecyzowała zakres swoich działań',
      status: 'Wyjaśnienie',
      confirmed:
        'KPP wyjaśniła, że własną analizę i dodatkowe działania podejmie na wniosek zarządcy drogi, a formalną opinię do projektu na DW633 wydaje Komendant Stołeczny Policji. Potwierdziła też znaczenie wpisu „1” jako jednej osoby rannej.',
      pending:
        'Do ustalenia w odpowiedziach MZDW i Marszałka: czy uruchomią analizę bezpieczeństwa i przygotowanie projektu.',
      sourceId: 'kpp-response',
    },
    {
      date: '24.08.2026',
      title: 'KPP potwierdziła rok wypadku',
      status: 'Wyjaśnione',
      confirmed:
        'Prawidłowa data to 25 maja 2026 r. KPP potwierdziła, że rok 2025 w pierwotnej tabeli był omyłką pisarską.',
      pending:
        'Korekta nie zmienia sum. Dalszy krok zależy od odpowiedzi MZDW i Marszałka w sprawie uruchomienia analizy oraz projektu.',
      sourceId: 'kpp-response',
    },
    {
      date: '24.08.2026',
      title: 'UMWM wyznaczył nowy termin odpowiedzi',
      status: 'Nowy termin',
      confirmed:
        'Urząd wyznaczył 18 września 2026 r. jako nowy termin rozpatrzenia wniosku o dokumenty organizacji ruchu na DW633 i pełną dokumentację projektu BOM nr 266.',
      pending:
        'Pismo nie zawiera jeszcze dokumentów ani odpowiedzi na poszczególne punkty wniosku. Późniejsze zawiadomienie z 16 września zmieniło ten termin na 15 października.',
      sourceId: 'umwm-extension',
    },
    {
      date: '25.08.2026',
      title: 'Gmina wyznaczyła nowy termin odpowiedzi',
      status: 'Nowy termin',
      confirmed:
        'Gmina wyznaczyła 12 października 2026 r. jako nowy termin odpowiedzi na wniosek o dokumenty dotyczące działań przy DW633.',
      pending:
        'Pismo nie zawiera jeszcze dokumentów i nie dotyczy osobnego wniosku o wsparcie działań, złożonego na podstawie art. 241 KPA.',
      sourceId: 'gmina-extension',
    },
    {
      date: '31.08.2026',
      title: 'MZDW wyznaczył nowy termin odpowiedzi',
      status: 'Nowy termin',
      confirmed:
        'MZDW wyznaczył 25 września 2026 r. jako termin udostępnienia informacji i dokumentów dotyczących badanego odcinka DW633.',
      pending:
        'Pismo nie zawiera jeszcze dokumentów i nie dotyczy osobnego wniosku o oględziny, analizę bezpieczeństwa ruchu i warianty.',
      sourceId: 'mzdw-extension',
    },
    {
      date: '14.09.2026',
      title: 'Gmina przygotowuje umowy dotyczące chodników',
      status: 'Odpowiedź częściowa',
      confirmed:
        'Odpowiedź otrzymano 14 września; pismo sporządzono 11 września. Gmina podaje, że 29 lipca otrzymała propozycje umów z MZDW dotyczących brakujących chodników przy DW633. Trwa przygotowanie ich zawarcia i planowanie zadań na 2027 r. i kolejne lata. Wcześniejsze postulaty obejmowały też odcinek Sonaty-Przyleśna.',
      pending:
        'Potwierdzić, czy przygotowania obejmują chodnik po zachodniej stronie Jana Kazimierza na odcinku Przyleśna-Sonaty. Pismo nie potwierdza podpisania umów ani terminu budowy.',
      sourceId: 'gmina-actions',
    },
    {
      date: '16.09.2026',
      title: 'UMWM ponownie przesunął termin odpowiedzi',
      status: 'Nowy termin',
      confirmed:
        'Pismo sporządzono i otrzymano 16 września. Urząd Marszałkowski wyznaczył 15 października 2026 r. zamiast 18 września dla wniosku o dokumenty organizacji ruchu i projektu BOM nr 266. Ponownie wskazał obszerny zakres danych z ostatnich dziesięciu lat.',
      pending:
        'Zawiadomienie nie zawiera dokumentów ani odpowiedzi na pytania. Nie obejmuje osobnego wniosku o działania na rzecz bezpieczeństwa pieszych.',
      sourceId: 'umwm-extension-2',
    },
  ],
  updates: {
    title: 'Posty na Facebooku',
    intro:
      'Wpisy w grupie Sołectwa Stanisławów Pierwszy, od pierwszego pytania po kolejne odpowiedzi i działania.',
    hint: 'Od najstarszego wpisu. Przesuń kafelki, aby zobaczyć kolejne.',
    previousLabel: 'Poprzednie posty',
    nextLabel: 'Następne posty',
    linkLabel: 'Przeczytaj post na Facebooku',
    items: [
      {
        month: '2026-08',
        monthLabel: 'Sierpień 2026',
        title: 'Pytanie o odcinek Przyleśna–Sonaty',
        description:
          'Początek rozmowy z mieszkańcami o codziennych przejściach, wcześniejszych projektach i miejscach wymagających sprawdzenia.',
        url: 'https://www.facebook.com/groups/1759173624939954/permalink/2287523548771623/',
      },
      {
        month: '2026-08',
        monthLabel: 'Sierpień 2026',
        title: 'Pierwsze ustalenia i osiem pism',
        description:
          'Podsumowanie zebranych dokumentów oraz pism wysłanych do MZDW, Marszałka, KPP Legionowo i Gminy Nieporęt.',
        url: 'https://www.facebook.com/groups/1759173624939954/permalink/2293366984853946/',
      },
      {
        month: '2026-08',
        monthLabel: 'Sierpień 2026',
        title: 'Pierwsza odpowiedź KPP Legionowo',
        description:
          'Dane z SEWiK i pierwsza zapowiedź dalszej analizy. KPP później doprecyzowała, że własne działania podejmie na wniosek zarządcy drogi.',
        url: 'https://www.facebook.com/groups/1759173624939954/permalink/2296400137883964/',
      },
      {
        month: '2026-08',
        monthLabel: 'Sierpień 2026',
        title: 'Korekta KPP i nowy termin UMWM',
        description:
          'KPP potwierdziła prawidłowy rok wypadku, a UMWM wyznaczył 18 września jako nowy termin odpowiedzi na wniosek o dokumenty.',
        url: 'https://www.facebook.com/groups/1759173624939954/permalink/2299661007557877/',
      },
      {
        month: '2026-08',
        monthLabel: 'Sierpień 2026',
        title: 'Termin Gminy i osobne wnioski o działania',
        description:
          'Gmina wyznaczyła 12 października jako termin odpowiedzi na wniosek o dokumenty. Zawiadomienia Gminy i UMWM nie obejmują osobnych wniosków o działania.',
        url: 'https://www.facebook.com/groups/1759173624939954/permalink/2302641127259865/',
      },
      {
        month: '2026-09',
        monthLabel: 'Wrzesień 2026',
        title: 'Terminy odpowiedzi i role instytucji',
        description:
          'Pełny harmonogram pierwszej rundy oraz wyjaśnienie, dlaczego potrzebne są odpowiedzi KPP, MZDW, Marszałka i Gminy.',
        url: 'https://www.facebook.com/groups/1759173624939954/permalink/2307088346815143/',
      },
      {
        month: '2026-09',
        monthLabel: 'Wrzesień 2026',
        title: 'Odpowiedź Gminy i kolejny termin Urzędu Marszałkowskiego',
        description:
          'Gmina opisuje przygotowania do umów dotyczących chodników. Urząd Marszałkowski przesunął termin przekazania dokumentów na 15 października.',
        url: 'https://www.facebook.com/groups/1759173624939954/permalink/2320813645442613/',
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
        get title(): string {
          const totals = kppTotals()
          return `Dane KPP: kolizje ${totals.collisions}, wypadki ${totals.accidents}`
        },
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
    'Po odpowiedzi Gminy chcemy potwierdzić, czy przygotowania obejmują zachodni chodnik na odcinku Przyleśna-Sonaty. Równolegle zbieramy dokumenty potrzebne do oględzin i porównania wariantów.',
  nextSteps: [
    {
      title: 'Sprawdzić odpowiedzi na informację publiczną',
      description:
        'Na odpowiedź UMWM na wniosek o dokumenty organizacji ruchu i projektu BOM nr 266 czekamy do 15 października. Urząd ponownie przesunął termin pismem otrzymanym 16 września. MZDW wyznaczył 25 września dla wniosku o dokumenty dotyczące badanego odcinka. Gmina wyznaczyła 12 października dla wniosku o dokumenty dotyczące DW633.',
    },
    {
      title: 'Ustalić, kto uruchomi analizę i projekt',
      description:
        '18 września 2026 r. sprawdzimy wnioski o działania do MZDW i Marszałka. Nowy termin UMWM dotyczy wyłącznie dokumentów. Częściową odpowiedź Gminy otrzymano 14 września; sporządzono ją 11 września. Do doprecyzowania pozostają oględziny, zakres koncepcji i udział w przygotowaniu bezpiecznego przekraczania jezdni.',
    },
    {
      title: 'Potwierdzić zachodni chodnik na badanym odcinku',
      description:
        'Wysłano jedno pytanie do Gminy o zakres rozmów i umów, których propozycje otrzymała 29 lipca. Czy obejmują chodnik po zachodniej stronie Jana Kazimierza, zwłaszcza od rejonu przejścia i przystanków „Przyleśna” do ul. Sonaty? Czekamy na odpowiedź.',
    },
    {
      title: 'Otrzymać gotową część dokumentów',
      description:
        'Do Urzędu Marszałkowskiego wysłano odpowiedź podtrzymującą wniosek o dokumenty. Poproszono o wcześniejsze przekazanie gotowej części materiałów, bez czekania na skompletowanie pozostałych.',
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
      id: 'event-categories',
      title: 'Zdarzenia drogowe: kolizja i wypadek',
      owner: 'Wydział Ruchu Drogowego Komendy Stołecznej Policji',
      scope: 'objaśnienie pojęć kolizji i wypadku',
      asOf: 'strona sprawdzona 7.09.2026',
      note: 'Objaśnienie pojęć; kwalifikacja lokalnych wpisów pochodzi z odpowiedzi KPP Legionowo.',
      url: 'https://ksp.policja.gov.pl/wrd/sprawy/informacje-dla-obywateli/zdarzenia-drogowe/119593,ZDARZENIA-DROGOWE.html',
    },
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
      title: 'Pismo KPP-RD-1930/26 i późniejsze wyjaśnienia',
      owner: 'KPP Legionowo, Wydział Ruchu Drogowego',
      scope: 'zestawienie SEWiK, skutek i data wypadku z udziałem pieszej oraz podział ról Policji',
      asOf: 'pismo 19.08.2026; treści kolejnych e-maili przekazane 22 i 24.08.2026',
      note: 'Pismo i transkrypcje e-maili są przechowywane niepublicznie. KPP potwierdziła 25.05.2026 r. i omyłkę roku w pierwotnej tabeli.',
    },
    {
      id: 'umwm-extension',
      title: 'Pismo OR-OP-I.1431.113.2026.JG',
      owner: 'Urząd Marszałkowski Województwa Mazowieckiego',
      scope: 'nowy termin dla wniosku o dokumenty organizacji ruchu na DW633 i projektu BOM nr 266',
      asOf: 'pismo z 24.08.2026',
      note: 'Pierwsze zawiadomienie wyznaczało termin 18.09.2026 r.; kolejne, z 16 września, przesunęło go na 15.10.2026 r. Pismo nie zawiera żądanych dokumentów i jest przechowywane niepublicznie ze względu na dane adresata.',
    },
    {
      id: 'umwm-extension-2',
      title: 'Pismo OR-OP-I.1431.113.2026.JG z 16 września: ponowne przedłużenie',
      owner: 'Urząd Marszałkowski Województwa Mazowieckiego',
      scope: 'kolejny termin dla wniosku o dokumenty organizacji ruchu na DW633 i projektu BOM nr 266',
      asOf: 'sporządzone i otrzymane 16.09.2026',
      note: 'Urząd wyznaczył 15.10.2026 r. zamiast 18.09.2026 r., ponownie wskazując obszerny zakres danych z dziesięciu lat. Zawiadomienie nie zawiera dokumentów i nie dotyczy osobnego wniosku o działania. Oryginał pozostaje niepubliczny ze względu na dane adresata.',
    },
    {
      id: 'gmina-extension',
      title: 'Pismo PI.1431.169.2026',
      owner: 'Wójt Gminy Nieporęt',
      scope: 'nowy termin dla wniosku o dokumenty dotyczące działań Gminy przy DW633',
      asOf: 'pismo z 25.08.2026',
      note: 'Gmina wyznaczyła termin 12.10.2026 r. Pismo nie zawiera jeszcze żądanych dokumentów i jest przechowywane niepublicznie ze względu na dane adresata.',
    },
    {
      id: 'mzdw-extension',
      title: 'Pismo W-5.0143.230.2026.1.AW',
      owner: 'Mazowiecki Zarząd Dróg Wojewódzkich',
      scope: 'nowy termin dla wniosku o dokumenty dotyczące badanego odcinka DW633',
      asOf: 'pismo z 31.08.2026',
      note: 'MZDW wyznaczył termin 25.09.2026 r. Pismo nie zawiera jeszcze żądanych dokumentów i jest przechowywane niepublicznie ze względu na dane adresata.',
    },
    {
      id: 'gmina-actions',
      title: 'Pismo IZ.7021.110.2026: wsparcie działań przy DW633',
      owner: 'Wójt Gminy Nieporęt',
      scope: 'odpowiedź na wniosek o działania: propozycje umów z MZDW, planowanie budżetu i koordynacja',
      asOf: 'sporządzone 11.09.2026; otrzymane 14.09.2026',
      note: 'Odpowiedź częściowa. Gmina podaje datę otrzymania propozycji 29.07.2026 i planowanie na 2027 r. oraz kolejne lata. Pismo nie potwierdza podpisania umów, przyznania środków ani terminu budowy. Oryginał pozostaje niepubliczny ze względu na prywatny adres odbiorcy.',
    },
    {
      id: 'accident-date-check',
      title: 'Relacje o potrąceniu pieszej przy Przyleśnej z 25 maja 2026 r.',
      owner: 'Gazeta Powiatowa / Miejski Reporter',
      scope: 'miejsce, uczestnicy i przebieg odpowiadające skorygowanemu wpisowi KPP z 25.05.2026',
      asOf: 'publikacje sprawdzone 23.08.2026',
      note: 'Publikacje pozwoliły wykryć rozbieżność. KPP następnie potwierdziła prawidłowy rok 2026.',
      links: [
        {
          label: 'Gazeta Powiatowa',
          url: 'https://gazetapowiatowa.pl/artykul/nieporet-w-stanislawowie-n2316161',
        },
        {
          label: 'Miejski Reporter',
          url: 'https://miejskireporter.pl/potracenie-na-pasach-piesza-w-szpitalu-policja-zatrzymala-prawo-jazdy-kierowcy/',
        },
      ],
    },
  ],
} satisfies SiteData

const minutesPerDay = 24 * 60

export const trafficScale = {
  get averagePerMinute() { return siteData.traffic.dailyVehicles / minutesPerDay },
  get averageSecondsBetween() { return (minutesPerDay * 60) / siteData.traffic.dailyVehicles },
}

export function kppTotals(): { collisions: number; accidents: number; total: number } {
  return siteData.kppByYear.reduce(
    (totals, year) => ({
      collisions: totals.collisions + year.collisions,
      accidents: totals.accidents + year.accidents,
      total: totals.total + year.collisions + year.accidents,
    }),
    { collisions: 0, accidents: 0, total: 0 },
  )
}
