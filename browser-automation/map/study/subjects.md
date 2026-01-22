# Subjects - Szczegółowy widok badanego

## Dostęp
- Z [[main-structure|struktury badania]] → Study → Subjects
- Z [[inclusions-list|listy uczestników]] → kliknięcie w rekord
- URL: `/en/studies/{studyId}/subjects`

## Lokalizacja w kodzie  
- **Page component**: Routing przez `StudyDetailsLayout`
- **UI components**:
  - `StudySubjectsContent` w `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudySubjectsContent/StudySubjectsContent.tsx`
  - `StudySubjectDetails` - panel główny badanego z informacjami
  - `StudySubjectStatus` - zarządzanie statusem badanego
  - `AddSubjectModal` - modal dodawania nowego badanego
  - `StudySubjectEcrfTab`, `StudySubjectEproTab`, `StudySubjectEconsentTab` - zakładki danych
  - CSS klasy: `study-subjects-content`, `study-subjects-content__list`, `study-subjects-content__details`

## Struktura strony

### Nawigacja
- **"Back"** (przycisk powrotu)
- **"Subjects"** (tytuł sekcji z ikoną plus)

### Lista badanych (lewa strona)
- **Search subject**: Pasek wyszukiwania
- **Grupowanie alfabetyczne**: Sekcje literowe (A, B, C, etc.)
- **Kafelki badanych**: Dynamiczna lista z ID badanych (aktywny = niebieski)

### Panel główny badanego
**Nagłówek profilu:**
- **Ikona użytkownika**: Avatar z inicjałami lub ID badanego
- **Statusy**: "Add status" (dropdown), "Create account" (jeśli brak konta)
- **"Live Video"** (niebieski przycisk z ikoną kamery)

### Informacje o badanym
**Karta "Subject information":**
- **First name**: Dynamiczne imię lub puste
- **Last name**: Dynamiczne nazwisko lub puste
- **Email**: Zamaskowany adres email (ze względów bezpieczeństwa)
- **Phone**: Numer telefonu lub puste
- **Account status**: Status konta (No account/Active) + link Create
- **Center**: Przypisane centrum badawcze
- **Creation date**: Data dodania do badania
- **Subject ID**: Unikalny identyfikator w systemie
- **Randomization ID**: ID randomizacji lub puste

### Zakładki danych
**Dostępne sekcje:**
- **eCRF** (aktywna - niebieska)
- **ePRO** 
- **eConsent**
- **Uploaded documents** (z ikoną chmury)

### Aktywność badanego
**Sekcja postępu:**
- **Procent postępu**: Dynamiczny procent ukończenia
- **Nazwa badania**: Tytuł badania z backendu
- **Status**: Aktualny status uczestnika (In progress/Completed/etc.)
- **Przycisk akcji**: Strzałka prowadząca do szczegółów

### Zakładka eCRF
**Widok szczegółowy**: Przejście do [[subject-ecrf-view|widoku eCRF uczestnika]]
- Formulary badania podzielone na sekcje
- Informacje o randomization (Randomization ID)
- Potencjalne miejsce dla emergency unblinding

## Funkcjonalności
- **Zarządzanie statusem**: Dodawanie statusów badanego
- **Tworzenie konta**: Link do utworzenia konta pacjenta
- **Live Video**: Sesje wideo z badanym
- **Przeglądanie danych**: Zakładki eCRF/ePRO/eConsent
- **Upload dokumentów**: Przesyłanie plików

## Dane dynamiczne
- **Subject ID**: Unikalny identyfikator generowany przez system
- **Centrum**: Przypisanie do centrum badawczego z konfiguracji
- **Dane osobowe**: Wypełniane przez administratora lub importowane
- **Email**: Zawsze zamaskowany ze względów bezpieczeństwa
- **Status konta**: Zależny od tego czy pacjent ma aktywne konto

## Powiązania
- Powrót do [[inclusions-list|listy uczestników]]
- Dane z [[ecrf-builder|formularzy eCRF]]
- Związek z [[main-structure|strukturą badania]]
- Dokumenty z sekcji [[documents|Documents]]