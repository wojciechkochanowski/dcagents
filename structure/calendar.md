# Moduł CALENDAR - System kalendarzowy

## Lokalizacja

`frontend/apps/datacapt/src/components/calendar/`

## Opis modułu

System kalendarzowy do zarządzania wizytami, harmonogramami i rezerwacjami w badaniach klinicznych. Obsługuje różne widoki czasowe i integruje się z systemem bookingów.

## Struktura komponentów (3 główne grupy + store)

### 📅 **CalendarContent** - Główny widok kalendarza

**Lokalizacja**: `CalendarContent/`

#### **Główny komponent**

- **CalendarContent.tsx/less** - Główny interfejs kalendarza
- **Funkcja**: Wyświetlanie wydarzeń w różnych widokach czasowych

#### **Widoki kalendarza**

##### **CalendarViewMonth/**

- **Funkcja**: Widok miesięczny
- **Zawiera**: Siatka dni, wydarzenia, nawigacja

##### **CalendarViewWeek/**

- **Funkcja**: Widok tygodniowy
- **Zawiera**: Osie czasowe, sloty godzinowe

##### **CalendarViewDay/**

- **Funkcja**: Widok dzienny
- **Zawiera**: Szczegółowy harmonogram dnia

##### **CalendarViewAgenda/**

- **Funkcja**: Widok listy wydarzeń
- **Zawiera**: Lista chronologiczna

#### **Komponenty wydarzeń**

##### **EventComponents/**

- **Funkcja**: Komponenty renderujące wydarzenia
- **Zawiera**: Różne typy wydarzeń (wizyta, test, spotkanie)

##### **CalendarEventEdit/**

- **Funkcja**: Edycja wydarzenia
- **Zawiera**: Formularz edycji, walidacja

##### **CalendarEventPopup/**

- **Funkcja**: Popup z szczegółami wydarzenia
- **Zawiera**: Quick view, akcje

##### **CalendarEventSearch/**

- **Funkcja**: Wyszukiwanie wydarzeń
- **Zawiera**: Filtry, wyszukiwarka

#### **Zarządzanie harmonogramem**

##### **CalendarReschedule/**

- **Funkcja**: Przełożenie wizyty/wydarzenia
- **Zawiera**: Wybór nowego terminu, powiadomienia

##### **CalendarDeleteSchedule/**

- **Funkcja**: Usuwanie z harmonogramu
- **Zawiera**: Potwierdzenie, obsługa zależności

#### **Ustawienia i narzędzia**

##### **CalendarSettingsPopup/**

- **Funkcja**: Ustawienia kalendarza
- **Zawiera**: Preferencje widoku, kolory, powiadomienia

##### **CalendarDayMore/**

- **Funkcja**: "Więcej wydarzeń" dla przepełnionych dni
- **Zawiera**: Lista dodatkowych wydarzeń

### 📋 **BookingsContent** - Zarządzanie rezerwacjami

**Lokalizacja**: `BookingsContent/`

#### **Główny komponent**

- **BookingsContent.tsx/less** - Lista i zarządzanie rezerwacjami
- **BookingRecord.tsx** - Pojedynczy rekord rezerwacji

#### **Akcje na rezerwacjach**

##### **BookingActions/**

- **Funkcja**: Akcje na rezerwacjach
- **Zawiera**: Potwierdzenie, anulowanie, przełożenie

##### **AddTestModal/**

- **Funkcja**: Dodawanie testów do wizyty
- **Zawiera**: Wybór testów, harmonogram

#### **Statusy i znaczniki**

##### **StatusBadge/**

- **Funkcja**: Znaczniki statusów rezerwacji
- **Zawiera**: Kolory, ikony, opisy statusów
- **Statusy**: Potwierdzona, Oczekująca, Anulowana, Zakończona

### 🏗️ **CalendarLayout** - Layout kalendarza

**Lokalizacja**: `CalendarLayout/`

#### **Główny layout**

- **CalendarLayout.tsx/less** - Główny layout strony kalendarza
- **Funkcja**: Struktura strony z sidebar i obszarem głównym

#### **Komponenty layoutu**

##### **CalendarLayoutHeader/**

- **Funkcja**: Nagłówek kalendarza
- **Zawiera**: Nawigacja czasowa, przełączniki widoków, akcje

##### **CalendarLayoutSidebar/**

- **Funkcja**: Sidebar kalendarza
- **Zawiera**: Mini kalendarz, filtry, legendy

### 📊 **CalendarStore** - Zarządzanie stanem

**Plik**: `CalendarStore.tsx`

#### **Zustand store**

- **Funkcja**: Centralny stan kalendarza
- **Zawiera**:
  - Aktualny widok i data
  - Lista wydarzeń
  - Filtry i ustawienia
  - Loading states
  - Error handling

#### **Actions**

- `setCurrentView()` - zmiana widoku
- `setCurrentDate()` - nawigacja czasowa
- `fetchEvents()` - pobieranie wydarzeń
- `createEvent()` - tworzenie wydarzenia
- `updateEvent()` - aktualizacja
- `deleteEvent()` - usuwanie

## Integracje zewnętrzne

### **Biblioteki kalendarza**

- **FullCalendar** lub **React Big Calendar** - główny engine
- **Date-fns** - operacje na datach
- **React DnD** - drag & drop wydarzeń

### **API integracje**

- `common/requests/calendar/` - API calls
- Synchronizacja z Google Calendar / Outlook
- Webhooks dla powiadomień

## Przepływy użytkowania

### **Przeglądanie kalendarza**

1. CalendarLayout → CalendarContent → wybór widoku
2. EventComponents → CalendarEventPopup → szczegóły

### **Tworzenie wizyty**

1. CalendarContent → new event → CalendarEventEdit
2. Wybór daty/czasu → BookingsContent → potwierdzenie

### **Zarządzanie rezerwacjami**

1. BookingsContent → BookingRecord → BookingActions
2. Zmiany statusu → aktualizacja CalendarStore

### **Przełożenie wizyty**

1. CalendarEventPopup → CalendarReschedule
2. Wybór nowego terminu → powiadomienia → aktualizacja

## Kluczowe funkcjonalności

- **Multi-view** - różne perspektywy czasowe
- **Drag & Drop** - przenoszenie wydarzeń
- **Bulk operations** - operacje masowe na rezerwacjach
- **Real-time sync** - synchronizacja w czasie rzeczywistym
- **Notifications** - powiadomienia o zmianach
- **Conflict detection** - wykrywanie konfliktów terminów
