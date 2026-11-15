/**
 * KOMPENDIUM VIBE CODINGU & SZTUKI PROMPTINGU
 * Baza 100 Praktycznych Zadań od Zera do Średnio Zaawansowanego
 * Pełna zawartość merytoryczna bez żargonu programistycznego
 */

const STAGES = [
  { id: 1, name: "Etap 1: Pierwsze kroki i dekompozycja", tasks: "1–15", days: "Dni 1–5", desc: "Zrozumienie, czym jest AI, przełamanie lęku przed kodem i nauka myślenia jak reżyser." },
  { id: 2, name: "Etap 2: Architektura skutecznego promptu", tasks: "16–35", days: "Dni 6–12", desc: "Formuła C-C-O-F, strukturyzowanie poleceń, Tailwind CSS, pamięć LocalStorage i interakcje." },
  { id: 3, name: "Etap 3: Twoje pierwsze mini-aplikacje", tasks: "36–55", days: "Dni 13–19", desc: "Tworzenie kalkulatorów, minutników, gier, wizualizacji danych i korzystanie z publicznych API." },
  { id: 4, name: "Etap 4: Sztuka debugowania i rozmowa z błędami", tasks: "56–70", days: "Dni 20–24", desc: "Czytanie konsoli F12, metoda gumowej kaczuszki, ratowanie zepsutego kodu i obsługa błędów." },
  { id: 5, name: "Etap 5: Narzędzia nowoczesnego Vibe Codera", tasks: "71–85", days: "Dni 25–29", desc: "Platformy v0.dev, Bolt.new, Lovable.dev, edytor Cursor, pliki .cursorrules i rysowanie kodu." },
  { id: 6, name: "Etap 6: Publikacja w sieci, bazy danych i autonomia", tasks: "86–100", days: "Dni 30–34", desc: "GitHub Pages, Netlify Drop, baza Supabase, aplikacje mobilne PWA i Egzamin Mistrzowski." }
];

