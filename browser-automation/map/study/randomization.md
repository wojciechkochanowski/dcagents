# RTSM - Randomization and Trial Supply Management

## Dostęp

- Z [[main-structure|menu Study]] → kliknięcie w "RTSM"
- URL pattern: `/en/studies/{studyId}/randomisation`

## Lokalizacja w kodzie

- **Page components**:
  - `StudyRandomisationContent` w `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyRandomisationContent/`
  - Routing przez `StudyDetailsContent.tsx`
- **UI components**:
  - `StudyRandomisationConfigurations` - konfiguracja randomizacji
  - `StudyRandomisationList` - lista randomizacji
  - `StudyAllocationConfiguration` - konfiguracja alokacji
  - `StudyRandomisationKitTypes` - typy kitów
  - `StudyRandomisationKitsInventory` - inwentarz kitów
- **CSS klasy**: `study-randomisation-content`

## Struktura strony

### Nagłówek

- **Tytuł**: "Randomization and trial supply management" (h2)
- **Nawigacja**: Zakładki tabularne

### Zakładki RTSM (5 tabów)

#### 1. Randomization configuration (domyślny)

- **Tab**: `tab "Randomization configuration" selectable selected`
- **Zawartość**: Lista konfiguracji randomizacji
- **Funkcje**:
  - Przycisk "Add new configuration"
  - Konfiguracje z przyciskami edycji/usuwania

#### 2. Randomization list

- **Tab**: `tab "Randomization list"`
- **Zawartość**: Lista wykonanych randomizacji
- **Funkcje**: Tabela z danymi randomizacji uczestników

#### 3. Allocation configuration

- **Tab**: `tab "Allocation configuration"`
- **Zawartość**: Konfiguracja alokacji kitów
- **Funkcje**: Macierz alokacji z przypisaniami

#### 4. Kit types configuration

- **Tab**: `tab "Kit types configuration"`
- **Zawartość**: Konfiguracja typów kitów
- **Funkcje**: Tabela typów z edycją/usuwaniem

#### 5. Kits inventory

- **Tab**: `tab "Kits inventory"`
- **Zawartość**: Inwentarz dostępnych kitów
- **Funkcje**: Tabela stanów kitów, uploady

## Uprawnienia

- Widoczność menu uzależniona od uprawnień:
  - `AclFeature.RandomizationConfiguration`
  - `AclFeature.RandomizationList`
  - `AclFeature.RandomizationKitsAllocation`
- Warunek: `shouldShowRtsm` w `StudyDetailsNavigation.tsx`

## Funkcjonalności

- **Randomization**: Tworzenie grup leczenia i losowa alokacja
- **Allocation**: Przypisywanie kitów uczestnikom
- **Kit Management**: Zarządzanie stanami i typami kitów
- **Upload/Import**: Import konfiguracji i danych

## Dane dynamiczne

- Konfiguracje randomizacji zależne od setup'u badania
- Lista randomizacji zawiera rzeczywiste przypisania uczestników
- Stany kitów aktualizowane w czasie rzeczywistym
- Wszystkie dane pochodzą z backend API
