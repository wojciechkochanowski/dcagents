# Recruitment Study - Schedules Tab

## Lokalizacja w kodzie
- **UI components**:
  - `SchedulesTab` - główny komponent zakładki
  - `AppointmentSchedule` - harmonogram wizyt
  - `BookedVisitsList` - lista zarezerwowanych wizyt

## Dostęp
- Z [[recruitment-study-details|szczegółów recruitment study]] → zakładka "Schedules"

## Struktura zakładki

### Pod-zakładki
- **Appointment schedule** (aktywna domyślnie) - harmonogram wizyt
- **Booked visits list** - lista zarezerwowanych wizyt

### Appointment schedule (pod-zakładka)
**Stan pusty:**
- **Ikona kalendarza**: Duża ikona z datą "31"
- **Komunikat**: "You have no schedules yet"
- **Instrukcja**: "You can create first appointment schedule here"
- **Przycisk akcji**: "Create new schedule" (niebieski)

**Stan z danymi:**
- Kalendarz z harmonogramem wizyt
- Lista dostępnych terminów
- Opcje zarządzania harmonogramem

### Booked visits list (pod-zakładka)
**Funkcjonalności:**
- Lista zarezerwowanych wizyt uczestników
- Szczegóły każdej wizyty (data, czas, uczestnik)
- Status wizyt (zaplanowana, odbyta, anulowana)
- Opcje edycji i anulowania wizyt

## Stan dynamiczny
- Pod-zakładka "Appointment schedule" może być pusta lub zawierać harmonogramy
- "Booked visits list" wyświetla rzeczywiste rezerwacje wizyt
- Przycisk "Create new schedule" dostępny gdy brak harmonogramów

## Funkcjonalności
- **Tworzenie harmonogramów**: Modal lub strona tworzenia nowego harmonogramu
- **Zarządzanie rezerwacjami**: Możliwość modyfikacji zarezerwowanych wizyt
- **Integracja z kalendarzem**: Synchronizacja z głównym kalendarzem aplikacji

## Powiązania
- Powrót do [[recruitment-study-details|głównej strony study]]
- Połączenie z [[calendar|głównym kalendarzem]] aplikacji
- Przejście do innych zakładek tego samego study