const TASKS_DATA = [
  // ETAP 1 (Dni 1-5, Zadania 1-15)
  {
    id: 1, day: 1, stage: 1,
    isCode: false,
    title: "Kim jest Twój stażysta AI? (Przełamanie barier)",
    goal: "Zrozumienie, że jesteś Reżyserem, a sztuczna inteligencja to Twój pracowity asystent.",
    desc: "Sztuczna inteligencja nie jest magiczną wyrocznią ani robotem z filmów. Wyobraź sobie bardzo oczytanego stażystę, który przeczytał milion książek, ale nie potrafi czytać w Twoich myślach. Jeśli rzucisz ogólne: 'zrób mi stronę', dostaniesz banał. Jeśli powiesz mu dokładnie, kim ma być i co ma przygotować – stworzy świetną rzecz.",
    prompt: "Jesteś doświadczonym programistą z 15-letnim stażem, ale tłumaczysz wszystko tak, jakbyś rozmawiał z 10-latkiem. Wyjaśnij mi w 3 zwięzłych zdaniach, czym różni się tradycyjne programowanie od vibe codingu.",
    expected: "Otrzymasz prostą odpowiedź w stylu: Tradycyjny programista ręcznie wbija każdą cegłę (kod), a vibe coder mówi sztucznej inteligencji, jaki dom ma powstać i tylko sprawdza, czy drzwi się otwierają.",
    tip: "Zawsze zaczynaj od zdefiniowania roli dla AI: 'Jesteś ekspertem...', 'Wciel się w...'. To jak założenie odpowiedniego munduru przed pracą.",
    sampleSolution: "1. Tradycyjny programista musi znać trudny język komputera i ręcznie układać każdą cegiełkę kodu znak po znaku.\n2. W vibe codingu mówisz sztucznej inteligencji po polsku, jak ma wyglądać Twój gotowy domek, a ona muruje go za Ciebie.\n3. Twoja praca polega na byciu architektem i sprawdzaniu, czy pokoje są wygodne i czy włączniki światła działają.",
    checkKeywords: ["tradycyjn", "programow", "vibe", "cegł", "kod", "architekt", "język"]
  },
  {
    id: 2, day: 1, stage: 1,
    isCode: false,
    title: "Zasada klocków LEGO – Dzielenie na małe kroki",
    goal: "Nauka rozbijania każdego pomysłu na proste, pojedyncze czynności.",
    desc: "Komputer ani sztuczna inteligencja nie potrafią zrobić 'wszystkiego naraz'. Zamiast rzucać gigantyczne hasło 'zrób mi sklep internetowy', dzielimy cel na małe klocki LEGO: Krok 1: Pokaż 3 produkty, Krok 2: Dodaj koszyk, Krok 3: Policz sumę do zapłaty. W tym zadaniu poćwiczysz to na parzeniu herbaty.",
    prompt: "Wybierz czynność: przygotowanie herbaty z cytryną. Rozbij ten proces na dokładnie 7 ponumerowanych, czysto mechanicznych instrukcji dla robota kuchennego, który nie ma ludzkiej intuicji.",
    expected: "Lista dokładnie 7 ponumerowanych kroków (np. 1. Napełnij czajnik wodą, 2. Włącz grzałkę, 3. Włóż torebkę do kubka...).",
    tip: "Złota zasada: Jeśli sam nie potrafisz opisać kroków własnymi słowami po polsku, sztuczna inteligencja tym bardziej nie odgadnie Twojego zamiaru.",
    sampleSolution: "1. Nalej 250 ml zimnej wody do czajnika elektrycznego.\n2. Włącz czajnik i poczekaj, aż woda się zagotuje.\n3. Postaw ceramiczny kubek na stole.\n4. Włóż do kubka jedną torebkę czarnej herbaty.\n5. Zalej torebkę wrzącą wodą do 3/4 wysokości kubka.\n6. Odczekaj 4 minuty i wyjmij torebkę łyżeczką.\n7. Odkrój plasterek cytryny o grubości 5 mm i wrzuć go do kubka.",
    checkKeywords: ["1", "2", "3", "4", "5", "6", "7", "wod", "herbat", "czajnik", "kubek", "cytryn"]
  },
  {
    id: 3, day: 1, stage: 1,
    isCode: true,
    title: "Pierwsza strona w przeglądarce – Wizytówka kawiarni",
    goal: "Uruchomienie pierwszej prawdziwej strony internetowej na własnym ekranie bez żadnych instalacji.",
    desc: "Twoja przeglądarka internetowa (Chrome, Edge lub Safari) to potężne narzędzie: każdy zwykły plik z końcówką .html potrafi w ułamku sekundy wyświetlić jako kolorową, klikalną stronę. W tym zadaniu poprosisz AI o gotową stronę kawiarni.",
    prompt: "Stwórz pojedynczy, kompletny plik HTML z nowoczesną wizytówką dla rzemieślniczej kawiarni 'Kofeinowy Raj'. Użyj ciepłych pastelowych barw kawy i mleka, dodaj chwytliwy nagłówek, godziny otwarcia i duży przycisk 'Zadzwoń do kawiarni'. Zadbaj, aby cały kod był w jednym bloku gotowym do skopiowania.",
    expected: "AI wygeneruje kompletny kod strony HTML. Możesz go wkleić do naszej piaskownicy i od razu zobaczyć pachnącą kawą stronę!",
    tip: "Wystarczy, że powiesz AI: 'umieść wszystko w jednym pliku HTML' – a model sam połączy wygląd, napisy i przyciski.",
    sampleSolution: "<!DOCTYPE html>\n<html lang=\"pl\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Kawiarnia Kofeinowy Raj</title>\n  <script src=\"https://cdn.tailwindcss.com\"><\/script>\n</head>\n<body class=\"bg-amber-50 text-amber-950 min-h-screen flex items-center justify-center p-4 font-sans\">\n  <div class=\"bg-white max-w-md w-full p-8 rounded-3xl shadow-xl border border-amber-200 text-center\">\n    <span class=\"text-5xl mb-4 block\">☕</span>\n    <h1 class=\"text-2xl font-black text-amber-900 mb-2\">Kofeinowy Raj</h1>\n    <p class=\"text-sm text-amber-700 mb-6\">Świeżo palone ziarna i domowe ciasta każdego poranka.</p>\n    <div class=\"bg-amber-100/60 p-4 rounded-2xl mb-6 text-xs text-amber-900\">\n      <p class=\"font-bold mb-1\">Godziny otwarcia:</p>\n      <p>Poniedziałek – Piątek: 07:30 – 19:00</p>\n      <p>Sobota – Niedziela: 09:00 – 20:00</p>\n    </div>\n    <button onclick=\"document.getElementById('call-info').classList.remove('hidden')\" class=\"w-full py-3.5 px-6 rounded-2xl bg-amber-800 hover:bg-amber-700 text-white font-bold transition shadow-md\">\n      📞 Zadzwoń do kawiarni\n    </button>\n    <div id=\"call-info\" class=\"hidden mt-3 p-3 bg-amber-100 text-amber-950 font-bold text-xs rounded-xl\">\n      📞 Łączenie z kawiarnią: 123 456 789...\n    </div>\n  </div>\n</body>\n</html>",
    checkKeywords: ["<html", "kawiarn", "kofeinow", "przycisk", "button", "godzin"]
  },
  {
    id: 4, day: 2, stage: 1,
    isCode: false,
    title: "Zakaz domysłów – Odcinanie zgadywania przez AI",
    goal: "Nauczenie sztucznej inteligencji, aby zadawała pytania uściślające zamiast zgadywać.",
    desc: "Gdy kelner w restauracji nie dosłyszy Twojego zamówienia, powinien dopytać: 'Ziemniaki czy frytki?', a nie przynosić cokolwiek. Sztuczna inteligencja ma niestety tendencję do zgadywania (w branży: halucynowania). Najprostszy trik: zabroń jej zgadywać i każ najpierw zadać 3 pytania!",
    prompt: "Chcę stworzyć formularz kontaktowy na stronę internetową. Zanim napiszesz jakąkolwiek linijkę kodu, zadaj mi 3 krótkie pytania uściślające o moje wymagania. Nie pisz kodu, dopóki nie odpowiem.",
    expected: "AI grzecznie powstrzyma się przed pisaniem kodu i zada Ci 3 konkretne pytania (np. Jakie pola są potrzebne? Gdzie mają trafiać wiadomości? Jaki styl preferujesz?).",
    tip: "To jedno zdanie: 'Najpierw zadaj mi pytania uściślające' oszczędza 80% poprawek i nerwów przy każdym projekcie.",
    sampleSolution: "Oto 3 krótkie pytania uściślające, zanim przygotuję kod formularza:\n1. Jakich pól potrzebujesz od odwiedzających? (np. Imię, e-mail, numer telefonu, treść wiadomości?)\n2. Co ma się wydarzyć po kliknięciu przycisku 'Wyślij'? (np. wyświetlić zielony dymek z podziękowaniem czy wysłać prawdziwego maila?)\n3. W jakim stylu wizualnym ma być formularz? (np. jasny i minimalistyczny czy w ciemnych eleganckich barwach?)",
    checkKeywords: ["?", "pytani", "pol", "wymaga", "styl", "formularz"]
  },
  {
    id: 5, day: 2, stage: 1,
    isCode: true,
    title: "Kolorystyka i nastrój (The 'Vibe')",
    goal: "Przekazywanie wyglądu i stylu strony językiem skojarzeń, filmów i nastroju.",
    desc: "W vibe codingu nie musisz znać technicznych kodów kolorów (jak #FF5733). Sztuczna inteligencja doskonale rozumie odniesienia kulturowe: 'w stylu Apple', 'retro lata 80.', 'japoński minimalizm' czy 'gra Cyberpunk'.",
    prompt: "Stwórz kompletną stronę HTML dla futurystycznego, neonowego klubu 'Cyber Bar 2077' w nocnym Tokio (lub weź kod kawiarni z Zadania 3 i zmień go na ten styl). Wymagania: głęboka czerń w tle (bg-black), neonowe akcenty w kolorze magenty/różu i cyjanu/błękitu, świecący nagłówek oraz klikalny przycisk 'Aktywuj dawkę kofeiny', który po kliknięciu wyświetla neonowy komunikat potwierdzenia. Zadbaj, aby cały kod był w jednym bloku HTML z Tailwind CSS.",
    expected: "Otrzymujesz odmienioną wersję strony: pastelowa kawiarnia zamienia się w świecący, neonowy futurystyczny bar w nocnym Tokio!",
    tip: "W vibe codingu nie musisz znać kodów kolorów (jak #FF5733) – wystarczy hasło kulturowe ('Cyberpunk', 'Apple', 'Retro lata 80.') i AI natychmiast dobierze idealne barwy!",
    sampleSolution: "<!DOCTYPE html>\n<html lang=\"pl\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Cyber Bar 2077</title>\n  <script src=\"https://cdn.tailwindcss.com\"><\/script>\n</head>\n<body class=\"bg-black text-cyan-300 min-h-screen flex items-center justify-center p-4 font-mono\">\n  <div class=\"bg-slate-950 max-w-md w-full p-8 rounded-3xl shadow-[0_0_50px_rgba(236,72,153,0.3)] border-2 border-pink-500 text-center\">\n    <span class=\"text-5xl mb-4 block animate-pulse\">⚡</span>\n    <h1 class=\"text-2xl font-black text-pink-500 mb-2 tracking-widest uppercase\">Neonowy Raj 2077</h1>\n    <p class=\"text-xs text-cyan-400 mb-6\">Syntetyczna kofeina i neony nocnego Tokio.</p>\n    <button onclick=\"document.getElementById('cyber-status').classList.remove('hidden')\" class=\"w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-cyan-500 text-black font-black uppercase tracking-wider hover:opacity-90 transition shadow-[0_0_20px_rgba(6,182,212,0.6)]\">\n      Aktywuj dawkę kofeiny\n    </button>\n    <div id=\"cyber-status\" class=\"hidden mt-4 p-3 rounded-2xl bg-pink-950/80 border border-pink-500 text-pink-300 font-bold text-xs animate-bounce\">\n      ⚡ Zamówienie wysłane do cyber-baristy! Syntetyczna kofeina w drodze.\n    </div>\n  </div>\n</body>\n</html>",
    checkKeywords: ["<html", "black", "neon", "cyber", "pink", "cyan", "button"]
  },
  {
    id: 6, day: 2, stage: 1,
    isCode: false,
    title: "Odpowiedź w tabeli – Koniec z długimi esejami",
    goal: "Wymuszanie czytelnego, tabelarycznego formatu odpowiedzi.",
    desc: "Sztuczna inteligencja z natury uwielbia pisać długie, kwieciste wypracowania. Gdy potrzebujesz konkretnych faktów, poproś o prostą tabelę z wyznaczonymi kolumnami – wtedy dostajesz esencję w 10 sekund.",
    prompt: "Wymień 5 najpopularniejszych środowisk i narzędzi do vibe codingu w latach 2025/2026. Przedstaw je w czystej tabeli z kolumnami: [Nazwa narzędzia], [Do czego służy prostymi słowami], [Czy wymaga instalacji (Tak/Nie)], [Darmowy plan (Tak/Nie)].",
    expected: "Zwięzła, przejrzysta tabela porównująca np. v0, Cursor, Bolt.new, Lovable i Claude Artifacts.",
    tip: "Gdy prosisz o tabelę, poproś również o ułożenie wierszy od najprostszego do najbardziej zaawansowanego.",
    sampleSolution: "| Nazwa narzędzia | Do czego służy prostymi słowami | Czy wymaga instalacji | Darmowy plan |\n|---|---|---|---|\n| **v0.dev** | Błyskawiczne generowanie wyglądu stron w przeglądarce | Nie (w przeglądarce) | Tak |\n| **Bolt.new** | Tworzenie całych aplikacji z podglądem na żywo | Nie (w przeglądarce) | Tak |\n| **Lovable.dev** | Budowanie aplikacji internetowych po polsku | Nie (w przeglądarce) | Tak |\n| **Claude Artifacts** | Okno z podglądem kodu bezpośrednio w czacie AI | Nie (w przeglądarce) | Tak |\n| **Cursor** | Inteligentny edytor z wbudowanym asystentem na komputerze | Tak (program na PC/Mac) | Tak |",
    checkKeywords: ["|", "narzędzi", "v0", "cursor", "bolt", "instalacj", "darmow"]
  },
  {
    id: 7, day: 3, stage: 1,
    isCode: false,
    title: "Zamykanie tekstu w klamerki (<pomysł>) – Segregacja notatek",
    goal: "Uczymy się oddzielać Twoje polecenie od luźnych notatek, żeby sztuczna inteligencja się nie pogubiła.",
    desc: "Wyobraź sobie, że wkładasz luźne kartki do podpisanej teczki albo spinasz pranie klamerką. Gdy wklejasz do AI długi tekst i dopisujesz na dole prośbę, model może pomylić polecenie z treścią. Zamknięcie notatki w klamerki (np. <pomysl> ... </pomysl>) działa jak przezroczysta teczka biurowa – AI od razu widzi: 'to w środku to tylko notatka użytkownika, a na zewnątrz jest instrukcja, co mam z nią zrobić!'.",
    prompt: "Poniżej w klamerkach <pomysl> znajduje się moja chaotyczna notatka o aplikacji. Twoim zadaniem jest wyciągnąć z niej dokładnie 3 najważniejsze punkty i opisać je prostym, zrozumiałym językiem:\n\n<pomysl>\nNo więc marzy mi się taki stoper do gotowania jajek, żeby sam wiedział czy chcę na miękko czy na twardo, grał miłą melodyjkę i żeby można było kliknąć ile jajek wrzuciłem do garnka.\n</pomysl>",
    expected: "AI wyciąga z teczki dokładnie 3 funkcjonalności w punktach (1. Wybór twardości jajka, 2. Melodia po zakończeniu, 3. Licznik wrzuconych jajek), bez zbędnego gawędziarstwa.",
    tip: "To proste jak spinacz biurowy! Wewnątrz klamerek możesz wpisać cokolwiek: <dane>, <notatka>, <tekst> albo użyć potrójnych cudzysłowów \"\"\".",
    sampleSolution: "Oto 3 najważniejsze funkcjonalności Twojej aplikacji wyciągnięte z notatki:\n1. Wybór stopnia ugotowania (na miękko, półtwardo lub na twardo) z automatycznym dopasowaniem czasu odliczania.\n2. Przyjemny sygnał dźwiękowy (melodyjka), informujący o zakończeniu gotowania.\n3. Prosty licznik jajek z przyciskami plus/minus, aby łatwo wybrać liczbę jajek wrzuconych do garnka.",
    checkKeywords: ["jaj", "stoper", "miękk", "tward", "melod", "licznik", "czas", "funkcj"]
  },
  {
    id: 8, day: 3, stage: 1,
    isCode: false,
    title: "Uczenie przez przykłady – Pokaż wzór zamiast długich tłumaczeń",
    goal: "Uzyskanie dokładnie takiego formatu odpowiedzi, jakiego chcesz, poprzez podanie AI jednego lub dwóch prostych przykładów.",
    desc: "Gdy idziesz do fryzjera, łatwiej pokazać zdjęcie ze smartfona ('chcę dokładnie taką fryzurę'), niż przez 15 minut opisywać milimetry i kąty cięcia. W świecie AI ta technika nazywa się uczeniem przez przykłady (w żargonie: Few-Shot). Pokazujesz modelowi jeden wzór pytania i odpowiedzi, a sztuczna inteligencja w ułamku sekundy pojmuje Twój schemat!",
    prompt: "Przekształć moje życzenie w prosty, elegancki opis według poniższych przykładów:\n\nPrzykład 1:\nJa mówię: 'Chcę ładny przycisk'\nAI odpowiada: 'Duży, zaokrąglony przycisk z delikatnym cieniem, który po najechaniu myszką płynnie zmienia odcień.'\n\nPrzykład 2:\nJa mówię: 'Chcę pole na imię'\nAI odpowiada: 'Czytelne pole do wpisywania z szarym napisem podpowiedzi i zieloną ramką, gdy klikniesz w środku.'\n\nTeraz wykonaj to samo dla:\nJa mówię: 'Chcę licznik kliknięć'",
    expected: "AI bez żadnego wstępu i bez zbędnych słów wygeneruje opis licznika w identycznym, eleganckim formacie jak w podanych przykładach.",
    tip: "Jeden konkretny przykład pokazany sztucznej inteligencji oszczędza 10 minut pisania skomplikowanych reguł.",
    sampleSolution: "AI odpowiada: 'Duży, wyrazisty kafelek z cyfrą pokazującą aktualną liczbę oraz szeroki przycisk ze znakiem plus, który przy każdym naciśnięciu powiększa wartość o jeden.'",
    checkKeywords: ["licznik", "klikn", "przycisk", "cyfr", "wartość", "zwiększ", "plus"]
  },
  {
    id: 9, day: 3, stage: 1,
    isCode: true,
    title: "Pierwsza żywa interakcja – Przycisk licznika kliknięć",
    goal: "Twoja pierwsza strona, która reaguje na kliknięcie myszką i pamięta liczbę.",
    desc: "HTML to ściany i dach domu, CSS to kolorowa elewacja i wystrój, a JavaScript to włącznik światła i dzwonek do drzwi – elementy, które reagują na Twój dotyk. Nie musisz uczyć się żadnego kodu! Powiedz AI zwykłym językiem, jak ma zachowywać się przycisk.",
    prompt: "Napisz pojedynczy plik HTML z dużym, kolorowym kafelkiem na środku ekranu. Na kafelku ma być napis: 'Liczba Twoich kaw dzisiaj: 0' oraz duży przycisk '+ Wypiłem kolejną kawę!'. Każde kliknięcie ma natychmiast zwiększać liczbę o 1. Cały kod (HTML, CSS i JavaScript) umieść w jednym pliku, gotowym do uruchomienia.",
    expected: "Otrzymujesz kompletny kod HTML. Wklejasz go do piaskownicy w kursie i klikasz 'Uruchom podgląd' – po każdym kliknięciu cyfra rośnie!",
    tip: "Gratulacje! Właśnie stworzyłeś swoją pierwszą aplikację ze skarbonką pamięci (w żargonie: stan zmienny / state), która zapamiętuje Twoje kliknięcia.",
    sampleSolution: "<!DOCTYPE html>\n<html lang=\"pl\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Licznik Kaw</title>\n  <script src=\"https://cdn.tailwindcss.com\"><\/script>\n</head>\n<body class=\"bg-amber-950 text-white min-h-screen flex items-center justify-center p-4 font-sans\">\n  <div class=\"bg-amber-900/80 p-8 rounded-3xl border border-amber-700 shadow-2xl text-center max-w-sm w-full\">\n    <h1 id=\"licznik\" class=\"text-2xl font-bold mb-6 text-amber-200\">Liczba Twoich kaw dzisiaj: <span id=\"cyfra\" class=\"text-4xl text-amber-400 font-black\">0</span> ☕</h1>\n    <button onclick=\"dodajKawe()\" class=\"w-full py-4 px-6 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black rounded-2xl text-lg shadow-lg transition transform active:scale-95\">\n      + Wypiłem kolejną kawę!\n    </button>\n  </div>\n  <script>\n    let liczba = 0;\n    function dodajKawe() {\n      liczba++;\n      document.getElementById('cyfra').textContent = liczba;\n    }\n  <\/script>\n</body>\n</html>",
    checkKeywords: ["<html", "button", "licznik", "kaw", "click", "dodaj", "script"]
  },
  {
    id: 10, day: 4, stage: 1,
    isCode: false,
    title: "Rola Głównego Architekta – Planowanie przed kodowaniem",
    goal: "Nauczenie się patrzenia na aplikację jak mistrz budowlany, zanim położysz pierwszą cegłę.",
    desc: "Jeśli poprosisz przypadkową osobę o kładkę nad rzeką, rzuci deskę na trawę. Jeśli poprosisz Głównego Architekta, sprawdzi fundamenty, nośność i barierki ochronne. Z AI jest identycznie – nadając jej rolę Architekta, chronisz się przed chaosem.",
    prompt: "Wciel się w rolę Głównego Architekta Aplikacji z 20-letnim doświadczeniem. Zaplanuj prostą strukturę dla narzędzia: 'Wirtualny notes z listą zakupów'. Jakie 3 podstawowe klocki są nam potrzebne, zanim usiądziemy do pisania kodu? Pisz prostym językiem bez żargonu.",
    expected: "Ustrukturyzowany, logiczny podział: 1. Okienko do wpisywania (Wygląd / Interfejs), 2. Pamięć na listę (Schowek na dane), 3. Zasady działania (Logika – np. co zrobić po kliknięciu 'Kupione').",
    tip: "Dobre zaplanowanie 3 klocków przed pisaniem kodu oszczędza godziny błądzenia.",
    sampleSolution: "Oto 3 klocki potrzebne do listy zakupów opisane prostym językiem:\n1. Wygląd (Interfejs): Pole do wpisania produktu, przycisk 'Dodaj do listy' oraz czytelna lista z kwadracikami do odhaczania.\n2. Pamięć podręczna (Przechowywanie): Bezpieczny schowek w przeglądarce, dzięki któremu Twoja lista nie zniknie po wyłączeniu komputera.\n3. Zasady działania (Logika): Krótkie reguły: gdy klikniesz 'Kupione', produkt przekreśla się; gdy klikniesz kosz, produkt znika.",
    checkKeywords: ["interfejs", "wygląd", "pamięć", "schowek", "dane", "logik", "zasad", "klock"]
  },
  {
    id: 11, day: 4, stage: 1,
    isCode: false,
    title: "Test oczami seniorki – Dostępność dla każdego",
    goal: "Sprawdzenie, czy Twoja aplikacja jest prosta i czytelna dla osoby starszej lub niedowidzącej.",
    desc: "Jako twórca łatwo zapomnieć, że inni mogą mieć słabszy wzrok lub drżące dłonie. Sztuczna inteligencja potrafi wcielić się w dowolną postać i życzliwie podpowiedzieć, jak ułatwić obsługę.",
    prompt: "Wciel się w rolę 72-letniej pani Janiny, która ma słabszy wzrok, używa okularów +3, drżą jej dłonie przy obsłudze myszki i boi się, że coś 'zepsuje w internecie'. Przeanalizuj pomysł na aplikację licznika kaw z Zadania 9 i wskaż 3 rzeczy, które mogą sprawić jej trudność.",
    expected: "Życzliwe wskazówki: 1. Zbyt mała czcionka, 2. Za mały przycisk (trudno trafić kursorem), 3. Brak przycisku 'Cofnij', gdy kliknie się przez przypadek za dużo razy.",
    tip: "Dostępność cyfrowa (standard WCAG) to nie biurokracja, lecz szacunek i empatia dla drugiego człowieka.",
    sampleSolution: "Dzień dobry serduszko! Jako 72-letnia Janina widzę 3 rzeczy, które sprawiłyby mi kłopot:\n1. Za małe literki – przydałby się wielki, wyraźny napis, żebym nie musiała szukać moich mocniejszych okularów.\n2. Za mały obszar do kliknięcia – jak ręka mi trochę drży, łatwo kliknąć obok. Przycisk powinien być szeroki jak cała dłoń!\n3. Strach przed pomyłką – a co jeśli kliknę dwa razy za dużo? Bardzo chciałabym widzieć obok mały przycisk: 'Odejmij kawę / Pomyliłam się', żebym wiedziała, że niczego nie zepsułam.",
    checkKeywords: ["wzrok", "czcionk", "okular", "przycisk", "cofnij", "pomyłk", "duż", "drż"]
  },
  {
    id: 12, day: 4, stage: 1,
    isCode: false,
    title: "Narzędzie inspekcji w przeglądarce (Klawisz F12)",
    goal: "Zajrzenie pod maskę przeglądarki i oswojenie konsoli – jak wskaźników na desce rozdzielczej w aucie.",
    desc: "Większość ludzi boi się klawisza F12, bo wyskakuje czarne okienko. Dla twórcy to po prostu deska rozdzielcza w samochodzie – jeśli żarówka się przepali, komputer pokładowy wyświetla tam prosty komunikat.",
    prompt: "Otwórz plik ze swoją stroną w Google Chrome lub Microsoft Edge. Wciśnij na klawiaturze klawisz F12. Zobaczysz panel, który pojawi się po prawej lub na dole. Przejdź na zakładkę 'Console' (Konsola). Wpisz tam dokładnie: alert('Brawo, rozmawiam z przeglądarką!') i wciśnij klawisz Enter.",
    expected: "Na środku Twojego ekranu wyskoczy okienko z wpisanym tekstem!",
    tip: "Jeśli na laptopie klawisz F12 zmienia głośność lub jasność, przytrzymaj klawisz Fn + F12 lub kliknij prawym przyciskiem myszy na stronie i wybierz 'Zbadaj'.",
    sampleSolution: "Wpisałem w konsoli F12 polecenie alert('Brawo, rozmawiam z przeglądarką!') i po wciśnięciu Enter natychmiast wyskoczyło białe okienko systemowe z tym komunikatem.",
    checkKeywords: ["f12", "konsol", "alert", "okienko", "enter", "komunikat", "przeglądark"]
  },
  {
    id: 13, day: 5, stage: 1,
    isCode: true,
    title: "Wystrzał konfetti – Korzystanie z gotowych klocków (CDN)",
    goal: "Dodanie spektakularnego efektu wizualnego bez pisania skomplikowanych animacji.",
    desc: "Gdy budujesz dom, nie wypalasz samodzielnie każdej cegły w piecu – kupujesz gotowe materiały w markecie budowlanym. W internecie takimi gotowymi klockami są biblioteki CDN – podłączasz jedną linijkę i masz prawdziwy deszcz konfetti!",
    prompt: "Napisz od zera pojedynczy plik HTML: 'Generator Komplementów'. Na środku ekranu znajduje się elegancki kafelek z przyciskiem: 'Popraw mi humor!'. Po kliknięciu losuje się jeden z 10 zabawnych, ciepłych komplementów ORAZ wystrzeliwuje prawdziwe kolorowe konfetti po całym ekranie. Wykorzystaj darmową bibliotekę canvas-confetti załadowaną przez link CDN.",
    expected: "Zapisujesz plik lub uruchamiasz w piaskownicy: klikasz przycisk i cały ekran zalewa deszcz wielobarwnego konfetti z miłym słowem!",
    tip: "Gotowe biblioteki dają kinowe efekty przy zerowym nakładzie pracy.",
    sampleSolution: "<!DOCTYPE html>\n<html lang=\"pl\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Generator Komplementów</title>\n  <script src=\"https://cdn.tailwindcss.com\"><\/script>\n  <script src=\"https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js\"><\/script>\n</head>\n<body class=\"bg-slate-900 text-white min-h-screen flex items-center justify-center p-4 font-sans\">\n  <div class=\"bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl text-center max-w-md w-full\">\n    <h1 class=\"text-2xl font-black text-amber-300 mb-4\">Twój Dzienny Generator Humoru ✨</h1>\n    <p id=\"tekst\" class=\"text-base text-slate-200 min-h-[60px] flex items-center justify-center italic mb-6\">Kliknij poniżej, aby odebrać swój uśmiech!</p>\n    <button onclick=\"losujKomplement()\" class=\"w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold text-lg shadow-lg hover:opacity-90 transition\">\n      🎉 Popraw mi humor!\n    </button>\n  </div>\n  <script>\n    const lista = [\n      'Świetnie Ci idzie – każdy mistrz kiedyś zaczynał od zera!',\n      'Twój mózg tworzy dziś nowe, wspaniałe połączenia neuronowe.',\n      'Jesteś o krok bliżej do stworzenia własnego wymarzonego programu.',\n      'Świat potrzebuje Twoich pomysłów!',\n      'Dziś jest idealny dzień, by stworzyć coś pięknego.'\n    ];\n    function losujKomplement() {\n      const los = lista[Math.floor(Math.random() * lista.length)];\n      document.getElementById('tekst').textContent = los;\n      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });\n    }\n  <\/script>\n</body>\n</html>",
    checkKeywords: ["<html", "confetti", "komplement", "button", "losuj", "script"]
  },
  {
    id: 14, day: 5, stage: 1,
    isCode: false,
    title: "Czym jest CDN? – Hurtownia z darmową dostawą",
    goal: "Zrozumienie, dlaczego nie musisz sam programować trudnych rzeczy.",
    desc: "CDN (Content Delivery Network) brzmi groźnie, ale to po prostu internetowa hurtownia darmowych części. Wyobraź sobie, że zamawiasz gotowy sos do pizzy od włoskiego mistrza, zamiast przez pół roku uprawiać pomidory we własnym ogródku.",
    prompt: "Wyjaśnij mi za pomocą analogii do klocków LEGO i zamawiania pizzy, czym jest linijka <script src=\"https://cdn...\"> w kodzie HTML. Dlaczego nie muszę sam programować animacji konfetti od zera?",
    expected: "Przystępne, obrazowe wyjaśnienie: link CDN to jak zamówienie gotowej bazy od mistrza zamiast budowania fabryki.",
    tip: "Dzięki CDN Twoja strona w ułamku sekundy ma dostęp do wykresów, ikon, map i dźwięków.",
    sampleSolution: "Wyobraź sobie, że robisz pizzę na kolację:\n1. Bez CDN: musiałbyś sam zasiać pszenicę, zmielić mąkę, zbić deskę do pieca i wyhodować krówkę na ser mozzarella. To zajęłoby miesiące!\n2. Z CDN: bierzesz z lodówki gotowe ciasto i sos od najlepszego kucharza na świecie. Linijka <script src='https://cdn...'> to po prostu telefon do hurtowni: 'hej, pożyczcie mi na 2 sekundy gotowy przepis na konfetti'. Twoja strona od razu działa, a Ty nie tracisz czasu na wymyślanie koła od nowa.",
    checkKeywords: ["cdn", "pizza", "klock", "lego", "kod", "gotow", "skrypt", "hurtown"]
  },
  {
    id: 15, day: 5, stage: 1,
    isCode: false,
    title: "Quiz podsumowujący Etap 1 – Sprawdź swoją intuicję",
    goal: "Utrwalenie fundamentów: dekompozycji, rozmowy z AI i roli Architekta.",
    desc: "Gratulacje! Pierwsze 5 dni nauki za Tobą. Czas na przyjazny quiz z AI, który sprawdzi, jak bardzo Twoja intuicja twórcy się rozwinęła.",
    prompt: "Przeprowadź ze mną krótki test z wiedzy o podstawach promptingu i vibe codingu. Zadaj mi dokładnie 3 pytania wielokrotnego wyboru (A, B, C) oparte na praktycznych sytuacjach. Zadawaj mi pytania PO JEDNYM i czekaj na moją odpowiedź, a na koniec oceń moje odpowiedzi.",
    expected: "AI poprowadzi wciągający quiz, zadając Ci po kolei 3 pytania z życia codziennego.",
    tip: "Jeśli na któreś pytanie odpowiesz błędnie, poproś AI o wyjaśnienie – stażysta AI uczy z anielską cierpliwością.",
    sampleSolution: "Pytanie 1: Chcesz stworzyć aplikację kalkulatora domowego budżetu. Co robisz jako pierwsze?\nA) Wpisujesz do AI: 'zrób mi aplikację'\nB) Dzielisz problem na klocki (przychody, wydatki, podsumowanie) i prosisz AI o pierwszy krok\nC) Zapisujesz się na 5-letnie studia informatyczne\n\nNapisz, którą literę wybierasz!",
    checkKeywords: ["pytanie", "a)", "b)", "c)", "odpowiedź", "quiz", "test"]
  },

  // ETAP 2 (Dni 6-12, Zadania 16-35)
  {
    id: 16, day: 6, stage: 2,
    title: "Cztery filary promptu – Szablon C-C-O-F",
    goal: "Opanowanie uniwersalnego wzorca inżynierii promptu: Kontekst, Cel, Ograniczenia, Format.",
    desc: "Formuła C-C-O-F to sekret profesjonalistów: Context (Kontekst - kim jesteś), Cel (Co dokładnie budujemy), Ograniczenia (Czego kategorycznie NIE wolno robić), Format (Jak ma wyglądać odpowiedź).",
    prompt: "Napisz kod komponentu według poniższego wzorca:\n- KONTEKST: Buduję minimalistyczną stronę dla instruktora jogi.\n- CEL: Sekcja cennika z 3 pakietami zajęć (Pojedyncze, Karnet 8 wejść, Open bez limitu).\n- OGRANICZENIA: Czysty HTML i CSS, pastelowa zieleń szałwii, zero zewnętrznych skryptów JS.\n- FORMAT: Wyłącznie pojedynczy blok kodu HTML z osadzonymi stylami <style>.",
    expected: "Czysty, elegancki kod cennika idealnie trafiający w założenia bez niepotrzebnych dodatków.",
    tip: "Zapisz sobie akronim CCOF na kartce przy monitorze – stanie się Twoim nawykiem numer jeden."
  },
  {
    id: 17, day: 6, stage: 2,
    title: "Używanie negacji z umiarem – Formułowanie pozytywne",
    goal: "Zrozumienie, dlaczego AI gubi się przy słowie 'NIE' i jak mówić o ograniczeniach.",
    desc: "Mózg człowieka i modele językowe działają podobnie: gdy powiesz 'Nie myśl o różowym słoniu', od razu o nim myślisz! Podobnie słowo 'nie używaj czerwieni' skupia uwagę modelu na czerwieni.",
    prompt: "Zamiast pisać: 'Nie rób brzydkich kolorów i nie używaj czerwieni', napisz prompt pozytywny: 'Zastosuj paletę opartą wyłącznie na chłodnych błękitach, bieli i szarościach, tworząc wrażenie ładu i spokoju'. Zobacz, jak posłusznie model zrealizuje stronę wizytówki dentysty.",
    expected: "Spokojny, profesjonalny projekt w idealnej tonacji błękitu.",
    tip: "Zamiast pisać, czego AI ma NIE robić, powiedz mu dokładnie, co MA zrobić w zamian."
  },
  {
    id: 18, day: 6, stage: 2,
    title: "Generowanie atrapy danych (Mock Data w JSON)",
    goal: "Tworzenie realistycznych struktur danych testowych przed budową aplikacji.",
    desc: "Prawdziwe aplikacje operują na danych: listach produktów, użytkowników, rezerwacji. Format JSON to uniwersalny język wymiany danych na całym świecie.",
    prompt: "Wygeneruj dla mnie realistyczne dane testowe (Mock Data) w formacie JSON dla sklepu ze świecami sojowymi. Stwórz tablicę 4 produktów. Każdy obiekt ma zawierać: id, nazwaŚwiecy, zapach, czasPaleniaGodziny, cenaPLN, czyBestseller (true/false).",
    expected: "Poprawny, czytelny blok JSON z pachnącymi nazwami świec i cenami.",
    tip: "Dane w formacie JSON możesz wkleić do dowolnego programu – to krwiobieg nowoczesnego internetu."
  },
  {
    id: 19, day: 7, stage: 2,
    title: "Łączenie danych z wyglądem – Kafelki produktów",
    goal: "Wstrzykiwanie danych JSON do szablonu HTML za pomocą pętli w prompcie.",
    desc: "Teraz połączymy dane z Zadania 18 z pięknym wyglądem. Poproś AI, aby 'przelało' dane JSON wprost do kafelków produktów.",
    prompt: "Weź dane JSON ze świecami sojowymi z poprzedniego zadania i stwórz pojedynczy plik HTML, który wyświetli te 4 świece w eleganckiej siatce kafelków. Każda świeca ma mieć badge 'BESTSELLER' (jeśli pole jest prawdziwe) oraz przycisk 'Dodaj do koszyka'.",
    expected: "Otwierasz plik w przeglądarce i widzisz gotowy, profesjonalny minisklep ze świecami!",
    tip: "Zauważ: dane są oddzielone od wyglądu. Możesz podmienić nazwy w JSON, a strona sama się zaktualizuje."
  },
  {
    id: 20, day: 7, stage: 2,
    title: "Responsywność – Mobile First na telefon i ekran",
    goal: "Wymuszenie poprawnego wyświetlania na ekranach smartfonów i monitorów.",
    desc: "Ponad 65% ruchu w internecie pochodzi z telefonów. Podejście 'Mobile First' oznacza, że projektujemy najpierw na mały ekran, a potem rozciągamy na komputer.",
    prompt: "Zmodyfikuj kod sklepu ze świecami sojowymi tak, aby był w 100% responsywny (Mobile First). Na telefonie kafelki mają układać się w 1 kolumnę jeden pod drugim, na tablecie w 2 kolumny, a na dużym monitorze w 4 kolumny obok siebie. Użyj nowoczesnego CSS Grid.",
    expected: "Otwórz stronę na komputerze i powoli zwężaj okno przeglądarki myszką – kafelki same będą płynnie przeskakiwać!",
    tip: "Nigdy nie akceptuj strony, która wymaga przewijania w bok na ekranie telefonu."
  },
  {
    id: 21, day: 7, stage: 2,
    title: "Stylizowanie z Tailwind CSS przez prompt",
    goal: "Poznanie najpopularniejszego frameworka stylowego ery AI.",
    desc: "Tailwind CSS to absolutny ulubieniec sztucznej inteligencji. Zamiast pisać osobne pliki stylów, Tailwind używa gotowych klas bezpośrednio w tekście (np. 'bg-blue-500 rounded-xl p-4 shadow-lg').",
    prompt: "Stwórz pojedynczy plik HTML z wykorzystaniem Tailwind CSS załadowanego przez link CDN. Zbuduj efektowny baner powitalny (Hero Section) dla wypożyczalni desek surfingowych: duże tło z gradientem oceanu, biały pogrubiony nagłówek i przycisk z efektem powiększenia po najechaniu.",
    expected: "Nowoczesny, zachwycający wizualnie baner rodem ze stron w Dolinie Krzemowej.",
    tip: "Gdy prosisz AI o kod, dopisz: 'Użyj Tailwind CSS przez CDN' – to automatycznie podnosi jakość designu o 300%."
  },
  {
    id: 22, day: 8, stage: 2,
    title: "Ikony wektorowe (FontAwesome i Lucide)",
    goal: "Wzbogacenie aplikacji o ostre jak brzytwa ikony bez wklejania plików graficznych.",
    desc: "Ikony to uniwersalny język wizualny. Zamiast szukać obrazków w Google, używamy fontów wektorowych, które ładują się natychmiast i nigdy nie tracą ostrości.",
    prompt: "Dodaj do baneru surfingowego ikony z darmowej biblioteki FontAwesome (CDN): ikonę fali morskiej obok tytułu, ikonę kalendarza na przycisku rezerwacji oraz ikonę telefonu w prawym górnym rogu.",
    expected: "Piękne, ostre symbole wektorowe pojawią się w wyznaczonych miejscach.",
    tip: "Ikony traktowane są jak zwykły tekst – możesz zmieniać ich kolor klasą text-amber-400 i rozmiar text-2xl."
  },
  {
    id: 23, day: 8, stage: 2,
    title: "Dialog iteracyjny – Jedna zmiana na raz",
    goal: "Nauka wprowadzania poprawek bez psucia dotychczas działającego kodu.",
    desc: "Najczęstszy błąd początkujących: 'Popraw przycisk, zmień kolor tła, dodaj bazę danych i zmień czcionkę'. AI gubi się i psuje kod. Złota zasada vibe codera to mikrokroki: jedna zmiana w jednym prompcie.",
    prompt: "W moim działającym pliku chcę zmienić TYLKO JEDNĄ rzecz: po kliknięciu przycisku 'Zarezerwuj deskę' ma pojawić się zielony dymek z napisem 'Termin zarezerwowany na 24h!'. Nie zmieniaj żadnych kolorów ani innych funkcji.",
    expected: "Model zwróci kod, w którym jedyną nowością jest dymek potwierdzenia.",
    tip: "Jeśli masz 5 pomysłów, wyślij 5 kolejnych wiadomości po przetestowaniu każdej z nich."
  },
  {
    id: 24, day: 8, stage: 2,
    title: "Zmienne CSS i przełącznik Dark Mode",
    goal: "Zrozumienie działania motywów kolorystycznych i trybu ciemnego.",
    desc: "Każdy uwielbia tryb ciemny (Dark Mode), bo mniej męczy wzrok w nocy. Zamiast pisać dwa kody, definiujemy kolory jako 'zmienne' i zmieniamy je jednym kliknięciem.",
    prompt: "Stwórz pojedynczy plik HTML z prostym artykułem blogowym. W prawym górnym rogu umieść przycisk ze słoneczkiem i księżycem. Kliknięcie przycisku ma płynnie przełączać całą stronę między eleganckim trybem jasnym a głębokim trybem ciemnym.",
    expected: "Płynna, kinowa animacja zmiany barwy tła i tekstu po kliknięciu ikony.",
    tip: "Tryb ciemny to nie tylko wygoda, ale też wymóg dostępności dla osób z nadwrażliwością na światło."
  },
  {
    id: 25, day: 9, stage: 2,
    title: "Walidacja formularza w locie (kolorowa obwódka)",
    goal: "Ochrona przed wpisywaniem błędnych danych i natychmiastowa informacja dla użytkownika.",
    desc: "Użytkownik nie lubi klikać 'Wyślij', żeby dowiedzieć się, że zapomniał wpisać @ w adresie e-mail. Walidacja w locie informuje go na bieżąco kolorem obramowania.",
    prompt: "Napisz pole formularza do wpisywania adresu e-mail. Gdy użytkownik wpisuje tekst, pole ma na żywo sprawdzać poprawność: jeśli brakuje znaku @ lub kropki w domenie – obwódka ma być czerwona z napisem 'Wpisz poprawny e-mail'. Gdy adres jest poprawny – obwódka staje się zielona z ikonką ptaszka.",
    expected: "Dynamiczna reakcja pola tekstowego na każdą wprowadzoną literę.",
    tip: "Jasny, życzliwy komunikat o błędzie to fundament dobrego doświadczenia użytkownika (UX)."
  },
  {
    id: 26, day: 9, stage: 2,
    title: "Pamięć podręczna przeglądarki (LocalStorage)",
    goal: "Zapobieganie utracie danych po odświeżeniu lub zamknięciu strony.",
    desc: "Czy zauważyłeś, że po wciśnięciu klawisza F5 licznik wraca do zera? Magazyn LocalStorage to wbudowany w każdą przeglądarkę bezpieczny schowek na dane.",
    prompt: "Zmodyfikuj licznik kaw tak, aby korzystał z localStorage. Kiedy kliknę 5 razy i odświeżę stronę klawiszem F5 lub zamknę przeglądarkę i otworzę ją jutro – na ekranie nadal ma być cyfra 5. Dodaj też mały przycisk 'Zresetuj dzień'.",
    expected: "Odświeżasz stronę, zamykasz kartę, otwierasz znowu – Twoje dane przetrwały!",
    tip: "LocalStorage to najprostsza 'baza danych' na świecie, która nie wymaga żadnego serwera."
  },
  {
    id: 27, day: 9, stage: 2,
    title: "Pierwsza interaktywna lista zadań (To-Do List)",
    goal: "Zbudowanie klasycznej, pełnowymiarowej aplikacji CRUD bez pisania kodu.",
    desc: "Aplikacja To-Do to chrzest bojowy każdego twórcy. Skrót CRUD oznacza: Create (Twórz), Read (Czytaj), Update (Zmieniaj), Delete (Usuwaj).",
    prompt: "Napisz kompletną aplikację To-Do (Lista Zadań) w pojedynczym pliku HTML z Tailwind CSS. Funkcje: pole wpisywania nowego zadania + przycisk Dodaj, lista zadań z checkboxem (przekreśla tekst po zrobieniu), czerwony przycisk kosza do usuwania oraz automatyczny zapis w localStorage.",
    expected: "W pełni działający, piękny i użyteczny organizer zadań.",
    tip: "Właśnie stworzyłeś narzędzie, za które firmy 15 lat temu płaciły dziesiątki tysięcy złotych."
  },
  {
    id: 28, day: 10, stage: 2,
    title: "Filtrowanie i wyszukiwanie na żywo",
    goal: "Dynamiczne przeszukiwanie listy elementów podczas wpisywania liter.",
    desc: "Gdy lista zadań ma 30 pozycji, nikt nie chce ich przewijać. Wyszukiwarka filtrująca w czasie rzeczywistym to standard każdej aplikacji.",
    prompt: "Dodaj na samej górze listy To-Do pole wyszukiwania z lupką. Gdy użytkownik wpisuje np. 'zakupy', na liście mają pozostać widoczne TYLKO te zadania, które zawierają to słowo. Pozostałe mają płynnie zniknąć.",
    expected: "Błyskawiczne filtrowanie listy bez przeładowywania strony.",
    tip: "Ta sama technika służy do filtrowania kontaktów w telefonie i produktów w Allegro."
  },
  {
    id: 29, day: 10, stage: 2,
    title: "Dźwiękowa informacja zwrotna (Web Audio API)",
    goal: "Dodanie satysfakcjonujących dźwięków sukcesu bez zewnętrznych plików mp3.",
    desc: "Dźwięk wywołuje natychmiastowy wyrzut dopaminy. Przeglądarka potrafi sama syntetyzować fale dźwiękowe za pomocą Web Audio API – dokładnie tak jak instrumenty syntezatorowe.",
    prompt: "Wykorzystaj Web Audio API przeglądarki, aby w momencie odhaczenia zadania jako ukończone w liście To-Do odtworzył się krótki, ciepły, kojący dwuton sukcesu (fale sinusoidalne C5 -> G5) o głośności 15%. Dodaj w rogu przełącznik wyciszenia dźwięków.",
    expected: "Klikasz w checkbox i słyszysz miękki, gamingowy dźwięk sukcesu w głośnikach!",
    tip: "Dźwięki w aplikacjach powinny być subtelne i mieć miękki atak, by nie drażnić przy setnym kliknięciu."
  },
  {
    id: 30, day: 10, stage: 2,
    title: "Eksport danych do pliku CSV (Excel)",
    goal: "Pobieranie danych zgromadzonych w aplikacji na dysk twardy komputera.",
    desc: "Użytkownicy uwielbiają mieć poczucie kontroli nad swoimi danymi. Eksport do formatu CSV pozwala otworzyć dane w Excelu lub Arkuszach Google.",
    prompt: "Dodaj pod listą zadań przycisk 'Pobierz zadania do Excela (.csv)'. Po kliknięciu przeglądarka ma wygenerować plik tekstowy CSV z kolumnami: [Nazwa Zadania, Status, Data Utworzenia] i automatycznie rozpocząć jego pobieranie.",
    expected: "Klikasz przycisk i na Twoim dysku ląduje plik zadania.csv gotowy do otwarcia w arkuszu kalkulacyjnym.",
    tip: "Generowanie plików po stronie przeglądarki (data URI lub Blob) nie zużywa ani jednego kilobajta transferu serwerowego."
  },
  {
    id: 31, day: 11, stage: 2,
    title: "Zabezpieczenie przed skasowaniem (Okno modalne)",
    goal: "Projektowanie bezpiecznych interfejsów (Safety First UX).",
    desc: "Nic tak nie niszczy zaufania do aplikacji jak przypadkowe skasowanie rocznej pracy jednym kliknięciem myszki. Okno potwierdzenia (Modal) to tarcza ochronna.",
    prompt: "Gdy użytkownik kliknie 'Wyczyść całą listę zadań', nie kasuj ich od razu. Wyświetl estetyczne okienko modalne na przyciemnionym tle z pytaniem: 'Czy na pewno chcesz usunąć wszystkie zadania? Te operacji nie można cofnąć.' z dwoma przyciskami: 'Anuluj' (szary) oraz 'Tak, usuń wszystko' (czerwony).",
    expected: "Pojawienie się eleganckiego okienka dialogowego z obsługą klawisza Escape.",
    tip: "Zawsze daj użytkownikowi szansę na ratunek przed jego własną nieuwagą."
  },
  {
    id: 32, day: 11, stage: 2,
    title: "Dostępność z klawiatury (WCAG w liście zadań)",
    goal: "Przystosowanie aplikacji do obsługi bez użycia myszki.",
    desc: "Wielu programistów, osób niewidomych lub z bólami nadgarstka nie używa myszki. Standard WCAG wymaga, aby każdy element dało się obsłużyć klawiaturą.",
    prompt: "Przejrzyj kod listy zadań i upewnij się, że spełnia zasady dostępności WCAG 2.1 AA: klawisz Tab przenosi fokus logicznie, pole tekstowe ma widoczną grubą ramkę fokusu (focus-visible: outline-3px), klawisz Enter dodaje zadanie, a Spacja zaznacza checkbox.",
    expected: "Oderwij rękę od myszki – jesteś w stanie w pełni obsłużyć całą aplikację samą klawiaturą!",
    tip: "Dobre wsparcie klawiatury przyspiesza pracę każdemu zaawansowanemu użytkownikowi."
  },
  {
    id: 33, day: 11, stage: 2,
    title: "Audyt czystości kodu przez AI",
    goal: "Wykorzystanie innego okna AI jako niezależnego audytora jakości.",
    desc: "Nigdy nie pytaj tego samego fryzjera, czy potrzebujesz strzyżenia. Jeśli wygenerowałeś kod w Claude, wklej go do Gemini lub ChatGPT z prośbą o krytyczną recenzję.",
    prompt: "Oto kod mojej aplikacji To-Do napisanej w HTML/JS. Wciel się w rolę Bezkompromisowego Inspektora Kodu. Wskaż 3 miejsca, które można uprościć, oraz sprawdź, czy kod nie zawiera niepotrzebnych powtórzeń (zasada DRY - Don't Repeat Yourself).",
    expected: "Konstruktywna, ekspercka analiza z propozycją kosmetycznych poprawek.",
    tip: "Równoległe korzystanie z dwóch różnych modeli AI podnosi bezbłędność projektów o połowę."
  },
  {
    id: 34, day: 12, stage: 2,
    title: "Wersjonowanie w notatniku (Twój pierwszy backup)",
    goal: "Wdrożenie nawyku bezpiecznego eksperymentowania bez lęku przed zepsuciem.",
    desc: "Zanim przejdziesz do GitHuba, naucz się najprostszego mechanizmu obronnego: duplikowania plików przed wprowadzeniem ryzykownej zmiany.",
    prompt: "Skopiuj na dysku plik todo.html i nazwij kopię todo_backup_dziala.html. Teraz poproś AI o szaloną zmianę graficzną w pliku todo.html (np. styl retro Windows 95). Jeśli coś pójdzie nie tak – wiesz, że działająca wersja czeka bezpieczna w pliku obok.",
    expected: "Poczucie stuprocentowej wolności i odwagi do szalonych eksperymentów.",
    tip: "Najlepsi vibe coderzy psują rzeczy bez stresu, bo zawsze mają pod ręką punkt przywracania."
  },
  {
    id: 35, day: 12, stage: 2,
    title: "Mini-sprawdzian z szablonu C-C-O-F",
    goal: "Samodzielne stworzenie idealnego promptu czterofilarowego.",
    desc: "Pora sprawdzić, czy formuła C-C-O-F stała się Twoją drugą naturą przed wejściem w etap budowy pełnych mini-aplikacji.",
    prompt: "Napisz dla mnie prompt według szablonu C-C-O-F (Kontekst, Cel, Ograniczenia, Format), którego celem będzie stworzenie interaktywnego zegara cyfrowego ze stoperem. Wygeneruj ten zegar i sprawdź czy działa.",
    expected: "Otrzymasz bezbłędnie działający cyfrowy zegar ze stoperem.",
    tip: "Jeśli zegar ruszył z pierwszym promptem – opanowałeś sztukę promptingu na poziomie fundamentów!"
  },

  // ETAP 3 (Dni 13-19, Zadania 36-55)
  {
    id: 36, day: 13, stage: 3,
    title: "Kalkulator kalorii i zapotrzebowania BMR",
    goal: "Aplikacja przeliczająca wzory matematyczne na podstawie danych użytkownika.",
    desc: "Kalkulatory dietetyczne wykorzystują wzór Mifflina-St Jeora. Pokażemy AI, jak zamienić matematyczny wzór w kolorowy pasek postępu makroskładników.",
    prompt: "Stwórz pojedynczy plik HTML (Tailwind CSS) z Kalkulatorem BMR i Zapotrzebowania Kalorycznego. Pola wejściowe: Waga (kg), Wzrost (cm), Wiek, Płeć (Kobieta/Mężczyzna), Poziom aktywności fizycznej (lista rozwijana od siedzącej do bardzo aktywnej). Po kliknięciu 'Oblicz' pokaż dzienne kalorie oraz 3 kolorowe paski z gramami: Białko, Tłuszcze, Węglowodany.",
    expected: "Praktyczny, w pełni działający kalkulator dietetyczny.",
    tip: "Zwróć uwagę, jak AI samo wyszukuje właściwe wzory medyczne bez konieczności wpisywania ich z głowy."
  },
  {
    id: 37, day: 13, stage: 3,
    title: "Minutnik techniki Pomodoro z gongiem",
    goal: "Praca z upływem czasu rzeczywistego (odliczanie interwałowe).",
    desc: "Technika Pomodoro to 25 minut głębokiej pracy i 5 minut relaksu. Zbudujemy zegar z wielkimi cyframi, który powiadomi Cię dźwiękiem o końcu sesji.",
    prompt: "Napisz minutnik Pomodoro w jednym pliku HTML. Duży, minimalistyczny zegar na środku (25:00), przyciski: 'Start', 'Pauza', 'Reset' oraz przełącznik: 'Praca (25 min)' / 'Przerwa (5 min)'. Gdy czas dojdzie do 00:00, odtwórz głęboki dźwięk tybetańskiego gongu za pomocą Web Audio API.",
    expected: "Elegancki zegar odliczający sekundy i odtwarzający relaksujący dźwięk na koniec.",
    tip: "Ustaw czas testowy na 3 sekundy w prompcie, aby sprawdzić dźwięk gongu bez czekania 25 minut!"
  },
  {
    id: 38, day: 13, stage: 3,
    title: "Generator silnych haseł z kopiowaniem do schowka",
    goal: "Operacje na losowości znaków i interakcja ze schowkiem systemowym.",
    desc: "Bezpieczne hasła powinny mieć małe i wielkie litery, cyfry oraz znaki specjalne. Zbudujemy narzędzie przydatne każdemu w codziennym życiu.",
    prompt: "Stwórz nowoczesny Generator Bezpiecznych Haseł. Suwak długości (od 8 do 32 znaków), checkboxy: 'Wielkie litery', 'Cyfry', 'Znaki specjalne'. Duże pole z wygenerowanym hasłem, wskaźnik siły hasła (Słabe/Średnie/Pancerne) oraz przycisk 'Kopiuj do schowka' z zielonym powiadomieniem 'Skopiowano!'.",
    expected: "Generowanie losowych haseł i bezproblemowe kopiowanie ich jednym kliknięciem.",
    tip: "Funkcja navigator.clipboard.writeText pozwala skopiować dowolny tekst prosto do pamięci komputera."
  },
  {
    id: 39, day: 14, stage: 3,
    title: "Fiszki językowe z obrotem 3D karty",
    goal: "Trójwymiarowe animacje przestrzenne w CSS sterowane kliknięciem.",
    desc: "Fiszki do nauki słówek to świetny sposób na naukę języka. Przeglądarka potrafi obracać elementy w przestrzeni 3D dokładnie tak jak fizyczną kartę w dłoni.",
    prompt: "Napisz aplikację fiszek do nauki angielskich zwrotów biznesowych. Na środku ekranu znajduje się elegancka karta. Po kliknięciu karta płynnie obraca się w 3D wokół własnej osi o 180 stopni, pokazując polskie tłumaczenie i zdanie przykładowe. Na dole przyciski 'Umiem' (kolejna fiszka) oraz 'Powtórz'. Dodaj zestaw 5 przykładowych słówek.",
    expected: "Płynny, hipnotyzujący obrót karty w trójwymiarze po każdym kliknięciu.",
    tip: "Animacje transform: rotateY(180deg) są w całości renderowane przez kartę graficzną komputera."
  },
  {
    id: 40, day: 14, stage: 3,
    title: "Tygodniowy tracker nawyków z procentem postępu",
    goal: "Wizualizacja danych w regularnej siatce dni tygodnia.",
    desc: "Budowanie nawyków opiera się na łańcuchu powtórzeń (Don't break the chain). Zbudujemy siatkę 7 dni tygodnia dla 3 codziennych rytuałów.",
    prompt: "Stwórz Tygodniowy Tracker Nawyków w jednym pliku HTML (Tailwind). Trzy nawyki: 'Picie 2L wody', '30 min czytania', 'Gimnastyka'. Każdy nawyk ma 7 kwadracików (Poniedziałek - Niedziela). Kliknięcie kwadracika zmienia go na szmaragdowy z ptaszkiem. Na samej górze pasek ogólnego postępu tygodnia w procentach (0-100%). Zapisuj stan w localStorage.",
    expected: "Świetnie wyglądający pulpit nawyków, który pamięta Twoje codzienne sukcesy.",
    tip: "Śledzenie nawyków w samodzielnie stworzonej aplikacji daje 10 razy więcej frajdy niż komercyjne programy."
  },
  {
    id: 41, day: 14, stage: 3,
    title: "Przelicznik walut EUR <-> PLN w dwie strony",
    goal: "Jednoczesne przeliczanie wartości w dwóch powiązanych polach liczbowych.",
    desc: "Gdy wpisujesz kwotę w euro, pole złotówek przelicza się samo. Gdy wpisujesz w złotówkach – pole euro przelicza się w drugą stronę. To tzw. dwukierunkowe wiązanie danych.",
    prompt: "Stwórz dwukierunkowy przelicznik walut EUR <-> PLN. Dwa duże pola: 'Kwota w EUR' oraz 'Kwota w PLN'. Zmiana w dowolnym polu natychmiast aktualizuje drugie pole. Pomiędzy nimi pole edycji kursu (domyślnie 4.25 zł) oraz przycisk zamiany miejscami.",
    expected: "Błyskawiczne przeliczanie walut bez konieczności klikania przycisku 'Oblicz'.",
    tip: "Zdarzenie 'input' w JavaScript reaguje natychmiast na każde wciśnięcie klawisza na klawiaturze."
  },
  {
    id: 42, day: 15, stage: 3,
    title: "Płótno do rysowania myszką (HTML5 Canvas)",
    goal: "Pierwsze kroki z pikselami i rysowaniem po ekranie w elemencie canvas.",
    desc: "Element <canvas> to wirtualna tablica malarska wewnątrz przeglądarki, na której możesz rysować myszką, palcem lub pisać własne gry wideo.",
    prompt: "Napisz mini-program graficzny w pojedynczym pliku HTML: białe płótno canvas na środku, paleta wyboru 6 kolorów pędzla, suwak grubości linii oraz przycisk 'Wyczyść płótno'. Użytkownik ma móc swobodnie rysować myszką lub dotykiem.",
    expected: "Możesz malować linie po ekranie dokładnie tak jak w programie MS Paint!",
    tip: "Canvas to fundament, na którym powstają gry 2D i zaawansowane edytory graficzne w sieci."
  },
  {
    id: 43, day: 15, stage: 3,
    title: "Zapisywanie rysunku jako plik PNG na dysku",
    goal: "Konwersja zawartości płótna do prawdziwego pliku graficznego.",
    desc: "Stworzyłeś rysunek na płótnie, ale jak go zapisać? Przeglądarka potrafi przekształcić płótno canvas w ciąg danych PNG i pobrać na Twój komputer.",
    prompt: "Dodaj do programu do rysowania z Zadania 42 przycisk 'Pobierz mój rysunek (.png)'. Po kliknięciu ma natychmiast pobrać narysowany obrazek na dysk twardy pod nazwą moj_szkic.png.",
    expected: "Klikasz przycisk i otwierasz pobrany plik PNG w standardowej przeglądarce zdjęć systemu Windows.",
    tip: "Metoda canvas.toDataURL('image/png') tworzy obrazek z dowolnego rysunku w ułamku milisekundy."
  },
  {
    id: 44, day: 15, stage: 3,
    title: "Interaktywny quiz zliczający punkty i błędy",
    goal: "Zarządzanie stanem wieloetapowej gry z podsumowaniem punktacji.",
    desc: "Zbudujemy quiz z pytaniami o ciekawostki ze świata AI. Aplikacja zapamiętuje wybrane odpowiedzi i na końcu wręcza wirtualny dyplom.",
    prompt: "Stwórz interaktywny quiz wiedzy z 4 pytaniami o sztucznej inteligencji. Pytania pojawiają się po kolei. Po kliknięciu odpowiedzi poprawna podświetla się na zielono, a błędna na czerwono. Na końcu pokaż ekran wyników z oceną: 'Geniusz AI' (4/4), 'Na dobrej drodze' (2-3/4) lub 'Warto powtórzyć' (0-1/4) oraz przycisk 'Zagraj ponownie'.",
    expected: "Dynamiczna, wciągająca minigra edukacyjna.",
    tip: "Grywalizacja i natychmiastowy feedback kolorystyczny sprawiają, że nauka staje się przyjemnością."
  },
  {
    id: 45, day: 16, stage: 3,
    title: "Odtwarzacz relaksacyjnych szumów deszczu (Ambient)",
    goal: "Generowanie ciągłego szumu tła (Pink Noise) za pomocą czystej syntezy matematycznej.",
    desc: "Zamiast wgrywać 50-megabajtowy plik z nagraniem deszczu, syntezator w przeglądarce potrafi generować naturalny szum deszczu z czystych liczb losowych.",
    prompt: "Stwórz Generator Relaksującego Szumu Deszczu w jednym pliku HTML. Zastosuj czyste Web Audio API (generowanie szumu różowego/brązowego filtrowanego filtrem dolnoprzepustowym). Suwak natężenia deszczu, suwak odległych grzmotów oraz duży przycisk Play/Stop. Estetyczny, ciemny motyw z ikoną kropli deszczu.",
    expected: "Po kliknięciu Play ze słuchawek płynie uspokajający, realistyczny dźwięk letniego deszczu.",
    tip: "Taki generator nie zużywa transferu internetowego i może grać bez końca w tle podczas pracy."
  },
  {
    id: 46, day: 16, stage: 3,
    title: "Podgląd na żywo tekstu Markdown (Live Preview)",
    goal: "Parsowanie i formatowanie tekstu w czasie rzeczywistym.",
    desc: "Markdown to format, w którym rozmawiasz z AI (# Nagłówek, **pogrubienie**, - lista). Zbudujemy edytor z dwoma oknami obok siebie.",
    prompt: "Napisz edytor Markdown Live Preview z dwoma panelami obok siebie (lewy panel: pole do wpisywania tekstu, prawy panel: sformatowany podgląd na żywo). Użyj darmowej biblioteki 'marked' przez link CDN. Dodaj przykładowy tekst powitalny z nagłówkiem i listą punktowaną.",
    expected: "Wpisujesz tekst w lewym oknie, a w prawym oknie nagłówki i pogrubienia formatują się natychmiast.",
    tip: "W ten sam sposób działają profesjonalne programy do notatek, takie jak Notion czy Obsidian."
  },
  {
    id: 47, day: 16, stage: 3,
    title: "Pulpit pogodowy z animowanymi kafelkami",
    goal: "Projektowanie eleganckich dashboardów informacyjnych w stylu aplikacji Apple.",
    desc: "Aplikacja pogodowa w telefonie zachwyca płynnością i czytelnymi kafelkami wiatru, wilgotności i ciśnienia. Odtwórzmy ten luksusowy styl.",
    prompt: "Stwórz pulpit pogody dla Warszawy w stylu aplikacji pogodowej iOS: miękki gradient nieba w tle, duża temperatura 21°C, animowana ikona chmurki zza słońca oraz 4 kafelki ze wskaźnikami: Wilgotność (65%), Wiatr (14 km/h), Indeks UV (Umiarkowany), Ciśnienie (1015 hPa). Wykorzystaj Tailwind CSS.",
    expected: "Przepiękny, nowoczesny panel pogodowy wyglądający jak z najnowszego iPhone'a.",
    tip: "Kluczem do eleganckiego wyglądu (Glassmorphism) są półprzezroczyste tła: bg-white/10 backdrop-blur-md."
  },
  {
    id: 48, day: 17, stage: 3,
    title: "Połączenie z pierwszym darmowym API (Fakty o kotach)",
    goal: "Pierwsze prawdziwe pobranie żywych danych ze zdalnego serwera w internecie (funkcja fetch).",
    desc: "Do tej pory używaliśmy danych wpisanych w kodzie. Czas połączyć się z prawdziwym światem! API to okienko w chmurze, przez które komputery wymieniają się informacjami.",
    prompt: "Napisz pojedynczy plik HTML, który po kliknięciu przycisku 'Losuj koci fakt' łączy się z darmowym, publicznym API (https://catfact.ninja/fact) za pomocą funkcji fetch() i wyświetla pobrany po angielsku fakt w estetycznej ramce. Dodaj krótki wskaźnik ładowania 'Pobieram...'.",
    expected: "Klikasz przycisk i na ekranie pojawia się prawdziwy, unikalny fakt o kotach prosto z serwera w chmurze!",
    tip: "Publiczne API (bez konieczności logowania) to najlepszy poligon doświadczalny dla początkujących."
  },
  {
    id: 49, day: 17, stage: 3,
    title: "Obsługa braku internetu w aplikacji (Offline banner)",
    goal: "Budowanie aplikacji odpornych na zerwanie połączenia sieciowego.",
    desc: "Co się stanie, gdy użytkownik wejdzie do tunelu lub odłączy Wi-Fi? Zamiast zepsutej strony wyświetlimy mu przyjazny, żółty pasek ostrzegawczy.",
    prompt: "Zmodyfikuj aplikację pobierającą fakty z API. Jeśli wystąpi błąd połączenia lub wyłączę Wi-Fi, zamiast ciszy wyświetl miły żółty baner: 'Brak połączenia z siecią. Sprawdź internet i spróbuj ponownie' z przyciskiem 'Spróbuj jeszcze raz'.",
    expected: "Wyłącz na chwilę Wi-Fi, kliknij przycisk – aplikacja grzecznie poinformuje o braku sieci bez błędów w konsoli.",
    tip: "Zawsze przewiduj pesymistyczny scenariusz – w świecie IT nazywa się to Graceful Degradation."
  },
  {
    id: 50, day: 17, stage: 3,
    title: "Kalkulator napiwków i podziału rachunku na osoby",
    goal: "Aplikacja rozwiązująca realny problem towarzyski w restauracji.",
    desc: "Koniec z kłótniami przy stoliku o to, ile kto ma zapłacić i jaki dać napiwek! Zbudujemy proste, intuicyjne narzędzie do podziału kosztów.",
    prompt: "Stwórz pojedynczy plik HTML: 'Rachunek w restauracji'. Pola: Całkowita kwota rachunku (zł), przyciski wyboru napiwku: 10%, 15%, 20% oraz suwak liczby osób (od 1 do 10). Aplikacja ma natychmiast wyliczać i pokazywać wielkimi cyframi: 'Każda osoba płaci: X zł' oraz 'W tym napiwek: Y zł'.",
    expected: "Rewelacyjne, gotowe narzędzie na każde wyjście ze znajomymi do restauracji.",
    tip: "Pokaż tę aplikację znajomym na telefonie – zrobisz furorę przy najbliższym wspólnym obiedzie!"
  },
  {
    id: 51, day: 18, stage: 3,
    title: "Koło fortuny z losowaniem potrawy obiadowej",
    goal: "Płynna animacja obrotowa koła z fizyką hamowania.",
    desc: "Nie wiesz, co zjeść na obiad? Koło fortuny zakręci się, powoli wyhamuje i wskaże wylosowane danie (np. Pizza, Sushi, Pierogi, Makaron, Sałatka).",
    prompt: "Napisz interaktywne Koło Fortuny do losowania obiadu. Koło podzielone na 6 kolorowych wycinków z nazwami dań. Klikam przycisk 'Zakręć kołem!'. Koło wykonuje kilka szybkich obrotów, płynnie zwalnia i zatrzymuje się na wylosowanym polu. Na koniec wyświetla się komunikat: 'Dzisiaj na obiad: [Wylosowane Danie]!'.",
    expected: "Spektakularne, obracające się kolorowe koło z realistycznym spowolnieniem.",
    tip: "Animacje transition: cubic-bezier(...) pozwalają uzyskać realistyczny efekt bezwładności fizycznej."
  },
  {
    id: 52, day: 18, stage: 3,
    title: "Licznik słów i szacowany czas czytania artykułu",
    goal: "Analiza statystyczna tekstu w czasie rzeczywistym.",
    desc: "Portale internetowe (np. Medium) pokazują przy artykułach: 'Czas czytania: 4 minuty'. Odtwórzmy ten algorytm w kilka sekund.",
    prompt: "Stwórz analizator tekstu. Duże pole, do którego wklejam dowolny tekst artykułu. Poniżej na żywo aktualizują się wskaźniki: Liczba słów, Liczba znaków ze spacjami, Liczba akapitów oraz 'Szacowany czas czytania: X min Y sek' (zakładając średnie tempo czytania 200 słów na minutę).",
    expected: "Wklejasz długi artykuł i od razu wiesz, ile czasu zajmie jego lektura.",
    tip: "Funkcja text.trim().split(/\\s+/) to najszybszy sposób na zliczenie słów w tekście."
  },
  {
    id: 53, day: 18, stage: 3,
    title: "Kolorowanie składni kodu z biblioteką PrismJS",
    goal: "Profesjonalna prezentacja fragmentów kodu dla innych osób.",
    desc: "Czy zastanawiałeś się, dlaczego kod na blogach technicznych jest tak pięknie pokolorowany? To zasługa bibliotek typu PrismJS, które rozpoznają składnię języka.",
    prompt: "Napisz stronę prezentującą fragment kodu HTML/JavaScript z użyciem biblioteki PrismJS (motyw ciemny Okaidia przez CDN). Dodaj w prawym górnym rogu ramki przycisk 'Kopiuj kod', który po kliknięciu zmienia się na 'Skopiowano!' i kopiuje czysty kod do schowka.",
    expected: "Wyglądający jak z profesjonalnej dokumentacji technicznej blok kodu z kolorowaniem składni.",
    tip: "Dobra prezentacja kodu to klucz, gdy chcesz pokazać swoje osiągnięcia w mediach społecznościowych."
  },
  {
    id: 54, day: 19, stage: 3,
    title: "Wykresy słupkowe miesięcznych wydatków (Chart.js)",
    goal: "Wizualizacja danych finansowych za pomocą interaktywnych wykresów.",
    desc: "Człowiek myśli obrazami. Zamiast nudnej tabeli z cyframi zbudujemy dynamiczny, animowany wykres słupkowy z darmową biblioteką Chart.js.",
    prompt: "Użyj biblioteki Chart.js przez CDN, aby w pojedynczym pliku HTML narysować piękny wykres słupkowy domowego budżetu: Mieszkanie (2500 zł), Jedzenie (1800 zł), Transport (600 zł), Rozrywka (450 zł), Oszczędności (1000 zł). Słupki mają miękko narastać od dołu po załadowaniu strony, a najechanie myszką pokazuje dymek z kwotą.",
    expected: "Ruchomy, profesjonalny wykres słupkowy w estetycznych kolorach.",
    tip: "Chart.js potrafi rysować wykresy kołowe, liniowe, radarowe i słupkowe za pomocą zaledwie kilku linijek konfiguracji."
  },
  {
    id: 55, day: 19, stage: 3,
    title: "Sprawdzian samodzielności – Twoje autorskie narzędzie",
    goal: "Zbudowanie od zera pierwszego własnego narzędzia rozwiązującego Twój osobisty problem.",
    desc: "Najważniejszy moment w nauce: przestań kopiować przykłady i zbuduj coś, czego SAM potrzebujesz w swoim życiu, hobby lub pracy.",
    prompt: "Pomyśl o jednej powtarzalnej czynności w Twoim dniu (np. przelicznik jednostek wędkarskich, harmonogram nawożenia kwiatów doniczkowych, stoper do przerw przy biurku). Napisz kompletny prompt CCOF do AI, wygeneruj plik i przetestuj go.",
    expected: "Posiadasz na pulpicie swoje pierwsze, całkowicie autorskie narzędzie Vibe Codingu!",
    tip: "Właśnie przekroczyłeś granicę między biernym konsumentem technologii a aktywnym Twórcą."
  },

  // ETAP 4 (Dni 20-24, Zadania 56-70)
  {
    id: 56, day: 20, stage: 4,
    title: "Błąd to Twój przyjaciel – Zasada Copy-Paste błędu",
    goal: "Nauka prawidłowego zgłaszania błędów do AI bez strachu i paniki.",
    desc: "Początkujący na widok czerwonego napisu w konsoli myśli: 'Zepsułem wszystko'. Vibe Coder myśli: 'Super, komputer dokładnie powiedział mi, gdzie go boli!'.",
    prompt: "Wciśnij F12, przejdź do konsoli, skopiuj dokładnie cały czerwony komunikat błędu i wklej go do AI ze słowami: 'Wklejam ten błąd z konsoli przeglądarki. Wyjaśnij mi po ludzku w 2 zdaniach co poszło nie tak i podaj naprawiony fragment kodu'.",
    expected: "Model natychmiast zlokalizuje błąd i wyjaśni go przystępnym językiem.",
    tip: "Nigdy nie pisz do AI: 'Nie działa, napraw'. Zawsze wklejaj dokładną treść błędu z konsoli F12."
  },
  {
    id: 57, day: 20, stage: 4,
    title: "Śledzenie krok po kroku metodą console.log",
    goal: "Podglądanie tego, co dzieje się 'w głowie' programu w czasie rzeczywistym.",
    desc: "Funkcja console.log() to jak latarka w ciemnej jaskini. Pozwala podejrzeć zmienne i sprawdzić, do którego miejsca program dotarł przed wystąpieniem błędu.",
    prompt: "Dodaj do mojego kodu polecenia console.log() w 3 kluczowych miejscach, abym po wciśnięciu F12 widział meldunki: '1. Użytkownik kliknął przycisk', '2. Pobieram dane...', '3. Sukces: dane wyświetlone na ekranie'.",
    expected: "W konsoli F12 widzisz po kolei pojawiające się komunikaty potwierdzające każdy krok aplikacji.",
    tip: "Jeśli program milczy i nic się nie dzieje – console.log od razu pokaże, w którym miejscu się zatrzymał."
  },
  {
    id: 58, day: 20, stage: 4,
    title: "Zjawisko regresji – Kiedy AI psuje to co działało",
    goal: "Ratowanie projektu po nieudanej iteracji, w której model usunął wcześniejsze funkcje.",
    desc: "Zdarzyło Ci się, że poprosiłeś AI o mały guzik, a model wygenerował kod, w którym zniknął cały piękny wygląd? To zjawisko regresji (Regression).",
    prompt: "Stop. W nowej wersji kodu usunąłeś wcześniejszy ciemny motyw i układ kafelków. Przywróć pełny poprzedni kod z wszystkimi stylami i zaimplementuj nową funkcję tak, aby w żaden sposób nie dotykała istniejącego wyglądu.",
    expected: "Model przeprosi i przywróci pełną funkcjonalność z zachowaniem nowej poprawki.",
    tip: "Słowo 'STOP' na początku promptu zmusza model do zresetowania bieżącego toku rozumowania."
  },
  {
    id: 59, day: 21, stage: 4,
    title: "Wyjaśnij mi to jak hydraulikowi (Metafory techniczne)",
    goal: "Głębokie zrozumienie trudnych pojęć technicznych bez żargonu akademickiego.",
    desc: "Gdy AI rzuci pojęciem typu 'Asynchroniczność', 'CORS' lub 'Promise', nie udawaj że rozumiesz. Zażądaj analogii do codziennego życia.",
    prompt: "Użyłeś pojęcia 'Asynchroniczność (async/await)'. Wyjaśnij mi to pojęcie za pomocą analogii do pralki automatycznej lub kolejki w piekarni. Dlaczego przeglądarka nie zawiesza się, czekając na odpowiedź serwera?",
    expected: "Genialne, proste wyjaśnienie: wstawiasz pranie (zapytanie) i idziesz czytać książkę, zamiast stać 2 godziny przed bębnem pralki.",
    tip: "Jeśli potrafisz opowiedzieć o pojęciu technicznym babci lub dziecku – naprawdę je rozumiesz."
  },
  {
    id: 60, day: 21, stage: 4,
    title: "Gumowa kaczuszka AI (Rubber Duck Debugging)",
    goal: "Odnalezienie luki logicznej poprzez głośne opowiedzenie problemu sztucznej inteligencji.",
    desc: "Weterani programowania trzymają na biurku gumową kaczuszkę i opowiadają jej swój problem na głos. W 90% przypadków rozwiązanie przychodzi samo w trakcie mówienia!",
    prompt: "Wciel się w moją Gumową Kaczuszkę do debugowania. Będę Ci opisywać własnymi, potocznymi słowami, co według mnie moja aplikacja miała robić, a co dzieje się w rzeczywistości. Zadawaj mi krótkie pytania uściślające, dopóki wspólnie nie znajdziemy błędu logicznego.",
    expected: "Ciepła, wspierająca konwersacja diagnostyczna naprowadzająca na sedno problemu.",
    tip: "Często błąd nie tkwi w kodzie, lecz w sprzecznych założeniach w naszej własnej głowie."
  },
  {
    id: 61, day: 21, stage: 4,
    title: "Zbyt duży plik – Zastępowanie pojedynczej funkcji",
    goal: "Radzenie sobie z obcinaniem odpowiedzi przy długich plikach kodu.",
    desc: "Gdy kod ma 500 linijek, AI może urwać odpowiedź w połowie z powodu limitu tokenów. Profesjonalny vibe coder nie prosi o cały plik – prosi o chirurgiczną podmianę fragmentu.",
    prompt: "Nie generuj całego pliku od nowa! Podaj mi WYŁĄCZNIE poprawiony kod funkcji obliczKalorie(). Napisz mi dokładnie: po jakiej linijce mam go wkleić i co mam skasować ze starego kodu.",
    expected: "Krótki, 15-linijkowy fragment kodu gotowy do precyzyjnej podmiany w notatniku.",
    tip: "Oszczędzasz czas, transfer i unikasz ryzyka, że model popsuje resztę działającego pliku."
  },
  {
    id: 62, day: 22, stage: 4,
    title: "Inspekcja stylów na żywo w przeglądarce (F12)",
    goal: "Błyskawiczne testowanie kolorów i marginesów bezpośrednio w oknie Chrome.",
    desc: "Nie musisz za każdym razem pytać AI: 'A jakby ten przycisk był zielony?'. Możesz zmienić kolor na żywo w panelu F12 jednym kliknięciem myszki.",
    prompt: "Wciśnij F12. Kliknij ikonkę kursora ze strzałką w lewym górnym rogu panelu narzędzi. Kliknij na przycisk na swojej stronie. W panelu 'Styles' znajdź właściwość background-color i zmień kolor na żywo. Zobacz jak strona zmienia się natychmiast!",
    expected: "Błyskawiczna zmiana wyglądu bez dotykania pliku na dysku.",
    tip: "Pamiętaj: zmiany w F12 znikną po odświeżeniu strony (F5). Gdy znajdziesz ładny kolor – wklej go do pliku!"
  },
  {
    id: 63, day: 22, stage: 4,
    title: "Podgląd smartfona w trybie Responsive Device Toolbar",
    goal: "Testowanie widoku na iPhone i telefonach Samsung bez brania telefonu do ręki.",
    desc: "Przeglądarka potrafi udawać dowolny model telefonu komórkowego na świecie wprost na ekranie Twojego monitora.",
    prompt: "W oknie narzędzi F12 kliknij ikonkę dwóch ekranów 'Toggle device emulation' (lub wciśnij skrót Ctrl+Shift+M). Wybierz z górnej listy 'iPhone 14 Pro'. Zobacz, jak kursor zmienia się w kółeczko imitujące ludzki palec.",
    expected: "Ekran przeglądarki kurczy się do idealnych proporcji smartfona.",
    tip: "Możesz też obrócić wirtualny telefon do pozycji poziomej jednym kliknięciem ikonki obrotu."
  },
  {
    id: 64, day: 22, stage: 4,
    title: "Puste pole – Jak obronić się przed 'undefined'",
    goal: "Likwidacja najczęstszego wizualnego chochlika programistycznego.",
    desc: "Czy widziałeś kiedyś na stronie napis: 'Witaj, undefined!'? To oznacza, że program szukał imienia, ale go nie znalazł i wyświetlił techniczne słowo oznaczające nicość.",
    prompt: "W mojej aplikacji w miejscu imienia użytkownika pojawia się brzydki napis 'undefined' lub 'null', gdy ktoś nie wpisze danych. Jak zabezpieczyć kod za pomocą operatora fallback (||), aby w takim wypadku wyświetlało się eleganckie słowo 'Gość'?",
    expected: "Wyjaśnienie i prosty kod zabezpieczający: imie || 'Gość'.",
    tip: "Nazywa się to wartością domyślną (fallback value) – podstawa profesjonalnego interfejsu."
  },
  {
    id: 65, day: 23, stage: 4,
    title: "Testowanie skrajnych przypadków (Edge Cases)",
    goal: "Myślenie jak bezlitosny tester oprogramowania szukający dziury w całym.",
    desc: "Dobra aplikacja działa nie tylko wtedy, gdy użytkownik jest grzeczny. Co jeśli w polu wagi wpisze '-50', 'milion' albo słowo 'kupa'? Zabezpieczmy kod przed żartownisiami.",
    prompt: "Przeanalizuj mój formularz kalkulatora i wskaż 4 skrajne przypadki (Edge Cases), które mogłyby go zawiesić. Zabezpiecz kod tak, aby przy wpisaniu zera lub liczby ujemnej pojawiał się komunikat: 'Waga musi być liczbą dodatnią pomiędzy 20 a 300 kg'.",
    expected: "Odporny na złośliwości i błędy kod formularza.",
    tip: "Zasada ograniczonego zaufania: nigdy nie ufaj danym wpisywanym przez człowieka."
  },
  {
    id: 66, day: 23, stage: 4,
    title: "Walka z pamięcią podręczną przeglądarki (Twardy reset Ctrl+F5)",
    goal: "Rozwiązanie zagadki: 'Zmieniłem kod w notatniku, a strona wciąż wygląda po staremu!'.",
    desc: "Przeglądarki internetowe chcą oszczędzać transfer, więc zapamiętują pliki w pamięci podręcznej (Cache). Zwykłe F5 często nie wystarcza, by wymusić odświeżenie.",
    prompt: "Naucz się skrótu twardego odświeżania: przytrzymaj klawisz Ctrl i wciśnij F5 (na Macu: Cmd + Shift + R). Zapytaj AI: dlaczego przeglądarka pamięta stare wersje plików i jak temu zapobiec przy publikacji strony?",
    expected: "Błyskawiczne załadowanie świeżo zmodyfikowanego kodu prosto z dysku.",
    tip: "90% tajemniczych sytuacji typu 'przecież to zmieniłem' rozwiązuje twardy reset Ctrl+F5."
  },
  {
    id: 67, day: 23, stage: 4,
    title: "Porównywanie wersji kodu metodą różnic (Diff)",
    goal: "Szybkie namierzenie, która linijka spowodowała awarię programu.",
    desc: "Gdy coś działało 10 minut temu, a teraz nie działa – nie czytaj 300 linijek kodu. Poproś AI o porównanie różnicowe (tzw. diff).",
    prompt: "Wklejam dwie wersje kodu: <wersja_A_dzialajaca>...</wersja_A_dzialajaca> oraz <wersja_B_zepsuta>...</wersja_B_zepsuta>. Wskaż mi w punktach dokładnie, które linijki różnią te dwie wersje i co spowodowało zepsucie działania.",
    expected: "Precyzyjne wskazanie jednej brakującej klamry lub literówki w nazwie funkcji.",
    tip: "Narzędzia różnicowe (Diff) to podstawa pracy każdego inżyniera oprogramowania."
  },
  {
    id: 68, day: 24, stage: 4,
    title: "Optymalizacja szybkości ładowania strony",
    goal: "Sprawienie, aby aplikacja otwierała się w ułamku sekundy na każdym łączu.",
    desc: "Ciężkie biblioteki i nieoptymalne skrypty spowalniają stronę. Kilka prostych atrybutów potrafi przyspieszyć wczytywanie dwukrotnie.",
    prompt: "Przejrzyj mój plik HTML pod kątem szybkości ładowania. Wyjaśnij, czym różni się atrybut 'defer' od 'async' w tagu <script> i dodaj go do zewnętrznych bibliotek, aby skrypty nie blokowały rysowania ekranu.",
    expected: "Optymalizacja struktury sekcji <head> z zachowaniem pełnej funkcjonalności.",
    tip: "Szybka strona to wyższa pozycja w Google i zadowolenie użytkowników telefonów."
  },
  {
    id: 69, day: 24, stage: 4,
    title: "Walidacja kodu w oficjalnym walidatorze W3C",
    goal: "Sprawdzenie zgodności technicznej kodu z oficjalnymi standardami internetowymi.",
    desc: "W3C (World Wide Web Consortium) to organizacja tworząca standardy internetu. Posiada darmowe narzędzie, które sprawdza poprawność każdego znacznika HTML.",
    prompt: "Wejdź na stronę validator.w3.org/#validate_by_input. Wklej cały kod swojej strony i kliknij 'Check'. Jeśli pojawią się uwagi lub ostrzeżenia – skopiuj je do AI ze słowami: 'Oto raport walidatora W3C, popraw mój kod aby spełniał 100% standardów'.",
    expected: "Zielony komunikat o bezbłędnej walidacji dokumentu.",
    tip: "Czysty, zwalidowany kod gwarantuje, że strona otworzy się identycznie na każdej przeglądarce świata."
  },
  {
    id: 70, day: 24, stage: 4,
    title: "Złota zasada Vibe Debuggera",
    goal: "Ugruntowanie nawyków opanowania i metodycznego rozwiązywania problemów.",
    desc: "Ukończyłeś etap debugowania! Pora na mentalne podsumowanie: żaden błąd nie jest przeszkodą, każdy błąd to drogowskaz.",
    prompt: "Zredaguj dla mnie 'Dekalog Vibe Debuggera' – 5 żelaznych zasad radzenia sobie z problemami technicznymi przy tworzeniu oprogramowania z AI. Zapisz je w formie motywujących, zwięzłych haseł.",
    expected: "Mocny, inspirujący zbiór zasad przypominający o kopii zapasowej, konsoli F12 i precyzji promptu.",
    tip: "Wydrukuj ten dekalog lub zachowaj w notatkach – uratuje Cię w niejednym trudnym momencie."
  },

  // ETAP 5 (Dni 25-29, Zadania 71-85)
  {
    id: 71, day: 25, stage: 5,
    title: "Wizyta w v0.dev – Generowanie interfejsu z promptu",
    goal: "Poznanie przełomowego narzędzia v0 stworzonego przez firmę Vercel.",
    desc: "v0.dev to platforma nowej ery. Wpisujesz polecenie w języku angielskim lub polskim, a sztuczna inteligencja na Twoich oczach generuje komponenty w technologii React i Tailwind CSS.",
    prompt: "Wejdź na darmową stronę v0.dev. Wpisz prompt: 'A minimalist personal finance dashboard with monthly budget progress bar, recent transactions list, and green accent theme'. Zobacz, jak w 20 sekund powstaje gotowy projekt światowej klasy.",
    expected: "Podgląd interaktywnego, nowoczesnego dashboardu bezpośrednio w oknie przeglądarki.",
    tip: "v0 doskonale rozumie estetykę nowoczesnych startupów z San Francisco."
  },
  {
    id: 72, day: 25, stage: 5,
    title: "Edycja wizualna w v0 – Zaznacz i popraw",
    goal: "Łączenie języka naturalnego z bezpośrednim wskazywaniem elementów na ekranie.",
    desc: "Nie musisz opisywać całego ekranu. W v0 klikasz ikonkę kursora, klikasz na konkretny kafelek i piszesz tylko to, co ma się w nim zmienić.",
    prompt: "W v0 kliknij narzędzie zaznaczania, kliknij na główny przycisk na wygenerowanej stronie i wpisz: 'Make this button rounded with a subtle shadow and change text to \"Dodaj wydatek\"'.",
    expected: "Błyskawiczna zmiana wskazanego elementu bez naruszania pozostałych części strony.",
    tip: "To esencja vibe codingu: wskazujesz palcem i mówisz, jak ma być."
  },
  {
    id: 73, day: 25, stage: 5,
    title: "Pobieranie i eksport kodu z chmury v0",
    goal: "Przeniesienie wygenerowanego projektu z chmury na własny komputer.",
    desc: "Projekt stworzony w v0 nie musi zostawać na serwerach Vercel. Możesz podejrzeć wygenerowany kod, skopiować go lub pobrać.",
    prompt: "W prawym górnym rogu platformy v0 kliknij zakładkę 'Code'. Zobacz wygenerowane pliki. Poproś AI: 'Przekonwertuj ten komponent React z v0 na pojedynczy, czysty plik HTML z Tailwind CSS, abym mógł go otworzyć na pulpicie'.",
    expected: "Zapisujesz plik na dysku i cieszysz się projektem z v0 działającym lokalnie offline.",
    tip: "Zawsze możesz poprosić dowolne AI o uproszczenie kodu React do pojedynczego pliku HTML."
  },
  {
    id: 74, day: 26, stage: 5,
    title: "Bolt.new – Środowisko Fullstack w jednej karcie",
    goal: "Uruchomienie pełnego serwera i środowiska programistycznego bezpośrednio w przeglądarce.",
    desc: "Bolt.new (stworzony przez StackBlitz) wykorzystuje technologię WebContainers. Cały system operacyjny i serwer działają wewnątrz karty Twojej przeglądarki!",
    prompt: "Otwórz w przeglądarce stronę bolt.new. Wpisz prompt: 'Stwórz interaktywny planer podróży wakacyjnych z listą rzeczy do spakowania, budżetem i mapą miejsc do odwiedzenia'. Obserwuj, jak AI samo instaluje pakiety i uruchamia aplikację na żywo.",
    expected: "W prawej części okna zobaczysz działającą pełnowymiarową aplikację internetową.",
    tip: "Bolt.new sam naprawia błędy w terminalu – jeśli coś nie działa, po prostu kliknij przycisk 'Fix error'."
  },
  {
    id: 75, day: 26, stage: 5,
    title: "Rozmowa z terminalem w Bolt.new",
    goal: "Zrozumienie, że nowoczesne AI samo zarządza bibliotekami i komendami konsoli.",
    desc: "Kiedyś instalowanie bibliotek wymagało znajomości setek komend typu npm install, vite build, docker run. W Bolt.new po prostu mówisz, co chcesz dodać.",
    prompt: "W oknie czatu Bolt.new wpisz: 'Dodaj bibliotekę confetti, aby po spakowaniu wszystkich rzeczy z listy wystrzeliwało konfetti sukcesu oraz dodaj zapisywanie danych'. Obserwuj polecenia w terminalu.",
    expected: "AI samodzielnie pobiera pakiety, dopisuje kod i odświeża podgląd na żywo.",
    tip: "Nie musisz znać komend terminala – AI jest Twoim wirtualnym administratorem systemu."
  },
  {
    id: 76, day: 26, stage: 5,
    title: "Lovable.dev – Aplikacje z bazą danych i logowaniem",
    goal: "Poznanie platformy Lovable łączącej design z prawdziwą bazą danych.",
    desc: "Lovable.dev to jedno z najgorętszych narzędzi 2025/2026 roku. Potrafi w kilka minut stworzyć aplikację z kontami użytkowników, logowaniem i bazą danych Supabase.",
    prompt: "Wejdź na darmowe lovable.dev. Wpisz pomysł na aplikację: 'Tablica ogłoszeń sąsiedzkich o pożyczaniu narzędzi (np. wiertarka, drabina) z kafelkami przedmiotów i formularzem dodawania'.",
    expected: "Wygenerowanie pięknej, kompletnej platformy webowej z gotową strukturą danych.",
    tip: "Lovable projektuje interfejsy z dbałością o mikrointerakcje i animacje."
  },
  {
    id: 77, day: 27, stage: 5,
    title: "Tworzenie specyfikacji PRD (Product Requirements Document)",
    goal: "Kluczowa umiejętność mistrza Vibe Codingu – pisanie dokumentu wymagań przed kodowaniem.",
    desc: "Zamiast pisać do AI jednozdaniowe polecenia, stwórz najpierw jednostronicowy dokument PRD. To przepis architektoniczny, który gwarantuje spójność projektu.",
    prompt: "Wciel się w rolę Product Managera. Pomóż mi napisać 1-stronicowy dokument specyfikacji (PRD) dla aplikacji do rezerwacji biurek w biurze coworkingowym. Uwzględnij: Cel biznesowy, Profile użytkowników, Listę 4 kluczowych ekranów, Zasady rezerwacji oraz Ograniczenia techniczne.",
    expected: "Ustrukturyzowany, profesjonalny dokument specyfikacji gotowy do nakarmienia dowolnego AI.",
    tip: "Gdy dasz generatorowi kodów dokument PRD zamiast jednego zdania – jakość wzrasta dziesięciokrotnie."
  },
  {
    id: 78, day: 27, stage: 5,
    title: "Karmienie generatorów plikiem specyfikacji PRD",
    goal: "Budowa kompletnego oprogramowania na podstawie kompleksowej specyfikacji.",
    desc: "Teraz bierzemy dokument z Zadania 77 i wklejamy go w całości do Bolt.new, Lovable lub Claude Artifacts.",
    prompt: "Zbuduj kompletną aplikację ściśle według poniższego dokumentu wymagań PRD: [Tutaj wklej tekst wygenerowanego w poprzednim zadaniu dokumentu PRD]. Zadbaj o nowoczesny design i intuicyjną obsługę.",
    expected: "Powstaje dojrzała, przemyślana aplikacja z wszystkimi wymaganymi ekranami i funkcjami.",
    tip: "Architektura przed kodowaniem to jedyna droga do budowy zaawansowanych systemów bez chaosu."
  },
  {
    id: 79, day: 27, stage: 5,
    title: "Wprowadzenie do edytora Cursor IDE",
    goal: "Pierwsze spotkanie z najpopularniejszym edytorem programistycznym epoki sztucznej inteligencji.",
    desc: "Cursor to zmodyfikowana wersja Visual Studio Code z głęboko zintegrowanym modelem językowym, który widzi każdy plik i folder w Twoim projekcie.",
    prompt: "Pobierz darmowy edytor Cursor ze strony cursor.com. Zainstaluj go i otwórz w nim folder z Twoimi dotychczasowymi plikami HTML. Zobacz znajome pliki w lewym drzewie katalogów.",
    expected: "Twój własny profesjonalny warsztat programistyczny na dysku komputera.",
    tip: "Cursor to narzędzie numer 1 używane przez profesjonalnych programistów i vibe coderów na świecie."
  },
  {
    id: 80, day: 28, stage: 5,
    title: "Skrót Ctrl+K w Cursorze – Magiczny pędzel w kodzie",
    goal: "Edycja kodu za pomocą poleceń w języku naturalnym bezpośrednio wewnątrz pliku.",
    desc: "Skrót Ctrl+K (Cmd+K na Macu) w edytorze Cursor pozwala zaznaczyć dowolny fragment kodu i powiedzieć po polsku, co chcesz w nim zmienić.",
    prompt: "W edytorze Cursor zaznacz myszką kod przycisku, wciśnij skrót klawiszowy Ctrl + K, wpisz w okienko: 'Dodaj delikatny cień pod przyciskiem i zrób większe zaokrąglenie rogów' i wciśnij Enter. Zaakceptuj zielone zmiany klawiszem Ctrl + Enter.",
    expected: "Kod modyfikuje się na Twoich oczach w pliku, pokazując zielone linie zmian.",
    tip: "Nie musisz kopiować kodu tam i z powrotem do przeglądarki – AI działa wprost w Twoim edytorze."
  },
  {
    id: 81, day: 28, stage: 5,
    title: "Skrót Ctrl+L w Cursorze – Czat z całą bazą projektu",
    goal: "Zadawanie pytań modelowi, który ma w pamięci wszystkie pliki Twojego komputera.",
    desc: "Skrót Ctrl+L otwiera boczny panel czatu w edytorze Cursor. Model zna strukturę całego Twojego folderu.",
    prompt: "W Cursorze wciśnij Ctrl + L. Wpisz w panelu: 'Przejrzyj wszystkie pliki w tym folderze. Gdzie znajduje się funkcja odpowiedzialna za zapisywanie danych do localStorage i jak mogę dodać potwierdzenie usunięcia?'.",
    expected: "AI wskaże dokładny plik i numer linijki, w której znajduje się szukana funkcja.",
    tip: "Możesz wpisać symbol @ w czacie Cursora, aby wskazać konkretny plik, dokumentację lub folder."
  },
  {
    id: 82, day: 28, stage: 5,
    title: "Plik reguł projektowych .cursorrules",
    goal: "Wymuszenie na sztucznej inteligencji stałych zasad zachowania w każdym poleceniu.",
    desc: "Plik .cursorrules umieszczony w głównym folderze to konstytucja Twojego projektu. Za każdym razem, gdy AI generuje kod, czyta najpierw Twoje reguły.",
    prompt: "Stwórz w folderze projektu plik o nazwie .cursorrules. Wklej do niego 4 zasady: 1. Zawsze odpowiadaj po polsku. 2. Używaj wyłącznie czystego Tailwind CSS. 3. Dbaj o pełną dostępność WCAG 2.1 AA. 4. Pisz kod prosty i dobrze skomentowany.",
    expected: "AI w kolejnych poleceniach automatycznie przestrzega Twoich zasad bez przypominania.",
    tip: "Plik reguł oszczędza setki powtórzeń tych samych wytycznych w codziennej pracy."
  },
  {
    id: 83, day: 29, stage: 5,
    title: "Przekształcanie szkicu z kartki papieru w działający kod",
    goal: "Multimodalność AI: zamiana odręcznego rysunku ze smartfona w klikalny interfejs.",
    desc: "To jeden z najbardziej magicznych momentów w technologii. Rysujesz flamastrem na serwetce lub kartce, robisz zdjęcie i masz stronę WWW!",
    prompt: "Narysuj na kartce papieru prosty układ strony: nagłówek z logo, 3 kafelki usług i duży przycisk na dole. Zrób zdjęcie telefonem. Wgraj plik ze zdjęciem do Claude, Gemini lub v0 z podpisem: 'Oto mój odręczny szkic interfejsu. Zamień go w działający, nowoczesny plik HTML z Tailwind CSS'.",
    expected: "Sztuczna inteligencja odczyta Twój rysunek i wygeneruje wierną, cyfrową stronę WWW!",
    tip: "Nie musisz być artystą – wystarczą zwykłe prostokąty z podpisami 'tutaj zdjęcie', 'tutaj tekst'."
  },
  {
    id: 84, day: 29, stage: 5,
    title: "Tajemnica kluczy API (API Key) i ich bezpieczeństwo",
    goal: "Zrozumienie, czym jest klucz dostępowy i jak chronić swoje konto przed wyciekiem.",
    desc: "Klucz API to jak magnetyczna karta do Twojego pokoju hotelowego. Jeśli zostawisz ją na korytarzu, każdy może wejść i skorzystać z Twojego rachunku.",
    prompt: "Zapytaj AI: 'Czym jest klucz API (API Key)? Wyjaśnij to prostym językiem. Dlaczego NIGDY nie wolno wklejać prywatnego klucza API w publicznym kodzie na GitHubie i co to jest plik .env?'.",
    expected: "Klarowne wyjaśnienie zasad cyberhigieny i ochrony prywatnych kluczy dostępowych.",
    tip: "Nigdy nie wysyłaj kluczy zaczynających się od 'sk-...' na publiczne fora ani w postach w sieci."
  },
  {
    id: 85, day: 29, stage: 5,
    title: "Plik .env i zasady ukrywania haseł przed światem",
    goal: "Poznanie standardu izolacji danych poufnych w pliku konfiguracyjnym.",
    desc: "Programiści przechowują sekrety w specjalnym pliku .env, a plik .gitignore nakazuje systemowi ignorować go przy wysyłaniu kodu do internetu.",
    prompt: "Poproś AI: 'Pokaż mi wzorcowy przykład pliku .env dla aplikacji łączącej się ze sztuczną inteligencją oraz pokaż jak powinien wyglądać wpis w pliku .gitignore, aby bezpiecznie chronić ten plik'.",
    expected: "Przejrzysta instrukcja konfiguracji bezpiecznego środowiska programistycznego.",
    tip: "Dobra higiena cyfrowa od pierwszego dnia to cecha dojrzałego twórcy."
  },

  // ETAP 6 (Dni 30-34, Zadania 86-100)
  {
    id: 86, day: 30, stage: 6,
    title: "Założenie darmowego konta na platformie GitHub",
    goal: "Rejestracja w globalnym domu wszystkich twórców oprogramowania.",
    desc: "GitHub to największa platforma programistyczna świata, należąca do Microsoftu. Przechowuje kod milionów projektów i oferuje darmowy hosting.",
    prompt: "Wejdź na stronę github.com. Zarejestruj darmowe konto (podaj swój e-mail i hasło). Po zalogowaniu kliknij zielony przycisk 'New' i utwórz swoje pierwsze publiczne repozytorium o nazwie 'moj-vibe-projekt'.",
    expected: "Posiadasz własny profil na GitHubie z pierwszym założonym projektem.",
    tip: "Twój profil na GitHubie stanie się w przyszłości Twoim najlepszym cyfrowym portfolio."
  },
  {
    id: 87, day: 30, stage: 6,
    title: "Wrzucenie pliku metodą Drag & Drop do repozytorium",
    goal: "Publikacja kodu w chmurze GitHuba bez konieczności używania komend konsolowych.",
    desc: "Nie musisz uczyć się komend git commit czy git push z czarnego okna terminala. GitHub pozwala po prostu przeciągnąć plik myszką w oknie przeglądarki!",
    prompt: "Na stronie swojego nowego repozytorium na GitHubie kliknij link 'uploading an existing file'. Przeciągnij myszką plik index.html ze swojego komputera w wyznaczone pole i kliknij zielony przycisk 'Commit changes'.",
    expected: "Twój plik index.html spoczywa bezpiecznie w chmurze serwerów GitHuba.",
    tip: "Pamiętaj, aby główny plik strony zawsze nazywał się dokładnie index.html (małymi literami)."
  },
  {
    id: 88, day: 30, stage: 6,
    title: "Uruchomienie darmowego hostingu GitHub Pages",
    goal: "Włączenie darmowego hostingu – Twoja strona żyje w publicznym internecie!",
    desc: "GitHub Pages to darmowa usługa, która zamienia Twoje repozytorium w prawdziwą, publicznie dostępną stronę z szyfrowaniem HTTPS.",
    prompt: "W swoim repozytorium przejdź do zakładki 'Settings' (Ustawienia), z lewego menu wybierz 'Pages'. W sekcji 'Branch' zmień 'None' na 'main' i kliknij 'Save'. Odczekaj około 60 sekund i odśwież stronę.",
    expected: "Otrzymasz prawdziwy link internetowy (np. https://twojnick.github.io/moj-vibe-projekt/), który możesz otworzyć na smartfonie!",
    tip: "Wyślij ten link mamie, znajomym lub współpracownikom – właśnie opublikowałeś swoją stronę w globalnej sieci!"
  },
  {
    id: 89, day: 31, stage: 6,
    title: "Publikacja strony w 10 sekund przez Netlify Drop",
    goal: "Alternatywny, błyskawiczny hosting z automatycznym certyfikatem SSL.",
    desc: "Netlify Drop to najprostszy hosting na świecie. Nie musisz nawet zakładać konta na GitHubie – wystarczy przeciągnąć folder ze stroną myszką.",
    prompt: "Wejdź na stronę app.netlify.com/drop. Przeciągnij folder ze swoją stroną w wyznaczone pole na ekranie. Zobacz jak po 5 sekundach generuje się działający adres URL.",
    expected: "Natychmiastowe uruchomienie strony na bezpiecznym serwerze w chmurze.",
    tip: "Netlify Drop to idealne narzędzie do natychmiastowego pokazywania klientom wersji demonstracyjnych."
  },
  {
    id: 90, day: 31, stage: 6,
    title: "Zmiana darmowego adresu na własną ładną subdomenę",
    goal: "Personalizacja adresu internetowego na czytelną, łatwą do podyktowania nazwę.",
    desc: "Domyślne adresy wyglądają jak 'brave-curie-87a12b.netlify.app'. Możesz za darmo zmienić losowy ciąg na ładną, własną nazwę.",
    prompt: "W panelu Netlify wejdź w 'Site configuration' -> 'Change site name'. Wpisz wybraną nazwę, np. 'moja-kawiarnia-krakow' i kliknij Save.",
    expected: "Twoja strona zyskuje profesjonalny adres: https://moja-kawiarnia-krakow.netlify.app.",
    tip: "Taki adres możesz bez wstydu wydrukować na wizytówce lub wkleić w mediach społecznościowych."
  },
  {
    id: 91, day: 31, stage: 6,
    title: "Odbieranie wiadomości z formularza bez serwera (Netlify Forms)",
    goal: "Zbieranie zapytań i wiadomości od klientów prosto do Twojej skrzynki e-mail.",
    desc: "W tradycyjnym programowaniu formularz kontaktowy wymagał serwera w PHP lub Pythonie. Netlify potrafi odebrać formularz dzięki jednemu słowu kluczowemu w HTML.",
    prompt: "Zapytaj AI: 'Jak dodać magiczny atrybut netlify (lub data-netlify=\"true\") do mojego znacznika <form> w HTML, aby po wysłaniu formularza na Netlify wiadomość automatycznie trafiała do mojego panelu administracyjnego i na mój e-mail?'.",
    expected: "Wypełniasz formularz na opublikowanej stronie i po minucie odbierasz powiadomienie e-mail z treścią wiadomości!",
    tip: "Zero serwera, zero baz danych, 100% niezawodności."
  },
  {
    id: 92, day: 32, stage: 6,
    title: "Utworzenie darmowej bazy danych w Supabase",
    goal: "Pierwsze spotkanie z relacyjną bazą danych SQL w chmurze.",
    desc: "Supabase to darmowa platforma bazodanowa open-source. Przypomina arkusz kalkulacyjny w chmurze, do którego Twoja aplikacja może bezpiecznie zapisywać dane.",
    prompt: "Zarejestruj darmowe konto na supabase.com. Kliknij 'New project'. Po utworzeniu bazy wejdź w zakładkę 'Table Editor' i stwórz tabelę 'notatki' z kolumnami: id (domyślna) oraz treść (kolumna o nazwie 'tresc', typ text).",
    expected: "Widzisz tabelę przypominającą Excela, gotową na przyjęcie danych z całego świata.",
    tip: "Supabase daje w darmowym planie bazę PostgreSQL mieszczącą setki tysięcy wpisów."
  },
  {
    id: 93, day: 32, stage: 6,
    title: "Łączenie aplikacji z bazą Supabase przez prompt",
    goal: "Zapisywanie danych z formularza bezpośrednio do globalnej bazy danych.",
    desc: "Połączymy nasz interfejs z bazą danych Supabase za pomocą oficjalnej biblioteki wczytanej przez link CDN.",
    prompt: "Oto mój URL projektu i klucz anonimowy z Supabase: [Tutaj Twoje dane]. Napisz skrypt w HTML/JS, który łączy się z moją tabelą 'notatki' i po kliknięciu przycisku 'Zapisz w chmurze' natychmiast dodaje nowy wiersz do bazy danych.",
    expected: "Wpisujesz notatkę na telefonie, odświeżasz panel Supabase na komputerze – nowy wiersz już tam jest!",
    tip: "Dane w Supabase są trwałe – przetrwają nawet jeśli sformatujesz komputer."
  },
  {
    id: 94, day: 32, stage: 6,
    title: "Zabezpieczenie danych regułami RLS (Row Level Security)",
    goal: "Podstawy bezpieczeństwa bazodanowego – ochrona danych przed nieuprawnionym odczytem.",
    desc: "Row Level Security (RLS) to kłódka na poziomie każdego wiersza bazy danych. Decyduje o tym, kto ma prawo oglądać, a kto edytować dane wpisy.",
    prompt: "Zapytaj AI: 'Co to jest Row Level Security (RLS) w Supabase? Wyjaśnij to prostym językiem i napisz prostą regułę SQL, która pozwoli każdemu anonimowo czytać wpisy, ale dodawać tylko nowe'.",
    expected: "Włączenie zielonej kłódki RLS w panelu Supabase i poczucie pełnego bezpieczeństwa danych.",
    tip: "Zawsze włączaj RLS w Supabase – to żelazna tarcza przed nieautoryzowanym dostępem."
  },
  {
    id: 95, day: 33, stage: 6,
    title: "Własna Favicona i miniatura OpenGraph dla mediów",
    goal: "Zadbanie o profesjonalny podgląd linku na Facebooku, Messengerze i LinkedInie.",
    desc: "Gdy wklejasz link w komunikatorze, pojawia się miniatura ze zdjęciem i tytułem. Za ten efekt odpowiadają tagi OpenGraph w sekcji <head>.",
    prompt: "Wygeneruj dla mojego projektu komplet tagów meta OpenGraph (og:title, og:description, og:image) oraz nowoczesną ikonkę favicony w postaci emotikony ⚡ załadowanej przez serwis fav.farm.",
    expected: "Wklej link do swojej strony w darmowym narzędziu metatags.io – zobaczysz profesjonalną kartę podglądu społecznościowego!",
    tip: "Atrakcyjna miniatura zwiększa klikalność Twojego linku w mediach społecznościowych o 400%."
  },
  {
    id: 96, day: 33, stage: 6,
    title: "Przekształcenie strony w aplikację PWA na smartfon",
    goal: "Instalacja strony na ekranie głównym telefonu jak aplikacji z Google Play / App Store.",
    desc: "Progressive Web App (PWA) to technologia pozwalająca zainstalować stronę internetową na pulpicie telefonu komórkowego. Aplikacja zyskuje własną ikonę i działa bez paska adresu przeglądarki!",
    prompt: "Stwórz dla mojego projektu prosty plik manifest.json oraz zarejestruj minimalistyczny Service Worker, aby po wejściu na stronę na telefonie pojawił się komunikat: 'Dodaj do ekranu głównego'.",
    expected: "Klikasz 'Dodaj do ekranu głównego' na telefonie – Twoja aplikacja ląduje na pulpicie smartfona obok Instagrama!",
    tip: "PWA nie wymaga płacenia 99 dolarów rocznie za konto deweloperskie w Apple ani czekania na akceptację w App Store."
  },
  {
    id: 97, day: 33, stage: 6,
    title: "Wysyłanie powiadomień systemowych (Web Notifications API)",
    goal: "Wysyłanie powiadomień na pulpit komputera lub ekran telefonu.",
    desc: "Powiadomienia push pomagają utrzymać regularność nawyków. Przeglądarka potrafi wyświetlać natywne powiadomienia w systemie Windows, macOS i Android.",
    prompt: "Napisz funkcję, która pyta użytkownika o zgodę na powiadomienia (Notification.requestPermission) i po kliknięciu przycisku 'Przypomnij o ćwiczeniu' wyświetla systemowe powiadomienie na pulpicie z dźwiękiem i ikoną.",
    expected: "W prawym dolnym rogu Windowsa wyskakuje prawdziwy systemowy dymek z powiadomieniem z Twojej strony!",
    tip: "Powiadomienia wymagają wyraźnej zgody użytkownika – szanuj prywatność swoich odbiorców."
  },
  {
    id: 98, day: 34, stage: 6,
    title: "Końcowy audyt dostępności WCAG za pomocą Google Lighthouse",
    goal: "Oficjalna weryfikacja i uzyskanie certyfikatu jakości 100/100 punktów.",
    desc: "Google Lighthouse to oficjalne narzędzie wbudowane w przeglądarkę Chrome, które testuje wydajność, dostępność (Accessibility), SEO i dobre praktyki.",
    prompt: "W Chrome na swojej opublikowanej stronie wciśnij F12, przejdź do zakładki 'Lighthouse', zaznacz opcję 'Accessibility' i kliknij 'Analyze page load'. Skopiuj ewentualne uwagi do AI i napraw je, aż uzyskasz zielony wynik 100 punktów.",
    expected: "Zielone koło z liczbą 100/100 w kategorii Dostępność Cyfrowa (Accessibility)!",
    tip: "Wynik 100 punktów w Lighthouse to powód do dumy, którym możesz pochwalić się w CV."
  },
  {
    id: 99, day: 34, stage: 6,
    title: "Ostateczny szlif i refaktoryzacja całego projektu",
    goal: "Doprowadzenie kodu do stanu wzorcowego przed uroczystym finałem.",
    desc: "Przed wielką premierą warto uporządkować pliki: usunąć niepotrzebne komentarze testowe, sformatować wcięcia i upewnić się, że kod jest czytelny dla każdego.",
    prompt: "Wklej swój finalny kod do najbardziej zaawansowanego modelu (np. Claude 3.5 Sonnet lub Gemini Pro) ze słowami: 'Oto moja ukończona aplikacja. Przeprowadź ostateczny audyt czystości: uporządkuj strukturę, dodaj wyczerpujące polskie komentarze dydaktyczne i upewnij się, że semantyka HTML5 jest bezbłędna'.",
    expected: "Lśniący, doskonale zorganizowany i czytelny kod źródłowy.",
    tip: "Dobry kod to taki, który po roku przeczytasz ze zrozumieniem i uśmiechem."
  },
  {
    id: 100, day: 34, stage: 6,
    title: "Twój Egzamin Mistrzowski – Wielka Premiera Vibe Codera!",
    goal: "Samodzielna realizacja kompletnego projektu od idei do wdrożenia i świętowanie sukcesu.",
    desc: "Przebyłeś niezwykłą drogę: od osoby, która nigdy nie napisała linijki kodu, do twórcy potrafiącego powoływać do życia działające aplikacje w globalnej sieci internetowej!",
    prompt: "Wykonaj swój Egzamin Mistrzowski:\n1. Wymyśl aplikację rozwiązującą realny problem w Twojej pracy lub domu.\n2. Napisz do niej specyfikację PRD.\n3. Zbuduj ją za pomocą wybranego narzędzia (v0, Bolt, Lovable, Claude lub Cursor).\n4. Opublikuj ją na Netlify lub GitHub Pages.\n5. Pokaż ją światu i odbierz zasłużone gratulacje!",
    expected: "Oficjalne uzyskanie statusu certyfikowanego, w pełni samodzielnego Vibe Codera nowej ery! 🚀🎓",
    tip: "Nie zatrzymuj się! Świat potrzebuje Twoich pomysłów. Kod jest teraz tylko kwestią właściwie sformułowanej myśli."
  }
];

