# Inclusions List - Lista uczestników badania

## Dostęp
- Z [[main-structure|struktury badania]] → eCRF → Inclusions list
- URL: `/en/studies/{studyId}/inclusions`

## Lokalizacja w kodzie
- **Page component**: Routing przez `StudyDetailsLayout`
- **UI components**:
  - `Inclusions` w `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyInclusionsContent/Inclusions/Inclusions.tsx`
  - `InclusionsTable` - główna tabela z listą uczestników 
  - `InclusionsTableConfig` - konfiguracja kolumn tabeli
  - `NewInclusionModal` - modal dodawania nowego uczestnika
  - `ExportInclusionsModal` - modal eksportu danych uczestników
  - CSS klasy: `inclusions`, `inclusions__header`, `inclusions__table`

## Struktura strony

### Nagłówek
- **Tytuł**: "Inclusions list"
- **Przyciski akcji**:
  - **"Export"** (przycisk z ikoną pobierania)
  - **"New Participant"** (niebieski przycisk z plusem)

### Zakładki nawigacji
- **"List"** (aktywna - niebieska)
- **"Visit (Event)"** (nieaktywna)

### Funkcje wyszukiwania i filtrowania
- **Search subject**: Pasek wyszukiwania z ikoną lupy
- **"Filters"** (niebieski przycisk z ikoną filtra)

### Tabela uczestników
**Kolumny:**
- **Checkbox**: Zaznaczanie uczestników
- **ID**: Identyfikator uczestnika
- **START DATE**: Data rozpoczęcia
- **Akcje**: Menu kropek (więcej opcji)

### Struktura rekordów
- **ID**: Dynamiczny identyfikator uczestnika (format zależny od badania)
- **START DATE**: Data rozpoczęcia udziału w badaniu
- **Informacje**: Dane osobowe uczestnika (imię, nazwisko)

### Paginacja
- **Wyniki**: "X-Y of Z" (zakres z całkowitej liczby uczestników)
- **Nawigacja**: Strzałki poprzednia/następna
- **Strona**: Aktualna strona (dynamiczna)
- **Opcje**: Liczba rekordów na stronę (dropdown: 25/50/100)

## Funkcjonalności
- **Dodawanie uczestników**: Przycisk "New Participant"
- **Export danych**: Eksport listy uczestników
- **Wyszukiwanie**: Filtrowanie po różnych kryteriach
- **Masowe operacje**: Zaznaczanie wielu uczestników
- **Szczegóły uczestnika**: Kliknięcie prowadzi do [[subjects|szczegółów]]

## Dane dynamiczne
- Lista uczestników ładowana z backendu dla danego badania
- Liczba uczestników jest zmienna
- Identyfikatory generowane według wzorca badania
- Daty i dane osobowe są rzeczywiste z systemu

## Powiązania  
- Powrót do [[dashboard|Dashboard]]
- Szczegóły uczestnika w [[subjects|sekcji Subjects]]
- Związek z [[ecrf-builder|strukturą formularzy]]
- Część [[main-structure|struktury badania]]