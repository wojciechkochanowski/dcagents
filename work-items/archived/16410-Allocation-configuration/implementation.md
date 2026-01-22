# Allocation Configuration - Implementation Plan

## Dostępni Sub-agenci

Z `~/work/datacapt/instructions/agent-instructions.md`:
- **react-component-creator**: Tworzenie nowych komponentów React
- **api-requests-manager**: Zarządzanie funkcjami API w katalogu requests
- **general-purpose**: Zadania ogólne, wyszukiwanie, analiza kodu

## Zadania do wykonania

### Faza 1: Przygotowanie API i interfejsów (równoległe)

#### 1.1 Stworzenie funkcji API requests
**Sub-agent:** api-requests-manager  
**Czas:** ~30 min  
**Opis:** Stworzenie w `common/requests/` funkcji do obsługi allocation configurations  
**Deliverables:**
- `fetchAllocationConfigurations`
- `createAllocationConfiguration` 
- `updateAllocationConfiguration`
- `deleteAllocationConfiguration`
- Interfejs `AllocationConfiguration` i `AllocationConfigurationSorter`
- Mockowane odpowiedzi na początku

#### 1.2 Dodanie tłumaczeń
**Sub-agent:** translation-manager  
**Czas:** ~15 min  
**Opis:** Dodanie kluczy tłumaczeń do `common/intl/en.json`  
**Deliverables:**
- Klucze w sekcji `studies.randomisation.allocation_configuration`
- Podstawowe teksty dla tabeli, modala, komunikatów

### Faza 2: Komponenty (równoległe po fazie 1)

#### 2.1 Komponent AllocationConfigurationTable
**Sub-agent:** react-component-creator  
**Czas:** ~45 min  
**Wzorzec:** `StudyRandomisationKitTypes/KitTypeTable`  
**Opis:** Tabela wyświetlająca konfiguracje alokacji  
**Deliverables:**
- `AllocationConfigurationTable.tsx`
- Kolumny: name, description, type, actions
- Sortowanie, akcje edit/delete
- Obsługa uprawnień (readonly vs edit)

#### 2.2 Komponent AllocationConfigurationEditModal  
**Sub-agent:** react-component-creator  
**Czas:** ~45 min  
**Wzorzec:** `StudyRandomisationKitTypes/KitTypeEditModal`  
**Opis:** Modal do tworzenia/edycji konfiguracji  
**Deliverables:**
- `AllocationConfigurationEditModal.tsx`
- Formularz z polami: name, description, type, settings
- Walidacja, obsługa błędów
- Tryby: create/edit

#### 2.3 Główny komponent StudyAllocationConfiguration
**Sub-agent:** react-component-creator  
**Czas:** ~30 min  
**Wzorzec:** `StudyRandomisationKitTypes/StudyRandomisationKitTypes.tsx`  
**Opis:** Główny komponent łączący tabelę i modal  
**Deliverables:**
- `StudyAllocationConfiguration.tsx`
- Zarządzanie stanem (loading, data, modals)
- Integracja z API
- Obsługa uprawnień

### Faza 3: Integracja z głównym interfejsem

#### 3.1 Dodanie tabu do StudyRandomisationContent
**Sub-agent:** general-purpose  
**Czas:** ~20 min  
**Opis:** Modyfikacja `StudyRandomisationContent.tsx`  
**Deliverables:**
- Nowy tab "Allocation Configuration" w `TabsRandomisation` enum
- Import i użycie `StudyAllocationConfiguration`
- Sprawdzenie uprawnień `AclFeature.Allocation`

#### 3.2 Eksporty i indeksy
**Sub-agent:** general-purpose  
**Czas:** ~10 min  
**Opis:** Stworzenie plików index.ts  
**Deliverables:**
- `StudyAllocationConfiguration/index.ts`
- `AllocationConfigurationTable/index.ts`
- `AllocationConfigurationEditModal/index.ts`

## Plan dla głównego agenta

### Po zakończeniu prac sub-agentów:

1. **Weryfikacja integracji** (~20 min)
   - Sprawdzenie czy wszystkie komponenty są poprawnie połączone
   - Testowanie flow: przeglądanie → tworzenie → edycja → usuwanie
   - Weryfikacja uprawnień readonly vs edit

2. **Kontrola jakości**
   - Wykonanie `~/work/datacapt/.claude/commands/fast-check.md`
   - Wykonanie `~/work/datacapt/instructions/lint.md`
   - Sprawdzenie `requirements.md` - czy wszystkie AC są spełnione

