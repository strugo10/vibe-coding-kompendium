/**
 * APLIKACJA AKADEMII VIBE CODINGU & SZTUKI PROMPTINGU
 * Logika interfejsu, ankieta profilu (RODO-friendly), dynamiczne motywy wizualne,
 * adaptacyjne banki pytań diagnostycznych, 4 dedykowane wersje dyplomów,
 * grywalizacja, odznaki, skrzynia nagród, syntezator audio, optymalizacja mobilna (iOS/Android)
 * oraz pełna dostępność WCAG 2.1/2.2 AA/AAA (NVDA, VoiceOver, JAWS).
 *
 * ZASADA KOLEJNOŚCI DLA CZYTNIKÓW EKRANU (NVDA / VoiceOver):
 * Zawsze najpierw odczytywana jest właściwa nazwa opcji / czynności (np. "Usuń kod", "Kopiuj Prompt"),
 * a dopiero po niej krótki opis ikonki informacyjnej (np. "(ikona kosza)", "(ikona schowka)").
 */

// Stan globalny aplikacji
const STATE = {
  activeSubpage: 'page-welcome', // 'page-welcome' | 'page-profile' | 'page-diagnostic' | 'page-safety' | 'page-tools' | 'page-daily-tasks' | 'page-all-tasks' | 'page-rewards'
  onboardingSteps: {
    welcome: true,
    profile: false,
    diagnostic: false,
    safety: false,
    tools: false
  },
  courseUnlocked: false,
  safetyAccepted: false,
  geminiVerifiedResponse: '',
  viewMode: 'daily', // 'daily' | 'all'
  currentDay: 1,
  totalDays: 34,
  completedTasks: new Set(),
  taskStatuses: {}, // taskId -> 'passed' | 'failed' | 'skipped' | 'pending'
  diplomaGradeApproved: false, // czy kursant zatwierdził swoją ocenę na dyplomie
  showImprovementList: false,  // czy rozwinięto listę zadań do poprawy
  soundEnabled: true,
  contrastHigh: false,
  iphoneInvertMode: false, // czy włączono tryb adaptacji do inwersji kolorów iPhone
  fontSize: 'normal', // 'normal' | 'large' | 'xlarge'
  filterStage: 'all',
  filterStatus: 'all',
  searchQuery: '',
  testResult: null,
  streakDays: 1,
  lastActiveDate: '',
  learnerName: 'Adept Vibe Codingu',
  certId: 'CERT-VIBE-2026-X89K2',
  currentTheme: 'auto', // 'auto' | 'teen' | 'adult' | 'senior' | 'creative'
  selectedDiplomaStyle: null,
  inlineFocusMode: false,
  taskNotes: {},        // taskId -> treść notatki
  sandboxCreations: [], // zapisane dzieła z piaskownicy
  authorFeedbacks: [],  // uwagi i sugestie dla twórcy kompendium
  previousSubpage: 'page-daily-tasks', // podstrona do powrotu z uwag
  safetyChecklist: [],
  userProfile: {
    ageGroup: 'adult',    // 'teen' | 'adult' | 'senior'
    gender: 'neutral',    // 'female' | 'male' | 'neutral'
    interest: 'business', // 'gaming' | 'business' | 'hobby' | 'creative'
    isConfigured: false
  }
};

// =========================================================================
// SYSTEM PUNKTACJI, STATUSÓW ZADAŃ I OCENY KOŃCOWEJ NA DYPLOMIE
// =========================================================================
function getTaskPoints(task) {
  if (!task) return 10;
  if (typeof task.points === 'number' && task.points > 0) return task.points;
  const stage = task.stage || 1;
  if (stage === 1) return 10; // Etap 1: Fundamenty (15 zadań * 10 = 150 pkt)
  if (stage === 2) return 15; // Etap 2: Architektura promptu C-C-O-F (20 zadań * 15 = 300 pkt)
  if (stage === 3) return 20; // Etap 3: Mini-aplikacje i logika (20 zadań * 20 = 400 pkt)
  if (stage === 4) return 20; // Etap 4: Debugowanie konsoli F12 (15 zadań * 20 = 300 pkt)
  if (stage === 5) return 25; // Etap 5: Nowoczesne środowiska AI (15 zadań * 25 = 375 pkt)
  if (stage === 6) return 30; // Etap 6: Publikacja, bazy i finał (15 zadań * 30 = 450 pkt)
  return 10;
}

function getTaskStatus(taskId) {
  if (!STATE.taskStatuses) STATE.taskStatuses = {};
  if (STATE.taskStatuses[taskId]) return STATE.taskStatuses[taskId];
  if (STATE.completedTasks && STATE.completedTasks.has(taskId)) {
    STATE.taskStatuses[taskId] = 'passed';
    return 'passed';
  }
  return 'pending';
}

function setTaskStatus(taskId, status) {
  if (!STATE.taskStatuses) STATE.taskStatuses = {};
  STATE.taskStatuses[taskId] = status;
  if (status === 'passed') {
    STATE.completedTasks.add(taskId);
  } else {
    STATE.completedTasks.delete(taskId);
  }
}

function calculateScore() {
  const isBusinessLearner = (STATE.userProfile && STATE.userProfile.ageGroup === 'adult' && STATE.userProfile.interest === 'business');
  let totalPossiblePoints = 0;
  let earnedPoints = 0;
  let passedCount = 0;
  let failedCount = 0;
  let skippedCount = 0;
  let pendingCount = 0;

  if (typeof TASKS_DATA !== 'undefined' && Array.isArray(TASKS_DATA)) {
    TASKS_DATA.forEach(t => {
      // Zadania dodatkowe biznesowe są opcjonalne i nie obciążają uczniów innych profili
      if (t.isBusinessAddon && !isBusinessLearner) {
        return;
      }
      const pts = getTaskPoints(t);
      totalPossiblePoints += pts;
      const st = getTaskStatus(t.id);
      if (st === 'passed') {
        earnedPoints += pts;
        passedCount++;
      } else if (st === 'failed') {
        failedCount++;
      } else if (st === 'skipped') {
        skippedCount++;
      } else {
        pendingCount++;
      }
    });
  } else {
    totalPossiblePoints = 1975;
  }

  const percentage = totalPossiblePoints > 0 ? Math.round((earnedPoints / totalPossiblePoints) * 100) : 0;

  let grade = {
    code: '2.0',
    name: 'W trakcie nauki (Wymaga uzupełnienia)',
    short: 'Do uzupełnienia (2.0)',
    badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
    stars: '⭐',
    description: 'Do odebrania oficjalnego dyplomu wymagane jest minimum 50% punktów (ocena Dostateczna). Rozwiąż brakujące zadania, aby podnieść wynik.',
    isPassing: false
  };

  if (percentage >= 90) {
    grade = {
      code: '6.0',
      name: 'Celujący (Złoty Certyfikat z Wyróżnieniem Mistrza)',
      short: 'Celujący (6.0)',
      badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
      stars: '⭐⭐⭐⭐⭐⭐',
      description: 'Absolutny mistrzowski wynik! Pełna biegłość w formułowaniu promptów C-C-O-F, tworzeniu aplikacji bez barier i eliminacji błędów.',
      isPassing: true
    };
  } else if (percentage >= 75) {
    grade = {
      code: '5.0',
      name: 'Bardzo dobry (Srebrny Certyfikat Architekta AI)',
      short: 'Bardzo dobry (5.0)',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
      stars: '⭐⭐⭐⭐⭐',
      description: 'Znakomita wiedza praktyczna, wysoka samodzielność w kierowaniu sztuczną inteligencją i rozwiązywaniu problemów technicznych.',
      isPassing: true
    };
  } else if (percentage >= 60) {
    grade = {
      code: '4.0',
      name: 'Dobry (Brązowy Certyfikat Praktyka)',
      short: 'Dobry (4.0)',
      badgeClass: 'bg-sky-500/20 text-sky-300 border border-sky-500/40',
      stars: '⭐⭐⭐⭐',
      description: 'Solidne fundamenty, sprawne tworzenie mini-narzędzi i umiejętność rozbijania dużych pomysłów na małe kroki LEGO.',
      isPassing: true
    };
  } else if (percentage >= 50) {
    grade = {
      code: '3.0',
      name: 'Dostateczny (Certyfikat Ukończenia Podstawowego)',
      short: 'Dostateczny (3.0)',
      badgeClass: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
      stars: '⭐⭐⭐',
      description: 'Podstawowe umiejętności pracy z asystentami AI i bezpiecznego testowania kodu w przeglądarce.',
      isPassing: true
    };
  }

  return {
    totalTasks,
    totalPossiblePoints,
    earnedPoints,
    passedCount,
    failedCount,
    skippedCount,
    pendingCount,
    percentage,
    grade
  };
}

// Zestaw złotych myśli i cytatów ekspertów AI (10 inspirujących myśli)
const MOTIVATIONAL_QUOTES = [
  {
    quote: "Najgorętszym nowym językiem programowania jest teraz język naturalny: polski i angielski.",
    author: "Andrej Karpathy, współzałożyciel OpenAI i były szef AI w Tesla"
  },
  {
    quote: "W erze AI nie wygrywa ten, kto pamięta składnię pętli for, lecz ten, kto potrafi precyzyjnie opisać problem i podzielić go na klocki.",
    author: "Simon Willison, twórca Django i badacz AI"
  },
  {
    quote: "Sztuczna inteligencja nie zastąpi programistów. Ale programista i twórca używający AI zastąpi tego, który go unika.",
    author: "Jensen Huang, CEO Nvidia"
  },
  {
    quote: "Wkraczamy w erę, w której pojedyncza osoba z wizją i sztuczną inteligencją może stworzyć to, na co kiedyś potrzebny był cały zespół programistów.",
    author: "Sam Altman, CEO OpenAI"
  },
  {
    quote: "Najważniejszą umiejętnością przyszłości nie jest kodowanie znak po znaku, lecz zdolność do zadawania właściwych pytań i krytycznego myślenia.",
    author: "Satya Nadella, CEO Microsoft"
  },
  {
    quote: "Sztuczna inteligencja to nowa elektryczność. Każdy z nas może nauczyć się korzystać z jej mocy do rozwiązywania realnych problemów.",
    author: "Prof. Andrew Ng, Stanford University & Google Brain"
  },
  {
    quote: "Komputer to rower dla naszego umysłu. Sztuczna inteligencja to rakieta kosmiczna, ale to Ty decydujesz, dokąd nią polecisz.",
    author: "Inspiracja Steve Jobs & Nowa Era AI"
  },
  {
    quote: "Najlepszy kod to taki, którego nie musiałeś pisać ręcznie, a działa bezbłędnie i rozwiązuje Twój problem.",
    author: "Złota Zasada Vibe Codingu"
  },
  {
    quote: "Błąd w konsoli F12 to nie porażka – to najdokładniejsza instrukcja dla Twojego wirtualnego stażysty, co ma natychmiast poprawić.",
    author: "Zasada Vibe Debuggera"
  },
  {
    quote: "Zacznij od zera. Zbuduj prostą wizytówkę, stoper, kalkulator. Za miesiąc będziesz tworzyć rzeczy, o których rok temu nawet nie marzyłeś.",
    author: "Manifest Twórców Nowej Ery"
  }
];

let currentQuoteIndex = 0;

// Baza Prestiżowych Odznak (8 Osiągnięć)
const BADGES = [
  { id: 1, icon: "🐣", iconLabel: "ikona pisklęcia", title: "Pierwsza Iskra", desc: "Ukończ pierwsze ćwiczenie w akademii", check: (c) => c >= 1 },
  { id: 2, icon: "🔥", iconLabel: "ikona płomienia", title: "Trzydniowy Płomień", desc: "Utrzymaj passę 3 dni nauki z rzędu", check: () => STATE.streakDays >= 3 },
  { id: 3, icon: "🎯", iconLabel: "ikona tarczy celu", title: "Reżyser Promptu", desc: "Zrealizuj 10 zadań prompt engineeringu", check: (c) => c >= 10 },
  { id: 4, icon: "🔍", iconLabel: "ikona lupy", title: "Detektyw Błędów", desc: "Rozwiąż 25 zadań i opanuj diagnostykę F12", check: (c) => c >= 25 },
  { id: 5, icon: "⛰️", iconLabel: "ikona szczytu górskiego", title: "Połowa Drogi", desc: "Pokonaj 50 zadań – jesteś za półmetkiem!", check: (c) => c >= 50 },
  { id: 6, icon: "🏗️", iconLabel: "ikona budowy", title: "Architekt Aplikacji", desc: "75 zadań na koncie – budujesz pełne systemy", check: (c) => c >= 75 },
  { id: 7, icon: "⚡", iconLabel: "ikona błyskawicy", title: "Tygodniowy Tytan", desc: "7 dni nieprzerwanej aktywności w kursie", check: () => STATE.streakDays >= 7 },
  { id: 8, icon: "👑", iconLabel: "ikona korony", title: "Mistrz Vibe Codingu", desc: "Komplet 100 zadań zrealizowany od zera do twórcy!", check: (c) => c >= 100 }
];

// Skrzynia Nagród Merytorycznych
const REWARDS = {
  25: {
    title: "Złota Ściągawka: 10 Uniwersalnych Szablonów Promptów",
    subtitle: "Odblokowano za 25 zadań",
    icon: "🎁",
    iconLabel: "(ikona prezentu)",
    content: `
      <p class="font-bold text-amber-300 mb-2">Oto 10 gotowych wzorców promptów, które rozwiążą 90% codziennych problemów z AI:</p>
      <ol class="list-decimal list-inside space-y-2 text-slate-200">
        <li><strong>Formuła C-C-O-F:</strong> <em>"Kontekst: Jestem właścicielem piekarni. Cel: Chcę formularz zamówień tortów. Ograniczenia: Czysty HTML bez bibliotek. Format: Jeden gotowy plik do pobrania."</em></li>
        <li><strong>Reduktor Żargonu:</strong> <em>"Wyjaśnij mi ten fragment kodu tak, jakbyś tłumaczył to 10-latkowi, używając metafory klocków Lego."</em></li>
        <li><strong>Odwrócona Inżynieria:</strong> <em>"Oto zrzut ekranu / opis interfejsu aplikacji Spotify. Wygeneruj kod HTML i Tailwind odtwarzający ten układ."</em></li>
        <li><strong>Wirtualny Konsultant WCAG:</strong> <em>"Przeanalizuj ten kod pod kątem dostępności cyfrowej dla osób niewidomych i wskaż brakujące atrybuty ARIA."</em></li>
        <li><strong>Audytor Bezpieczeństwa:</strong> <em>"Czy ten kod JavaScript zawiera podatności na ataki XSS lub wycieki danych? Wskaż słabe punkty."</em></li>
        <li><strong>Generator Danych Testowych:</strong> <em>"Wygeneruj tablicę JSON z 10 realistycznymi polskimi nazwiskami, miastami i kwotami zamówień."</em></li>
        <li><strong>Diagnostyk Błędów Konsoli:</strong> <em>"Wklejam błąd z konsoli F12 oraz funkcję. Wskaż dokładną przyczynę i podaj poprawioną wersję."</em></li>
        <li><strong>Architekt Bazy Danych:</strong> <em>"Zaproponuj prostą strukturę tabeli SQL dla bazy rezerwacji biurek w małym biurze."</em></li>
        <li><strong>Optymalizator Stylu:</strong> <em>"Przebuduj ten surowy interfejs w nowoczesny, minimalistyczny styl Tailwind z subtelnymi cieniami."</em></li>
        <li><strong>Symulator Użytkownika:</strong> <em>"Wciel się w rolę zniecierpliwionego klienta na telefonie i przetestuj intuicyjność mojego formularza."</em></li>
      </ol>
    `
  },
  50: {
    title: "Niezbędnik Reżysera: Formuła 4C i Diagnostyka F12",
    subtitle: "Odblokowano za 50 zadań",
    icon: "📘",
    iconLabel: "(ikona podręcznika)",
    content: `
      <p class="font-bold text-amber-300 mb-2">Metodologia Profesjonalnego Vibe Codingu (Formuła 4C):</p>
      <ul class="list-disc list-inside space-y-2 text-slate-200 mb-4">
        <li><strong>1. Context (Kontekst):</strong> Zawsze określaj rolę AI, platformę (np. 'przeglądarka bez serwera') oraz grupę odbiorców.</li>
        <li><strong>2. Constraint (Ograniczenia):</strong> Wskaż technologie, których AI NIE MOŻE używać (np. 'zero frameworków', 'bez instalacji npm').</li>
        <li><strong>3. Criteria (Kryteria sukcesu):</strong> Co musi się wydarzyć, aby zadanie uznać za skończone (np. 'po kliknięciu dane zapisują się w localStorage').</li>
        <li><strong>4. Check (Weryfikacja):</strong> Zawsze proś AI o podanie 3 przypadków testowych do natychmiastowego sprawdzenia w przeglądarce.</li>
      </ul>
      <p class="font-bold text-indigo-300 mb-1">Złote Zasady Konsoli F12:</p>
      <p class="text-slate-300 text-xs leading-relaxed">
        Gdy coś nie działa: 1) Otwórz F12 -> Console. 2) Czerwony tekst oznacza błąd. 3) Kliknij prawym przyciskiem myszy, wybierz 'Copy object' lub zaznacz komunikat. 4) Wklej go do AI ze słowami: <em>"Po kliknięciu przycisku 'Zapisz' konsola rzuciła ten błąd. Oto mój plik JS. Wyjaśnij co poszło nie tak i podaj tylko poprawioną funkcję."</em>
      </p>
    `
  },
  75: {
    title: "Katalog Darmowych Bibliotek CDN i Bezpłatnych API",
    subtitle: "Odblokowano za 75 zadań",
    icon: "🌐",
    iconLabel: "(ikona globusa)",
    content: `
      <p class="font-bold text-amber-300 mb-2">Biblioteki, które dołączysz jednym tagiem &lt;script&gt; bez żadnej instalacji:</p>
      <div class="space-y-3 text-slate-200 text-xs">
        <div><strong class="text-white">Chart.js (Wykresy):</strong> <code>https://cdn.jsdelivr.net/npm/chart.js</code> — Słupki, koła, linie w 5 linijkach kodu.</div>
        <div><strong class="text-white">Canvas-Confetti (Efekty sukcesu):</strong> <code>https://cdn.jsdelivr.net/npm/canvas-confetti</code> — Wystrzał konfetti przy sukcesie.</div>
        <div><strong class="text-white">Lucide Icons (Ponad 1000 ikon):</strong> <code>https://unpkg.com/lucide@latest</code> — Ostre wektorowe symbole.</div>
        <div><strong class="text-white">PapaParse (Obsługa CSV/Excel):</strong> <code>https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js</code> — Czytanie plików Excel w przeglądarce.</div>
        <div><strong class="text-white">Leaflet (Interaktywne Mapy):</strong> <code>https://unpkg.com/leaflet@1.9.4/dist/leaflet.js</code> — Darmowe mapy OpenStreetMap.</div>
        <div><strong class="text-white">Darmowe API kursów walut NBP:</strong> <code>https://api.nbp.pl/api/exchangerates/tables/A/?format=json</code> — Aktualne kursy walut bez kluczy API.</div>
      </div>
    `
  },
  100: {
    title: "Oficjalny Super Dyplom Mistrzowski",
    subtitle: "Odblokowano za komplet 100 zadań",
    icon: "👑",
    iconLabel: "(ikona korony)",
    content: `
      <p class="font-bold text-emerald-300 mb-2">Gratulacje! Pokonałeś całą 34-dniową drogę od zera do twórcy!</p>
      <p class="text-slate-300 text-xs leading-relaxed mb-4">
        Opanowałeś dekompozycję problemów, tworzenie narzędzi w HTML/JS/Tailwind, debugowanie w konsoli F12, pracę w Cursor IDE, v0.dev, Bolt.new i Lovable.
      </p>
      <button type="button" onclick="closeRewardModal(); openDiplomaModal();" class="touch-target px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition inline-flex items-center gap-1.5">
        <span>Otwórz i Wydrukuj Swój Dyplom Teraz</span>
        <span role="img" aria-label="(ikona biretu)">🎓</span>
      </button>
    `
  }
};

// =========================================================================
// ADAPTACYJNE BANKI PYTAŃ DIAGNOSTYCZNYCH (DOPASOWANE DO PROFILU)
// =========================================================================
const DIAGNOSTIC_BANKS = {
  teen: [
    {
      id: 1,
      q: "Chcesz stworzyć własnego bota na Discorda, który automatycznie wita nowych graczy na Twoim serwerze. Jak sformułujesz prompt dla AI?",
      options: [
        { text: "Zrób mi jakiegoś bota na Discorda do witania.", score: 1 },
        { text: "Napisz w JavaScript bota na Discorda, który pisze siema gdy ktoś wejdzie na kanał.", score: 2 },
        { text: "Jesteś twórcą botów w discord.js v14. Napisz skrypt bota: gdy nowy użytkownik dołączy, wyślij na kanał #powitania estetyczny embed ze zmiennymi: avatar gracza, nick, numer na serwerze i link do regulaminu. Dodaj instrukcję konfiguracji tokena.", score: 3 }
      ]
    },
    {
      id: 2,
      q: "W Twojej mini-grze w przeglądarce postać utknęła w ścianie, a w konsoli F12 pojawił się błąd: 'Uncaught TypeError: Cannot read property x of undefined'. Co robisz?",
      options: [
        { text: "Piszę do AI: 'Gra nie działa, postać utknęła, napraw to szybko!'.", score: 1 },
        { text: "Pytam AI: dlaczego w grach postacie czasami blokują się w ścianach?", score: 2 },
        { text: "Kopiuję dokładny błąd z konsoli i wklejam do AI z fragmentem kodu kolizji: 'Konsola wyrzuca TypeError na linii 45 przy detekcji ściany. Oto funkcja checkCollision(). Zdiagnozuj dlaczego obiekt jest undefined i podaj poprawkę'.", score: 3 }
      ]
    },
    {
      id: 3,
      q: "Chcesz stworzyć symulator otwierania skrzynek (lootboxów) z losowymi przedmiotami i animacją. Od czego zaczniesz?",
      options: [
        { text: "Każę AI od razu wygenerować wielką trójwymiarową grę jak Counter-Strike.", score: 1 },
        { text: "Poproszę o gotowy kod HTML z przyciskiem do losowania skinów.", score: 2 },
        { text: "Dekomponuję projekt: najpierw proszę o tablicę obiektów JS z przedmiotami i szansami procentowymi (drop rate), potem o prosty przycisk losowania, a na końcu o efekt animacji obracania bębna.", score: 3 }
      ]
    },
    {
      id: 4,
      q: "Chcesz nadać stronie profilu klanu styl mrocznego cyberpunku z neonowymi podświetleniami. Jak to opiszesz?",
      options: [
        { text: "Zrób żeby było ciemno i hakersko.", score: 1 },
        { text: "Użyj czarnego tła i zielonych neonowych liter jak w Matrixie.", score: 2 },
        { text: "Zastosuj paletę Tailwind: tło bg-slate-950, akcenty neon cyan #00f0ff i magenta #f43f5e, szklany efekt glassmorphism (backdrop-blur) na kartach ekwipunku oraz subtelne poświaty glow na przyciskach akcji.", score: 3 }
      ]
    },
    {
      id: 5,
      q: "AI wygenerowało kod z biblioteką fizyki do mini-gry, ale po otwarciu pliku ekran jest czarny. Jaki jest Twój pierwszy odruch?",
      options: [
        { text: "Kasuję plik i uznaję, że sztuczna inteligencja nie umie robić gier.", score: 1 },
        { text: "Klikam odśwież stronę 10 razy z nadzieją, że samo zaskoczy.", score: 2 },
        { text: "Wciskam klawisz F12, sprawdzam zakładkę Console (błędy składni) oraz Network (czy link CDN do biblioteki pobrał się poprawnie z kodem 200).", score: 3 }
      ]
    }
  ],

  business: [
    {
      id: 1,
      q: "Potrzebujesz wewnętrznego kalkulatora do porównania zarobków na umowie B2B vs Umowa o Pracę z uwzględnieniem podatków. Jak sformułujesz polecenie?",
      options: [
        { text: "Zrób kalkulator wynagrodzeń w Polsce.", score: 1 },
        { text: "Napisz w HTML kalkulator pensji netto z polskim podatkiem i ZUS.", score: 2 },
        { text: "Jesteś analitykiem finansowym i programistą front-end. Zbuduj jednostronicowy kalkulator w HTML/JS: pole kwoty brutto, wybór formy (B2B ryczałt/liniowy vs UoP), wyliczenie ZUS, składki zdrowotnej i podatku. Wyświetl wynik w czytelnej tabeli z wykresem słupkowym kosztów pracodawcy.", score: 3 }
      ]
    },
    {
      id: 2,
      q: "W firmie otrzymujesz co tydzień plik CSV z 1000 wierszy transakcji i musisz błyskawicznie wyciągnąć podsumowanie sprzedaży wg miast. Co zrobisz?",
      options: [
        { text: "Próbuję ręcznie kopiować wiersze w notatniku.", score: 1 },
        { text: "Pytam AI: jak w Excelu zrobić tabelę przestawną z pliku CSV?", score: 2 },
        { text: "Zlecam AI stworzenie lokalnego narzędzia: 'Napisz lekki plik HTML z biblioteką PapaParse, gdzie przeciągam plik CSV metodą drag&drop, a skrypt automatycznie grupuje dane wg kolumny Miasto, sumuje Przychód i pozwala pobrać czysty raport Excel'.", score: 3 }
      ]
    },
    {
      id: 3,
      q: "Chcesz zautomatyzować generowanie ofert handlowych w PDF dla klientów. Jak podejdziesz do architektury rozwiązania?",
      options: [
        { text: "Każę AI od razu stworzyć cały skomplikowany portal z płatnościami online.", score: 1 },
        { text: "Poproszę o statyczny dokument Worda, w którym będę ręcznie podmieniać dane.", score: 2 },
        { text: "Formuła 4C: Projektuję formularz z polami kontrahenta i pozycjami kosztorysu, przygotowuję szablon HTML zgodny z brandingiem firmy i dołączam bibliotekę html2pdf.js generującą gotowy plik PDF jednym kliknięciem.", score: 3 }
      ]
    },
    {
      id: 4,
      q: "Skrypt raportowy przestał działać, bo w nowym systemie format daty zmienił się z YYYY-MM-DD na DD.MM.YYYY. Co mówisz AI?",
      options: [
        { text: "Wszystko się popsuło, napisz cały skrypt od zera.", score: 1 },
        { text: "Ręcznie zmieniam format daty w 1000 wierszach pliku wejściowego.", score: 2 },
        { text: "Wskazuję konkretną funkcję parsera: 'W pliku wejściowym zmienił się format daty na DD.MM.YYYY. Zaktualizuj funkcję parseDate(), aby obsługiwała oba formaty za pomocą prostego wyrażenia regularnego, nie dotykając reszty logiki'.", score: 3 }
      ]
    },
    {
      id: 5,
      q: "Jaka jest najważniejsza rola człowieka w biznesowym Vibe Codingu w erze modeli Claude i Gemini?",
      options: [
        { text: "Człowiek tylko bezmyślnie kopiuje kod i od razu wrzuca na serwery produkcyjne.", score: 1 },
        { text: "Człowiek musi uczyć się na pamięć wszystkich funkcji i pisać kod znak po znaku.", score: 2 },
        { text: "Człowiek jest architektem biznesowym: formułuje jasne wymagania, pilnuje poufności danych i RODO, weryfikuje poprawność obliczeń i podejmuje decyzje wdrożeniowe.", score: 3 }
      ]
    }
  ],

  hobby: [
    {
      id: 1,
      q: "Chcesz mieć na swoim komputerze lub telefonie prosty, bardzo czytelny domowy notes do zapisywania wizyt u lekarzy i dawkowania leków. Jak sformułujesz polecenie?",
      options: [
        { text: "Chcę notes na leki i lekarzy.", score: 1 },
        { text: "Zrób prostą stronę internetową do wpisywania leków z dużą czcionką.", score: 2 },
        { text: "Stwórz w jednym pliku HTML przyjazny, prosty planer leków i wizyt. Wymagania: bardzo duża i wyraźna czcionka, kontrastowe przyciski, możliwość wpisania nazwy leku, godziny i zaznaczenia 'zażyte'. Dane mają zapisywać się w przeglądarce, aby nie zniknęły po wyłączeniu urządzenia.", score: 3 }
      ]
    },
    {
      id: 2,
      q: "Chcesz uporządkować ulubione przepisy kulinarne z podziałem na obiady, zupy i ciasta. Od czego zaczniesz z AI?",
      options: [
        { text: "Zrób wielką książkę kucharską na komputerze.", score: 1 },
        { text: "Poproszę o stronę z trzema zakładkami do wpisywania dań.", score: 2 },
        { text: "Krok po kroku: najpierw proszę AI o przejrzysty szkielet strony z 3 dużymi przyciskami kategorii, potem dodajemy proste pole wyszukiwania po składnikach (np. 'jabłka'), a na końcu przycisk 'Drukuj przepis na A4'.", score: 3 }
      ]
    },
    {
      id: 3,
      q: "Na stronie wygenerowanej przez AI tekst jest zbyt drobny i męczy wzrok. Co mówisz sztucznej inteligencji?",
      options: [
        { text: "Nic nie widzę, to jest do niczego.", score: 1 },
        { text: "Powiększ mi wszystko na stronie.", score: 2 },
        { text: "Zwiększ bazowy rozmiar czcionki do 18px, zmień kolor liter na głęboką czerń (#111827), a tło na łagodny jasny krem (#fefce8). Dodaj wyraźne obramowania wokół przycisków, aby łatwo było w nie trafić.", score: 3 }
      ]
    },
    {
      id: 4,
      q: "Co robisz, gdy po otwarciu pliku w przeglądarce przycisk nie reaguje na kliknięcie?",
      options: [
        { text: "Uznaję, że komputer się zepsuł i wyłączam zasilanie.", score: 1 },
        { text: "Klikam bardzo szybko wiele razy z nadzieją, że zadziała.", score: 2 },
        { text: "Klikam prawym przyciskiem myszy -> 'Zbadaj' (lub klawisz F12), sprawdzam zakładkę 'Konsola', kopiuję czerwony komunikat błędu i proszę AI o naprawienie konkretnej linijki.", score: 3 }
      ]
    },
    {
      id: 5,
      q: "Dlaczego Vibe Coding jest idealnym narzędziem dla osób dojrzałych z bogatym doświadczeniem życiowym?",
      options: [
        { text: "Bo nie trzeba myśleć – komputer robi wszystko bez udziału człowieka.", score: 1 },
        { text: "Bo informatyka przestała w ogóle istnieć.", score: 2 },
        { text: "Bo najważniejsza jest życiowa mądrość, precyzyjne nazywanie potrzeb i logiczne myślenie w języku ojczystym, a całą żmudną 'robotę murarską' wykonuje wirtualny stażysta AI.", score: 3 }
      ]
    }
  ],

  creative: [
    {
      id: 1,
      q: "Chcesz stworzyć interaktywną galerię swoich fotografii lub obrazów z filtrowaniem wg nastroju (np. mglisty poranek, zachód słońca). Jak pokierujesz AI?",
      options: [
        { text: "Zrób galerię zdjęć z filtrami.", score: 1 },
        { text: "Zbuduj stronę portfolio fotografa w Tailwind CSS z filtrami kategorii.", score: 2 },
        { text: "Wciel się w rolę artystycznego dyrektora kreatywnego. Stwórz minimalistyczną galerię opartą na siatce masonry: kafelki zdjęć z subtelnym powiększeniem (hover zoom), filtrowanie po tagach nastroju bez przeładowania strony oraz elegancki pełnoekranowy podgląd lightbox.", score: 3 }
      ]
    },
    {
      id: 2,
      q: "Chcesz, aby strona miała niezwykły, artystyczny klimat i dynamiczne przejścia kolorystyczne. Jak to opiszesz w prompcie?",
      options: [
        { text: "Niech to wygląda ładnie i kolorowo.", score: 1 },
        { text: "Dodaj ładne gradienty i animacje w CSS.", score: 2 },
        { text: "Zaprojektuj estetykę 'Dark Studio': głębokie aksamitne tło, subtelny animowany gradient w nagłówku przechodzący powoli między fioletem a koralem, elegancki szeryfowy font dla tytułów i płynne przejścia transition: all 0.4s ease.", score: 3 }
      ]
    },
    {
      id: 3,
      q: "Tworzysz interaktywną opowieść paragrafową (grę tekstową, w której czytelnik wybiera ścieżki). Jak zorganizujesz strukturę danych z pomocą AI?",
      options: [
        { text: "Napisz mi długie opowiadanie w HTML.", score: 1 },
        { text: "Zrób stronę, gdzie klika się przyciski i tekst się zmienia.", score: 2 },
        { text: "Poproszę AI o przygotowanie obiektu JavaScript STORY_NODES, gdzie każdy węzeł ma: id, tekst fabularny, nastrojowy cytat oraz tablicę wyborów prowadzących do kolejnych węzłów. Dopiero potem tworzymy interfejs czytelnika.", score: 3 }
      ]
    },
    {
      id: 4,
      q: "Generowany przez AI interfejs jest poprawny technicznie, ale sztampowy i 'bez duszy'. Co robisz?",
      options: [
        { text: "Zostawiam tak jak jest, bo komputer wie lepiej.", score: 1 },
        { text: "Piszę do AI: 'Zmień ten design na fajniejszy'.", score: 2 },
        { text: "Stosuję technikę referencji stylistycznej: 'Przebuduj styl na wzór szwajcarskiego modernizmu / klimatu vintage editorial: asymetryczna siatka, odważna typografia, dużo światła i oddechu między sekcjami oraz wyraziste mikro-interakcje'.", score: 3 }
      ]
    },
    {
      id: 5,
      q: "Co jest największą siłą artysty lub pisarza w erze Vibe Codingu?",
      options: [
        { text: "Szybkość pisania na klawiaturze.", score: 1 },
        { text: "Znajomość bibliotek React i Node.js.", score: 2 },
        { text: "Wyobraźnia wizualna, zmysł estetyczny, zdolność budowania metafor i umiejętność precyzyjnego opisania emocjonalnego doświadczenia odbiorcy.", score: 3 }
      ]
    }
  ]
};

let currentDiagnosticAnswers = {};

// =========================================================================
// SYNTEZATOR DŹWIĘKÓW (WEB AUDIO API - DZIAŁA TEŻ NA IOS SAFARI)
// =========================================================================
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
  if (!STATE.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignoruj ograniczenia autoodtwarzania na urządzeniach mobilnych
  }
}

function playSuccessChime() {
  playTone(523.25, 'triangle', 0.12, 0.15);
  setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.15), 90);
  setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.18), 180);
}

function playVictoryFanfare() {
  playTone(523.25, 'sine', 0.12, 0.15);
  setTimeout(() => playTone(659.25, 'sine', 0.12, 0.15), 110);
  setTimeout(() => playTone(783.99, 'sine', 0.15, 0.18), 220);
  setTimeout(() => playTone(1046.50, 'triangle', 0.45, 0.22), 330);
}

function playClickSound() {
  playTone(400, 'sine', 0.04, 0.05);
}

// =========================================================================
// OBSŁUGA MENU MOBILNEGO I WBUDOWANEGO TRYBU SKUPIENIA (IPHONE / RWD)
// =========================================================================
function toggleMobileMenu(forceOpen) {
  const nav = document.getElementById('main-tools-nav');
  const btn = document.getElementById('btn-mobile-menu-toggle');
  const label = document.getElementById('mobile-menu-label');
  if (!nav || !btn) return;

  const isCurrentlyHidden = nav.classList.contains('hidden');
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : isCurrentlyHidden;

  playClickSound();

  if (shouldOpen) {
    nav.classList.remove('hidden');
    nav.classList.add('flex');
    btn.setAttribute('aria-expanded', 'true');
    if (label) label.textContent = 'Zamknij menu';
    announceSR('Rozwinięto menu narzędzi i ułatwień dostępu.');
  } else {
    nav.classList.add('hidden');
    nav.classList.remove('flex');
    btn.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = 'Menu';
    announceSR('Zwinięto menu narzędzi.');
  }
}

function toggleInlineFocusMode(forceEnable) {
  const nextVal = typeof forceEnable === 'boolean' ? forceEnable : !STATE.inlineFocusMode;
  STATE.inlineFocusMode = nextVal;
  playClickSound();

  const banner = document.getElementById('inline-focus-banner');
  const mobLabel = document.getElementById('mobile-focus-label');

  if (STATE.inlineFocusMode) {
    document.body.classList.add('inline-focus-mode');
    if (banner) banner.classList.remove('hidden');
    if (mobLabel) mobLabel.textContent = 'Pełny widok';
    setViewMode('daily');
    toggleMobileMenu(false);
    const heading = document.getElementById('current-day-title-display') || document.getElementById('tasks-heading');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    }
    announceSR(`Włączono Tryb Skupienia dla Dnia ${STATE.currentDay}. Wyświetlane są wyłącznie dzisiejsze zadania i narzędzia.`);
  } else {
    document.body.classList.remove('inline-focus-mode');
    if (banner) banner.classList.add('hidden');
    if (mobLabel) mobLabel.textContent = 'Tryb Skupienia';
    announceSR('Przywrócono pełny widok kompendium.');
  }
}

// =========================================================================
// ARCHITEKTURA OKIEN DIALOGOWYCH (NVDA, VOICEOVER & WCAG FOCUS MANAGEMENT)
// =========================================================================
let currentOpenModal = null;
let lastFocusedElement = null;

function setBackgroundInert(isInert) {
  const elements = [
    document.querySelector('header'),
    document.getElementById('main-content'),
    document.querySelector('footer')
  ];

  elements.forEach(el => {
    if (!el) return;
    if (isInert) {
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    } else {
      el.removeAttribute('inert');
      el.removeAttribute('aria-hidden');
    }
  });

  const allModals = document.querySelectorAll('[role="dialog"]');
  allModals.forEach(m => {
    if (isInert && m !== currentOpenModal) {
      m.setAttribute('aria-hidden', 'true');
      m.setAttribute('inert', '');
    } else if (!isInert) {
      m.removeAttribute('inert');
    }
  });
}

function openModal(modalId, triggerElement = null, preferredFocusSelector = null) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  if (window.innerWidth < 1024) {
    toggleMobileMenu(false);
  }

  lastFocusedElement = triggerElement || document.activeElement;
  currentOpenModal = modal;

  setBackgroundInert(true);

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    let focusTarget = null;
    if (preferredFocusSelector) {
      focusTarget = modal.querySelector(preferredFocusSelector);
    }

    if (!focusTarget) {
      focusTarget = modal.querySelector('button[role="tab"][aria-selected="true"], input:checked, input[type="text"]:not([readonly]), button:not([onclick*="close"]):not([disabled]), [tabindex="0"]');
    }

    if (!focusTarget) {
      focusTarget = modal.querySelector('button:not([disabled])');
    }

    if (!focusTarget) {
      const title = modal.querySelector('h3, h2, [role="heading"]');
      if (title) {
        title.setAttribute('tabindex', '-1');
        focusTarget = title;
      }
    }

    if (!focusTarget) {
      const content = modal.querySelector('.modal-content') || modal;
      content.setAttribute('tabindex', '-1');
      focusTarget = content;
    }

    if (focusTarget) {
      focusTarget.focus();
    }
  }, 70);

  playClickSound();
}

function closeModal(modalIdOrEl) {
  const modal = typeof modalIdOrEl === 'string' ? document.getElementById(modalIdOrEl) : modalIdOrEl;
  if (!modal) return;

  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');

  currentOpenModal = null;

  setBackgroundInert(false);

  setTimeout(() => {
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function' && document.contains(lastFocusedElement) && lastFocusedElement !== document.body) {
      lastFocusedElement.focus();
    } else {
      const mainHeading = document.getElementById('hero-title');
      if (mainHeading) {
        mainHeading.setAttribute('tabindex', '-1');
        mainHeading.focus();
      }
    }
    lastFocusedElement = null;
  }, 60);

  playClickSound();
}

// =========================================================================
// SYSTEM PODSTRON I BRAMEK ONBOARDINGU (ARCHITEKTURA SEKWENCYJNA v3.0.0)
// =========================================================================

function isSubpageLocked(pageId) {
  // Jeśli kurs został odblokowany lub użytkownik ma już ukończone jakiekolwiek zadanie - wszystko odblokowane!
  if (STATE.courseUnlocked || (STATE.completedTasks && STATE.completedTasks.size > 0)) {
    return false;
  }
  switch (pageId) {
    case 'page-welcome':
      return false;
    case 'page-profile':
      return false; // Wstęp jest zaliczony z automatu
    case 'page-diagnostic':
      return !STATE.onboardingSteps.profile;
    case 'page-safety':
      return !STATE.onboardingSteps.diagnostic;
    case 'page-tools':
      return !STATE.onboardingSteps.safety;
    case 'page-daily-tasks':
    case 'page-all-tasks':
    case 'page-addons':
    case 'page-rewards':
      return !STATE.courseUnlocked;
    case 'page-feedback':
      return false; // Zawsze odblokowane dla kursanta
    default:
      return false;
  }
}

function updateSubpageNavUI() {
  const tabs = [
    { id: 'page-welcome', btnId: 'tab-btn-welcome', iconId: null },
    { id: 'page-profile', btnId: 'tab-btn-profile', iconId: 'tab-icon-profile' },
    { id: 'page-diagnostic', btnId: 'tab-btn-diagnostic', iconId: 'tab-icon-diagnostic' },
    { id: 'page-safety', btnId: 'tab-btn-safety', iconId: 'tab-icon-safety' },
    { id: 'page-tools', btnId: 'tab-btn-tools', iconId: 'tab-icon-tools' },
    { id: 'page-daily-tasks', btnId: 'tab-btn-daily-tasks', iconId: 'tab-icon-daily-tasks' },
    { id: 'page-all-tasks', btnId: 'tab-btn-all-tasks', iconId: 'tab-icon-all-tasks' },
    { id: 'page-addons', btnId: 'tab-btn-addons', iconId: 'tab-icon-addons' },
    { id: 'page-rewards', btnId: 'tab-btn-rewards', iconId: 'tab-icon-rewards' }
  ];

  const addonsBtn = document.getElementById('tab-btn-addons');
  if (addonsBtn) {
    const isBusiness = (STATE.userProfile && STATE.userProfile.ageGroup === 'adult' && STATE.userProfile.interest === 'business');
    if (isBusiness) {
      addonsBtn.classList.remove('hidden');
      addonsBtn.style.display = 'inline-flex';
    } else {
      addonsBtn.classList.add('hidden');
      addonsBtn.style.display = 'none';
    }
  }

  tabs.forEach(tab => {
    const btn = document.getElementById(tab.btnId);
    if (!btn) return;
    const isCurrent = (STATE.activeSubpage === tab.id);
    const locked = isSubpageLocked(tab.id);

    if (isCurrent) {
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.removeAttribute('aria-current');
    }

    if (locked) {
      btn.classList.add('opacity-50', 'cursor-not-allowed');
      btn.setAttribute('aria-disabled', 'true');
      btn.title = 'Ten etap jest zablokowany. Ukończ wcześniejsze kroki przygotowania.';
    } else {
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
      btn.removeAttribute('aria-disabled');
      btn.removeAttribute('title');
    }
  });

  // Odświeżenie ikonek statusu w zakładkach nawigacji
  const pIcon = document.getElementById('tab-icon-profile');
  if (pIcon) {
    if (STATE.onboardingSteps.profile) {
      pIcon.textContent = '✓';
      pIcon.setAttribute('aria-label', '(etap ukończony)');
    } else {
      pIcon.textContent = '👤';
      pIcon.setAttribute('aria-label', '(ikona profilu)');
    }
  }

  const dIcon = document.getElementById('tab-icon-diagnostic');
  if (dIcon) {
    if (STATE.onboardingSteps.diagnostic) {
      dIcon.textContent = '✓';
      dIcon.setAttribute('aria-label', '(etap ukończony)');
    } else if (isSubpageLocked('page-diagnostic')) {
      dIcon.textContent = '🔒';
      dIcon.setAttribute('aria-label', '(etap zablokowany)');
    } else {
      dIcon.textContent = '⚡';
      dIcon.setAttribute('aria-label', '(ikona testu)');
    }
  }

  const sIcon = document.getElementById('tab-icon-safety');
  if (sIcon) {
    if (STATE.onboardingSteps.safety) {
      sIcon.textContent = '✓';
      sIcon.setAttribute('aria-label', '(etap ukończony)');
    } else if (isSubpageLocked('page-safety')) {
      sIcon.textContent = '🔒';
      sIcon.setAttribute('aria-label', '(etap zablokowany)');
    } else {
      sIcon.textContent = '🛡️';
      sIcon.setAttribute('aria-label', '(ikona tarczy)');
    }
  }

  const tIcon = document.getElementById('tab-icon-tools');
  if (tIcon) {
    if (STATE.onboardingSteps.tools || STATE.courseUnlocked) {
      tIcon.textContent = '✓';
      tIcon.setAttribute('aria-label', '(etap ukończony)');
    } else if (isSubpageLocked('page-tools')) {
      tIcon.textContent = '🔒';
      tIcon.setAttribute('aria-label', '(etap zablokowany)');
    } else {
      tIcon.textContent = '🧪';
      tIcon.setAttribute('aria-label', '(ikona laboratorium)');
    }
  }

  const dailyIcon = document.getElementById('tab-icon-daily-tasks');
  if (dailyIcon) {
    dailyIcon.textContent = STATE.courseUnlocked ? '🎯' : '🔒';
    dailyIcon.setAttribute('aria-label', STATE.courseUnlocked ? '(ikona celu)' : '(kurs zablokowany)');
  }

  const allIcon = document.getElementById('tab-icon-all-tasks');
  if (allIcon) {
    allIcon.textContent = STATE.courseUnlocked ? '📚' : '🔒';
    allIcon.setAttribute('aria-label', STATE.courseUnlocked ? '(ikona książek)' : '(katalog zablokowany)');
  }

  const addonsIcon = document.getElementById('tab-icon-addons');
  if (addonsIcon) {
    addonsIcon.textContent = STATE.courseUnlocked ? '💼' : '🔒';
    addonsIcon.setAttribute('aria-label', STATE.courseUnlocked ? '(ikona teczki)' : '(dodatki zablokowane)');
  }

  const rewIcon = document.getElementById('tab-icon-rewards');
  if (rewIcon) {
    rewIcon.textContent = STATE.courseUnlocked ? '🏆' : '🔒';
    rewIcon.setAttribute('aria-label', STATE.courseUnlocked ? '(ikona pucharu)' : '(nagrody zablokowane)');
  }
}

function switchSubpage(pageId, announceText) {
  if (isSubpageLocked(pageId)) {
    playTone(280, 'sawtooth', 0.2, 0.1);
    let msg = "Ten etap jest zablokowany. Aby odblokować właściwy kurs, przejdź po kolei etapy przygotowawcze.";
    if (!STATE.onboardingSteps.profile) {
      msg = "Zanim przejdziesz dalej, wybierz swój profil twórcy (Krok 2).";
      goToStep('page-profile');
    } else if (!STATE.onboardingSteps.diagnostic) {
      msg = "Zanim przejdziesz dalej, wykonaj wstępny test diagnostyczny (Krok 3).";
      goToStep('page-diagnostic');
    } else if (!STATE.onboardingSteps.safety) {
      msg = "Zanim przejdziesz dalej, zatwierdź zasady bezpieczeństwa i BHP (Krok 4).";
      goToStep('page-safety');
    } else if (!STATE.courseUnlocked) {
      msg = "Zanim przejdziesz do kursu, zaloguj się do Google Gemini i wklej odpowiedź testową (Krok 5).";
      goToStep('page-tools');
    }
    alert(msg);
    announceSR(msg);
    return;
  }

  // Ukryj wszystkie podstrony
  const subpages = document.querySelectorAll('.subpage-view');
  subpages.forEach(sec => {
    sec.classList.add('hidden');
    sec.setAttribute('hidden', '');
  });

  // Pokaż wybraną podstronę
  const target = document.getElementById(pageId);
  if (!target) return;
  target.classList.remove('hidden');
  target.removeAttribute('hidden');

  STATE.activeSubpage = pageId;
  saveState();
  updateSubpageNavUI();

  // Akcje specyficzne dla podstron
  if (pageId === 'page-daily-tasks') {
    STATE.viewMode = 'daily';
    renderTasks();
  } else if (pageId === 'page-all-tasks') {
    STATE.viewMode = 'all';
    renderTasks();
  } else if (pageId === 'page-addons') {
    renderAddonsPage();
  } else if (pageId === 'page-rewards') {
    updateBadgesUI();
    updateRewardsUI();
    renderDiplomaCanvas();
    renderSandboxArchiveGrid();
  } else if (pageId === 'page-diagnostic') {
    renderSubpageDiagnosticQuestions();
  } else if (pageId === 'page-profile') {
    syncProfileFormValues();
  } else if (pageId === 'page-safety') {
    const chk = document.getElementById('chk-safety-agree');
    if (chk) chk.checked = Boolean(STATE.safetyAccepted);
  } else if (pageId === 'page-tools') {
    if (STATE.geminiVerifiedResponse) {
      const inp = document.getElementById('gemini-verification-input');
      if (inp) inp.value = STATE.geminiVerifiedResponse;
    }
    if (STATE.courseUnlocked) {
      const card = document.getElementById('course-unlocked-card');
      if (card) card.classList.remove('hidden');
    }
  } else if (pageId === 'page-feedback') {
    renderAuthorFeedbackList();
    updateAuthorFeedbackCounter();
  }

  // Ustawienie fokusu na H1 dla czytników ekranu (NVDA / VoiceOver)
  const h1 = target.querySelector('h1');
  if (h1) {
    if (!h1.hasAttribute('tabindex')) {
      h1.setAttribute('tabindex', '-1');
    }
    h1.focus();
  }

  // Przewiń widok na początek treści podstrony
  const mainEl = document.getElementById('main-content');
  if (mainEl) {
    mainEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const headingText = h1 ? h1.textContent.trim().replace(/\s+/g, ' ') : '';
  const defaultAnnounce = headingText ? `Przełączono na podstronę: ${headingText}` : 'Zmieniono widok podstrony.';
  announceSR(announceText || defaultAnnounce);
  playClickSound();
}

function goToStep(pageId) {
  if (pageId === 'page-profile') {
    STATE.onboardingSteps.welcome = true;
  }
  switchSubpage(pageId);
}

// -------------------------------------------------------------------------
// PODSTRONA 2: PROFIL TWÓRCY
// -------------------------------------------------------------------------
function handleSubpageProfileSubmit(event) {
  if (event) event.preventDefault();
  const form = document.getElementById('page-profile-form');
  if (!form) return;

  const ageEl = form.querySelector('input[name="page-profile-age"]:checked');
  const genderEl = form.querySelector('input[name="page-profile-gender"]:checked');
  const interestEl = form.querySelector('input[name="page-profile-interest"]:checked');

  if (!ageEl || !genderEl || !interestEl) {
    alert("Proszę odpowiedzieć na wszystkie 3 pytania profilowe.");
    return;
  }

  STATE.userProfile = {
    ageGroup: ageEl.value,
    gender: genderEl.value,
    interest: interestEl.value,
    isConfigured: true
  };
  STATE.onboardingSteps.profile = true;

  if (STATE.currentTheme === 'auto') {
    if (STATE.userProfile.ageGroup === 'teen') applyTheme('teen');
    else if (STATE.userProfile.ageGroup === 'senior') applyTheme('senior');
    else applyTheme('adult');
  }

  saveState();
  updateProfileUI();
  playSuccessChime();

  renderSubpageDiagnosticQuestions();
  switchSubpage('page-diagnostic', 'Profil zapisany! Przechodzisz do etapu 3: Test diagnostyczny.');
}

// -------------------------------------------------------------------------
// PODSTRONA 3: TEST DIAGNOSTYCZNY
// -------------------------------------------------------------------------
let currentSubpageDiagnosticAnswers = {};

function renderSubpageDiagnosticQuestions() {
  const container = document.getElementById('page-diagnostic-questions-container');
  if (!container) return;

  const questions = getActiveDiagnosticBank();
  const badge = document.getElementById('diagnostic-profile-badge');
  if (badge) {
    const ageNames = { teen: 'Nastolatek', adult: 'Dorosły', senior: 'Senior' };
    const interestNames = { gaming: 'Gry i Boty', business: 'Biznes i Kariera', hobby: 'Dom i Pasje', creative: 'Kreatywność i Design' };
    badge.textContent = `Dopasowano pytania do: ${ageNames[STATE.userProfile.ageGroup] || 'Twórca'} • ${interestNames[STATE.userProfile.interest] || 'Ogólne'}`;
  }

  container.innerHTML = questions.map((q, qIndex) => `
    <fieldset class="p-4 sm:p-5 rounded-2xl border border-slate-700 bg-slate-800/70" id="subpage-diag-q-${q.id}">
      <legend class="text-xs sm:text-sm font-bold text-amber-300 px-2 leading-relaxed">
        Pytanie ${qIndex + 1} z ${questions.length}: ${q.q}
      </legend>
      <div class="mt-3 space-y-2.5">
        ${q.options.map((opt) => `
          <label class="flex items-start gap-3 p-3 rounded-xl border border-slate-700 hover:border-indigo-400 bg-slate-900/60 cursor-pointer transition select-none has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-950/40">
            <input type="radio" name="subpage-diag-q-${q.id}" value="${opt.score}" class="mt-0.5 w-5 h-5 shrink-0 text-indigo-500 focus:ring-indigo-400 cursor-pointer" onchange="currentSubpageDiagnosticAnswers[${q.id}] = ${opt.score}" ${currentSubpageDiagnosticAnswers[q.id] === opt.score ? 'checked' : ''}>
            <span class="text-xs sm:text-sm text-slate-200 leading-relaxed">${opt.text}</span>
          </label>
        `).join('')}
      </div>
    </fieldset>
  `).join('');
}

function chooseStartingPoint(targetDay) {
  STATE.currentDay = targetDay;
  STATE.startingChoice = targetDay;
  saveState();
  playSuccessChime();

  const confirmBox = document.getElementById('diag-choice-confirmation');
  if (confirmBox) {
    confirmBox.innerHTML = `
      <div class="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm font-bold animate-fade-in flex items-center justify-center gap-2">
        <span class="text-lg" role="img" aria-label="(zielony ptaszek)">✅</span>
        <span>Wybrano: Rozpoczęcie kursu od <strong>Dnia ${targetDay}</strong>! Twój wybór został zapisany.</span>
      </div>
    `;
    confirmBox.classList.remove('hidden');
  }

  const btn1 = document.getElementById('btn-start-day-1');
  const btnRec = document.getElementById('btn-start-day-rec');
  if (btn1 && btnRec) {
    if (targetDay === 1) {
      btn1.classList.add('ring-2', 'ring-emerald-400', 'bg-emerald-900/60');
      btnRec.classList.remove('ring-2', 'ring-emerald-400', 'bg-emerald-900/60');
    } else {
      btnRec.classList.add('ring-2', 'ring-emerald-400', 'bg-emerald-900/60');
      btn1.classList.remove('ring-2', 'ring-emerald-400', 'bg-emerald-900/60');
    }
  }

  updateCourseUnlockedCardUI();
  announceSR(`Wybrano punkt startowy: Dzień ${targetDay}. Możesz przejść do Kroku 4.`);
}

function submitSubpageDiagnosticTest() {
  const questions = getActiveDiagnosticBank();
  const answeredCount = Object.keys(currentSubpageDiagnosticAnswers).length;

  if (answeredCount < questions.length) {
    alert(`Proszę odpowiedzieć na wszystkie ${questions.length} pytań testu diagnostycznego.`);
    for (let q of questions) {
      if (!currentSubpageDiagnosticAnswers[q.id]) {
        const el = document.getElementById(`subpage-diag-q-${q.id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
    return;
  }

  let totalScore = 0;
  for (let id in currentSubpageDiagnosticAnswers) {
    totalScore += currentSubpageDiagnosticAnswers[id];
  }

  STATE.testResult = { score: totalScore };
  STATE.onboardingSteps.diagnostic = true;

  let trackTitle = "";
  let trackDesc = "";
  let recommendedDay = 1;
  let recommendedTask = 1;

  if (totalScore <= 8) {
    trackTitle = "Poziom: Entuzjastyczny Nowicjusz (Ścieżka A)";
    trackDesc = "Wspaniały start! Twój profil wskazuje, że najlepiej zacząć od absolutnych podstaw. Krok po kroku oswoisz się z promptingiem bez pośpiechu i bez żargonu.";
    recommendedDay = 1;
    recommendedTask = 1;
  } else if (totalScore <= 12) {
    trackTitle = "Poziom: Świadomy Twórca (Ścieżka B)";
    trackDesc = "Świetna intuicja! Masz bardzo dobre wyczucie precyzji w dialogu z AI i rozumiesz rolę jasnego opisu problemu. Algorytm proponuje, że możesz pominąć pierwsze podstawowe dni i zacząć od Dnia 8 (Zadanie 22: Generowanie interaktywnych widoków HTML i mini-aplikacji).";
    recommendedDay = 8;
    recommendedTask = 22;
  } else {
    trackTitle = "Poziom: Zaawansowany Architekt (Ścieżka C)";
    trackDesc = "Wyśmienite przygotowanie! Myślisz analitycznie, doskonale rozumiesz diagnostykę błędów w konsoli F12 oraz specyfikację struktur danych. Algorytm proponuje, że możesz zacząć od Dnia 15 (Zadanie 42: Płótno malarskie i interaktywne aplikacje Canvas).";
    recommendedDay = 15;
    recommendedTask = 42;
  }

  // Domyślnie ustawiamy Dzień 1 (od początku), chyba że użytkownik wcześniej dokonał wyboru
  if (!STATE.startingChoice) {
    STATE.currentDay = 1;
  }

  saveState();
  playSuccessChime();
  celebrateWithConfetti();

  const resultContainer = document.getElementById('page-diagnostic-result-container');
  if (resultContainer) {
    resultContainer.innerHTML = `
      <div class="p-6 md:p-8 rounded-2xl bg-indigo-950/90 border-2 border-indigo-500 text-center shadow-2xl">
        <span class="text-3xl block mb-2" role="img" aria-label="(ikona pucharu)">🎯</span>
        <h2 class="text-xl sm:text-2xl font-black text-white mb-1" tabindex="-1">
          Twój wynik: ${totalScore} z 15 punktów
        </h2>
        <p class="text-sm font-bold text-amber-300 mb-2">${trackTitle}</p>
        <p class="text-xs sm:text-sm text-slate-200 mb-6 leading-relaxed max-w-2xl mx-auto">${trackDesc}</p>

        <!-- Wybór punktu startowego kursu -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-700 mb-6 text-left shadow-inner">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xl" role="img" aria-label="(ikona drogowskazu)">🧭</span>
            <h3 class="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              Wybierz, od którego miejsca chcesz rozpocząć kurs:
            </h3>
          </div>
          <p class="text-xs text-slate-300 mb-4 leading-relaxed">
            ${recommendedDay > 1 
              ? `Twój świetny wynik (${totalScore}/15 pkt) kwalifikuje Cię do skróconej ścieżki od <strong>Dnia ${recommendedDay}</strong>. Masz jednak pełny wybór – możesz zacząć od zera, aby zrealizować komplet 100 zadań bez pomijania podstaw!`
              : `Dla Twojego poziomu optymalnym punktem startu jest Dzień 1. Krok po kroku zrealizujesz cały program kursu.`
            }
          </p>

          <div class="grid grid-cols-1 ${recommendedDay > 1 ? 'sm:grid-cols-2' : ''} gap-3">
            <!-- Opcja 1: Od początku -->
            <button type="button" id="btn-start-day-1" onclick="chooseStartingPoint(1)" class="touch-target p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-950/40 hover:bg-emerald-900/60 transition flex flex-col justify-between text-left group ${STATE.currentDay === 1 ? 'ring-2 ring-emerald-400 bg-emerald-900/60' : ''}">
              <div>
                <div class="flex items-center justify-between gap-1 mb-1">
                  <span class="font-bold text-white text-xs sm:text-sm">Opcja 1: Od początku (Dzień 1)</span>
                  <span role="img" aria-label="(ikona kiełka)">🌱</span>
                </div>
                <span class="text-[11px] text-slate-300 block leading-relaxed">
                  Zalecane: Przejdziesz pełny cykl 100 zadań bez pomijania żadnych podstaw i opanujesz każdy trik od zera.
                </span>
              </div>
              <span class="mt-2 text-[11px] font-bold text-emerald-400 group-hover:underline">
                Wybieram Dzień 1 &rarr;
              </span>
            </button>

            ${recommendedDay > 1 ? `
            <!-- Opcja 2: Sugerowany dzień -->
            <button type="button" id="btn-start-day-rec" onclick="chooseStartingPoint(${recommendedDay})" class="touch-target p-3.5 rounded-xl border-2 border-amber-500/70 bg-slate-900 hover:bg-amber-950/40 transition flex flex-col justify-between text-left group ${STATE.currentDay === recommendedDay ? 'ring-2 ring-emerald-400 bg-emerald-900/60' : ''}">
              <div>
                <div class="flex items-center justify-between gap-1 mb-1">
                  <span class="font-bold text-white text-xs sm:text-sm">Opcja 2: Sugerowany Dzień ${recommendedDay}</span>
                  <span role="img" aria-label="(ikona rakiety)">🚀</span>
                </div>
                <span class="text-[11px] text-slate-300 block leading-relaxed">
                  Ścieżka przyspieszona: Pomijasz pierwsze ${recommendedDay - 1} dni i startujesz od razu z zadaniem ${recommendedTask}.
                </span>
              </div>
              <span class="mt-2 text-[11px] font-bold text-amber-400 group-hover:underline">
                Wybieram Dzień ${recommendedDay} &rarr;
              </span>
            </button>
            ` : ''}
          </div>

          <!-- Potwierdzenie aktywnego wyboru -->
          <div id="diag-choice-confirmation" class="mt-4">
            <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
              <span class="text-base" role="img" aria-label="(zielony ptaszek)">✅</span>
              <span>Aktualnie wybrany start: <strong>Dzień ${STATE.currentDay || 1}</strong>. Możesz zmienić wybór klikając w powyższe opcje.</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button type="button" onclick="goToStep('page-safety')" class="touch-target px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg flex items-center justify-center gap-2">
            <span>Zatwierdź wybór i przejdź do Kroku 4: Bezpieczeństwo (BHP)</span>
            <span role="img" aria-label="(strzałka w prawo)">&rarr;</span>
          </button>
        </div>
      </div>
    `;
    resultContainer.classList.remove('hidden');
    const resH2 = resultContainer.querySelector('h2');
    if (resH2) resH2.focus();
  }

  updateSubpageNavUI();
  announceSR(`Test ukończony z wynikiem ${totalScore} punktów. Wybierz punkt startowy.`);
}

// -------------------------------------------------------------------------
// PODSTRONA 4: ZASADY BEZPIECZEŃSTWA (BHP)
// -------------------------------------------------------------------------
function toggleSafetyAgreement(checked) {
  STATE.safetyAccepted = Boolean(checked);
  playClickSound();
}

function submitSafetyAgreement() {
  const chk = document.getElementById('chk-safety-agree');
  if (!chk || !chk.checked) {
    alert("Aby przejść dalej, zaznacz pole potwierdzenia zapoznania się z Zasadami Bezpieczeństwa BHP.");
    if (chk) chk.focus();
    return;
  }

  STATE.safetyAccepted = true;
  STATE.onboardingSteps.safety = true;
  saveState();
  playSuccessChime();
  updateSubpageNavUI();

  switchSubpage('page-tools', 'Zasady bezpieczeństwa zatwierdzone! Przechodzisz do etapu 5: Konfiguracja Narzędzi i Gemini.');
}

// -------------------------------------------------------------------------
// PODSTRONA 5: KONFIGURACJA NARZĘDZI I GEMINI
// -------------------------------------------------------------------------
function toggleGeminiHelp() {
  const box = document.getElementById('gemini-help-box');
  if (box) {
    box.classList.toggle('hidden');
  }
}

function copyGeminiTestPrompt() {
  const pre = document.getElementById('test-gemini-prompt-text');
  if (!pre) return;
  const text = pre.textContent.trim();
  fallbackCopyText(text, () => {
    const btn = document.getElementById('btn-copy-test-prompt');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>Skopiowano prompt! Wklej go w Gemini</span> <span role="img" aria-label="(potwierdzenie)">✓</span>';
      setTimeout(() => { btn.innerHTML = orig; }, 3500);
    }
    playClickSound();
    announceSR('Prompt testowy do Google Gemini został skopiowany do schowka.');
  });
}

function updateCourseUnlockedCardUI() {
  const card = document.getElementById('course-unlocked-card');
  if (!card) return;

  const targetDay = STATE.currentDay || 1;
  card.innerHTML = `
    <span class="text-4xl block mb-2" role="img" aria-label="(ikona pucharu)">🎉</span>
    <h2 class="text-xl font-black text-white mb-1">
      Wszystkie etapy przygotowania zostały ukończone!
    </h2>
    <p class="text-xs sm:text-sm text-emerald-200 mb-6 max-w-lg mx-auto leading-relaxed">
      Twój stażysta AI jest gotowy, zasady bezpieczeństwa są opanowane, a profil jest skonfigurowany. Otwieramy przed Tobą 100 praktycznych zadań Vibe Codingu!
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
      <button type="button" onclick="switchSubpage('page-daily-tasks')" class="touch-target px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-xl inline-flex items-center gap-2">
        <span>Rozpocznij Kurs: Wejdź do Zadań Dnia ${targetDay}</span>
        <span role="img" aria-label="(strzałka w prawo)">&rarr;</span>
      </button>
      ${targetDay > 1 ? `
      <button type="button" onclick="chooseStartingPoint(1); switchSubpage('page-daily-tasks');" class="touch-target px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-400/60 text-emerald-300 font-bold text-xs transition">
        <span>Wolisz od zera? Zmień na Dzień 1</span>
      </button>
      ` : ''}
    </div>
  `;
}

function verifyGeminiAndUnlockCourse() {
  const input = document.getElementById('gemini-verification-input');
  if (!input) return;
  const val = input.value.trim();

  if (val.length < 10) {
    alert("Wklej w to pole odpowiedź otrzymaną od Google Gemini (przynajmniej jedno całe zdanie), aby potwierdzić gotowość stażysty AI.");
    input.focus();
    return;
  }

  STATE.geminiVerifiedResponse = val;
  STATE.onboardingSteps.tools = true;
  STATE.courseUnlocked = true;
  saveState();

  playVictoryFanfare();
  celebrateWithConfetti();

  updateCourseUnlockedCardUI();

  const successCard = document.getElementById('course-unlocked-card');
  if (successCard) {
    successCard.classList.remove('hidden');
    successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  updateSubpageNavUI();
  announceSR('Gratulacje! Wszystkie etapy przygotowania zostały ukończone. Cały kurs Vibe Codingu został odblokowany!');
}

function resetEntireProgress() {
  const conf = confirm("Czy na pewno chcesz zresetować cały swój postęp, wykonane zadania, odznaki i preferencje? Rozpoczniesz kurs od zera.");
  if (!conf) return;

  localStorage.removeItem('vibe_coding_state_v2');
  STATE.completedTasks = new Set();
  STATE.currentDay = 1;
  STATE.streakDays = 1;
  STATE.testResult = null;
  STATE.courseUnlocked = false;
  STATE.safetyAccepted = false;
  STATE.geminiVerifiedResponse = '';
  STATE.onboardingSteps = {
    welcome: true,
    profile: false,
    diagnostic: false,
    safety: false,
    tools: false
  };
  STATE.userProfile = {
    ageGroup: 'adult',
    gender: 'neutral',
    interest: 'business',
    isConfigured: false
  };

  saveState();
  updateProfileUI();
  updateProgressUI();
  updateBadgesUI();
  updateRewardsUI();
  updateSubpageNavUI();
  switchSubpage('page-welcome', 'Kurs został zresetowany. Rozpoczynasz od Etapu 1: Wstęp.');
}

// =========================================================================
// ZARZĄDZANIE PROFILEM UCZNIA (ONBOARDING & PREFERENCJE)
// =========================================================================
function openProfileModal(triggerEl = null) {
  switchSubpage('page-profile');
  announceSR("Przełączono na podstronę 2: Twój Profil Twórcy i Personalizacja.");
}

function closeProfileModal() {
  const modal = document.getElementById('profile-survey-modal');
  if (modal && !modal.classList.contains('hidden')) {
    closeModal('profile-survey-modal');
  }
}

function syncProfileFormValues() {
  const p = STATE.userProfile;
  // Formularz podstrony 2 (sekwencyjny)
  const subForm = document.getElementById('page-profile-form');
  if (subForm) {
    const ageR = subForm.querySelector(`input[name="page-profile-age"][value="${p.ageGroup}"]`);
    if (ageR) ageR.checked = true;
    const genR = subForm.querySelector(`input[name="page-profile-gender"][value="${p.gender}"]`);
    if (genR) genR.checked = true;
    const intR = subForm.querySelector(`input[name="page-profile-interest"][value="${p.interest}"]`);
    if (intR) intR.checked = true;
  }

  // Kompatybilność z modalem (jeśli istnieje)
  const ageRadio = document.querySelector(`input[name="profile-age"][value="${p.ageGroup}"]`);
  if (ageRadio) ageRadio.checked = true;

  const genderRadio = document.querySelector(`input[name="profile-gender"][value="${p.gender}"]`);
  if (genderRadio) genderRadio.checked = true;

  const interestRadio = document.querySelector(`input[name="profile-interest"][value="${p.interest}"]`);
  if (interestRadio) interestRadio.checked = true;
}

function handleProfileSubmit(e) {
  e.preventDefault();
  playSuccessChime();

  const form = e.target;
  const age = form.elements['profile-age'].value || 'adult';
  const gender = form.elements['profile-gender'].value || 'neutral';
  const interest = form.elements['profile-interest'].value || 'business';

  STATE.userProfile = {
    ageGroup: age,
    gender: gender,
    interest: interest,
    isConfigured: true
  };

  saveState();
  updateProfileUI();
  applyTheme(STATE.currentTheme);
  closeProfileModal();
  celebrateWithConfetti();

  announceSR("Profil został pomyślnie zapisany.");
}

function updateProfileUI() {
  const p = STATE.userProfile;
  const bannerText = document.getElementById('hero-profile-text');
  const bannerIcon = document.getElementById('hero-profile-icon');
  const diagBadge = document.getElementById('diag-active-profile-badge');

  let ageLabel = p.ageGroup === 'teen' ? 'Nastolatek' : (p.ageGroup === 'senior' ? 'Senior' : 'Dorosły');
  let icon = '💼';
  let iconDesc = '(ikona teczki)';
  let interestLabel = 'Biznes i Automatyzacja';

  if (p.interest === 'gaming' || p.ageGroup === 'teen') {
    icon = '🎮';
    iconDesc = '(ikona kontrolera gier)';
    interestLabel = 'Gry, Boty i Multimedia';
  } else if (p.interest === 'hobby' || p.ageGroup === 'senior') {
    icon = '🌟';
    iconDesc = '(ikona gwiazdy)';
    interestLabel = 'Dom, Pasje i Spokój';
  } else if (p.interest === 'creative') {
    icon = '🎨';
    iconDesc = '(ikona palety)';
    interestLabel = 'Kreatywność i Design';
  }

  if (bannerText) {
    bannerText.innerHTML = `Twój profil: <strong>${ageLabel} • ${interestLabel}</strong>`;
  }
  if (bannerIcon) {
    bannerIcon.textContent = icon;
    bannerIcon.setAttribute('aria-label', iconDesc);
  }
  if (diagBadge) {
    diagBadge.textContent = `Dopasowano do profilu: ${interestLabel}`;
  }

  const addonsBtn = document.getElementById('tab-btn-addons');
  if (addonsBtn) {
    const isBusiness = (p.ageGroup === 'adult' && p.interest === 'business');
    if (isBusiness) {
      addonsBtn.classList.remove('hidden');
      addonsBtn.style.display = 'inline-flex';
    } else {
      addonsBtn.classList.add('hidden');
      addonsBtn.style.display = 'none';
    }
  }
}

// =========================================================================
// ZARZĄDZANIE SZATĄ GRAFICZNĄ (DYNAMICZNE MOTYWY)
// =========================================================================
function changeTheme(themeKey) {
  STATE.currentTheme = themeKey;
  saveState();
  applyTheme(themeKey);
  playClickSound();
}

function applyTheme(themeKey) {
  document.body.classList.remove('theme-teen', 'theme-adult', 'theme-senior', 'theme-creative');

  let effectiveTheme = themeKey;
  if (themeKey === 'auto') {
    const p = STATE.userProfile;
    if (p.ageGroup === 'teen' || p.interest === 'gaming') {
      effectiveTheme = 'teen';
    } else if (p.ageGroup === 'senior' || p.interest === 'hobby') {
      effectiveTheme = 'senior';
    } else if (p.interest === 'creative') {
      effectiveTheme = 'creative';
    } else {
      effectiveTheme = 'adult';
    }
  }

  if (effectiveTheme === 'teen') {
    document.body.classList.add('theme-teen');
  } else if (effectiveTheme === 'senior') {
    document.body.classList.add('theme-senior');
  } else if (effectiveTheme === 'creative') {
    document.body.classList.add('theme-creative');
  } else {
    document.body.classList.add('theme-adult');
  }

  const selector = document.getElementById('theme-selector');
  if (selector) selector.value = themeKey;
}

// =========================================================================
// TEST DIAGNOSTYCZNY (ADAPTACYJNY WG PROFILU)
// =========================================================================
function getActiveDiagnosticBank() {
  const p = STATE.userProfile;
  if (p.ageGroup === 'teen' || p.interest === 'gaming') return DIAGNOSTIC_BANKS.teen;
  if (p.ageGroup === 'senior' || p.interest === 'hobby') return DIAGNOSTIC_BANKS.hobby;
  if (p.interest === 'creative') return DIAGNOSTIC_BANKS.creative;
  return DIAGNOSTIC_BANKS.business;
}

function openDiagnosticModal(triggerEl = null) {
  switchSubpage('page-diagnostic');
  announceSR('Przełączono na podstronę 3: Adaptacyjny test diagnostyczny sprawdzający poziom startowy.');
}

function closeDiagnosticModal() {
  const modal = document.getElementById('diagnostic-modal');
  if (modal && !modal.classList.contains('hidden')) {
    closeModal('diagnostic-modal');
  }
}

function renderDiagnosticQuestions() {
  const container = document.getElementById('diagnostic-questions-container');
  if (!container) return;

  const questions = getActiveDiagnosticBank();

  container.innerHTML = questions.map((q, qIndex) => `
    <fieldset class="mb-5 p-3.5 sm:p-4 rounded-2xl border border-slate-700 bg-slate-900/80">
      <legend class="text-xs md:text-sm font-bold text-white px-2">
        Pytanie ${qIndex + 1} z ${questions.length}: ${q.q}
      </legend>
      <div class="mt-3 space-y-2">
        ${q.options.map((opt) => `
          <label class="flex items-start gap-3 p-3 rounded-xl border border-slate-800 hover:bg-slate-800/80 cursor-pointer transition select-none">
            <input type="radio" name="diag-q-${q.id}" value="${opt.score}" class="mt-0.5 w-5 h-5 shrink-0 text-indigo-500 focus:ring-indigo-400" onchange="currentDiagnosticAnswers[${q.id}] = ${opt.score}">
            <span class="text-xs md:text-sm text-slate-200 leading-relaxed">${opt.text}</span>
          </label>
        `).join('')}
      </div>
    </fieldset>
  `).join('');
}

function submitDiagnosticTest() {
  const questions = getActiveDiagnosticBank();
  const answeredCount = Object.keys(currentDiagnosticAnswers).length;
  
  if (answeredCount < questions.length) {
    alert("Proszę odpowiedzieć na wszystkie 5 pytań, abyśmy mogli precyzyjnie dobrać Twój poziom.");
    return;
  }

  let totalScore = 0;
  for (let id in currentDiagnosticAnswers) {
    totalScore += currentDiagnosticAnswers[id];
  }

  playVictoryFanfare();
  celebrateWithConfetti();

  let trackTitle = "";
  let trackDesc = "";
  let recommendedDay = 1;
  let recommendedStartTask = 1;

  if (totalScore <= 8) {
    trackTitle = "Poziom: Entuzjastyczny Nowicjusz (Ścieżka A)";
    trackDesc = "Świetny start! Rekomendujemy rozpoczęcie od Dnia 1 (Zadanie 1). Zbudujesz solidne fundamenty dekompozycji i oswoisz się z pierwszymi promptami bez żadnego stresu.";
    recommendedDay = 1;
    recommendedStartTask = 1;
  } else if (totalScore <= 12) {
    trackTitle = "Poziom: Świadomy Twórca (Ścieżka B)";
    trackDesc = "Bardzo dobra intuicja inżynierii promptów! Masz wyczucie roli precyzji w dialogu z AI. Możesz śmiało zacząć od Dnia 8 (Zadanie 22: Generowanie interaktywnych widoków HTML).";
    recommendedDay = 8;
    recommendedStartTask = 22;
  } else {
    trackTitle = "Poziom: Zaawansowany Architekt (Ścieżka C)";
    trackDesc = "Rewelacyjny wynik! Doskonale rozumiesz diagnostykę konsoli F12, architekturę danych i specyfikację. Możesz przejść prosto do Dnia 15 (Zadanie 42: Płótno malarskie i interaktywne aplikacje Canvas).";
    recommendedDay = 15;
    recommendedStartTask = 42;
  }

  STATE.testResult = { score: totalScore, title: trackTitle, day: recommendedDay };
  saveState();

  const resultContainer = document.getElementById('diagnostic-result-container');
  resultContainer.innerHTML = `
    <div class="p-5 sm:p-6 rounded-2xl bg-indigo-950/70 border-2 border-indigo-500 text-center shadow-xl">
      <h4 class="text-lg sm:text-xl font-bold text-white mb-1 inline-flex items-center justify-center gap-2" tabindex="-1">
        <span>Twój wynik: ${totalScore} z 15 punktów</span>
        <span role="img" aria-label="(ikona gratulacji)">🎉</span>
      </h4>
      <p class="text-base font-bold text-amber-300 mb-2">${trackTitle}</p>
      <p class="text-xs md:text-sm text-slate-300 mb-6 leading-relaxed max-w-lg mx-auto">${trackDesc}</p>
      <button type="button" class="touch-target px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition shadow-lg text-xs md:text-sm inline-flex items-center justify-center gap-2" onclick="applyDiagnosticRecommendation(${recommendedDay})">
        <span>Przejdź do zalecanego Dnia ${recommendedDay} (Zadanie ${recommendedStartTask})</span>
        <span role="img" aria-label="(ikona rakiety)">🚀</span>
      </button>
    </div>
  `;
  resultContainer.classList.remove('hidden');

  const resultTitle = resultContainer.querySelector('h4');
  if (resultTitle) resultTitle.focus();
}

function applyDiagnosticRecommendation(targetDay) {
  STATE.currentDay = targetDay;
  saveState();
  closeDiagnosticModal();
  setViewMode('daily');
  renderTasks();
  scrollToSection('tasks-main-section');
}

// =========================================================================
// 4 DEDYKOWANE WERSJE DYPLOMÓW MISTRZOWSKICH (RESPONSYWNE NA IPHONE I A4)
// ORAZ DYNAMICZNY SYSTEM OCZYSZCZANIA Z ARTEFAKTÓW I ZABRUDZEŃ
// =========================================================================
function getEffectiveDiplomaStyle() {
  if (STATE.selectedDiplomaStyle) return STATE.selectedDiplomaStyle;
  const p = STATE.userProfile;
  if (p.ageGroup === 'teen' || p.interest === 'gaming') return 'teen';
  if (p.ageGroup === 'senior' || p.interest === 'hobby') return 'senior';
  if (p.interest === 'creative') return 'creative';
  return 'adult';
}

function switchDiplomaStyle(styleKey) {
  STATE.selectedDiplomaStyle = styleKey;
  playClickSound();
  renderDiplomaCanvas();
}

function openDiplomaModal(triggerEl = null) {
  renderDiplomaCanvas();
  const completedCount = STATE.completedTasks.size;
  const wrapper = document.getElementById('printable-diploma-wrapper');
  if (wrapper) {
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (completedCount >= 100) {
    const input = document.getElementById('diploma-name-input');
    if (input) {
      input.focus();
    }
    setTimeout(() => celebrateWithConfetti(), 300);
    announceSR("Gratulacje! Twój Dyplom Mistrza jest w 100% czysty i odblokowany. Wpisz swoje imię i nazwisko i wydrukuj certyfikat.");
  } else {
    announceSR(`Podgląd dyplomu w wersji roboczej. Stopień oczyszczenia: ${completedCount} z 100 zadań. Dyplom zawiera zabawne zanieczyszczenia.`);
  }
}

function closeDiplomaModal() {
  const modal = document.getElementById('diploma-modal');
  if (modal && !modal.classList.contains('hidden')) {
    closeModal('diploma-modal');
  }
}

function updateDiplomaName(val) {
  const completedCount = STATE.completedTasks.size;
  if (completedCount < 100) {
    return;
  }
  const trimmed = val.trim();
  STATE.learnerName = trimmed ? trimmed : 'Adept Vibe Codingu';
  saveState();
  renderDiplomaCanvas();
}

function celebrateWithConfetti() {
  playVictoryFanfare();
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

function printDiploma() {
  const scoreData = calculateScore();
  const completedCount = STATE.completedTasks.size;
  const isMaster = (completedCount >= 100 || (scoreData.grade.isPassing && STATE.diplomaGradeApproved));

  if (!isMaster) {
    playTone(300, 'sawtooth', 0.2, 0.1);
    if (!scoreData.grade.isPassing) {
      alert(`Oficjalny dyplom można wystawić po zdobyciu co najmniej 50% punktów (ocena Dostateczna).\n\nTwój obecny wynik: ${scoreData.earnedPoints} z ${scoreData.totalPossiblePoints} pkt (${scoreData.percentage}%).\nRozwiąż zadania z poniższej listy do poprawy, aby odblokować certyfikat!`);
    } else {
      alert(`Przed wydrukiem potwierdź, czy uzyskana ocena (${scoreData.grade.short}) jest dla Ciebie satysfakcjonująca, klikając zielony przycisk 'Tak, ocena mi odpowiada – wystaw mój oficjalny dyplom!' w raporcie powyżej.`);
    }
    announceSR(`Druk zablokowany. Wymagane zatwierdzenie oceny (aktualna ocena: ${scoreData.grade.short}).`);
    return;
  }
  playClickSound();
  window.print();
}

function approveDiplomaGrade() {
  const scoreData = calculateScore();
  if (!scoreData.grade.isPassing) {
    playTone(250, 'sawtooth', 0.2, 0.08);
    alert(`Aby odebrać oficjalny dyplom, musisz zdobyć co najmniej 50% punktów (ocena Dostateczna).\n\nAktualny wynik: ${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints} pkt (${scoreData.percentage}%).\nRozwiąż zadania z poniższej listy, aby podnieść swój wynik!`);
    STATE.showImprovementList = true;
    updateDiplomaCleansingUI();
    return;
  }
  STATE.diplomaGradeApproved = true;
  saveState();
  playVictoryFanfare();
  celebrateWithConfetti();
  updateDiplomaCleansingUI();
  renderDiplomaCanvas();
  announceSR(`Gratulacje! Twoja ocena ${scoreData.grade.short} została zatwierdzona. Twój oficjalny Dyplom Mistrza został wystawiony i oczyszczony!`);
  const nameInput = document.getElementById('diploma-name-input');
  if (nameInput) {
    nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    nameInput.focus();
  }
}

function toggleImprovementList(show) {
  STATE.showImprovementList = (show !== undefined) ? show : !STATE.showImprovementList;
  playClickSound();
  updateDiplomaCleansingUI();
  if (STATE.showImprovementList) {
    setTimeout(() => {
      const listEl = document.getElementById('diploma-improvement-list');
      if (listEl) {
        listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const firstFocus = listEl.querySelector('button');
        if (firstFocus) firstFocus.focus();
      }
    }, 100);
    announceSR("Rozwinięto listę zadań wymagających poprawy i pominiętych.");
  }
}

function jumpToTaskToImprove(day, taskId) {
  STATE.currentDay = day;
  switchSubpage('page-daily-tasks');
  setTimeout(() => {
    const card = document.getElementById(`task-card-${taskId}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const inp = document.getElementById(`task-verify-input-${taskId}`);
      if (inp) {
        inp.focus({ preventScroll: true });
      } else {
        card.focus();
      }
    }
  }, 120);
  playClickSound();
  announceSR(`Przejście do zadania ${taskId} w Dniu ${day}.`);
}

function getCleansingArtefactsHtml(completedCount, scoreData, isMaster) {
  if (isMaster) {
    return ''; // 100% krystalicznie czysty dyplom po zatwierdzeniu oceny!
  }

  let artefacts = [];

  // Artefakt 1: Rozlana kawa (widoczna gdy < 20 zadań)
  if (completedCount < 20) {
    artefacts.push(`
      <div class="absolute top-6 left-4 sm:top-10 sm:left-10 rotate-6 bg-amber-900/90 border-2 border-amber-400 text-amber-100 text-[10px] sm:text-xs font-black p-2.5 rounded-2xl shadow-2xl z-20 pointer-events-none select-none max-w-[200px]" aria-hidden="true">
        <span class="text-base block">☕ BŁĄD 404:</span>
        <span>Rozlana kawa stażysty na kodzie! (Zniknie po zatwierdzeniu oceny)</span>
      </div>
    `);
  }

  // Artefakt 2: Pizza dla programisty (widoczna gdy < 40 zadań)
  if (completedCount < 40) {
    artefacts.push(`
      <div class="absolute bottom-16 left-4 sm:bottom-20 sm:left-10 -rotate-12 bg-rose-900/90 border-2 border-rose-400 text-rose-100 text-[10px] sm:text-xs font-black p-2.5 rounded-2xl shadow-2xl z-20 pointer-events-none select-none max-w-[190px]" aria-hidden="true">
        <span class="text-base block">🍕 PROMPT W PIEKARNIKU:</span>
        <span>Stażysta czeka na pizzę (Zniknie po zatwierdzeniu oceny)</span>
      </div>
    `);
  }

  // Artefakt 3: Plac Budowy (widoczny gdy < 60 zadań)
  if (completedCount < 60) {
    artefacts.push(`
      <div class="absolute top-14 right-4 sm:top-16 sm:right-10 rotate-12 bg-yellow-950/95 border-2 border-yellow-400 text-yellow-300 text-[10px] sm:text-xs font-black p-2.5 rounded-2xl shadow-2xl z-20 pointer-events-none select-none max-w-[210px]" aria-hidden="true">
        <span class="text-base block">🚧 PLAC BUDOWY:</span>
        <span>Uwaga na spadający kod HTML! (Zniknie po zatwierdzeniu oceny)</span>
      </div>
    `);
  }

  // Artefakt 4: Robaczek / Pluskwa F12 (widoczny gdy < 80 zadań)
  if (completedCount < 80) {
    artefacts.push(`
      <div class="absolute bottom-20 right-4 sm:bottom-24 sm:right-10 -rotate-6 bg-purple-950/95 border-2 border-purple-400 text-purple-200 text-[10px] sm:text-xs font-black p-2.5 rounded-2xl shadow-2xl z-20 pointer-events-none select-none max-w-[200px]" aria-hidden="true">
        <span class="text-base block">🐛 PLUSKWA W KONSOLI:</span>
        <span>Undefined is not a function (Zniknie po zatwierdzeniu oceny)</span>
      </div>
    `);
  }

  // Wielki stempel ukośny na środku dyplomu
  const watermark = `
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20" aria-hidden="true">
      <div class="transform -rotate-12 border-4 sm:border-8 border-dashed border-rose-500/80 bg-rose-950/95 px-6 py-4 sm:px-10 sm:py-6 rounded-3xl shadow-2xl text-center backdrop-blur-xs max-w-lg mx-4">
        <span class="text-lg sm:text-2xl md:text-3xl font-black text-rose-300 tracking-widest block uppercase drop-shadow">
          ⚠️ WERSJA ROBOCZA • W TRAKCIE NAUKI
        </span>
        <span class="text-xs sm:text-base font-bold text-amber-300 tracking-wider block mt-1">
          WYNIK: ${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints} PKT (${scoreData.percentage}%) • OCENA: ${scoreData.grade.short}
        </span>
        <span class="text-[10px] sm:text-xs text-slate-200 block mt-1 italic">
          Brak możliwości wydruku. Potwierdź ocenę w raporcie powyżej lub popraw zadania!
        </span>
      </div>
    </div>
  `;

  return watermark + artefacts.join('');
}

function updateDiplomaCleansingUI() {
  const panel = document.getElementById('diploma-cleansing-panel');
  const completedCount = STATE.completedTasks.size;
  const scoreData = calculateScore();
  const isMaster = (completedCount >= 100 || (scoreData.grade.isPassing && STATE.diplomaGradeApproved));
  const pct = scoreData.percentage;

  if (panel) {
    const tasksToImprove = (typeof TASKS_DATA !== 'undefined' && Array.isArray(TASKS_DATA))
      ? TASKS_DATA.filter(t => getTaskStatus(t.id) !== 'passed')
      : [];

    panel.innerHTML = `
      <div class="space-y-6">
        <!-- KARTA 1: RAPORT WYNIKÓW I PUNKTACJA -->
        <div class="p-5 sm:p-6 rounded-3xl border ${isMaster ? 'border-emerald-500/60 bg-emerald-950/30' : 'border-amber-500/50 bg-slate-900/95'} shadow-xl">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <span class="text-xs uppercase font-extrabold tracking-wider ${isMaster ? 'text-emerald-400' : 'text-amber-400'} block mb-1">
                Oficjalny Raport Końcowy Kursu
              </span>
              <h3 class="text-lg sm:text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <span>Twój Osiągnięty Wynik i Ocena</span>
                <span role="img" aria-label="(ikona wykresu)">📊</span>
              </h3>
            </div>
            <div class="text-right">
              <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black ${scoreData.grade.badgeClass}">
                <span>Ocena: ${scoreData.grade.short}</span>
                <span>${scoreData.grade.stars}</span>
              </span>
            </div>
          </div>

          <!-- KAFELKI STATYSTYK -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-center">
            <div class="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span class="text-[11px] text-slate-400 block mb-1">Zdobyte punkty:</span>
              <strong class="text-base sm:text-lg font-black text-amber-400">${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints}</strong>
              <span class="text-[11px] text-slate-400 block">(${scoreData.percentage}%)</span>
            </div>
            <div class="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
              <span class="text-[11px] text-emerald-300 block mb-1">🟢 Zaliczone:</span>
              <strong class="text-base sm:text-lg font-black text-emerald-300">${scoreData.passedCount} / ${scoreData.totalTasks}</strong>
              <span class="text-[11px] text-emerald-400 block">punktowane w pełni</span>
            </div>
            <div class="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30">
              <span class="text-[11px] text-rose-300 block mb-1">🔴 Wymaga poprawy:</span>
              <strong class="text-base sm:text-lg font-black text-rose-300">${scoreData.failedCount}</strong>
              <span class="text-[11px] text-rose-400 block">do ponownego testu</span>
            </div>
            <div class="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span class="text-[11px] text-amber-300 block mb-1">⚪ Pominięte / ⏳ Inne:</span>
              <strong class="text-base sm:text-lg font-black text-amber-300">${scoreData.skippedCount + scoreData.pendingCount}</strong>
              <span class="text-[11px] text-slate-400 block">można do nich wrócić</span>
            </div>
          </div>

          <!-- Pasek postępu punktowego -->
          <div class="mb-3">
            <div class="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Wskaźnik zdobytych punktów:</span>
              <span class="font-bold text-amber-300">${pct}%</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-3.5 p-0.5 overflow-hidden border border-slate-700" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
              <div class="h-full rounded-full transition-all duration-700 ${isMaster ? 'bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_12px_rgba(52,211,153,0.6)]' : 'bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400'}" style="width: ${pct}%"></div>
            </div>
          </div>

          <p class="text-xs text-slate-300 leading-relaxed">
            ${scoreData.grade.description}
          </p>
        </div>

        <!-- KARTA 2: DECYZJA O SATYSFAKCJI Z OCENY PRZED WYSTAWIENIEM DYPLOMU -->
        <div class="p-5 sm:p-6 rounded-3xl border border-indigo-500/40 bg-slate-900/95 shadow-xl">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <h3 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Czy uzyskana ocena jest dla Ciebie satysfakcjonująca?</span>
              <span role="img" aria-label="(pytanie)">🤔</span>
            </h3>
            <span class="text-xs font-bold text-amber-300">
              Ocena na dyplomie: <strong>${scoreData.grade.short}</strong>
            </span>
          </div>

          <p class="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
            ${scoreData.grade.isPassing 
              ? 'Im większa liczba zdobytych punktów, tym wyższa ocena na Twoim oficjalnym certyfikacie. Możesz zaakceptować tę ocenę i od razu odebrać czysty dyplom, ALBO wrócić do zadań źle zrobionych lub pominiętych, aby podwyższyć wynik (np. na Celujący 6.0)!'
              : 'Aby otrzymać oficjalny dyplom i ukończyć kurs, wymagane jest co najmniej <strong>50% punktów (ocena Dostateczny 3.0)</strong>. Twój obecny wynik to <strong>' + scoreData.earnedPoints + ' pkt (' + scoreData.percentage + '%)</strong>. Rozwiąż brakujące zadania z poniższej listy, aby zdobyć punkty i odblokować dyplom!'}
          </p>

          <div class="flex flex-wrap items-center gap-3">
            ${scoreData.grade.isPassing ? `
              <button type="button" onclick="approveDiplomaGrade()" class="touch-target px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg cursor-pointer">
                <span>${STATE.diplomaGradeApproved ? 'Ocena zatwierdzona ✓ (Zaktualizuj dyplom)' : 'Tak, ocena mi odpowiada – wystaw mój oficjalny dyplom!'}</span>
                <span role="img" aria-label="(biret)">🎓</span>
              </button>
            ` : ''}

            <button type="button" onclick="toggleImprovementList()" class="touch-target px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow cursor-pointer">
              <span>${STATE.showImprovementList ? 'Ukryj listę zadań do poprawy ✕' : 'Chcę poprawić wynik przed odbiorem dyplomu 🔄'}</span>
              <span class="text-xs text-slate-400">(${tasksToImprove.length} zadań)</span>
            </button>
          </div>

          <!-- ROZWIJANA INTERAKTYWNA LISTA ZADAŃ DO POPRAWY -->
          ${(STATE.showImprovementList || !scoreData.grade.isPassing) && tasksToImprove.length > 0 ? `
            <div id="diploma-improvement-list" class="mt-6 pt-5 border-t border-slate-800" tabindex="-1">
              <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h4 class="text-xs uppercase font-extrabold tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span>Wybierz zadanie do poprawienia lub rozwiązania (${tasksToImprove.length} zadań do dyspozycji):</span>
                  <span role="img" aria-label="(ołówek)">✏️</span>
                </h4>
                <span class="text-[11px] text-slate-400">Kliknięcie przeniesie Cię bezpośrednio do zadania</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
                ${tasksToImprove.slice(0, 30).map(t => {
                  const tStatus = getTaskStatus(t.id);
                  const tPts = getTaskPoints(t);
                  let statusBadge = `<span class="text-slate-400">⏳ Niewykonane</span>`;
                  if (tStatus === 'failed') statusBadge = `<span class="text-rose-400 font-bold">🔴 Wymaga poprawy</span>`;
                  if (tStatus === 'skipped') statusBadge = `<span class="text-amber-400 font-bold">⚪ Pominięte</span>`;

                  return `
                    <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400 transition flex items-center justify-between gap-2">
                      <div class="min-w-0">
                        <div class="flex items-center gap-2 mb-0.5">
                          <span class="text-[10px] font-mono text-indigo-300 font-bold">Dzień ${t.day} • Zadanie ${t.id}</span>
                          <span class="text-[10px] text-amber-300 font-bold">+${tPts} pkt</span>
                        </div>
                        <h5 class="text-xs font-bold text-white truncate" title="${escapeHtmlText(t.title)}">${escapeHtmlText(t.title)}</h5>
                        <div class="text-[11px] mt-0.5">${statusBadge}</div>
                      </div>
                      <button type="button" onclick="jumpToTaskToImprove(${t.day}, ${t.id})" class="touch-target px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 transition flex items-center gap-1 shadow">
                        <span>Rozwiąż</span>
                        <span role="img" aria-label="(strzałka w prawo)">&rarr;</span>
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
              ${tasksToImprove.length > 30 ? `<p class="text-[11px] text-slate-400 mt-2 italic">Wyświetlono pierwszych 30 zadań. Kolejne znajdziesz w pełnym Katalogu Zadań.</p>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Synchronizacja pola imienia i nazwiska
  const nameInput = document.getElementById('diploma-name-input');
  const nameStatus = document.getElementById('diploma-name-status-note');
  const counterSpan = document.getElementById('diploma-input-counter');
  const printBtn = document.getElementById('btn-print-diploma');

  if (counterSpan) counterSpan.textContent = `${scoreData.earnedPoints}/${scoreData.totalPossiblePoints} pkt`;

  if (nameInput) {
    nameInput.disabled = !isMaster;
    if (isMaster) {
      nameInput.value = STATE.learnerName || '';
      nameInput.placeholder = "Wpisz Twoje Imię i Nazwisko (np. Jan Kowalski)";
      nameInput.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      nameInput.value = '';
      nameInput.placeholder = `[ZABLOKOWANE: Zatwierdź ocenę w raporcie powyżej, aby wpisać dane]`;
      nameInput.classList.add('opacity-50', 'cursor-not-allowed');
    }
  }

  if (nameStatus) {
    if (isMaster) {
      nameStatus.className = "text-xs text-emerald-400 font-semibold mt-1.5 flex items-center gap-1.5";
      nameStatus.innerHTML = `<span role="img" aria-label="(zielony ptaszek)">✅</span> <span>Dyplom odblokowany z oficjalną oceną: <strong>${scoreData.grade.short}</strong>! Wpisane imię natychmiast aktualizuje certyfikat.</span>`;
    } else {
      nameStatus.className = "text-xs text-amber-300 font-semibold mt-1.5 flex items-center gap-1.5";
      nameStatus.innerHTML = `<span role="img" aria-label="(ikona kłódki)">🔒</span> <span>Wpisanie danych i druk odblokują się po zatwierdzeniu oceny w raporcie (Aktualny wynik: <strong>${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints} pkt (${scoreData.percentage}%)</strong>).</span>`;
    }
  }

  if (printBtn) {
    printBtn.disabled = !isMaster;
    if (isMaster) {
      printBtn.className = "touch-target px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg cursor-pointer";
      printBtn.innerHTML = `<span>Drukuj Czysty Certyfikat / PDF (Ocena: ${scoreData.grade.short})</span> <span role="img" aria-label="(ikona drukarki)">🖨️</span>`;
    } else {
      printBtn.className = "touch-target px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 opacity-60 cursor-not-allowed font-bold text-xs transition flex items-center gap-1.5 shadow";
      printBtn.innerHTML = `<span>Drukuj / PDF (Wymaga zatwierdzenia oceny)</span> <span role="img" aria-label="(ikona kłódki)">🔒</span>`;
    }
  }

  document.body.classList.toggle('diploma-locked', !isMaster);
}

function getBusinessAddonsDiplomaBadge(style) {
  const addonIds = [101, 102, 103, 104, 105, 106, 107, 108, 109];
  const passedAddons = addonIds.filter(id => STATE.completedTasks && STATE.completedTasks.has(id));
  if (passedAddons.length === 0) return '';

  const isDark = (style === 'teen' || style === 'creative');
  const bgClass = isDark ? 'bg-amber-950/70 border-amber-400/50 text-amber-200' : 'bg-amber-100/90 border-amber-600/50 text-amber-950';

  const mod1Done = [101, 102, 103].every(id => STATE.completedTasks && STATE.completedTasks.has(id));
  const mod2Done = [104, 105, 106].every(id => STATE.completedTasks && STATE.completedTasks.has(id));
  const mod3Done = [107, 108, 109].every(id => STATE.completedTasks && STATE.completedTasks.has(id));

  return `
    <div class="mt-4 p-3 sm:p-4 rounded-2xl border ${bgClass} text-left shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-1 mb-1.5">
        <span class="text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
          <span>💼 AKREDYTACJA BIZNESOWA:</span>
          <span class="text-[11px] font-bold">Zaliczono ${passedAddons.length} / 9 wdrożeń</span>
        </span>
        ${passedAddons.length === 9 ? '<span class="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase">★ EKSPERT BIZNESU AI</span>' : ''}
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[10px] sm:text-[11px]">
        <span class="${mod1Done ? 'font-bold text-emerald-400' : 'opacity-75'}">
          ${mod1Done ? '✓' : '•'} Moduł 1: Vibe Excel & Makra
        </span>
        <span class="${mod2Done ? 'font-bold text-emerald-400' : 'opacity-75'}">
          ${mod2Done ? '✓' : '•'} Moduł 2: Analiza Ankiet & Dashboard
        </span>
        <span class="${mod3Done ? 'font-bold text-emerald-400' : 'opacity-75'}">
          ${mod3Done ? '✓' : '•'} Moduł 3: Procedury SOP & Regulacje AI
        </span>
      </div>
    </div>
  `;
}

function renderDiplomaCanvas() {
  const canvas = document.getElementById('diploma-canvas');
  if (!canvas) return;

  const style = getEffectiveDiplomaStyle();
  const gender = STATE.userProfile.gender;
  const name = escapeHtmlText(STATE.learnerName || 'Adept Vibe Codingu');
  const certId = escapeHtmlText(STATE.certId || 'CERT-VIBE-2026-X89K2');
  const issueDate = new Date().toLocaleDateString('pl-PL');
  const completedCount = STATE.completedTasks.size;
  const scoreData = calculateScore();
  const isMaster = (completedCount >= 100 || (scoreData.grade.isPassing && STATE.diplomaGradeApproved));
  const artefactsHtml = getCleansingArtefactsHtml(completedCount, scoreData, isMaster);

  let completedWord = "ukończył(a)";
  let titlePrefix = "Certyfikowany";
  let architectWord = "Architekt";
  let directorWord = "Reżyser";

  if (gender === 'female') {
    completedWord = "ukończyła z wyróżnieniem";
    titlePrefix = "Certyfikowana";
    architectWord = "Architektka";
    directorWord = "Reżyserka";
  } else if (gender === 'male') {
    completedWord = "ukończył z wyróżnieniem";
    titlePrefix = "Certyfikowany";
    architectWord = "Architekt";
    directorWord = "Reżyser";
  } else {
    completedWord = "zostało ukończone z wyróżnieniem przez";
  }

  document.querySelectorAll('.diploma-style-btn').forEach(btn => {
    btn.classList.remove('bg-indigo-600', 'text-white', 'shadow');
    btn.classList.add('text-slate-300');
  });
  const activeBtn = document.getElementById(`btn-diploma-style-${style}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-indigo-600', 'text-white', 'shadow');
    activeBtn.classList.remove('text-slate-300');
  }

  const labelEl = document.getElementById('diploma-active-style-label');
  if (labelEl) {
    const styleNames = {
      teen: 'Wersja Cyberpunk (Młodzież i Gaming) 🎮',
      adult: 'Wersja Executive (Biznes i Praca) 💼',
      senior: 'Wersja Honorowa (Senior i Spokój) 🌟',
      creative: 'Wersja Studio (Kreatywna i Sztuka) 🎨'
    };
    labelEl.textContent = styleNames[style];
  }

  const unverifiedSeal = `
    <div class="w-16 h-16 rounded-full border-2 border-dashed border-rose-500/80 bg-slate-900/90 flex flex-col items-center justify-center text-[8px] font-bold text-slate-400 mx-auto mb-1 select-none">
      <span class="text-rose-400 font-black text-[9px]">ROBOCZY</span>
      <span class="text-amber-300 font-bold">${scoreData.earnedPoints} pkt</span>
      <span class="text-[7px] text-slate-400">${scoreData.grade.short}</span>
    </div>
    <span class="text-[9px] text-rose-400 font-bold tracking-wider">PIECZĘĆ ROBOCZA</span>
  `;

  if (style === 'teen') {
    const recipientHtml = isMaster
      ? `<div class="py-2 border-b-2 border-cyan-400/40 max-w-lg mx-auto"><span class="text-2xl sm:text-3xl md:text-5xl font-black text-white font-cyber tracking-wide break-words">${name}</span></div>`
      : `<div class="py-2.5 px-4 rounded-xl border-2 border-dashed border-rose-500/70 bg-rose-950/50 text-center max-w-lg mx-auto select-none"><span class="text-sm sm:text-lg md:text-xl font-mono text-rose-300 font-black tracking-wider block">[ 🔒 ZAMAZANE: STAŻYSTA W TRAKCIE MISJI ]</span><span class="text-[11px] text-amber-300 font-bold block mt-0.5">Wynik: ${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints} pkt (${scoreData.percentage}%) • Ocena: ${scoreData.grade.short} — Zatwierdź ocenę w raporcie powyżej</span></div>`;

    const sealHtml = isMaster
      ? `
        <div class="w-16 h-16 rounded-full border-2 border-cyan-400 bg-cyan-950 flex flex-col items-center justify-center text-[9px] font-black uppercase tracking-tighter text-cyan-300 mx-auto mb-1 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          <span>CYBER</span>
          <span>VERIFIED</span>
          <span class="text-[7px]">2026 ⚡</span>
        </div>
        <span class="text-[9px] text-cyan-400 font-bold tracking-widest">CYFROWY ZNAK JAKOŚCI</span>
      `
      : unverifiedSeal;

    canvas.innerHTML = `
      <div class="border-4 sm:border-[8px] border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.3)] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-cyan-50 p-5 sm:p-8 md:p-12 rounded-3xl relative overflow-hidden select-text">
        <div class="absolute inset-2 border-2 border-dashed border-cyan-400/40 pointer-events-none rounded-2xl" aria-hidden="true"></div>
        ${artefactsHtml}

        <div class="text-center relative z-10 mb-5 sm:mb-6">
          <div class="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-3">
            <span>CYBER ACADEMY 2026 • AI PROMPT GUILD</span>
            <span role="img" aria-label="(ikona gracza)">👾</span>
          </div>
          <h2 id="diploma-title" class="text-xl sm:text-2xl md:text-4xl font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400 font-cyber" tabindex="-1">
            CYBER-CERTYFIKAT MISTRZOWSKI
          </h2>
          <p class="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-cyan-400 font-bold mt-1">
            Oficjalny Tytuł Cyber-Architekta AI i Nowej Ery Vibe Codingu
          </p>
        </div>

        <div class="text-center relative z-10 max-w-2xl mx-auto my-5 sm:my-6 space-y-4">
          <p class="text-xs uppercase tracking-widest text-slate-400 font-bold">Ten dokument zaświadcza, że</p>
          ${recipientHtml}
          <p class="text-xs md:text-sm text-cyan-100/90 leading-relaxed font-sans">
            ${completedWord} elitarny program <strong>100 misji kodowania bez barier</strong>, opanowując architekturę promptów, budowę botów, symulatorów i mini-gier w przeglądarce, eliminację błędów w konsoli F12 oraz niezależne publikowanie projektów w chmurze!
          </p>
          <div class="inline-block px-4 sm:px-5 py-2 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-200 font-black text-[11px] sm:text-xs uppercase tracking-wider shadow">
            Tytuł: ${titlePrefix} Cyber-${architectWord} AI i Mistrz Vibe Codingu
          </div>
          <div class="mt-2">
            <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950 border border-cyan-400/80 text-cyan-300 text-xs font-black uppercase tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <span>OCENA KOŃCOWA: ${scoreData.grade.short}</span>
              <span>•</span>
              <span>${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints} PKT (${scoreData.percentage}%)</span>
              <span>${scoreData.grade.stars}</span>
            </span>
          </div>
          ${getBusinessAddonsDiplomaBadge(style)}
        </div>

        <div class="mt-6 sm:mt-8 pt-5 border-t border-cyan-800/60 flex flex-wrap items-center justify-between text-xs text-cyan-300 gap-4 relative z-10">
          <div>
            <p class="font-bold text-white">ID Certyfikatu:</p>
            <p class="font-mono text-cyan-400">${certId}</p>
            <p class="text-[10px] text-slate-400 mt-0.5">Data wystawienia: ${issueDate}</p>
          </div>
          <div class="text-center">
            ${sealHtml}
          </div>
          <div class="text-right">
            <p class="font-cyber text-sm font-bold text-white">Antigravity AI Sensei</p>
            <div class="w-32 border-b border-cyan-500/50 my-1 ml-auto"></div>
            <p class="text-[10px] text-slate-400 uppercase">Gildia Twórców Nowej Ery</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (style === 'senior') {
    const recipientHtml = isMaster
      ? `<div class="py-2 border-b-2 border-amber-700/40 max-w-lg mx-auto"><span class="text-2xl sm:text-3xl md:text-5xl font-serif-title font-bold text-amber-950 italic break-words">${name}</span></div>`
      : `<div class="py-2.5 px-4 rounded-xl border-2 border-dashed border-rose-500/70 bg-rose-950/40 text-center max-w-lg mx-auto select-none"><span class="text-sm sm:text-lg md:text-xl font-mono text-rose-300 font-black tracking-wider block">[ 🔒 ZAMAZANE: CYFROWY ADEPT W TRAKCIE SZKOLENIA ]</span><span class="text-[11px] text-amber-300 font-bold block mt-0.5">Wynik: ${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints} pkt (${scoreData.percentage}%) • Ocena: ${scoreData.grade.short} — Zatwierdź ocenę w raporcie powyżej</span></div>`;

    const sealHtml = isMaster
      ? `
        <div class="w-16 h-16 rounded-full border-2 border-amber-700 bg-gradient-to-br from-amber-200 to-amber-300 flex flex-col items-center justify-center text-[9px] font-black uppercase text-amber-950 shadow-md mx-auto mb-1">
          <span>HONORIS</span>
          <span>LAUREAT</span>
          <span class="text-[7px]">2026 ★</span>
        </div>
        <span class="text-[9px] text-amber-800 font-bold tracking-wider">PIECZĘĆ UZNANIA</span>
      `
      : unverifiedSeal;

    canvas.innerHTML = `
      <div class="border-4 sm:border-[10px] border-amber-700/80 bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-100 text-amber-950 p-5 sm:p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden select-text">
        <div class="absolute inset-2 border-4 border-double border-amber-700/40 pointer-events-none rounded-2xl" aria-hidden="true"></div>
        ${artefactsHtml}

        <div class="text-center relative z-10 mb-5 sm:mb-6">
          <div class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-amber-100 border border-amber-600/40 text-amber-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <span>Akademia Cyfrowej Sprawczości • Edycja Honorowa</span>
            <span role="img" aria-label="(ikona gwiazdy)">🌟</span>
          </div>
          <h2 id="diploma-title" class="text-xl sm:text-2xl md:text-4xl font-serif-title font-black uppercase tracking-wide text-amber-950" tabindex="-1">
            HONOROWY DYPLOM CYFROWEGO MISTRZA
          </h2>
          <p class="text-xs md:text-sm uppercase tracking-[0.12em] text-amber-800 font-bold mt-1">
            Świadomy Twórca Nowych Technologii i Praktycznych Narzędzi
          </p>
        </div>

        <div class="text-center relative z-10 max-w-2xl mx-auto my-5 sm:my-6 space-y-4">
          <p class="text-xs uppercase tracking-widest text-amber-800 font-bold">Niniejszy Dyplom Honorowy zaświadcza, że</p>
          ${recipientHtml}
          <p class="text-sm md:text-base text-amber-900 leading-relaxed font-serif-title">
            z wielką klasą, wytrwałością i odwagą ${completedWord} program <strong>100 praktycznych ćwiczeń Vibe Codingu</strong>, udowadniając, że życiowa mądrość, jasność formułowania myśli w języku ojczystym i ciekawość świata są najważniejszymi kompetencjami człowieka w erze sztucznej inteligencji.
          </p>
          <div class="inline-block px-4 sm:px-5 py-2 rounded-full bg-amber-200/80 border border-amber-600/50 text-amber-950 font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow">
            Tytuł: ${titlePrefix} Mistrz Cyfrowej Odwagi i Nowoczesny Twórca
          </div>
          <div class="mt-2">
            <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-600/60 text-amber-950 text-xs font-bold uppercase tracking-wider shadow">
              <span>Ocena na Dyplomie: ${scoreData.grade.short}</span>
              <span>•</span>
              <span>${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints} pkt (${scoreData.percentage}%)</span>
              <span>${scoreData.grade.stars}</span>
            </span>
          </div>
          ${getBusinessAddonsDiplomaBadge(style)}
        </div>

        <div class="mt-6 sm:mt-8 pt-5 border-t border-amber-600/40 flex flex-wrap items-center justify-between text-xs text-amber-900 gap-4 relative z-10">
          <div>
            <p class="font-bold">Identyfikator Certyfikatu:</p>
            <p class="font-mono text-amber-800">${certId}</p>
            <p class="text-[11px] text-amber-700 mt-0.5">Wydano dnia: ${issueDate}</p>
          </div>
          <div class="text-center">
            ${sealHtml}
          </div>
          <div class="text-right">
            <p class="font-serif-title text-sm font-bold text-amber-950">Opiekun Ścieżki Cyfrowej</p>
            <div class="w-36 border-b border-amber-700/60 my-1 ml-auto"></div>
            <p class="text-[10px] text-amber-800 uppercase">Klub Nowoczesnych Twórców</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (style === 'creative') {
    const recipientHtml = isMaster
      ? `<div class="py-2 border-b-2 border-fuchsia-400/40 max-w-lg mx-auto"><span class="text-2xl sm:text-3xl md:text-5xl font-serif-title font-bold text-white italic break-words">${name}</span></div>`
      : `<div class="py-2.5 px-4 rounded-xl border-2 border-dashed border-rose-500/70 bg-rose-950/50 text-center max-w-lg mx-auto select-none"><span class="text-sm sm:text-lg md:text-xl font-mono text-rose-300 font-black tracking-wider block">[ 🔒 ZAMAZANE: KREATOR W TRAKCIE SZKOLENIA ]</span><span class="text-[11px] text-amber-300 font-bold block mt-0.5">Wynik: ${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints} pkt (${scoreData.percentage}%) • Ocena: ${scoreData.grade.short} — Zatwierdź ocenę w raporcie powyżej</span></div>`;

    const sealHtml = isMaster
      ? `
        <div class="w-16 h-16 rounded-full border-2 border-fuchsia-400 bg-purple-950 flex flex-col items-center justify-center text-[9px] font-black uppercase text-fuchsia-300 mx-auto mb-1 shadow-[0_0_15px_rgba(217,70,239,0.5)]">
          <span>STUDIO</span>
          <span>AI ART</span>
          <span class="text-[7px]">2026 ★</span>
        </div>
        <span class="text-[9px] text-fuchsia-400 font-bold tracking-widest">PIECZĘĆ ARTYSTYCZNA</span>
      `
      : unverifiedSeal;

    canvas.innerHTML = `
      <div class="border-4 sm:border-[8px] border-fuchsia-600/80 shadow-[0_0_40px_rgba(217,70,239,0.25)] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-fuchsia-50 p-5 sm:p-8 md:p-12 rounded-3xl relative overflow-hidden select-text">
        <div class="absolute inset-2 border-2 border-dashed border-fuchsia-400/40 pointer-events-none rounded-2xl" aria-hidden="true"></div>
        ${artefactsHtml}

        <div class="text-center relative z-10 mb-5 sm:mb-6">
          <div class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-purple-950 border border-fuchsia-400/50 text-fuchsia-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <span>Creative AI Studio • Master Certification</span>
            <span role="img" aria-label="(ikona palety)">🎨</span>
          </div>
          <h2 id="diploma-title" class="text-xl sm:text-2xl md:text-4xl font-serif-title font-extrabold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-pink-200 to-amber-200" tabindex="-1">
            CERTYFIKAT WIZJONERA CYFROWEGO
          </h2>
          <p class="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-fuchsia-300 font-bold mt-1">
            Mistrz Sztuki Promptu i Interaktywnego Designu
          </p>
        </div>

        <div class="text-center relative z-10 max-w-2xl mx-auto my-5 sm:my-6 space-y-4">
          <p class="text-xs uppercase tracking-widest text-slate-400 font-bold">Potwierdzenie kunsztu i kreacji</p>
          ${recipientHtml}
          <p class="text-xs md:text-sm text-purple-100/90 leading-relaxed font-sans">
            z wybitną wrażliwością estetyczną ${completedWord} program <strong>100 kreacji cyfrowych</strong>, łącząc zmysł artystyczny z potęgą modeli generatywnych, budując nastrojowe galerie, interaktywne opowieści paragrafowe oraz niepowtarzalne doświadczenia wizualne!
          </p>
          <div class="inline-block px-4 sm:px-5 py-2 rounded-xl bg-purple-950 border border-fuchsia-400 text-fuchsia-200 font-black text-[11px] sm:text-xs uppercase tracking-wider shadow">
            Tytuł: ${titlePrefix} Kreator Prompt Art i Wizjoner AI
          </div>
          <div class="mt-2">
            <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950 border border-fuchsia-400 text-fuchsia-200 text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(217,70,239,0.3)]">
              <span>Kunszt Kreacji: ${scoreData.grade.short}</span>
              <span>•</span>
              <span>${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints} pkt (${scoreData.percentage}%)</span>
              <span>${scoreData.grade.stars}</span>
            </span>
          </div>
          ${getBusinessAddonsDiplomaBadge(style)}
        </div>

        <div class="mt-6 sm:mt-8 pt-5 border-t border-purple-800/60 flex flex-wrap items-center justify-between text-xs text-fuchsia-300 gap-4 relative z-10">
          <div>
            <p class="font-bold text-white">Identyfikator Dzieła:</p>
            <p class="font-mono text-fuchsia-400">${certId}</p>
            <p class="text-[10px] text-slate-400 mt-0.5">Data kreacji: ${issueDate}</p>
          </div>
          <div class="text-center">
            ${sealHtml}
          </div>
          <div class="text-right">
            <p class="font-serif-title text-sm italic font-bold text-white">Kurator Nowych Mediów</p>
            <div class="w-36 border-b border-fuchsia-400/50 my-1 ml-auto"></div>
            <p class="text-[10px] text-slate-400 uppercase">Rada Projektantów AI</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Domyślny styl: Executive (Biznes i Praca)
  const recipientHtml = isMaster
    ? `<div class="py-2 border-b-2 border-slate-900/20 max-w-lg mx-auto"><span class="text-2xl sm:text-3xl md:text-5xl font-serif-title font-bold text-indigo-950 italic break-words">${name}</span></div>`
    : `<div class="py-2.5 px-4 rounded-xl border-2 border-dashed border-rose-500/70 bg-rose-950/40 text-center max-w-lg mx-auto select-none"><span class="text-sm sm:text-lg md:text-xl font-mono text-rose-300 font-black tracking-wider block">[ 🔒 ZAMAZANE: STAŻYSTA W TRAKCIE SZKOLENIA ]</span><span class="text-[11px] text-amber-300 font-bold block mt-0.5">Wynik: ${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints} pkt (${scoreData.percentage}%) • Ocena: ${scoreData.grade.short} — Zatwierdź ocenę w raporcie powyżej</span></div>`;

  const sealHtml = isMaster
    ? `
      <div class="w-16 h-16 rounded-full border-2 border-amber-600 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-[9px] uppercase flex flex-col items-center justify-center tracking-tighter shadow mx-auto mb-1">
        <span>EXECUTIVE</span>
        <span>AI ARCHITECT</span>
        <span class="text-[7px]">2026 ★</span>
      </div>
      <span class="text-[9px] uppercase font-bold text-slate-500 tracking-wider">PIECZĘĆ OFICJALNA</span>
    `
    : unverifiedSeal;

  canvas.innerHTML = `
    <div class="border-4 sm:border-[10px] border-amber-600/70 bg-gradient-to-br from-amber-50 via-white to-amber-50/80 text-slate-900 p-5 sm:p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden select-text">
      <div class="absolute inset-2 border-2 border-dashed border-amber-500/40 pointer-events-none rounded-2xl" aria-hidden="true"></div>
      ${artefactsHtml}

      <div class="text-center relative z-10 mb-5 sm:mb-6">
        <div class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-amber-100 border border-amber-500/40 text-amber-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3">
          <span>Instytut Innowacji Biznesowych AI • Akredytacja</span>
          <span role="img" aria-label="(ikona teczki)">💼</span>
        </div>
        <h2 id="diploma-title" class="text-xl sm:text-2xl md:text-4xl font-serif-title font-extrabold uppercase tracking-wide text-slate-950 border-b-2 border-amber-500/30 pb-3 inline-block" tabindex="-1">
          CERTYFIKAT KOMPETENCJI ZAWODOWYCH
        </h2>
        <p class="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-amber-800 font-bold mt-2">
          Certyfikowany Strateg Vibe Codingu i Automatyzacji Procesów AI
        </p>
      </div>

      <div class="text-center relative z-10 max-w-2xl mx-auto my-5 sm:my-6 space-y-4">
        <p class="text-xs uppercase tracking-widest text-slate-600 font-bold">Niniejszy dokument poświadcza, że</p>
        ${recipientHtml}
        <p class="text-xs md:text-sm text-slate-700 leading-relaxed font-serif-title">
          ${completedWord} kompleksowy program <strong>100 wdrożeń praktycznych</strong>, opanowując architekturę dekompozycji problemów biznesowych, inżynierię promptów C-C-O-F, automatyzację arkuszy CSV i kalkulacji, tworzenie narzędzi w <strong>Cursor IDE, v0.dev, Bolt.new</strong> oraz samodzielną publikację rozwiązań cyfrowych.
        </p>
        <div class="inline-block px-4 sm:px-5 py-2 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-900 font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-sm">
          Tytuł: ${titlePrefix} ${architectWord} Systemów Vibe Codingu i ${directorWord} AI
        </div>
        <div class="mt-2">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/60 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-sm">
            <span>Ocena Kwalifikacyjna: ${scoreData.grade.short}</span>
            <span>•</span>
            <span>${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints} pkt (${scoreData.percentage}%)</span>
            <span>${scoreData.grade.stars}</span>
          </span>
        </div>
        ${getBusinessAddonsDiplomaBadge(style)}
      </div>

      <div class="mt-6 sm:mt-8 pt-5 border-t border-slate-300 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4 relative z-10">
        <div>
          <p class="font-bold text-slate-900">Numer Akredytacji:</p>
          <p class="font-mono text-amber-800">${certId}</p>
          <p class="text-[10px] text-slate-500 mt-0.5">Data ukończenia: ${issueDate}</p>
        </div>
        <div class="text-center">
          ${sealHtml}
        </div>
        <div class="text-right">
          <p class="font-serif-title text-sm italic font-bold text-slate-900">Dyrektor ds. Transformacji AI</p>
          <div class="w-36 border-b border-slate-400 my-1 ml-auto"></div>
          <p class="text-[10px] uppercase text-slate-500">Komisja Certyfikacyjna</p>
        </div>
      </div>
    </div>
  `;
  updateDiplomaCleansingUI();
}

// =========================================================================
// RENDEROWANIE ZADAŃ I LOGIKA KATALOGU
// =========================================================================
function populateQuickDayJump() {
  const selects = [
    document.getElementById('daily-jump-select'),
    document.getElementById('quick-day-jump-select')
  ];
  selects.forEach(select => {
    if (!select) return;
    select.innerHTML = '';
    for (let d = 1; d <= STATE.totalDays; d++) {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = `Dzień ${d}`;
      select.appendChild(opt);
    }
    select.value = STATE.currentDay;
  });
}

function jumpToDay(dayNum) {
  if (isNaN(dayNum) || dayNum < 1 || dayNum > STATE.totalDays) return;
  STATE.currentDay = dayNum;
  playClickSound();
  saveState();
  renderTasks();
  announceSR(`Przełączono na Dzień ${STATE.currentDay} z ${STATE.totalDays}.`);
}

function updateClearSearchButtonVisibility() {
  const btn = document.getElementById('btn-clear-search');
  if (!btn) return;
  const hasFilters = Boolean(STATE.searchQuery) || STATE.filterStage !== 'all' || STATE.filterStatus !== 'all';
  if (hasFilters) {
    btn.classList.remove('hidden');
    btn.classList.add('inline-flex');
  } else {
    btn.classList.add('hidden');
    btn.classList.remove('inline-flex');
  }
}

function clearSearchAndFilters() {
  STATE.searchQuery = '';
  STATE.filterStage = 'all';
  STATE.filterStatus = 'all';

  const sInput = document.getElementById('search-tasks-input');
  const stSelect = document.getElementById('filter-stage-select');
  const statusSel = document.getElementById('filter-status-select');

  if (sInput) sInput.value = '';
  if (stSelect) stSelect.value = 'all';
  if (statusSel) statusSel.value = 'all';

  playClickSound();
  updateClearSearchButtonVisibility();
  renderTasks();
  announceSR('Usunięto aktywne filtry i wyszukiwanie.');
}

function setViewMode(mode) {
  playClickSound();
  STATE.viewMode = mode;
  saveState();

  const btnDaily = document.getElementById('btn-view-daily');
  const btnAll = document.getElementById('btn-view-all');

  if (btnDaily && btnAll) {
    if (mode === 'daily') {
      btnDaily.classList.replace('text-slate-400', 'text-white');
      btnDaily.classList.add('bg-indigo-600', 'shadow-md');
      btnDaily.setAttribute('aria-pressed', 'true');

      btnAll.classList.replace('text-white', 'text-slate-400');
      btnAll.classList.remove('bg-indigo-600', 'shadow-md');
      btnAll.setAttribute('aria-pressed', 'false');
    } else {
      btnAll.classList.replace('text-slate-400', 'text-white');
      btnAll.classList.add('bg-indigo-600', 'shadow-md');
      btnAll.setAttribute('aria-pressed', 'true');

      btnDaily.classList.replace('text-white', 'text-slate-400');
      btnDaily.classList.remove('bg-indigo-600', 'shadow-md');
      btnDaily.setAttribute('aria-pressed', 'false');
    }
  }

  renderTasks();
}

function nextDay() {
  if (STATE.currentDay < STATE.totalDays) {
    STATE.currentDay++;
    playClickSound();
    saveState();
    renderTasks();
    announceSR(`Przejście do dnia ${STATE.currentDay}`);
  }
}

function prevDay() {
  if (STATE.currentDay > 1) {
    STATE.currentDay--;
    playClickSound();
    saveState();
    renderTasks();
    announceSR(`Przejście do dnia ${STATE.currentDay}`);
  }
}

function getStageForDay(day) {
  if (day <= 5) return STAGES[0];
  if (day <= 12) return STAGES[1];
  if (day <= 19) return STAGES[2];
  if (day <= 24) return STAGES[3];
  if (day <= 29) return STAGES[4];
  return STAGES[5] || STAGES[0];
}

function renderDailyPracticeEncouragementHtml(day) {
  return `
    <div class="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-slate-900 border border-indigo-500/40 shadow-xl" role="region" aria-label="Wskazówki praktyczne do zadań dnia">
      <div class="flex items-start gap-3 sm:gap-4">
        <span class="text-3xl shrink-0" role="img" aria-label="(żarówka)">💡</span>
        <div class="space-y-2 flex-grow">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-sm sm:text-base font-black text-amber-300">
              Złota zasada Vibe Codingu: Przenieś każde z 3 zadań do codziennego życia!
            </h3>
            <span class="text-[11px] font-bold text-indigo-200 bg-indigo-900/60 border border-indigo-500/40 px-2.5 py-0.5 rounded-full">
              Dzień ${day} • Teoria w Praktyce
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Samo przeklejenie promptu w kursie to rozgrzewka. Prawdziwe mistrzostwo rodzi się wtedy, gdy po wykonaniu zadania spróbujesz ten sam mechanizm zastosować do swoich spraw:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-300">
            <div class="p-3 rounded-2xl bg-slate-900/80 border border-indigo-500/30 flex items-start gap-2.5 shadow-sm">
              <span class="text-xl shrink-0" role="img" aria-label="(biuro)">🏢</span>
              <div>
                <strong class="text-indigo-300 block mb-0.5 font-bold">W Twojej pracy zawodowej:</strong>
                <span class="leading-relaxed">Zautomatyzuj nudny e-mail, stwórz pomocniczy kalkulator dla zespołu, podsumuj długi raport lub przygotuj schemat oferty.</span>
              </div>
            </div>
            <div class="p-3 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex items-start gap-2.5 shadow-sm">
              <span class="text-xl shrink-0" role="img" aria-label="(dom)">🏡</span>
              <div>
                <strong class="text-emerald-300 block mb-0.5 font-bold">W Twoim życiu osobistym:</strong>
                <span class="leading-relaxed">Stwórz planer domowych wydatków, harmonogram treningów lub leków, listę pakowania na wakacje albo quiz dla rodziny.</span>
              </div>
            </div>
          </div>
          <div class="mt-2 p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs flex items-center gap-2 font-bold shadow-inner">
            <span class="text-base shrink-0" role="img" aria-label="(notatnik)">📝</span>
            <span>Koniecznie zapisuj rezultaty, linki i wnioski w notatkach pod każdym zadaniem – budujesz w ten sposób swoje bezcenne portfolio!</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTasks() {
  const dailyCardsContainer = document.getElementById('daily-tasks-cards-container');
  const dailyToolsMount = document.getElementById('daily-tools-mount-point');
  const allCardsContainer = document.getElementById('all-tasks-cards-container');
  const legacyContainer = document.getElementById('tasks-container');

  const scoreData = calculateScore();
  const count = scoreData.passedCount;
  const total = scoreData.totalTasks;
  const pct = scoreData.percentage;

  // 1. Aktualizacja kontrolek i wskaźników Dnia (Podstrona 6)
  const dailyTasks = TASKS_DATA.filter(t => t.day === STATE.currentDay);
  const dailyDone = dailyTasks.filter(t => getTaskStatus(t.id) === 'passed').length;
  let dailyEarned = 0;
  let dailyPossible = 0;
  dailyTasks.forEach(t => {
    const pts = getTaskPoints(t);
    dailyPossible += pts;
    if (getTaskStatus(t.id) === 'passed') dailyEarned += pts;
  });
  const dailyPct = dailyPossible > 0 ? Math.round((dailyEarned / dailyPossible) * 100) : 0;

  const dailyProgressCount = document.getElementById('daily-progress-count');
  if (dailyProgressCount) dailyProgressCount.textContent = `${dailyDone} / ${dailyTasks.length} zadań (${dailyEarned}/${dailyPossible} pkt)`;
  const dailyProgressPct = document.getElementById('daily-progress-pct');
  if (dailyProgressPct) dailyProgressPct.textContent = `(${dailyPct}%)`;

  const stageObj = getStageForDay(STATE.currentDay);
  const dailyStageBadge = document.getElementById('daily-stage-badge');
  if (dailyStageBadge) dailyStageBadge.textContent = `${stageObj.name}`;

  const dailyPageTitle = document.getElementById('daily-tasks-page-title');
  if (dailyPageTitle) dailyPageTitle.textContent = `Dzień ${STATE.currentDay} z ${STATE.totalDays} • Zadania na dziś`;

  const curDayTitleDisp = document.getElementById('current-day-title-display');
  if (curDayTitleDisp) curDayTitleDisp.textContent = `Dzień ${STATE.currentDay} z ${STATE.totalDays}`;
  const curStageTitleDisp = document.getElementById('current-stage-title-display');
  if (curStageTitleDisp) curStageTitleDisp.textContent = stageObj.name;

  // Baner informacyjny o punkcie startowym na Podstronie 6
  const noticeBanner = document.getElementById('daily-day-notice-banner');
  const bannerDayNum = document.getElementById('daily-banner-day-number');
  if (noticeBanner) {
    if (STATE.currentDay > 1) {
      noticeBanner.classList.remove('hidden');
      if (bannerDayNum) bannerDayNum.textContent = `Dniu ${STATE.currentDay}`;
    } else {
      noticeBanner.classList.add('hidden');
    }
  }

  // Przełączniki i selecty dni
  const jumpSel1 = document.getElementById('daily-jump-select');
  if (jumpSel1) jumpSel1.value = STATE.currentDay;
  const jumpSel2 = document.getElementById('quick-day-jump-select');
  if (jumpSel2) jumpSel2.value = STATE.currentDay;

  const btnPrev1 = document.getElementById('btn-daily-prev-day');
  const btnNext1 = document.getElementById('btn-daily-next-day');
  if (btnPrev1) btnPrev1.disabled = STATE.currentDay <= 1;
  if (btnNext1) btnNext1.disabled = STATE.currentDay >= STATE.totalDays;

  const btnPrev2 = document.getElementById('btn-prev-day');
  const btnNext2 = document.getElementById('btn-next-day');
  if (btnPrev2) btnPrev2.disabled = STATE.currentDay <= 1;
  if (btnNext2) btnNext2.disabled = STATE.currentDay >= STATE.totalDays;

  // 2. Renderowanie kart dla widoku Dnia
  if (dailyCardsContainer) {
    const encouragementHtml = renderDailyPracticeEncouragementHtml(STATE.currentDay);
    dailyCardsContainer.innerHTML = encouragementHtml + dailyTasks.map(task => renderTaskCard(task)).join('');
  }
  if (dailyToolsMount) {
    dailyToolsMount.innerHTML = renderDailyToolsHtml(STATE.currentDay);
    initDailyNotesListeners();
    initMainStudio(STATE.currentDay);
  }

  // 3. Aktualizacja wskaźników Katalogu (Podstrona 7)
  const allTasksProgressText = document.getElementById('all-tasks-progress-text');
  if (allTasksProgressText) allTasksProgressText.textContent = `${pct}%`;
  const allTasksProgressCount = document.getElementById('all-tasks-progress-count');
  if (allTasksProgressCount) allTasksProgressCount.textContent = `${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints} pkt • ${count} z ${total} zadań`;

  // 4. Filtrowanie i renderowanie dla pełnego Katalogu
  if (allCardsContainer) {
    const filteredAll = TASKS_DATA.filter(t => {
      const matchStage = STATE.filterStage === 'all' || t.stage.toString() === STATE.filterStage;
      const matchStatus = STATE.filterStatus === 'all' ||
        (STATE.filterStatus === 'passed' && getTaskStatus(t.id) === 'passed') ||
        (STATE.filterStatus === 'failed' && getTaskStatus(t.id) === 'failed') ||
        (STATE.filterStatus === 'skipped' && getTaskStatus(t.id) === 'skipped') ||
        (STATE.filterStatus === 'pending' && getTaskStatus(t.id) === 'pending') ||
        (STATE.filterStatus === 'completed' && getTaskStatus(t.id) === 'passed');
      const matchQuery = !STATE.searchQuery ||
        t.title.toLowerCase().includes(STATE.searchQuery.toLowerCase()) ||
        t.goal.toLowerCase().includes(STATE.searchQuery.toLowerCase()) ||
        t.desc.toLowerCase().includes(STATE.searchQuery.toLowerCase()) ||
        t.prompt.toLowerCase().includes(STATE.searchQuery.toLowerCase());
      return matchStage && matchStatus && matchQuery;
    });

    const catalogCountDisp = document.getElementById('catalog-count-display');
    if (catalogCountDisp) catalogCountDisp.textContent = `Wyświetlanie ${filteredAll.length} z ${total} zadań`;

    if (filteredAll.length === 0) {
      allCardsContainer.innerHTML = `
        <div class="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800">
          <h2 class="text-lg font-bold text-white mb-1 inline-flex items-center justify-center gap-2">
            <span>Brak zadań spełniających kryteria</span>
            <span role="img" aria-label="(ikona lupy)">🔍</span>
          </h2>
          <p class="text-xs text-slate-400 mb-4">Spróbuj zmienić parametry filtrów lub usuń wyszukiwaną frazę.</p>
          <button type="button" onclick="clearSearchAndFilters()" class="touch-target px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold inline-flex items-center gap-1.5">
            <span>Usuń filtr</span>
            <span role="img" aria-label="(ikona kosza)">🗑️</span>
          </button>
        </div>
      `;
    } else {
      allCardsContainer.innerHTML = filteredAll.map(task => renderTaskCard(task)).join('');
    }
  }

  // 5. Kompatybilność wsteczna z tasks-container (jeśli element istnieje)
  if (legacyContainer) {
    if (STATE.viewMode === 'daily') {
      const encouragementHtml = renderDailyPracticeEncouragementHtml(STATE.currentDay);
      legacyContainer.innerHTML = encouragementHtml + dailyTasks.map(task => renderTaskCard(task)).join('') + renderDailyToolsHtml(STATE.currentDay);
      initDailyNotesListeners();
      initMainStudio(STATE.currentDay);
    } else {
      legacyContainer.innerHTML = TASKS_DATA.map(task => renderTaskCard(task)).join('');
    }
  }
}

function openDayFocusWindow(day) {
  const targetDay = day || STATE.currentDay || 1;
  // W trybie jednoplikowym lub na ekranach mobilnych (np. iPhone) użyj natychmiastowego wbudowanego Trybu Skupienia
  if (window.IS_SINGLE_FILE_BUNDLE || window.innerWidth < 768) {
    STATE.currentDay = targetDay;
    toggleInlineFocusMode();
    return;
  }

  const url = `day_focus.html?day=${targetDay}`;
  const win = window.open(url, 'VibeDayFocusWindow', 'width=1150,height=920,scrollbars=yes,resizable=yes');
  if (win) {
    win.focus();
    announceSR(`Otwarto zadania na Dzień ${targetDay} w osobnym oknie skupienia.`);
  } else {
    window.location.href = url;
  }
}

function renderDailyToolsHtml(day) {
  const savedNotes = localStorage.getItem(`vibe_coding_notes_day_${day}`) || '';
  return `
    <section id="daily-tools-section" class="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-800" aria-labelledby="tools-heading">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <span class="text-xs uppercase font-extrabold tracking-wider text-amber-400 block mb-1">Przybornik Twórcy</span>
          <h2 id="tools-heading" class="text-lg sm:text-xl md:text-2xl font-black text-white" tabindex="-1">
            Narzędzia przydatne przy realizacji zadań (Dzień ${day})
          </h2>
        </div>
        <button type="button" onclick="openDayFocusWindow(${day})" class="touch-target px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs md:text-sm flex items-center gap-2 shadow-lg transition">
          <span>${STATE.inlineFocusMode ? 'Wróć do pełnego widoku' : 'Tryb Skupienia Dnia'}</span><span class="hidden sm:inline">${STATE.inlineFocusMode ? '' : ' (Alt+S)'}</span>
          <span role="img" aria-label="(ikona okna)">🪟</span>
        </button>
      </div>

      <div class="space-y-6">
        <!-- Narzędzie 1 (H3): Asystenci AI (Nazwa najpierw, opis ikonki po niej!) -->
        <article class="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-md">
          <h3 id="tool-heading-ai" class="text-base sm:text-lg font-bold text-white mb-2 flex items-center justify-between sm:justify-start gap-2">
            <span>1. Asystenci AI i Narzędzia Chat (Szybkie uruchamianie)</span>
            <span role="img" aria-label="(ikona robota)">🤖</span>
          </h3>
          <p class="text-xs text-slate-300 mb-3">Stuknij lub kliknij asystenta, aby otworzyć go w nowej karcie i wkleić skopiowany prompt:</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 text-xs text-center">
            <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" class="touch-target p-3 rounded-xl bg-slate-800 hover:bg-indigo-950 border border-slate-700 hover:border-indigo-500 text-white font-bold transition flex flex-col items-center justify-center gap-1">
              <span>Google Gemini</span>
              <span class="text-lg" role="img" aria-label="(ikona iskierek, nowa karta)">✨ &nearr;</span>
            </a>
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" class="touch-target p-3 rounded-xl bg-slate-800 hover:bg-amber-950 border border-slate-700 hover:border-amber-500 text-white font-bold transition flex flex-col items-center justify-center gap-1">
              <span>Anthropic Claude</span>
              <span class="text-lg" role="img" aria-label="(ikona mózgu, nowa karta)">🧠 &nearr;</span>
            </a>
            <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" class="touch-target p-3 rounded-xl bg-slate-800 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 text-white font-bold transition flex flex-col items-center justify-center gap-1">
              <span>ChatGPT</span>
              <span class="text-lg" role="img" aria-label="(ikona błyskawicy, nowa karta)">⚡ &nearr;</span>
            </a>
            <a href="https://notebooklm.google.com" target="_blank" rel="noopener noreferrer" class="touch-target p-3 rounded-xl bg-slate-800 hover:bg-purple-950 border border-slate-700 hover:border-purple-500 text-white font-bold transition flex flex-col items-center justify-center gap-1">
              <span>NotebookLM</span>
              <span class="text-lg" role="img" aria-label="(ikona mikrofonu, nowa karta)">🎙️ &nearr;</span>
            </a>
            <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" class="touch-target col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-800 hover:bg-sky-950 border border-slate-700 hover:border-sky-500 text-white font-bold transition flex flex-col items-center justify-center gap-1">
              <span>Google AI Studio</span>
              <span class="text-lg" role="img" aria-label="(ikona laboratorium, nowa karta)">🧪 &nearr;</span>
            </a>
          </div>
        </article>

        <!-- Narzędzie 2 (H3): Piaskownica kodu -->
        <article class="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h3 id="tool-heading-sandbox" class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>2. Piaskownica na żywo — Bezpieczny podgląd Twojej aplikacji</span>
              <span role="img" aria-label="(ikona laboratorium)">🧪</span>
            </h3>
            <span class="text-[11px] text-amber-300 font-bold bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full">
              Bezpieczny plac zabaw (Nic nie popsujesz)
            </span>
          </div>
          <p class="text-xs text-slate-300 mb-3 leading-relaxed">
            <strong>Czym jest piaskownica?</strong> To bezpieczny kącik testowy w przeglądarce. Gdy sztuczna inteligencja wygeneruje dla Ciebie kod strony (HTML), wklej go poniżej i kliknij <em>„Uruchom podgląd na żywo”</em>. Zobaczysz i poklikasz w gotowy program bez instalowania czegokolwiek na komputerze!
          </p>
          <div class="space-y-3">
            <label for="main-sandbox-code-input" class="sr-only">Edytor kodu HTML w piaskownicy</label>
            <textarea id="main-sandbox-code-input" rows="5" placeholder="Wklej tutaj wygenerowany kod HTML..." class="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"></textarea>
            <div class="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2">
              <button type="button" onclick="runMainSandboxCode()" class="touch-target px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow">
                <span>Uruchom podgląd na żywo</span>
                <span role="img" aria-label="(ikona odtwarzania)">▶</span>
              </button>
              <button type="button" onclick="downloadMainSandboxFile(${day})" class="touch-target px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow">
                <span>Pobierz jako plik .html</span>
                <span role="img" aria-label="(ikona zapisu)">💾</span>
              </button>
              <button type="button" onclick="saveCurrentSandboxToArchive(${day})" class="touch-target px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow cursor-pointer" title="Zapisz ten kod w swojej Skarbnicy Projektów">
                <span>Zapisz w Skarbnicy</span>
                <span role="img" aria-label="(ikona skarbnicy)">🏺</span>
              </button>
              <button type="button" onclick="clearMainSandbox()" class="touch-target px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-200 hover:text-rose-200 text-xs font-bold transition flex items-center justify-center gap-1.5">
                <span>Usuń kod</span>
                <span role="img" aria-label="(ikona kosza)">🗑️</span>
              </button>
            </div>
            <div id="main-sandbox-wrapper" class="hidden mt-3 pt-3 border-t border-slate-800">
              <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span class="font-bold text-emerald-400">Podgląd na żywo aktywny:</span>
                <button type="button" onclick="closeMainSandboxPreview()" class="touch-target px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1">
                  <span>Schowaj podgląd</span>
                  <span role="img" aria-label="(ikona zamknięcia)">&times;</span>
                </button>
              </div>
              <iframe id="main-sandbox-frame" sandbox="allow-scripts allow-modals allow-forms" class="w-full h-80 sm:h-96 rounded-2xl bg-white border-2 border-emerald-500/60 shadow-lg" title="Podgląd uruchomionego kodu strony. Użyj klawisza Tab lub Shift+Tab, aby poruszać się po elementach strony lub przejść do Studia ulepszeń."></iframe>
              <div class="flex justify-end mt-2">
                <button type="button" onclick="focusMainStudioFromSandbox()" class="touch-target text-xs px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-indigo-950/70 border border-slate-700 hover:border-indigo-500/50 text-indigo-300 font-bold transition flex items-center gap-1.5 shadow">
                  <span>Przejdź do Studia Ulepszeń promptu</span>
                  <span role="img" aria-label="(strzałka w dół)">↓</span>
                </button>
              </div>
            </div>
          </div>
        </article>

        <!-- Narzędzie 3 (H3): Studio Eksperymentów i Rozwoju Projektu -->
        <article class="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-md" id="studio-section-card">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h3 id="tool-heading-prompt-helper" tabindex="-1" class="text-base sm:text-lg font-bold text-white flex items-center gap-2 outline-none">
              <span>3. Studio Eksperymentów i Rozwoju Projektu</span>
              <span role="img" aria-label="(ikona laboratorium i iskier)">🧪✨</span>
            </h3>
            <span class="text-[11px] text-amber-300 font-bold bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full">
              Złota Formuła Promptu w praktyce
            </span>
          </div>
          <p class="text-xs text-slate-300 mb-3 leading-relaxed">
            Chcesz rozwinąć swoją stronę (np. dodać licznik odsłon, zmienić styl, dodać dźwięki) lub stworzyć nowy pomysł od zera? Wybierz bazę, skorzystaj z gotowych inspiracji dopasowanych do wybranego projektu lub wpisz własny pomysł:
          </p>

          <!-- WYBÓR BAZY PROJEKTU -->
          <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 mb-3.5 space-y-2">
            <span class="text-xs font-bold text-slate-200 block mb-1">Krok 1: Wybierz punkt wyjścia dla AI:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label for="main-ccof-mode-modify" class="touch-target p-2.5 rounded-xl border border-indigo-500/40 bg-indigo-950/30 hover:bg-indigo-900/40 cursor-pointer flex items-center gap-2.5 text-slate-200 font-semibold transition">
                <input type="radio" name="main-ccof-mode" id="main-ccof-mode-modify" value="modify" checked onchange="toggleMainCcofMode()" class="w-4 h-4 text-indigo-500 cursor-pointer">
                <span>Modyfikuj mój aktualny projekt (Zalecane)</span>
              </label>
              <label for="main-ccof-mode-scratch" class="touch-target p-2.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 cursor-pointer flex items-center gap-2.5 text-slate-300 font-semibold transition">
                <input type="radio" name="main-ccof-mode" id="main-ccof-mode-scratch" value="scratch" onchange="toggleMainCcofMode()" class="w-4 h-4 text-indigo-500 cursor-pointer">
                <span>Stwórz zupełnie nową aplikację od zera</span>
              </label>
            </div>
            <div id="main-ccof-base-badge" class="mt-2 text-[11px] text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2">
              <span id="main-ccof-base-name">✓ Wykryto kod projektu (baza zostanie automatycznie dołączona do promptu)</span>
              <div class="flex flex-wrap items-center gap-1.5" id="main-ccof-base-buttons">
                ${renderMainStudioBaseButtonsHtml(day, MAIN_SELECTED_CCOF_BASE)}
              </div>
            </div>
          </div>

          <!-- SZYBKIE INSPIRACJE I ULEPSZENIA DEDYKOWANE DO PROJEKTU (POLA WYBORU) -->
          <div class="mb-3.5" id="studio-presets-container">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span class="text-xs font-bold text-amber-300 block" id="main-studio-step2-heading">Krok 2: Zaznacz ulepszenia dopasowane do projektu (możesz wybrać kilka naraz):</span>
              <span id="main-preset-count-badge" class="text-[11px] font-bold text-slate-400">Wybrano: 0 ulepszeń</span>
            </div>
            <div id="main-presets-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs" role="group" aria-labelledby="main-studio-step2-heading">
              <!-- Checkboxy generowane dynamicznie przez renderStudioPresets -->
            </div>
          </div>

          <!-- POLA FORMULARZA -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
            <div>
              <label for="main-ccof-goal" class="font-bold text-amber-300 block mb-1">Co nowego chcesz dodać lub zmienić? (Główny cel):</label>
              <textarea id="main-ccof-goal" rows="2" placeholder="np. Dodaj licznik zamówień z przyciskiem, który po każdym kliknięciu zwiększa liczbę o 1 i pamięta stan dzisiejszego dnia..." class="touch-target w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"></textarea>
            </div>
            <div>
              <label for="main-ccof-constraints" class="font-bold text-rose-300 block mb-1">Styl i wymagania wizualne (Zasady):</label>
              <textarea id="main-ccof-constraints" rows="2" placeholder="np. Wkomponuj licznik w obecny wygląd strony, zachowaj neonowe kolory i układ, użyj czystego kodu..." class="touch-target w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400"></textarea>
            </div>
            <div>
              <label for="main-ccof-context" class="font-bold text-indigo-300 block mb-1">Rola asystenta AI (Kontekst):</label>
              <input type="text" id="main-ccof-context" value="Jesteś doświadczonym programistą i moim asystentem Vibe Codingu." class="touch-target w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            </div>
            <div>
              <label for="main-ccof-format" class="font-bold text-emerald-300 block mb-1">Format odpowiedzi od AI:</label>
              <input type="text" id="main-ccof-format" value="Zwróć pojedynczy, kompletny plik HTML ze zaktualizowaną całą stroną, gotowy do wklejenia w piaskownicy." class="touch-target w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400">
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" onclick="buildAndCopyMainCcofPrompt()" class="touch-target px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow">
                <span>Połącz i skopiuj prompt z kodem do schowka</span>
                <span role="img" aria-label="(ikona schowka)">📋</span>
              </button>
              <button type="button" onclick="clearMainCcofForm()" class="touch-target px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-200 text-xs font-bold transition flex items-center gap-1.5">
                <span>Wyczyść</span>
                <span role="img" aria-label="(ikona kosza)">🗑️</span>
              </button>
            </div>
            <span id="main-ccof-status-text" class="text-xs text-emerald-400 font-bold" aria-live="polite"></span>
          </div>
        </article>

        <!-- Narzędzie 4 (H3): Notatnik dnia -->
        <article class="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 id="tool-heading-notes" class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>4. Własne notatki do Dnia ${day}</span>
              <span role="img" aria-label="(ikona notatnika)">📝</span>
            </h3>
            <div class="flex items-center gap-3">
              <span id="main-notes-status" class="text-xs text-emerald-400 font-semibold" aria-live="polite">Zapisano automatycznie ✓</span>
              <button type="button" onclick="deleteMainDailyNote(${day})" class="touch-target px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-200 text-xs font-bold transition flex items-center gap-1.5">
                <span>Usuń notatkę</span>
                <span role="img" aria-label="(ikona kosza)">🗑️</span>
              </button>
            </div>
          </div>
          <label for="main-daily-notes" class="sr-only">Twoje prywatne notatki do Dnia ${day}</label>
          <textarea id="main-daily-notes" rows="3" placeholder="Zapisz swoje uwagi, pytania lub linki do zrobionych aplikacji..." class="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400">${escapeHtmlText(savedNotes)}</textarea>
        </article>

        <!-- Narzędzie 5 (H3): Nawigacja NVDA i VoiceOver -->
        <article class="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-md">
          <h3 id="tool-heading-shortcuts" class="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>5. Szybka nawigacja w NVDA (PC) i VoiceOver (iPhone)</span>
            <span role="img" aria-label="(ikona klawiatury)">⌨️</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong class="text-amber-300 block">NVDA: Klawisz 2 / VoiceOver: Nagłówki</strong>
              <p class="mt-1">Skok bezpośrednio między kolejnymi <strong>Zadaniami</strong> oraz <strong>Sekcją Narzędzi</strong>.</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong class="text-amber-300 block">NVDA: Klawisz 3</strong>
              <p class="mt-1">Skok do podsekcji zadania: <strong>Cel</strong>, <strong>Prompt</strong>, <strong>Rezultat</strong> oraz <strong>Narzędzi</strong>.</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong class="text-indigo-300 block">Kolejność czytania ikon</strong>
              <p class="mt-1">Każdy przycisk podaje <strong>najpierw czynność</strong> (np. „Usuń kod”), a opis ikonki na końcu.</p>
            </div>
          </div>
        </article>

        <!-- DOLNY PASEK NAWIGACJI DNIA (PRZEJŚCIE DO KOLEJNEGO DNIA NA DOLE STRONY) -->
        <nav aria-label="Nawigacja między dniami na dole strony" class="mt-6 p-5 sm:p-6 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button type="button" id="btn-bottom-prev-day" onclick="prevDayAndScrollTop()" class="touch-target px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow" ${day <= 1 ? 'disabled' : ''}>
              <span role="img" aria-label="(strzałka w lewo)">←</span>
              <span>Poprzedni dzień (${day > 1 ? 'Dzień ' + (day - 1) : 'Brak'})</span>
            </button>
          </div>

          <div class="flex items-center gap-2 text-center">
            <span class="text-xs text-slate-400 font-medium hidden md:inline">Jesteś na dole strony:</span>
            <span class="text-xs sm:text-sm font-black text-amber-300 bg-amber-950/70 border border-amber-500/40 px-3.5 py-1.5 rounded-xl">
              Dzień ${day} z ${STATE.totalDays}
            </span>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            ${day < STATE.totalDays ? `
            <button type="button" id="btn-bottom-next-day" onclick="nextDayAndScrollTop()" class="touch-target px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg cursor-pointer">
              <span>Następny dzień (Dzień ${day + 1})</span>
              <span role="img" aria-label="(strzałka w prawo)">→</span>
            </button>
            ` : `
            <button type="button" onclick="switchSubpage('page-rewards')" class="touch-target px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-lg cursor-pointer">
              <span>Wielki Finał — Odbierz Dyplom</span>
              <span role="img" aria-label="(biret)">🎓</span>
            </button>
            `}
          </div>
        </nav>
      </div>
    </section>
  `;
}

function escapeHtmlText(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initDailyNotesListeners() {
  const textarea = document.getElementById('main-daily-notes');
  if (!textarea) return;
  let timer = null;
  textarea.addEventListener('input', () => {
    const status = document.getElementById('main-notes-status');
    if (status) status.textContent = "Zapisywanie...";
    clearTimeout(timer);
    timer = setTimeout(() => {
      localStorage.setItem(`vibe_coding_notes_day_${STATE.currentDay}`, textarea.value);
      if (status) status.textContent = "Zapisano automatycznie ✓";
    }, 400);
  });
}

function deleteMainDailyNote(day) {
  const textarea = document.getElementById('main-daily-notes');
  if (!textarea || !textarea.value.trim()) {
    announceSR('Pole notatki jest już puste.');
    return;
  }
  if (!confirm(`Czy na pewno usunąć notatkę z Dnia ${day}?`)) return;
  textarea.value = '';
  localStorage.removeItem(`vibe_coding_notes_day_${day}`);
  const status = document.getElementById('main-notes-status');
  if (status) status.textContent = "Notatka usunięta ✓";
  playClickSound();
  announceSR(`Usunięto notatkę z Dnia ${day}.`);
}

function sendTaskToMainSandbox(taskId) {
  const task = TASKS_DATA.find(t => t.id === taskId);
  if (!task) return;

  if (STATE.viewMode !== 'daily') {
    STATE.currentDay = task.day;
    setViewMode('daily');
  }

  // Sprawdzamy, czy w polu weryfikacji zadania użytkownik wkleił już swój kod
  const verifyInput = document.getElementById(`task-verify-input-${taskId}`);
  let codeToRun = '';
  if (verifyInput && verifyInput.value.trim().length > 15 && verifyInput.value.includes('<')) {
    codeToRun = verifyInput.value.trim();
  } else if (task.sampleSolution && task.sampleSolution.includes('<html')) {
    codeToRun = task.sampleSolution;
  } else {
    codeToRun = `<!-- Gotowy podgląd dla Zadania ${task.id}: ${task.title} -->\n<!DOCTYPE html>\n<html lang="pl">\n<head>\n  <meta charset="UTF-8">\n  <title>${task.title}</title>\n  <script src="https://cdn.tailwindcss.com"><\/script>\n</head>\n<body class="bg-slate-900 text-white p-6 font-sans min-h-screen flex items-center justify-center">\n  <div class="max-w-md w-full p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl text-center">\n    <h1 class="text-xl font-bold mb-2 text-amber-300">${task.title}</h1>\n    <p class="text-sm text-slate-300 mb-4">${task.goal}</p>\n    <button onclick="alert('Działa świetnie!')" class="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold transition">Kliknij i przetestuj</button>\n  </div>\n</body>\n</html>`;
  }

  setTimeout(() => {
    const sandboxInput = document.getElementById('main-sandbox-code-input');
    if (sandboxInput) {
      sandboxInput.value = codeToRun;
      sandboxInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      runMainSandboxCode();
      playClickSound();
      announceSR(`Wstawiono kod zadania ${task.id} do piaskownicy i uruchomiono podgląd na żywo.`);
    }
  }, 70);
}

function runMainSandboxCode() {
  const input = document.getElementById('main-sandbox-code-input');
  let code = input ? input.value : '';

  // Inteligentne odzyskiwanie: jeśli pole jest puste, sprawdźmy czy użytkownik ma kod w zadaniu
  if (!code.trim()) {
    const currentDayTasks = TASKS_DATA.filter(t => t.day === STATE.currentDay);
    const codeTask = currentDayTasks.find(t => isTaskCodeType(t));
    if (codeTask) {
      const verifyInput = document.getElementById(`task-verify-input-${codeTask.id}`);
      if (verifyInput && verifyInput.value.trim().length > 15 && verifyInput.value.includes('<')) {
        code = verifyInput.value.trim();
        if (input) input.value = code;
      } else if (codeTask.sampleSolution && codeTask.sampleSolution.includes('<html')) {
        code = codeTask.sampleSolution;
        if (input) input.value = code;
      }
    }
  }

  if (!code.trim()) {
    alert("Wklej najpierw kod HTML do pola piaskownicy lub kliknij fioletowy przycisk 'Przetestuj kod w piaskownicy na żywo' na karcie wybranego zadania.");
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus();
    }
    return;
  }

  const wrapper = document.getElementById('main-sandbox-wrapper');
  const frame = document.getElementById('main-sandbox-frame');
  if (wrapper && frame) {
    wrapper.classList.remove('hidden');

    // Bezpieczne i niezawodne przypisanie kodu przez srcdoc (działa we wszystkich przeglądarkach)
    frame.srcdoc = code;

    // Przewijamy płynnie, aby użytkownik natychmiast zobaczył ramkę z działającą stroną
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    playClickSound();
    announceSR("Podgląd kodu na żywo został pomyślnie uruchomiony w ramce poniżej.");
  }
}

function clearMainSandbox() {
  const input = document.getElementById('main-sandbox-code-input');
  if (input) input.value = '';
  closeMainSandboxPreview();
  playClickSound();
  announceSR("Usunięto kod z piaskownicy.");
}

function closeMainSandboxPreview() {
  const wrapper = document.getElementById('main-sandbox-wrapper');
  if (wrapper) wrapper.classList.add('hidden');
}

function downloadMainSandboxFile(day) {
  const code = document.getElementById('main-sandbox-code-input').value;
  if (!code.trim()) {
    alert("Wklej najpierw kod HTML do pola piaskownicy.");
    return;
  }
  const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vibe_kod_dzien_${day}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  playClickSound();
  announceSR(`Pobrano plik vibe_kod_dzien_${day}.html.`);
}

let MAIN_SELECTED_CCOF_BASE = 'current';
let MAIN_ACTIVE_STUDIO_TASK_ID = 13;
let CURRENT_STUDIO_PRESETS = {};

function focusMainStudioFromSandbox() {
  const heading = document.getElementById('tool-heading-prompt-helper') || document.getElementById('studio-presets-container');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    heading.focus();
    announceSR("Przeniesiono kursor do Studia Eksperymentów i Rozwoju Projektu.");
  }
}

function renderMainStudioBaseButtonsHtml(day, selectedBaseType) {
  const codeTasks = (typeof getAvailableCodeTasksUpToDay === 'function') ? getAvailableCodeTasksUpToDay(day) : [];
  const list = codeTasks.length > 0 ? codeTasks.slice(0, 5) : [TASKS_DATA.find(t => t.id === 13), TASKS_DATA.find(t => t.id === 5), TASKS_DATA.find(t => t.id === 3)].filter(Boolean);

  let html = '';
  list.forEach(t => {
    const isSelected = selectedBaseType === ('task' + t.id);
    const shortTitle = t.title.replace(/^[^:]+:\s*/, '').replace(/^[^\w\s\u00C0-\u024F]+/u, '').trim();
    const btnText = `${shortTitle} (Zad. ${t.id})`;
    html += `
      <button type="button" onclick="selectMainCcofBaseCode('task${t.id}')" id="btn-base-task-${t.id}" class="touch-target px-2.5 py-1 rounded-lg ${isSelected ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'} text-[10px] font-bold transition cursor-pointer">
        ${btnText}
      </button>
    `;
  });

  const isSandboxSelected = selectedBaseType === 'sandbox';
  html += `
    <button type="button" onclick="selectMainCcofBaseCode('sandbox')" id="btn-base-sandbox" class="touch-target px-2.5 py-1 rounded-lg ${isSandboxSelected ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'} text-[10px] font-bold transition cursor-pointer">
      Własny kod z piaskownicy
    </button>
  `;
  return html;
}

function updateMainStudioBaseButtons(selectedType) {
  const container = document.getElementById('main-ccof-base-buttons');
  if (!container) return;
  const buttons = container.querySelectorAll('button');
  buttons.forEach(btn => {
    const isCurrent = btn.id === `btn-base-${selectedType}` || (selectedType.startsWith('task') && btn.id === `btn-base-task-${selectedType.replace('task', '')}`);
    if (isCurrent) {
      btn.className = "touch-target px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold ring-2 ring-indigo-400 text-[10px] transition cursor-pointer";
    } else {
      btn.className = "touch-target px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition cursor-pointer";
    }
  });
}

function renderStudioPresets(taskId) {
  MAIN_ACTIVE_STUDIO_TASK_ID = parseInt(taskId, 10) || 13;
  const enh = (typeof getTaskEnhancementPresets === 'function') ? getTaskEnhancementPresets(MAIN_ACTIVE_STUDIO_TASK_ID) : null;
  if (!enh || !enh.presets) return;

  CURRENT_STUDIO_PRESETS = enh.presets;
  const keys = Object.keys(enh.presets);

  const grid = document.getElementById('main-presets-grid');
  if (grid) {
    grid.innerHTML = keys.map(k => {
      const p = enh.presets[k];
      return `
        <label for="main-chk-preset-${k}" class="touch-target p-3 rounded-xl border border-slate-700 bg-slate-950 hover:border-amber-400 cursor-pointer flex items-start gap-2.5 transition" id="lbl-preset-${k}">
          <input type="checkbox" id="main-chk-preset-${k}" value="${k}" onchange="handleMainPresetCheckboxChange()" class="w-4 h-4 mt-0.5 rounded text-amber-500 focus:ring-amber-400 cursor-pointer">
          <div>
            <span class="font-bold text-amber-400 text-[11px] block mb-0.5">${p.title}</span>
            <span class="text-[10px] text-slate-400 block">${p.desc}</span>
          </div>
        </label>
      `;
    }).join('');
  }

  const badge = document.getElementById('main-preset-count-badge');
  if (badge) {
    badge.textContent = `Wybrano: 0 z ${keys.length} ulepszeń`;
    badge.className = 'text-[11px] font-bold text-slate-400';
  }

  const goalEl = document.getElementById('main-ccof-goal');
  const constrEl = document.getElementById('main-ccof-constraints');
  if (goalEl && goalEl.value.includes('Dodaj do mojej strony poniższe ulepszenia')) {
    goalEl.value = '';
  }
  if (constrEl && constrEl.value.includes('Zasady wykonania ulepszeń:')) {
    constrEl.value = '';
  }
}

function selectMainCcofBaseCode(type) {
  MAIN_SELECTED_CCOF_BASE = type;
  const badge = document.getElementById('main-ccof-base-name');
  let selectedTaskId = null;

  if (type.startsWith('task')) {
    const taskId = parseInt(type.replace('task', ''), 10);
    const task = TASKS_DATA.find(t => t.id === taskId);
    if (task) {
      selectedTaskId = task.id;
      if (badge) {
        badge.textContent = `✓ Wybrano bazę: ${task.title} (Zadanie ${task.id}) – kod zostanie dołączony do promptu`;
      }
    }
  } else if (type === 'sandbox') {
    if (badge) {
      badge.textContent = "✓ Wybrano bazę: Twój kod z piaskownicy – kod zostanie dołączony do promptu";
    }
    const currentTasks = TASKS_DATA.filter(t => t.day === STATE.currentDay);
    const codeTask = currentTasks.find(t => isTaskCodeType(t));
    selectedTaskId = codeTask ? codeTask.id : 13;
  } else {
    const currentTasks = TASKS_DATA.filter(t => t.day === STATE.currentDay);
    const codeTask = currentTasks.find(t => isTaskCodeType(t));
    if (codeTask) {
      selectedTaskId = codeTask.id;
      MAIN_SELECTED_CCOF_BASE = 'task' + codeTask.id;
      if (badge) {
        badge.textContent = `✓ Wybrano bazę: ${codeTask.title} (Zadanie ${codeTask.id}) – kod zostanie dołączony do promptu`;
      }
    } else {
      selectedTaskId = 13;
      if (badge) {
        badge.textContent = "✓ Wybrano aktualny kod z piaskownicy / dzisiejszego zadania";
      }
    }
  }

  renderStudioPresets(selectedTaskId || 13);
  updateMainStudioBaseButtons(type);
  playClickSound();
  announceSR(`Zmieniono bazę projektu na ${selectedTaskId ? 'Zadanie ' + selectedTaskId : 'kod z piaskownicy'}. Zaktualizowano listę ulepszeń.`);
}

function initMainStudio(day) {
  const availableCodeTasks = (typeof getAvailableCodeTasksUpToDay === 'function') ? getAvailableCodeTasksUpToDay(day) : [];
  const primaryTask = availableCodeTasks.find(t => t.day === day) || availableCodeTasks[0] || TASKS_DATA.find(t => t.id === 13) || TASKS_DATA.find(t => t.id === 3);
  const targetTaskId = primaryTask ? primaryTask.id : 13;

  MAIN_SELECTED_CCOF_BASE = 'task' + targetTaskId;
  const badge = document.getElementById('main-ccof-base-name');
  if (badge && primaryTask) {
    badge.textContent = `✓ Wybrano bazę: ${primaryTask.title} (Zadanie ${primaryTask.id}) – kod zostanie dołączony do promptu`;
  }
  renderStudioPresets(targetTaskId);
  updateMainStudioBaseButtons('task' + targetTaskId);
}

function toggleMainCcofMode() {
  const modifyRadio = document.getElementById('main-ccof-mode-modify');
  const isModify = modifyRadio ? modifyRadio.checked : true;
  const badge = document.getElementById('main-ccof-base-badge');
  if (badge) {
    if (isModify) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
  playClickSound();
}

function handleMainPresetCheckboxChange() {
  const keys = Object.keys(CURRENT_STUDIO_PRESETS);
  const selected = [];
  const activeEl = document.activeElement;

  keys.forEach(k => {
    const chk = document.getElementById(`main-chk-preset-${k}`);
    const lbl = document.getElementById(`lbl-preset-${k}`);
    if (chk && chk.checked) {
      selected.push(k);
      if (lbl) {
        lbl.classList.add('border-amber-400', 'bg-amber-950/40');
        lbl.classList.remove('border-slate-700', 'bg-slate-950');
      }
    } else if (lbl) {
      lbl.classList.remove('border-amber-400', 'bg-amber-950/40');
      lbl.classList.add('border-slate-700', 'bg-slate-950');
    }
  });

  const badge = document.getElementById('main-preset-count-badge');
  if (badge) {
    badge.textContent = `Wybrano: ${selected.length} z ${keys.length} ulepszeń`;
    badge.className = selected.length > 0 
      ? 'text-[11px] font-bold text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded-full' 
      : 'text-[11px] font-bold text-slate-400';
  }

  const goalEl = document.getElementById('main-ccof-goal');
  const constrEl = document.getElementById('main-ccof-constraints');
  const fmtEl = document.getElementById('main-ccof-format');
  if (!goalEl || !constrEl) return;

  if (selected.length === 0) {
    goalEl.value = '';
    constrEl.value = '';
  } else {
    let goalText = "Dodaj do mojej strony poniższe ulepszenia za jednym razem:\n";
    selected.forEach((k, idx) => {
      goalText += `${idx + 1}. ${CURRENT_STUDIO_PRESETS[k].goal}\n`;
    });

    let constrText = "Zasady wykonania ulepszeń:\n";
    constrText += "- Wkomponuj wszystkie wybrane elementy harmonijnie w obecny wygląd strony.\n";
    constrText += "- Zadbaj o to, aby wszystkie funkcje działały jednocześnie bez konfliktów.\n";
    selected.forEach(k => {
      constrText += `- ${CURRENT_STUDIO_PRESETS[k].constraint}\n`;
    });

    goalEl.value = goalText.trim();
    constrEl.value = constrText.trim();
    if (fmtEl) {
      fmtEl.value = "Zwróć POJEDYNCZY, KOMPLETNY plik HTML z całą dotychczasową stroną oraz wszystkimi nowymi funkcjami wbudowanymi w kod, gotowy do natychmiastowego wklejenia w piaskownicy.";
    }
  }

  // Zabezpieczenie NVDA przed utratą fokusu
  if (activeEl && activeEl.type === 'checkbox' && document.activeElement !== activeEl) {
    activeEl.focus();
  }

  playClickSound();
  announceSR(`Zaznaczono ${selected.length} ulepszeń. Zaktualizowano formularz promptu.`);
}

function applyMainCcofPreset(preset) {
  const chk = document.getElementById(`main-chk-preset-${preset}`);
  if (chk) {
    chk.checked = !chk.checked;
    handleMainPresetCheckboxChange();
  }
}

function getMainCcofBaseCode() {
  if (MAIN_SELECTED_CCOF_BASE && MAIN_SELECTED_CCOF_BASE.startsWith('task')) {
    const taskId = parseInt(MAIN_SELECTED_CCOF_BASE.replace('task', ''), 10);
    const t = TASKS_DATA.find(x => x.id === taskId);
    if (t && t.sampleSolution) return t.sampleSolution;
  }
  const sInput = document.getElementById('main-sandbox-code-input');
  if (sInput && sInput.value.trim().length > 30) {
    return sInput.value.trim();
  }
  const currentTasks = TASKS_DATA.filter(t => t.day === STATE.currentDay);
  const codeTask = currentTasks.find(t => isTaskCodeType(t));
  if (codeTask && codeTask.sampleSolution) return codeTask.sampleSolution;

  const fallbackTask = TASKS_DATA.find(t => t.id === 13) || TASKS_DATA.find(t => t.id === 9) || TASKS_DATA.find(t => t.id === 5) || TASKS_DATA.find(t => t.id === 3);
  return fallbackTask ? fallbackTask.sampleSolution : '';
}

function buildAndCopyMainCcofPrompt() {
  const modifyRadio = document.getElementById('main-ccof-mode-modify');
  const isModify = modifyRadio ? modifyRadio.checked : true;
  const ctx = document.getElementById('main-ccof-context').value.trim();
  const goal = document.getElementById('main-ccof-goal').value.trim();
  const constr = document.getElementById('main-ccof-constraints').value.trim();
  const fmt = document.getElementById('main-ccof-format').value.trim();

  if (!goal) {
    alert("Wpisz w polu cel, co chcesz dodać lub zmienić, albo kliknij jeden z gotowych kafelków (np. 'Licznik zamówień').");
    document.getElementById('main-ccof-goal').focus();
    return;
  }

  let fullPrompt = "";
  if (isModify) {
    const baseCode = getMainCcofBaseCode();
    fullPrompt = `${ctx || "Jesteś doświadczonym programistą i moim asystentem Vibe Codingu."}

OTO AKTUALNY KOD MOJEJ STRONY:
\`\`\`html
${baseCode}
\`\`\`

TWOJE ZADANIE:
Zmodyfikuj powyższą stronę, dodając do niej nowe ulepszenie:
- CO DODAĆ: ${goal}
- ZASADY I STYL: ${constr || "Wkomponuj nową funkcję harmonijnie w istniejący wygląd strony (zachowaj klimat, kolory i układ)."}
- OCZEKIWANY FORMAT: ${fmt || "Zwróć POJEDYNCZY, KOMPLETNY i zaktualizowany plik HTML (z całą dotychczasową zawartością + nowa funkcja), gotowy do natychmiastowego wklejenia w piaskownicy."}`;
  } else {
    let parts = [];
    if (ctx) parts.push(`KONTEKST I ROLA:\n${ctx}`);
    parts.push(`GŁÓWNY CEL:\n${goal}`);
    if (constr) parts.push(`OGRANICZENIA I ZASADY:\n${constr}`);
    if (fmt) parts.push(`OCZEKIWANY FORMAT WYJŚCIOWY:\n${fmt}`);
    fullPrompt = parts.join('\n\n');
  }

  const onCopied = () => {
    playTone(660, 'sine', 0.12, 0.1);
    const status = document.getElementById('main-ccof-status-text');
    if (status) {
      status.textContent = "Skopiowano prompt ulepszający z kodem do schowka ✓";
      setTimeout(() => { status.textContent = ""; }, 3500);
    }
    announceSR("Twój prompt ulepszający z dołączonym kodem został skopiowany do schowka.");
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fullPrompt).then(onCopied).catch(() => fallbackCopy(fullPrompt, onCopied));
  } else {
    fallbackCopy(fullPrompt, onCopied);
  }
}

function clearMainCcofForm() {
  ['main-ccof-goal', 'main-ccof-constraints'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  if (typeof PRESET_DEFINITIONS !== 'undefined') {
    Object.keys(PRESET_DEFINITIONS).forEach(k => {
      const chk = document.getElementById(`main-chk-preset-${k}`);
      const lbl = document.getElementById(`lbl-preset-${k}`);
      if (chk) chk.checked = false;
      if (lbl) {
        lbl.classList.remove('border-amber-400', 'bg-amber-950/40');
        lbl.classList.add('border-slate-700', 'bg-slate-950');
      }
    });
  }
  const badge = document.getElementById('main-preset-count-badge');
  if (badge) {
    badge.textContent = "Wybrano: 0 ulepszeń";
    badge.className = "text-[11px] font-bold text-slate-400";
  }
  announceSR("Wyczyszczono formularz ulepszeń.");
}

function isTaskCodeType(task) {
  if (task.isCode !== undefined) return task.isCode;
  const p = (task.prompt || '').toLowerCase();
  return p.includes('plik html') || p.includes('kod html') || p.includes('html, css');
}

function renderTaskHeaderStatusHtml(st, pts) {
  if (st === 'passed') {
    return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"><span>Wykonane poprawnie (+${pts} pkt)</span> <span role="img" aria-label="(zaliczone)">✓</span></span>`;
  }
  if (st === 'failed') {
    return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40"><span>Wymaga poprawy (0/${pts} pkt)</span> <span role="img" aria-label="(wymaga poprawy)">🔴</span></span>`;
  }
  if (st === 'skipped') {
    return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-amber-300 border border-amber-500/40"><span>Pominięte na razie (0/${pts} pkt)</span> <span role="img" aria-label="(pominięte)">⚪</span></span>`;
  }
  return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700"><span>Do wykonania (${pts} pkt)</span> <span role="img" aria-label="(oczekuje)">⏳</span></span>`;
}

function renderTaskBottomStatusHtml(task, st, pts) {
  if (st === 'passed') {
    return `
      <div class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-bold shadow">
        <span role="img" aria-label="(sukces)">🟢</span>
        <span>Wykonane poprawnie (+${pts} pkt)</span>
        <span class="text-[11px] text-emerald-400/80 font-normal hidden sm:inline">• Zaliczone przez weryfikator AI</span>
      </div>
    `;
  }
  if (st === 'failed') {
    return `
      <div class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs font-bold shadow">
        <span role="img" aria-label="(wymaga poprawy)">🔴</span>
        <span>Wymaga poprawy (0 / ${pts} pkt)</span>
      </div>
      <button type="button" onclick="focusTaskVerifyInput(${task.id})" class="touch-target px-3.5 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-100 border border-rose-600/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
        <span>Popraw odpowiedź</span>
        <span role="img" aria-label="(ikona ołówka)">✏️</span>
      </button>
      <button type="button" onclick="skipTask(${task.id})" class="touch-target px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition flex items-center gap-1 cursor-pointer" title="Możesz pominąć to zadanie i wrócić do niego później">
        <span>Pomiń na razie</span>
        <span role="img" aria-label="(strzałka)">⏭️</span>
      </button>
    `;
  }
  if (st === 'skipped') {
    return `
      <div class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-bold shadow">
        <span role="img" aria-label="(pominięte)">⚪</span>
        <span>Pominięte na razie (0 / ${pts} pkt)</span>
      </div>
      <button type="button" onclick="unskipTask(${task.id})" class="touch-target px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
        <span>Wróć do tego zadania</span>
        <span role="img" aria-label="(ikona powrotu)">↩️</span>
      </button>
    `;
  }
  return `
    <div class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold">
      <span role="img" aria-label="(do zrobienia)">⏳</span>
      <span>Do wykonania (Wartość: ${pts} pkt)</span>
    </div>
    <button type="button" onclick="skipTask(${task.id})" class="touch-target px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer" title="Możesz pominąć to zadanie i wrócić do niego w dowolnej chwili">
      <span>Pomiń na razie</span>
      <span role="img" aria-label="(strzałka)">⏭️</span>
    </button>
  `;
}

function updateSingleTaskCard(taskId) {
  const card = document.getElementById(`task-card-${taskId}`);
  const task = TASKS_DATA.find(t => t.id === taskId);
  if (!card || !task) return;

  const st = getTaskStatus(taskId);
  const pts = getTaskPoints(task);

  // Aktualizacja klas karty
  card.classList.remove('is-completed', 'border-emerald-500/50', 'border-emerald-500/60', 'bg-emerald-950/20', 'is-failed', 'border-rose-500/50', 'bg-rose-950/15', 'is-skipped', 'border-amber-500/40', 'bg-slate-900/80');
  if (st === 'passed') {
    card.classList.add('is-completed', 'border-emerald-500/60', 'bg-emerald-950/20');
  } else if (st === 'failed') {
    card.classList.add('is-failed', 'border-rose-500/50', 'bg-rose-950/15');
  } else if (st === 'skipped') {
    card.classList.add('is-skipped', 'border-amber-500/40', 'bg-slate-900/80');
  }

  // Aktualizacja nagłówka statusu
  const headerStatusEl = card.querySelector('.task-header-status');
  if (headerStatusEl) {
    headerStatusEl.innerHTML = renderTaskHeaderStatusHtml(st, pts);
  }

  // Aktualizacja panelu akcji dolnych
  const bottomActionsEl = card.querySelector('.task-bottom-status-panel');
  if (bottomActionsEl) {
    bottomActionsEl.innerHTML = renderTaskBottomStatusHtml(task, st, pts);
  }

  updateProgressUI();
  updateBadgesUI();
  updateRewardsUI();
  updateDiplomaCleansingUI();
}

function skipTask(taskId) {
  const task = TASKS_DATA.find(t => t.id === taskId);
  setTaskStatus(taskId, 'skipped');
  saveState();
  updateSingleTaskCard(taskId);
  playTone(240, 'sine', 0.1, 0.08);
  announceSR(`Zadanie ${taskId} zostało pominięte na razie. Możesz do niego wrócić w dowolnym momencie.`);
}

function unskipTask(taskId) {
  const task = TASKS_DATA.find(t => t.id === taskId);
  setTaskStatus(taskId, 'pending');
  saveState();
  updateSingleTaskCard(taskId);
  focusTaskVerifyInput(taskId);
  announceSR(`Przywrócono zadanie ${taskId} do wykonania.`);
}

function focusTaskVerifyInput(taskId) {
  const input = document.getElementById(`task-verify-input-${taskId}`);
  if (input) {
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input.focus({ preventScroll: true });
    playClickSound();
  }
}

function renderTaskCard(task) {
  const st = getTaskStatus(task.id);
  const pts = getTaskPoints(task);
  const isDone = (st === 'passed');
  const stageObj = STAGES.find(s => s.id === task.stage) || STAGES[0];
  const isCode = isTaskCodeType(task);
  const taskSavedNote = (STATE.taskNotes && STATE.taskNotes[task.id]) || localStorage.getItem(`vibe_coding_task_notes_${task.id}`) || '';

  let cardClasses = 'border-slate-800 bg-slate-850/90';
  if (st === 'passed') cardClasses = 'is-completed border-emerald-500/60 bg-emerald-950/20';
  else if (st === 'failed') cardClasses = 'is-failed border-rose-500/50 bg-rose-950/15';
  else if (st === 'skipped') cardClasses = 'is-skipped border-amber-500/40 bg-slate-900/80';

  return `
    <article class="task-card p-5 sm:p-6 md:p-8 rounded-3xl border transition-all duration-200 mb-6 relative ${cardClasses}" id="task-card-${task.id}" aria-labelledby="task-title-${task.id}">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider ${task.isBusinessAddon ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}">
            ${task.isBusinessAddon ? `💼 Dodatek Biznesowy • ${task.addonDay || 'Moduł'}` : `Dzień ${task.day} • Zadanie ${task.id} z 100`}
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            ⭐ Wartość: ${pts} pkt
          </span>
          <span class="text-xs text-slate-400 font-medium hidden sm:inline">
            ${task.isBusinessAddon ? 'Specjalizacja: Praca i Kariera' : stageObj.name}
          </span>
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isCode ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'}">
            <span>${isCode ? 'Aplikacja / Kod HTML' : 'Rozmowa z AI / Prompting'}</span>
            <span role="img" aria-label="${isCode ? '(ikona aplikacji)' : '(ikona rozmowy)'}">${isCode ? '💻' : '💬'}</span>
          </span>
        </div>
        <div class="task-header-status flex items-center gap-2">
          ${renderTaskHeaderStatusHtml(st, pts)}
        </div>
      </div>

      <!-- NAGŁÓWEK POZIOMU 2 DLA ZADANIA -->
      <h2 id="task-title-${task.id}" class="text-lg sm:text-xl md:text-2xl font-black text-white mb-3 tracking-tight" tabindex="-1">
        Zadanie ${task.id}: ${task.title}
      </h2>

      <!-- PODSEKCJA 1 (H3): CEL I INSTRUKCJA -->
      <div class="mb-4 text-xs md:text-sm text-slate-300 space-y-2">
        <h3 class="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <span>Cel ćwiczenia i instrukcja:</span>
          <span role="img" aria-label="(ikona celu)">🎯</span>
        </h3>
        <p><strong class="text-indigo-200">Cel:</strong> ${task.goal}</p>
        <p class="leading-relaxed">${task.desc}</p>
      </div>

      ${task.starterCode ? `
      <!-- PAKIET RATUNKOWY (KOD BAZOWY) -->
      <div class="my-4 p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/50 bg-emerald-950/25 shadow-lg">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div class="flex items-center gap-2.5">
            <span role="img" aria-label="(ikona pakietu ratunkowego)" class="text-2xl">🧰</span>
            <div>
              <h3 class="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-emerald-300">
                ${task.fallbackTitle || 'Pakiet ratunkowy: Kod bazowy do tego zadania'}
              </h3>
              <span class="text-[11px] text-emerald-400/90 font-medium block">
                Zapasowy punkt startowy dla osób zaczynających od tego dnia lub bez wczorajszego pliku
              </span>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button type="button" class="touch-target text-xs px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition flex items-center justify-center gap-1.5 shadow cursor-pointer" onclick="copyStarterCodeById(${task.id})" id="copy-starter-btn-${task.id}">
              <span>Kopiuj kod bazowy</span>
              <span role="img" aria-label="(ikona schowka)">📋</span>
            </button>
            <button type="button" class="touch-target text-xs px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition flex items-center justify-center gap-1.5 shadow cursor-pointer" onclick="copyCombinedCodeAndPrompt(${task.id})" id="copy-combined-btn-${task.id}" title="Kopiuje kod bazowy wraz z promptem zadania w jednym bloku">
              <span>🚀 Kopiuj kod + prompt</span>
            </button>
            <button type="button" class="touch-target text-xs px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer" onclick="toggleStarterCode(${task.id})" id="toggle-starter-btn-${task.id}" aria-expanded="false" aria-controls="starter-code-box-${task.id}">
              <span id="starter-code-toggle-text-${task.id}">Pokaż kod</span>
              <span role="img" aria-label="(ikona oka)">👁️</span>
            </button>
          </div>
        </div>
        <p class="text-xs text-slate-300 mb-2 leading-relaxed">
          ${task.fallbackDesc || 'Nie masz gotowego pliku z poprzednich zadań? Skopiuj ten kod, wklej do edytora lub czatu z AI, a potem wyślij prompt z zadania!'}
        </p>
        <div id="starter-code-box-${task.id}" class="hidden mt-3 pt-3 border-t border-emerald-500/20">
          <pre class="font-mono text-xs text-emerald-100 bg-slate-950 p-3.5 rounded-xl border border-emerald-500/30 whitespace-pre-wrap select-all max-h-64 overflow-y-auto leading-relaxed">${escapeHtmlText(task.starterCode)}</pre>
        </div>
      </div>
      ` : ''}

      <!-- PODSEKCJA 2 (H3): PROMPT DO WKLEJENIA -->
      <div class="my-4 p-3.5 sm:p-4 rounded-2xl border border-slate-700 bg-slate-950/80 shadow-inner">
        <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-2.5 mb-3">
          <h3 class="text-xs uppercase tracking-wider font-bold text-amber-300 flex items-center gap-1.5">
            <span>Gotowy prompt do wklejenia do AI:</span>
            <span role="img" aria-label="(ikona dymku rozmowy)">💬</span>
          </h3>
          <div class="grid grid-cols-2 sm:flex items-center gap-2">
            ${task.starterCode ? `
            <button type="button" class="touch-target text-xs px-3 py-2 sm:py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition flex items-center justify-center gap-1.5 shadow cursor-pointer" onclick="copyCombinedCodeAndPrompt(${task.id})" id="copy-combined-prompt-btn-${task.id}" title="Kopiuje kod bazowy wraz z promptem zadania">
              <span>🚀 Kod + Prompt</span>
            </button>
            ` : ''}
            <button type="button" class="touch-target text-xs px-3 py-2 sm:py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center justify-center gap-1.5 shadow" onclick="copyPromptById(${task.id})" id="copy-btn-${task.id}">
              <span>Kopiuj Prompt<span class="sr-only"> zadania ${task.id}</span></span>
              <span role="img" aria-label="(ikona schowka)">📋</span>
            </button>
            <button type="button" class="touch-target text-xs px-3 py-2 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1.5" onclick="copyPromptById(${task.id}); window.open('https://gemini.google.com', '_blank');">
              <span>Otwórz w Gemini</span>
              <span role="img" aria-label="(nowa karta)">&nearr;</span>
            </button>
          </div>
        </div>
        <pre class="prompt-code font-mono text-xs md:text-sm text-slate-100 whitespace-pre-wrap select-all break-words leading-relaxed">${escapeHtmlText(task.prompt)}</pre>
      </div>

      <!-- PODSEKCJA 3 (H3): OCZEKIWANY REZULTAT I WSKAZÓWKA -->
      <div class="mb-5 sm:mb-6">
        <h3 class="text-xs uppercase tracking-wider font-bold text-emerald-300 mb-2 flex items-center gap-1.5">
          <span>Oczekiwany rezultat i wskazówka:</span>
          <span role="img" aria-label="(ikona iskierek)">✨</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <strong class="text-emerald-400 mb-1 flex items-center gap-1.5">
              <span>Oczekiwany rezultat:</span>
              <span role="img" aria-label="(ikona potwierdzenia)">✓</span>
            </strong>
            <span class="text-slate-300 leading-relaxed">${task.expected}</span>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <strong class="text-indigo-400 mb-1 flex items-center gap-1.5">
              <span>Wskazówka z życia codziennego:</span>
              <span role="img" aria-label="(ikona żarówki)">💡</span>
            </strong>
            <span class="text-slate-300 leading-relaxed">${task.tip}</span>
          </div>
        </div>
      </div>

      <!-- PODSEKCJA 4 (H3): WERYFIKACJA POPRAWNOŚCI ZADANIA (AUTOMATYCZNY SPRAWDZACZ) -->
      <div class="my-5 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-md">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <label for="task-verify-input-${task.id}" class="text-xs uppercase tracking-wider font-extrabold ${isDone ? 'text-emerald-400' : 'text-sky-300'} flex items-center gap-1.5">
            <span>Sprawdź poprawność wykonania (Weryfikator AI):</span>
            <span role="img" aria-label="(ikona lupy)">🔍</span>
          </label>
          <span class="text-[11px] text-slate-400 font-medium">
            ${isCode ? 'Wklej kod od AI' : 'Wklej odpowiedź tekstową od AI'}
          </span>
        </div>
        <p id="task-verify-hint-${task.id}" class="text-xs text-slate-300 mb-2.5 leading-relaxed">
          ${isCode 
            ? 'Wklej tutaj kod HTML wygenerowany przez sztuczną inteligencję, aby sprawdzić czy jest poprawny:' 
            : 'Skopiuj to, co odpisała Ci sztuczna inteligencja (np. w darmowym ChatGPT lub Gemini), i wklej poniżej, aby weryfikator ocenił jej pracę:'}
        </p>
        <textarea id="task-verify-input-${task.id}" rows="3" 
          aria-label="Pole wklejania odpowiedzi od AI dla zadania ${task.id}"
          aria-describedby="task-verify-hint-${task.id}"
          autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
          placeholder="${isCode ? 'Wklej tutaj wygenerowany kod strony (np. <!DOCTYPE html>...)...' : 'Wklej tutaj to, co ODPISAŁA Ci sztuczna inteligencja (nie wpisuj własnego tekstu)...'}" 
          class="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"></textarea>
        
        <div class="flex flex-wrap items-center gap-2 mt-2.5">
          <button type="button" onclick="verifyTaskAnswer(${task.id})" class="touch-target px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow cursor-pointer">
            <span>Sprawdź odpowiedź od AI</span>
            <span role="img" aria-label="(ikona sprawdzania)">✓</span>
          </button>
          <button type="button" onclick="toggleSampleSolution(${task.id})" id="task-sample-btn-${task.id}" class="touch-target px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer">
            <span>Pokaż wzorcową odpowiedź</span>
            <span role="img" aria-label="(ikona oka)">👁️</span>
          </button>
        </div>

        <!-- Pole informacji zwrotnej weryfikatora (tabindex -1 dla stabilnego fokusu NVDA) -->
        <div id="task-verify-feedback-${task.id}" class="hidden" role="status" aria-live="polite" tabindex="-1"></div>

        <!-- Rozwijany wzorzec poprawnej odpowiedzi -->
        <div id="task-sample-solution-${task.id}" class="hidden mt-3 p-3.5 rounded-xl bg-slate-950 border border-indigo-500/40 text-xs text-slate-200">
          <strong class="text-indigo-300 font-bold block mb-1.5 flex items-center gap-1.5">
            <span>Wzorcowy przykład odpowiedzi od AI:</span>
            <span role="img" aria-label="(ikona gwiazdki)">⭐</span>
          </strong>
          <pre class="font-mono text-xs text-slate-300 whitespace-pre-wrap select-all leading-relaxed">${escapeHtmlText(task.sampleSolution || task.expected)}</pre>
          <p class="text-[11px] text-slate-400 mt-2 italic">Twoja odpowiedź nie musi brzmieć identycznie co do litery – ważne, aby zawierała te same kluczowe informacje!</p>
        </div>
      </div>

      ${(isCode || (task.sampleSolution && task.sampleSolution.includes('<html'))) ? (() => {
        const enhData = (typeof getTaskEnhancementPresets === 'function') ? getTaskEnhancementPresets(task.id) : null;
        const presetKeys = enhData && enhData.presets ? Object.keys(enhData.presets) : [];
        const previewNames = presetKeys.slice(0, 3).map(k => enhData.presets[k].title.replace(/^[^\w\s\u00C0-\u024F]+/u, '').trim()).join(', ') + '...';
        return `
      <!-- BANER ROZWOJU PROJEKTU: DEDYKOWANE ULEPSZENIA DLA TEGO ZADANIA -->
      <div class="my-4 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow">
        <div>
          <span class="text-xs font-black uppercase tracking-wider text-amber-300 block mb-0.5 flex items-center gap-1.5">
            <span>✨ Chcesz ulepszyć tę stronę? (${previewNames || 'Nowe funkcje, dźwięki, pamięć'})</span>
            <span role="img" aria-label="(gwiazdki)">⭐</span>
          </span>
          <p class="text-xs text-slate-200 leading-relaxed">
            W Studiu Eksperymentów możesz zaznaczyć <strong>pola wyboru (checkboxy)</strong> przygotowane specjalnie dla <strong>Zadania ${task.id}</strong>, aby AI wbudowało nowe możliwości w Twój kod!
          </p>
        </div>
        <button type="button" onclick="focusStudioForTask(${task.id})" class="touch-target px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shrink-0 shadow cursor-pointer">
          <span>Otwórz ulepszenia dla Zadania ${task.id}</span>
          <span role="img" aria-label="(strzałka w dół)">↓</span>
        </button>
      </div>
      `;
      })() : ''}

      <!-- PODSEKCJA 5 (H3): TWOJE WŁASNE NOTATKI DO ZADANIA -->
      <div class="my-4 p-4 rounded-2xl bg-slate-900/80 border border-purple-500/40 shadow-inner">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
          <label for="task-note-input-${task.id}" class="text-xs uppercase tracking-wider font-extrabold text-purple-300 flex items-center gap-1.5 cursor-pointer">
            <span>Twoja notatka i wnioski do Zadania ${task.id}:</span>
            <span role="img" aria-label="(ikona notatnika)">📝</span>
          </label>
          <div class="flex items-center gap-2">
            <span id="task-note-status-${task.id}" class="text-[11px] text-emerald-400 font-semibold" aria-live="polite"></span>
            <button type="button" onclick="clearTaskNote(${task.id})" class="text-[11px] text-slate-400 hover:text-rose-300 underline font-semibold cursor-pointer">
              Wyczyść notatkę
            </button>
          </div>
        </div>

        <!-- ZACHĘTA DO PRZEĆWICZENIA W PRACY I DOMU ORAZ ZAPISYWANIA WYNIKÓW -->
        <div class="mb-3 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2.5">
          <span class="text-lg shrink-0" role="img" aria-label="(rakieta)">🚀</span>
          <div class="space-y-1">
            <strong class="text-amber-300 block font-bold">Przećwicz to w codziennym życiu (praca i dom) & zanotuj rezultat:</strong>
            <p class="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
              Wykorzystaj ten prompt do realnej sprawy: w <strong>pracy</strong> (np. ułatwienie raportu, formularz, szablon maila) lub w <strong>życiu osobistym</strong> (np. lista zadań, kalkulator domowy, hobby).
            </p>
            <p class="text-purple-300 font-semibold text-[11px] sm:text-xs flex items-center gap-1">
              <span role="img" aria-label="(ołówek)">✏️</span>
              <span>Wklej poniżej swoje wyniki, wnioski lub linki – Twoje notatki zostaną bezpiecznie zapisane i możesz je w każdej chwili pobrać!</span>
            </p>
          </div>
        </div>

        <textarea id="task-note-input-${task.id}" rows="3"
          placeholder="Wklej wyniki swoich prób w pracy/domu, wnioski, pytania do AI lub linki do stworzonych stron..."
          oninput="handleTaskNoteInput(${task.id}, this.value)"
          class="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 font-sans leading-relaxed">${escapeHtmlText(taskSavedNote)}</textarea>
      </div>

      <!-- PASEK AKCJI DOLNYCH I STATUSU (BEZ SAMODZIELNEGO ODKLIKANIA) -->
      <div class="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-3">
        <div class="task-bottom-status-panel flex flex-wrap items-center gap-2">
          ${renderTaskBottomStatusHtml(task, st, pts)}
        </div>

        ${isCode ? `
        <button type="button" onclick="sendTaskToMainSandbox(${task.id})" class="touch-target text-xs px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center justify-center gap-1.5 shadow cursor-pointer">
          <span>Przetestuj kod w piaskownicy na żywo</span>
          <span role="img" aria-label="(ikona laboratorium)">🧪</span>
        </button>
        ` : `
        <span class="text-xs text-slate-400 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center gap-1.5 select-none">
          <span>Zadanie tekstowe (Prompting – bez kodu)</span>
          <span role="img" aria-label="(ikona dymku)">💬</span>
        </span>
        `}
      </div>
    </article>
  `;
}

function verifyTaskAnswer(taskId) {
  const task = TASKS_DATA.find(t => t.id === taskId);
  if (!task) return;

  const input = document.getElementById(`task-verify-input-${taskId}`);
  const feedback = document.getElementById(`task-verify-feedback-${taskId}`);
  if (!input || !feedback) return;

  feedback.setAttribute('tabindex', '-1');

  const val = input.value.trim();
  if (!val) {
    feedback.className = "mt-3 p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/70 text-amber-200 text-xs flex items-start gap-2 shadow";
    feedback.innerHTML = `
      <span role="img" aria-label="(uwaga)" class="text-base shrink-0">⚠️</span>
      <div>
        <strong class="text-amber-300 block mb-0.5">Wklej najpierw odpowiedź od sztucznej inteligencji!</strong>
        Skopiuj to, co odpisało Ci AI (np. z darmowego ChatGPT lub Gemini), wklej w powyższe okienko i kliknij 'Sprawdź odpowiedź od AI'.
      </div>
    `;
    feedback.classList.remove('hidden');
    feedback.focus({ preventScroll: false });
    playTone(220, 'sine', 0.15, 0.08);
    announceSR("Wklej najpierw odpowiedź od sztucznej inteligencji, aby ją sprawdzić.");
    return;
  }

  const isCode = isTaskCodeType(task);
  const evaluation = evaluateTaskAnswer(task, val, isCode);
  const pts = getTaskPoints(task);

  if (evaluation.status === 'success') {
    setTaskStatus(task.id, 'passed');
    feedback.className = "mt-3 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/70 text-emerald-200 text-xs flex items-start gap-2 shadow-lg";
    feedback.innerHTML = `
      <span role="img" aria-label="(sukces)" class="text-lg shrink-0">🟢</span>
      <div>
        <strong class="text-emerald-300 font-bold text-sm block mb-1">${evaluation.title}</strong>
        <p class="leading-relaxed text-slate-200 mb-2">${evaluation.message}</p>
        <span class="inline-flex items-center gap-1 font-bold text-emerald-300 bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-500/40">
          <span>Zadanie ${task.id} zaliczone poprawnie! Zdobywasz +${pts} pkt.</span>
          <span role="img" aria-label="(potwierdzenie)">✓</span>
        </span>
      </div>
    `;
    feedback.classList.remove('hidden');
    playSuccessChime();
    celebrateWithConfetti();
    updateStreak();
    saveState();
    updateSingleTaskCard(task.id);
    feedback.focus({ preventScroll: false });
    announceSR(`Brawo! Zadanie ${task.id} sprawdzone pomyślnie. Zdobyłeś ${pts} punktów!`);
  } else if (evaluation.status === 'near') {
    setTaskStatus(task.id, 'failed');
    saveState();
    updateSingleTaskCard(task.id);
    feedback.className = "mt-3 p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/70 text-amber-200 text-xs flex items-start gap-2 shadow-lg";
    feedback.innerHTML = `
      <span role="img" aria-label="(wskazówka)" class="text-lg shrink-0">🟡</span>
      <div>
        <strong class="text-amber-300 font-bold block mb-1">${evaluation.title}</strong>
        <p class="leading-relaxed text-slate-200 mb-2">${evaluation.message}</p>
        <button type="button" onclick="toggleSampleSolution(${task.id})" class="text-[11px] text-amber-200 hover:text-white underline font-semibold cursor-pointer">
          Kliknij tutaj, aby podejrzeć wzorcową odpowiedź i porównać ze swoim wynikiem
        </button>
      </div>
    `;
    feedback.classList.remove('hidden');
    feedback.focus({ preventScroll: false });
    playTone(330, 'triangle', 0.15, 0.08);
    announceSR(`Wskazówka weryfikatora: ${evaluation.message}`);
  } else {
    // user_comment, off_topic, too_short
    setTaskStatus(task.id, 'failed');
    saveState();
    updateSingleTaskCard(task.id);
    const isComment = evaluation.status === 'user_comment';
    feedback.className = "mt-3 p-3.5 rounded-xl bg-rose-950/85 border border-rose-500/70 text-rose-200 text-xs flex items-start gap-2.5 shadow-lg";
    feedback.innerHTML = `
      <span role="img" aria-label="${isComment ? '(uwaga: Twój własny komentarz)' : '(nie na temat)'}" class="text-lg shrink-0">${isComment ? '💬' : '🔴'}</span>
      <div>
        <strong class="text-rose-300 font-bold block mb-1 text-sm">${evaluation.title}</strong>
        <p class="leading-relaxed text-slate-200 mb-2">${evaluation.message}</p>
        <button type="button" onclick="toggleSampleSolution(${task.id})" class="text-[11px] text-rose-200 hover:text-white underline font-semibold cursor-pointer">
          Kliknij tutaj, aby podejrzeć przykładową poprawną odpowiedź od AI
        </button>
      </div>
    `;
    feedback.classList.remove('hidden');
    feedback.focus({ preventScroll: false });
    playTone(220, 'sawtooth', 0.25, 0.08);
    announceSR(`${evaluation.title}. ${evaluation.message}`);
  }
}

function evaluateTaskAnswer(task, text, isCode) {
  const lower = text.toLowerCase();

  // 1. Wykrywanie bezpośrednich komentarzy użytkownika, odmowy lub zwracania się do kursu
  const userCommentTriggers = [
    /nie mam ochoty/i,
    /nie chce(?:sz)? mi si[eę]/i,
    /nie ch(?:c[eę]|ia[łl]em|ia[łl]am)/i,
    /nie b[eę]d[eę]/i,
    /nie mam zamiaru/i,
    /nie odpowiem/i,
    /odpowiada[cć] (?:ci|tobie|na )/i,
    /spadaj/i,
    /odczep si[eę]/i,
    /daj (?:mi )?spok[oó]j/i,
    /bez sensu/i,
    /g[lł]upi[ea]/i,
    /sam sobie/i,
    /nie wiem/i,
    /nie rozumiem nic/i,
    /co to ma by[cć]/i,
    /nie podoba mi si[eę]/i,
    /żadne pytania/i,
    /zadne pytania/i
  ];
  if (userCommentTriggers.some(rgx => rgx.test(lower))) {
    return {
      status: 'user_comment',
      success: false,
      title: "To wygląda na Twój własny komentarz, a nie odpowiedź od AI!",
      message: "W to pole nie wpisujemy własnych odpowiedzi, przemyśleń ani uwag do kursu. Zadanie polega na tym, by skopiować prompt po polsku do darmowego ChatGPT lub Gemini, a następnie wkleić tutaj to, co ODPISAŁA Ci sztuczna inteligencja."
    };
  }

  // 2. Weryfikacja dla zadań z kodem
  if (isCode) {
    const hasHtmlTags = lower.includes('<html') || lower.includes('<body') || lower.includes('<div') || lower.includes('<button') || lower.includes('<script') || lower.includes('<!doctype') || lower.includes('<style');
    if (!hasHtmlTags) {
      return {
        status: 'off_topic',
        success: false,
        title: "Wklejony tekst nie jest kodem strony WWW!",
        message: "W tym zadaniu sztuczna inteligencja miała wygenerować dla Ciebie kod strony (zaczynający się od &lt;!DOCTYPE html&gt; lub zawierający znaczniki HTML). Upewnij się, że skopiowałeś cały wygenerowany przez AI blok kodu."
      };
    }
    if (task.checkKeywords && task.checkKeywords.length > 0) {
      const matched = task.checkKeywords.filter(k => lower.includes(k.toLowerCase()));
      if (matched.length < 2 && text.length < 150) {
        return {
          status: 'near',
          success: false,
          title: "Kod wklejony, ale warto sprawdzić szczegóły:",
          message: "Kod zawiera strukturę HTML, ale brakuje w nim niektórych elementów z treści zadania. Upewnij się, że skopiowałeś pełny plik lub porównaj go ze wzorcem poniżej."
        };
      }
    }
    return {
      status: 'success',
      success: true,
      title: "Znakomicie! Kod jest kompletny i poprawny! 🎉",
      message: "Twój kod zawiera poprawną strukturę strony internetowej i wymagane elementy! Możesz teraz kliknąć fioletowy przycisk 'Przetestuj kod w piaskownicy na żywo', aby zobaczyć aplikację w akcji."
    };
  }

  // 3. Weryfikacja minimalnej długości tekstu
  if (text.length < 25) {
    return {
      status: 'too_short',
      success: false,
      title: "Odpowiedź jest zbyt krótka",
      message: "Wklejona wypowiedź ma zaledwie kilka słów. Upewnij się, że skopiowałeś pełną odpowiedź, jaką otrzymałeś od sztucznej inteligencji w odpowiedzi na prompt."
    };
  }

  // 4. Semantyczna weryfikacja specyficznych zadań
  // Zadanie 4: Zasada kelnera - AI ma zadać pytania uściślające
  if (task.id === 4) {
    const hasQuestionMark = text.includes('?');
    if (!hasQuestionMark) {
      return {
        status: 'off_topic',
        success: false,
        title: "Brak pytań uściślających od AI",
        message: "Celem tego zadania było zmuszenie sztucznej inteligencji do zadania Ci pytań uściślających (zamiast pisania kodu na oślep). Wklejona odpowiedź nie zawiera ani jednego pytajnika (?). Sprawdź, czy wkleiłeś do AI pełny prompt z zadania."
      };
    }
    const questionCount = (text.match(/\?/g) || []).length;
    if (questionCount >= 1 && (lower.includes('formularz') || lower.includes('pol') || lower.includes('wymag') || lower.includes('styl') || lower.includes('1.') || lower.includes('jaki') || lower.includes('co'))) {
      return {
        status: 'success',
        success: true,
        title: "Świetnie! AI zachowało się jak idealny kelner! 🎉",
        message: "Sztuczna inteligencja powstrzymała się przed pochopnym kodowaniem i zadała pytania uściślające. Dokładnie o to chodziło w tej lekcji!"
      };
    }
  }

  // 5. Weryfikacja słów kluczowych dla zadań tekstowych
  let keywords = task.checkKeywords || [];
  if (keywords.length === 0 && (task.sampleSolution || task.expected)) {
    const baseText = (task.sampleSolution || task.expected).toLowerCase();
    const words = baseText.replace(/[^a-ząćęłńóśźż0-9\s]/gi, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 5 && !['przez', 'tylko', 'który', 'która', 'które', 'kiedy', 'będzie', 'możesz', 'odpowiedź', 'jakby'].includes(w));
    keywords = Array.from(new Set(words)).slice(0, 8);
  }

  if (keywords.length > 0) {
    const matched = keywords.filter(k => lower.includes(k.toLowerCase()));
    if (matched.length >= 2 || (matched.length >= 1 && text.length > 90)) {
      return {
        status: 'success',
        success: true,
        title: "Znakomicie! Zadanie wykonane poprawnie! 🎉",
        message: "Sztuczna inteligencja poprawnie zrozumiała Twoje polecenie! Odpowiedź zawiera kluczowe punkty i jest w pełni zgodna z założeniami ćwiczenia."
      };
    } else if (matched.length === 1 && text.length >= 45) {
      return {
        status: 'near',
        success: false,
        title: "Jesteś na dobrej drodze! Wskazówka:",
        message: `Odpowiedź od AI zawiera część wymaganych informacji, ale brakuje w niej jeszcze niektórych elementów z promptu. Wskazówka: ${task.expected}`
      };
    } else {
      return {
        status: 'off_topic',
        success: false,
        title: "Ta odpowiedź nie pasuje do tego zadania",
        message: `Wklejona treść nie zawiera kluczowych elementów oczekiwanych w tym ćwiczeniu. Upewnij się, że skopiowałeś całą odpowiedź z ChatGPT/Gemini wygenerowaną na podstawie promptu z tego zadania. Wskazówka: ${task.expected}`
      };
    }
  }

  // 6. Domyślny fallback dla dłuższych odpowiedzi
  if (text.length >= 60) {
    return {
      status: 'success',
      success: true,
      title: "Znakomicie! Zadanie zaliczone! 🎉",
      message: "Odpowiedź od sztucznej inteligencji została sprawdzona i spełnia ogólne kryteria zadania!"
    };
  }

  return {
    status: 'off_topic',
    success: false,
    title: "Ta odpowiedź nie pasuje do tego zadania",
    message: "Wklejona treść jest zbyt ogólna lub nie pasuje do zadania. Upewnij się, że AI wygenerowało pełną odpowiedź na zadany prompt."
  };
}

function toggleSampleSolution(taskId) {
  const box = document.getElementById(`task-sample-solution-${taskId}`);
  const btn = document.getElementById(`task-sample-btn-${taskId}`);
  if (!box) return;

  const isHidden = box.classList.contains('hidden');
  if (isHidden) {
    box.classList.remove('hidden');
    if (btn) btn.innerHTML = '<span>Schowaj wzorzec</span> <span role="img" aria-label="(zwiń)">▲</span>';
    announceSR(`Wyświetlono wzorcową odpowiedź do zadania ${taskId}.`);
  } else {
    box.classList.add('hidden');
    if (btn) btn.innerHTML = '<span>Pokaż wzorcową odpowiedź</span> <span role="img" aria-label="(rozwiń)">👁️</span>';
    announceSR(`Ukryto wzorcową odpowiedź.`);
  }
  playClickSound();
}

// BAZA POJĘĆ DO SŁOWNICZKA BEZ ŻARGONU
const GLOSSARY_DATA = [
  {
    id: "vibe-coding",
    term: "Vibe Coding",
    analogy: "Reżyser na planie filmowym",
    icon: "🎬",
    desc: "Nowy sposób tworzenia programów i stron: nie piszesz kodu własnoręcznie. Mówisz po polsku sztucznej inteligencji, co chcesz osiągnąć, a ona zajmuje się całą stroną techniczną. Ty jesteś Dyrektorem i Architektem."
  },
  {
    id: "prompt",
    term: "Prompt (Polecenie)",
    analogy: "Zamówienie w restauracji",
    icon: "💬",
    desc: "Zwykłe polecenie napisane w języku polskim, w którym mówisz sztucznej inteligencji (AI), co dokładnie ma dla Ciebie przygotować. Im dokładniejsze zamówienie, tym smaczniejsze danie!"
  },
  {
    id: "klamerki",
    term: "Klamerki XML (<tagi>)",
    analogy: "Teczka z dokumentami i spinacz biurowy",
    icon: "🏷️",
    desc: "Sposób na oddzielenie Twoich luźnych notatek od właściwego polecenia. Gdy włożysz tekst między <pomysl> a </pomysl>, sztuczna inteligencja wie, że to materiał do opracowania, a nie rozkaz."
  },
  {
    id: "few-shot",
    term: "Uczenie przez przykłady (Few-Shot)",
    analogy: "Zdjęcie fryzury u fryzjera",
    icon: "✂️",
    desc: "Zamiast tłumaczyć sztucznej inteligencji przez kwadrans skomplikowane zasady, pokazujesz jej 1 lub 2 gotowe przykłady pytania i odpowiedzi. AI natychmiast 'łapie wzorzec'."
  },
  {
    id: "piaskownica",
    term: "Piaskownica (Sandbox)",
    analogy: "Bezpieczny plac zabaw w przeglądarce",
    icon: "🧪",
    desc: "Wydzielone, bezpieczne okienko w kursie, w którym możesz natychmiast uruchomić kod strony napisany przez AI i poklikać we własny program bez instalowania czegokolwiek na komputerze."
  },
  {
    id: "html",
    term: "HTML",
    analogy: "Cegły i ściany budynku",
    icon: "🧱",
    desc: "Szkielet każdej strony internetowej. To w nim znajdują się teksty, nagłówki, przyciski i obrazki."
  },
  {
    id: "css",
    term: "CSS",
    analogy: "Farba, tapety i wystrój wnętrz",
    icon: "🎨",
    desc: "Warstwa wyglądu strony. Odpowiada za kolory, wielkość liter, ładne zaokrąglenia przycisków i cienie."
  },
  {
    id: "javascript",
    term: "JavaScript (JS)",
    analogy: "Instalacja elektryczna i włączniki światła",
    icon: "⚡",
    desc: "Mózg i mięśnie strony. Sprawia, że po kliknięciu myszką cyfra w liczniku rośnie, wyskakuje komunikat albo wystrzeliwuje konfetti."
  },
  {
    id: "stan",
    term: "Stan aplikacji (State)",
    analogy: "Skarbonka z monetami",
    icon: "🪙",
    desc: "Pamięć programu. Dzięki niej aplikacja wie, ile kaw dziś wypiłeś albo jakie produkty dodałeś do koszyka w trakcie korzystania ze strony."
  },
  {
    id: "blad",
    term: "Błąd w kodzie (Bug)",
    analogy: "Kamyk w bucie",
    icon: "🪲",
    desc: "Drobna literówka, brakujący przecinek lub niezrozumienie polecenia, przez które strona na chwilę staje. Wystarczy wkleić czerwony błąd z powrotem do AI, by go usunęła."
  },
  {
    id: "api",
    term: "API",
    analogy: "Kelner zanoszący zamówienie do kuchni",
    icon: "🍽️",
    desc: "Łącznik między dwoma programami. Zanosi zapytanie (np. 'jaka jest pogoda w Krakowie?') do serwera i przynosi gotową odpowiedź prosto na Twój ekran."
  },
  {
    id: "cdn",
    term: "CDN",
    analogy: "Hurtownia z darmową dostawą klocków",
    icon: "📦",
    desc: "Internetowy magazyn gotowych rozwiązań (np. efektów konfetti czy wykresów), które dołączasz do strony jedną linijką linku, bez pobierania na dysk."
  },
  {
    id: "f12",
    term: "Konsola inspekcji (Klawisz F12)",
    analogy: "Deska rozdzielcza z kontrolkami w aucie",
    icon: "🚗",
    desc: "Narzędzie wbudowane w każdą przeglądarkę. Jeśli coś na stronie nie działa, konsola zapala czerwoną kontrolkę z dokładną informacją, co poszło nie tak."
  },
  {
    id: "localstorage",
    term: "Pamięć lokalna (LocalStorage)",
    analogy: "Notesik w schowku samochodowym",
    icon: "📔",
    desc: "Niewielki, bezpieczny schowek w Twojej przeglądarce, dzięki któremu Twoje notatki i postępy w nauce nie znikają po wyłączeniu komputera."
  },
  {
    id: "persona",
    term: "Rola i Persona",
    analogy: "Mundur lekarza lub kostium aktora",
    icon: "🎭",
    desc: "Polecenie dla sztucznej inteligencji, by wcieliła się w konkretnego specjalistę (np. 'odpowiadaj jak doświadczony główny architekt oprogramowania')."
  },
  {
    id: "tokeny",
    term: "Tokeny",
    analogy: "Sylabowe klocki tekstu",
    icon: "🧩",
    desc: "Kawałki słów, na które AI dzieli tekst, aby go przeczytać. Jedno polskie słowo składa się zwykle z 1 do 3 tokenów."
  }
];

function openCourseGuideModal() {
  openModal('modal-course-guide');
  announceSR("Otwarto przewodnik: Jak korzystać z tego kursu w 3 prostych krokach.");
}

function closeCourseGuideModal() {
  closeModal('modal-course-guide');
}

function openGlossaryModal(initialSearch = '') {
  renderGlossaryCards(initialSearch);
  openModal('modal-glossary', null, '#glossary-search-input');
  const searchInput = document.getElementById('glossary-search-input');
  if (searchInput) {
    searchInput.value = initialSearch;
  }
  announceSR("Otwarto słowniczek pojęć bez żargonu.");
}

function closeGlossaryModal() {
  closeModal('modal-glossary');
}

function renderGlossaryCards(filterQuery = '') {
  const container = document.getElementById('glossary-cards-container');
  if (!container) return;
  
  const q = (filterQuery || '').toLowerCase().trim();
  const filtered = GLOSSARY_DATA.filter(item => 
    !q || item.term.toLowerCase().includes(q) || item.analogy.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-slate-400 bg-slate-950/60 rounded-2xl border border-slate-800">
        <span class="text-3xl block mb-2" role="img" aria-label="(brak wyników)">🔍</span>
        <p class="font-bold text-slate-200">Nie znaleziono pojęcia "${escapeHtmlText(filterQuery)}"</p>
        <p class="text-xs text-slate-400 mt-1">Wpisz inne słowo, np. prompt, klamerki, html, api, piaskownica.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <article class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition shadow-sm">
      <div class="flex items-center justify-between gap-2 mb-2">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <span class="text-xl" role="img" aria-label="(${item.analogy})">${item.icon}</span>
          <span>${item.term}</span>
        </h3>
        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          ${item.analogy}
        </span>
      </div>
      <p class="text-xs text-slate-300 leading-relaxed">${item.desc}</p>
    </article>
  `).join('');
}

function toggleTaskDone(taskId) {
  if (STATE.completedTasks.has(taskId)) {
    STATE.completedTasks.delete(taskId);
    playTone(280, 'sine', 0.1, 0.08);
    announceSR(`Cofnięto wykonanie zadania ${taskId}.`);
  } else {
    STATE.completedTasks.add(taskId);
    playSuccessChime();
    celebrateWithConfetti();
    announceSR(`Zadanie ${taskId} oznaczone jako wykonane!`);
  }

  updateStreak();
  saveState();
  updateProgressUI();
  updateBadgesUI();
  updateRewardsUI();
  renderTasks();
}

function copyPromptById(taskId) {
  const task = TASKS_DATA.find(t => t.id === taskId);
  if (!task) return;
  copyPromptToClipboard(task.prompt, taskId);
}

function copyPromptToClipboard(promptText, taskId) {
  const onCopied = () => {
    playClickSound();
    const btn = document.getElementById(`copy-btn-${taskId}`);
    if (btn) {
      btn.innerHTML = '<span>Skopiowano!</span> <span role="img" aria-label="(ikona potwierdzenia)">✓</span>';
      btn.classList.add('bg-emerald-600', 'text-white');
      setTimeout(() => {
        btn.innerHTML = `<span>Kopiuj Prompt<span class="sr-only"> zadania ${taskId}</span></span> <span role="img" aria-label="(ikona schowka)">📋</span>`;
        btn.classList.remove('bg-emerald-600', 'text-white');
      }, 2000);
    }
    announceSR(`Skopiowano prompt zadania ${taskId} do schowka.`);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(promptText).then(onCopied).catch(() => fallbackCopyText(promptText, onCopied));
  } else {
    fallbackCopyText(promptText, onCopied);
  }
}

function fallbackCopyText(text, callback) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    if (callback) callback();
  } catch (e) {
    alert("Zaznacz tekst ręcznie i skopiuj go do schowka.");
  }
}

function copyStarterCodeById(taskId) {
  const task = TASKS_DATA.find(t => t.id === taskId);
  if (!task || !task.starterCode) return;
  const onCopied = () => {
    playClickSound();
    const btn = document.getElementById(`copy-starter-btn-${taskId}`);
    if (btn) {
      btn.innerHTML = '<span>✓ Skopiowano kod!</span>';
      btn.classList.add('bg-emerald-600', 'text-white');
      setTimeout(() => {
        btn.innerHTML = '<span>Kopiuj kod bazowy</span> <span role="img" aria-label="(ikona schowka)">📋</span>';
        btn.classList.remove('bg-emerald-600', 'text-white');
      }, 2000);
    }
    announceSR(`Skopiowano kod bazowy zadania ${taskId} do schowka.`);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(task.starterCode).then(onCopied).catch(() => fallbackCopyText(task.starterCode, onCopied));
  } else {
    fallbackCopyText(task.starterCode, onCopied);
  }
}

function copyCombinedCodeAndPrompt(taskId) {
  const task = TASKS_DATA.find(t => t.id === taskId);
  if (!task || !task.starterCode) return;
  const combined = `Oto mój działający kod bazowy pliku:\n\`\`\`html\n${task.starterCode}\n\`\`\`\n\nMoje polecenie (wykonaj modyfikację powyższego kodu):\n${task.prompt}`;
  const onCopied = () => {
    playSuccessChime();
    const btn1 = document.getElementById(`copy-combined-btn-${taskId}`);
    const btn2 = document.getElementById(`copy-combined-prompt-btn-${taskId}`);
    [btn1, btn2].forEach(b => {
      if (b) {
        b.innerHTML = '<span>✓ Skopiowano kod + prompt!</span>';
        b.classList.add('bg-emerald-600', 'text-white');
      }
    });
    setTimeout(() => {
      if (btn1) {
        btn1.innerHTML = '<span>🚀 Kopiuj kod + prompt</span>';
        btn1.classList.remove('bg-emerald-600', 'text-white');
      }
      if (btn2) {
        btn2.innerHTML = '<span>🚀 Kod + Prompt</span>';
        btn2.classList.remove('bg-emerald-600', 'text-white');
      }
    }, 2500);
    announceSR(`Skopiowano połączony kod bazowy i prompt zadania ${taskId} do schowka.`);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(combined).then(onCopied).catch(() => fallbackCopyText(combined, onCopied));
  } else {
    fallbackCopyText(combined, onCopied);
  }
}

function toggleStarterCode(taskId) {
  const box = document.getElementById(`starter-code-box-${taskId}`);
  const btn = document.getElementById(`toggle-starter-btn-${taskId}`);
  const textEl = document.getElementById(`starter-code-toggle-text-${taskId}`);
  if (!box) return;
  const isHidden = box.classList.contains('hidden');
  if (isHidden) {
    box.classList.remove('hidden');
    if (textEl) textEl.textContent = 'Ukryj kod';
    if (btn) btn.setAttribute('aria-expanded', 'true');
    announceSR(`Rozwinięto kod bazowy zadania ${taskId}.`);
  } else {
    box.classList.add('hidden');
    if (textEl) textEl.textContent = 'Pokaż kod';
    if (btn) btn.setAttribute('aria-expanded', 'false');
    announceSR(`Zwinięto kod bazowy zadania ${taskId}.`);
  }
}

function renderAddonsPage() {
  const container = document.getElementById('addons-content-container');
  if (!container) return;

  const isBusinessLearner = (STATE.userProfile && STATE.userProfile.ageGroup === 'adult' && STATE.userProfile.interest === 'business');
  
  if (!isBusinessLearner) {
    container.innerHTML = `
      <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-amber-500/40 text-center max-w-2xl mx-auto shadow-2xl">
        <span class="text-4xl block mb-3" role="img" aria-label="(ikona teczki)">💼</span>
        <h2 class="text-xl sm:text-2xl font-black text-white mb-2">Specjalizacja Biznesowa i Praca</h2>
        <p class="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          Moduł ten zawiera specjalistyczne wdrożenia dla pracy w firmie i biurze (automatyzacja Excela, analiza ankiet i procedury SOP).
          Sekcja ta jest aktywna dla profilu: <strong>Dorosły • Biznes, Praca i Automatyzacja</strong>.
        </p>
        <button type="button" onclick="switchSubpage('page-profile')" class="touch-target px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-lg inline-flex items-center gap-2">
          <span>Przejdź do Kroku 2: Wybór Profilu i aktywuj profil Biznes</span>
          <span role="img" aria-label="(strzałka w prawo)">&rarr;</span>
        </button>
      </div>
    `;
    return;
  }

  const basicTaskIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  const completedBasicCount = basicTaskIds.filter(id => STATE.completedTasks && STATE.completedTasks.has(id)).length;
  const isQualified = (completedBasicCount >= 15 || (STATE.testResult && STATE.testResult.score >= 9) || (STATE.startingChoice && STATE.startingChoice >= 8));

  const addonIds = [101, 102, 103, 104, 105, 106, 107, 108, 109];
  const completedAddonCount = addonIds.filter(id => STATE.completedTasks && STATE.completedTasks.has(id)).length;
  let earnedAddonPts = 0;
  addonIds.forEach(id => {
    if (STATE.completedTasks && STATE.completedTasks.has(id)) {
      const t = TASKS_DATA.find(x => x.id === id);
      if (t) earnedAddonPts += getTaskPoints(t);
    }
  });

  const badgeComp = document.getElementById('addons-completed-badge');
  if (badgeComp) badgeComp.textContent = `${completedAddonCount} / 9`;
  const badgePts = document.getElementById('addons-points-badge');
  if (badgePts) badgePts.textContent = `${earnedAddonPts} / 285 pkt`;

  if (!isQualified) {
    const pct = Math.round((completedBasicCount / 15) * 100);
    container.innerHTML = `
      <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-indigo-500/50 max-w-2xl mx-auto shadow-2xl text-center">
        <div class="w-16 h-16 rounded-full bg-indigo-950 border-2 border-indigo-400 flex items-center justify-center text-2xl mx-auto mb-4">
          <span role="img" aria-label="(kłódka)">🔒</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-white mb-2">Pakiety Biznesowe są obecnie Zablokowane</h2>
        <p class="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          Aby bezpiecznie i bez frustracji tworzyć zaawansowane makra Excela, analizować surowe ankiety i pisać regulaminy korporacyjne, musisz najpierw opanować fundamenty inżynierii promptu.
          Ukończ pierwsze 15 podstawowych zadań kursu (<strong>Etap 1: Fundamenty i dekompozycja</strong>).
        </p>
        <div class="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left">
          <div class="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
            <span>Twój postęp w Etapie 1:</span>
            <span class="text-indigo-400">${completedBasicCount} z 15 zadań (${pct}%)</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-500 to-emerald-400 h-3 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
          </div>
        </div>
        <button type="button" onclick="switchSubpage('page-daily-tasks')" class="touch-target px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition shadow-lg inline-flex items-center gap-2">
          <span>Przejdź do Zadań Dnia (Etap 1)</span>
          <span role="img" aria-label="(ikona celu)">🎯</span>
        </button>
      </div>
    `;
    return;
  }

  const packs = (typeof BUSINESS_ADDON_PACKS !== 'undefined') ? BUSINESS_ADDON_PACKS : [];
  let html = `
    <div class="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow">
      <div class="flex items-center gap-3">
        <span class="text-3xl" role="img" aria-label="(gwiazda)">⭐</span>
        <div class="text-xs text-emerald-200">
          <strong class="text-emerald-300 text-sm block mb-0.5">Moduł Specjalizacji Biznesowej jest w pełni Odblokowany!</strong>
          Opanowałeś fundamenty Vibe Codingu. Wszystkie 3 pakiety są gotowe do wdrożenia. Każde zaliczone zadanie zasila Twój wynik (+30–35 pkt) i odblokowuje specjalną akredytację na oficjalnym dyplomie!
        </div>
      </div>
      <div class="shrink-0 text-xs font-bold text-emerald-400 bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-500/30">
        Status: 9 Wdrożeń Aktywnych
      </div>
    </div>
  `;

  packs.forEach((pack, packIdx) => {
    const packTasks = pack.taskIds.map(id => TASKS_DATA.find(t => t.id === id)).filter(Boolean);
    const packPassedCount = packTasks.filter(t => STATE.completedTasks && STATE.completedTasks.has(t.id)).length;
    const isPackComplete = (packPassedCount === packTasks.length);

    html += `
      <section class="p-6 sm:p-8 rounded-3xl bg-slate-900 border ${isPackComplete ? 'border-emerald-500/60 bg-emerald-950/15' : 'border-slate-800'} shadow-xl space-y-6 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl p-2.5 rounded-2xl bg-slate-950 border border-slate-800" role="img" aria-label="${pack.title}">${pack.icon}</span>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${pack.badgeColor}">
                  Moduł ${packIdx + 1} z 3
                </span>
                ${isPackComplete ? '<span class="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✓ UKOŃCZONY</span>' : ''}
              </div>
              <h2 class="text-lg sm:text-xl font-black text-white mt-1">${pack.title}</h2>
              <p class="text-xs text-slate-300 mt-0.5 max-w-2xl">${pack.desc}</p>
            </div>
          </div>
          <div class="text-right shrink-0">
            <span class="text-xs font-bold text-slate-400 block">Postęp modułu:</span>
            <span class="text-sm font-black ${isPackComplete ? 'text-emerald-400' : 'text-amber-300'}">${packPassedCount} / ${packTasks.length} zadań</span>
          </div>
        </div>

        <div class="space-y-6">
          ${packTasks.map(task => renderTaskCard(task)).join('')}
        </div>
      </section>
    `;
  });

  container.innerHTML = html;
}

// Aktualizacja paska postępu
function updateProgressUI() {
  const scoreData = calculateScore();
  const count = scoreData.passedCount;
  const total = scoreData.totalTasks;
  const pct = scoreData.percentage;

  // Górny licznik punktów w nagłówku
  const headerPoints = document.getElementById('header-points-count');
  if (headerPoints) headerPoints.textContent = scoreData.earnedPoints.toString();

  const bar = document.getElementById('global-progress-bar');
  const text = document.getElementById('global-progress-text');
  const countText = document.getElementById('global-progress-count');

  if (bar) bar.style.width = `${pct}%`;
  if (text) text.textContent = `${pct}%`;
  if (countText) countText.textContent = `${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints} pkt (${count} z ${total} zadań)`;

  const allProgressText = document.getElementById('all-tasks-progress-text');
  if (allProgressText) allProgressText.textContent = `${pct}%`;
  const allProgressCount = document.getElementById('all-tasks-progress-count');
  if (allProgressCount) allProgressCount.textContent = `${scoreData.earnedPoints} / ${scoreData.totalPossiblePoints} pkt • ${count} z ${total} zadań`;

  const dailyTasks = TASKS_DATA.filter(t => t.day === STATE.currentDay);
  const dailyDone = dailyTasks.filter(t => getTaskStatus(t.id) === 'passed').length;
  let dailyEarned = 0;
  let dailyPossible = 0;
  dailyTasks.forEach(t => {
    const pts = getTaskPoints(t);
    dailyPossible += pts;
    if (getTaskStatus(t.id) === 'passed') dailyEarned += pts;
  });
  const dailyPct = dailyPossible > 0 ? Math.round((dailyEarned / dailyPossible) * 100) : 0;

  const dailyProgressCount = document.getElementById('daily-progress-count');
  if (dailyProgressCount) dailyProgressCount.textContent = `${dailyDone} / ${dailyTasks.length} zadań (${dailyEarned}/${dailyPossible} pkt)`;
  const dailyProgressPct = document.getElementById('daily-progress-pct');
  if (dailyProgressPct) dailyProgressPct.textContent = `(${dailyPct}%)`;

  const container = document.getElementById('progress-container');
  if (container) {
    container.setAttribute('aria-valuenow', scoreData.earnedPoints.toString());
    container.setAttribute('aria-valuetext', `${scoreData.earnedPoints} z ${scoreData.totalPossiblePoints} punktów, ${pct} procent ukończenia, ocena: ${scoreData.grade.short}`);
  }

  // Aktualizacja stanu oczyszczania dyplomu oraz podglądu płótna
  updateDiplomaCleansingUI();
  if (STATE.activeSubpage === 'page-rewards') {
    renderDiplomaCanvas();
  }
}

// Aktualizacja Odznak (Tytuł pierwszy, opis ikonki po nim!)
function updateBadgesUI() {
  const container = document.getElementById('badges-grid');
  if (!container) return;

  const count = STATE.completedTasks.size;

  container.innerHTML = BADGES.map(b => {
    const isUnlocked = b.check(count);
    return `
      <div class="p-3 rounded-xl border text-center transition flex flex-col items-center justify-between ${isUnlocked ? 'border-amber-500/50 bg-amber-950/20 text-white shadow' : 'border-slate-800 bg-slate-900/60 opacity-60 text-slate-400'}" title="${b.desc}">
        <h5 class="text-[11px] font-bold tracking-tight">${b.title}</h5>
        <span class="text-2xl my-1.5 filter ${isUnlocked ? 'drop-shadow-md' : 'grayscale'}" role="img" aria-label="(${b.iconLabel})">${b.icon}</span>
        <span class="text-[10px] font-bold ${isUnlocked ? 'text-amber-400' : 'text-slate-500'} inline-flex items-center gap-1">
          <span>${isUnlocked ? 'Zdobyta' : 'Zablokowana'}</span>
          <span role="img" aria-label="${isUnlocked ? '(ikona potwierdzenia)' : '(ikona kłódki)'}">${isUnlocked ? '✓' : '🔒'}</span>
        </span>
      </div>
    `;
  }).join('');
}

// Aktualizacja Skrzyni Nagród (Etykieta pierwsza, opis ikonki po niej!)
function updateRewardsUI() {
  const count = STATE.completedTasks.size;

  [25, 50, 75].forEach(milestone => {
    const card = document.getElementById(`reward-card-${milestone}`);
    const badge = document.getElementById(`reward-badge-${milestone}`);
    const btn = document.getElementById(`reward-btn-${milestone}`);
    const isUnlocked = count >= milestone;

    if (card && badge && btn) {
      if (isUnlocked) {
        card.classList.add('border-amber-500/60', 'bg-amber-950/25');
        card.classList.remove('border-slate-800', 'bg-slate-900/60');
        badge.classList.replace('text-slate-400', 'text-amber-300');
        badge.textContent = `Odblokowano (${milestone}) ✓`;
        btn.disabled = false;
        btn.classList.remove('bg-slate-800', 'text-slate-400', 'cursor-not-allowed');
        btn.classList.add('bg-amber-500', 'hover:bg-amber-400', 'text-slate-950', 'shadow');
        btn.innerHTML = '<span>Otwórz materiał</span> <span role="img" aria-label="(ikona prezentu)">🎁</span>';
      } else {
        card.classList.remove('border-amber-500/60', 'bg-amber-950/25');
        badge.textContent = `Krok: ${milestone} Zadań (${count}/${milestone})`;
        btn.disabled = true;
        btn.classList.add('bg-slate-800', 'text-slate-400', 'cursor-not-allowed');
        btn.classList.remove('bg-amber-500', 'hover:bg-amber-400', 'text-slate-950', 'shadow');
        btn.innerHTML = `<span>Wymaga ${milestone} zadań</span> <span role="img" aria-label="(ikona kłódki)">🔒</span>`;
      }
    }
  });

  const card100 = document.getElementById('reward-card-100');
  const badge100 = document.getElementById('reward-badge-100');
  const btn100 = document.getElementById('reward-btn-100');

  if (card100 && badge100 && btn100) {
    if (count >= 100) {
      card100.classList.add('border-emerald-500/80', 'bg-emerald-950/30');
      badge100.textContent = 'MISTRZ UKOŃCZONY 100% ✓';
      btn100.innerHTML = '<span>Odbierz Swój Dyplom</span> <span role="img" aria-label="(ikona biretu)">🎓</span>';
      btn100.classList.replace('bg-amber-500', 'bg-emerald-500');
    } else {
      badge100.textContent = `Wielki Finał (100) • (${count}/100)`;
    }
  }
}

function claimReward(milestone, triggerEl = null) {
  playClickSound();
  const reward = REWARDS[milestone];
  if (!reward) return;

  const modal = document.getElementById('reward-details-modal');
  const titleEl = document.getElementById('reward-modal-title');
  const subEl = document.getElementById('reward-modal-subtitle');
  const iconEl = document.getElementById('reward-modal-icon');
  const contentEl = document.getElementById('reward-modal-content');

  if (modal && titleEl && contentEl) {
    titleEl.textContent = reward.title;
    subEl.textContent = reward.subtitle;
    if (iconEl) {
      iconEl.textContent = reward.icon;
      iconEl.setAttribute('aria-label', reward.iconLabel || '(ikona nagrody)');
    }
    contentEl.innerHTML = reward.content;

    openModal('reward-details-modal', triggerEl, '#reward-modal-title');
    announceSR(`Otwarto okno nagrody: ${reward.title}.`);
  }
}

function closeRewardModal() {
  closeModal('reward-details-modal');
  announceSR("Zamknięto okno nagrody. Powrót do strony głównej.");
}

function copyRewardContent() {
  const contentEl = document.getElementById('reward-modal-content');
  if (contentEl) {
    const done = () => {
      playClickSound();
      const btn = document.getElementById('btn-copy-reward');
      if (btn) {
        btn.innerHTML = '<span>Skopiowano treść!</span> <span role="img" aria-label="(ikona potwierdzenia)">✓</span>';
        setTimeout(() => {
          btn.innerHTML = '<span>Kopiuj treść do schowka</span> <span role="img" aria-label="(ikona schowka)">📋</span>';
        }, 2500);
      }
      announceSR("Treść nagrody skopiowana do schowka.");
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(contentEl.innerText).then(done).catch(() => fallbackCopyText(contentEl.innerText, done));
    } else {
      fallbackCopyText(contentEl.innerText, done);
    }
  }
}

// =========================================================================
// MOTYWACJA: STREAK & CYTATY
// =========================================================================
function updateStreak() {
  const todayStr = new Date().toISOString().split('T')[0];
  if (!STATE.lastActiveDate) {
    STATE.lastActiveDate = todayStr;
    STATE.streakDays = 1;
  } else if (STATE.lastActiveDate !== todayStr) {
    const lastDate = new Date(STATE.lastActiveDate);
    const currDate = new Date(todayStr);
    const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      STATE.streakDays++;
    } else if (diffDays > 1) {
      STATE.streakDays = 1;
    }
    STATE.lastActiveDate = todayStr;
  }

  const streakEl = document.getElementById('streak-days-display');
  if (streakEl) streakEl.textContent = `${STATE.streakDays} ${STATE.streakDays === 1 ? 'dzień' : 'dni'}`;
}

function renderMotivationalQuoteUI() {
  const item = MOTIVATIONAL_QUOTES[currentQuoteIndex];
  if (!item) return;

  const total = MOTIVATIONAL_QUOTES.length;
  const counterText = `Myśl ${currentQuoteIndex + 1} z ${total}`;

  // Podstrona 1 elementy
  const wText = document.getElementById('welcome-quote-text');
  const wAuth = document.getElementById('welcome-quote-author');
  const wCounter = document.getElementById('welcome-quote-counter');
  if (wText) wText.textContent = `"${item.quote}"`;
  if (wAuth) wAuth.textContent = `— ${item.author}`;
  if (wCounter) wCounter.textContent = counterText;

  // Identyfikatory ogólne (dla zachowania pełnej kompatybilności)
  const qText = document.getElementById('motivational-quote-text');
  const qAuth = document.getElementById('motivational-quote-author');
  if (qText) qText.textContent = `"${item.quote}"`;
  if (qAuth) qAuth.textContent = `— ${item.author}`;

  // Elementy dynamiczne w widoku dnia i narzędziach
  document.querySelectorAll('.daily-quote-text').forEach(el => el.textContent = `"${item.quote}"`);
  document.querySelectorAll('.daily-quote-author').forEach(el => el.textContent = `— ${item.author}`);
  document.querySelectorAll('.daily-quote-counter').forEach(el => el.textContent = counterText);
}

function nextMotivationalQuote() {
  playClickSound();
  currentQuoteIndex = (currentQuoteIndex + 1) % MOTIVATIONAL_QUOTES.length;
  renderMotivationalQuoteUI();
  const item = MOTIVATIONAL_QUOTES[currentQuoteIndex];
  announceSR(`Kolejna złota myśl (${currentQuoteIndex + 1} z ${MOTIVATIONAL_QUOTES.length}): ${item.quote}`);
}

function prevMotivationalQuote() {
  playClickSound();
  currentQuoteIndex = (currentQuoteIndex - 1 + MOTIVATIONAL_QUOTES.length) % MOTIVATIONAL_QUOTES.length;
  renderMotivationalQuoteUI();
  const item = MOTIVATIONAL_QUOTES[currentQuoteIndex];
  announceSR(`Poprzednia złota myśl (${currentQuoteIndex + 1} z ${MOTIVATIONAL_QUOTES.length}): ${item.quote}`);
}

// =========================================================================
// DOSTĘPNOŚĆ WCAG, CZYTNIKI EKRANU & DŹWIĘK
// =========================================================================
function syncSoundButtonUI() {
  const icon = document.getElementById('sound-icon');
  const text = document.getElementById('sound-status-text');
  const btn = document.getElementById('btn-sound-toggle');

  if (icon) {
    icon.textContent = STATE.soundEnabled ? '🔊' : '🔇';
    icon.setAttribute('aria-label', STATE.soundEnabled ? '(ikona głośnika)' : '(ikona wyciszenia)');
  }
  if (text) text.textContent = STATE.soundEnabled ? 'Dźwięk: Wł.' : 'Dźwięk: Wył.';
  if (btn) btn.setAttribute('aria-pressed', STATE.soundEnabled.toString());
}

function toggleSound() {
  STATE.soundEnabled = !STATE.soundEnabled;
  playClickSound();
  syncSoundButtonUI();
  announceSR(`Efekty dźwiękowe zostały ${STATE.soundEnabled ? 'włączone' : 'wyłączone'}.`);
  saveState();
}

function toggleContrast(forceVal) {
  STATE.contrastHigh = typeof forceVal === 'boolean' ? forceVal : !STATE.contrastHigh;
  playClickSound();
  const btn = document.getElementById('btn-contrast-toggle');

  if (STATE.contrastHigh) {
    document.documentElement.setAttribute('data-contrast', 'high');
    if (btn) btn.setAttribute('aria-pressed', 'true');
    announceSR('Włączono tryb wysokiego kontrastu WCAG AAA.');
  } else {
    document.documentElement.removeAttribute('data-contrast');
    if (btn) btn.setAttribute('aria-pressed', 'false');
    announceSR('Wyłączono tryb wysokiego kontrastu.');
  }
  saveState();
}

// =========================================================================
// ZARZĄDZANIE ADAPTACJĄ DO INWERSJI KOLORÓW IPHONE (WCAG 2.1/2.2 AA & AAA)
// Dla funkcji iOS: "Odwrócenie kolorów" oraz "Inteligentne odwrócenie"
// =========================================================================
function toggleIphoneInvertMode(forceVal) {
  const newVal = typeof forceVal === 'boolean' ? forceVal : !STATE.iphoneInvertMode;
  applyIphoneInvertMode(newVal, true);
}

function applyIphoneInvertMode(isActive, shouldAnnounce = false) {
  STATE.iphoneInvertMode = Boolean(isActive);
  const btn = document.getElementById('btn-iphone-invert-toggle');
  const srText = document.getElementById('invert-sr-status');

  if (STATE.iphoneInvertMode) {
    document.documentElement.setAttribute('data-invert', 'iphone');
    if (btn) {
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('bg-amber-400', 'text-slate-950', 'border-amber-400', 'font-black');
      btn.classList.remove('bg-slate-800', 'text-slate-200', 'border-slate-700');
    }
    if (srText) srText.textContent = 'Tryb adaptacji do inwersji iPhone: włączony (ciemne tło aktywne).';
    if (shouldAnnounce) {
      announceSR('Włączono tryb adaptacji do inwersji iPhone. Tło po odwróceniu kolorów w telefonie pozostaje głęboko ciemne.');
      playClickSound();
    }
  } else {
    document.documentElement.removeAttribute('data-invert');
    if (btn) {
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('bg-amber-400', 'text-slate-950', 'border-amber-400', 'font-black');
      btn.classList.add('bg-slate-800', 'text-slate-200', 'border-slate-700');
    }
    if (srText) srText.textContent = 'Tryb adaptacji do inwersji iPhone: wyłączony.';
    if (shouldAnnounce) {
      announceSR('Wyłączono tryb adaptacji do inwersji iPhone. Przywrócono domyślne ciemne tło kompendium.');
      playClickSound();
    }
  }
  saveState();
}

function setupInvertedColorsDetection() {
  if (window.matchMedia) {
    try {
      const mediaInvert = window.matchMedia('(inverted-colors: inverted)');
      const handleMediaChange = (e) => {
        if (e.matches && !STATE.iphoneInvertMode) {
          applyIphoneInvertMode(true, true);
        }
      };
      if (mediaInvert.matches && !STATE.iphoneInvertMode) {
        applyIphoneInvertMode(true, false);
      }
      if (typeof mediaInvert.addEventListener === 'function') {
        mediaInvert.addEventListener('change', handleMediaChange);
      } else if (typeof mediaInvert.addListener === 'function') {
        mediaInvert.addListener(handleMediaChange);
      }
    } catch(err) {
      console.warn("Wykrywanie inverted-colors:", err);
    }
  }
}

function applyFontSize(size) {
  playClickSound();
  STATE.fontSize = size;

  if (size === 'large') {
    document.documentElement.style.fontSize = '18px';
  } else if (size === 'xlarge') {
    document.documentElement.style.fontSize = '20px';
  } else {
    document.documentElement.style.fontSize = '16px';
  }

  announceSR(`Zmieniono wielkość tekstu na ${size === 'large' ? 'powiększoną' : size === 'xlarge' ? 'bardzo dużą' : 'domyślną'}.`);
  saveState();
}

// =========================================================================
// MODUŁ 1: TWOJE NOTATKI DO ZADAŃ I CENTRUM PRZEGLĄDANIA NOTATEK (WCAG AA)
// =========================================================================
let taskNoteTimers = {};

function handleTaskNoteInput(taskId, val) {
  if (!STATE.taskNotes) STATE.taskNotes = {};
  STATE.taskNotes[taskId] = val;
  const statusEl = document.getElementById(`task-note-status-${taskId}`);
  if (statusEl) statusEl.textContent = "Zapisywanie...";
  clearTimeout(taskNoteTimers[taskId]);
  taskNoteTimers[taskId] = setTimeout(() => {
    localStorage.setItem(`vibe_coding_task_notes_${taskId}`, val);
    saveState();
    if (statusEl) statusEl.textContent = "Zapisano automatycznie ✓";
    updateGlobalNotesCounter();
  }, 400);
}

function clearTaskNote(taskId) {
  const input = document.getElementById(`task-note-input-${taskId}`);
  if (!input || !input.value.trim()) {
    announceSR("Pole notatki jest już puste.");
    return;
  }
  if (!confirm(`Czy na pewno usunąć notatkę do Zadania ${taskId}?`)) return;
  input.value = '';
  if (STATE.taskNotes) delete STATE.taskNotes[taskId];
  localStorage.removeItem(`vibe_coding_task_notes_${taskId}`);
  saveState();
  const statusEl = document.getElementById(`task-note-status-${taskId}`);
  if (statusEl) statusEl.textContent = "Notatka usunięta ✓";
  updateGlobalNotesCounter();
  playClickSound();
  announceSR(`Usunięto notatkę do Zadania ${taskId}.`);
}

function updateGlobalNotesCounter() {
  let count = 0;
  for (let i = 1; i <= 100; i++) {
    const n = (STATE.taskNotes && STATE.taskNotes[i]) || localStorage.getItem(`vibe_coding_task_notes_${i}`);
    if (n && n.trim()) count++;
  }
  for (let d = 1; d <= 34; d++) {
    const dn = localStorage.getItem(`vibe_coding_notes_day_${d}`);
    if (dn && dn.trim()) count++;
  }
  const badge = document.getElementById('header-notes-counter');
  if (badge) {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
  const modalBadge = document.getElementById('notes-modal-count-badge');
  if (modalBadge) {
    modalBadge.textContent = `${count} ${count === 1 ? 'notatka' : (count < 5 ? 'notatki' : 'notatek')}`;
  }
  return count;
}

function openNotesManagerModal() {
  const modal = document.getElementById('modal-notes-manager');
  if (!modal) return;
  renderNotesManagerList('');
  updateGlobalNotesCounter();
  const triggerBtn = document.getElementById('btn-header-notes');
  openModal('modal-notes-manager', triggerBtn, '#notes-search-input');
  announceSR("Otwarto okno przeglądania zrobionych notatek.");
}

function closeNotesManagerModal() {
  closeModal('modal-notes-manager');
  announceSR("Zamknięto przeglądarkę notatek.");
}

function renderNotesManagerList(filterQuery = '') {
  const container = document.getElementById('notes-manager-list');
  if (!container) return;

  const query = (filterQuery || '').toLowerCase().trim();
  const daysData = [];

  for (let d = 1; d <= 34; d++) {
    const stage = getStageForDay(d);
    const dayTasks = TASKS_DATA.filter(t => t.day === d);
    const taskNotesForDay = [];

    dayTasks.forEach(task => {
      const note = (STATE.taskNotes && STATE.taskNotes[task.id]) || localStorage.getItem(`vibe_coding_task_notes_${task.id}`) || '';
      if (note && note.trim()) {
        const matchesQuery = !query ||
          note.toLowerCase().includes(query) ||
          task.title.toLowerCase().includes(query) ||
          task.goal.toLowerCase().includes(query) ||
          `zadanie ${task.id}`.includes(query) ||
          `dzień ${d}`.includes(query);

        if (matchesQuery) {
          taskNotesForDay.push({
            task,
            note: note.trim()
          });
        }
      }
    });

    const dayGeneralNote = localStorage.getItem(`vibe_coding_notes_day_${d}`) || '';
    let matchesDayNote = false;
    if (dayGeneralNote && dayGeneralNote.trim()) {
      matchesDayNote = !query ||
        dayGeneralNote.toLowerCase().includes(query) ||
        `dzień ${d}`.includes(query) ||
        stage.name.toLowerCase().includes(query);
    }

    if (taskNotesForDay.length > 0 || (dayGeneralNote && matchesDayNote)) {
      daysData.push({
        day: d,
        stage,
        taskNotes: taskNotesForDay,
        dayNote: (dayGeneralNote && matchesDayNote) ? dayGeneralNote.trim() : null
      });
    }
  }

  if (daysData.length === 0) {
    if (query) {
      container.innerHTML = `
        <div class="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
          <span class="text-3xl block mb-2" role="img" aria-label="(brak wyników)">🔍</span>
          <p class="text-sm font-bold text-slate-200 mb-1">Brak notatek pasujących do hasła "${escapeHtmlText(query)}"</p>
          <p class="text-xs text-slate-400">Spróbuj wpisać inną frazę lub wyczyść pole wyszukiwania.</p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
          <span class="text-4xl block" role="img" aria-label="(pusty notatnik)">📝</span>
          <h3 class="text-base font-bold text-white">Nie masz jeszcze żadnych zapisanych notatek</h3>
          <p class="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            W każdym zadaniu kursu znajdziesz fioletowe pole <strong>„Twoja notatka i wnioski do Zadania”</strong>. Wszystko, co tam wpiszesz, zapisuje się automatycznie i pojawi się w tym oknie z podziałem na dni oraz możliwością eksportu!
          </p>
          <button type="button" onclick="closeNotesManagerModal()" class="touch-target px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow cursor-pointer">
            Wróć do zadań i stwórz pierwszą notatkę
          </button>
        </div>
      `;
    }
    return;
  }

  container.innerHTML = daysData.map(group => {
    return `
      <section class="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3" aria-labelledby="note-group-day-${group.day}">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Dzień ${group.day}
            </span>
            <h3 id="note-group-day-${group.day}" class="text-sm sm:text-base font-bold text-white">
              ${group.stage.name}
            </h3>
          </div>
          <span class="text-xs text-slate-400">
            ${group.taskNotes.length} ${group.taskNotes.length === 1 ? 'notatka do zadania' : 'notatki'}
          </span>
        </div>

        ${group.taskNotes.map(item => {
          const t = item.task;
          const st = getTaskStatus(t.id);
          const isDone = (st === 'passed');
          return `
            <article class="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 space-y-2.5" id="manager-note-card-${t.id}">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-purple-300">Zadanie ${t.id}:</span>
                  <strong class="text-xs sm:text-sm text-white">${t.title}</strong>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-300'}">
                    ${isDone ? 'Wykonane ✓' : 'W toku ⏳'}
                  </span>
                </div>
                <button type="button" onclick="jumpToTaskFromNotes(${t.id})" class="touch-target text-xs text-indigo-300 hover:text-white font-bold underline flex items-center gap-1 cursor-pointer" title="Przejdź bezpośrednio do tego zadania">
                  <span>Skocz do Zadania ${t.id}</span>
                  <span role="img" aria-label="(strzałka)">&nearr;</span>
                </button>
              </div>

              <p class="text-[11px] text-slate-400 leading-relaxed italic"><strong class="text-slate-300 not-italic">Cel:</strong> ${t.goal}</p>

              <div>
                <label for="mgr-note-textarea-${t.id}" class="sr-only">Edytuj notatkę do zadania ${t.id}</label>
                <textarea id="mgr-note-textarea-${t.id}" rows="2"
                  class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 font-sans"
                  oninput="handleTaskNoteInput(${t.id}, this.value)">${escapeHtmlText(item.note)}</textarea>
              </div>

              <div class="flex items-center justify-between text-xs pt-1">
                <span id="task-note-status-${t.id}" class="text-[11px] text-emerald-400 font-semibold" aria-live="polite">Zapisano automatycznie ✓</span>
                <button type="button" onclick="deleteNoteFromManager(${t.id})" class="text-slate-400 hover:text-rose-300 underline font-medium cursor-pointer">
                  Usuń tę notatkę
                </button>
              </div>
            </article>
          `;
        }).join('')}

        ${group.dayNote ? `
          <article class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <strong class="text-xs text-amber-300 flex items-center gap-1">
                <span>📝 Notatka ogólna do Dnia ${group.day}:</span>
              </strong>
              <button type="button" onclick="deleteMainDailyNote(${group.day}); renderNotesManagerList('');" class="text-xs text-slate-400 hover:text-rose-300 underline font-medium cursor-pointer">
                Usuń
              </button>
            </div>
            <p class="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">${escapeHtmlText(group.dayNote)}</p>
          </article>
        ` : ''}
      </section>
    `;
  }).join('');
}

function deleteNoteFromManager(taskId) {
  if (!confirm(`Czy na pewno usunąć notatkę do Zadania ${taskId}?`)) return;
  if (STATE.taskNotes) delete STATE.taskNotes[taskId];
  localStorage.removeItem(`vibe_coding_task_notes_${taskId}`);
  saveState();
  updateGlobalNotesCounter();
  renderNotesManagerList(document.getElementById('notes-search-input') ? document.getElementById('notes-search-input').value : '');
  playClickSound();
  announceSR(`Usunięto notatkę do Zadania ${taskId}.`);
}

function jumpToTaskFromNotes(taskId) {
  const task = TASKS_DATA.find(t => t.id === taskId);
  if (!task) return;
  closeNotesManagerModal();
  STATE.currentDay = task.day;
  saveState();
  switchSubpage('page-daily-tasks');
  renderTasks();
  setTimeout(() => {
    const card = document.getElementById(`task-card-${taskId}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const title = document.getElementById(`task-title-${taskId}`);
      if (title) title.focus({ preventScroll: true });
    }
  }, 200);
  announceSR(`Przejście do Zadania ${taskId} w Dniu ${task.day}.`);
}

function downloadNotesMarkdown() {
  const notesCount = updateGlobalNotesCounter();
  if (notesCount === 0) {
    alert("Nie masz jeszcze żadnych notatek do pobrania. Wpisz swoje uwagi w zadaniach kursu!");
    return;
  }

  const learner = STATE.learnerName || "Adept Vibe Codingu";
  const dateStr = new Date().toLocaleDateString('pl-PL') + ' ' + new Date().toLocaleTimeString('pl-PL');

  let md = `# Akademia Vibe Codingu i Sztuki Promptingu\n`;
  md += `## Kompendium Zrobionych Notatek Kursanta\n\n`;
  md += `- **Autor:** ${learner}\n`;
  md += `- **Data wygenerowania:** ${dateStr}\n`;
  md += `- **Liczba notatek:** ${notesCount}\n\n`;
  md += `---\n\n`;
  md += `## Spis Treści\n\n`;

  for (let d = 1; d <= 34; d++) {
    const dayTasks = TASKS_DATA.filter(t => t.day === d);
    const hasNotes = dayTasks.some(t => {
      const n = (STATE.taskNotes && STATE.taskNotes[t.id]) || localStorage.getItem(`vibe_coding_task_notes_${t.id}`);
      return n && n.trim();
    }) || Boolean(localStorage.getItem(`vibe_coding_notes_day_${d}`));

    if (hasNotes) {
      md += `- [Dzień ${d}: ${getStageForDay(d).name}](#dzień-${d})\n`;
    }
  }

  md += `\n---\n\n`;

  for (let d = 1; d <= 34; d++) {
    const stage = getStageForDay(d);
    const dayTasks = TASKS_DATA.filter(t => t.day === d);
    const dayNotesList = [];

    dayTasks.forEach(task => {
      const n = (STATE.taskNotes && STATE.taskNotes[task.id]) || localStorage.getItem(`vibe_coding_task_notes_${task.id}`) || '';
      if (n && n.trim()) {
        dayNotesList.push({ task, text: n.trim() });
      }
    });

    const dayNote = localStorage.getItem(`vibe_coding_notes_day_${d}`) || '';

    if (dayNotesList.length > 0 || (dayNote && dayNote.trim())) {
      md += `## Dzień ${d}: ${stage.name}\n\n`;

      dayNotesList.forEach(item => {
        const t = item.task;
        const st = getTaskStatus(t.id);
        const pts = getTaskPoints(t);
        md += `### Zadanie ${t.id}: ${t.title}\n\n`;
        md += `- **Cel ćwiczenia:** ${t.goal}\n`;
        md += `- **Status w kursie:** ${st === 'passed' ? 'Wykonane poprawnie ✓' : 'W toku ⏳'}\n`;
        md += `- **Wartość punktowa:** ${pts} pkt\n\n`;
        md += `#### Moja prywatna notatka:\n\n`;
        md += `> ${item.text.replace(/\n/g, '\n> ')}\n\n`;
      });

      if (dayNote && dayNote.trim()) {
        md += `### Notatka ogólna do Dnia ${d}:\n\n`;
        md += `> ${dayNote.trim().replace(/\n/g, '\n> ')}\n\n`;
      }

      md += `---\n\n`;
    }
  }

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Vibe_Coding_Moje_Notatki_${new Date().toISOString().split('T')[0]}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  playSuccessChime();
  announceSR("Pobrano notatki w formacie Markdown.");
}

function downloadNotesHtml() {
  const notesCount = updateGlobalNotesCounter();
  if (notesCount === 0) {
    alert("Nie masz jeszcze żadnych notatek do pobrania. Wpisz swoje uwagi w zadaniach kursu!");
    return;
  }

  const learner = escapeHtmlText(STATE.learnerName || "Adept Vibe Codingu");
  const dateStr = new Date().toLocaleDateString('pl-PL') + ' ' + new Date().toLocaleTimeString('pl-PL');

  let bodyContent = `
    <header class="doc-header">
      <span class="badge">Akademia Vibe Codingu • Czyste Notatki</span>
      <h1>Kompendium Zrobionych Notatek Kursanta</h1>
      <div class="meta">
        <p><strong>Autor:</strong> ${learner}</p>
        <p><strong>Data wygenerowania:</strong> ${dateStr}</p>
        <p><strong>Liczba notatek:</strong> ${notesCount}</p>
      </div>
    </header>
  `;

  for (let d = 1; d <= 34; d++) {
    const stage = getStageForDay(d);
    const dayTasks = TASKS_DATA.filter(t => t.day === d);
    const dayNotesList = [];

    dayTasks.forEach(task => {
      const n = (STATE.taskNotes && STATE.taskNotes[task.id]) || localStorage.getItem(`vibe_coding_task_notes_${task.id}`) || '';
      if (n && n.trim()) {
        dayNotesList.push({ task, text: n.trim() });
      }
    });

    const dayNote = localStorage.getItem(`vibe_coding_notes_day_${d}`) || '';

    if (dayNotesList.length > 0 || (dayNote && dayNote.trim())) {
      bodyContent += `
        <section class="day-section">
          <h2>Dzień ${d}: ${escapeHtmlText(stage.name)}</h2>
      `;

      dayNotesList.forEach(item => {
        const t = item.task;
        const st = getTaskStatus(t.id);
        const pts = getTaskPoints(t);
        const isDone = (st === 'passed');
        bodyContent += `
          <article class="task-note-card">
            <div class="task-header">
              <h3>Zadanie ${t.id}: ${escapeHtmlText(t.title)}</h3>
              <span class="status-badge ${isDone ? 'status-done' : 'status-pending'}">
                ${isDone ? 'Wykonane poprawnie (+ ' + pts + ' pkt)' : 'W toku (' + pts + ' pkt)'}
              </span>
            </div>
            <p class="goal-text"><strong>Cel:</strong> ${escapeHtmlText(t.goal)}</p>
            <div class="note-box">
              <strong>Twoja notatka i wnioski:</strong>
              <blockquote>${escapeHtmlText(item.text).replace(/\n/g, '<br>')}</blockquote>
            </div>
          </article>
        `;
      });

      if (dayNote && dayNote.trim()) {
        bodyContent += `
          <article class="task-note-card day-note-card">
            <h3>Notatka ogólna do Dnia ${d}</h3>
            <blockquote>${escapeHtmlText(dayNote.trim()).replace(/\n/g, '<br>')}</blockquote>
          </article>
        `;
      }

      bodyContent += `</section>`;
    }
  }

  const fullHtml = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notatki z Kursu Vibe Codingu - ${learner}</title>
  <style>
    /* WCAG 2.1 / 2.2 Poziom AA - Dostępność i Czytelność */
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text: #f8fafc;
      --text-muted: #cbd5e1;
      --accent: #818cf8;
      --border: #334155;
      --emerald: #10b981;
      --amber: #f59e0b;
    }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      background-color: var(--bg);
      color: var(--text);
      max-width: 860px;
      margin: 0 auto;
      padding: 2rem 1.25rem;
    }
    .doc-header {
      border-bottom: 2px solid var(--border);
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    h1 { font-size: 1.85rem; color: #ffffff; margin: 0.5rem 0; }
    h2 { font-size: 1.4rem; color: var(--accent); border-bottom: 1px solid var(--border); padding-bottom: 0.4rem; margin-top: 2rem; }
    h3 { font-size: 1.15rem; color: #ffffff; margin: 0 0 0.4rem 0; }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: bold;
      background: rgba(129, 140, 248, 0.2);
      color: var(--accent);
      border: 1px solid rgba(129, 140, 248, 0.4);
    }
    .meta { font-size: 0.9rem; color: var(--text-muted); margin-top: 0.75rem; }
    .meta p { margin: 0.2rem 0; }
    .day-section { margin-bottom: 2.5rem; }
    .task-note-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.25rem;
      margin-top: 1rem;
    }
    .task-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .status-badge {
      font-size: 0.75rem;
      font-weight: bold;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
    }
    .status-done { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
    .status-pending { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
    .goal-text { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem; }
    .note-box strong { font-size: 0.85rem; color: #c084fc; display: block; margin-bottom: 0.25rem; }
    blockquote {
      background: #090d16;
      border-left: 4px solid #a855f7;
      padding: 0.75rem 1rem;
      margin: 0;
      border-radius: 0 12px 12px 0;
      color: #e2e8f0;
      font-size: 0.9rem;
    }
    @media print {
      body { background: #fff !important; color: #000 !important; }
      .task-note-card { border: 1px solid #000 !important; background: #fff !important; color: #000 !important; page-break-inside: avoid; }
      blockquote { background: #f1f5f9 !important; color: #000 !important; border-left-color: #000 !important; }
      h1, h2, h3 { color: #000 !important; }
    }
  </style>
</head>
<body>
  <main>
    ${bodyContent}
  </main>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Vibe_Coding_Moje_Notatki_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  playSuccessChime();
  announceSR("Pobrano notatki jako stronę internetową HTML.");
}

function copyAllNotesToClipboard() {
  const notesCount = updateGlobalNotesCounter();
  if (notesCount === 0) {
    alert("Nie masz jeszcze żadnych notatek do skopiowania.");
    return;
  }
  let text = `AKADEMIA VIBE CODINGU - MOJE NOTATKI\nAutor: ${STATE.learnerName || 'Adept'}\nLiczba notatek: ${notesCount}\n\n`;
  for (let d = 1; d <= 34; d++) {
    const dayTasks = TASKS_DATA.filter(t => t.day === d);
    dayTasks.forEach(t => {
      const n = (STATE.taskNotes && STATE.taskNotes[t.id]) || localStorage.getItem(`vibe_coding_task_notes_${t.id}`);
      if (n && n.trim()) {
        text += `[Dzień ${d} • Zadanie ${t.id}: ${t.title}]\n${n.trim()}\n\n`;
      }
    });
    const dn = localStorage.getItem(`vibe_coding_notes_day_${d}`);
    if (dn && dn.trim()) {
      text += `[Dzień ${d} - Notatka ogólna]\n${dn.trim()}\n\n`;
    }
  }

  const done = () => {
    playClickSound();
    alert("✓ Wszystkie notatki zostały skopiowane do schowka!");
    announceSR("Wszystkie notatki skopiowane do schowka.");
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

// =========================================================================
// MODUŁ: SYSTEM UWAG I SUGESTII DLA TWÓRCY KOMPENDIUM (PODSTRONA 9 & EKSPORT)
// =========================================================================

function openAuthorFeedbackPage() {
  if (STATE.activeSubpage !== 'page-feedback') {
    STATE.previousSubpage = STATE.activeSubpage || 'page-daily-tasks';
  }
  switchSubpage('page-feedback');
  renderAuthorFeedbackList();
  updateAuthorFeedbackCounter();
  playClickSound();
  announceSR("Otwarto podstronę uwag i sugestii dla twórcy kompendium.");
}

function closeAuthorFeedbackPage() {
  const targetPage = STATE.previousSubpage || 'page-daily-tasks';
  switchSubpage(targetPage);
  playClickSound();
  announceSR("Powrót do kursu.");
}

function getFeedbackCategoryInfo(cat) {
  switch (cat) {
    case 'improvement':
      return { label: 'Pomysł na ulepszenie', icon: '💡', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    case 'bug':
      return { label: 'Zgłoszenie usterki / błędu', icon: '🐛', badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
    case 'task_feedback':
      return { label: 'Uwaga do zadania', icon: '📝', badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
    case 'compliment':
      return { label: 'Pochwała / wrażenia', icon: '🌟', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    case 'other':
    default:
      return { label: 'Inne spostrzeżenie', icon: '💬', badgeClass: 'bg-slate-700/50 text-slate-300 border-slate-600' };
  }
}

function handleAddAuthorFeedback(event) {
  if (event) event.preventDefault();
  const catEl = document.getElementById('feedback-category-select');
  const refEl = document.getElementById('feedback-reference-input');
  const textEl = document.getElementById('feedback-text-input');
  const statusEl = document.getElementById('feedback-form-status');

  if (!textEl || !textEl.value.trim()) {
    alert("Proszę wpisać treść swojej uwagi lub sugestii przed zapisaniem.");
    return;
  }

  const newFeedback = {
    id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    date: new Date().toISOString(),
    category: catEl ? catEl.value : 'improvement',
    reference: refEl ? refEl.value.trim() : '',
    text: textEl.value.trim()
  };

  if (!Array.isArray(STATE.authorFeedbacks)) {
    STATE.authorFeedbacks = [];
  }
  STATE.authorFeedbacks.unshift(newFeedback);
  saveState();

  textEl.value = '';
  if (refEl) refEl.value = '';

  if (statusEl) {
    statusEl.textContent = "Zapisano Twoją uwagę pomyślnie! ✓";
    setTimeout(() => { if (statusEl) statusEl.textContent = ""; }, 3500);
  }

  playSuccessChime();
  updateAuthorFeedbackCounter();
  renderAuthorFeedbackList();
  announceSR("Twoja uwaga dla autora została zapisana na liście.");
}

function renderAuthorFeedbackList(query = '') {
  const container = document.getElementById('author-feedback-list');
  const countLabel = document.getElementById('feedback-count-label');
  if (!container) return;

  const feedbacks = Array.isArray(STATE.authorFeedbacks) ? STATE.authorFeedbacks : [];
  if (countLabel) countLabel.textContent = feedbacks.length.toString();

  const q = (query || '').toLowerCase().trim();
  const filtered = feedbacks.filter(fb => {
    if (!q) return true;
    const catInfo = getFeedbackCategoryInfo(fb.category);
    return (fb.text && fb.text.toLowerCase().includes(q)) ||
           (fb.reference && fb.reference.toLowerCase().includes(q)) ||
           (catInfo.label.toLowerCase().includes(q));
  });

  if (filtered.length === 0) {
    if (feedbacks.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
          <span class="text-3xl block mb-2" role="img" aria-label="(pusty notes)">📝</span>
          <strong class="text-slate-300 block mb-1">Brak zapisanych uwag dla autora</strong>
          <span>Wpisz swoją pierwszą sugestię, zgłoś usterkę lub pomysł w powyższym formularzu!</span>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="p-6 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
          Brak uwag pasujących do szukanej frazy "${escapeHtmlText(query)}".
        </div>
      `;
    }
    return;
  }

  container.innerHTML = filtered.map((fb, idx) => {
    const catInfo = getFeedbackCategoryInfo(fb.category);
    const dateFormatted = new Date(fb.date).toLocaleString('pl-PL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    return `
      <article class="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 transition shadow-sm" aria-labelledby="fb-heading-${fb.id}">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold border ${catInfo.badgeClass} flex items-center gap-1">
              <span>${catInfo.icon}</span>
              <span>${catInfo.label}</span>
            </span>
            ${fb.reference ? `
              <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-700/50">
                ${escapeHtmlText(fb.reference)}
              </span>
            ` : ''}
          </div>
          <div class="flex items-center gap-3">
            <time datetime="${fb.date}" class="text-[11px] text-slate-400">${dateFormatted}</time>
            <button type="button" onclick="deleteAuthorFeedback('${fb.id}')" class="text-xs text-slate-500 hover:text-rose-400 transition font-bold cursor-pointer" title="Usuń tę uwagę">
              <span class="sr-only">Usuń uwagę z dnia ${dateFormatted}</span>
              <span role="img" aria-label="(usuń)">🗑️</span>
            </button>
          </div>
        </div>

        <div class="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap select-all font-sans">
          ${escapeHtmlText(fb.text)}
        </div>
      </article>
    `;
  }).join('');
}

function deleteAuthorFeedback(feedbackId) {
  if (!confirm("Czy na pewno chcesz usunąć tę uwagę dla autora?")) return;
  STATE.authorFeedbacks = (STATE.authorFeedbacks || []).filter(fb => fb.id !== feedbackId);
  saveState();
  updateAuthorFeedbackCounter();
  renderAuthorFeedbackList();
  playClickSound();
  announceSR("Usunięto wybraną uwagę.");
}

function clearAllAuthorFeedback() {
  if (!STATE.authorFeedbacks || STATE.authorFeedbacks.length === 0) {
    alert("Lista uwag jest już pusta.");
    return;
  }
  if (!confirm("Czy na pewno chcesz trwale usunąć WSZYSTKIE zapisane uwagi dla twórcy kompendium?")) return;
  STATE.authorFeedbacks = [];
  saveState();
  updateAuthorFeedbackCounter();
  renderAuthorFeedbackList();
  playClickSound();
  announceSR("Wszystkie uwagi dla twórcy zostały usunięte.");
}

function updateAuthorFeedbackCounter() {
  const count = (STATE.authorFeedbacks || []).length;
  const headerCounter = document.getElementById('header-feedback-counter');
  if (headerCounter) headerCounter.textContent = count.toString();
  const focusCounter = document.getElementById('focus-header-feedback-counter');
  if (focusCounter) focusCounter.textContent = count.toString();
  const label = document.getElementById('feedback-count-label');
  if (label) label.textContent = count.toString();
  return count;
}

function downloadAuthorFeedbackMarkdown() {
  const feedbacks = STATE.authorFeedbacks || [];
  if (feedbacks.length === 0) {
    alert("Nie masz jeszcze żadnych wpisanych uwag do pobrania. Wpisz uwagę w formularzu!");
    return;
  }

  let md = `# Uwagi i Sugestie dla Twórcy Kompendium Vibe Codingu\n`;
  md += `*Wygenerowano: ${new Date().toLocaleString('pl-PL')} • Akademia Vibe Codingu v3.8.0*\n`;
  md += `*Kursant / Użytkownik: ${STATE.learnerName || 'Adept'}*\n`;
  md += `*Łączna liczba zgłoszonych uwag: ${feedbacks.length}*\n\n`;
  md += `Prześlij ten plik do autora kompendium jako załącznik e-mail lub skopiuj jego treść do wiadomości.\n\n`;
  md += `---\n\n`;

  feedbacks.forEach((fb, i) => {
    const catInfo = getFeedbackCategoryInfo(fb.category);
    const dateFormatted = new Date(fb.date).toLocaleString('pl-PL');
    md += `## ${i + 1}. [${catInfo.label}] ${fb.reference ? `Dotyczy: ${fb.reference}` : 'Uwaga ogólna'}\n`;
    md += `- **Data zgłoszenia:** ${dateFormatted}\n`;
    md += `- **Kategoria:** ${catInfo.label}\n`;
    if (fb.reference) md += `- **Dotyczy zadania / modułu:** ${fb.reference}\n`;
    md += `- **Treść uwagi:**\n\n`;
    md += `> ${fb.text.replace(/\n/g, '\n> ')}\n\n`;
    md += `---\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Vibe_Coding_Uwagi_Dla_Tworcy_${new Date().toISOString().split('T')[0]}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  playSuccessChime();
  announceSR("Pobrano uwagi dla twórcy jako plik Markdown.");
}

function downloadAuthorFeedbackHtml() {
  const feedbacks = STATE.authorFeedbacks || [];
  if (feedbacks.length === 0) {
    alert("Nie masz jeszcze żadnych wpisanych uwag do pobrania. Wpisz uwagę w formularzu!");
    return;
  }

  let bodyContent = `
    <header class="doc-header">
      <div class="badge">Akademia Vibe Codingu v3.8.0 • Raport Uwag i Sugestii</div>
      <h1>Uwagi i Sugestie dla Twórcy Kompendium</h1>
      <div class="meta">
        <p><strong>Użytkownik / Kursant:</strong> ${escapeHtmlText(STATE.learnerName || 'Adept')}</p>
        <p><strong>Data wygenerowania:</strong> ${new Date().toLocaleString('pl-PL')}</p>
        <p><strong>Liczba zgłoszonych uwag:</strong> ${feedbacks.length}</p>
      </div>
    </header>
  `;

  feedbacks.forEach((fb, i) => {
    const catInfo = getFeedbackCategoryInfo(fb.category);
    const dateFormatted = new Date(fb.date).toLocaleString('pl-PL');
    bodyContent += `
      <article class="feedback-card">
        <div class="feedback-header">
          <div>
            <span class="cat-badge">${catInfo.icon} ${catInfo.label}</span>
            ${fb.reference ? `<span class="ref-badge">Dotyczy: ${escapeHtmlText(fb.reference)}</span>` : ''}
          </div>
          <time datetime="${fb.date}">${dateFormatted}</time>
        </div>
        <h2>${i + 1}. ${escapeHtmlText(fb.reference || catInfo.label)}</h2>
        <blockquote>${escapeHtmlText(fb.text).replace(/\n/g, '<br>')}</blockquote>
      </article>
    `;
  });

  const fullHtml = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Uwagi i Sugestie dla Twórcy - Akademia Vibe Codingu</title>
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --accent: #14b8a6;
      --border: #334155;
    }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      background-color: var(--bg);
      color: var(--text);
      max-width: 860px;
      margin: 0 auto;
      padding: 2rem 1.25rem;
    }
    .doc-header {
      border-bottom: 2px solid var(--border);
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    h1 { font-size: 1.85rem; color: #ffffff; margin: 0.5rem 0; }
    h2 { font-size: 1.25rem; color: var(--accent); margin: 0.75rem 0 0.5rem 0; }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: bold;
      background: rgba(20, 184, 166, 0.2);
      color: var(--accent);
      border: 1px solid rgba(20, 184, 166, 0.4);
    }
    .cat-badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: bold;
      background: rgba(20, 184, 166, 0.2);
      color: #5eead4;
      border: 1px solid rgba(20, 184, 166, 0.4);
    }
    .ref-badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: bold;
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
      border: 1px solid rgba(99, 102, 241, 0.4);
      margin-left: 0.35rem;
    }
    .meta { font-size: 0.9rem; color: var(--text-muted); margin-top: 0.75rem; }
    .meta p { margin: 0.2rem 0; }
    .feedback-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .feedback-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.5rem;
    }
    blockquote {
      background: #0f172a;
      border-left: 4px solid var(--accent);
      margin: 0.75rem 0 0 0;
      padding: 0.85rem 1rem;
      border-radius: 0 12px 12px 0;
      color: #e2e8f0;
      font-size: 0.95rem;
    }
    @media print {
      body { background: #fff !important; color: #000 !important; }
      .feedback-card { background: #fff !important; border-color: #ccc !important; page-break-inside: avoid; }
      blockquote { background: #f8fafc !important; color: #000 !important; border-left-color: #000 !important; }
    }
  </style>
</head>
<body>
  <main>
    ${bodyContent}
  </main>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Vibe_Coding_Uwagi_Dla_Tworcy_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  playSuccessChime();
  announceSR("Pobrano uwagi dla twórcy jako stronę internetową HTML.");
}

function copyAuthorFeedbackToClipboard() {
  const feedbacks = STATE.authorFeedbacks || [];
  if (feedbacks.length === 0) {
    alert("Nie masz jeszcze żadnych wpisanych uwag do skopiowania.");
    return;
  }

  let text = `AKADEMIA VIBE CODINGU - UWAGI DLA TWÓRCY\nUżytkownik: ${STATE.learnerName || 'Adept'}\nLiczba uwag: ${feedbacks.length}\nData: ${new Date().toLocaleString('pl-PL')}\n\n`;
  feedbacks.forEach((fb, i) => {
    const catInfo = getFeedbackCategoryInfo(fb.category);
    text += `[${i + 1}] Kategoria: ${catInfo.label}\n`;
    if (fb.reference) text += `Dotyczy: ${fb.reference}\n`;
    text += `Data: ${new Date(fb.date).toLocaleString('pl-PL')}\n`;
    text += `Treść:\n${fb.text}\n\n----------------------------------------\n\n`;
  });

  const done = () => {
    playClickSound();
    alert("Wszystkie Twoje uwagi zostały skopiowane do schowka! Możesz je wkleić w treści e-maila lub wiadomości do autora.");
    announceSR("Uwagi skopiowano do schowka.");
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

// =========================================================================
// MODUŁ 2: DOLNA NAWIGACJA DNI (PŁYNNE PRZEJŚCIE I PRZEWIJANIE)
// =========================================================================
function nextDayAndScrollTop() {
  if (STATE.currentDay < STATE.totalDays) {
    STATE.currentDay++;
    playClickSound();
    saveState();
    renderTasks();
    const topEl = document.getElementById('daily-tasks-page-title') || document.getElementById('page-daily-tasks');
    if (topEl) {
      topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      topEl.focus({ preventScroll: true });
    }
    announceSR(`Przejście do Dnia ${STATE.currentDay} z ${STATE.totalDays}.`);
  }
}

function prevDayAndScrollTop() {
  if (STATE.currentDay > 1) {
    STATE.currentDay--;
    playClickSound();
    saveState();
    renderTasks();
    const topEl = document.getElementById('daily-tasks-page-title') || document.getElementById('page-daily-tasks');
    if (topEl) {
      topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      topEl.focus({ preventScroll: true });
    }
    announceSR(`Przejście do Dnia ${STATE.currentDay} z ${STATE.totalDays}.`);
  }
}

function focusStudioForTask(taskId) {
  const id = parseInt(taskId, 10);
  selectMainCcofBaseCode('task' + id);

  const studio = document.getElementById('daily-tools-section') || document.getElementById('tool-heading-prompt-helper');
  if (studio) {
    studio.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const heading = document.getElementById('tool-heading-prompt-helper') || document.getElementById('studio-presets-container');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    }
    const presetsBox = document.getElementById('studio-presets-container');
    if (presetsBox) {
      presetsBox.classList.add('ring-2', 'ring-amber-400', 'p-2', 'rounded-2xl');
      setTimeout(() => {
        presetsBox.classList.remove('ring-2', 'ring-amber-400', 'p-2');
      }, 3000);
    }
  }
  announceSR(`Otwarto Studio Eksperymentów dla Zadania ${id}. Zaznacz pola wyboru ulepszeń.`);
}

// =========================================================================
// MODUŁ 3: SKARBNICA PROJEKTÓW Z PIASKOWNICY I EKSPORTER ZIP (CZYSTY JS)
// =========================================================================
function getBuiltinSandboxProjects() {
  const t3 = TASKS_DATA.find(t => t.id === 3);
  const t5 = TASKS_DATA.find(t => t.id === 5);
  const t9 = TASKS_DATA.find(t => t.id === 9);
  const t13 = TASKS_DATA.find(t => t.id === 13);

  return [
    {
      id: 'builtin_kawiarnia',
      title: 'Wizytówka Kawiarni Kofeinowy Raj',
      day: 1,
      taskId: 3,
      date: 'Zadanie 3 (Dzień 1)',
      filename: '01_Kawiarnia_Kofeinowy_Raj.html',
      tags: ['Kawiarnia', 'Starter', 'HTML', 'Tailwind'],
      desc: 'Pierwsza w pełni klikalna strona WWW z ciepłą paletą barw kawy i mleka oraz przyciskiem połączenia.',
      code: (t3 && t3.sampleSolution) ? t3.sampleSolution : '<!DOCTYPE html><html><body><h1>Kawiarnia</h1></body></html>'
    },
    {
      id: 'builtin_cyber_bar',
      title: 'Futurystyczny Cyber Bar 2077',
      day: 2,
      taskId: 5,
      date: 'Zadanie 5 (Dzień 2)',
      filename: '02_Cyber_Bar_2077.html',
      tags: ['Cyberpunk', 'Neon', 'Tokio', 'Animacje'],
      desc: 'Mroczna i neonowa strona klubu w nocnym Tokio z efektowną interakcją aktywacji kofeiny.',
      code: (t5 && t5.sampleSolution) ? t5.sampleSolution : '<!DOCTYPE html><html><body><h1>Cyber Bar</h1></body></html>'
    },
    {
      id: 'builtin_licznik_kaw',
      title: 'Licznik Kliknięć i Kaw (Pierwsza interakcja)',
      day: 3,
      taskId: 9,
      date: 'Zadanie 9 (Dzień 3)',
      filename: '02b_Licznik_Klikniec_Kaw.html',
      tags: ['Interakcja', 'Licznik', 'JavaScript'],
      desc: 'Pierwsza w pełni interaktywna aplikacja reagująca na dotyk i zliczająca kliknięcia.',
      code: (t9 && t9.sampleSolution) ? t9.sampleSolution : '<!DOCTYPE html><html><body><h1>Licznik</h1></body></html>'
    },
    {
      id: 'builtin_generator_komplementow',
      title: 'Generator Komplementów z Deszczem Konfetti',
      day: 5,
      taskId: 13,
      date: 'Zadanie 13 (Dzień 5)',
      filename: '03b_Generator_Komplementow_Konfetti.html',
      tags: ['Efekty', 'CDN', 'Konfetti', 'Generator'],
      desc: 'Wesoła aplikacja losująca miłe słowa z kinowym efektem kolorowego konfetti.',
      code: (t13 && t13.sampleSolution) ? t13.sampleSolution : '<!DOCTYPE html><html><body><h1>Generator Komplementów</h1></body></html>'
    },
    {
      id: 'builtin_kalkulator',
      title: 'Inteligentny Kalkulator z Przyjaznym UI',
      day: 4,
      taskId: 11,
      date: 'Zadanie 11 (Dzień 4)',
      filename: '03_Inteligentny_Kalkulator.html',
      tags: ['Narzędzie', 'Kalkulator', 'JavaScript'],
      desc: 'Wygodny kalkulator osobisty z dużymi przyciskami i czytelnym wyświetlaczem obliczeń.',
      code: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Inteligentny Kalkulator</title>
  <script src="https://cdn.tailwindcss.com"><\\/script>
</head>
<body class="bg-slate-900 text-white min-h-screen flex items-center justify-center p-4 font-sans">
  <div class="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-2xl max-w-xs w-full">
    <div class="flex items-center justify-between mb-3 text-xs text-slate-400 font-bold">
      <span>Vibe Calculator</span>
      <span>⚡ 2026</span>
    </div>
    <div id="calc-display" class="bg-slate-950 p-4 rounded-2xl text-right text-3xl font-mono text-emerald-400 mb-4 border border-slate-800 break-all select-all">0</div>
    <div class="grid grid-cols-4 gap-2 text-sm font-bold">
      <button onclick="calcClear()" class="col-span-2 p-3.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-rose-200 transition">C (Wyczyść)</button>
      <button onclick="calcOp('/')" class="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition">÷</button>
      <button onclick="calcOp('*')" class="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition">×</button>
      <button onclick="calcNum('7')" class="p-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition">7</button>
      <button onclick="calcNum('8')" class="p-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition">8</button>
      <button onclick="calcNum('9')" class="p-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition">9</button>
      <button onclick="calcOp('-')" class="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition">-</button>
      <button onclick="calcNum('4')" class="p-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition">4</button>
      <button onclick="calcNum('5')" class="p-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition">5</button>
      <button onclick="calcNum('6')" class="p-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition">6</button>
      <button onclick="calcOp('+')" class="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition">+</button>
      <button onclick="calcNum('1')" class="p-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition">1</button>
      <button onclick="calcNum('2')" class="p-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition">2</button>
      <button onclick="calcNum('3')" class="p-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition">3</button>
      <button onclick="calcEqual()" class="row-span-2 p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center justify-center text-lg transition">=</button>
      <button onclick="calcNum('0')" class="col-span-2 p-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition">0</button>
      <button onclick="calcNum('.')" class="p-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition">,</button>
    </div>
  </div>
  <script>
    let cur = '0';
    function updateD() { document.getElementById('calc-display').innerText = cur; }
    function calcNum(n) { if (cur === '0' && n !== '.') cur = n; else cur += n; updateD(); }
    function calcOp(op) { cur += ' ' + op + ' '; updateD(); }
    function calcClear() { cur = '0'; updateD(); }
    function calcEqual() {
      try {
        cur = String(eval(cur.replace(/×/g, '*').replace(/÷/g, '/')));
      } catch(e) { cur = 'Błąd'; }
      updateD();
    }
  <\\/script>
</body>
</html>`
    },
    {
      id: 'builtin_quiz',
      title: 'Interaktywny Quiz Wiedzy z Wynikiem i Dźwiękiem',
      day: 7,
      taskId: 20,
      date: 'Zadanie 20 (Dzień 7)',
      filename: '04_Quiz_Wiedzy_Interaktywny.html',
      tags: ['Grywalizacja', 'Quiz', 'Web Audio'],
      desc: 'Angażujący test sprawdzający wiedzę z natychmiastowym feedbackiem i syntezą tonów audio.',
      code: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Quiz Vibe Codingu</title>
  <script src="https://cdn.tailwindcss.com"><\\/script>
</head>
<body class="bg-slate-950 text-white min-h-screen flex items-center justify-center p-4 font-sans">
  <div class="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center">
    <span class="text-4xl block mb-2">⚡</span>
    <h1 class="text-2xl font-black text-amber-400 mb-2">Quiz Twórcy AI</h1>
    <p class="text-xs text-slate-400 mb-6">Pytanie 1 z 3: Co to jest Vibe Coding?</p>
    <div class="space-y-3 text-left">
      <button onclick="answer(false)" class="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition">A. Ręczne pisanie miliona linii kodu w asemblerze</button>
      <button onclick="answer(true)" class="w-full p-4 rounded-2xl bg-slate-800 hover:bg-emerald-950/80 hover:border-emerald-500 text-xs font-semibold border border-slate-700 transition">B. Reżyserowanie AI po polsku i natychmiastowe tworzenie działających aplikacji</button>
      <button onclick="answer(false)" class="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition">C. Granie w gry bez używania klawiatury</button>
    </div>
    <div id="quiz-res" class="mt-4 p-3 rounded-xl hidden font-bold text-xs"></div>
  </div>
  <script>
    function answer(ok) {
      const res = document.getElementById('quiz-res');
      res.classList.remove('hidden');
      if (ok) {
        res.className = "mt-4 p-3.5 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 font-bold text-xs";
        res.innerText = "✓ Prawidłowa odpowiedź! W Vibe Codingu rządzisz Ty, a AI pisze kod.";
      } else {
        res.className = "mt-4 p-3.5 rounded-xl bg-rose-950 border border-rose-500 text-rose-200 font-bold text-xs";
        res.innerText = "❌ Nie do końca! Poprawna odpowiedź to B: reżyserowanie sztucznej inteligencji.";
      }
    }
  <\\/script>
</body>
</html>`
    },
    {
      id: 'builtin_notes_app',
      title: 'Cyfrowy Notatnik z Pamięcią w Przeglądarce',
      day: 10,
      taskId: 29,
      date: 'Zadanie 29 (Dzień 10)',
      filename: '05_Cyfrowy_Notatnik_LocalStorage.html',
      tags: ['Produktywność', 'localStorage', 'Notatki'],
      desc: 'Aplikacja do gromadzenia pomysłów, która zachowuje dane po wyłączeniu komputera.',
      code: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Domowy Notes Cyfrowy</title>
  <script src="https://cdn.tailwindcss.com"><\\/script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen p-6 font-sans">
  <div class="max-w-lg mx-auto bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-black text-amber-400">📝 Mój Szybki Notatnik</h1>
      <span class="text-xs text-emerald-400 font-bold">Zapis w przeglądarce</span>
    </div>
    <div class="flex gap-2 mb-4">
      <input type="text" id="note-in" placeholder="Wpisz nowe zadanie lub pomysł..." class="flex-grow p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none">
      <button onclick="addNote()" class="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition">Dodaj</button>
    </div>
    <ul id="note-list" class="space-y-2"></ul>
  </div>
  <script>
    let notes = JSON.parse(localStorage.getItem('my_vibe_notes') || '["Wypić pyszną kawę","Przetestować prompt w Gemini"]');
    function render() {
      const ul = document.getElementById('note-list');
      ul.innerHTML = notes.map((n, i) => \`
        <li class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span>\${n}</span>
          <button onclick="delNote(\${i})" class="text-rose-400 hover:text-rose-300 font-bold text-sm">✕</button>
        </li>
      \`).join('');
      localStorage.setItem('my_vibe_notes', JSON.stringify(notes));
    }
    function addNote() {
      const inp = document.getElementById('note-in');
      if (!inp.value.trim()) return;
      notes.unshift(inp.value.trim());
      inp.value = '';
      render();
    }
    function delNote(i) {
      notes.splice(i, 1);
      render();
    }
    render();
  <\\/script>
</body>
</html>`
    },
    {
      id: 'builtin_shop_cart',
      title: 'Luksusowa Strona Produktowa z Koszykiem',
      day: 15,
      taskId: 44,
      date: 'Zadanie 44 (Dzień 15)',
      filename: '06_Sklep_Luksus_Z_Koszykiem.html',
      tags: ['E-Commerce', 'Złoto i Czerń', 'Koszyk'],
      desc: 'Ekskluzywna prezentacja produktu z koszykiem zakupowym, kalkulacją sumy i ciemno-złotym designem.',
      code: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Luksusowa Kolekcja Zegarków</title>
  <script src="https://cdn.tailwindcss.com"><\\/script>
</head>
<body class="bg-black text-slate-100 min-h-screen p-6 font-sans">
  <div class="max-w-2xl mx-auto bg-slate-950 border border-amber-500/40 p-8 rounded-3xl shadow-2xl">
    <div class="text-center mb-6">
      <span class="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-1">Edycja Limitowana 2026</span>
      <h1 class="text-3xl font-black text-white">Chronograf Royal Gold</h1>
      <p class="text-sm text-slate-400 mt-2">Szafirowe szkło, automatyczny mechanizm i złote akcenty.</p>
    </div>
    <div class="p-6 rounded-2xl bg-black border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <div>
        <span class="text-2xl font-black text-amber-400">1 890 PLN</span>
        <span class="text-xs text-slate-500 block">Darmowa dostawa kurierem w 24h</span>
      </div>
      <button onclick="addToCart()" class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm transition shadow-lg">
        Dodaj do Koszyka (Kup teraz)
      </button>
    </div>
    <div id="cart-status" class="hidden p-4 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-bold text-center">
      ✓ Dodano do koszyka! W Twoim koszyku znajduje się: <span id="cart-count">1</span> szt.
    </div>
  </div>
  <script>
    let c = 0;
    function addToCart() {
      c++;
      document.getElementById('cart-status').classList.remove('hidden');
      document.getElementById('cart-count').innerText = c;
    }
  <\\/script>
</body>
</html>`
    },
    {
      id: 'builtin_dashboard',
      title: 'Nowoczesny Dashboard Analityczny z Kartami KPI',
      day: 20,
      taskId: 59,
      date: 'Zadanie 59 (Dzień 20)',
      filename: '07_Dashboard_Analityczny.html',
      tags: ['Biznes', 'Dashboard', 'KPI', 'Statystyki'],
      desc: 'Przejrzysty panel menedżerski z kluczowymi wskaźnikami, statystykami i listą ostatnich transakcji.',
      code: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Panel Biznesowy KPI</title>
  <script src="https://cdn.tailwindcss.com"><\\/script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-6 font-sans">
  <div class="max-w-4xl mx-auto space-y-6">
    <header class="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl">
      <h1 class="text-xl font-bold text-white">📊 Raport Operacyjny</h1>
      <span class="text-xs text-emerald-400 font-bold bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">System Aktywny</span>
    </header>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <span class="text-xs text-slate-400 block mb-1">Przychód Dnia</span>
        <strong class="text-2xl font-black text-emerald-400">14 250 PLN</strong>
        <span class="text-[11px] text-emerald-300 block mt-1">↑ +18% vs wczoraj</span>
      </div>
      <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <span class="text-xs text-slate-400 block mb-1">Liczba Zamówień</span>
        <strong class="text-2xl font-black text-amber-400">142</strong>
        <span class="text-[11px] text-amber-300 block mt-1">Średnia: 100 PLN / koszyk</span>
      </div>
      <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <span class="text-xs text-slate-400 block mb-1">Zadowolenie Klientów</span>
        <strong class="text-2xl font-black text-sky-400">99.2%</strong>
        <span class="text-[11px] text-sky-300 block mt-1">⭐ 4.95 / 5.0 (214 ocen)</span>
      </div>
    </div>
  </div>
</body>
</html>`
    },
    {
      id: 'builtin_master_project',
      title: 'Wielki Egzamin Mistrzowski Twórcy Vibe Codingu',
      day: 34,
      taskId: 100,
      date: 'Zadanie 100 (Dzień 34)',
      filename: '08_Projekt_Mistrzowski_Final.html',
      tags: ['Dyplom', 'Mistrz AI', 'Portfolio'],
      desc: 'Ukończony projekt finałowy: wizytówka sukcesu i świadectwo opanowania sztuki tworzenia z AI.',
      code: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Mistrz Vibe Codingu - Portfolio 2026</title>
  <script src="https://cdn.tailwindcss.com"><\\/script>
</head>
<body class="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white min-h-screen flex items-center justify-center p-6 font-sans">
  <div class="max-w-lg w-full bg-slate-900/90 border-2 border-amber-400 p-8 rounded-3xl text-center shadow-2xl">
    <span class="text-5xl block mb-3">🎓</span>
    <span class="text-xs uppercase tracking-widest text-amber-400 font-extrabold block mb-1">Oficjalny Tytuł Twórcy Nowej Ery</span>
    <h1 class="text-2xl sm:text-3xl font-black text-white mb-3">Certyfikowany Mistrz Vibe Codingu</h1>
    <p class="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
      Ukończono 100 praktycznych wdrożeń! Potrafię budować, testować i publikować oprogramowanie za pomocą sztucznej inteligencji.
    </p>
    <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-300 space-y-1 mb-6">
      <p>✓ Architektura zapytań C-C-O-F</p>
      <p>✓ Tworzenie stron w HTML, CSS i JavaScript</p>
      <p>✓ Bezpieczna publikacja w sieci bez kompilacji</p>
    </div>
    <button onclick="alert('Gratulacje! Twój kod działa w 100% poprawnie.')" class="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg">
      Uruchom Pokaz Możliwości
    </button>
  </div>
</body>
</html>`
    }
  ];
}

function getAllSandboxProjects() {
  const builtin = getBuiltinSandboxProjects();
  const user = Array.isArray(STATE.sandboxCreations) ? STATE.sandboxCreations : [];
  return [...user, ...builtin];
}

function saveCurrentSandboxToArchive(day) {
  const code = (document.getElementById('main-sandbox-code-input') || {}).value || '';
  if (!code.trim()) {
    alert("Wklej najpierw kod do pola piaskownicy, aby zapisać go w Skarbnicy!");
    return;
  }
  const title = prompt("Podaj nazwę dla Twojego projektu:", `Mój Projekt z Dnia ${day || STATE.currentDay}`);
  if (!title || !title.trim()) return;

  const creation = {
    id: 'user_proj_' + Date.now(),
    title: title.trim(),
    day: day || STATE.currentDay,
    taskId: null,
    filename: `Wlasny_Projekt_${title.trim().replace(/[^a-zA-Z0-9_\-]/g, '_')}.html`,
    date: new Date().toLocaleDateString('pl-PL') + ' ' + new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
    desc: 'Własna aplikacja stworzona i przetestowana w piaskownicy.',
    code: code.trim(),
    tags: ['Moja aplikacja', 'Własny kod']
  };

  if (!Array.isArray(STATE.sandboxCreations)) STATE.sandboxCreations = [];
  STATE.sandboxCreations.unshift(creation);
  localStorage.setItem('vibe_coding_sandbox_creations', JSON.stringify(STATE.sandboxCreations));
  saveState();
  playSuccessChime();
  celebrateWithConfetti();
  renderSandboxArchiveGrid();
  announceSR(`Zapisano projekt "${creation.title}" w Skarbnicy.`);
  alert(`✓ Projekt "${creation.title}" został pomyślnie zapisany w Twojej Skarbnicy! Możesz go w każdej chwili przetestować i pobrać na Podstronie 8 (Nagrody i Dyplom).`);
}

function renderSandboxArchiveGrid(filterQuery = '') {
  const grid = document.getElementById('sandbox-archive-grid');
  if (!grid) return;

  const allProjects = getAllSandboxProjects();
  const query = (filterQuery || '').toLowerCase().trim();

  const filtered = allProjects.filter(p => {
    if (!query) return true;
    return p.title.toLowerCase().includes(query) ||
      (p.desc && p.desc.toLowerCase().includes(query)) ||
      (p.tags && p.tags.some(tg => tg.toLowerCase().includes(query))) ||
      `dzień ${p.day}`.includes(query);
  });

  const countBadge = document.getElementById('archive-count-badge');
  if (countBadge) {
    countBadge.textContent = `${allProjects.length} projektów w skarbnicy`;
  }
  const filteredCount = document.getElementById('archive-filtered-count');
  if (filteredCount) {
    filteredCount.textContent = query ? `Wyniki: ${filtered.length} z ${allProjects.length}` : '';
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full p-8 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
        <span class="text-3xl block mb-2" role="img" aria-label="(brak wyników)">🔍</span>
        <p class="text-sm font-bold text-slate-200">Brak projektów pasujących do "${escapeHtmlText(query)}"</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(proj => {
    return `
      <article class="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition flex flex-col justify-between shadow-lg group">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Dzień ${proj.day || '?'}
            </span>
            <span class="text-[10px] text-slate-400 font-medium">${proj.date}</span>
          </div>
          <h3 class="text-sm font-bold text-white mb-1 group-hover:text-emerald-300 transition">
            ${escapeHtmlText(proj.title)}
          </h3>
          <p class="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
            ${escapeHtmlText(proj.desc || 'Gotowa aplikacja webowa stworzona z AI.')}
          </p>
          <div class="flex flex-wrap gap-1.5 mb-4">
            ${(proj.tags || []).map(tg => `
              <span class="px-2 py-0.5 rounded-md text-[10px] bg-slate-900 text-slate-400 border border-slate-800">
                ${escapeHtmlText(tg)}
              </span>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
          <button type="button" onclick="openSandboxPreviewModal('${proj.id}')" class="touch-target px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1 shadow cursor-pointer">
            <span role="img" aria-label="(podgląd)">👁️</span>
            <span>Uruchom</span>
          </button>
          <button type="button" onclick="downloadSingleSandboxProject('${proj.id}')" class="touch-target px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer">
            <span role="img" aria-label="(pobierz)">💾</span>
            <span>Pobierz</span>
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function filterSandboxArchive(query) {
  renderSandboxArchiveGrid(query);
}

function openSandboxPreviewModal(projectId) {
  const allProjects = getAllSandboxProjects();
  const proj = allProjects.find(p => p.id === projectId);
  if (!proj) return;

  const modal = document.getElementById('modal-sandbox-preview');
  const titleEl = document.getElementById('sandbox-preview-title');
  const badgeEl = document.getElementById('sandbox-preview-badge');
  const frame = document.getElementById('sandbox-preview-frame');
  const btnDownload = document.getElementById('btn-preview-download-file');
  const btnCopy = document.getElementById('btn-preview-copy-code');

  if (titleEl) titleEl.textContent = proj.title;
  if (badgeEl) badgeEl.textContent = `Podgląd na żywo • Dzień ${proj.day || 1}`;
  if (frame) frame.srcdoc = proj.code;

  if (btnDownload) {
    btnDownload.onclick = () => downloadSingleSandboxProject(proj.id);
  }
  if (btnCopy) {
    btnCopy.onclick = () => {
      const done = () => {
        playClickSound();
        alert("✓ Kod projektu skopiowany do schowka!");
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(proj.code).then(done).catch(() => fallbackCopy(proj.code, done));
      } else {
        fallbackCopy(proj.code, done);
      }
    };
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.removeAttribute('aria-hidden');
  }
  playClickSound();
  announceSR(`Uruchomiono podgląd projektu: ${proj.title}.`);
}

function closeSandboxPreviewModal() {
  const modal = document.getElementById('modal-sandbox-preview');
  const frame = document.getElementById('sandbox-preview-frame');
  if (frame) frame.srcdoc = '';
  if (modal) {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }
  announceSR("Zamknięto podgląd projektu.");
}

function downloadSingleSandboxProject(projectId) {
  const allProjects = getAllSandboxProjects();
  const proj = allProjects.find(p => p.id === projectId);
  if (!proj) return;

  const fname = proj.filename || `${proj.title.replace(/[^a-zA-Z0-9_\-]/g, '_')}.html`;
  const blob = new Blob([proj.code], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fname;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  playClickSound();
  announceSR(`Pobrano plik ${fname}.`);
}

// =========================================================================
// STANDARDOWY SILNIK ZIP W CZYSTYM JS (ZERO ZEWNĘTRZNYCH BIBLIOTEK)
// =========================================================================
function createZipBlob(files) {
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    crcTable[i] = c;
  }
  function calcCrc32(bytes) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  const utf8Encoder = new TextEncoder();
  const fileEntries = [];
  let offset = 0;

  files.forEach(f => {
    const nameBytes = utf8Encoder.encode(f.name);
    const dataBytes = typeof f.content === 'string' ? utf8Encoder.encode(f.content) : f.content;
    const crc = calcCrc32(dataBytes);
    const size = dataBytes.length;

    const header = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0x0800, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, size, true);
    view.setUint32(22, size, true);
    view.setUint16(26, nameBytes.length, true);
    view.setUint16(28, 0, true);
    header.set(nameBytes, 30);

    fileEntries.push({
      header,
      dataBytes,
      nameBytes,
      offset,
      crc,
      size
    });

    offset += header.length + dataBytes.length;
  });

  const centralDirParts = [];
  let centralDirSize = 0;

  fileEntries.forEach(entry => {
    const cdHeader = new Uint8Array(46 + entry.nameBytes.length);
    const view = new DataView(cdHeader.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(8, 0x0800, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint16(14, 0, true);
    view.setUint32(16, entry.crc, true);
    view.setUint32(20, entry.size, true);
    view.setUint32(24, entry.size, true);
    view.setUint16(28, entry.nameBytes.length, true);
    view.setUint16(30, 0, true);
    view.setUint16(32, 0, true);
    view.setUint16(34, 0, true);
    view.setUint16(36, 0, true);
    view.setUint32(38, 0, true);
    view.setUint32(42, entry.offset, true);
    cdHeader.set(entry.nameBytes, 46);

    centralDirParts.push(cdHeader);
    centralDirSize += cdHeader.length;
  });

  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(4, 0, true);
  eocdView.setUint16(6, 0, true);
  eocdView.setUint16(8, fileEntries.length, true);
  eocdView.setUint16(10, fileEntries.length, true);
  eocdView.setUint32(12, centralDirSize, true);
  eocdView.setUint32(16, offset, true);
  eocdView.setUint16(20, 0, true);

  const blobParts = [];
  fileEntries.forEach(entry => {
    blobParts.push(entry.header);
    blobParts.push(entry.dataBytes);
  });
  centralDirParts.forEach(cd => {
    blobParts.push(cd);
  });
  blobParts.push(eocd);

  return new Blob(blobParts, { type: 'application/zip' });
}

function downloadAllSandboxProjectsZip() {
  const allProjects = getAllSandboxProjects();
  if (allProjects.length === 0) {
    alert("Brak projektów do spakowania.");
    return;
  }

  const files = [];

  allProjects.forEach((proj, idx) => {
    const safeName = (proj.filename || `${String(idx + 1).padStart(2, '0')}_${proj.title.replace(/[^a-zA-Z0-9_\-]/g, '_')}.html`);
    files.push({
      name: safeName,
      content: proj.code
    });
  });

  // Dodaj plik INSTRUKCJA_FOLDERU.txt
  const readmeText = `========================================================================
AKADEMIA VIBE CODINGU I SZTUKI PROMPTINGU - TWOJE PROJEKTY
========================================================================
Gratulacje! W tym folderze znajdują się wszystkie strony i aplikacje
stworzone przez Ciebie podczas kursu Vibe Codingu.

JAK KORZYSTAĆ Z TYCH PLIKÓW:
1. Podwójne kliknięcie:
   Każdy plik z rozszerzeniem .html otwiera się natychmiast w dowolnej
   przeglądarce internetowej (Google Chrome, Microsoft Edge, Mozilla Firefox,
   Apple Safari).
   Nie musisz mieć połączenia z internetem ani instalować żadnych serwerów!

2. Spis treści:
   Otwórz plik "SPIS_PROJEKTOW.html" - to interaktywny katalog, który
   pozwala wygodnie przeskakiwać między wszystkimi Twoimi dziełami.

3. Publikacja w internecie:
   Jeśli chcesz pokazać swoje strony znajomym lub klientom w sieci:
   - Wejdź na darmową stronę https://app.netlify.com/drop
   - Przeciągnij ten rozpakowany folder myszką
   - Twoja strona będzie dostępna pod adresem WWW w kilka sekund!

Życzymy wspaniałych dalszych sukcesów w tworzeniu z AI!
Antigravity Sensei & Vibe Coding Academy
========================================================================`;

  files.push({
    name: 'INSTRUKCJA_FOLDERU.txt',
    content: readmeText
  });

  // Dodaj interaktywny plik SPIS_PROJEKTOW.html
  const indexHtml = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Katalog Twoich Projektów Vibe Codingu</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem 1rem; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #f59e0b; margin-bottom: 0.5rem; }
    p { color: #cbd5e1; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
    .card { background: #1e293b; border: 1px solid #334155; padding: 1.25rem; border-radius: 16px; text-decoration: none; color: inherit; transition: transform 0.2s, border-color 0.2s; display: flex; flex-direction: column; justify-content: space-between; }
    .card:hover { transform: translateY(-3px); border-color: #10b981; }
    .card h3 { margin: 0 0 0.5rem 0; color: #fff; font-size: 1.1rem; }
    .card span { font-size: 0.8rem; color: #34d399; font-weight: bold; margin-top: 0.5rem; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 9999px; background: rgba(245,158,11,0.2); color: #fbbf24; font-size: 0.75rem; font-weight: bold; margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <span class="badge">Offline Portal</span>
  <h1>Katalog Twoich Gotowych Aplikacji</h1>
  <p>Kliknij w dowolny projekt poniżej, aby otworzyć go bezpośrednio w przeglądarce:</p>
  <div class="grid">
    ${allProjects.map((p, i) => `
      <a href="${files[i].name}" class="card">
        <div>
          <span class="badge">Dzień ${p.day || 1}</span>
          <h3>${escapeHtmlText(p.title)}</h3>
          <p style="font-size: 0.8rem; color: #94a3b8;">${escapeHtmlText(p.desc || '')}</p>
        </div>
        <span>Otwórz stronę →</span>
      </a>
    `).join('')}
  </div>
</body>
</html>`;

  files.push({
    name: 'SPIS_PROJEKTOW.html',
    content: indexHtml
  });

  const zipBlob = createZipBlob(files);
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Vibe_Coding_Wszystkie_Projekty_${new Date().toISOString().split('T')[0]}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  playVictoryFanfare();
  celebrateWithConfetti();
  announceSR("Pobrano wszystkie projekty jako paczkę ZIP.");
}

function announceSR(message) {
  const el = document.getElementById('sr-announcer');
  if (el) {
    el.textContent = '';
    setTimeout(() => { el.textContent = message; }, 50);
  }
}

function scrollToSection(id) {
  playClickSound();
  if (STATE.inlineFocusMode && id !== 'tasks-main-section') {
    toggleInlineFocusMode(false);
  }
  if (window.innerWidth < 1024) {
    toggleMobileMenu(false);
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// =========================================================================
// MODUŁ INFORMACJI WSTĘPNYCH: BEZPIECZEŃSTWO & KREATOR KONFIGURACJI
// =========================================================================
const ALL_SAFETY_STEPS = [
  'step-google-account',
  'step-safe-sandbox',
  'step-antigravity-ready',
  'step-notebooklm-setup',
  'step-backup-habit',
  'step-security-pledge'
];

function switchSafetyTab(tabKey) {
  playClickSound();
  const tabs = [
    { key: 'rules', btnId: 'tab-btn-safety-rules', panelId: 'tab-panel-safety-rules', label: 'Żelazne Zasady Bezpieczeństwa' },
    { key: 'tools', btnId: 'tab-btn-safety-tools', panelId: 'tab-panel-safety-tools', label: 'Katalog Narzędzi Twórcy' },
    { key: 'wizard', btnId: 'tab-btn-safety-wizard', panelId: 'tab-panel-safety-wizard', label: 'Interaktywny Kreator Konfiguracji' }
  ];

  tabs.forEach(t => {
    const btn = document.getElementById(t.btnId);
    const panel = document.getElementById(t.panelId);
    const isActive = (t.key === tabKey);

    if (btn) {
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive) {
        btn.classList.remove('bg-slate-900', 'text-slate-300', 'hover:text-white', 'hover:bg-slate-800');
        btn.classList.add('bg-emerald-500', 'text-slate-950', 'shadow-md');
      } else {
        btn.classList.remove('bg-emerald-500', 'text-slate-950', 'shadow-md');
        btn.classList.add('bg-slate-900', 'text-slate-300', 'hover:text-white', 'hover:bg-slate-800');
      }
    }

    if (panel) {
      if (isActive) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    }

    if (isActive) {
      announceSR(`Przełączono na zakładkę: ${t.label}.`);
    }
  });
}

function toggleSafetyCheck(stepId) {
  playClickSound();
  if (!Array.isArray(STATE.safetyChecklist)) {
    STATE.safetyChecklist = [];
  }

  const idx = STATE.safetyChecklist.indexOf(stepId);
  const wasCompletedAll = (STATE.safetyChecklist.length === ALL_SAFETY_STEPS.length);

  if (idx > -1) {
    STATE.safetyChecklist.splice(idx, 1);
    announceSR(`Odznaczono krok ${stepId}.`);
  } else {
    STATE.safetyChecklist.push(stepId);
    announceSR(`Zatwierdzono krok ${stepId}.`);
  }

  saveState();
  renderSafetyWizard();

  const isCompletedAllNow = (STATE.safetyChecklist.length === ALL_SAFETY_STEPS.length);
  if (!wasCompletedAll && isCompletedAllNow) {
    playVictoryFanfare();
    celebrateWithConfetti();
    announceSR('Wspaniale! Wszystkie 6 kroków konfiguracji i bezpieczeństwa zostało zatwierdzonych. Twoje cyfrowe biurko jest gotowe!');
  } else {
    playSuccessChime();
  }
}

function renderSafetyWizard() {
  if (!Array.isArray(STATE.safetyChecklist)) {
    STATE.safetyChecklist = [];
  }

  // Odświeżenie zaznaczeń pól checkbox
  ALL_SAFETY_STEPS.forEach((stepId, index) => {
    const chk = document.getElementById(`chk-safety-step-${index + 1}`);
    if (chk) {
      chk.checked = STATE.safetyChecklist.includes(stepId);
    }
  });

  const count = STATE.safetyChecklist.length;
  const total = ALL_SAFETY_STEPS.length;
  const pct = Math.round((count / total) * 100);

  // Etykiety i pasek postępu w kreatorze
  const stepLabel = document.getElementById('safety-wizard-step-label');
  const pctLabel = document.getElementById('safety-wizard-pct');
  const bar = document.getElementById('safety-progressbar');
  const barFill = document.getElementById('safety-progressbar-fill');
  const feedback = document.getElementById('safety-wizard-feedback');
  const compCard = document.getElementById('safety-completion-card');

  if (stepLabel) stepLabel.textContent = `${count} z ${total} kroków zatwierdzonych`;
  if (pctLabel) pctLabel.textContent = `${pct}%`;
  if (bar) bar.setAttribute('aria-valuenow', pct);
  if (barFill) barFill.style.width = `${pct}%`;

  if (feedback) {
    if (count === 0) {
      feedback.innerHTML = '<span role="img" aria-label="(ikona informacji)">ℹ️</span><span>Zaznaczaj powyższe kroki w miarę ich sprawdzania. Postęp zapisuje się automatycznie.</span>';
    } else if (count < total) {
      feedback.innerHTML = `<span role="img" aria-label="(ikona postępu)">⏳</span><span>Dobry start! Zostało jeszcze ${total - count} kroków do pełnej gotowości środowiska.</span>`;
    } else {
      feedback.innerHTML = '<span role="img" aria-label="(zielony ptaszek)">✅</span><strong class="text-emerald-400">Perfekcyjnie! Twoje środowisko jest w 100% bezpieczne i skonfigurowane.</strong>';
    }
  }

  if (compCard) {
    if (count === total) {
      compCard.classList.remove('hidden');
    } else {
      compCard.classList.add('hidden');
    }
  }

  // Pigułka szybkiego statusu w nagłówku sekcji
  const quickPct = document.getElementById('safety-quick-percent');
  const quickStatus = document.getElementById('safety-quick-status');
  const quickIcon = document.getElementById('safety-quick-icon');

  if (quickPct) quickPct.textContent = `${pct}%`;
  if (quickStatus) {
    if (count === 0) {
      quickStatus.textContent = 'Rozpocznij kreator';
    } else if (count < total) {
      quickStatus.textContent = `W trakcie (${count}/${total})`;
    } else {
      quickStatus.textContent = 'W 100% Zabezpieczone!';
    }
  }
  if (quickIcon) {
    quickIcon.textContent = (count === total) ? '🛡️' : (count > 0 ? '⚡' : '⏳');
  }
}

function resetSafetyWizard() {
  playClickSound();
  if (confirm('Czy na pewno chcesz zresetować postęp weryfikacji biurka i bezpieczeństwa?')) {
    STATE.safetyChecklist = [];
    saveState();
    renderSafetyWizard();
    announceSR('Zresetowano listę kontrolną konfiguracji biurka i bezpieczeństwa.');
  }
}

function celebrateSafetyCompletion() {
  playVictoryFanfare();
  celebrateWithConfetti();
  announceSR('Wystrzelono konfetti na cześć bezpiecznego środowiska Vibe Codingu!');
}

// =========================================================================
// TRWAŁOŚĆ STANU (LOCALSTORAGE)
// =========================================================================
function loadSavedState() {
  try {
    const saved = localStorage.getItem('vibe_coding_state_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.taskStatuses && typeof parsed.taskStatuses === 'object') {
        STATE.taskStatuses = parsed.taskStatuses;
        STATE.completedTasks = new Set();
        Object.keys(STATE.taskStatuses).forEach(id => {
          if (STATE.taskStatuses[id] === 'passed') {
            STATE.completedTasks.add(parseInt(id, 10));
          }
        });
      } else if (parsed.completedTasks) {
        STATE.completedTasks = new Set(parsed.completedTasks);
        STATE.taskStatuses = {};
        parsed.completedTasks.forEach(id => {
          STATE.taskStatuses[id] = 'passed';
        });
      }
      if (parsed.diplomaGradeApproved !== undefined) STATE.diplomaGradeApproved = Boolean(parsed.diplomaGradeApproved);
      if (parsed.currentDay) STATE.currentDay = parsed.currentDay;
      if (parsed.viewMode) STATE.viewMode = parsed.viewMode;
      if (parsed.soundEnabled !== undefined) STATE.soundEnabled = parsed.soundEnabled;
      if (parsed.contrastHigh !== undefined) STATE.contrastHigh = parsed.contrastHigh;
      if (parsed.iphoneInvertMode !== undefined) STATE.iphoneInvertMode = parsed.iphoneInvertMode;
      if (parsed.fontSize) STATE.fontSize = parsed.fontSize;
      if (parsed.streakDays) STATE.streakDays = parsed.streakDays;
      if (parsed.lastActiveDate) STATE.lastActiveDate = parsed.lastActiveDate;
      if (parsed.learnerName) STATE.learnerName = parsed.learnerName;
      if (parsed.certId) STATE.certId = parsed.certId;
      if (parsed.currentTheme) STATE.currentTheme = parsed.currentTheme;
      if (parsed.selectedDiplomaStyle) STATE.selectedDiplomaStyle = parsed.selectedDiplomaStyle;
      if (Array.isArray(parsed.safetyChecklist)) STATE.safetyChecklist = parsed.safetyChecklist;
      if (parsed.userProfile) STATE.userProfile = parsed.userProfile;
      if (parsed.activeSubpage) STATE.activeSubpage = parsed.activeSubpage;
      if (parsed.onboardingSteps) STATE.onboardingSteps = Object.assign(STATE.onboardingSteps, parsed.onboardingSteps);
      if (parsed.courseUnlocked !== undefined) STATE.courseUnlocked = parsed.courseUnlocked;
      if (parsed.safetyAccepted !== undefined) STATE.safetyAccepted = parsed.safetyAccepted;
      if (parsed.geminiVerifiedResponse !== undefined) STATE.geminiVerifiedResponse = parsed.geminiVerifiedResponse;
      if (parsed.taskNotes && typeof parsed.taskNotes === 'object') STATE.taskNotes = parsed.taskNotes;
      if (Array.isArray(parsed.sandboxCreations)) STATE.sandboxCreations = parsed.sandboxCreations;

      // Jeśli użytkownik ukończył jakiekolwiek zadanie, cały kurs jest odblokowany
      if (STATE.completedTasks && STATE.completedTasks.size > 0) {
        STATE.courseUnlocked = true;
        STATE.onboardingSteps.welcome = true;
        STATE.onboardingSteps.profile = true;
        STATE.onboardingSteps.diagnostic = true;
        STATE.onboardingSteps.safety = true;
        STATE.onboardingSteps.tools = true;
      }
    }

    // Załaduj również bezpośrednie klucze notatek zadań z localStorage
    if (!STATE.taskNotes) STATE.taskNotes = {};
    for (let i = 1; i <= 100; i++) {
      const directNote = localStorage.getItem(`vibe_coding_task_notes_${i}`);
      if (directNote && directNote.trim() && !STATE.taskNotes[i]) {
        STATE.taskNotes[i] = directNote;
      }
    }

    // Załaduj również bezpośrednie dzieła z piaskownicy z localStorage
    try {
      const savedArchive = localStorage.getItem('vibe_coding_sandbox_creations');
      if (savedArchive) {
        const arr = JSON.parse(savedArchive);
        if (Array.isArray(arr) && arr.length > 0) {
          STATE.sandboxCreations = arr;
        }
      }
    } catch(e) {}

    // Załaduj uwagi dla twórcy kompendium z localStorage
    try {
      const savedFeedbacks = localStorage.getItem('vibe_coding_author_feedback');
      if (savedFeedbacks) {
        const arr = JSON.parse(savedFeedbacks);
        if (Array.isArray(arr)) {
          STATE.authorFeedbacks = arr;
        }
      }
    } catch(e) {}
  } catch (e) {
    console.warn("Błąd odczytu localStorage:", e);
  }
}

function saveState() {
  try {
    const payload = {
      completedTasks: Array.from(STATE.completedTasks),
      taskStatuses: STATE.taskStatuses || {},
      diplomaGradeApproved: Boolean(STATE.diplomaGradeApproved),
      currentDay: STATE.currentDay,
      viewMode: STATE.viewMode,
      soundEnabled: STATE.soundEnabled,
      contrastHigh: STATE.contrastHigh,
      iphoneInvertMode: Boolean(STATE.iphoneInvertMode),
      fontSize: STATE.fontSize,
      streakDays: STATE.streakDays,
      lastActiveDate: STATE.lastActiveDate,
      learnerName: STATE.learnerName,
      certId: STATE.certId,
      currentTheme: STATE.currentTheme,
      selectedDiplomaStyle: STATE.selectedDiplomaStyle,
      safetyChecklist: STATE.safetyChecklist || [],
      userProfile: STATE.userProfile,
      activeSubpage: STATE.activeSubpage,
      onboardingSteps: STATE.onboardingSteps,
      courseUnlocked: STATE.courseUnlocked,
      safetyAccepted: STATE.safetyAccepted,
      geminiVerifiedResponse: STATE.geminiVerifiedResponse,
      taskNotes: STATE.taskNotes || {},
      sandboxCreations: STATE.sandboxCreations || [],
      authorFeedbacks: STATE.authorFeedbacks || []
    };
    localStorage.setItem('vibe_coding_state_v2', JSON.stringify(payload));
    localStorage.setItem('vibe_coding_author_feedback', JSON.stringify(STATE.authorFeedbacks || []));
    if (typeof scheduleGdriveDebouncedSync === 'function') {
      scheduleGdriveDebouncedSync();
    }
  } catch (e) {
    console.warn("Błąd zapisu localStorage:", e);
  }
}

// =========================================================================
// SYNCHRONIZACJA URZĄDZEŃ, WŁASNY DYSK GOOGLE, KOD QR I KOPIA ZAPASOWA (v3.8.2)
// =========================================================================

// Obliczanie łącznej liczby zdobytych punktów
function calculateTotalScore() {
  try {
    if (typeof calculateScore === 'function') {
      const s = calculateScore();
      return (s && typeof s.earnedPoints === 'number') ? s.earnedPoints : 0;
    }
    return 0;
  } catch(e) {
    console.warn("Błąd calculateTotalScore:", e);
    return 0;
  }
}

let gdriveTokenClient = null;
let gdriveAccessToken = localStorage.getItem('vibe_coding_gdrive_token') || null;
let gdriveUserEmail = localStorage.getItem('vibe_coding_gdrive_email') || '';
let gdriveFileId = localStorage.getItem('vibe_coding_gdrive_file_id') || null;
let gdriveLastSync = localStorage.getItem('vibe_coding_gdrive_last_sync') || '';
let isGdriveAutoSyncEnabled = localStorage.getItem('vibe_coding_gdrive_autosync') === 'true';
let gdriveDebounceTimer = null;
let pendingImportData = null;
let currentQrCodeInstance = null;

// Otwieranie i zamykanie okna synchronizacji
function openSyncModal(initialTab = 'gdrive') {
  playClickSound();
  const triggerBtn = document.getElementById('btn-header-sync');
  const preferredSelector = `#sync-tab-btn-${initialTab}`;

  openModal('modal-sync-manager', triggerBtn, preferredSelector);

  switchSyncTab(initialTab);
  updateSyncFileStats();
  initGoogleDriveSyncStatus();

  setTimeout(() => {
    const activeTab = document.getElementById(`sync-tab-btn-${initialTab}`);
    if (activeTab) activeTab.focus();
  }, 100);

  announceSR("Otwarto okno synchronizacji urządzeń i kopii bezpieczeństwa. Klawisz Escape zamyka okno.");
}

function closeSyncModal() {
  closeModal('modal-sync-manager');
  playClickSound();
  announceSR("Zamknięto okno synchronizacji urządzeń.");
}

// Przełączanie zakładek w modalu synchronizacji
function switchSyncTab(tabId) {
  playClickSound();
  const tabs = ['gdrive', 'qr', 'file'];
  tabs.forEach(t => {
    const btn = document.getElementById(`sync-tab-btn-${t}`);
    const panel = document.getElementById(`sync-panel-${t}`);
    if (btn && panel) {
      if (t === tabId) {
        btn.setAttribute('aria-selected', 'true');
        btn.classList.add('border-emerald-500', 'bg-slate-800', 'text-white');
        btn.classList.remove('border-transparent', 'bg-slate-900', 'text-slate-400');
        panel.classList.remove('hidden');
      } else {
        btn.setAttribute('aria-selected', 'false');
        btn.classList.remove('border-emerald-500', 'bg-slate-800', 'text-white');
        btn.classList.add('border-transparent', 'bg-slate-900', 'text-slate-400');
        panel.classList.add('hidden');
      }
    }
  });

  if (tabId === 'qr') {
    renderTransferQrCode();
  } else if (tabId === 'file') {
    updateSyncFileStats();
  } else if (tabId === 'gdrive') {
    initGoogleDriveSyncStatus();
  }
}

// Aktualizacja licznika w panelu pliku
function updateSyncFileStats() {
  const tasksCount = STATE.completedTasks ? STATE.completedTasks.size : 0;
  const totalScore = calculateTotalScore();
  const notesCount = STATE.taskNotes ? Object.keys(STATE.taskNotes).filter(k => (STATE.taskNotes[k] || '').trim()).length : 0;

  const tEl = document.getElementById('sync-file-tasks-count');
  const pEl = document.getElementById('sync-file-points-count');
  const nEl = document.getElementById('sync-file-notes-count');
  const dEl = document.getElementById('sync-file-day-count');

  if (tEl) tEl.textContent = `${tasksCount} / 100`;
  if (pEl) pEl.textContent = `${totalScore} pkt`;
  if (nEl) nEl.textContent = `${notesCount}`;
  if (dEl) dEl.textContent = `Dzień ${STATE.currentDay || 1}`;
}

// =========================================================================
// POBIERANIE I WCZYTYWANIE PLIKU .JSON (OPCJA 1 / 3)
// =========================================================================

async function downloadProgressBackupFile() {
  playClickSound();
  saveState();

  const backup = {
    version: '3.8.3',
    appName: 'Akademia Vibe Codingu i Sztuki Promptingu',
    exportDate: new Date().toISOString(),
    completedTasks: Array.from(STATE.completedTasks || []),
    taskStatuses: STATE.taskStatuses || {},
    currentDay: STATE.currentDay || 1,
    learnerName: STATE.learnerName || '',
    userProfile: STATE.userProfile || {},
    taskNotes: STATE.taskNotes || {},
    sandboxCreations: STATE.sandboxCreations || [],
    authorFeedbacks: STATE.authorFeedbacks || [],
    diplomaGradeApproved: Boolean(STATE.diplomaGradeApproved),
    selectedDiplomaStyle: STATE.selectedDiplomaStyle || 'cyberpunk',
    certId: STATE.certId || '',
    streakDays: STATE.streakDays || 1,
    lastActiveDate: STATE.lastActiveDate || '',
    points: calculateTotalScore()
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const fileName = 'Akademia_Vibe_Codingu_Postepy.json';

  // 1. Nowoczesny wybór folderu (Chrome, Edge, Opera na komputerze - File System Access API)
  if (typeof window.showSaveFilePicker === 'function') {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: 'Plik postępów Akademii Vibe Codingu (JSON)',
          accept: { 'application/json': ['.json'] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(jsonStr);
      await writable.close();
      playSuccessChime();
      announceSR('Pomyślnie zapisano plik z postępami w wybranym folderze.');
      alert('Pomyślnie zapisano plik z postępami w wybranym folderze!');
      return;
    } catch(err) {
      if (err && err.name === 'AbortError') return;
      console.warn('showSaveFilePicker fallback:', err);
    }
  }

  // 2. Niezawodny fallback dla Firefox, Safari i urządzeń mobilnych (w tym Edge na iPhone)
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);

  announceSR('Pobrano plik postępów.');
  playSuccessChime();

  // Sprawdzenie, czy użytkownik korzysta z telefonu (iPhone / Android)
  const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isIos) {
    alert(
      'Plik z Twoimi postępami (' + fileName + ') został zapisany na Twoim iPhone!\n\n' +
      '📱 Gdzie go znaleźć w telefonie?\n' +
      '1. Na ekranie początkowym iPhone otwórz niebieską aplikację „Pliki” (Files).\n' +
      '2. Wejdź w folder „Pobrane rzeczy” lub „Na moim iPhonie” -> „Edge” (lub Safari).\n' +
      '3. Plik znajdziesz też od razu w zakładce „Ostatnie” na samym dole aplikacji Pliki!\n\n' +
      '💡 Wskazówka: Aby na telefonie nie szukać plików w aplikacji Pliki, najwygodniej jest korzystać z Zakładki „2. Kod QR i Magiczny Link”!'
    );
  } else {
    alert(
      'Plik z Twoimi postępami (' + fileName + ') został pobrany!\n\n' +
      '📁 Znajdziesz go w folderze „Pobrane” na swoim komputerze. Możesz go zapisać w swoim folderze „Dysk Google”.\n\n' +
      '💡 Wskazówka dla Firefox: Jeśli chcesz, aby przeglądarka za każdym razem pytała o wybór folderu, wejdź w Ustawienia Firefox -> Ogólne -> Pobieranie i zaznacz opcję „Zawsze pytaj, gdzie zapisać pliki”.'
    );
  }
}

function handleImportFileSelect(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data || (!data.completedTasks && !data.taskStatuses && !data.t)) {
        alert('Wybrany plik nie zawiera poprawnych danych postępów Akademii Vibe Codingu.');
        return;
      }
      // Natychmiastowe zaaplikowanie wczytanego pliku z pełną informacją dla użytkownika
      applyImportedDataDirectly(data, file.name);
    } catch(err) {
      alert('Nie udało się odczytać pliku JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// =========================================================================
// KOD QR I MAGICZNY LINK (TRANSFER NA SMARTFON)
// =========================================================================

function generateCompactTransferString(includeNotes = false) {
  saveState();
  const payload = {
    v: '3.8.3',
    ts: Date.now(),
    t: Array.from(STATE.completedTasks || []),
    s: STATE.taskStatuses || {},
    d: STATE.currentDay || 1,
    n: STATE.learnerName || '',
    pts: calculateTotalScore()
  };
  if (includeNotes && STATE.taskNotes && Object.keys(STATE.taskNotes).length > 0) {
    payload.nt = STATE.taskNotes;
  }
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function parseTransferString(str) {
  try {
    let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const json = decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(json);
    return {
      completedTasks: parsed.completedTasks || parsed.t || [],
      taskStatuses: parsed.taskStatuses || parsed.s || {},
      currentDay: parsed.currentDay || parsed.d || 1,
      learnerName: parsed.learnerName || parsed.n || '',
      taskNotes: parsed.taskNotes || parsed.nt || {},
      points: parsed.points || parsed.pts || 0,
      exportDate: parsed.ts ? new Date(parsed.ts).toLocaleString('pl-PL') : 'Ostatnia sesja'
    };
  } catch(e) {
    console.warn('Błąd dekodowania transfer string:', e);
    return null;
  }
}

function renderTransferQrCode() {
  const container = document.getElementById('sync-qr-code-display');
  if (!container) return;

  container.innerHTML = '';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0b0f19';

  let transferCode = '';
  let fullUrl = '';
  try {
    transferCode = generateCompactTransferString(false);
    const baseUrl = window.location.origin + window.location.pathname;
    fullUrl = `${baseUrl}#transfer=${transferCode}`;
  } catch(e) {
    console.error('Błąd generowania kodu transferu:', e);
    container.innerHTML = '<span class="text-xs text-rose-700 font-bold p-2 text-center">Błąd przygotowania danych</span>';
    return;
  }

  const linkInput = document.getElementById('sync-transfer-link-input');
  if (linkInput) {
    linkInput.value = fullUrl;
  }

  if (typeof QRCode !== 'undefined') {
    try {
      const correctLevel = (QRCode.CorrectLevel && typeof QRCode.CorrectLevel.L !== 'undefined')
        ? QRCode.CorrectLevel.L
        : 1;

      currentQrCodeInstance = new QRCode(container, {
        text: fullUrl,
        width: 190,
        height: 190,
        colorDark: '#0b0f19',
        colorLight: '#ffffff',
        correctLevel: correctLevel
      });
    } catch(err) {
      console.warn('Błąd generowania QRCode:', err);
      container.innerHTML = '<span class="text-xs text-slate-800 font-bold p-2 text-center">Aparat nie może odczytać kodu graficznego?<br>Skorzystaj z Magicznego Linku obok!</span>';
    }
  } else {
    container.innerHTML = '<span class="text-xs text-slate-800 font-bold p-2 text-center">Biblioteka QR nie została załadowana.<br>Skorzystaj z Magicznego Linku obok!</span>';
  }
}

function copyTransferLink() {
  playClickSound();
  const input = document.getElementById('sync-transfer-link-input');
  if (!input || !input.value) return;

  navigator.clipboard.writeText(input.value).then(() => {
    const btn = document.getElementById('btn-copy-transfer-link');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>Skopiowano!</span> <span role="img" aria-label="(sukces)">✓</span>';
      setTimeout(() => { btn.innerHTML = orig; }, 2500);
    }
    announceSR('Skopiowano Magiczny Link do schowka. Możesz go wysłać sobie mailem lub otworzyć w przeglądarce Safari na smartfonie.');
  }).catch(() => {
    input.select();
    document.execCommand('copy');
    alert('Skopiowano link do schowka!');
  });
}

function applyManualTransferCode() {
  playClickSound();
  const textarea = document.getElementById('sync-manual-code-input');
  if (!textarea || !textarea.value.trim()) {
    alert('Wklej najpierw otrzymany kod transferu lub link z drugiego urządzenia.');
    return;
  }
  let raw = textarea.value.trim();
  if (raw.includes('#transfer=')) {
    raw = raw.split('#transfer=')[1];
  } else if (raw.includes('transfer=')) {
    const m = raw.match(/transfer=([^&]+)/);
    if (m) raw = m[1];
  }
  const parsed = parseTransferString(raw);
  if (!parsed || (!parsed.completedTasks && !parsed.taskStatuses)) {
    alert('Wklejony kod transferu jest niepoprawny lub uszkodzony.');
    return;
  }
  promptImportConfirmation(parsed, 'z wklejonego kodu transferu');
}

// =========================================================================
// POTWIERDZENIE I APLIKOWANIE ZAIMPORTOWANEGO STANU
// =========================================================================

function applyImportedDataDirectly(data, sourceName = '') {
  if (Array.isArray(data.completedTasks)) {
    STATE.completedTasks = new Set(data.completedTasks);
  } else if (data.t && Array.isArray(data.t)) {
    STATE.completedTasks = new Set(data.t);
  }

  if (data.taskStatuses && typeof data.taskStatuses === 'object') {
    STATE.taskStatuses = Object.assign({}, data.taskStatuses);
  } else if (data.s && typeof data.s === 'object') {
    STATE.taskStatuses = Object.assign({}, data.s);
  } else if (STATE.completedTasks) {
    STATE.taskStatuses = {};
    STATE.completedTasks.forEach(id => {
      STATE.taskStatuses[id] = 'passed';
    });
  }

  if (data.currentDay || data.d) STATE.currentDay = data.currentDay || data.d;
  if (data.learnerName || data.n) STATE.learnerName = data.learnerName || data.n;
  if (data.userProfile) STATE.userProfile = Object.assign(STATE.userProfile || {}, data.userProfile);

  if (data.taskNotes || data.nt) {
    const notes = data.taskNotes || data.nt;
    if (!STATE.taskNotes) STATE.taskNotes = {};
    Object.assign(STATE.taskNotes, notes);
    Object.keys(notes).forEach(k => {
      if (notes[k]) {
        try { localStorage.setItem(`vibe_coding_task_notes_${k}`, notes[k]); } catch(e){}
      }
    });
  }
  if (Array.isArray(data.sandboxCreations)) {
    STATE.sandboxCreations = data.sandboxCreations;
    try { localStorage.setItem('vibe_coding_sandbox_creations', JSON.stringify(STATE.sandboxCreations)); } catch(e){}
  }
  if (Array.isArray(data.authorFeedbacks)) {
    STATE.authorFeedbacks = data.authorFeedbacks;
  }
  if (data.selectedDiplomaStyle) STATE.selectedDiplomaStyle = data.selectedDiplomaStyle;
  if (data.diplomaGradeApproved !== undefined) STATE.diplomaGradeApproved = data.diplomaGradeApproved;

  if (STATE.completedTasks.size > 0) {
    STATE.courseUnlocked = true;
    STATE.onboardingSteps.welcome = true;
    STATE.onboardingSteps.profile = true;
    STATE.onboardingSteps.diagnostic = true;
    STATE.onboardingSteps.safety = true;
    STATE.onboardingSteps.tools = true;
  }

  saveState();
  updateProfileUI();
  updateProgressUI();
  updateBadgesUI();
  updateRewardsUI();
  updateSubpageNavUI();
  renderTasks();
  updateGlobalNotesCounter();
  updateAuthorFeedbackCounter();

  // Zamknij wszelkie otwarte okna synchronizacji lub potwierdzenia
  const syncModal = document.getElementById('modal-sync-manager');
  if (syncModal && !syncModal.classList.contains('hidden')) {
    closeSyncModal();
  }
  const confirmModal = document.getElementById('modal-transfer-confirm');
  if (confirmModal && !confirmModal.classList.contains('hidden')) {
    closeModal('modal-transfer-confirm');
  }

  const count = STATE.completedTasks ? STATE.completedTasks.size : 0;
  const points = calculateTotalScore();

  playVictoryFanfare();
  celebrateWithConfetti();

  const label = sourceName ? `z pliku: ${sourceName}` : 'z Twojej kopii';
  announceSR(`Pomyślnie wczytano Twoje postępy ${label}. Ukończono ${count} zadań, zdobyto ${points} punktów.`);
  alert(`Wspaniale! Pomyślnie wczytano Twoje postępy ${label}!\n\n✅ Ukończone zadania: ${count} / 100\n🏆 Zdobyte punkty: ${points} pkt\n\nMożesz teraz bez przeszkód kontynuować kurs na tym urządzeniu.`);
}

function promptImportConfirmation(data, sourceDesc = '') {
  pendingImportData = data;

  // Zamknij okno synchronizacji jeśli było otwarte
  const syncModal = document.getElementById('modal-sync-manager');
  if (syncModal && !syncModal.classList.contains('hidden')) {
    closeSyncModal();
  }

  const modal = document.getElementById('modal-transfer-confirm');
  if (!modal) {
    if (confirm(`Wykryto Twoje postępy (${sourceDesc}):\nUkończone zadania: ${(data.completedTasks || []).length}/100\nPunkty: ${data.points || 0}\n\nCzy chcesz wczytać te postępy na to urządzenie?`)) {
      executeApplyImportedState();
    }
    return;
  }

  const tasksCountEl = document.getElementById('confirm-import-tasks');
  const pointsCountEl = document.getElementById('confirm-import-points');
  const nameEl = document.getElementById('confirm-import-name');
  const sourceEl = document.getElementById('confirm-import-source');

  const count = Array.isArray(data.completedTasks) ? data.completedTasks.length : (data.completedTasks instanceof Set ? data.completedTasks.size : (data.t ? data.t.length : 0));
  if (tasksCountEl) tasksCountEl.textContent = `${count} / 100`;
  if (pointsCountEl) pointsCountEl.textContent = `${data.points || calculateTotalScoreFromData(data)} pkt`;
  if (nameEl) nameEl.textContent = data.learnerName ? `Uczeń: ${data.learnerName}` : (STATE.learnerName ? `Uczeń: ${STATE.learnerName}` : 'Kursant Vibe Codingu');
  if (sourceEl) sourceEl.textContent = `Źródło: ${sourceDesc}`;

  openModal('modal-transfer-confirm', null, '#btn-confirm-import-accept');
  playClickSound();

  announceSR(`Wykryto Twoje postępy ${sourceDesc}. Ukończono ${count} z 100 zadań. Aby wczytać, naciśnij przycisk Tak, wczytaj moje postępy.`);
}

function cancelImportConfirmation() {
  pendingImportData = null;
  closeModal('modal-transfer-confirm');
  playClickSound();
  announceSR("Anulowano wczytywanie postępów.");
}

function executeApplyImportedState() {
  if (!pendingImportData) return;
  const data = pendingImportData;
  pendingImportData = null;
  cancelImportConfirmation();
  applyImportedDataDirectly(data, 'z transferu QR / linku');
}

function calculateTotalScoreFromData(data) {
  let score = 0;
  if (data.completedTasks) {
    const arr = Array.isArray(data.completedTasks) ? data.completedTasks : Object.keys(data.completedTasks);
    arr.forEach(id => {
      const tid = parseInt(id, 10);
      score += getTaskScoreValue(tid);
    });
  }
  return score;
}

function checkForTransferPayloadInUrl() {
  try {
    let hash = window.location.hash || '';
    let search = window.location.search || '';
    let transferCode = null;

    if (hash.startsWith('#transfer=')) {
      transferCode = hash.substring(10);
    } else if (search.includes('transfer=')) {
      const m = search.match(/transfer=([^&]+)/);
      if (m) transferCode = m[1];
    }

    if (transferCode) {
      const parsed = parseTransferString(decodeURIComponent(transferCode));
      if (parsed && (parsed.completedTasks || parsed.taskStatuses)) {
        setTimeout(() => {
          promptImportConfirmation(parsed, 'z zeskanowanego kodu QR / linku');
        }, 500);
      }
      if (window.history && window.history.replaceState) {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState(null, document.title, cleanUrl);
      }
    }
  } catch(e) {
    console.warn('Błąd sprawdzania transferu w URL:', e);
  }
}

// =========================================================================
// SYNCHRONIZACJA Z PRYWATNYM DYSKIEM GOOGLE (GOOGLE DRIVE API)
// =========================================================================

function initGoogleDriveSyncStatus() {
  const dot = document.getElementById('gdrive-status-dot');
  const text = document.getElementById('gdrive-status-text');
  const lastSync = document.getElementById('gdrive-last-sync-time');
  const connectLabel = document.getElementById('btn-gdrive-connect-label');
  const btnDisconnect = document.getElementById('btn-gdrive-disconnect');
  const chkAuto = document.getElementById('chk-gdrive-autosync');
  const customInp = document.getElementById('gdrive-custom-client-id-input');

  if (customInp) {
    customInp.value = localStorage.getItem('vibe_coding_gdrive_custom_client_id') || '';
  }

  if (chkAuto) chkAuto.checked = isGdriveAutoSyncEnabled;

  if (gdriveAccessToken) {
    if (dot) {
      dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse';
    }
    if (text) {
      text.textContent = gdriveUserEmail ? `Połączono z kontem: ${gdriveUserEmail}` : 'Połączono z Twoim prywatnym kontem Google';
      text.className = 'text-sm font-bold text-emerald-300';
    }
    if (connectLabel) connectLabel.textContent = 'Połącz ponownie';
    if (btnDisconnect) btnDisconnect.classList.remove('hidden');
  } else {
    if (dot) {
      dot.className = 'w-2.5 h-2.5 rounded-full bg-slate-500 inline-block';
    }
    if (text) {
      text.textContent = 'Gotowy do zapisu i odczytu plików na Twoim Dysku Google';
      text.className = 'text-sm font-bold text-slate-300';
    }
    if (connectLabel) connectLabel.textContent = 'Zaloguj się oknem Google';
    if (btnDisconnect) btnDisconnect.classList.add('hidden');
  }

  if (lastSync) {
    lastSync.textContent = gdriveLastSync || 'brak';
  }
}

function saveCustomGoogleClientId() {
  playClickSound();
  const inp = document.getElementById('gdrive-custom-client-id-input');
  if (!inp || !inp.value.trim()) {
    alert('Wpisz poprawny identyfikator Client ID (np. xxxxx.apps.googleusercontent.com)');
    return;
  }
  const val = inp.value.trim();
  localStorage.setItem('vibe_coding_gdrive_custom_client_id', val);
  alert('Zapisano Twój Google Client ID! Możesz teraz kliknąć "Zaloguj się oknem Google".');
}

function connectGoogleDrive() {
  playClickSound();

  const customClientId = localStorage.getItem('vibe_coding_gdrive_custom_client_id');
  if (!customClientId) {
    const ask = confirm(
      "Bezpośrednie wyskakujące okno Google wymaga zarejestrowania darmowego klucza (Google Client ID) w Google Cloud Console.\n\n" +
      "👉 Czy chcesz zamiast tego zapisać plik bezpośrednio w swoim folderze Dysku Google (100% bez rejestracji i haseł)?\n\n" +
      "(Kliknij 'OK', aby pobrać plik do folderu Dysku Google, lub 'Anuluj', aby wpisać własny Client ID)."
    );
    if (ask) {
      saveToGoogleDrive();
      return;
    } else {
      const entered = prompt("Wklej tutaj swój zarejestrowany Google Client ID (lub zostaw puste, aby anulować):");
      if (entered && entered.trim()) {
        localStorage.setItem('vibe_coding_gdrive_custom_client_id', entered.trim());
      } else {
        return;
      }
    }
  }

  const clientId = localStorage.getItem('vibe_coding_gdrive_custom_client_id');
  if (!clientId) return;

  if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
    alert('Biblioteka logowania Google nie została jeszcze załadowana lub brak połączenia z siecią. Kliknij "Zapisz postępy na moim Dysku Google".');
    return;
  }

  try {
    gdriveTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          gdriveAccessToken = tokenResponse.access_token;
          localStorage.setItem('vibe_coding_gdrive_token', gdriveAccessToken);

          fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { 'Authorization': `Bearer ${gdriveAccessToken}` }
          })
          .then(res => res.json())
          .then(info => {
            if (info && info.email) {
              gdriveUserEmail = info.email;
              localStorage.setItem('vibe_coding_gdrive_email', gdriveUserEmail);
            }
            initGoogleDriveSyncStatus();
            playSuccessChime();
            announceSR('Pomyślnie połączono z Twoim prywatnym Dyskiem Google.');
            saveToGoogleDrive();
          })
          .catch(() => {
            initGoogleDriveSyncStatus();
            saveToGoogleDrive();
          });
        }
      }
    });

    gdriveTokenClient.requestAccessToken({ prompt: 'consent' });
  } catch(err) {
    console.warn('Google Drive OAuth error:', err);
    saveToGoogleDrive();
  }
}

async function saveToGoogleDrive(isSilent = false) {
  if (!isSilent) playClickSound();

  // Jeśli brak połączenia OAuth, natychmiast zapisz plik z postępami do folderu Dysku Google
  if (!gdriveAccessToken) {
    await downloadProgressBackupFile();
    return;
  }

  saveState();
  const backup = {
    version: '3.8.3',
    appName: 'Akademia Vibe Codingu',
    exportDate: new Date().toISOString(),
    completedTasks: Array.from(STATE.completedTasks || []),
    taskStatuses: STATE.taskStatuses || {},
    currentDay: STATE.currentDay || 1,
    learnerName: STATE.learnerName || '',
    userProfile: STATE.userProfile || {},
    taskNotes: STATE.taskNotes || {},
    sandboxCreations: STATE.sandboxCreations || [],
    authorFeedbacks: STATE.authorFeedbacks || [],
    diplomaGradeApproved: Boolean(STATE.diplomaGradeApproved),
    selectedDiplomaStyle: STATE.selectedDiplomaStyle || 'cyberpunk',
    points: calculateTotalScore()
  };

  const fileName = 'Akademia_Vibe_Codingu_Postepy.json';
  const fileContent = JSON.stringify(backup, null, 2);

  const performUpload = (fileId) => {
    let url, method;
    if (fileId) {
      url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
      method = 'PATCH';
    } else {
      url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
      method = 'POST';
    }

    let requestBody;
    let headers = {
      'Authorization': `Bearer ${gdriveAccessToken}`
    };

    if (fileId) {
      headers['Content-Type'] = 'application/json; charset=UTF-8';
      requestBody = fileContent;
    } else {
      const boundary = '-------314159265358979323846';
      headers['Content-Type'] = `multipart/related; boundary="${boundary}"`;
      const metadata = {
        name: fileName,
        mimeType: 'application/json'
      };
      requestBody = 
        `--${boundary}\r\n` +
        `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
        `${JSON.stringify(metadata)}\r\n` +
        `--${boundary}\r\n` +
        `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
        `${fileContent}\r\n` +
        `--${boundary}--`;
    }

    fetch(url, { method: method, headers: headers, body: requestBody })
      .then(res => {
        if (res.status === 401) {
          gdriveAccessToken = null;
          localStorage.removeItem('vibe_coding_gdrive_token');
          initGoogleDriveSyncStatus();
          if (!isSilent) alert('Sesja połączenia z Google wygasła. Kliknij "Zaloguj się kontem Google", aby połączyć ponownie.');
          throw new Error('Token expired');
        }
        return res.json();
      })
      .then(data => {
        if (data && data.id) {
          gdriveFileId = data.id;
          localStorage.setItem('vibe_coding_gdrive_file_id', gdriveFileId);
        }
        gdriveLastSync = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        localStorage.setItem('vibe_coding_gdrive_last_sync', gdriveLastSync);
        initGoogleDriveSyncStatus();

        if (!isSilent) {
          playSuccessChime();
          announceSR('Zapisano postępy na Twoim Dysku Google.');
          alert(`Pomyślnie zapisano Twoje postępy na Twoim Dysku Google!\nPlik: ${fileName}`);
        }
      })
      .catch(err => {
        console.warn('Błąd zapisu na Google Drive:', err);
      });
  };

  if (gdriveFileId) {
    performUpload(gdriveFileId);
  } else {
    fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}'+and+trashed=false&fields=files(id,name)`, {
      headers: { 'Authorization': `Bearer ${gdriveAccessToken}` }
    })
    .then(res => res.json())
    .then(data => {
      const existing = data && data.files && data.files[0];
      if (existing && existing.id) {
        gdriveFileId = existing.id;
        localStorage.setItem('vibe_coding_gdrive_file_id', gdriveFileId);
        performUpload(gdriveFileId);
      } else {
        performUpload(null);
      }
    })
    .catch(() => performUpload(null));
  }
}

function loadFromGoogleDrive() {
  playClickSound();

  // Jeśli brak połączenia OAuth, otwórz okno wyboru pliku, aby wskazać plik z Dysku Google
  if (!gdriveAccessToken) {
    const fileInput = document.getElementById('import-progress-file-input');
    if (fileInput) {
      announceSR("Wskaż plik ze swoimi postępami z Dysku Google.");
      fileInput.click();
    }
    return;
  }

  const fileName = 'Akademia_Vibe_Codingu_Postepy.json';
  fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}'+and+trashed=false&fields=files(id,name)`, {
    headers: { 'Authorization': `Bearer ${gdriveAccessToken}` }
  })
  .then(res => res.json())
  .then(data => {
    const file = data && data.files && data.files[0];
    if (!file || !file.id) {
      alert(`Na Twoim Dysku Google nie znaleziono jeszcze pliku '${fileName}'.\nNajpierw zapisz postępy na komputerze!`);
      return;
    }
    return fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
      headers: { 'Authorization': `Bearer ${gdriveAccessToken}` }
    });
  })
  .then(res => {
    if (!res) return;
    return res.json();
  })
  .then(data => {
    if (data) {
      promptImportConfirmation(data, 'z Twojego prywatnego Dysku Google');
    }
  })
  .catch(err => {
    console.warn('Błąd wczytywania z Google Drive:', err);
    alert('Wystąpił błąd podczas wczytywania pliku z Dysku Google: ' + err.message);
  });
}

function disconnectGoogleDrive() {
  playClickSound();
  if (confirm('Czy na pewno chcesz odłączyć połączenie z Dyskiem Google? Twoje zapisane pliki na dysku nie zostaną usunięte.')) {
    gdriveAccessToken = null;
    gdriveUserEmail = '';
    gdriveFileId = null;
    gdriveLastSync = '';
    localStorage.removeItem('vibe_coding_gdrive_token');
    localStorage.removeItem('vibe_coding_gdrive_email');
    localStorage.removeItem('vibe_coding_gdrive_file_id');
    localStorage.removeItem('vibe_coding_gdrive_last_sync');
    initGoogleDriveSyncStatus();
    announceSR('Odłączono konto Google.');
  }
}

function toggleGdriveAutoSync(enabled) {
  isGdriveAutoSyncEnabled = Boolean(enabled);
  localStorage.setItem('vibe_coding_gdrive_autosync', isGdriveAutoSyncEnabled ? 'true' : 'false');
  playClickSound();
  if (isGdriveAutoSyncEnabled) {
    announceSR('Włączono automatyczną synchronizację z Dyskiem Google.');
    if (gdriveAccessToken) {
      saveToGoogleDrive(true);
    }
  } else {
    announceSR('Wyłączono automatyczną synchronizację z Dyskiem Google.');
  }
}

function scheduleGdriveDebouncedSync() {
  if (!isGdriveAutoSyncEnabled || !gdriveAccessToken) return;
  if (gdriveDebounceTimer) clearTimeout(gdriveDebounceTimer);
  gdriveDebounceTimer = setTimeout(() => {
    saveToGoogleDrive(true);
  }, 4000);
}

// Powiadomienia Web Notifications API
function requestPushNotification() {
  playClickSound();
  if (!("Notification" in window)) {
    alert("Na iPhonie najwygodniej dodać tę stronę do Ekranu Początkowego w Safari (Udostępnij -> Dodaj do ekranu początkowego) lub ustawić codzienne przypomnienie w aplikacji Przypomnienia Apple!");
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      new Notification("Akademia Vibe Codingu ⚡", {
        body: `Powiadomienia aktywne! Twój cel na dziś: Dzień ${STATE.currentDay}. Wykonaj 3 krótkie zadania.`,
        icon: "https://fav.farm/⚡"
      });
      playSuccessChime();
      const label = document.getElementById('notify-btn-label');
      if (label) label.textContent = 'Powiadomienia Aktywne';
      announceSR('Powiadomienia systemowe zostały pomyślnie włączone.');
    } else {
      alert("Powiadomienia zostały zablokowane w ustawieniach przeglądarki.");
    }
  });
}

// =========================================================================
// INICJALIZACJA APLIKACJI PO ZAŁADOWANIU DOM (LUB NATYCHMIAST GDY DOM GOTOWY)
// =========================================================================
function initializeAcademyApp() {
  loadSavedState();
  populateQuickDayJump();
  syncProfileFormValues();

  updateProfileUI();
  applyTheme(STATE.currentTheme);
  syncSoundButtonUI();
  if (STATE.contrastHigh) toggleContrast(true);
  if (STATE.iphoneInvertMode) applyIphoneInvertMode(true, false);
  setupInvertedColorsDetection();
  if (STATE.fontSize !== 'normal') applyFontSize(STATE.fontSize);

  updateProgressUI();
  updateBadgesUI();
  updateRewardsUI();
  updateStreak();
  renderSafetyWizard();

  // Synchronizacja kontrolek formularzy
  const chkSafety = document.getElementById('chk-safety-agree');
  if (chkSafety) chkSafety.checked = Boolean(STATE.safetyAccepted);

  const inpGemini = document.getElementById('gemini-verification-input');
  if (inpGemini && STATE.geminiVerifiedResponse) {
    inpGemini.value = STATE.geminiVerifiedResponse;
  }

  const unlockCard = document.getElementById('course-unlocked-card');
  if (unlockCard && STATE.courseUnlocked) {
    unlockCard.classList.remove('hidden');
  }

  // Domyślna podstrona
  let startPage = STATE.activeSubpage || 'page-welcome';
  if (STATE.courseUnlocked && startPage === 'page-welcome') {
    startPage = 'page-daily-tasks';
  }

  switchSubpage(startPage);
  updateSubpageNavUI();
  renderTasks();
  updateGlobalNotesCounter();
  updateAuthorFeedbackCounter();
  renderMotivationalQuoteUI();
  renderSandboxArchiveGrid();
  initGoogleDriveSyncStatus();
  checkForTransferPayloadInUrl();

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (STATE.activeSubpage === 'page-feedback') {
        e.preventDefault();
        closeAuthorFeedbackPage();
        return;
      }
      const sm = document.getElementById('modal-sync-manager');
      if (sm && !sm.classList.contains('hidden')) {
        e.preventDefault();
        closeSyncModal();
        return;
      }
      const tc = document.getElementById('modal-transfer-confirm');
      if (tc && !tc.classList.contains('hidden')) {
        e.preventDefault();
        cancelImportConfirmation();
        return;
      }
      const nm = document.getElementById('modal-notes-manager');
      if (nm && !nm.classList.contains('hidden')) {
        e.preventDefault();
        closeNotesManagerModal();
        return;
      }
      const sp = document.getElementById('modal-sandbox-preview');
      if (sp && !sp.classList.contains('hidden')) {
        e.preventDefault();
        closeSandboxPreviewModal();
        return;
      }
    }

    if (currentOpenModal) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal(currentOpenModal);
        return;
      }

      if (e.key === 'Tab') {
        const focusable = currentOpenModal.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first || document.activeElement === currentOpenModal) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      }
      return;
    }

    if (e.key === 'Escape' && STATE.inlineFocusMode) {
      toggleInlineFocusMode(false);
      return;
    }

    if (e.altKey && !e.ctrlKey) {
      if (e.key === '1') {
        e.preventDefault();
        switchSubpage('page-welcome');
      } else if (e.key === '2' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        switchSubpage('page-profile');
      } else if (e.key === '3' || e.key === 't' || e.key === 'T') {
        e.preventDefault();
        switchSubpage('page-diagnostic');
      } else if (e.key === '4' || e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        switchSubpage('page-safety');
      } else if (e.key === '5') {
        e.preventDefault();
        switchSubpage('page-tools');
      } else if (e.key === '6' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        switchSubpage('page-daily-tasks');
      } else if (e.key === '7' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        switchSubpage('page-all-tasks');
      } else if (e.key === '8') {
        e.preventDefault();
        switchSubpage('page-rewards');
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleSound();
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        toggleContrast();
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        toggleIphoneInvertMode();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        openNotesManagerModal();
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        openAuthorFeedbackPage();
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        openSyncModal();
      } else if (e.key === 'ArrowRight' || e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        nextDayAndScrollTop();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevDayAndScrollTop();
      } else if (e.key === 's' || e.key === 'S' || e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        openDayFocusWindow(STATE.currentDay);
      }
    }
  });

  function isUserFocusInEditor() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = (el.tagName || '').toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable) return true;
    if (el.closest && (el.closest('.task-card') || el.closest('#daily-tasks-cards-container') || el.closest('#sandbox-section'))) return true;
    return false;
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'vibe_coding_state_v2') {
      const skipRerender = isUserFocusInEditor();
      loadSavedState();
      syncSoundButtonUI();
      updateProgressUI();
      updateBadgesUI();
      updateRewardsUI();
      updateSubpageNavUI();
      if (!skipRerender) {
        renderTasks();
      }
    }
  });

  window.addEventListener('focus', () => {
    const skipRerender = isUserFocusInEditor();
    loadSavedState();
    syncSoundButtonUI();
    updateProgressUI();
    updateBadgesUI();
    updateRewardsUI();
    updateSubpageNavUI();
    if (!skipRerender) {
      renderTasks();
    }
  });

  const searchInput = document.getElementById('search-tasks-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      STATE.searchQuery = e.target.value;
      renderTasks();
      updateClearSearchButtonVisibility();
    });
  }

  const stageSelect = document.getElementById('filter-stage-select');
  if (stageSelect) {
    stageSelect.addEventListener('change', (e) => {
      STATE.filterStage = e.target.value;
      renderTasks();
      updateClearSearchButtonVisibility();
    });
  }

  const statusSelect = document.getElementById('filter-status-select');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      STATE.filterStatus = e.target.value;
      renderTasks();
      updateClearSearchButtonVisibility();
    });
  }
}

// Uruchomienie aplikacji natychmiast lub po zdarzeniu DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAcademyApp);
} else {
  initializeAcademyApp();
}
