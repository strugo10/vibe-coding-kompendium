# Akademia Vibe Codingu i Sztuki Promptingu (Od Zera do Twórcy) — Wersja 3.8.0

> 🚀 **Uruchom Akademię online (działa od razu w przeglądarce):**  
> 👉 **[https://strugo10.github.io/vibe-coding-kompendium/](https://strugo10.github.io/vibe-coding-kompendium/)**
>
> 📦 **Repozytorium kodu na GitHubie:**  
> 👉 **[https://github.com/strugo10/vibe-coding-kompendium](https://github.com/strugo10/vibe-coding-kompendium)**

Kompletne, interaktywne kompendium obejmujące **100 praktycznych zadań** podzielonych na **34 dni nauki** (po 3 zadania dziennie), w pełni dostosowane do standardów dostępności cyfrowej **WCAG 2.1 / 2.2 AA/AAA** (czytniki ekranu **NVDA** na Windows oraz **VoiceOver** na iPhone/iOS). Wszystkie postępy kursanta, punkty, notatki i dyplom zapisują się w 100% lokalnie i bezpiecznie w pamięci przeglądarki (`localStorage`), z możliwością natychmiastowej synchronizacji na smartfon (Kod QR, Magiczny Link) oraz z prywatnym Dyskiem Google kursanta.

## Co nowego w Wersji 3.8.0 (Wielourządzeniowość: Prywatny Dysk Google Kursanta, Kod QR, Magiczny Link i Kopia Zapasowa)?
- **100% Prywatna Synchronizacja z Własnym Dyskiem Google Kursanta:**
  - Rozwiązano problem kontynuowania nauki na różnych urządzeniach (np. laptop w pracy/domu i smartfon w drodze).
  - **Żelazna zasada prywatności:** Postępy kursanta zapisują się **wyłącznie na jego własnym, prywatnym koncie Google** w pliku `Akademia_Vibe_Codingu_Postepy.json`.
  - Twórca kursu ani nikt inny nie ma dostępu do cudzych postępów, a na dysk twórcy nie trafiają żadne obce pliki ani dane.
  - Opcja automatycznego zapisywania stanu w chmurze Google po zaliczeniu każdego zadania.
- **Błyskawiczny Transfer przez Kod QR i Magiczny Link (Komputer 🔁 Smartfon):**
  - Wystarczy skierować aparat iPhone'a / telefonu z Androidem na wygenerowany kod QR w nagłówku strony (`📲 Telefon i Dysk Google` / skrót `Alt+G`).
  - Strona na telefonie natychmiast wykrywa postępy, wyświetla czytelne podsumowanie i jednym stuknięciem wczytuje zaliczone zadania, punkty i notatki.
  - Dla osób preferujących linki tekstowe: możliwość skopiowania Magicznego Linku lub samego kodu transferu i wysłania go sobie mailem / SMS-em.
- **Trwała Kopia Zapasowa Postępów (Eksport i Import pliku .json):**
  - Kursant może w każdej chwili pobrać plik `.json` ze wszystkimi swoimi zadaniami, punktami, notatkami i wygenerowanymi projektami.
  - Wgranie pliku na dowolnym innym urządzeniu przywraca cały kurs w 1 sekundę.
- **Dostępność WCAG 2.1/2.2 AA/AAA:**
  - Pełna obsługa czytników ekranu (NVDA, VoiceOver) z głosowymi anonsami (`announceSR`) o powodzeniu zapisu i wczytania.
  - Klawiaturowy skrót globalny `Alt+G` do błyskawicznego otwierania okna synchronizacji.
  - Alternatywa tekstowa dla kodu QR (przycisk kopiowania linku i pole wklejania kodu).

## Co nowego w Wersji 3.7.0 (Dostępność WCAG: Pełna Obsługa Odwrócenia Kolorów i Smart Invert na iPhone)?
- **Rozwiązanie problemu jasnego tła przy inwersji kolorów na iPhone (Safari / iOS):**
  - **Diagnoza problemu:** Gdy użytkownik na iPhone korzysta z systemowej funkcji *„Odwrócenie kolorów”* (Classic Invert) lub *„Inteligentne odwrócenie kolorów”* (Smart Invert), witryny o ciemnym kodowaniu tła były automatycznie odwracane przez procesor telefonu na jaskrawe, białe/jasne tło. Dodatkowo brak deklaracji `color-scheme` i brak zdefiniowanego koloru tła na korzeniu `<html>` powodował, że silnik Safari traktował canvas strony jako biały i gubił się przy próbie inteligentnego odwracania.
  - **Fundamenty HTML/CSS:** Wprowadzono deklaracje `<meta name="color-scheme" content="dark light">` oraz `:root { color-scheme: dark light; }`, a także twarde przypisanie natywnego ciemnego tła (`#0b0f19`) bezpośrednio do elementów `<html>` oraz `<body>`. Dzięki temu Safari nigdy nie wyświetla białego canvasu ani białych błysków przy przewijaniu (overscroll bounce).
  - **Automatyczna adaptacja sprzętowa (`@media (inverted-colors: inverted)`):** Dodano regułę CSS Media Queries Level 4 natywnie wspieraną przez Safari na iOS. Gdy system iPhone'a włącza odwrócenie kolorów, kompendium natychmiast dostarcza odpowiednio spreparowaną bazę, dzięki czemu **po odwróceniu przez ekran telefonu tło widoczne dla oczu użytkownika jest głęboko czarne (#000000)**, a litery krystalicznie białe i czytelne.
  - **Dedykowany przycisk na górnym pasku (`🌓 Inwersja iPhone` / Alt+I):** Dostępny bezpośrednio w nagłówku aplikacji (zarówno na telefonie, jak i na komputerze). Umożliwia natychmiastowe, ręczne wymuszenie adaptacji do inwersji kolorów jednym stuknięciem palca lub skrótem klawiszowym `Alt+I`, z pełnym komunikatem dla VoiceOver i NVDA.
  - **Zsynchronizowany Tryb Skupienia (`day_focus.html`):** Wszystkie mechanizmy adaptacji do inwersji iOS i WCAG AA/AAA zostały wdrożone również w osobnym oknie zadań dnia.
- **Odporność na brak połączenia / opóźnienia CDN:** Wbudowano natywne style awaryjne (fallbacki) dla kart, nagłówka i formularzy, dzięki czemu nawet przy słabym zasięgu Wi-Fi strona zawsze zachowuje ciemne tło i wysoki kontrast.
- **Dedykowane, logiczne ulepszenia (pola wyboru) dla każdego zadania kodowego z osobna:**
  - Całkowicie wyeliminowano problem, w którym Studio Eksperymentów oferowało ulepszenia kawiarni (np. zamówienia kawy) w zadaniach o zupełnie innej tematyce.
  - **W Zadaniu 13 (Generator Komplementów):** Użytkownik ma teraz do dyspozycji ulepszenia stworzone specjalnie dla tej aplikacji:
    1. **⚡ Licznik odsłon i losowań:** Zlicza kliknięcia i pamięta wynik w pamięci przeglądarki (`localStorage`), dzięki czemu łączna liczba wyświetlonych komplementów nie znika po odświeżeniu strony.
    2. **📋 Kopiuj wylosowany komplement:** Przycisk kopiowania aktualnego tekstu do schowka z ładnym powiadomieniem.
    3. **✍️ Dodaj własny komplement:** Formularz pozwalający użytkownikowi dopisywać własne miłe słowa do losowanej puli.
    4. **🎵 Radosny dźwięk fanfar (Web Audio API):** Akord fanfar odtwarzany dokładnie w momencie wystrzału kolorowego konfetti.
    5. **🏷️ Kategorie nastroju:** Przełącznik nastrojów: Motywacja do pracy, Dobry humor, Spokój i relaks.
    6. **🎨 Zmiana motywu wizualnego:** Palety barwne: Złoty zachód, Różowy neon, Kosmiczny fiolet z wysokim kontrastem WCAG.
  - **Dla każdego innego zadania kodowego** (Zadanie 3: Kawiarnia, Zadanie 5: Cyber Bar, Zadanie 9: Licznik kliknięć, Zadanie 19: Sklep, Zadanie 21: Karta profilowa, Zadanie 24: Dark Mode, Zadanie 27: Lista To-Do, Zadanie 36: Kalkulator kalorii, Zadanie 37: Pomodoro z gongiem, Zadanie 48: Fakty o kotach z API, Zadanie 50: Kalkulator napiwków i inne) przygotowano odrębne, logicznie powiązane pakiety ulepszeń.
  - Baner z przyciskiem przejścia do ulepszeń jest teraz obecny na **każdej karcie zadania tworzącego aplikację lub stronę WWW**, a nie tylko w dwóch wybranych zadaniach.
- **Dynamiczny wybór bazy projektu w Studiu Eksperymentów:**
  - W Dniu 5 użytkownik widzi od razu wyróżniony przycisk **„Generator Komplementów (Zad. 13)”**, który jest domyślnym punktem wyjścia. Obok niego dostępne są wcześniejsze zadania (np. Zad. 9, Zad. 5, Zad. 3) oraz własny kod z piaskownicy.
  - Kliknięcie dowolnego projektu natychmiast przełącza zestaw pól wyboru na ulepszenia właściwe dla wybranej aplikacji.
- **Pełna stabilność fokusu NVDA i likwidacja błędu wyszukiwania tekstu „modyfikuj”:**
  - **Zabezpieczenie przed ucieczką fokusu w kosmos:** Naprawiono obsługę pól wyboru – kliknięcie lub zaznaczenie spacji nie powoduje utraty fokusu ani powrotu do początku strony (`<body>`), lecz stabilnie utrzymuje kursor czytnika ekranu na zaznaczonej opcji.
  - **Wyciąganie czytnika ekranu z ramki podglądu (iframe):** Dodano przycisk powrotu ze zintegrowanym skrótem, który płynnie przenosi fokus z powrotem do głównego dokumentu kompendium, eliminując sytuację, w której NVDA przeszukiwało wnętrze ramki strony i wyświetlało komunikat *„0 wystąpień: nie znaleziono tekstu 'modyfikuj'”*.
  - **Programowy fokus przy przejściu z zadania:** Kliknięcie przycisku *„Otwórz ulepszenia dla Zadania X”* natychmiast przenosi fokus klawiatury na nagłówek Studia (`tabindex="-1"`), a NVDA bezbłędnie anonsuje nową sekcję.
- **Rozbudowa Skarbnicy Projektów Piaskownicy (Moduł 3):**
  - Do gotowych projektów demonstracyjnych dodano **Licznik Kliknięć i Kaw (Zadanie 9)** oraz **Generator Komplementów z konfetti (Zadanie 13)**.

## Co nowego w Wersji 3.4.0 (Praktyka w Życiu i Pracy, Notowanie Wyników, Panel Uwag dla Autora z Eksportem i Dwukierunkowa Nawigacja Myśli)?
- **Praktyka każdego zadania w codziennym życiu (w pracy i w domu):**
  - Do każdego z 34 dni nauki oraz do każdej karty zadania dodano konkretne inspiracje i zachęty do natychmiastowego przećwiczenia nabytej wiedzy w codziennym życiu osobistym (🏡) oraz zawodowym (🏢).
  - Vibe coding to nie tylko sucha teoria czy pisanie kodu – to przede wszystkim praktyczne rozwiązywanie realnych życiowych problemów (np. automatyzacja domowego budżetu, porządkowanie notatek z pracy, tworzenie mini-kalkulatorów, generatorów czy narzędzi ułatwiających codzienne obowiązki).
- **Zachęta do utrwalania wyników i linków w notatkach:**
  - Wzbogacono sekcję notatek o wyraźną zachętę do wklejania wygenerowanego kodu, linków do stworzonych stron, własnych promptów oraz refleksji z pracy z AI.
  - Pole notatek w każdym zadaniu posiada teraz pomocniczy opis i motywujący placeholder, ułatwiając tworzenie własnej, spersonalizowanej bazy wiedzy.
- **Dedykowany Panel Uwag i Sugestii dla Twórcy Kompendium z Eksportem:**
  - Dodano możliwość zgłaszania uwag, pytań, pomysłów na nowe funkcje oraz zgłoszeń ewentualnych błędów bezpośrednio do autora kursu.
  - Formularz uwag został celowo umieszczony na **odrębnej podstronie (Podstrona 9)** w aplikacji głównej (oraz w wygodnym, dostępnym oknie modalnym w widoku skupienia), aby nie zaśmiecać widoku codziennych lekcji.
  - Dostęp do panelu uwag jest błyskawiczny: przycisk w nagłówku strony z licznikiem wpisów oraz skrót klawiszowy `Alt+U`.
  - Wszystkie uwagi są automatycznie zapisywane w pamięci przeglądarki (`localStorage`) z przypisaniem do kategorii (np. Błąd, Nowy pomysł, Usprawnienie WCAG, Pytanie, Pochwała) oraz znacznikiem czasu.
  - **Uniwersalny eksport uwag do wysłania autorowi:**
    - **Plik Markdown (`.md`):** Czytelny format z nagłówkami, idealny do dołączenia do wiadomości e-mail lub zgłoszenia.
    - **Plik HTML (`.html`):** Elegancki, dostępny cyfrowo dokument zgodny z WCAG 2.1/2.2 AA z dedykowanymi stylami do druku lub zapisu do PDF.
    - **Szybkie kopiowanie do schowka:** Pozwala wkleić wszystkie zebrane uwagi jednym kliknięciem do maila lub komunikatora.
- **Dwukierunkowa nawigacja po złotych myślach ekspertów:**
  - W boksie inspiracji ze złotymi myślami liderów AI (m.in. Andrej Karpathy, Simon Willison, Jensen Huang, Sam Altman, Satya Nadella, Andrew Ng) dodano przycisk **„Poprzednia myśl”** obok przycisku **„Kolejna myśl”**.
  - Użytkownik może swobodnie wracać do wcześniejszych cytatów bez konieczności przeklikiwania całej listy w kółko.
  - Czytniki ekranu (NVDA, VoiceOver) natychmiast anonsują numer i pełną treść wyświetlanego cytatu.

## Co nowego w Wersji 3.3.0 (Centrum Notatek z Eksportem do Markdown/HTML, Dolna Nawigacja Dni, Wielokrotny Wybór Ulepszeń i Skarbnica Projektów Piaskownicy)?
- **Centrum Notatek i Baza Wniosków do Zadań:**
  - Dodano możliwość robienia i przeglądania notatek w dowolnym momencie kursu – zarówno bezpośrednio na karcie każdego z zadań, jak i w globalnym oknie dialogowym **Moje Notatki** (dostępnym w nagłówku strony oraz pod skrótem klawiszowym `Alt+N`).
  - Każda notatka jest jednoznacznie przypisana do konkretnego zadania (np. *„Zadanie 3 (Dzień 1): Wizytówka lokalnej kawiarni”*), dzięki czemu przemyślenia i wnioski nigdy się nie gubią.
  - Wbudowana wyszukiwarka w czasie rzeczywistym pozwala błyskawicznie filtrować notatki po numerze zadania, tytule lub treści.
  - Bezpośredni przycisk *„Przejdź do tego zadania”* umożliwia natychmiastowe przeskoczenie z notatek wprost do wybranego zadania w kursie.
- **Uniwersalny eksport notatek (Markdown `.md` oraz dostępny dokument `.html` z WCAG):**
  - **Eksport do Markdown (`.md`):** Uniwersalny format czystego tekstu ze strukturą nagłówków, idealny do edytorów tekstu (Notatnik, VS Code) oraz aplikacji do gromadzenia wiedzy (Obsidian, Notion).
  - **Eksport do HTML (`.html`):** Samodzielny, elegancki dokument spełniający wymogi dostępności cyfrowej WCAG 2.1/2.2 AA (poprawna hierarchia nagłówków `<h1>`, `<h2>`, `<h3>`, wysoki kontrast kolorów, czytelna typografia oraz przygotowany arkusz stylów do wygodnego druku lub zapisu do pliku PDF).
  - Opcja szybkiego skopiowania wszystkich zgromadzonych notatek do schowka systemowego jednym kliknięciem.
- **Wygodna dolna nawigacja po dniach nauki:**
  - Na samym dole widoku każdego dnia dodano dolny pasek nawigacyjny z przyciskami: *„Poprzedni dzień”*, *„Na początek dnia”* oraz *„Następny dzień”*.
  - Kursant po ukończeniu zadań danego dnia nie musi już mozolnie przewijać strony na samą górę, aby przejść do kolejnej lekcji.
  - Po przełączeniu dnia strona automatycznie i płynnie przesuwa się na początek nowego dnia, a czytniki ekranu (NVDA, VoiceOver) natychmiast anonsują nową lekcję.
- **Wielokrotny wybór modyfikacji i ulepszeń (Pola wyboru zamiast pojedynczych przycisków):**
  - W ćwiczeniach, w których rozwijamy pierwotne projekty (np. Zadanie 3: wizytówka kawiarni, Zadanie 5: Cyber Bar czy Studio Eksperymentów CCOF), dotychczasowe pojedyncze przyciski zastąpiono wygodnymi polami wyboru (checkboxami).
  - Kursant może zaznaczyć kilka ulepszeń jednocześnie (np. *Licznik zamówień* + *Panel ocen i opinii* + *Dźwięk zamówienia* + *Luksusowy styl*).
  - Aplikacja automatycznie składa zaznaczone elementy w jeden spójny, profesjonalny prompt rozbudowujący projekt, zachowując istniejący kontekst i wygląd strony.
- **Skarbnica Projektów Piaskownicy i Paczka Wszystkich Prac na Zakończenie Kursu:**
  - Na podstronie Dyplomu (Podstrona 8) oraz w podsumowaniu Dnia 34 dodano dedykowaną **Skarbnicę Projektów z Piaskownicy**.
  - Kursant ma wgląd we wszystkie wygenerowane i przetestowane w trakcie kursu projekty (wizytówka kawiarni, Cyber Bar, kalkulatory, generatory i gry) wraz z możliwością ich pełnoekranowego podglądu na żywo.
  - Dodano możliwość pobrania pojedynczego projektu jako plik `.html` lub **pobrania wszystkich projektów naraz w jednym archiwum ZIP** (`Vibe_Coding_Wszystkie_Projekty.zip`).
  - Archiwum zawiera spis projektów (`SPIS_PROJEKTOW.html`) oraz jasną instrukcję (`INSTRUKCJA_FOLDERU.txt`), wyjaśniającą gdzie projekty trafiają na dysku i jak je otwierać offline w dowolnej przeglądarce.
  - Generator ZIP działa w 100% lokalnie w przeglądarce (zero zewnętrznych serwerów), zapewniając pełną prywatność i bezpieczeństwo.

## Co nowego w Wersji 3.2.5 (Weryfikacja Anty-Oszustwo, Punktacja Trudności, Ocena na Dyplomie i Stabilny Fokus NVDA)?
- **Blokada bezrefleksyjnego „odklikiwania” zadań (Mechanizm Anty-Oszustwo):**
  - Zlikwidowano trywialne checkboxy, które pozwalały kliknąć 100 razy i zaliczyć kurs w kilka sekund bez wykonywania żadnego zadania.
  - Zadanie uzyskuje oficjalny status zaliczenia wyłącznie po sprawdzeniu kodu lub odpowiedzi przez wbudowany Weryfikator AI.
- **4 oficjalne statusy zadań:**
  - `Wykonane poprawnie` (zielony badge ✓, punkty doliczone do konta),
  - `Wymaga poprawy` (czerwony badge ❌, gdy odpowiedź z AI jest niekompletna lub błędna),
  - `Pominięte na razie` (szary badge ⏳, pozwala odłożyć trudniejsze zadanie na później bez blokowania nauki),
  - `Do wykonania` (bursztynowy badge ⏳, stan początkowy).
- **Sprawiedliwy system punktacji trudności (Maksymalnie 1975 pkt):**
  - Wszystkie zadania otrzymały wagę punktową w zależności od etapu nauki: Etap 1 (10 pkt), Etap 2 (15 pkt), Etap 3 (20 pkt), Etap 4 (20 pkt), Etap 5 (25 pkt), Etap 6 (30 pkt).
  - Wartość punktowa jest wyraźnie oznaczona na każdej karcie zadania, a w nagłówku strony działa stały licznik zdobytych punktów.
- **Oficjalny Raport Końcowy i Ocena na Dyplomie:**
  - Podsumowanie na podstronie Dyplomu szczegółowo wylicza punkty, procent ukończenia i przypisuje oficjalną ocenę końcową:
    - **6.0 (Celujący)** – od 90% punktów (min. 1778 pkt),
    - **5.0 (Bardzo dobry)** – od 75% punktów (min. 1481 pkt),
    - **4.0 (Dobry)** – od 60% punktów (min. 1185 pkt),
    - **3.0 (Dostateczny)** – od 50% punktów (min. 988 pkt),
    - **W toku / Niedostateczny** – poniżej 50% punktów.
  - Ocena oraz zdobyte punkty są drukowane na eleganckim dyplomie w każdym z 4 stylów (Cyberpunk, Senior, Kreatywny, Klasyczny).
- **Pytanie o satysfakcję przed wystawieniem dyplomu:**
  - Zanim dyplom zostanie ostatecznie wygenerowany, system pyta kursanta: *„Czy uzyskana ocena jest dla Ciebie satysfakcjonująca?”*.
  - Jeśli ocena nie zadowala kursanta, może on jednym kliknięciem rozwinąć listę wszystkich zadań nieukończonych lub wymagających poprawy i za pomocą bezpośrednich linków skoczyć prosto do ich poprawiania, aby podnieść swoją ocenę.
- **Pełna stabilizacja fokusu NVDA (eliminacja uciążliwego przeskakiwania):**
  - Wyeliminowano błąd, w którym po wklejeniu odpowiedzi do pola weryfikacji i powrocie z innej karty przeglądarki kursor NVDA przeskakiwał na sam początek strony.
  - Zabezpieczono zdarzenia `storage` oraz `focus` inteligentnym strażnikiem `isUserFocusInEditor`, a weryfikacja aktualizuje element w miejscu (`updateSingleTaskCard`) i natychmiast kieruje fokus na ramkę z wynikiem sprawdzacza.

## Co nowego w Wersji 3.2.4 (Studio Eksperymentów i Rozwoju Projektu)?
- **Nowe „Studio Eksperymentów i Rozwoju Projektu” z zachowaniem kontekstu:**
  - Dotychczasowy, suchy formularz C-C-O-F przekształcono w potężne studio ulepszania stron.
  - Narzędzie automatycznie dołącza kod dotychczasowej strony z piaskownicy lub z zadań (Cyber Bar, Kawiarnia) do generowanego promptu, dzięki czemu AI zawsze wbudowuje nowe funkcje (np. licznik zamówień) w istniejący design, zamiast tworzyć pustą, surową stronę od zera.
- **Kafelki gotowych inspiracji (1 kliknięcie do eksperymentu):**
  - Gotowe szablony: Licznik zamówień z pamięcią dnia w `localStorage`, Złote gwiazdki i opinie klientów, Dźwięk zamówienia (Web Audio API) oraz Luksusowy styl (Złoto i Marmur).
- **Dostępność Studia w całym kompendium:**
  - Moduł jest teraz dostępny zarówno w Trybie Skupienia (`day_focus.html`), jak i w głównym widoku dnia na Podstronie 6 (`index.html`) oraz w paczce mobilnej dla iPhone.

## Co nowego w Wersji 3.2.3 (Zadanie Cyberpunk, Interaktywność i Bezpieczny Podgląd)?
- **Samodzielny i niezawodny prompt w Zadaniu 5 (Cyberpunk 2077):**
  - Wyeliminowano mylące odniesienie do „poprzedniego zadania” (które w Dniu 2 dotyczyło pytań kelnera, a kawiarnia znajdowała się w Dniu 1).
  - Nowy prompt jest w 100% samowystarczalny – sztuczna inteligencja (ChatGPT/Gemini) natychmiast generuje kompletną, mroczną i neonową stronę bez dopytywania o brakujący kod kawiarni.
- **Prawdziwa interakcja w piaskownicy (zamiast blokowanego `alert()`):**
  - Kliknięcie przycisku *„Aktywuj dawkę kofeiny”* wyświetla teraz efektowny, neonowy komunikat na samej stronie z animacją, eliminując blokowanie systemowych okienek dialogowych przez zabezpieczenia przeglądarek.
- **Bezpieczne pakowanie kodu dla iPhone i urządzeń mobilnych:**
  - Zabezpieczono wszystkie znaczniki `<\/script>` w szablonach zadań, co gwarantuje pełną stabilność jednoplikowego pakietu mobilnego `Kompendium_iPhone_WszystkoWJednym.html`.

## Co nowego w Wersji 3.2.2 (Inteligentny Weryfikator AI i Rozpoznawanie Komentarzy)?
- **Rozpoznawanie własnych wypowiedzi i komentarzy użytkownika:**
  - Jeśli użytkownik wpisze w pole weryfikatora własny komentarz, odmowę lub wiadomość (np. *„Nie mam ochoty Ci odpowiadać na żadne pytania!”*), system nie wyświetla już mylącego *„Jesteś bardzo blisko!”*.
  - Zamiast tego pojawia się czytelny komunikat: 💬 **„To wygląda na Twój własny komentarz, a nie odpowiedź od AI!”** z przypomnieniem, że w to okienko wklejamy wynik pracy ChatGPT/Gemini, a nie rozwiązujemy testu szkolnego.
- **Trzystopniowy, precyzyjny system oceniania:**
  - 🟢 **Sukces:** Zadanie zaliczone, gdy odpowiedź AI spełnia kryteria (np. w Zadaniu 4 AI rzeczywiście zadało pytania uściślające z `?`).
  - 🟡 **Na dobrej drodze:** Wyświetlane wyłącznie wtedy, gdy odpowiedź AI rzeczywiście częściowo pasuje, lecz wymaga drobnego doprecyzowania promptu.
  - 🔴 **Nie na temat:** Wyraźny sygnał, gdy wklejona treść w ogóle nie dotyczy danego zadania lub brak w niej kodu HTML w zadaniach aplikacyjnych.
- **Doprecyzowanie etykiet przycisków:**
  - Zmiana mylącej etykiety *„Sprawdź moją odpowiedź”* na precyzyjną: **„Sprawdź odpowiedź od AI”**, co eliminuje wrażenie, że użytkownik ma pisać własne odpowiedzi.

## Co nowego w Wersji 3.2.1 (Naprawa podglądu na żywo w piaskownicy)?
- **Pełna naprawa podglądu kodu HTML/CSS w piaskownicy (`srcdoc`):**
  - Wyeliminowano cichy błąd przeglądarki (`DOMException: Blocked cross-origin frame`), który blokował wyświetlanie podglądu wizytówki cukierni (zadanie 3) i innych aplikacji.
  - Zastosowano nowoczesny mechanizm `iframe.srcdoc`, który działa niezawodnie na wszystkich przeglądarkach (Chrome, Edge, Firefox, Safari na iOS).
- **Inteligentne uzupełnianie kodu do testu:**
  - Jeśli użytkownik kliknie *„Uruchom podgląd na żywo”* w piaskownicy, a pole tekstowe jest jeszcze puste, aplikacja automatycznie pobiera kod wpisany w weryfikatorze lub wczytuje gotowe rozwiązanie wzorcowe, aby od razu zobaczyć efekt bez zbędnych kroków.
- **Płynne przewijanie do podglądu:**
  - Po uruchomieniu podglądu ekran automatycznie i łagodnie zjeżdża do okna z gotową stroną, dzięki czemu od razu widać efekt wizualny.

## Co nowego w Wersji 3.2.0 (Przewodnik 3 Kroków, Automatyczny Weryfikator i Słowniczek bez Żargonu)?
- **Wstępna instrukcja „Jak korzystać z tego kursu w 3 prostych krokach”:**
  - Dostępna zawsze w górnym pasku (`📖 Instrukcja`), na Podstronie 1 (Wstęp) oraz jako rozwijany moduł na Podstronie 6 (Zadania Dnia).
  - Wytłumaczenie idei Vibe Codingu bez programowania: rola człowieka jako Reżysera i Architekta, a sztucznej inteligencji jako pracowitego asystenta.
  - Wyjaśnienie pętli 3 kroków każdego zadania: *1. Skopiuj prompt po polsku -> 2. Wklej do darmowego AI (ChatGPT/Gemini) -> 3. Sprawdź wynik w kursie*.
- **Aktywny system sprawdzania poprawności zadań (Weryfikator AI):**
  - Każde zadanie otrzymało interaktywną sekcję: pole na wklejenie odpowiedzi z AI oraz przycisk *„Sprawdź moją odpowiedź”*.
  - Automatyczna analiza poprawności z natychmiastowym feedbackiem:
    - 🟢 **Sukces:** automatyczne zaliczenie zadania, dźwięk fanfar, konfetti i odhaczenie ptaszka.
    - 🟡 **Wskazówka:** życzliwa podpowiedź, co warto uzupełnić w rozmowie z AI.
  - Przycisk *„Pokaż wzorcową odpowiedź”* umożliwia porównanie swojego wyniku z idealnym wzorcem.
- **Uporządkowanie piaskownicy (Bezpieczny kącik testowy):**
  - Wyraźne rozróżnienie zadań: przycisk *„Przetestuj w piaskownicy”* pojawia się **wyłącznie w zadaniach aplikacyjnych**, w których AI generuje kod HTML/JS.
  - W zadaniach tekstowych (promptingowych) usunięto mylący przycisk piaskownicy i zastąpiono go plakietką informacyjną.
  - Kliknięcie przycisku testowania automatycznie przenosi wygenerowany lub wzorcowy kod do piaskownicy i **natychmiast uruchamia podgląd na żywo**, likwidując konieczność zastanawiania się, co zrobić dalej.
- **Słowniczek pojęć po ludzku (Zero żargonu informatycznego):**
  - Interaktywne okno modalne (`💡 Słowniczek`) z wyszukiwarką na żywo.
  - Wszystkie pojęcia wyjaśnione za pomocą obrazowych analogii z życia codziennego:
    - *Prompt* ➡️ Zamówienie w restauracji,
    - *Klamerki XML (<tagi>)* ➡️ Teczka na dokumenty i klamerka do prania,
    - *Few-Shot* ➡️ Zdjęcie fryzury u fryzjera,
    - *Piaskownica* ➡️ Bezpieczny plac zabaw w przeglądarce,
    - *HTML / CSS / JS* ➡️ Ściany domu, kolor farby i włącznik światła,
    - *Stan aplikacji (State)* ➡️ Skarbonka pamiętająca wrzucone monety,
    - *Błąd (Bug)* ➡️ Kamyk w bucie,
    - *API* ➡️ Kelner zanoszący zamówienie do kuchni,
    - *Konsola F12* ➡️ Deska rozdzielcza z kontrolkami w aucie.
- **Uproszczenie treści zadań (w tym Zadania 7, 8, 9, 10, 11 i kolejne):**
  - Całkowite przepisanie zadań 7 i 8 na prosty język bez informatycznego żargonu.
- **Poprawa polskich znaków diakrytycznych:**
  - Weryfikacja i poprawa polskich znaków diakrytycznych we wszystkich plikach HTML, JS oraz skryptach pomocniczych `.bat` i `.ps1`.
- **Świadomy wybór punktu startowego po teście kompetencji:**
  - Po uzyskaniu wyniku w teście wiedzy (Podstrona 3) algorytm szczegółowo wyjaśnia, dlaczego sugeruje dany poziom, ale **nie wymusza skoku automatycznie**.
  - Użytkownik ma do wyboru dwa duże, czytelne przyciski:
    1. **Zalecany:** Rozpocznij od Dnia 1 (Od podstaw) — bezpieczna ścieżka, by nie pominąć żadnego triku.
    2. **Alternatywny:** Rozpocznij od Dnia X (Sugerowany poziom) — dla osób z doświadczeniem.
  - Na Podstronie 6 (Zadania Dnia), jeśli aktualny dzień jest większy niż 1, wyświetla się wyraźny baner informacyjny z przyciskiem: *„Przełącz na Dzień 1 (Od początku)”*, umożliwiający powrót w dowolnym momencie.
- **Blokada i zabezpieczenie Dyplomu Mistrza:**
  - Pole wpisywania imienia i nazwiska oraz przycisk druku/zapisu do PDF są **zablokowane** aż do momentu ukończenia wszystkich 100 zadań.
  - Zabezpieczenie stylami CSS `@media print` blokuje próbę nieautoryzowanego wydrukowania pustego dyplomu skrótem `Ctrl+P`.
- **Mechanizm grywalizacji „Oczyszczanie Dyplomu”:**
  - Użytkownik może w każdej chwili podejrzeć certyfikat, jednak w trakcie nauki jest on pokryty humorystycznymi „roboczymi zanieczyszczeniami stażysty” (wielki ukośny znak wodny *WERSJA ROBOCZA / PROJEKT*, rozlana kawa stażysty, plasterek pizzy z nocnego kodowania, barierka remontowa, robak konsoli F12 oraz tymczasowa pieczęć niezatwierdzonego projektu).
  - Wraz z postępami w nauce (co 20 ukończonych zadań) artefakty kolejno znikają, a dyplom staje się coraz czystszy:
    - **0–19 zadań:** 5 roboczych artefaktów + znak wodny + zamazane pole nazwiska.
    - **20–39 zadań:** Kawa wytarta (pozostały 4 artefakty).
    - **40–59 zadań:** Pizza zjedzona (pozostały 3 artefakty).
    - **60–79 zadań:** Barierka zdjęta (pozostały 2 artefakty).
    - **80–99 zadań:** Robak konsoli naprawiony (ostatni krok do mistrzostwa).
    - **100 zadań (Finał):** Krystalicznie czysty dyplom z oficjalną złotą pieczęcią mistrza, odblokowanym polem na własne imię i nazwisko oraz możliwością druku i zapisu do PDF!

## Co nowego w Wersji 3.0.0 (Architektura Podstron i Sekwencja Zdarzeń)?
- **Nowy układ podstron (Zero chaosu i rozpraszania):** Treść nie jest już wyświetlana w jednym długim oknie. Aplikacja została podzielona na dedykowane, czyste podstrony, z których w danym momencie aktywna jest tylko jedna.
- **Obowiązkowa sekwencja przygotowania (Bramka do kursu):** Właściwy kurs i zadania odblokowują się dopiero po przejściu 5 kolejnych etapów:
  1. **Podstrona 1: Wstęp i Motywacja** — Przedstawienie idei Vibe Codingu, 4 kluczowe filary korzyści, zasada 15 minut dziennie i cytat mistrza.
  2. **Podstrona 2: Wybór Profilu Twórcy** — 3 krótkie pytania (grupa wiekowa, forma gramatyczna do dyplomu, zainteresowania), 100% lokalnie i anonimowo (RODO-friendly).
  3. **Podstrona 3: Test Wiedzy** — Adaptacyjny 5-pytaniowy test diagnostyczny dopasowany do wybranego profilu, wyznaczający optymalną ścieżkę.
  4. **Podstrona 4: Zasady Bezpieczeństwa (BHP)** — 4 Złote Zasady (Poufność, Szef i Stażysta, Bezpieczny Sandbox przeglądarki, Zakaz Domysłów) zakończone obowiązkowym potwierdzeniem zapoznania się.
  5. **Podstrona 5: Konfiguracja Narzędzi i Google Gemini** — Kreator logowania do darmowego Gemini, kopiowanie promptu powitalnego i wklejenie odpowiedzi w celu weryfikacji gotowości stażysty AI.
  - **Odblokowanie Kursu:** Po zatwierdzeniu etapu 5 następuje wystrzał konfetti, fanfary i pełny dostęp do:
  6. **Podstrona 6: Zadania Dnia** — Czysty widok skupienia: tylko 3 zadania na dany dzień, przełącznik dni, narzędzia AI, wbudowana piaskownica oraz lokalny notatnik.
  7. **Podstrona 7: Cały Katalog 100 Zadań** — Kompletny eksplorator z wyszukiwarką i filtrami etapów (1–6) oraz statusu.
  8. **Podstrona 8: Nagrody, Odznaki i Dyplom Mistrza** — Panteon 8 odznak, skrzynia 4 nagród oraz generator oficjalnego certyfikatu z formatowaniem do druku A4.
- **Dostępność NVDA i VoiceOver:**
  - Przy przełączaniu podstron fokus automatycznie trafia na nagłówek H1 nowej podstrony.
  - Zawsze najpierw odczytywana jest właściwa nazwa akcji / czynności (np. „Usuń filtr”, „Kopiuj prompt”), a dopiero po niej krótki opis ikonki.
  - Skróty klawiszowe: <kbd>Alt+1</kbd> do <kbd>Alt+8</kbd> (szybki skok do podstron), <kbd>Alt+N</kbd> (następny dzień), <kbd>Alt+M</kbd> (dźwięk), <kbd>Alt+K</kbd> (wysoki kontrast).

## Kluczowe zasady dostępności i ergonomii
- **Kolejność odczytu ikonek w NVDA i VoiceOver:** We wszystkich przyciskach, nagłówkach, opcjach i odznakach czytnik ekranu wypowiada **najpierw właściwą nazwę akcji lub opcji** (np. *„Usuń kod”*, *„Kopiuj Prompt”*, *„Mój Profil”*), a dopiero po niej krótki opis ikonki (np. *„(ikona kosza)”*, *„(ikona schowka)”*).
- **Optymalizacja mobilna pod iPhone (iOS Safari):** Zwarte menu mobilne, duże pola dotykowe (minimum 44 px), blokada niechcianego auto-powiększania strony przy wpisywaniu tekstu, obsługa wycięcia ekranu (Safe Area) oraz wbudowany jednoprzyciskowy **Tryb Skupienia**.

---

## Jak uruchomić Kompendium na iPhone?

Aplikacja **Dysk Google** na iPhone ze względów bezpieczeństwa systemu iOS nie uruchamia stron `.html` ani skryptów JavaScript (wyświetla jedynie surowy kod źródłowy). Aby wygodnie korzystać z Kompendium w przeglądarce **Safari z VoiceOver**, wybierz jeden z 3 przygotowanych sposobów:

### Sposób 1 (Najwygodniejszy na stałe – działa 24/7 wszędzie, także poza domem)
**Własna darmowa aplikacja webowa na Twoim koncie Google (1 minuta konfiguracji):**
1. Na komputerze uruchom plik `Kopiuj_Kod_Chmura_Google_Dla_iPhone.bat` (automatycznie skopiuje cały kod do schowka).
2. Otwórz w przeglądarce stronę https://script.google.com i kliknij **Nowy projekt**.
3. Usuń domyślny tekst w edytorze, wklej kod ze schowka (**Ctrl+V**) i zapisz (**Ctrl+S**).
4. Kliknij u góry **Wdróż** -> **Nowe wdrożenie** -> wybierz typ **Aplikacja internetowa** -> kliknij **Wdróż**.
5. Otrzymany link otwórz na swoim **iPhonie w przeglądarce Safari** (możesz też kliknąć *Udostępnij -> Dodaj do ekranu początkowego*, aby mieć ikonę Kompendium bezpośrednio na pulpicie iPhone'a!).

*(Alternatywnie możesz przeciągnąć pojedynczy plik `Kompendium_iPhone_WszystkoWJednym.html` na stronę https://app.netlify.com/drop, aby w 5 sekund otrzymać krótki link `https://...netlify.app`).*

### Sposób 2 (Błyskawiczny w domu przez wspólne Wi-Fi – bez zakładania kont)
1. Uruchom na komputerze plik **`URUCHOM_SERWER_WIFI_DLA_IPHONE.bat`**.
2. Skrypt automatycznie uruchomi domowy serwer Wi-Fi, skopiuje adres do schowka oraz zapisze w tym folderze na Dysku Google plik **`OTWORZ_NA_IPHONE_LINK_WIFI.txt`**.
3. Na iPhonie w aplikacji **Dysk Google** otwórz plik `OTWORZ_NA_IPHONE_LINK_WIFI.txt` i stuknij podany w nim link `http://192.168...` — Kompendium od razu otworzy się w **Safari**!

### Sposób 3 (Offline bezpośrednio z jednego pliku na iPhone)
W folderze znajduje się samowystarczalny plik **`Kompendium_iPhone_WszystkoWJednym.html`** (zawiera cały kurs, 100 zadań i logikę w 1 pliku). W aplikacji Dysk Google na iPhone wybierz przy tym pliku **Więcej (trzy kropki) -> Otwórz w** i wskaż darmową aplikację obsługującą lokalne pliki HTML z JavaScriptem (np. **Documents by Readdle** lub **HTML Viewer** z App Store).

---

## Generator Zaproszeń i Udostępnianie (Integracja z Panelem Administratora)

W projekcie przygotowano 2 dedykowane szablony efektownych zaproszeń e-mail oraz wizualnych kart HTML (zgodnych z WCAG 2.1 AA):
1. **Zaproszenie ogólne na kurs Vibe Codingu (`Zaproszenie_Kurs_Vibe_Coding.html`):**
   - Zawiera inspirujące cytaty liderów sztucznej inteligencji: **Andrej Karpathy** (twórca terminu Vibe Coding), **Jensen Huang** (CEO NVIDIA), **Simon Willison** (Datasette / Django), **Sam Altman** (CEO OpenAI).
   - Przedstawia proces tworzenia w 4 prostych krokach wedle formuły C-C-O-F.
   - Posiada bezpośrednie przyciski do uruchomienia repozytorium na GitHubie.
2. **Wyjątkowe zaproszenie urodzinowe dla Żony (`Zaproszenie_Urodzinowe_Zona.html`):**
   - Efektowny, uroczysty i wzruszający prezent urodzinowy otwierający drzwi do świata tworzenia z AI bez konieczności nauki programowania.
   - Zawiera serdeczną dedykację od męża, opis 3 supermocy dla domu i pracy, bilet nielimitowanego wsparcia oraz przycisk startu.

Oba zaproszenia można w każdej chwili edytować, trwale zapisywać (w pliku `szablony_zaproszen.json` z zachowaniem 100% nienaruszalności wyglądu HTML) oraz wysyłać mailem (poprzez Microsoft Outlook lub systemową pocztę) bezpośrednio z poziomu **Panelu Administratora Antigravity (Kategoria 5, pod-widok Alt+2)**.