3. **Testowanie funkcjonalności**
   - Sprawdzenie czy tab jest widoczny w StudyRandomisationContent
   - Test tworzenia nowej konfiguracji
   - Test edycji istniejącej konfiguracji  
   - Test uprawnień (readonly user nie może edytować)
   - Test usuwania z potwierdzeniem

4. **Dokumentacja problemów**
   - Aktualizacja `issues.md` jeśli wystąpią problemy
   - Aktualizacja `bugs.md` jeśli znajdziemy bugi
   - Aktualizacja `todo.md` z ukończonymi zadaniami

## Uwagi implementacyjne

- **Mockowanie API**: Na początku wszystkie funkcje API zwracają mockowane dane
- **Uprawnienia**: Używamy istniejących `AclFeature.Allocation` i `AclFeature.AllocationSettings`
- **Stylowanie**: Używamy istniejących klas CSS lub Ant Design, nie tworzymy nowych stylów
- **Wzorce**: Ściśle trzymamy się wzorców z StudyRandomisationKitTypes
- **Tłumaczenia**: Tylko en.json, pozostałe języki będą dodane później przez translation-manager

## Kolejność wykonania

1. **Równolegle**: API (1.1) + Tłumaczenia (1.2)
2. **Równolegle po 1**: Tabela (2.1) + Modal (2.2) + Główny komponent (2.3)  
3. **Sekwencyjnie po 2**: Integracja tabu (3.1) → Eksporty (3.2)
4. **Na końcu**: Weryfikacja i kontrola jakości przez głównego agenta

**Szacowany czas całkowity:** ~3-4 godziny

# Allocation Configuration - Design Improvements

## Dostępni Sub-agenci

Z `~/work/datacapt/instructions/agent-instructions.md`:
- **react-component-creator**: Tworzenie nowych komponentów React
- **api-requests-manager**: Zarządzanie funkcjami API w katalogu requests
- **general-purpose**: Zadania ogólne, wyszukiwanie, analiza kodu

## Analiza różnic między designem a implementacją

**UWAGA:** Aby zrozumieć oczekiwany design, sprawdź obrazki w katalogu:
`/Users/bartek/work/datacapt/work-items/16410-Allocation-configuration/images/`

### Główne problemy zidentyfikowane:

1. **Brak dynamicznego interfejsu konfiguracji alokacji**
   - Aktualnie: Zwykła tabela z nazwa, opisem i typem
   - Design: Interaktywny interfejs pokazujący Treatment Arms, Periods i przypisywanie Kit Types
   - **Referencja:** `Allocation config - happy path.png` - pokazuje główny interfejs matrix

2. **Brak wizualizacji Treatment Arms i Periods**
   - Design pokazuje kolumny dla grup (Group 1, Group 2) i periods (Period 1, Period 2, Period 3)
   - Aktualna implementacja nie ma tej funkcjonalności
   - **Referencja:** `Allocation config - more periods, no kits.png` - pokazuje layout z wieloma periods

3. **Brak interfejsu przypisywania Kit Types**
   - Design pokazuje dropdowny "Assign kits" dla każdej kombinacji grupa/period
   - Brak integracji z Kit Types z tabela kit_types
   - **Referencja:** `Allocation config - selecting kits.png` - pokazuje dropdown z Kit Types

4. **Brak obsługi stanów "No kits added yet"**
   - Design pokazuje komunikaty gdy brak przypisanych kitów
   - Brak przycisku "Go to kit types configuration"
   - **Referencja:** `Allocation config - more periods, no kits.png` - pokazuje stan bez przypisanych kitów

5. **Brak obsługi dynamicznego dodawania periods**
   - Design pokazuje przycisk "Add new period"
   - Aktualnie brak tej funkcjonalności
   - **Referencja:** `Allocation config - happy path.png` - pokazuje przycisk "+" do dodawania periods

6. **Brak stanu "Create a randomisation first"**
   - Design pokazuje komunikat gdy brak randomisation
   - **Referencja:** `Allocation config - no randomisation yet.png` - pokazuje stan początkowy

7. **Brak readonly mode z komunikatem**
   - Design pokazuje tooltip "Can't edit cause the study is live"
   - **Referencja:** `Allocation config - view only.png` - pokazuje readonly mode

## Zadania do wykonania

### Faza 1: Rozszerzenie API i interfejsów

