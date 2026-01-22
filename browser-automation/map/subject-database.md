# Subject Database - Baza badanych

## Lokalizacja w kodzie
- **Page component**: Strona Subject Database w `frontend/apps/datacapt/src/pages/subject-database/index.tsx` (routing)
- **UI components**:
  - `SubjectRepository` w `frontend/apps/datacapt/src/components/SubjectRepository/SubjectRepository.tsx`
  - `SubjectRepositoryDashboard` w `frontend/apps/datacapt/src/components/SubjectRepository/SubjectRepositoryDashboard/SubjectRepositoryDashboard.tsx`
  - `SubjectRepositoryStats` w `frontend/apps/datacapt/src/components/SubjectRepository/SubjectRepositoryDashboard/SubjectRepositoryStats/SubjectRepositoryStats.tsx`
  - `SubjectRepositoryOptions` w `frontend/apps/datacapt/src/components/SubjectRepository/SubjectRepositoryDashboard/SubjectRepositoryOptions/SubjectRepositoryOptions.tsx`
  - `AddSubjectModal`, `ImportModal`, `ExportModal` w katalogu SubjectRepositoryDashboard
  - CSS klasy: `subject-repository-dashboard`, `subject-repository-stats`, `subject-repository-options`

## Dostęp
- Z [[main-menu|głównego menu]] → szósta opcja (ikona użytkownika)

## Struktura strony

### Nagłówek
- **Tytuł**: "Subject database"

### Przyciski akcji (prawy górny róg)
- **Settings** (ikona ustawień, niebieski przycisk)
- **Add subject** (ikona plus, niebieski przycisk)

### Statystyki badanych
**Total subjects**: Dynamiczna liczba wyświetlanych badanych

Kafelki statusów z kolorowym kodowaniem:
- **Active**: Liczba aktywnych (procent z całości) - zielony
- **Inactive**: Liczba nieaktywnych (procent z całości) - czerwony  
- **Pending**: Liczba oczekujących (procent z całości) - żółty
- **[Dodatkowy status]**: Liczba dla dodatkowych statusów - niebieski

Dodatkowa informacja: "+X in last 30 days" (przyrost w ostatnim miesiącu)

### Funkcje zarządzania
- **Search subject**: Pasek wyszukiwania
- **Import**: Przycisk importu danych
- **Active columns**: Konfiguracja widocznych kolumn
- **Add advanced filter**: Zaawansowane filtrowanie

### Panel "Add advanced filter"
**Dostępne filtry:**
- **Status**: Filtr według statusu badanego
- **Account status**: Filtr według statusu konta
- **Study**: Filtr według badania
- **Centers**: Filtr według centrum
- **Recruitment study**: Filtr według badania rekrutacyjnego
- **Search filters**: Pole wyszukiwania filtrów

### Strona Settings
**Sekcje konfiguracji:**
- **Form Builder**:
  - Database Form Builder: Tworzenie i zarządzanie formularzami
- **Public link & QR-Code**:
  - Public Registration: Link publiczny do rejestracji badanych

### Tabela badanych
Kolumny:
- **ID**: Identyfikator badanego
- **FULL NAME**: Pełne imię i nazwisko  
- **PHONE**: Numer telefonu
- **LAST**: Ostatnia aktywność

### Struktura danych w tabeli
Kolumny wyświetlają:
1. **ID**: Identyfikator badanego (format zależny od systemu)
2. **FULL NAME**: Imię i nazwisko lub email (w zależności od dostępności danych)
3. **PHONE**: Numer telefonu (jeśli podany)
4. **LAST**: Ostatnia aktywność

### Paginacja
- **Wyniki**: "X-Y of Z" (zakres z całkowitej liczby)
- **Strona**: Aktualna strona
- **Opcje**: Liczba rekordów na stronę (dropdown)

## Funkcjonalności
- Zarządzanie bazą uczestników badań
- Śledzenie statusów (aktywny/nieaktywny/oczekujący)
- Import masowy danych
- Zaawansowane wyszukiwanie i filtrowanie
- Konfiguracja wyświetlanych kolumn

## Dane dynamiczne  
- Lista badanych jest ładowana z backendu
- Liczba i dane badanych są zmienne
- Statusy są aktualizowane w czasie rzeczywistym

## Powiązania
- Powrót do [[main-menu|głównego menu]]
- Powiązane z [[studies|badaniami]] i [[recruitment-studies|rekrutacją]]
- Dane używane w [[payment-orders|płatnościach]]