// =========================================================================
// SPIS DEDYKOWANYCH, LOGICZNYCH ULEPSZEŃ DLA KAŻDEGO ZADANIA KODOWEGO
// Każde zadanie posiada własne, dopasowane do tematu opcje rozwoju,
// powiązane logicznie z jego kodem, a nie z poprzednimi projektami.
// =========================================================================
const TASK_ENHANCEMENT_PRESETS = {
  // Zadanie 3 (Dzień 1): Wizytówka kawiarni
  3: {
    taskTitle: "Wizytówka Kawiarni Kofeinowy Raj",
    baseName: "Kawiarnia Kofeinowy Raj (Zadanie 3)",
    presets: {
      menu: {
        title: "☕ Menu kaw z opisem i cenami",
        desc: "Karta 4 specjałów z nutami smakowymi, cenami w PLN i ikonami",
        goal: "Karta Menu kawiarni: dodaj estetyczną sekcję menu kawiarni z 4 propozycjami (Espresso, Cappuccino, Flat White, Drip Specialty) wraz z cenami w PLN, opisem nut smakowych oraz ikonami kaw.",
        constraint: "Wkomponuj menu harmonijnie w ciepłą paletę barw kawiarni (odcienie kawy i mleka)."
      },
      reservation: {
        title: "📅 Formularz rezerwacji stolika",
        desc: "Wybór daty, godziny, liczby gości i serdeczne potwierdzenie",
        goal: "Formularz rezerwacji: dodaj prosty formularz rezerwacji stolika zawierający pola: Imię, Data, Godzina, Liczba gości oraz przycisk 'Zarezerwuj stolik', który po kliknięciu wyświetla serdeczne podziękowanie.",
        constraint: "Wszystkie pola formularza muszą posiadać czytelne etykiety <label> i wysoki kontrast."
      },
      hours: {
        title: "📍 Godziny otwarcia i mapa dojazdu",
        desc: "Tabela godzin z podświetleniem dzisiejszego dnia oraz wskazówki",
        goal: "Godziny i lokalizacja: dodaj sekcję z godzinami otwarcia (od poniedziałku do niedzieli), która automatycznie podświetla dzisiejszy dzień tygodnia, oraz adres lokalu z przyciskiem 'Jak dojechać'.",
        constraint: "Tabela musi być semantyczna i w pełni czytelna dla czytników ekranu."
      },
      sound: {
        title: "🎵 Dźwięk dzwonka kawiarni",
        desc: "Ciepły ton dzwonka wejściowego Web Audio API po kliknięciu",
        goal: "Dźwięk kawiarni: dodaj ciepły, krótki dźwięk mosiężnego dzwonka wejściowego (Web Audio API) po kliknięciu przycisku 'Zadzwoń do kawiarni' lub wysłaniu rezerwacji.",
        constraint: "Dźwięk ma być czysty, syntezowany w przeglądarce bez zewnętrznych plików mp3."
      },
      darkmode: {
        title: "🌓 Tryb Dzień / Nastrojowy Wieczór",
        desc: "Ciepła kremowa kawa vs nastrojowy ciemny wieczór kawiarniany",
        goal: "Przełącznik nastroju kawiarni: dodaj przycisk przełączający motyw: 'Słoneczny poranek' (krem i mleko) vs 'Nastrojowy wieczór' (głęboka czerń palonych ziaren i złote światło).",
        constraint: "Zadbaj o doskonały kontrast w obu motywach (zgodny z WCAG AA)."
      },
      promo: {
        title: "🏷️ Pływający baner oferty dnia",
        desc: "Przyklejony baner na górze: 'Dziś drugie espresso gratis!' z kodem",
        goal: "Baner promocji dnia: dodaj przyklejony pasek na samej górze strony informujący o promocji: 'Kawa dnia: Etiopia Yirgacheffe -20% z kodem KAWA2026' z przyciskiem skopiowania kodu.",
        constraint: "Baner ma być wyraźny, ale nie może zasłaniać nawigacji ani głównego nagłówka."
      }
    }
  },

  // Zadanie 5 (Dzień 2): Cyber Bar 2077
  5: {
    taskTitle: "Cyber Bar 2077",
    baseName: "Cyber Bar 2077 (Zadanie 5)",
    presets: {
      cyber_orders: {
        title: "⚡ Neonowy licznik cyber-zamówień",
        desc: "Pulsujący neonowy licznik drinków z pamięcią w localStorage",
        goal: "Neonowy licznik zamówień: dodaj pulsujący neonowy licznik zamówień z przyciskiem '+1 Cyber-Drin', który zlicza zamówienia i zachowuje stan w pamięci przeglądarki (localStorage).",
        constraint: "Wkomponuj licznik w stylistykę Synthwave / Cyberpunk z neonową poświatą."
      },
      reviews: {
        title: "⭐ Panel ocen Netrunnerów",
        desc: "5 neonowych gwiazdek i formularz cyberpunkowej opinii o barze",
        goal: "Panel ocen klientów: dodaj 5 świecących na cyjanowo gwiazdek oraz pole do wpisania recenzji przez bywalca baru z przyciskiem 'Prześlij do Holo-Sieci'.",
        constraint: "Zachowaj spójną mroczną oprawę graficzną."
      },
      synth_sound: {
        title: "🎵 Dźwięki syntezatora Synthwave",
        desc: "Kosmiczne tony syntezatora Web Audio API przy interakcji",
        goal: "Dźwięki audio w klimacie sci-fi: dodaj futurystyczny, przestrzenny ton syntezatora (Web Audio API) przy każdym kliknięciu w menu baru.",
        constraint: "Syntetyzowany czysty dźwięk bez plików zewnętrznych."
      },
      glitch: {
        title: "🕶️ Efekt Glitch i CRT Scanlines",
        desc: "Subtelne linie skanowania kineskopu i animowane zakłócenia",
        goal: "Cyberpunkowe efekty wizualne: dodaj subtelny efekt linii skanowania retro kineskopu (CRT Scanlines) oraz delikatną animację zakłóceń glitch na głównym nagłówku.",
        constraint: "Efekt nie może utrudniać czytania tekstu ani powodować migotania niebezpiecznego dla epileptyków."
      },
      drinks_menu: {
        title: "🍸 Karta cyber-koktajli (w E$)",
        desc: "Napoje z opisem wszczepów i cenami w eurodolarach",
        goal: "Karta cyber-koktajli: dodaj listę 4 futurystycznych drinków (np. Neonowy Johnny, Netrunner Sour, Neural Overload) z cenami w eurodolarach [E$] i opisem efektów cybernetycznych.",
        constraint: "Czytelny układ kafelków z wysokim kontrastem neonów."
      },
      matrix_mode: {
        title: "🌓 Przełącznik Neon / Terminal Matrix",
        desc: "Przełącznik: Neon Pink/Cyan vs Monochromatyczny Zielony Terminal",
        goal: "Przełącznik stylu cyberpunkowego: dodaj przycisk zmieniający oprawę: z wielobarwnego 'Night City Neon' (róż i błękit) na surowy styl 'Matrix Hacker Terminal' (czarne tło i zielona czcionka monospaced).",
        constraint: "Zapewnij pełną czytelność tekstu w obu wersjach."
      }
    }
  },

  // Zadanie 9 (Dzień 3): Pierwsza żywa interakcja - Licznik kliknięć / Licznik kaw
  9: {
    taskTitle: "Licznik Kliknięć i Kaw",
    baseName: "Licznik Kliknięć (Zadanie 9)",
    presets: {
      reset: {
        title: "🔄 Przycisk zerowania (Reset do 0)",
        desc: "Bezpieczne resetowanie licznika do 0 z potwierdzeniem",
        goal: "Zerowanie licznika: dodaj przycisk 'Wyzeruj licznik', który po kliknięciu i potwierdzeniu resetuje liczbę kliknięć z powrotem do zera.",
        constraint: "Umieść przycisk zerowania pod głównym przyciskiem, z delikatniejszym kolorem, aby uniknąć przypadkowego kliknięcia."
      },
      storage: {
        title: "💾 Pamięć wyniku (localStorage)",
        desc: "Wynik nie znika po odświeżeniu lub zamknięciu przeglądarki",
        goal: "Trwały zapis w pamięci: spraw, aby aktualna liczba kliknięć była automatycznie zapisywana w pamięci przeglądarki (localStorage) i wczytywana natychmiast po ponownym otwarciu strony.",
        constraint: "Zachowaj prosty i czysty kod bez zewnętrznych bibliotek."
      },
      sound: {
        title: "🎵 Dźwięk kliknięcia (Web Audio API)",
        desc: "Satysfakcjonujący dźwięk mechanicznego przełącznika",
        goal: "Dźwiękowa informacja zwrotna: dodaj satysfakcjonujący dźwięk mechanicznego przełącznika (Web Audio API) przy każdym kliknięciu przycisku dodawania.",
        constraint: "Dźwięk ma być krótki (ok. 50ms) i przyjemny dla ucha."
      },
      goal: {
        title: "🎯 Cel dzienny i pasek postępu",
        desc: "Wybór celu (np. 10 kliknięć) i animowany pasek z gratulacjami",
        goal: "Pasek postępu i cel: dodaj wskaźnik celu dziennego (np. 10 kaw/kliknięć) z animowanym paskiem postępu. Po osiągnięciu 100% wyświetl komunikat z gratulacjami i wystrzel konfetti.",
        constraint: "Pasek postępu musi posiadać atrybuty ARIA (role='progressbar', aria-valuenow, aria-valuemax)."
      },
      step: {
        title: "⚡ Krok licznika (+5 / +10 / -1)",
        desc: "Przyciski szybkiej zmiany wartości z ochroną przed ujemnymi",
        goal: "Szybka zmiana wartości: dodaj obok głównego przycisku mniejsze przyciski: '+5', '+10' oraz '-1 (Pomyliłem się)' z zabezpieczeniem, aby liczba nie spadła poniżej zera.",
        constraint: "Przyciski muszą być wygodne do kliknięcia (min. 44x44 px) i czytelnie opisane."
      },
      color_shift: {
        title: "🌈 Dynamiczna zmiana barwy",
        desc: "Cyfra płynnie zmienia barwę w miarę wzrostu wyniku",
        goal: "Dynamiczna zmiana kolorów: spraw, aby cyfra licznika zmieniała swój kolor w zależności od wyniku (np. zielony dla 1-3, bursztynowy dla 4-7, a ognisty czerwony dla 8+).",
        constraint: "Zachowaj wysoki kontrast z tłem we wszystkich stanach."
      }
    }
  },

  // Zadanie 13 (Dzień 5): Wystrzał konfetti - Generator Komplementów
  13: {
    taskTitle: "Generator Komplementów",
    baseName: "Generator Komplementów (Zadanie 13)",
    presets: {
      counter: {
        title: "⚡ Licznik odsłon i losowań",
        desc: "Zlicza kliknięcia i pamięta wynik w pamięci przeglądarki (localStorage)",
        goal: "Licznik odsłon i losowań: dodaj widoczny licznik (np. 'Wylosowano już: X miłych słów'), który po każdym kliknięciu przycisku losowania zwiększa się o 1 i zachowuje łączny wynik w pamięci przeglądarki (localStorage), dzięki czemu liczba odsłon nie znika po odświeżeniu strony.",
        constraint: "Umieść licznik estetycznie nad lub pod przyciskiem losowania, zachowując spójny styl kafelka."
      },
      copy: {
        title: "📋 Kopiuj wylosowany komplement",
        desc: "Przycisk kopiowania do schowka z dymkiem potwierdzenia",
        goal: "Kopiowanie do schowka: dodaj przycisk 'Skopiuj ten komplement', który po kliknięciu kopiuje aktualnie wyświetlony miły tekst do schowka użytkownika i pokazuje estetyczne powiadomienie 'Skopiowano do schowka! Możesz przesłać go komuś bliskiemu'.",
        constraint: "Użyj nowoczesnego navigator.clipboard.writeText z zabezpieczeniem i widocznym potwierdzeniem."
      },
      custom: {
        title: "✍️ Dodaj własny komplement",
        desc: "Pole tekstowe do wpisywania i dopisywania własnych miłych słów",
        goal: "Własne komplementy: dodaj pole tekstowe oraz przycisk 'Dodaj do puli', który pozwala użytkownikowi wpisać swój własny unikalny komplement i zapisać go na stałe do puli losowania w pamięci przeglądarki (localStorage).",
        constraint: "Zadbaj o walidację (nie pozwalaj na dodanie pustego pola) i wyczyść pole po pomyślnym dodaniu."
      },
      sound: {
        title: "🎵 Radosny dźwięk fanfar",
        desc: "Dźwięk triumfu Web Audio API odtwarzany przy wystrzale konfetti",
        goal: "Dźwiękowa oprawa radości: dodaj krótki, radosny akord fanfar lub melodyjny dzwonek sukcesu za pomocą Web Audio API, odtwarzany w ułamku sekundy dokładnie w momencie kliknięcia przycisku i wystrzału konfetti.",
        constraint: "Dźwięk ma być czysty, radosny, nienachalny i nie może wymagać zewnętrznych plików audio mp3."
      },
      categories: {
        title: "🏷️ Kategorie nastroju",
        desc: "Przełącznik: Motywacja do pracy, Dobry humor, Spokój i relaks",
        goal: "Wybór nastroju i kategorii: dodaj 3 przyciski wyboru kategorii: 'Motywacja do pracy', 'Dobry humor' oraz 'Spokój i relaks'. Po wybraniu kategorii przycisk losuje wyłącznie komplementy dopasowane do wybranego nastroju.",
        constraint: "Wybrana kategoria ma być wyraźnie wyróżniona wizualnie (zgodnie z WCAG AA)."
      },
      theme: {
        title: "🎨 Zmiana motywu wizualnego",
        desc: "Wybór palety: Złoty zachód, Różowy neon, Kosmiczny fiolet",
        goal: "Palety kolorystyczne: dodaj małe przyciski przełączające paletę barw kafelka i tła: np. 'Złoty zachód słońca' (ciepły bursztyn), 'Różowy neon' (optymistyczny róż) oraz 'Kosmiczny fiolet' (nastrojowy granat).",
        constraint: "Zapewnij wysoki kontrast tekstu w każdej palecie (co najmniej 4.5:1 wg WCAG)."
      }
    }
  },

  // Zadanie 19 (Dzień 7): Kafelki produktów / sklep
  19: {
    taskTitle: "Katalog Produktów i Sklep",
    baseName: "Katalog Produktów (Zadanie 19)",
    presets: {
      cart: {
        title: "🛒 Koszyk zakupowy z sumą cen",
        desc: "Dodawanie produktów do koszyka i podliczanie łącznej kwoty",
        goal: "Koszyk zakupowy: dodaj pływający panel koszyka, który po kliknięciu 'Dodaj do koszyka' zwiększa licznik sztuk i natychmiast przelicza łączną kwotę do zapłaty w PLN.",
        constraint: "Panel koszyka ma być czytelny, z możliwością usunięcia pozycji."
      },
      filter: {
        title: "🏷️ Filtrowanie po kategoriach",
        desc: "Przyciski: Wszystkie, Elektronika, Dom, Odzież",
        goal: "Filtrowanie kategorii: dodaj przyciski filtrów pozwalające wyświetlać tylko produkty z wybranej kategorii bez przeładowywania strony.",
        constraint: "Aktywny filtr musi być wyraźnie wyróżniony wizualnie."
      },
      sort: {
        title: "↕️ Sortowanie po cenie",
        desc: "Od najtańszych do najdroższych i odwrotnie",
        goal: "Sortowanie listy: dodaj rozwijaną listę sortowania (Cena: rosnąco, Cena: malejąco, Nazwa: A-Z).",
        constraint: "Użyj semantycznego elementu <select> z dostępną etykietą <label>."
      },
      search: {
        title: "🔍 Wyszukiwarka produktów na żywo",
        desc: "Błyskawiczne filtrowanie w miarę wpisywania liter",
        goal: "Wyszukiwarka live: dodaj pole wyszukiwania, które w czasie rzeczywistym filtruje kafelki produktów po wpisanej frazie.",
        constraint: "Dodaj czytelny komunikat w przypadku braku wyników."
      },
      badge: {
        title: "⭐ Odznaki Bestseller i Promocja",
        desc: "Kolorowe wstęgi na kafelkach z przekreśloną starą ceną",
        goal: "Wyróżnienia handlowe: dodaj odznaki 'Promocja -20%' z przekreśloną starą ceną oraz odznakę 'Bestseller'.",
        constraint: "Zachowaj wysoki kontrast tekstu na wstęgach."
      },
      sound: {
        title: "🎵 Dźwięk dodania do koszyka",
        desc: "Przyjemny dźwięk kasy fiskalnej Web Audio API",
        goal: "Dźwięk zakupu: dodaj krótki dźwięk kasy fiskalnej lub dzwonka sukcesu (Web Audio API) po kliknięciu przycisku dodania do koszyka.",
        constraint: "Syntetyzowany czysty dźwięk bez plików zewnętrznych."
      }
    }
  },

  // Zadanie 21 (Dzień 7): Stylizowanie Tailwind - Karta profilowa / Portfolio
  21: {
    taskTitle: "Karta Profilowa / Portfolio",
    baseName: "Karta Profilowa (Zadanie 21)",
    presets: {
      tabs: {
        title: "📑 Zakładki: O mnie / Projekty / Kontakt",
        desc: "Interaktywne przełączanie zawartości bez przeładowania",
        goal: "Zakładki sekcji: dodaj 3 klikalne zakładki: 'O mnie', 'Portfolio projektów' oraz 'Kontakt', które płynnie zmieniają widoczną treść karty.",
        constraint: "Użyj ról ARIA (role='tablist', role='tab', role='tabpanel')."
      },
      likes: {
        title: "❤️ Licznik polubień profilu",
        desc: "Serduszko z animacją i pamięcią w localStorage",
        goal: "Licznik sympatii: dodaj przycisk serduszka 'Polub profil' z licznikiem kliknięć zapisywanym w pamięci przeglądarki (localStorage).",
        constraint: "Płynna mikroanimacja powiększenia po kliknięciu."
      },
      social: {
        title: "🌐 Interaktywne ikony społecznościowe",
        desc: "Wizualne odnośniki z efektami po najechaniu",
        goal: "Ikony społecznościowe: dodaj rząd eleganckich ikon (GitHub, LinkedIn, E-mail, Portfolio) z efektami podświetlenia i tooltipami.",
        constraint: "Wszystkie ikony muszą posiadać teksty alternatywne lub aria-label."
      },
      vcard: {
        title: "📇 Pobieranie wizytówki vCard (.vcf)",
        desc: "Generowanie i pobieranie kontaktu jednym kliknięciem",
        goal: "Eksport kontaktu: dodaj przycisk 'Zapisz w kontaktach', który generuje i pobiera plik wizytówki .vcf gotowy do zaimportowania w telefonie.",
        constraint: "Czysty JavaScript bez zewnętrznych bibliotek."
      },
      theme: {
        title: "🌓 Przełącznik stylu karty",
        desc: "Wybór: Elegancka czerń, Szary minimalizm, Neonowy gradient",
        goal: "Metamorfoza stylu: dodaj przełącznik 3 schematów kolorystycznych karty profilowej z zachowaniem idealnej czytelności.",
        constraint: "Zgodność z WCAG AA we wszystkich wariantach."
      },
      audio_bio: {
        title: "🔊 Dźwiękowe powitanie lektora",
        desc: "Odtwarzanie powitania za pomocą SpeechSynthesis API",
        goal: "Powitanie audio: dodaj przycisk 'Posłuchaj powitania', który wbudowanym w przeglądarkę polskim głosem (SpeechSynthesis) odczytuje krótkie bio.",
        constraint: "Zapewnij przyciski odtwarzania i zatrzymania głosu."
      }
    }
  },

  // Zadanie 24 (Dzień 8): Przełącznik Dark Mode
  24: {
    taskTitle: "Strona z przełącznikiem Dark Mode",
    baseName: "Przełącznik Dark Mode (Zadanie 24)",
    presets: {
      storage: {
        title: "💾 Zapamiętywanie wyboru w localStorage",
        desc: "Wybrany tryb nie resetuje się po odświeżeniu strony",
        goal: "Trwały wybór motywu: spraw, aby wybrany motyw (ciemny lub jasny) zapisywał się w localStorage i był przywracany przy ponownej wizycie.",
        constraint: "Kod ma zapobiegać migotaniu tła przy ładowaniu strony."
      },
      contrast: {
        title: "👁️ Trzeci motyw: Wysoki Kontrast (WCAG AAA)",
        desc: "Czysta czerń i żółte napisy dla osób słabowidzących",
        goal: "Tryb Wysokiego Kontrastu: dodaj trzecią opcję: czarne tło i jaskrawożółte napisy z mocnymi białymi ramkami, idealną dla osób słabowidzących.",
        constraint: "Kontrast tekstu powyżej 7:1 spełniający WCAG AAA."
      },
      animation: {
        title: "☀️ Płynna animacja ikonki słońce / księżyc",
        desc: "Obrót i transformacja ikony przy zmianie trybu",
        goal: "Animacja ikony: dodaj płynną animację CSS, która przy przełączaniu obraca i transformuje ikonę słońca w księżyc.",
        constraint: "Obsłuż regułę @media (prefers-reduced-motion) dla osób wrażliwych na ruch."
      },
      auto_detect: {
        title: "💻 Wykrywanie ustawień systemowych",
        desc: "Domyślne dopasowanie do motywu Windows/macOS/iOS",
        goal: "Automatyczny start: odczytaj preferencje systemowe użytkownika (prefers-color-scheme) i zastosuj je przy pierwszym otwarciu strony.",
        constraint: "Użytkownik musi mieć możliwość ręcznego nadpisania wyboru."
      },
      font_size: {
        title: "🔠 Przyciski powiększania tekstu (A- / A+)",
        desc: "Wygodne skalowanie rozmiaru czcionki na całej stronie",
        goal: "Skalowanie tekstu: dodaj przyciski zmniejszania i powiększania czcionki na stronie z zapisem w pamięci podręcznej.",
        constraint: "Układ strony nie może się rozsypać przy powiększeniu do 150%."
      },
      sound: {
        title: "🎵 Dźwięk włącznika światła",
        desc: "Kliknięcie włącznika elektrycznego Web Audio API",
        goal: "Dźwiękowy przełącznik: dodaj realistyczny, krótki dźwięk mechanicznego włącznika światła (Web Audio API) przy każdej zmianie motywu.",
        constraint: "Dźwięk ma trwać maksymalnie 40 milisekund."
      }
    }
  },

  // Zadanie 27 (Dzień 9): Interaktywna lista zadań (To-Do List)
  27: {
    taskTitle: "Lista Zadań (To-Do List)",
    baseName: "Lista Zadań To-Do (Zadanie 27)",
    presets: {
      storage: {
        title: "💾 Zapis listy w localStorage",
        desc: "Twoje zadania nie znikną po wyłączeniu komputera",
        goal: "Trwałość zadań: spraw, aby dodane zadania oraz stan ich odhaczenia zapisywały się w localStorage i były automatycznie wczytywane.",
        constraint: "Zadbaj o poprawną serializację listy do formatu JSON."
      },
      filter: {
        title: "🏷️ Filtrowanie: Wszystkie / Aktywne / Ukończone",
        desc: "Wygodne przełączanie widoku zadań",
        goal: "Filtry widoku: dodaj przyciski filtrowania listy: 'Wszystkie', 'Do zrobienia' oraz 'Ukończone' z licznikiem przy każdym filtrze.",
        constraint: "Płynna aktualizacja widoku bez przeładowania strony."
      },
      priority: {
        title: "🔥 Priorytety zadań z kolorami",
        desc: "Wybór: Niski (zielony), Średni (żółty), Pilny (czerwony)",
        goal: "Priorytetyzacja: dodaj możliwość oznaczenia priorytetu zadania podczas dodawania, z kolorową plakietką i sortowaniem według pilności.",
        constraint: "Kolory muszą być czytelne i uzupełnione tekstem dla czytników ekranu."
      },
      edit: {
        title: "✏️ Edycja treści zadania po kliknięciu",
        desc: "Szybka poprawka tekstu zadania bez konieczności usuwania",
        goal: "Edycja zadania: pozwól użytkownikowi kliknąć tekst zadania, aby zamienić go w pole edycji i zatwierdzić zmianę klawiszem Enter.",
        constraint: "Klawisz Escape ma anulować edycję bez zapisywania zmian."
      },
      stats: {
        title: "📊 Licznik zadań i pasek postępu",
        desc: "Wskaźnik: 'Zrobiono 3 z 5 zadań (60%)'",
        goal: "Podsumowanie postępu: dodaj widoczny pasek postępu pokazujący procent ukończonych spraw dzisiejszego dnia.",
        constraint: "Pasek musi aktualizować się natychmiast po odhaczeniu zadania."
      },
      celebration: {
        title: "🎉 Konfetti i fanfary po skończeniu wszystkich",
        desc: "Radosna nagroda, gdy lista zadań zostanie zrealizowana w 100%",
        goal: "Nagroda za produktywność: gdy użytkownik odhaczy ostatnie zadanie z listy, wystrzel konfetti i odegraj radosny akord fanfar.",
        constraint: "Efekt ma pojawiać się tylko wtedy, gdy lista zawiera przynajmniej 1 zadanie."
      }
    }
  },

  // Zadanie 36 (Dzień 13): Kalkulator BMR i kalorii
  36: {
    taskTitle: "Kalkulator Kalorii i BMR",
    baseName: "Kalkulator Kalorii BMR (Zadanie 36)",
    presets: {
      activity: {
        title: "🏃 Poziom aktywności fizycznej (Współczynnik PAL)",
        desc: "Od pracy siedzącej po codzienne intensywne treningi",
        goal: "Współczynnik aktywności: dodaj wybór poziomu ruchu (5 poziomów od 'Siedzący tryb życia' po 'Ciężka praca fizyczna'), który koryguje podstawowe zapotrzebowanie BMR o realne spalanie CPM.",
        constraint: "Każdy poziom musi mieć przystępny opis z przykładem."
      },
      macro: {
        title: "🥗 Podział makroskładników w gramach",
        desc: "Obliczanie gramów białka, tłuszczów i węglowodanów",
        goal: "Podział makro: dodaj wyliczenie dziennej porcji białek (2g/kg), tłuszczów (1g/kg) i węglowodanów w gramach oraz kaloriach.",
        constraint: "Czytelna tabela z podsumowaniem i kolorowymi paskami."
      },
      goals: {
        title: "🎯 Wybór celu: Redukcja / Utrzymanie / Masa",
        desc: "Automatyczne wyliczenie deficytu -300 kcal lub nadwyżki +300 kcal",
        goal: "Kalkulacja celu sylwetkowego: dodaj 3 przyciski: 'Schudnij bezpiecznie (-300 kcal)', 'Utrzymaj wagę' oraz 'Zbuduj mięśnie (+300 kcal)' z natychmiastowym przeliczeniem wyniku.",
        constraint: "Wybrany cel ma być wyraźnie wyróżniony."
      },
      storage: {
        title: "💾 Zapisywanie profilu i historii w localStorage",
        desc: "Pamięć Twojego wzrostu, wagi i wieku, aby nie wpisywać ich co chwilę",
        goal: "Pamięć danych: spraw, aby wpisany wiek, waga i wzrost zapisywały się w przeglądarce i nie znikały po odświeżeniu strony.",
        constraint: "Dodaj przycisk 'Wyczyść moje dane' dla poszanowania prywatności."
      },
      copy: {
        title: "📋 Kopiowanie jadłospisu do schowka",
        desc: "Zwięzłe podsumowanie gotowe do wysłania dietetykowi lub wklejenia do notesu",
        goal: "Eksport podsumowania: dodaj przycisk 'Kopiuj mój raport', który tworzy zwięzłe podsumowanie tekstowe (BMR, CPM, cel, makroskładniki) i kopiuje je do schowka.",
        constraint: "Wyświetl wyraźne potwierdzenie skopiowania raportu."
      },
      sound: {
        title: "🎵 Dźwięk kalkulatora",
        desc: "Satysfakcjonujący ton zatwierdzenia wyniku obliczeń",
        goal: "Dźwięk przeliczenia: dodaj krótki melodyjny ton Web Audio API odtwarzany w momencie wyświetlenia wyniku obliczeń.",
        constraint: "Czysty dźwięk bez plików zewnętrznych."
      }
    }
  },

  // Zadanie 37 (Dzień 13): Minutnik Pomodoro z gongiem
  37: {
    taskTitle: "Minutnik Pomodoro z gongiem",
    baseName: "Minutnik Pomodoro (Zadanie 37)",
    presets: {
      gong: {
        title: "🔔 Głęboki dźwiękowy gong zakończenia",
        desc: "Relaksujący, rezonujący ton gongu Web Audio API po upływie czasu",
        goal: "Dźwięk gongu: stwórz realistyczny, głęboki dźwięk tybetańskiego gongu lub dzwonu za pomocą Web Audio API, odtwarzany po zakończeniu sesji skupienia.",
        constraint: "Dźwięk ma wybrzmiewać łagodnie przez 2 sekundy."
      },
      cycles: {
        title: "🍅 Licznik ukończonych cykli dnia",
        desc: "Wskaźnik z pomidorkami i zapisem w localStorage",
        goal: "Licznik sesji: dodaj licznik zrealizowanych dzisiaj cykli (np. 🍅🍅🍅 3 ukończone sesje), który pamięta dzisiejszy wynik w localStorage.",
        constraint: "Licznik ma resetować się automatycznie po zmianie daty."
      },
      modes: {
        title: "⏱️ Przełącznik faz: Skupienie (25m) / Przerwa (5m / 15m)",
        desc: "Szybkie przełączanie między pracą a regeneracją",
        goal: "Fazy Pomodoro: dodaj przyciski szybkiego wyboru: 'Głęboka praca (25 min)', 'Krótka przerwa (5 min)' oraz 'Długa przerwa (15 min)'.",
        constraint: "Automatyczna zmiana koloru tła (np. granat dla pracy, szmaragd dla relaksu)."
      },
      tick: {
        title: "⏰ Opcjonalne tykanie zegara w tle",
        desc: "Subtelny rytm wspomagający koncentrację (z możliwością wyłączenia)",
        goal: "Dźwięk tykania: dodaj przełącznik dźwiękowego tykania zegara w trakcie odliczania, pomagający utrzymać rytm skupienia.",
        constraint: "Tykanie musi być domyślnie wyłączone i bardzo ciche."
      },
      title_timer: {
        title: "📑 Czas widoczny w tytule karty przeglądarki",
        desc: "Np. '(18:42) Pomodoro' widoczne na pasku kart",
        goal: "Odliczanie w karcie: spraw, aby uciekający czas aktualizował tytuł strony document.title, dzięki czemu widać ile minut zostało nawet w innej karcie.",
        constraint: "Po zakończeniu przywróć pierwotny tytuł strony."
      },
      pause: {
        title: "⏸️ Przycisk Pauza / Wznów z dużym widokiem",
        desc: "Wygodne zatrzymywanie odliczania na czas pilnego telefonu",
        goal: "Pauza i reset: dodaj duży, czytelny przycisk wstrzymywania i wznawiania odliczania oraz przycisk restartu sesji.",
        constraint: "Przyciski muszą posiadać duży obszar klikalny (min. 48px)."
      }
    }
  },

  // Zadanie 48 (Dzień 17): Fakty o kotach (Publiczne API)
  48: {
    taskTitle: "Fakty o Kotach z Publicznego API",
    baseName: "Fakty o Kotach API (Zadanie 48)",
    presets: {
      next_fact: {
        title: "🔄 Losuj kolejny fakt bez przeładowania",
        desc: "Płynne pobieranie nowej ciekawostki jednym kliknięciem",
        goal: "Kolejny fakt: dodaj przycisk 'Wylosuj inny fakt', który natychmiast wysyła nowe zapytanie do API i podmienia treść ciekawostki z animacją płynnego pojawiania się.",
        constraint: "Dodaj wskaźnik ładowania ('Kotek szuka faktu...') na czas pobierania."
      },
      favorites: {
        title: "⭐ Zapisz do ulubionych (localStorage)",
        desc: "Budowanie własnej kolekcji najciekawszych kocich faktów",
        goal: "Lista ulubionych: dodaj przycisk 'Dodaj do ulubionych' oraz sekcję zapisanych faktów poniżej, z możliwością usunięcia wybranej pozycji.",
        constraint: "Lista ulubionych ma pamiętać stan w pamięci przeglądarki."
      },
      copy: {
        title: "📋 Kopiuj fakt do schowka",
        desc: "Szybkie skopiowanie ciekawostki do przesłania znajomemu",
        goal: "Kopiowanie ciekawostki: dodaj przycisk 'Skopiuj fakt', który kopiuje treść do schowka i wyświetla powiadomienie 'Skopiowano! Prześlij znajomemu kociarzowi'.",
        constraint: "Użyj navigator.clipboard z widocznym feedbackiem."
      },
      photo: {
        title: "🐱 Losowe zdjęcie kota do pary",
        desc: "Pobieranie uroczego zdjęcia z darmowego cataas.com lub thecatapi",
        goal: "Zdjęcie do faktu: dodaj pobieranie losowego zdjęcia słodkiego kotka dopasowanego do wylosowanego faktu.",
        constraint: "Zdjęcie musi posiadać opisowy atrybut alt='Losowe zdjęcie uroczego kota'."
      },
      meow_sound: {
        title: "🎵 Dźwięk miauczenia (Web Audio API)",
        desc: "Wesoły koci dźwięk 'Miau' syntezowany w przeglądarce",
        goal: "Koci dźwięk: dodaj wesołe, syntetyzowane miauknięcie (Web Audio API) odtwarzane w momencie wylosowania nowego faktu.",
        constraint: "Czysta synteza bez zewnętrznych plików audio mp3."
      },
      counter: {
        title: "⚡ Licznik przeczytanych faktów",
        desc: "Zlicza ile kocich tajemnic odkryłeś dzisiejszego dnia",
        goal: "Licznik odkryć: dodaj licznik: 'Odkryto już: X kocich tajemnic', który zwiększa się przy każdym wylosowaniu i pamięta wynik w localStorage.",
        constraint: "Licznik ma być estetycznie wkomponowany pod nagłówkiem."
      }
    }
  },

  // Zadanie 50 (Dzień 17): Kalkulator napiwków i podziału rachunku
  50: {
    taskTitle: "Kalkulator Napiwków i Podziału Rachunku",
    baseName: "Kalkulator Napiwków (Zadanie 50)",
    presets: {
      quick_tips: {
        title: "💰 Szybkie przyciski napiwku: 10% / 15% / 20%",
        desc: "Błyskawiczny wybór procentu oraz pole na własną kwotę",
        goal: "Przyciski procentowe: dodaj 3 przyciski szybkiego wyboru: '10% (Miła obsługa)', '15% (Świetna obsługa)', '20% (Wybitne jedzenie)' oraz pole na wpisanie własnego procentu.",
        constraint: "Aktywny przycisk procentowy musi być wyraźnie podświetlony."
      },
      split: {
        title: "👥 Suwak liczby gości (Podział na osoby)",
        desc: "Płynne przeliczanie kwoty przypadającej na 1 osobę",
        goal: "Podział rachunku: dodaj suwak liczby osób (od 1 do 12 gości) z natychmiastowym przeliczeniem ile dokładnie płaci każda osoba.",
        constraint: "Zadbaj o czytelną etykietę i duże przyciski +/- obok suwaka."
      },
      round_up: {
        title: "⬆️ Zaokrąglanie kwoty w górę do pełnych złotych",
        desc: "Koniec z szukaniem groszy przy płaceniu gotówką",
        goal: "Zaokrąglenie w górę: dodaj pole wyboru 'Zaokrąglij kwotę na osobę do pełnych złotych w górę', aby ułatwić rozliczenie bez groszy.",
        constraint: "Wyświetl różnicę jaka powstaje z zaokrąglenia jako dodatkowy napiwek dla kelnera."
      },
      sms_export: {
        title: "📱 Gotowy tekst rozliczenia na SMS / WhatsApp",
        desc: "Przycisk kopiowania: 'Rachunek 120 zł na 3 osoby = po 40 zł na głowę'",
        goal: "Tekst do znajomych: dodaj przycisk 'Kopiuj rozliczenie do SMS', który tworzy gotową wiadomość (np. 'Hej! Rachunek wyszedł 120 zł na 3 osoby, czyli po 40 zł na głowę. Mój BLIK: ...') i kopiuje ją do schowka.",
        constraint: "Możliwość wpisania swojego numeru telefonu do przelewu BLIK."
      },
      history: {
        title: "💾 Pamięć ostatnich 5 rachunków (localStorage)",
        desc: "Lista ostatnich wyjść do restauracji z datą i kwotą",
        goal: "Historia rachunków: dodaj zapisywanie ostatnich rozliczeń w pamięci przeglądarki z datą i podsumowaniem.",
        constraint: "Dodaj możliwość wyczyszczenia historii jednym przyciskiem."
      },
      sound: {
        title: "🎵 Dźwięk brzęczących monet",
        desc: "Metaliczny, przyjemny brzęk monet Web Audio API",
        goal: "Dźwięk rozliczenia: dodaj krótki dźwięk brzęczących monet (Web Audio API) przy każdej zmianie kwoty lub liczby osób.",
        constraint: "Krótki, nienachalny efekt syntetyzowany w przeglądarce."
      }
    }
  }
};