#### 1.1 Aktualizacja interfejsów AllocationConfiguration
**Sub-agent:** api-requests-manager  
**Czas:** ~45 min  
**Opis:** Rozszerzenie interfejsu AllocationConfiguration o nowe pola  
**Deliverables:**
- Dodanie pól: `treatmentArms: TreatmentArm[]`, `periods: Period[]`, `assignments: Assignment[]`
- Interface `TreatmentArm`: `{ id: string, name: string, description?: string }`
- Interface `Period`: `{ id: string, name: string, sequence: number }`
- Interface `Assignment`: `{ treatmentArmId: string, periodId: string, kitTypeIds: string[] }`
- Aktualizacja mockowanych danych z przykładowymi Treatment Arms i Periods

#### 1.2 API funkcje dla Kit Types
**Sub-agent:** api-requests-manager  
**Czas:** ~30 min  
**Opis:** Dodanie funkcji do pobierania dostępnych Kit Types  
**Deliverables:**
- Funkcja `fetchKitTypes` w common/requests
- Interface `KitType`: `{ id: string, name: string, description?: string }`
- Mockowane dane Kit Types

### Faza 2: Komponenty interfejsu alokacji

#### 2.1 Komponent AllocationConfigurationMatrix
**Sub-agent:** react-component-creator  
**Czas:** ~90 min  
**Wzorzec:** Nowy komponent bazujący na designie  
**Opis:** Główny komponent matrix dla konfiguracji alokacji  
**Design reference:** Sprawdź obrazki w `/Users/bartek/work/datacapt/work-items/16410-Allocation-configuration/images/`
- `Allocation config - happy path.png` - główny layout matrix
- `Allocation config - more periods, no kits.png` - layout z wieloma periods
**Deliverables:**
- `AllocationConfigurationMatrix.tsx` - interaktywna matrix
- Kolumny: Treatment Arms (po lewej) i Periods (górny wiersz) - jak w obrazkach
- Każda komórka: dropdown do wyboru Kit Types (patrz `Allocation config - selecting kits.png`)
- Obsługa stanu "No kits added yet" (patrz `Allocation config - more periods, no kits.png`)
- Przycisk "Add new period" (symbol "+" jak w `Allocation config - happy path.png`)
- Integration z danymi AllocationConfiguration

#### 2.2 Komponent AllocationAssignmentCell
**Sub-agent:** react-component-creator  
**Czas:** ~60 min  
**Opis:** Komponent komórki do przypisywania Kit Types  
**Design reference:** Sprawdź obrazki w `/Users/bartek/work/datacapt/work-items/16410-Allocation-configuration/images/`
- `Allocation config - selecting kits.png` - dropdown z Kit Types i zaznaczonymi opcjami
- `Allocation config - more periods, no kits.png` - stan "No kits added yet" z przyciskiem "Go to kit types configuration"
- `Allocation config - happy path.png` - komórki z przypisanymi Kit Types (Kit 1234, Kit 1221, Placebo)
**Deliverables:**
- `AllocationAssignmentCell.tsx`
- Multi-select dropdown dla Kit Types (jak w `Allocation config - selecting kits.png`)
- Stan pusty z "Assign kits" placeholder
- Stan z wybranymi kitami (pokazywanie jako tagi jak "Kit 1234", "Kit 1221")
- Stan "No kit assigned" gdy brak dostępnych kitów
- Przycisk "Go to kit types configuration" gdy brak kitów (jak w `Allocation config - more periods, no kits.png`)

#### 2.3 Komponent PeriodHeader z opcją dodawania
**Sub-agent:** react-component-creator  
**Czas:** ~45 min  
**Opis:** Header dla periods z możliwością dodawania nowych  
**Design reference:** Sprawdź obrazki w `/Users/bartek/work/datacapt/work-items/16410-Allocation-configuration/images/`
- `Allocation config - happy path.png` - pokazuje headery "PERIOD 1" i przycisk "+" do dodawania
- `Allocation config - more periods, no kits.png` - pokazuje headery "PERIOD 1", "PERIOD 2", "PERIOD 3" z ikonami delete
**Deliverables:**
- `PeriodHeader.tsx`
- Wyświetlanie nazwy period (np. "PERIOD 1", "PERIOD 2" jak w obrazkach)
- Przycisk delete dla period (jeśli >1) - ikona kosza jak w `Allocation config - more periods, no kits.png`
- `AddPeriodButton.tsx` komponent - przycisk "+" jak w `Allocation config - happy path.png`
- Modal dla dodawania nowego period

