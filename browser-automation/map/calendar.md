# Calendar - Kalendarz i rezerwacje

## Lokalizacja w kodzie
- **Page component**: Routing przez `CalendarLayout` w `frontend/apps/datacapt/src/components/calendar/CalendarLayout/CalendarLayout.tsx`
- **UI components**:
  - `CalendarContent` w `frontend/apps/datacapt/src/components/calendar/CalendarContent/CalendarContent.tsx`
  - `BookingsContent` w `frontend/apps/datacapt/src/components/calendar/BookingsContent/BookingsContent.tsx`
  - `CalendarLayoutHeader` w `frontend/apps/datacapt/src/components/calendar/CalendarLayout/CalendarLayoutHeader/CalendarLayoutHeader.tsx`
  - `CalendarLayoutSidebar` w `frontend/apps/datacapt/src/components/calendar/CalendarLayout/CalendarLayoutSidebar/CalendarLayoutSidebar.tsx`
  - `CalendarViewWeek` w `frontend/apps/datacapt/src/components/calendar/CalendarContent/CalendarViewWeek/CalendarViewWeek.tsx`
  - `CalendarViewDay` w `frontend/apps/datacapt/src/components/calendar/CalendarContent/CalendarViewDay/CalendarViewDay.tsx`
  - `CalendarViewMonth` w `frontend/apps/datacapt/src/components/calendar/CalendarContent/CalendarViewMonth/CalendarViewMonth.tsx`
  - `CalendarViewAgenda` w `frontend/apps/datacapt/src/components/calendar/CalendarContent/CalendarViewAgenda/CalendarViewAgenda.tsx`
  - CSS klasy: `calendar-layout`, `calendar-content`, `calendar-content__body`, `calendar-content__toolbox`

## Dostęp
- Z [[main-menu|głównego menu]] → siódma opcja (ikona kalendarza)

## Struktura strony

### Nagłówek
- **Tytuł**: Ukryty w interfejsie (widoczny tylko w menu bocznym)
- **Zakładki**: Calendar | Bookings

### Nawigacja czasowa
- **Przycisk "Today"**: Szybki dostęp do bieżącej daty
- **Data range**: "14-20 Jul 2025" (przykład tygodniowego widoku)
- **Strzałki**: Nawigacja poprzedni/następny okres
- **Dropdown "Week"**: Prawdopodobnie inne widoki (dzień/tydzień/miesiąc)
- **Przycisk "New"**: Tworzenie nowych wydarzeń/rezerwacji

### Zakładka "Calendar"
**Widok kalendarza tygodniowego:**
- **Strefa czasowa**: GMT+2 (wyświetlana w lewym górnym rogu)
- **Dni tygodnia**: Monday-Friday (widok roboczy)
- **Godziny**: 7:00-12:00 (i dalej) w pionie
- **Siatka czasowa**: 30-minutowe interwały
- **Wydarzenia**: Puste (brak zaplanowanych wydarzeń)

### Zakładka "Bookings" 
**Lista rezerwacji:**
- **Status**: "0 bookings" (licznik w prawym górnym rogu)
- **Tabela**: Pusta lista rezerwacji
- **Paginacja**: "0-0 of 0" 
- **Opcje**: "50 / page" dropdown

### Panel dolny (wspólny)
**Floating action bar:**
- **Ikona wyszukiwania**: Wyszukiwanie w kalendarzu/rezerwacjach
- **Ikona ustawień**: Ustawienia kalendarza
- **Ikona sortowania**: Opcje sortowania/filtrowania
- **Przycisk plus**: Dodawanie nowych wydarzeń (niebieska ikona)

## Funkcjonalności
- **Zarządzanie kalendarzem**: Planowanie wydarzeń i wizyt
- **System rezerwacji**: Booking appointments dla badanych
- **Widoki czasowe**: Różne perspektywy czasowe (dzień/tydzień/miesiąc)
- **Tworzenie wydarzeń**: Dodawanie nowych terminów
- **Wyszukiwanie**: Filtrowanie wydarzeń i rezerwacji

## Stan dynamiczny
- Kalendarz może być pusty lub zawierać zaplanowane wydarzenia
- Liczba rezerwacji jest dynamiczna (aktualnie 0)
- Wydarzenia ładowane z backendu dla zalogowanego użytkownika
- Strefa czasowa prawdopodobnie konfigurowana per użytkownika

## Powiązania
- Powrót do [[main-menu|głównego menu]]
- Wydarzenia prawdopodobnie związane z [[studies|badaniami]]
- Rezerwacje mogą być połączone z [[subject-database|badanymi]]
- Możliwy związek z [[study/inclusions-list|wizytami uczestników]]