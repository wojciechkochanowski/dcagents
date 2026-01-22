# Subject eCRF View - Widok eCRF uczestnika badania

## Dostęp
- Z [[subjects|listy uczestników badania]] → kliknięcie w ID uczestnika
- URL: `/en/studies/{studyId}/subjects#ID-{subjectNumber}`

## Lokalizacja w kodzie  
- **Page component**: Routing przez `StudyDetailsLayout` → `StudySubjectsContent`
- **UI components**:
  - `StudySubjectsContent` w `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudySubjectsContent/StudySubjectsContent.tsx`
  - `StudySubjectDetails` - panel główny badanego z informacjami
  - `StudySubjectEcrfTab` - zawartość zakładki eCRF
  - CSS klasy: `study-subjects-content`, `study-subjects-content__details`

## Struktura strony

### Nagłówek uczestnika
- **ID uczestnika**: Wyświetlany w ciemnofioletowym nagłówku (np. "ID-1")
- **Add status**: Dropdown do zarządzania statusem uczestnika
- **Create account**: Przycisk do tworzenia konta dla uczestnika
- **Live Video**: Niebieski przycisk do sesji wideo z uczestnikiem

### Panel informacji uczestnika
**Sekcja "Subject information":**
- **First name**: Imię uczestnika lub "-" jeśli brak
- **Last name**: Nazwisko uczestnika lub "-" jeśli brak  
- **Email**: Zamaskowany adres email (gwiazdki ze względów bezpieczeństwa)
- **Phone**: Numer telefonu lub "-"
- **Account status**: Status konta ("No account" + link "Create")
- **Center**: Nazwa centrum badawczego (np. "CYPRESS")
- **Creation date**: Data dodania do badania
- **Subject ID**: Unikalny identyfikator (format: [PREFIX]-[NUMBER])
- **Randomization ID**: ID randomizacji (liczba) - KLUCZOWY ELEMENT

### Zakładki danych
- **eCRF** (aktywna - niebieska)
- **ePRO** 
- **eConsent**
- **Documents** (z ikoną chmury + "Upload documents")

### Sekcja eCRF
**Widok formularzy:**
- **Nazwa badania**: Tytuł z procentem ukończenia (np. "cypress test study 0%")
- **Status**: "In progress" z niebieskim przyciskiem ze strzałką
- **Sekcje formularzy**: Lista sekcji eCRF z:
  - Nazwą sekcji (np. "Cypress section 1", "Cypress section 2")
  - Procentem ukończenia (np. "0%")  
  - Statusem ("Not started", "In progress", "Completed")
- **Informacje o ostatniej modyfikacji**:
  - "Last changed": Data i godzina
  - "Updated by": Imię i nazwisko administratora

## Randomization Widget/Elements

### Obecne elementy randomization:
1. **Randomization ID w informacjach uczestnika**: 
   - Lokalizacja: Panel "Subject information"
   - Format: Etykieta "Randomization ID" + wartość liczbowa
   - Klikalność: NIE - wartość nie jest klikalną
   - Brak dodatkowych detali lub modala

### Brak obecnych elementów:
- **Brak randomization details modal** - kliknięcie w Randomization ID nie otwiera szczegółów
- **Brak allocation widget** - nie ma osobnego widgetu pokazującego alokację
- **Brak przycisków randomization** - nie ma przycisków do zarządzania randomizacją
- **Brak historii randomization** - nie ma widocznej historii zmian

## Potencjalne miejsca dla funkcjonalności Emergency Unblinding

### 1. Panel Subject Information (GŁÓWNE MIEJSCE)
**Lokalizacja**: Obok "Randomization ID: 2"
**Propozycja**: Przycisk "Emergency Unblind" lub ikona z tooltipem
**Uzasadnienie**: 
- Logicznie połączone z randomization
- Widoczne dla administratorów
- Naturalne miejsce dla emergency actions

### 2. Nagłówek uczestnika  
**Lokalizacja**: Obok przycisku "Add status" 
**Propozycja**: Dropdown menu z opcją "Emergency Unblind"
**Uzasadnienie**: 
- Część obszaru zarządzania statusem uczestnika
- Dostępne dla uprawnień administratora

### 3. Sekcja eCRF
**Lokalizacja**: W nagłówku sekcji eCRF obok "In progress"
**Propozycja**: Przycisk emergency action
**Uzasadnienie**: 
- Kontekst wypełniania formularzy
- Może być potrzebne podczas wprowadzania danych

### 4. Modal Details (DO IMPLEMENTACJI)
**Propozycja**: Stworzenie nowego modala "Randomization Details"
- Trigger: Kliknięcie na "Randomization ID: 2" 
- Zawartość: Szczegóły randomizacji + przycisk Emergency Unblind
- Uzasadnienie: Dedykowane miejsce dla wszystkich funkcji randomization

## Dane dynamiczne
- **Subject ID**: Generowany automatycznie (format: [STUDY_PREFIX]-[NUMBER])
- **Randomization ID**: Przypisywany podczas randomizacji
- **Informacje osobowe**: Mogą być puste lub wypełnione
- **Status konta**: Zależny od tego czy uczestnik ma utworzone konto
- **Sekcje eCRF**: Dynamiczne na podstawie konfiguracji badania

## Powiązania
- Powrót do [[subjects|listy uczestników]]
- Dane pochodzą z [[ecrf-builder|konfiguratora eCRF]]
- Związek z [[main-structure|strukturą badania]]
- Panel [[randomization|Randomization]] (do stworzenia)