### Faza 3: Aktualizacja głównych komponentów

#### 3.1 Refactor StudyAllocationConfiguration
**Sub-agent:** react-component-creator  
**Czas:** ~60 min  
**Opis:** Aktualizacja głównego komponentu do nowego designu  
**Design reference:** Sprawdź obrazki w `/Users/bartek/work/datacapt/work-items/16410-Allocation-configuration/images/`
- `Allocation config - happy path.png` - pokazuje główny layout z headerem "Allocation configuration 1", linkiem "Randomisation 1", przyciskiem "Save design"
- `Allocation config - no randomisation yet.png` - pokazuje stan "Create a randomisation first" z przyciskiem "Create randomisation"
- `Allocation config - view only.png` - pokazuje readonly mode z tooltipem "Can't edit cause the study is live"
**Deliverables:**
- Usunięcie tabeli, dodanie AllocationConfigurationMatrix
- Nowy layout zgodny z designem (expansion panel jak w obrazkach)
- Obsługa expand/collapse konfiguracji (przycisk collapse/expand w prawym górnym rogu)
- Header z nazwą konfiguracji i linkiem do randomisation (jak "Allocation configuration 1" + "Randomisation 1")
- Przycisk "Save design" (niebieski przycisk jak w obrazkach)
- Przycisk "Add new design" na dole (jak w `Allocation config - happy path.png`)

#### 3.2 Aktualizacja AllocationConfigurationTable
**Sub-agent:** react-component-creator  
**Czas:** ~30 min  
**Opis:** Uproszczenie tabeli do listy konfiguracji (accordion style)  
**Design reference:** Sprawdź obrazki w `/Users/bartek/work/datacapt/work-items/16410-Allocation-configuration/images/`
- Wszystkie obrazki pokazują expansion panel style zamiast tradycyjnej tabeli
- `Allocation config - happy path.png` - pokazuje expandable section z headerem i matrix w środku
- `Allocation config - view only.png` - pokazuje kilka konfiguracji jedna pod drugą jako expansion panels
**Deliverables:**
- Zmiana na accordion/expansion panel style (jak w obrazkach - białe panele z zaokrąglonymi rogami)
- Każda konfiguracja jako expandable section
- W środku AllocationConfigurationMatrix
- Header z nazwą i akcjami (edit/delete) - ikona kosza w prawym górnym rogu jak w obrazkach

### Faza 4: Stany i walidacja

#### 4.1 Obsługa stanów pustych i błędów
**Sub-agent:** react-component-creator  
**Czas:** ~45 min  
**Opis:** Implementacja stanów pokazanych w designie  
**Design reference:** Sprawdź obrazki w `/Users/bartek/work/datacapt/work-items/16410-Allocation-configuration/images/`
- `Allocation config - no randomisation yet.png` - stan "Create a randomisation first" z wycentrowanym komunikatem i przyciskiem
- `Allocation config - more periods, no kits.png` - stan "No kits added yet" w komórkach matrix
- `Allocation config - view only.png` - tooltip "Can't edit cause the study is live" na hover
**Deliverables:**
- Stan "Create a randomisation first" gdy brak randomisation (jak w `Allocation config - no randomisation yet.png`)
- Stan "No kits added yet" dla periods bez przypisanych kitów (jak w `Allocation config - more periods, no kits.png`)
- Tooltip readonly mode (jak w `Allocation config - view only.png`)
- Obsługa przypadku gdy brak dostępnych Kit Types
- Komunikaty walidacyjne

#### 4.2 Integracja z Kit Types Configuration
**Sub-agent:** general-purpose  
**Czas:** ~30 min  
**Opis:** Linki i nawigacja do Kit Types Configuration  
**Deliverables:**
- Przycisk "Go to kit types configuration" 
- Nawigacja do odpowiedniego tabu
- Refresh danych po powrocie z Kit Types

### Faza 5: Tłumaczenia i style

#### 5.1 Aktualizacja tłumaczeń
**Sub-agent:** translation-manager  
**Czas:** ~30 min  
**Opis:** Dodanie nowych kluczy tłumaczeń  
**Deliverables:**
- Klucze dla matrix interface: `assign_kits`, `no_kits_added`, `add_new_period`
- Klucze dla stanów: `create_randomisation_first`, `go_to_kit_types`
- Klucze dla komunikatów: `save_design`, `add_new_design`

