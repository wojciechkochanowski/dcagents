# Study Settings - Ustawienia badania

## Dostęp

- Z [[main-structure|menu Study]] → kliknięcie w "Settings"
- URL pattern: `/en/studies/{studyId}/settings`

## Lokalizacja w kodzie

- **Page components**:
  - `StudySettingsContent` w `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudySettingsContent/`
  - Routing przez `StudyDetailsContent.tsx`
- **UI components**:
  - `StudySettingsGeneral` - ustawienia ogólne
  - `StudySettingsCenters` - centra badawcze
  - `StudySettingsOptions` - opcje badania
  - `StudySettingsRtsm` - ustawienia RTSM
  - `StudySettingsCustomisation` - personalizacja
- **CSS klasy**: `study-settings-content`

## Struktura strony

### Nagłówek

- **Tytuł**: "Settings" (h1)
- **Nawigacja**: Zakładki tabularne

### Zakładki Settings (5 tabów)

#### 1. General (domyślny)

- **Tab**: `tab "General" selectable selected`
- **Zawartość**: Podstawowe informacje o badaniu
- **Pola**:
  - Study name (nazwa badania)
  - Study reference (referencja badania)
  - Main contact (główny kontakt)
  - Number of inclusions needed (liczba włączeń)
  - Study status (status badania)
  - Start Date (data rozpoczęcia)
- **Przycisk**: "Edit" (edycja)

#### 2. Centers

- **Tab**: `tab "Centers"`
- **Zawartość**: Zarządzanie centrami badawczymi
- **Funkcje**: Lista i konfiguracja ośrodków

#### 3. Options

- **Tab**: `tab "Options"`
- **Zawartość**: Dodatkowe opcje badania
- **Funkcje**: Różne konfiguracje funkcjonalności

#### 4. RTSM settings

- **Tab**: `tab "RTSM settings" focusable focused selectable selected`
- **Zawartość**: Konfiguracja RTSM
- **Przełączniki**:
  - **Randomization**: "Allows you to create treatment arms (groups) and randomize subjects blindly or double blindly"
    - `switch "" checked checked="true"`
  - **Allocation**: "Allows you to create kits and allocate them to the participants. Doesn't require randomization"
    - `switch "" checked checked="true"`

#### 5. Customization

- **Tab**: `tab "Customization"`
- **Zawartość**: Personalizacja interfejsu
- **Funkcje**: Dostosowanie wyglądu i funkcji

## Funkcjonalności RTSM Settings

- **Randomization toggle**: Włącza/wyłącza funkcję randomizacji
- **Allocation toggle**: Włącza/wyłącza funkcję alokacji kitów
- Przełączniki kontrolują dostępność odpowiednich funkcji w [[randomization|stronie RTSM]]

## Uprawnienia

- Dostęp do Settings uzależniony od uprawnień użytkownika
- Edycja ustawień może być ograniczona do adminów badania

## Dane dynamiczne

- Wszystkie ustawienia pochodzą z konfiguracji badania
- Zmiany są zapisywane w czasie rzeczywistym
- Status przełączników RTSM wpływa na dostępność funkcji randomizacji
