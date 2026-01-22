# Subject Database Settings - Ustawienia bazy badanych

## Dostęp
- Z [[../subject-database|Subject Database]] → przycisk "Settings"
- URL pattern: `/subject-database/settings` (prawdopodobnie)

## Lokalizacja w kodzie
- **Page component**: Routing przez `SubjectRepository` w `frontend/apps/datacapt/src/components/SubjectRepository/SubjectRepository.tsx` (ścieżka /settings)
- **UI components**:
  - `SubjectRepositorySettings` w `frontend/apps/datacapt/src/components/SubjectRepository/SubjectRepositorySettings/SubjectRepositorySettings.tsx`
  - `SubjectRepositoryBuilderContent` w `frontend/apps/datacapt/src/components/SubjectRepository/SubjectRepositoryBuilderContent/SubjectRepositoryBuilderContent.tsx`
  - `SubjectRepositoryBuilder` w `frontend/apps/datacapt/src/components/SubjectRepository/SubjectRepositoryBuilderContent/SubjectRepositoryBuilder.tsx`
  - `SubjectRepositoryQrCodes` w `frontend/apps/datacapt/src/components/SubjectRepository/SubjectRepositoryQrCodes/SubjectRepositoryQrCodes.tsx`
  - CSS klasy: `subject-repository-settings`, `subject-repository-settings__box`, `subject-repository-settings__row`

## Struktura strony

### Nagłówek
- **Przycisk "Back"**: Powrót do listy badanych
- **Tytuł**: "Settings"
- **Opis**: "Changes to these settings will be applied to all members within your organization"

### Sekcja "Form Builder"
**Database Form Builder:**
- **Tytuł**: "Database Form Builder"
- **Opis**: "Create and effortlessly design, customize, and manage forms for streamlined information gathering"
- **Funkcja**: Konstruktor formularzy dla bazy badanych
- **Link/przycisk**: Prawdopodobnie prowadzi do buildera formularzy

### Sekcja "Public link & QR-Code"
**Public Registration:**
- **Tytuł**: "Public Registration"  
- **Opis**: "Access your center-specific public registration link or QR code. Subjects can effortlessly create personal accounts and complete their database survey anytime, 24/7."
- **Funkcje**:
  - Generowanie publicznego linku rejestracji
  - Tworzenie kodów QR dla rejestracji
  - Umożliwienie badanym samodzielnej rejestracji
  - Dostęp 24/7 do formularzy rejestracyjnych

## Funkcjonalności
- **Zarządzanie formularzami**: Tworzenie niestandardowych formularzy
- **Publiczna rejestracja**: System samoobsługowej rejestracji badanych
- **QR kody**: Łatwy dostęp dla badanych poprzez skanowanie
- **Konfiguracja organizacyjna**: Ustawienia wpływają na całą organizację

## Uprawnienia
- Dostęp prawdopodobnie ograniczony do administratorów
- Zmiany wpływają na wszystkich członków organizacji
- Wymaga uprawnień do zarządzania bazą badanych

## Powiązania
- Powrót do [[../subject-database|głównej strony Subject Database]]
- Form Builder prawdopodobnie prowadzi do [[form-builder|konstruktora formularzy]]
- Public Registration do [[public-registration|konfiguracji publicznej rejestracji]]
- Związek z [[../main-menu|głównym menu]]