#### 5.2 Style CSS/LESS
**Sub-agent:** less-style-reviewer  
**Czas:** ~45 min  
**Opis:** Style dla nowego interfejsu matrix  
**Design reference:** Sprawdź obrazki w `/Users/bartek/work/datacapt/work-items/16410-Allocation-configuration/images/`
- Wszystkie obrazki pokazują konkretny design system: białe panele, zaokrąglone rogi, szare tło
- `Allocation config - happy path.png` - pokazuje layout matrix z Treatment Arms po lewej, Periods na górze
- `Allocation config - selecting kits.png` - pokazuje styl dropdown z zaznaczonymi opcjami
**Deliverables:**
- Style dla AllocationConfigurationMatrix (grid layout jak w obrazkach)
- Responsive grid layout dla Treatment Arms x Periods (szare nagłówki, białe komórki)
- Style dla dropdown komórek (jak w `Allocation config - selecting kits.png`)
- Style dla expansion panels (białe panele z zaokrąglonymi rogami na szarym tle)
- Hover states i transitions
- Kolory i czcionki zgodne z istniejącym design systemem

## Plan dla głównego agenta

### Po zakończeniu prac sub-agentów:

1. **Weryfikacja integracji** (~30 min)
   - Sprawdzenie czy AllocationConfigurationMatrix jest poprawnie zintegrowana
   - Test flow: expand konfiguracji → przypisanie kitów → save
   - Weryfikacja nawigacji do Kit Types Configuration
   - Test dodawania nowych periods
   - **Weryfikacja wizualna:** Porównanie z obrazkami w `/Users/bartek/work/datacapt/work-items/16410-Allocation-configuration/images/`

2. **Kontrola jakości**
   - Wykonanie `~/work/datacapt/.claude/commands/fast-check.md`
   - Wykonanie `~/work/datacapt/instructions/lint.md`
   - Sprawdzenie `requirements.md` - czy wszystkie AC są spełnione
   - **Sprawdzenie zgodności z designem:** Czy implementacja odpowiada obrazkom

3. **Testowanie funkcjonalności**
   - Test expansion/collapse konfiguracji (jak w obrazkach)
   - Test przypisywania Kit Types w matrix (dropdown jak w `Allocation config - selecting kits.png`)
   - Test dodawania nowych periods (przycisk "+" jak w `Allocation config - happy path.png`)
   - Test stanów pustych i komunikatów (jak w `Allocation config - no randomisation yet.png`)
   - Test uprawnień (readonly mode jak w `Allocation config - view only.png`)
   - Test nawigacji do Kit Types Configuration

4. **Optymalizacja UX**
   - Sprawdzenie responsywności na różnych ekranach
   - Weryfikacja accessibility
   - Test performance z wieloma periods/treatment arms
   - **Weryfikacja designu:** Czy wszystkie elementy wyglądają jak w obrazkach referencyjnych

## Uwagi implementacyjne

- **Design System**: Używamy istniejących komponentów Ant Design + DatacComponents
- **Referencja wizualna**: ZAWSZE sprawdzaj obrazki w `/Users/bartek/work/datacapt/work-items/16410-Allocation-configuration/images/` przed implementacją
- **State Management**: Stan lokalny w StudyAllocationConfiguration, przekazywany do Matrix
- **Data Flow**: Matrix otrzymuje dane i callback do aktualizacji assignments
- **Validation**: Walidacja na poziomie komponentu Matrix przed zapisem
- **Permissions**: Readonly users widzą Matrix ale bez możliwości edycji (tooltip jak w `Allocation config - view only.png`)
- **Performance**: Lazy loading dla dużych ilości Kit Types
- **Layout**: Grid system jak w obrazkach - Treatment Arms po lewej stronie, Periods jako kolumny na górze

## Kolejność wykonania

1. **Równolegle**: API rozszerzenia (1.1) + Kit Types API (1.2) + Tłumaczenia (5.1)
2. **Równolegle po 1**: Matrix (2.1) + Assignment Cell (2.2) + Period Header (2.3)
3. **Sekwencyjnie po 2**: Refactor głównego komponentu (3.1) → Aktualizacja tabeli (3.2)
4. **Równolegle po 3**: Stany i walidacja (4.1) + Integracja Kit Types (4.2) + Style (5.2)
5. **Na końcu**: Weryfikacja i kontrola jakości przez głównego agenta

**Szacowany czas całkowity:** ~7-8 godzin

