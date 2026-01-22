# Settings - Personal Details - Dane osobowe

## Dostęp
- Z [[main-settings|głównych ustawień]] → Personal details (domyślna strona)
- URL: `/en/settings/personal-details`

## Lokalizacja w kodzie
- **Page component**: Routing przez `SettingsLayout`
- **UI components**:
  - `SettingsPersonalDetails` w `frontend/apps/datacapt/src/components/settings/SettingsPersonalDetails/SettingsPersonalDetails.tsx`
  - CSS klasy: `personal-details-content`, `personal-details-content__header`, `personal-details-content__form`, `personal-details-content__row`

## Struktura strony

### Nagłówek
- **Tytuł**: "Personal details"

### Formularz danych osobowych
**Pola edytowalne:**
- **First name**: Pole tekstowe z imieniem użytkownika
- **Last name**: Pole tekstowe z nazwiskiem użytkownika  
- **Company**: Pole tekstowe z nazwą firmy/organizacji
- **E-mail**: Pole z adresem email (prawdopodobnie tylko do odczytu)
- **Language**: Dropdown wyboru języka interfejsu

### Dropdown Language
**Dostępne języki:**
- English (domyślny)
- Inne języki (w zależności od konfiguracji systemu)
- Ikona flagi kraju przy wybranym języku

## Funkcjonalności
- **Edycja profilu**: Aktualizacja danych osobowych
- **Zmiana języka**: Personalizacja interfejsu użytkownika  
- **Walidacja**: Sprawdzanie poprawności wprowadzonych danych
- **Auto-save**: Prawdopodobnie automatyczne zapisywanie zmian

## Uprawnienia
- Dostęp dla wszystkich zalogowanych użytkowników
- Każdy może edytować swoje dane osobowe
- Email może być chroniony przed edycją

## Dane dynamiczne
- Wszystkie pola ładowane z profilu użytkownika
- Lista języków z konfiguracji systemu
- Zmiany wpływają tylko na konto danego użytkownika

## Powiązania
- Powrót do [[main-settings|głównych ustawień]]
- Język wpływa na interfejs całej aplikacji
- Dane firmowe mogą być używane w [[../studies|badaniach]]
- Email używany do [[users|zarządzania użytkownikami]]