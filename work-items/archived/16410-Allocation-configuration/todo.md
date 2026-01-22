# Allocation Configuration - Todo List

## Faza 1: Przygotowanie API i interfejsów (ZAKOŃCZONE)

- [x] **1.1 Stworzenie funkcji API requests** (api-requests-manager)
- [x] **1.2 Dodanie tłumaczeń** (translation-manager)

## Faza 2: Komponenty React (ZAKOŃCZONE)

- [x] **2.1 Komponent AllocationConfigurationTable** (react-component-creator)
- [x] **2.2 Komponent AllocationConfigurationEditModal** (react-component-creator)  
- [x] **2.3 Główny komponent StudyAllocationConfiguration** (react-component-creator)

## Faza 3: Integracja (ZAKOŃCZONE)

- [x] **3.1 Dodanie tabu do StudyRandomisationContent** (general-purpose)
- [x] **3.2 Eksporty i indeksy** (general-purpose)

## Faza 4: Kontrola jakości (ZAKOŃCZONE)

- [x] **4.1 Weryfikacja integracji**
- [x] **4.2 Kontrola jakości kodu**
- [x] **4.3 Testowanie funkcjonalności**

---

## DESIGN IMPROVEMENTS - Nowe zadania na podstawie analizy designu

### Faza 5: Rozszerzenie API i interfejsów

- [x] **5.1 Aktualizacja interfejsów AllocationConfiguration** (api-requests-manager)
  - [x] Dodanie pól: `treatmentArms: TreatmentArm[]`, `periods: Period[]`, `assignments: Assignment[]`
  - [x] Interface `TreatmentArm`: `{ id: string, name: string, description?: string }`
  - [x] Interface `Period`: `{ id: string, name: string, sequence: number }`
  - [x] Interface `Assignment`: `{ treatmentArmId: string, periodId: string, kitTypeIds: string[] }`
  - [x] Aktualizacja mockowanych danych z przykładowymi Treatment Arms i Periods

- [x] **5.2 API funkcje dla Kit Types** (api-requests-manager)
  - [x] Funkcja `fetchKitTypes` w common/requests
  - [x] Interface `KitType`: `{ id: string, name: string, description?: string }`
  - [x] Mockowane dane Kit Types

### Faza 6: Komponenty interfejsu alokacji

- [x] **6.1 Komponent AllocationConfigurationMatrix** (react-component-creator)
  - [x] `AllocationConfigurationMatrix.tsx` - interaktywna matrix
  - [x] Kolumny: Treatment Arms (po lewej) i Periods (górny wiersz)
  - [x] Każda komórka: dropdown do wyboru Kit Types
  - [x] Obsługa stanu "No kits added yet"
  - [x] Przycisk "Add new period"
  - [x] Integration z danymi AllocationConfiguration

- [x] **6.2 Komponent AllocationAssignmentCell** (react-component-creator)
  - [x] `AllocationAssignmentCell.tsx`
  - [x] Multi-select dropdown dla Kit Types
  - [x] Stan pusty z "Assign kits" placeholder
  - [x] Stan z wybranymi kitami (pokazywanie tagów)
  - [x] Stan "No kit assigned" gdy brak dostępnych kitów
  - [x] Przycisk "Go to kit types configuration" gdy brak kitów

- [x] **6.3 Komponent PeriodHeader z opcją dodawania** (react-component-creator)
  - [x] `PeriodHeader.tsx`
  - [x] Wyświetlanie nazwy period
  - [x] Przycisk delete dla period (jeśli >1)
  - [x] `AddPeriodButton.tsx` komponent
  - [x] Modal dla dodawania nowego period

### Faza 7: Aktualizacja głównych komponentów

- [x] **7.1 Refactor StudyAllocationConfiguration** (react-component-creator)
  - [x] Usunięcie tabeli, dodanie AllocationConfigurationMatrix
  - [x] Nowy layout zgodny z designem
  - [x] Obsługa expand/collapse konfiguracji
  - [x] Header z nazwą konfiguracji i linkiem do randomisation
  - [x] Przycisk "Save design"
  - [x] Przycisk "Add new design" na dole

- [x] **7.2 Aktualizacja AllocationConfigurationTable** (react-component-creator)
  - [x] Zmiana na accordion/expansion panel style
  - [x] Każda konfiguracja jako expandable section
  - [x] W środku AllocationConfigurationMatrix
  - [x] Header z nazwą i akcjami (edit/delete)

### Faza 8: Stany i walidacja

- [x] **8.1 Obsługa stanów pustych i błędów** (react-component-creator)
  - [x] Stan "Create a randomisation first" gdy brak randomisation
  - [x] Stan "No kits added yet" dla periods bez przypisanych kitów
  - [x] Obsługa przypadku gdy brak dostępnych Kit Types
  - [x] Komunikaty walidacyjne

- [x] **8.2 Integracja z Kit Types Configuration** (general-purpose)
  - [x] Przycisk "Go to kit types configuration" 
  - [x] Nawigacja do odpowiedniego tabu
  - [x] Refresh danych po powrocie z Kit Types

### Faza 9: Tłumaczenia i style

- [x] **9.1 Aktualizacja tłumaczeń** (translation-manager)
  - [x] Klucze dla matrix interface: `assign_kits`, `no_kits_added`, `add_new_period`
  - [x] Klucze dla stanów: `create_randomisation_first`, `go_to_kit_types`
  - [x] Klucze dla komunikatów: `save_design`, `add_new_design`

- [x] **9.2 Style CSS/LESS** (less-style-reviewer)
  - [x] Style dla AllocationConfigurationMatrix
  - [x] Responsive grid layout dla Treatment Arms x Periods
  - [x] Style dla dropdown komórek
  - [x] Style dla expansion panels
  - [x] Hover states i transitions

### Faza 10: Kontrola jakości design improvements (główny agent)

- [x] **10.1 Weryfikacja integracji design improvements**
  - [x] Test expansion/collapse konfiguracji
  - [x] Test przypisywania Kit Types w matrix
  - [x] Test dodawania nowych periods
  - [x] Test stanów pustych i komunikatów
  - [x] Test nawigacji do Kit Types Configuration

- [x] **10.2 Kontrola jakości kodu - design improvements**
  - [x] Wykonanie fast-check.md instrukcji
  - [x] Wykonanie lint.md instrukcji (tsc, eslint, prettier)
  - [x] Sprawdzenie czy design odpowiada oczekiwaniom z obrazków

- [x] **10.3 Optymalizacja UX**
  - [x] Sprawdzenie responsywności na różnych ekranach
  - [x] Weryfikacja accessibility
  - [x] Test performance z wieloma periods/treatment arms