/**
 * Zwraca zestaw ulepszeń dedykowany dla danego zadania kodowego.
 * Jeśli zadanie nie posiada dedykowanego zestawu, zwraca uniwersalny zestaw ulepszeń.
 */
function getTaskEnhancementPresets(taskId) {
  const id = parseInt(taskId, 10);
  if (TASK_ENHANCEMENT_PRESETS[id]) {
    return TASK_ENHANCEMENT_PRESETS[id];
  }

  const task = TASKS_DATA.find(t => t.id === id);
  const title = task ? task.title : `Zadanie ${id}`;
  return {
    taskTitle: title,
    baseName: `${title} (Zadanie ${id})`,
    presets: {
      storage: {
        title: "💾 Pamięć podręczna (localStorage)",
        desc: "Automatyczny zapis stanu strony, aby dane nie znikały",
        goal: "Trwały zapis danych: spraw, aby stan aplikacji (wpisane dane, liczniki lub ustawienia) zapisywał się w pamięci przeglądarki (localStorage) i był odtwarzany po odświeżeniu strony.",
        constraint: "Zadbaj o czysty kod i bezpieczną obsługę braku danych przy pierwszym uruchomieniu."
      },
      darkmode: {
        title: "🌓 Przełącznik Motywu Ciemny / Jasny",
        desc: "Przycisk słońca/księżyca z doskonałym kontrastem (WCAG AA)",
        goal: "Przełącznik motywu: dodaj estetyczny przycisk w rogu strony, który pozwala użytkownikowi przełączać między motywem ciemnym a jasnym.",
        constraint: "Zapewnij wysoki kontrast barw (min. 4.5:1) w obu trybach."
      },
      sound: {
        title: "🎵 Dźwiękowa informacja zwrotna",
        desc: "Syntetyzowany przyjemny ton Web Audio API po kliknięciu",
        goal: "Dźwięki interakcji audio: dodaj krótki, satysfakcjonujący ton potwierdzenia (Web Audio API) po wykonaniu głównej akcji na stronie.",
        constraint: "Dźwięk ma być nienachalny, czysty i działać bez zewnętrznych plików mp3."
      },
      copy: {
        title: "📋 Kopiowanie wyniku do schowka",
        desc: "Przycisk kopiowania zawartości z potwierdzeniem",
        goal: "Kopiowanie do schowka: dodaj przycisk pozwalający skopiować wynik działania programu do schowka z czytelnym powiadomieniem 'Skopiowano!'.",
        constraint: "Użyj navigator.clipboard z obsługą błędów."
      },
      mobile: {
        title: "📱 Optymalizacja na smartfon",
        desc: "Duże przyciski dotykowe i idealne skalowanie na telefonie",
        goal: "Udoskonalenie mobilne: dostosuj układ elementów, aby na małych ekranach smartfonów przyciski były duże (min. 48px) i wygodne do klikania kciukiem.",
        constraint: "Zapewnij pełną responsywność bez poziomego paska przewijania."
      },
      visual: {
        title: "🎨 Nowoczesne karty i mikrointerakcje",
        desc: "Eleganckie zaokrąglenia, cienie i płynne animacje po najechaniu",
        goal: "Nowoczesny szlif wizualny: dodaj eleganckie cienie (shadow-xl), zaokrąglone narożniki oraz subtelne animacje hover po najechaniu myszką na przyciski.",
        constraint: "Zachowaj spójność i przejrzystość bez przeładowania efektami."
      }
    }
  };
}

/**
 * Zwraca listę wszystkich zadań tworzących kod HTML dostępnych do wskazanego dnia włącznie.
 */
function getAvailableCodeTasksUpToDay(day) {
  const targetDay = parseInt(day, 10) || 1;
  const codeTasks = TASKS_DATA.filter(t => t.day <= targetDay && (t.isCode || (t.sampleSolution && t.sampleSolution.includes('<html'))));
  // Sortuj malejąco według dnia/id, aby najświeższe zadanie było pierwsze
  return codeTasks.sort((a, b) => b.id - a.id);
}

