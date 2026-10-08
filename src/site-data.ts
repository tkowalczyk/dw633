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
    faqTitle: string
    faqIntro: string
    faqLinkLabel: string
    questions: Array<{ id: string; title: string; paragraphs: string[]; sources: Array<{ sourceId: string; label: string }> }>
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
  asOf: '8 października 2026 r.',
  documents: {
    title: 'Dokumenty w sprawie DW633 w Stanisławowie Pierwszym',
    pageTitle: 'Dokumenty w sprawie DW633 | Stanisławów Pierwszy',
    description: 'Źródła danych i historii działań przy DW633 w Stanisławowie Pierwszym. Dokumenty instytucji, zakres informacji i odsyłacze do opracowań.',
    intro: 'Tutaj sprawdzisz, skąd pochodzą dane i opisy działań przy DW633. Każda pozycja podaje autora, zakres informacji i datę. Publiczne materiały otworzysz z odnośników; korespondencję zawierającą dane prywatne opisujemy bez udostępniania załączników.',
    homeIntro: 'Katalog zbiera źródła danych i historii działań. Przy każdym materiale podajemy jego zakres, datę i ograniczenia.',
    linkLabel: 'Przejdź do katalogu dokumentów DW633',
    readings: [
      { sourceIds: ['canard-structure', 'serock-fotoradar-2023'], url: '/chodnik-stanislawow-pierwszy/#faq-fotoradar', label: 'Przeczytaj odpowiedź o fotoradarze' },
      { sourceIds: ['kpp-response', 'event-categories', 'accident-date-check'], url: '/ruch-i-wypadki-dw633/#zdarzenia', label: 'Zobacz zestawienie zdarzeń KPP i korektę roku' },
      { sourceIds: ['gpr-2025'], url: '/ruch-i-wypadki-dw633/#ruch', label: 'Zobacz dane o natężeniu ruchu' },
      { sourceIds: ['bom-266', 'budget-2023', 'delivery-register', 'umwm-extension', 'gmina-extension', 'mzdw-extension', 'gmina-actions', 'umwm-extension-2', 'mzdw-sidewalk', 'umwm-inspection', 'mzdw-point-response', 'mzdw-project-conditions', 'mzdw-continuity-october', 'meeting-request-2026', 'mzdw-documents', 'mzdw-agreement-records', 'umwm-assessment-2025'], url: '/chodnik-stanislawow-pierwszy/#dzialania', label: 'Zobacz historię działań i odpowiedzi instytucji' },
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
      'Sprawa dotyczy ulicy Jana Kazimierza od rejonu przejścia i przystanków Przyleśna do ulicy Sonaty. Chodzi o ciągłość dojścia oraz możliwość bezpiecznego przekraczania jezdni pomiędzy istniejącymi przejściami. Tutaj znajdziesz odpowiedzi na pytania i historię działań.',
    faqTitle: 'Pytania i odpowiedzi',
    faqIntro: 'Dlaczego chodnik, co zatrzymało wcześniejsze prace i co wiadomo o dalszych planach? Odpowiedzi wynikają z otrzymanych pism i dokumentów. Pod każdą znajdziesz datę oraz źródło.',
    faqLinkLabel: 'FAQ: pytania i odpowiedzi o chodniku',
    questions: [
      {
        "id": "chodnik-i-przejscie",
        "title": "Dlaczego zabiegamy o chodnik, a nie tylko o przejście dla pieszych?",
        "paragraphs": [
          "Urząd Marszałkowski w piśmie z 30 grudnia 2025 powiązał możliwość wyznaczenia przejścia z zapewnieniem dojść po obu stronach drogi. W istniejącym układzie uznał brak tych dojść za przeszkodę. Chodnik jest więc częścią rozwiązania problemu przekraczania jezdni. MZDW we wrześniu 2026 dopuścił ocenę nowego przejścia i jego wyposażenia przy projektowaniu chodnika."
        ],
        "sources": [
          {
            "sourceId": "umwm-assessment-2025",
            "label": "Urząd Marszałkowski, 30.12.2025, s. 1"
          },
          {
            "sourceId": "mzdw-point-response",
            "label": "MZDW, 18.09.2026, pkt 4-5"
          }
        ]
      },
      {
        "id": "zachodnia-strona",
        "title": "Dlaczego chodzi o chodnik po zachodniej stronie?",
        "paragraphs": [
          "O zachodni chodnik Gmina występowała już w 2020 i 2023 roku. W piśmie z marca 2023 uzasadniała go poprawą bezpieczeństwa i dojściem do istniejących przejść. MZDW 18 września 2026 wskazał możliwość zaprojektowania zachodniego chodnika na brakujących 410 metrach. W odpowiedzi z 5 października określił kilometraż jako orientacyjny. Zakres całej zachodniej trasy nadal wymaga uzgodnienia."
        ],
        "sources": [
          {
            "sourceId": "mzdw-agreement-records",
            "label": "Wnioski Gminy z 2020 i 2023, załącznik o porozumieniach, s. 1 i 3"
          },
          {
            "sourceId": "mzdw-sidewalk",
            "label": "MZDW, 18.09.2026, propozycja chodnika na 410 m"
          },
          {
            "sourceId": "mzdw-project-conditions",
            "label": "MZDW, 5.10.2026, s. 1; otrzymano 6.10.2026 e-mailem"
          }
        ]
      },
      {
        "id": "wniosek-2020",
        "title": "Dlaczego wniosek Gminy z 2020 roku nie przeszedł wtedy do dalszych prac?",
        "paragraphs": [
          "8 kwietnia 2020 MZDW poinformował o bezterminowym wstrzymaniu rozpatrywania samorządowych wniosków dotyczących współpracy inwestycyjnej. Jako przyczynę wskazał sytuację epidemiczną i ograniczony tryb pracy. Odpowiedź dotyczyła wniosku o około 500 metrów chodnika od rejonu Przyleśnej do Konwaliowej. Nie była oceną technicznej wykonalności chodnika."
        ],
        "sources": [
          {
            "sourceId": "mzdw-agreement-records",
            "label": "Gmina, 25.03.2020, i MZDW, 8.04.2020, załącznik o porozumieniach, s. 1-2"
          }
        ]
      },
      {
        "id": "budzet-obywatelski-2020",
        "title": "Dlaczego odrzucono projekt budżetu obywatelskiego z 2020 roku?",
        "paragraphs": [
          "Znamy wynik, ale nie szczegółowe uzasadnienie. Oficjalny wykaz umieszcza projekt nr 266, dotyczący przejścia, chodnika i doświetlenia na DW633, wśród projektów ocenionych negatywnie. Sam wykaz nie podaje przyczyny odrzucenia ani dokładnego przebiegu. Do wyjaśnienia potrzebna jest karta oceny projektu."
        ],
        "sources": [
          {
            "sourceId": "bom-266",
            "label": "Wykaz projektów po ocenie, 7.09.2020, część II, projekt nr 266, s. 17 PDF"
          }
        ]
      },
      {
        "id": "dokumentacja-2023",
        "title": "Dlaczego w 2023 roku nie wykonano dokumentacji chodników?",
        "paragraphs": [
          "W sprawozdaniu z wykonania budżetu Gmina podała, że zrezygnowała z zadania z powodu braku warunków od zarządcy drogi potrzebnych do dokumentacji. Wykonanie wydatków wyniosło 0,00 zł. Wniosek Gminy z marca 2023 potwierdza wystąpienie o porozumienie i wytyczne. W otrzymanym pakiecie brakuje odpowiedzi, która wyjaśniałaby, dlaczego tych warunków zabrakło."
        ],
        "sources": [
          {
            "sourceId": "budget-2023",
            "label": "Sprawozdanie za 2023, pozycja 21, s. 139 PDF (numer drukowany 138)"
          },
          {
            "sourceId": "mzdw-agreement-records",
            "label": "Gmina, marzec 2023, załącznik o porozumieniach, s. 3"
          }
        ]
      },
      {
        "id": "przejscie-2025",
        "title": "Co było powodem negatywnego stanowiska wobec przejścia w 2025 roku?",
        "paragraphs": [
          "W piśmie z 30 grudnia 2025 Urząd Marszałkowski wskazał brak ciągów pieszych po obu stronach drogi. Przytoczył też pomiar, podczas którego w godzinach 7:40-9:00 jezdnię przekroczyło pięć osób, i ocenił ten ruch jako niewielki. Jednocześnie zwrócił się do Gminy o współpracę z MZDW przy budowie chodnika. Stanowisko dotyczyło przejścia w ówczesnym układzie drogi."
        ],
        "sources": [
          {
            "sourceId": "umwm-assessment-2025",
            "label": "Urząd Marszałkowski, 30.12.2025, s. 1"
          }
        ]
      },
      {
        "id": "pomiar-pieszych",
        "title": "Czy pomiar pięciu osób oznacza, że pieszych jest zbyt mało, by coś zmieniać?",
        "paragraphs": [
          "To wynik obserwacji w godzinach 7:40-9:00 przytoczony w piśmie Urzędu Marszałkowskiego. Pismo nie podaje dnia pomiaru, jego wykonawcy ani pełnej metody. Z tej liczby nie można ustalić całodziennego ruchu pieszych. Do oceny obecnych potrzeb potrzebne są szczegóły pomiaru i zapowiedziana we wrześniu 2026 analiza organizacji ruchu."
        ],
        "sources": [
          {
            "sourceId": "umwm-assessment-2025",
            "label": "Urząd Marszałkowski, 30.12.2025, s. 1"
          },
          {
            "sourceId": "umwm-inspection",
            "label": "Urząd Marszałkowski, 18.09.2026, s. 1"
          }
        ]
      },
      {
        "id": "dzialania-gminy",
        "title": "Co Gmina zrobiła w tej sprawie w 2026 roku?",
        "paragraphs": [
          "19 stycznia Gmina przekazała postulaty mieszkańców, w tym dotyczący chodnika Konwaliowa-Przyleśna 01, i zadeklarowała przygotowanie dokumentacji. 21 kwietnia wystąpiła o porozumienie dotyczące chodników i o doświetlone przejścia, m.in. przy Konwaliowej. We wrześniu potwierdziła otrzymanie pięciu projektów umów i przedstawiła warunki podpisania czterech z nich w 2027 roku. Opisy odcinków w tych pismach różnią się, więc wymagają wspólnego ustalenia zakresu."
        ],
        "sources": [
          {
            "sourceId": "mzdw-agreement-records",
            "label": "Gmina, 19.01, 21.04 i 21.09.2026; MZDW, 28.07.2026; załącznik o porozumieniach, s. 4 i 7-13"
          }
        ]
      },
      {
        "id": "rola-gminy",
        "title": "Dlaczego projekt ma przygotować Gmina, skoro to droga wojewódzka?",
        "paragraphs": [
          "MZDW opisał taki podział zadań w przygotowywanych porozumieniach. Gmina ma opracować dokumentację i uzyskać wymagane uzgodnienia oraz decyzje w ramach pomocy rzeczowej dla województwa. 5 października MZDW potwierdził, że dokumentację zleci Gmina i przekaże projektantowi informacje oraz dokumenty. Warunkiem podpisania porozumienia jest uchwała Rady Gminy dotycząca przyznania środków. Pismo opisuje trwające przygotowania do wstępnego porozumienia."
        ],
        "sources": [
          {
            "sourceId": "mzdw-point-response",
            "label": "MZDW, 18.09.2026, pkt 9"
          },
          {
            "sourceId": "mzdw-project-conditions",
            "label": "MZDW, 5.10.2026, s. 1; otrzymano 6.10.2026 e-mailem"
          }
        ]
      },
      {
        "id": "rok-2027",
        "title": "Czy chodnik powstanie w 2027 roku?",
        "paragraphs": [
          "Pismo Gminy z 21 września 2026 nie podaje terminu budowy. Gmina deklaruje podpisanie czterech umów w 2027 roku po zabezpieczeniu pieniędzy na dokumentację i podjęciu wymaganych uchwał. MZDW 5 października opisał przygotowania do wstępnego porozumienia, bez terminu podpisania i zlecenia projektu. Rok 2027 pozostaje planem dotyczącym umów."
        ],
        "sources": [
          {
            "sourceId": "mzdw-agreement-records",
            "label": "Gmina, 21.09.2026, załącznik o porozumieniach, s. 13"
          },
          {
            "sourceId": "mzdw-point-response",
            "label": "MZDW, 18.09.2026, pkt 8-9"
          },
          {
            "sourceId": "mzdw-project-conditions",
            "label": "MZDW, 5.10.2026, s. 1; otrzymano 6.10.2026 e-mailem"
          }
        ]
      },
      {
        "id": "brakujace-410-metrow",
        "title": "Czym jest brakujące 410 metrów?",
        "paragraphs": [
          "W piśmie z 2 października 2026, otrzymanym 8 października, MZDW wskazał położenie około 410 m między ul. Brzozy a zatoką autobusową przy skrzyżowaniu z Sonaty. Odcinek km ok. 11+000-11+410 ma połączyć dwa sąsiednie zadania i wymaga osobnego porozumienia z Gminą. W przekazanym piśmie nie ma mapy.",
          "MZDW wiąże uwzględnienie tych 410 m z ciągłością drogi dla pieszych i rowerów od rejonu Przyleśnej do ul. Epopei w Nieporęcie. Późniejsze pismo z 5 października określa kilometraż jako orientacyjny; ostateczny zakres ma powstać przy projektowaniu i konsultacjach."
        ],
        "sources": [
          {
            "sourceId": "mzdw-point-response",
            "label": "MZDW, 18.09.2026, pkt 3 i 9"
          },
          {
            "sourceId": "mzdw-sidewalk",
            "label": "MZDW, 18.09.2026, propozycja chodnika na 410 m"
          },
          {
            "sourceId": "mzdw-project-conditions",
            "label": "MZDW, 5.10.2026, s. 1; otrzymano 6.10.2026 e-mailem"
          },
          {
            "sourceId": "mzdw-continuity-october",
            "label": "MZDW, 2.10.2026, s. 1-2; otrzymano 8.10.2026"
          }
        ]
      },
      {
        "id": "zakres-umow",
        "title": "Czy przygotowywane umowy obejmują całą trasę od Przyleśnej do Sonaty?",
        "paragraphs": [
          "Pismo z 2 października 2026, otrzymane 8 października, wyjaśnia cel połączenia odcinków. Według MZDW uwzględnienie brakujących 410 m zapewniłoby ciągłość drogi dla pieszych i rowerów od rejonu Przyleśnej do Epopei, ok. km 10+310-13+900. Te 410 m wymaga osobnego porozumienia i pozostaje poza listą pięciu przygotowywanych zadań.",
          "To warunkowe potwierdzenie celu ciągłości. Nadal nie potwierdzono podpisania porozumień ani przebiegu całej trasy po zachodniej stronie. Pismo z 5 października pozostawia ostateczny zakres projektowaniu i konsultacjom. Przy ustalaniu środków i zlecenia Gmina powinna uwzględnić brakujące połączenie."
        ],
        "sources": [
          {
            "sourceId": "mzdw-agreement-records",
            "label": "MZDW, 28.07.2026, załącznik o porozumieniach, s. 8-9"
          },
          {
            "sourceId": "mzdw-point-response",
            "label": "MZDW, 18.09.2026, pkt 3 i 9"
          },
          {
            "sourceId": "mzdw-sidewalk",
            "label": "MZDW, 18.09.2026, propozycja chodnika na 410 m"
          },
          {
            "sourceId": "mzdw-project-conditions",
            "label": "MZDW, 5.10.2026, s. 1; otrzymano 6.10.2026 e-mailem"
          },
          {
            "sourceId": "mzdw-continuity-october",
            "label": "MZDW, 2.10.2026, s. 1-2; otrzymano 8.10.2026"
          }
        ]
      },
      {
        "id": "przeszkody-gruntowe",
        "title": "Czy wiadomo już o przeszkodach dla budowy chodnika?",
        "paragraphs": [
          "MZDW 5 października 2026 poinformował, że nie posiada obecnie dokumentów dotyczących ewentualnych przeszkód w realizacji inwestycji. Ich sprawdzenie ma być częścią dokumentacji, którą zleci Gmina. To informacja o stanie rozpoznania, a nie potwierdzenie braku przeszkód.",
          "MZDW w piśmie z 25 września 2026 wskazał nieuregulowany stan prawny głównej działki drogowej nr 87. Nie ma ona urządzonej księgi wieczystej, a w ewidencji zapisano posiadanie samoistne Województwa Mazowieckiego; nie potwierdza to własności. Zarząd zgłosił też brak map prawnych granic pasa, projektowych i inwentaryzacyjnych w swoim zasobie. Nowa odpowiedź nie rozstrzyga osobno, czy stan działki wymaga działania przed zleceniem projektu."
        ],
        "sources": [
          {
            "sourceId": "mzdw-documents",
            "label": "MZDW, 25.09.2026, pkt 2-3 i 12"
          },
          {
            "sourceId": "mzdw-point-response",
            "label": "MZDW, 18.09.2026, pkt 3 i 7"
          },
          {
            "sourceId": "mzdw-project-conditions",
            "label": "MZDW, 5.10.2026, s. 1; otrzymano 6.10.2026 e-mailem"
          }
        ]
      },
      {
        "id": "analiza-bezpieczenstwa",
        "title": "Co MZDW odpowiedział w sprawie analizy bezpieczeństwa?",
        "paragraphs": [
          "MZDW w piśmie z 2 października 2026 podtrzymał przeprowadzenie oględzin oraz analiz bezpieczeństwa i przekraczania jezdni przy opracowywaniu projektu. Uzasadnił to odpowiedzialnością projektanta za rozwiązania, które następnie sprawdzą właściwe komórki MZDW. Na pytanie o podstawę odłożenia osobnej analizy odwołał się do tego stanowiska i przygotowywanych porozumień. Nie przedstawił pomiarów ani terenowej oceny badanego odcinka.",
          "Spośród rozwiązań przejściowych MZDW planuje tylko wydłużenie obszaru zabudowanego. Urząd Marszałkowski osobno zapowiedział analizę organizacji ruchu i wizję lokalną. Otrzymane pismo nie odwołuje tej zapowiedzi i nie zawiera wyników wizji."
        ],
        "sources": [
          {
            "sourceId": "mzdw-point-response",
            "label": "MZDW, 18.09.2026, pkt 1-2"
          },
          {
            "sourceId": "umwm-inspection",
            "label": "Urząd Marszałkowski, 18.09.2026, s. 1"
          },
          {
            "sourceId": "mzdw-continuity-october",
            "label": "MZDW, 2.10.2026, s. 1-2; otrzymano 8.10.2026"
          }
        ]
      },
      {
        "id": "sygnalizacja-sonaty",
        "title": "Co wiadomo o uruchomieniu sygnalizacji przy Sonaty?",
        "paragraphs": [
          "Według odpowiedzi MZDW z 25 września 2026 budowa była na końcowym etapie, a procedury dotyczyły podłączenia zasilania. Uruchomienie uzależniono od dopełnienia formalności związanych z energią elektryczną. Pismo nie podaje daty włączenia sygnalizacji."
        ],
        "sources": [
          {
            "sourceId": "mzdw-documents",
            "label": "MZDW, 25.09.2026, pkt 11"
          }
        ]
      },
      {
        "id": "fotoradar",
        "title": "A co z dawnym fotoradarem przy Sonaty?",
        "paragraphs": [
          "W protokole komisji Rady Miejskiej w Serocku z 9 października 2023 zapisano wypowiedź przedstawiciela KPP Legionowo o nieczynnym fotoradarze na DW633. Policjant wskazał ul. Jana Kazimierza i powiedział, że w tej sprawie interweniuje wójt Gminy Nieporęt.",
          "Protokół nie wymienia skrzyżowania z Sonaty, więc dokładna lokalizacja wymaga potwierdzenia. Nie podaje też przyczyny ani daty wyłączenia, właściciela urządzenia czy wyniku interwencji. Jest świadectwem stanu opisanego w 2023 roku, nie potwierdzeniem obecnego stanu technicznego.",
          "Instalacją i utrzymaniem urządzeń systemu automatycznego nadzoru zajmuje się CANARD, jednostka Głównego Inspektoratu Transportu Drogowego. Żeby ocenić możliwość ponownego uruchomienia fotoradaru, trzeba ustalić własność i stan urządzenia oraz poznać dotychczasową korespondencję Gminy z Inspekcją. O te informacje można wystąpić do Gminy i CANARD."
        ],
        "sources": [
          {
            "sourceId": "serock-fotoradar-2023",
            "label": "Protokół komisji w Serocku, 9.10.2023, s. 3"
          },
          {
            "sourceId": "canard-structure",
            "label": "CANARD, zadania wydziałów, sprawdzono 1.10.2026"
          }
        ]
      },
      {
        "id": "nastepny-krok",
        "title": "Jaki następny krok wynika z otrzymanych odpowiedzi?",
        "paragraphs": [
          "Jesteśmy na etapie przygotowania porozumienia i warunków zlecenia dokumentacji. Na zebraniu sołeckim 28 września złożono pani wójt wniosek o projekt budowy chodnika na omawianym odcinku. Złożenie wniosku potwierdził jego autor 6 października. Kolejny krok to stanowisko Gminy wobec tego wniosku: zakres, środki i przewidywany termin zlecenia.",
          "Do podpisania porozumienia MZDW wymaga uchwały Rady Gminy o przyznaniu środków. Najbliższy krok to decyzja Gminy o finansowaniu projektu w planowaniu 2027 i harmonogram jego przygotowania. Dokumentacja ma pozwolić ustalić, kiedy i na jakich warunkach będzie możliwa budowa, albo wskazać konkretne przeszkody. Osobno oczekujemy wyniku zapowiedzianej analizy organizacji ruchu i wizji Urzędu Marszałkowskiego."
        ],
        "sources": [
          {
            "sourceId": "mzdw-agreement-records",
            "label": "Korespondencja z lipca i września 2026, załącznik o porozumieniach, s. 8-13"
          },
          {
            "sourceId": "mzdw-point-response",
            "label": "MZDW, 18.09.2026, pkt 3 i 8-9"
          },
          {
            "sourceId": "umwm-inspection",
            "label": "Urząd Marszałkowski, 18.09.2026, s. 1"
          },
          {
            "sourceId": "mzdw-project-conditions",
            "label": "MZDW, 5.10.2026, s. 1; otrzymano 6.10.2026 e-mailem"
          },
          {
            "sourceId": "meeting-request-2026",
            "label": "Relacja wnioskodawcy z 6.10.2026 o zebraniu 28.09.2026"
          }
        ]
      }
    ],
    waiting: {
      title: 'Na jakie odpowiedzi czekamy?',
      documents: 'Wnioski o dokumenty',
      actions: 'Wnioski o działania',
      note: 'Pakiet MZDW otrzymano 25 września. Uzupełnienie z 5 października otrzymano 6 października e-mailem. 8 października otrzymano także odpowiedź na pisma z 21 i 22 września: lokalizację 410 m, warunek osobnego porozumienia i stanowisko o analizach przy projektowaniu. Termin 12 października dotyczy dokumentów Gminy, a 15 października dokumentów Urzędu Marszałkowskiego. Nie są to terminy odpowiedzi na wniosek z zebrania ani wizji lokalnej.',
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
      { label: 'Pisma z instytucji', value: '12 otrzymanych' },
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
      date: '25.03.2020',
      title: 'Gmina występuje o zachodni chodnik',
      status: 'Wcześniejsze działania',
      confirmed: 'Gmina wnioskowała o około 500 m zachodniego chodnika od rejonu Przyleśnej do Konwaliowej, powołując się na postulaty mieszkańców.',
      pending: 'Historyczny zakres nie jest potwierdzeniem zakresu obecnych projektów umów.',
      sourceId: 'mzdw-agreement-records',
    },
    {
      date: '2023',
      title: 'Niewykonane zadanie projektowe Gminy',
      status: 'Potwierdzone częściowo',
      confirmed:
        'Budżet przewidywał 50 tys. zł na projektowanie chodników wzdłuż DW633. Wykonanie wyniosło 0,00 zł; Gmina wskazała brak warunków od zarządcy drogi.',
      pending:
        'Pakiet z 25 września zawiera wniosek Gminy z marca 2023 o zachodni chodnik w km 10+301-11+549 i 11+695-12+040. Związek tego zakresu z obecnymi zadaniami wymaga wyjaśnienia.',
      sourceId: 'budget-2023',
    },
    {
      date: '30.12.2025',
      title: 'Urząd Marszałkowski opisuje ocenę przejścia',
      status: 'Dokument historyczny otrzymany 25.09.2026',
      confirmed: 'Pismo opisuje wizję i pomiar pięciu osób przekraczających jezdnię w godz. 7:40-9:00. Urząd zwrócił się do Gminy o współpracę z MZDW przy chodniku.',
      pending: 'Nie podano dnia i wykonawcy pomiaru ani pełnej metody. Nie otrzymaliśmy źródłowych arkuszy.',
      sourceId: 'umwm-assessment-2025',
    },
    {
      date: '19.01.2026',
      title: 'Gmina przekazuje postulaty zebrań sołeckich',
      status: 'Wcześniejsze działania',
      confirmed: 'Gmina przekazała Urzędowi Marszałkowskiemu postulaty z zebrań w 2025 r. Deklarowała przygotowanie dokumentacji, m.in. chodnika Konwaliowa-Przyleśna 01.',
      pending: 'Deklaracja nie jest potwierdzeniem wykonania projektu. Dokument nie podaje miesiąca zebrań w 2025 r.',
      sourceId: 'mzdw-agreement-records',
    },
    {
      date: '21.04.2026',
      title: 'Gmina wnioskuje o porozumienie z MZDW',
      status: 'Wcześniejsze działania',
      confirmed: 'Po spotkaniu z 27 lutego, opisanym w piśmie, Gmina wystąpiła o porozumienie dotyczące chodników, m.in. Protazego 01-Sonaty i Konwaliowa-Modrzewiowa, oraz o doświetlone przejście przy Konwaliowej.',
      pending: 'Opis odcinków różni się od styczniowego pisma. Ich strona nie została tu wskazana.',
      sourceId: 'mzdw-agreement-records',
    },
    {
      date: '29.07.2026',
      title: 'Gmina otrzymuje pięć propozycji umów',
      status: 'Przygotowanie współpracy',
      confirmed: 'Według odpowiedzi Gminy propozycje umów otrzymano 29 lipca. Pisma MZDW z 28 lipca opisują m.in. odcinki ok. km 10+310-11+000 i 11+480-13+900.',
      pending: 'W otrzymanym pakiecie są pisma przewodnie, bez projektów umów. Późniejsze pismo podaje km 11+410 zamiast 11+480. MZDW 5 października wyjaśnił, że kilometraż jest orientacyjny; zakres pozostaje do ustalenia.',
      sourceId: 'mzdw-agreement-records',
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
    {
      date: '18.09.2026',
      title: 'MZDW wskazuje 410 m zachodniego chodnika',
      status: 'Stanowisko częściowe',
      confirmed:
        'MZDW widzi możliwość zaprojektowania chodnika po zachodniej stronie DW633 w km 11+000-11+410. Pismo skierowano do Gminy; wnioskodawca otrzymał je do wiadomości 18 września. Zarząd obecnie sam nie planuje projektu ani budowy w tym zakresie, a dalsze prowadzenie zadania wiąże z umową z Gminą.',
      pending:
        'W odpowiedzi otrzymanej 8 października MZDW zlokalizował 410 m między Brzozy a zatoką przy Sonaty i potwierdził potrzebę osobnego porozumienia. Brak mapy i terminów realizacji.',
      sourceId: 'mzdw-sidewalk',
    },
    {
      date: '18.09.2026',
      title: 'Urząd Marszałkowski zapowiada analizę i wizję lokalną',
      status: 'Zapowiedź działań',
      confirmed:
        'Pismo sporządzone i otrzymane 18 września wskazuje potrzebę analizy organizacji ruchu, danych KPP o zdarzeniach i wizji lokalnej. Urząd zapowiada osobną odpowiedź po analizie.',
      pending:
        'Nie podano terminu oględzin ani odpowiedzi z wynikami. Do doprecyzowania pozostaje udział instytucji i obserwacja ruchu pieszego w godzinach szkolnych.',
      sourceId: 'umwm-inspection',
    },
    {
      date: '21.09.2026',
      title: 'Gmina wskazuje warunki podpisania umów w 2027 r.',
      status: 'Stanowisko Gminy otrzymane w pakiecie MZDW',
      confirmed: 'Gmina deklaruje cztery umowy w 2027 r., po zabezpieczeniu środków na dokumentację i uchwałach Rady Gminy. Jedno zadanie dotyczące Michałowa-Grabiny przewiduje wcześniej.',
      pending: 'Potwierdzić, czy planowane umowy obejmą całą zachodnią trasę Przyleśna-Sonaty wraz z 410 m. Rok 2027 nie jest terminem budowy.',
      sourceId: 'mzdw-agreement-records',
    },
    {
      date: '22.09.2026',
      title: 'MZDW wyjaśnia ciągłość chodnika i stanowisko o bezpieczeństwie',
      status: 'Otrzymana odpowiedź punktowa',
      confirmed:
        'Pismo z 18 września otrzymano 22 września. Proponowane 410 m ma uzupełnić przerwę między odcinkami km 10+310-11+000 i 11+410-13+900. Gmina miałaby przygotować dokumentację. MZDW obecnie nie widzi potrzeby analizy bezpieczeństwa, dopuszczając ją przy projektowaniu. Według pisma trwa budowa sygnalizacji przy Sonaty i przygotowanie zmiany obszaru zabudowanego przy Przyleśnej.',
      pending:
        'Odpowiedź na pytanie o podstawę odłożenia analizy otrzymano 8 października. MZDW odwołał się do etapu projektowania i przygotowywanych porozumień, bez przedstawienia pomiarów ani terenowej oceny odcinka. Osobno pozostaje zapowiedziana wizja Urzędu Marszałkowskiego.',
      sourceId: 'mzdw-point-response',
    },
    {
      date: '25.09.2026',
      title: 'MZDW przekazuje odpowiedź i 58 stron dokumentów',
      status: 'Pakiet otrzymany e-mailem',
      confirmed: 'Odpowiedź na wniosek o dokumenty obejmuje pięć PDF-ów. Potwierdza przygotowania Gminy i oczekiwanie sygnalizacji przy Sonaty na zasilanie. MZDW prosi o doprecyzowanie pytania o dokumenty oceniające przeszkody dla infrastruktury pieszej.',
      pending: 'Wysłano pytania o zakres i warunki projektu. W odpowiedzi z 5 października MZDW opisał orientacyjny kilometraż i rozpoznanie przeszkód przy projektowaniu. Pozostaje uzgodnienie celu obejmującego całą zachodnią trasę.',
      sourceId: 'mzdw-documents',
    },
    {
      date: 'potwierdzono 27.09.2026',
      title: 'Wysłano pytania do MZDW o zakres i warunki projektu',
      status: 'E-mail wysłany',
      confirmed: 'Wysłano odpowiedź dotyczącą całej zachodniej trasy, 410 m, rozbieżności kilometrażu oraz wymagań i ocen przeszkód. Post o działaniach Gminy i pytaniu na zebranie sołeckie zgłoszono do grupy.',
      pending: 'MZDW odpowiedział pismem z 5 października, otrzymanym 6 października. Pełna zachodnia trasa pozostaje do uzgodnienia. Zatwierdzenie posta i jego link potwierdzono 28 września.',
      sourceId: 'delivery-register',
    },
    {
      "date": "28.09.2026",
      "title": "Wniosek do pani wójt o projekt budowy chodnika",
      "status": "Złożenie potwierdzone przez wnioskodawcę",
      "confirmed": "Na zebraniu sołeckim złożono pani wójt wniosek o projekt budowy chodnika na odcinku Przyleśna-Sonaty. Wnioskodawca potwierdził to 6 października.",
      "pending": "Uzyskać stanowisko Gminy o zakresie projektu, środkach i terminie następnej czynności. Złożenie wniosku nie oznacza przyjęcia zobowiązania przez Gminę.",
      "sourceId": "meeting-request-2026"
    },
    {
      "date": "6.10.2026",
      "title": "MZDW wyjaśnia warunki zlecenia projektu",
      "status": "Odpowiedź z 5 października otrzymana e-mailem",
      "confirmed": "Dokumentację zleci Gmina. MZDW wymaga uchwały Rady Gminy dotyczącej środków przed podpisaniem porozumienia. Nie posiada dokumentów o ewentualnych przeszkodach; mają zostać sprawdzone przy projektowaniu. Kilometraż jest orientacyjny, a ostateczny zakres ma powstać przy projektowaniu i konsultacjach.",
      "pending": "Uzyskać stanowisko Gminy o środkach na projekt w planowaniu 2027 oraz terminach zlecenia i ukończenia dokumentacji. To następny etap prowadzący do ustalenia możliwości i terminu budowy chodnika.",
      "sourceId": "mzdw-project-conditions"
    },
    {
      "date": "8.10.2026",
      "title": "MZDW lokalizuje 410 m i potwierdza potrzebę osobnego porozumienia",
      "status": "Otrzymano odpowiedź z 2 października",
      "confirmed": "Około 410 m leży między ul. Brzozy a zatoką przy Sonaty. MZDW wiąże uwzględnienie tego odcinka z ciągłością drogi dla pieszych i rowerów od Przyleśnej do Epopei. Potrzebne jest osobne porozumienie. Analizy mają nastąpić przy projektowaniu; spośród rozwiązań przejściowych MZDW planuje tylko wydłużenie obszaru zabudowanego.",
      "pending": "Priorytetem pozostają środki Gminy na projekt i jego zlecenie, z uwzględnieniem brakującego połączenia. Pismo nie podaje terminu budowy. Osobno pozostaje zapowiedziana wizja Urzędu Marszałkowskiego.",
      "sourceId": "mzdw-continuity-october"
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
      {
        month: '2026-09',
        monthLabel: 'Wrzesień 2026',
        title: '410 m chodnika i zapowiedź wizji lokalnej',
        description:
          'Pierwsze pismo MZDW o zachodnim chodniku w km 11+000-11+410 oraz zapowiedź analizy organizacji ruchu i wizji lokalnej przez Urząd Marszałkowski.',
        url: 'https://www.facebook.com/groups/1759173624939954/permalink/2324417808415530/',
      },
      {
        month: '2026-09',
        monthLabel: 'Wrzesień 2026',
        title: 'Ciągłość chodnika i odpowiedź MZDW o bezpieczeństwie',
        description:
          'MZDW wyjaśnia rolę brakujących 410 m i opisuje działania przy Sonaty oraz Przyleśnej. Wysłano pytanie o podstawę oceny, że analiza bezpieczeństwa nie jest teraz potrzebna.',
        url: 'https://www.facebook.com/groups/1759173624939954/permalink/2325492854974692/',
      },
      {
        month: '2026-09',
        monthLabel: 'Wrzesień 2026',
        title: 'Działania Gminy i pytanie o zakres umów',
        description:
          'Przygotowania Gminy w 2026 r. i warunkowy plan umów na 2027 r. Pytanie dotyczy objęcia projektem całej zachodniej trasy Przyleśna-Sonaty, w tym brakujących 410 m.',
        url: 'https://www.facebook.com/groups/1759173624939954/permalink/2330505287806782/',
      },
      {
        month: '2026-10',
        monthLabel: 'Październik 2026',
        title: 'Projekt chodnika: odpowiedź MZDW i następny krok Gminy',
        description: 'MZDW wyjaśnia przygotowanie projektu i rozpoznanie przeszkód. Wniosek o projekt złożono pani wójt na zebraniu. Następny krok dotyczy środków Gminy i harmonogramu prowadzącego do budowy.',
        url: 'https://www.facebook.com/groups/1759173624939954/permalink/2339353946921916/',
      },
    ],
  },
  knowledge: {
    known: [
      {
      "type": "known",
      "title": "410 m między Brzozy a zatoką przy Sonaty wymaga osobnego porozumienia",
      "description": "MZDW w piśmie z 2 października wiąże uwzględnienie tego odcinka z ciągłością drogi dla pieszych i rowerów od Przyleśnej do Epopei. To wskazanie celu i warunku połączenia, bez potwierdzonego terminu budowy.",
      "sourceId": "mzdw-continuity-october"
    },
      {
        "type": "known",
        "title": "Projekt zleci Gmina; trwają przygotowania do porozumienia",
        "description": "MZDW 5 października wskazał uchwałę Rady Gminy o środkach jako warunek podpisania porozumienia. Dokumentację zleci Gmina. Sprawdzenie przeszkód ma być częścią projektu.",
        "sourceId": "mzdw-project-conditions"
      },
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
        title: 'Potrzebna aktualna ocena ruchu pieszego i prędkości',
        description:
          'Pismo UMWM z grudnia 2025 opisuje wcześniejszy pomiar, ale bez dnia, wykonawcy i pełnej metody. Potrzebna jest ocena obecnych tras pieszych, czasu oczekiwania i prędkości pojazdów.',
      },
      {
        type: 'unknown',
        title: 'Potrzebna dokładna granica pasa i rozpoznanie kolizji technicznych',
        description:
          'MZDW 5 października poinformował o braku dokumentów dotyczących ewentualnych przeszkód. Ich sprawdzenie ma nastąpić przy projektowaniu. Stan działki nr 87 opisany we wrześniu wymaga rozpoznania; nie potwierdzono, że blokuje zlecenie projektu.',
        sourceId: 'mzdw-project-conditions',
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
    'Najbliższy krok to decyzja Gminy o środkach na projekt chodnika w planowaniu budżetu na 2027 rok. Wniosek złożono pani wójt na zebraniu 28 września. Chcemy ustalić termin zlecenia i ukończenia projektu, a następnie możliwy termin budowy. Jeśli zadanie nie będzie realizowane, potrzebne jest wskazanie przyczyny.',
  nextSteps: [
    {
      title: 'Sprawdzić odpowiedzi na informację publiczną',
      description:
        'Odpowiedź MZDW na wniosek o dokumenty otrzymano 25 września, a jej uzupełnienie 6 października. Na odpowiedź UMWM na wniosek o dokumenty organizacji ruchu i projektu BOM nr 266 czekamy do 15 października. Gmina wyznaczyła 12 października dla wniosku o dokumenty dotyczące DW633.',
    },
    {
      title: 'Ustalić termin i zakres wizji lokalnej',
      description:
        'Urząd Marszałkowski zapowiada analizę i oględziny w odpowiedzi na wniosek o działania. Wysłano prośbę o termin wizji w godzinach szkolnych i odpowiedzi z wynikami. Podtrzymano ocenę dojść oraz przekraczania jezdni.',
    },
    {
      title: 'Uzyskać stanowisko Gminy wobec wniosku z zebrania',
      description:
        'Na zebraniu sołeckim 28 września złożono pani wójt wniosek o projekt budowy chodnika na omawianym odcinku. Potrzebne są odpowiedź Gminy o zakresie i finansowaniu oraz wskazanie prowadzącego sprawę i terminu następnej czynności. Uchwała Rady Gminy dotycząca środków jest warunkiem porozumienia wskazanym przez MZDW.',
    },
    {
      "title": "Ustalić drogę od projektu do budowy",
      "description": "Po zabezpieczeniu środków potrzebne będą porozumienia i zlecenie dokumentacji przez Gminę. MZDW wskazał potrzebę osobnego porozumienia dla brakujących 410 m między Brzozy a zatoką przy Sonaty. Projekt ma sprawdzić ciągłość trasy, rozwiązania techniczne i ewentualne przeszkody. Na tej podstawie Gmina i MZDW będą mogły określić finansowanie oraz możliwy termin budowy. Chodzi o harmonogram realizacji, a w razie przeszkód o ich wskazanie i sposób usunięcia."
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
      "id": "mzdw-continuity-october",
      "title": "Pismo I-7.448.3.34.2026.4.JW: lokalizacja 410 m i analiza bezpieczeństwa",
      "owner": "Mazowiecki Zarząd Dróg Wojewódzkich",
      "scope": "odpowiedź na pisma z 21 i 22 września: położenie 410 m, ciągłość trasy, osobne porozumienie i działania przejściowe",
      "asOf": "sporządzone 2.10.2026, otrzymane 8.10.2026",
      "note": "Dwie strony. Około 410 m między Brzozy a zatoką przy Sonaty; uwzględnienie odcinka miałoby zapewnić ciągłość drogi dla pieszych i rowerów od Przyleśnej do Epopei. Potrzebne osobne porozumienie. Analizy MZDW wiąże z projektowaniem; spośród rozwiązań przejściowych planuje tylko wydłużenie obszaru zabudowanego. Bez mapy, potwierdzonego finansowania i terminu robót. Oryginał pozostaje niepubliczny ze względu na dane adresata."
    },
    {
      "id": "mzdw-project-conditions",
      "title": "Pismo W-5.0143.230.2026.3.AW: warunki projektu i zakres dokumentacji",
      "owner": "Mazowiecki Zarząd Dróg Wojewódzkich",
      "scope": "uchwała o środkach, projekt zlecany przez Gminę, rozpoznanie przeszkód i orientacyjny kilometraż",
      "asOf": "sporządzone 5.10.2026, otrzymane 6.10.2026 e-mailem",
      "note": "Jedna strona, odpowiedź na uzupełnienie wniosku z 27.09. MZDW nie posiada obecnie dokumentów o ewentualnych przeszkodach. Ich weryfikację wiąże z projektem, a ostateczny zakres z projektowaniem i konsultacjami. Nie potwierdza objęcia całej zachodniej trasy. Oryginał zawiera prywatny e-mail i pozostaje niepubliczny."
    },
    {
      "id": "meeting-request-2026",
      "title": "Wniosek o projekt chodnika złożony pani wójt na zebraniu sołeckim",
      "owner": "relacja wnioskodawcy",
      "scope": "złożenie wniosku o projekt budowy chodnika na odcinku Przyleśna-Sonaty",
      "asOf": "zebranie 28.09.2026; relacja przekazana 6.10.2026",
      "note": "Wnioskodawca potwierdził złożenie wniosku pani wójt. Nie przekazano dokładnej treści, formy ani odpowiedzi Gminy. Relacja dokumentuje jego działanie, nie przyjęcie zobowiązania przez Gminę."
    },
    {
      id: 'mzdw-documents',
      title: 'Odpowiedź W-5.0143.230.2026.2.AW i pakiet dokumentów',
      owner: 'Mazowiecki Zarząd Dróg Wojewódzkich',
      scope: 'wniosek o dokumenty: grunt, przygotowania inwestycji, sygnalizacja i wcześniejsza korespondencja',
      asOf: 'sporządzone i otrzymane e-mailem 25.09.2026',
      note: 'Pięć PDF-ów, 58 stron. Pismo wskazuje nieuregulowany stan działki nr 87, procedury zasilania sygnalizacji i potrzebę doprecyzowania pkt 12. Odpowiedź uzupełnia wiedzę o sprawie, nie potwierdza wykonalności całej trasy. Pakiet zawiera dane prywatne; nie udostępniamy skanów.',
    },
    {
      id: 'mzdw-agreement-records',
      title: 'Korespondencja Gminy i MZDW o projektach umów',
      owner: 'Gmina Nieporęt i Mazowiecki Zarząd Dróg Wojewódzkich',
      scope: 'wcześniejsze wnioski z 2020 i 2023 oraz przygotowania od stycznia do września 2026',
      asOf: 'dokumenty przekazane przez MZDW 25.09.2026',
      note: 'Załącznik o porozumieniach, 14 stron. Pisma Gminy: 19.01, 21.04 i 21.09.2026; pisma przewodnie MZDW do pięciu projektów umów: 28.07.2026. Brak samych projektów. Różnica początku odcinka: ok. 11+480 w lipcu, 11+410 we wrześniu. Deklaracja czterech umów na 2027 jest warunkowa. Otrzymanie propozycji 29.07 potwierdza osobna odpowiedź Gminy z 11.09.',
    },
    {
      id: 'umwm-assessment-2025',
      title: 'Pismo NI-D-I.8026.245.2025.SR: wcześniejsza ocena przejścia',
      owner: 'Urząd Marszałkowski Województwa Mazowieckiego',
      scope: 'opis analizy, wizji, pomiaru pieszych i potrzeby dojść do przejścia',
      asOf: 'sporządzone 30.12.2025, otrzymane w pakiecie MZDW 25.09.2026',
      note: 'Strony 1-2 załącznika z wnioskami i petycjami. Opis pięciu osób przekraczających jezdnię w godz. 7:40-9:00, bez dnia pomiaru, wykonawcy i pełnej metody. Brak źródłowych arkuszy. Nie przypisujemy wykonania pomiaru MZDW ani UMWM. Skany nie są publiczne.',
    },
    {
      id: 'mzdw-point-response',
      title: 'Pismo I-7.448.3.34.2026.1.JW: ciągłość chodnika i ocena bezpieczeństwa',
      owner: 'Mazowiecki Zarząd Dróg Wojewódzkich',
      scope: 'odpowiedź na wniosek z 18 sierpnia: zakres chodników, dokumentacja po stronie Gminy, analiza bezpieczeństwa i organizacja ruchu',
      asOf: 'sporządzone 18.09.2026, otrzymane 22.09.2026',
      note: '410 m ma uzupełnić dwa odcinki objęte przygotowywanymi porozumieniami. MZDW obecnie nie widzi potrzeby analizy bezpieczeństwa. Pismo opisuje sygnalizację przy Sonaty w budowie i przygotowanie zmiany obszaru zabudowanego przy Przyleśnej. Nie jest odpowiedzią na późniejsze pismo wnioskodawcy. Oryginał pozostaje niepubliczny ze względu na dane adresata.',
    },
    {
      id: 'mzdw-sidewalk',
      title: 'Pismo I-7.448.3.34.2026.2.JW: chodnik i współpraca z Gminą',
      owner: 'Mazowiecki Zarząd Dróg Wojewódzkich',
      scope: 'możliwość zaprojektowania zachodniego chodnika na DW633 w km 11+000-11+410; propozycja współpracy',
      asOf: 'sporządzone i otrzymane 18.09.2026',
      note: 'Pismo do Gminy, otrzymane do wiadomości. MZDW obecnie sam nie planuje projektu ani budowy w tym zakresie. Później otrzymana odpowiedź z końcówką .1.JW wyjaśnia rolę 410 m jako połączenia sąsiednich odcinków i proponowaną rolę Gminy. Oryginał z załącznikami pozostaje niepubliczny ze względu na dane prywatne.',
    },
    {
      id: 'umwm-inspection',
      title: 'Pismo NI-D-I.8026.272.2026.SR: analiza i wizja lokalna',
      owner: 'Urząd Marszałkowski Województwa Mazowieckiego, Departament Nieruchomości i Infrastruktury',
      scope: 'wniosek o działania: analiza organizacji ruchu, informacje KPP o zdarzeniach i wizja lokalna',
      asOf: 'sporządzone i otrzymane 18.09.2026',
      note: 'Zapowiedź osobnej odpowiedzi po analizie, bez terminu wizji i załatwienia wniosku. Nie dotyczy odrębnej sprawy o dokumenty z terminem 15 października. Oryginał pozostaje niepubliczny ze względu na dane adresata.',
    },
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
      title: 'Rejestr wysyłki i dalszej korespondencji',
      owner: 'dokumentacja inicjatywy',
      scope: '8 osobnych przesyłek e-Doręczeń z 18.08.2026 oraz dalsze odpowiedzi wnioskodawcy',
      asOf: '6.10.2026',
      note: 'Wysłanie dalszych odpowiedzi do MZDW i Urzędu Marszałkowskiego potwierdził wnioskodawca. 27 września potwierdził także wysłanie e-maila do MZDW o zakres i warunki projektu oraz zgłoszenie posta do grupy. 28 września przekazał link do zatwierdzonego wpisu. Nie jest to techniczny dowód doręczenia. Dokumentacja pozostaje niepubliczna ze względu na dane prywatne.',
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
    {
      "id": "canard-structure",
      "title": "Struktura CANARD i zadania wydziałów",
      "owner": "Centrum Automatycznego Nadzoru nad Ruchem Drogowym",
      "scope": "instalacja urządzeń i współpraca z zarządcami dróg",
      "asOf": "strona sprawdzona 1.10.2026; brak daty publikacji",
      "note": "Opis kompetencji CANARD. Nie jest stanowiskiem w sprawie lokalizacji urządzenia na odcinku Przyleśna-Sonaty.",
      "url": "https://www.canard.gitd.gov.pl/cms/o-nas/struktura-canard"
    },
    {
      "id": "serock-fotoradar-2023",
      "title": "Nieczynny fotoradar na DW633 w protokole komisji w Serocku",
      "owner": "Rada Miejska w Serocku, wypowiedź przedstawiciela KPP Legionowo",
      "scope": "fotoradar przy ul. Jana Kazimierza i interwencja wójta Nieporętu, s. 3",
      "asOf": "posiedzenie 9.10.2023, dokument sprawdzony 1.10.2026",
      "note": "Historyczna wzmianka. Bez dokładnej lokalizacji przy Sonaty, przyczyny wyłączenia i wyniku interwencji. Wypowiedź o odmowie z 2021 roku na s. 4 dotyczy osobnej sprawy Serocka.",
      "url": "https://www.bip.serock.pl/plik,19208,protokol-z-posiedzenia-komisji-rozwoju-gospodarczego-innowacji-i-bezpieczenstwa-w-dniu-9-pazdziernika-2023r.pdf"
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
