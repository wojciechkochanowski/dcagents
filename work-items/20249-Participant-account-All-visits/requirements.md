# 20249: Participant account - All visits

## Task Description

Implementacja widoku "All visits" w koncie uczestnika badania (`/public/calendar`). Widok mobilny wyświetlający listę wizyt uczestnika z podziałem na nadchodzące i przeszłe.

## Acceptance Criteria

### AC1: Strona /public/calendar

- Nowa strona dostępna pod `/public/calendar`
- Wymaga autoryzacji jako Subject (AccountType.Subject)
- Używa Layout z SubjectDashboard (wspólna nawigacja)
- Tytuł strony "Visits"

### AC2: Taby Upcoming/Past

- Dwa taby: "Upcoming" i "Past"
- Każdy tab pokazuje liczbę wizyt (np. "Upcoming • 2")
- Domyślnie aktywny tab "Upcoming"
- Styl tabów: aktywny = filled blue pill, nieaktywny = outline

### AC3: Karta wizyty - Upcoming

- Header: Visit name • Study name (np. "Screening visit • Study A-123")
- Mapa Google Maps z pinezką lokalizacji (jeśli dostępne współrzędne)
- Data w formacie: dzień miesiąca (duży) + skrót miesiąca (np. "24 JUL")
- Dzień tygodnia + godziny (np. "Thursday, 11:00 - 12:00")
- Adres (np. "Pines Lake 123")
- Nazwa centrum (np. "Center Red")
- Strzałka (chevron) po prawej stronie
- Kliknięcie otwiera modal

### AC4: Karta wizyty - Past

- Bez mapy
- Header: Visit name • Study name
- Data + dzień tygodnia + godziny
- Adres
- Nazwa centrum
- Strzałka po prawej

### AC5: Karta wizyty - Cancelled

- Styl jak Past (bez mapy)
- Data/godzina przekreślona (line-through)
- Czerwony status "Cancelled" z czerwoną kropką
- Wizyta cancelled pojawia się w tabie Past

### AC6: Modal szczegółów wizyty (Upcoming)

- Header: Data (dzień + miesiąc) + godziny + dzień tygodnia
- Przycisk X do zamknięcia
- Mapa (jeśli dostępne współrzędne) lub brak mapy
- Ikona lokalizacji + Adres (truncated jeśli długi)
- Nazwa centrum pod adresem
- Przycisk "Open in Google Maps" (otwiera Google Maps z koordynatami)
- Sekcja studium: ikona + nazwa studium + visit name
- Przycisk "Go to the study" (placeholder - nawigacja TBD)

### AC7: Obsługa długich tekstów

- Visit name, study name, adres, nazwa centrum - truncation z "..."
- Max 1-2 linie tekstu

### AC8: Empty states

- "No upcoming visits" gdy brak wizyt upcoming
- "No past visits" gdy brak wizyt past

## Data Model (Mock)

```typescript
interface SubjectVisit {
  id: number;
  visitName: string;
  studyName: string;
  studyId: string;
  date: string; // ISO date
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  address: string | null;
  centerName: string;
  status: "upcoming" | "completed" | "cancelled";
  latitude: number | null;
  longitude: number | null;
}
```

## API Endpoints (do zamockowania)

```
GET /subject_accounts/visits/
  - Response: { results: SubjectVisit[], count: number }
  - Filters: status=upcoming|past
```

## Figma Links

- Upcoming visits: https://www.figma.com/design/rsxuu4TaSxAvjxdf924kSy/CTMS?node-id=22609-66136
- Past visits: https://www.figma.com/design/rsxuu4TaSxAvjxdf924kSy/CTMS?node-id=22609-66436
- Modal z mapą: https://www.figma.com/design/rsxuu4TaSxAvjxdf924kSy/CTMS?node-id=22609-66218
- Modal bez mapy: https://www.figma.com/design/rsxuu4TaSxAvjxdf924kSy/CTMS?node-id=22609-66330
- UI Guide karty: https://www.figma.com/design/rsxuu4TaSxAvjxdf924kSy/CTMS?node-id=22609-66506
- UI Guide długie teksty: https://www.figma.com/design/rsxuu4TaSxAvjxdf924kSy/CTMS?node-id=22609-66568

## Technical Notes

- Reuse Layout component from SubjectDashboard
- Google Maps Static API for map images (or embed)
- Mobile-first design (participant account is mobile app)
- Backend nie istnieje - mockować dane w funkcji fetch
