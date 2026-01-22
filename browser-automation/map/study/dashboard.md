# Study Dashboard - Panel główny badania

## Dostęp
- Z [[main-structure|struktury badania]] → Dashboard (domyślna strona)
- URL: `/en/studies/{studyId}/dashboard`

## Lokalizacja w kodzie
- **Page component**: Routing przez `StudyDetailsLayout`
- **UI components**:
  - `StudyDashboardContent` w `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyDashboardContent/StudyDashboardContent.tsx`
  - `DashboardAverageProgress` - główny panel postępu z okrągłym wykresem
  - `DashboardEcrfSections` - kafelki sekcji badania z procentami
  - `DashboardNumbers` - wskaźniki zadań (in progress/completed)
  - `InclusionsTable` - tabela uczestników w dolnej części
  - CSS klasy: `study-dashboard-content`, `study-dashboard-content__header`, `study-dashboard-content__statistics`

## Struktura strony

### Nagłówek powitalny
- **Komunikat**: "Good morning, [FirstName]!" (personalizowany)
- Dynamiczny na podstawie danych zalogowanego użytkownika i pory dnia

### Główny panel postępu
**Niebieska karta z okrągłym wykresem:**
- **Study progress**: Procent całkowitego postępu (kalkulowany dynamicznie)
- **Screened**: Liczba przebadanych uczestników
- **Enrolled**: Liczba włączonych uczestników

### Sekcje badania (kafelki)
**Dynamiczne kafelki postępu dla każdej sekcji badania:**

#### Struktura kafelka sekcji
- **Nazwa sekcji**: Dynamiczna nazwa z konfiguracji eCRF
- **Postęp**: Procent ukończenia (X%)
- **Completed records**: X/Y (ukończone/wszystkie rekordy)
- **Status**: Wizualny wskaźnik postępu

### Statusy zadań (dolna część)
**Pięć wskaźników zadań w rzędzie:**

#### In progress (niebieski)
- **Liczba**: "2" - dynamiczna liczba uczestników w trakcie badania
- **Ikona**: Niebieski kwadrat z liczbą
- **Opis**: "Total number of subjects in progress"

#### Completed (zielony)
- **Liczba**: "-" lub liczba
- **Ikona**: Zielony kwadrat z kreską
- **Opis**: "Total number of completed subjects"

#### Excluded (czerwony)
- **Liczba**: "-" lub liczba
- **Ikona**: Czerwony kwadrat z kreską  
- **Opis**: "Total number of excluded subjects"

#### Queries (szary)
- **Liczba**: "-" lub liczba
- **Ikona**: Szary kwadrat z kreską
- **Opis**: "Total number of queries"

#### Pending queries (żółty)
- **Liczba**: "-" lub liczba
- **Ikona**: Żółty kwadrat z kreską
- **Opis**: "Total number of pending queries"

### Screened Chart (dolna sekcja)
**Wykres osi czasu uczestników:**
- **Tytuł**: "Screened Chart"
- **Oś pozioma**: Timeline z podziałką
- **Dane**: Liczba przebadanych uczestników w czasie (np. "2" na określonym momencie)
- **Wizualizacja**: Liniowy wykres postępu w kolorze zielonym

## Funkcjonalności
- Przegląd ogólnego postępu badania
- Monitoring poszczególnych sekcji
- Śledzenie zadań w toku i ukończonych
- Spersonalizowane powitanie

## Dane wyświetlane
- Informacje pochodzą z aktywnego badania
- Postęp kalkulowany na podstawie wypełnionych formularzy
- Status uczestników (screened/enrolled)

## Powiązania
- Powrót do [[../studies|listy badań]]
- Przejście do innych sekcji z [[main-structure|menu badania]]
- Szczegółowe dane w [[inclusions-list|liście uczestników]]