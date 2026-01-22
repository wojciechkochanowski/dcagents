# Settings - Translations - Tłumaczenia globalne

## Dostęp
- Z [[main-settings|głównych ustawień]] → Translations
- URL: `/en/settings/translations`

## Lokalizacja w kodzie
- **Page component**: Routing przez `SettingsLayout`
- **UI components**:
  - `SettingsTranslationsContent` w `frontend/apps/datacapt/src/components/settings/SettingsTranslationsContent/`
  - `TranslationsLists` - listy tłumaczeń (z folderu shared)
  - `TranslationsLanguageSelect` - modal wyboru języka
  - `TranslationsNoResults` - widok gdy brak domyślnego języka
  - CSS klasy: `.settings-translations-content`, `.settings-translations-content__header`, `.settings-translations-content__filters`

## Struktura strony

### Nagłówek
- **Tytuł**: "Global translations"
- **Opis**: "With our easy-to-use translation tool, you can translate your database questions and Privacy opt-ins into more than 85 different languages."

### Grafika ilustracyjna
- **Ikona email**: Wizualizacja tłumaczeń
- **Styl**: Minimalistyczna ilustracja z kopertami i plusem
- **Kolor**: Żółty akcent na tle neutralnym

### Przycisk główny
- **"Choose default language"**: Biały przycisk na dole strony
- **Funkcja**: Wybór języka domyślnego dla systemu

### Przycisk dodawania
- **Żółty przycisk "+"**: Prawdopodobnie dodanie nowego tłumaczenia
- **Pozycja**: Prawy górny róg obszaru roboczego

## Funkcjonalności
- **85+ języków**: Obsługa wielu języków międzynarodowych
- **Database questions**: Tłumaczenie pytań w formularzach
- **Privacy opt-ins**: Tłumaczenie zgód na prywatność
- **Default language**: Ustawienie języka podstawowego
- **Bulk translation**: Masowe tłumaczenie treści

## Modal "Choose default language"
**Prawdopodobna struktura:**
- **Language dropdown**: Lista dostępnych języków
- **Country flags**: Wizualne oznaczenia krajów
- **Preview**: Podgląd jak będzie wyglądać w wybranym języku
- **Przyciski**: Cancel | Set as default

## Modal dodawania tłumaczenia
**Prawdopodobne opcje:**
- **Source language**: Język źródłowy
- **Target language**: Język docelowy
- **Content type**: Database questions / Privacy opt-ins
- **Translation method**: Manual / AI-assisted
- **Bulk import**: Upload pliku z tłumaczeniami

## Obsługiwane treści
- **eCRF questions**: Pytania w formularzach badawczych
- **ePRO questionnaires**: Kwestionariusze dla pacjentów
- **eConsent forms**: Formularze zgód
- **Privacy policies**: Polityki prywatności
- **UI elements**: Elementy interfejsu użytkownika

## Uprawnienia
- Dostęp prawdopodobnie dla administratorów i content managerów
- Tłumaczenia wpływają na wszystkich użytkowników
- Może wymagać weryfikacji przez native speakerów

## Workflow tłumaczeń
1. **Wybór języka domyślnego**: Bazowy język systemu
2. **Identyfikacja treści**: Które elementy tłumaczyć
3. **Proces tłumaczenia**: Manual lub automatyczny
4. **Weryfikacja**: Sprawdzenie poprawności
5. **Publikacja**: Aktywacja dla użytkowników

## Integracja z AI
- **Automatyczne tłumaczenia**: AI-powered translations
- **85+ języków**: Obsługa przez API tłumaczeniowe
- **Context awareness**: Świadomość kontekstu medycznego
- **Quality assurance**: Kontrola jakości tłumaczeń

## Powiązania
- Powrót do [[main-settings|głównych ustawień]]
- Tłumaczenia używane w [[../study/ecrf-builder|eCRF Builder]]
- Formularze zgód w [[../study/econsent-forms|eConsent]]
- Polityki prywatności w [[compliance|compliance]]
- Interface [[customization|dostosowania]]