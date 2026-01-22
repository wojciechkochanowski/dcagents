# Settings - Templates - Szablony dokumentów

## Dostęp
- Z [[main-settings|głównych ustawień]] → Templates
- URL: `/en/settings/templates`

## Lokalizacja w kodzie
- **Page component**: Routing przez `SettingsLayout`
- **UI components**:
  - `SettingsTemplatesContent` w `frontend/apps/datacapt/src/components/settings/SettingsTemplatesContent/`
  - `SettingsTemplatesTable` - tabela z listą szablonów
  - `SettingsTemplatesImportModal` - modal importu szablonów
  - `TemplateTags` - komponent filtrowania tagów
  - CSS klasy: `.settings-templates-content`, `.settings-templates-content__header`, `.settings-templates-content__tabs`

## Struktura strony

### Nagłówek
- **Tytuł**: "Templates"
- **Przycisk**: "Import" (niebieski, prawy górny róg)

### Zakładki kategorii
**5 typów szablonów:**
- **eCRF**: Szablony formularzy badawczych
- **ePRO**: Szablony dla pacjentów
- **eConsent**: Szablony zgód
- **Recruitment**: Szablony rekrutacji
- **Project Database**: Szablony projektów

### Funkcje zarządzania
- **+ filter by tags**: Filtrowanie według tagów
- **Search**: Wyszukiwanie szablonów (prawdopodobnie)

### Tabela szablonów
**Kolumny:**
- **TITLE**: Tytuł szablonu
- **DESCRIPTION**: Opis przeznaczenia
- **TAGS**: Tagi do kategoryzacji

### Stan danych
- **Komunikat**: "No data" (brak szablonów)
- **Paginacja**: "0-0 of 0"
- **Opcje**: "25 / page" dropdown

## Funkcjonalności
- **Import szablonów**: Wczytywanie z plików
- **Tworzenie szablonów**: Nowe szablony dla różnych celów
- **Kategoryzacja**: Podział według typu (eCRF/ePRO/etc.)
- **System tagów**: Organizacja i wyszukiwanie
- **Export szablonów**: Udostępnianie między organizacjami

## Modal "Import"
**Prawdopodobna struktura:**
- **File upload**: Przesyłanie pliku szablonu
- **Template type**: Wybór kategorii (eCRF/ePRO/etc.)
- **Tags**: Dodanie tagów
- **Description**: Opis szablonu
- **Przyciski**: Cancel | Import

## Typy szablonów
- **eCRF**: Formularze do zbierania danych badawczych
- **ePRO**: Kwestionariusze dla pacjentów
- **eConsent**: Formularze zgód na leczenie
- **Recruitment**: Materiały rekrutacyjne
- **Project Database**: Struktury projektów

## Uprawnienia
- Dostęp prawdopodobnie dla administratorów i data managerów
- Import/export może wymagać specjalnych uprawnień
- Szablony mogą być współdzielone w organizacji

## Powiązania
- Powrót do [[main-settings|głównych ustawień]]
- Szablony eCRF używane w [[../study/ecrf-builder|eCRF Builder]]
- Szablony rekrutacji w [[../recruitment-studies|rekrutacji]]
- Szablony eConsent w badaniach
- Szablony projektów w [[../project-database|bazie projektów]]