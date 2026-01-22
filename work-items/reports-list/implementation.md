# Implementation Plan - Reports List

## Przegląd

Implementacja podzielona na 5 faz wykonywanych sekwencyjnie (z możliwością zrównoleglenia Fazy 4).

## Faza 1: API Mock i interfejsy TypeScript

**Agent:** Main agent (manual implementation)
**Priorytet:** KRYTYCZNY - musi być wykonane jako pierwsze
**Dependency:** Brak - faza początkowa

### Zadania

#### 1.1 Utworzenie pliku requests

**Lokalizacja:** `/Users/bartek/work/datacapt/frontend-feature/common/requests/reports.ts`

**Zawartość:**

```typescript
// Report interface
export interface Report {
  id: string;
  title: string;
  createdAt: string;
  reportNumber: string;
  createdBy: {
    initials: string;
    name: string;
  };
}

// Mock data - 10-15 raportów
const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    title: "Patient Demographics Report - Q4 2024",
    createdAt: "2024-07-20",
    reportNumber: "45ML137",
    createdBy: {
      initials: "AS",
      name: "Anna Smith",
    },
  },
  {
    id: "2",
    title: "Adverse Events Summary",
    createdAt: "2024-07-18",
    reportNumber: "45ML138",
    createdBy: {
      initials: "JD",
      name: "John Doe",
    },
  },
  // ... więcej mock danych (10-15 total)
];

// Mock fetch function with delay
export const fetchReports = async (): Promise<Report[]> => {
  // Simulate network delay for loading state demonstration
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return MOCK_REPORTS;
};
```

#### 1.2 Export w index.ts

**Lokalizacja:** `/Users/bartek/work/datacapt/frontend-feature/common/requests/index.ts`

**Dodać:**

```typescript
export * from "./reports";
export type { Report } from "./reports";
```

**Weryfikacja:**

- [ ] TypeScript kompiluje bez błędów
- [ ] Export dostępny w innych plikach
- [ ] Mock funkcja zwraca dane po delay

---

## Faza 2: Komponenty listy raportów

**Agent:** react-component-creator (delegacja)
**Priorytet:** WYSOKI
**Dependency:** Wymaga Fazy 1 (interfejs Report)

### 2.1 ReportListItem Component

**Zadanie dla agenta:**

```
Create ReportListItem component in apps/datacapt/src/components/reports/ReportListItem/

Component structure:
- Single report row, 68px height
- Layout: [Checkbox] [Icon] [Title + Metadata] [Report Number] [Avatar] [Menu]
- Follow Figma design: https://www.figma.com/design/jmK0yjytpvkZ7pJoBqep4H/GLOBAL-functions--reports--settings-?node-id=549-10079

Technical requirements:
- Use Report interface from common/requests
- Use DatacIcon for monitor-01 icon
- Use existing UI components where possible
- BEM LESS structure
- Proper spacing with design tokens
```

**Pliki do stworzenia:**

- `ReportListItem/ReportListItem.tsx`
- `ReportListItem/ReportListItem.less`
- `ReportListItem/index.ts`

**Props interface:**

```typescript
interface ReportListItemProps {
  report: Report;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}
```

**LESS requirements:**

- Block: `.report-list-item`
- Height: 68px
- Display: flex/grid dla layoutu
- Hover state: background `@bg-secondary`
- Border: `1px solid @border-secondary`
- Typography: `.body-md()` dla tytułu, `.body-sm()` dla metadata

**Weryfikacja:**

- [ ] Komponent renderuje się poprawnie
- [ ] Layout zgodny z Figma (68px height)
- [ ] Wszystkie elementy widoczne
- [ ] Hover state działa
- [ ] TypeScript bez błędów

### 2.2 ReportListSkeleton Component

**Zadanie dla agenta:**

```
Create ReportListSkeleton component in apps/datacapt/src/components/reports/ReportListSkeleton/

Reference implementation: apps/datacapt/src/components/shared/StudyList/StudyListCardView/StudyListCardSkeleton.tsx

Component structure:
- Renders 10 skeleton rows (configurable via count prop)
- Uses Ant Design Skeleton components
- Matches ReportListItem layout exactly
- Active animation

Technical requirements:
- Skeleton.Input for text fields
- Skeleton.Avatar for icons and avatars
- Same 68px height as ReportListItem
- BEM LESS structure
```

**Pliki do stworzenia:**

- `ReportListSkeleton/ReportListSkeleton.tsx`
- `ReportListSkeleton/ReportListSkeleton.less`
- `ReportListSkeleton/index.ts`

**Props interface:**

```typescript
interface ReportListSkeletonProps {
  count?: number; // default: 10
}
```

**Skeleton structure (pojedynczy wiersz):**

```typescript
<div className="report-list-skeleton__item">
  <Skeleton.Avatar size="small" shape="square" /> {/* checkbox */}
  <Skeleton.Avatar size={32} shape="square" /> {/* icon */}
  <div className="report-list-skeleton__content">
    <Skeleton.Input active style={{ width: '60%' }} /> {/* title */}
    <Skeleton.Input active style={{ width: '40%' }} /> {/* metadata */}
  </div>
  <Skeleton.Input active style={{ width: '80px' }} /> {/* report number */}
  <Skeleton.Avatar size={32} /> {/* user avatar */}
  <Skeleton.Avatar size="small" shape="square" /> {/* menu button */}
</div>
```

**LESS requirements:**

- Block: `.report-list-skeleton`
- Element: `.report-list-skeleton__item`
- Height: 68px per item
- Skeleton input height: 14px
- Border radius: `@border-radius-2xs`
- Disabled colors: `@fg-disabled`

**Weryfikacja:**

- [ ] Renderuje 10 wierszy domyślnie
- [ ] Animacja smooth (active prop)
- [ ] Layout identyczny jak ReportListItem
- [ ] Custom count prop działa

---

## Faza 3: Integracja z ReportsDashboard

**Agent:** Main agent
**Priorytet:** WYSOKI
**Dependency:** Wymaga Fazy 2 (komponenty) i Fazy 1 (fetch function)

### 3.1 Aktualizacja ReportsDashboard.tsx

**Lokalizacja:** `/Users/bartek/work/datacapt/frontend-feature/apps/datacapt/src/components/reports/ReportsDashboard/ReportsDashboard.tsx`

**Zmiany:**

1. **Imports:**

```typescript
import { useState, useEffect } from "react";
import { fetchReports, Report } from "common/requests";
import { ReportListItem } from "../ReportListItem";
import { ReportListSkeleton } from "../ReportListSkeleton";
```

2. **State:**

```typescript
const [reports, setReports] = useState<Report[]>([]);
const [isLoading, setIsLoading] = useState(true);
```

3. **Effect:**

```typescript
useEffect(() => {
  setIsLoading(true);
  fetchReports()
    .then((data) => {
      setReports(data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Failed to fetch reports:", error);
      setIsLoading(false);
    });
}, []);
```

4. **Conditional rendering:**

```typescript
// Replace current empty state section with:
{isLoading ? (
  <ReportListSkeleton count={10} />
) : reports.length === 0 ? (
  <div className="reports-dashboard__empty-state">
    {/* existing empty state code */}
  </div>
) : (
  <div className="reports-dashboard__list">
    {reports.map(report => (
      <ReportListItem key={report.id} report={report} />
    ))}
  </div>
)}
```

**Weryfikacja:**

- [ ] Loading state wyświetla skeleton przez ~1.5s
- [ ] Po załadowaniu pokazuje listę raportów
- [ ] Empty state działa gdy brak raportów (zmienić mock na [])
- [ ] Brak błędów w konsoli

### 3.2 Aktualizacja ReportsDashboard.less

**Lokalizacja:** `/Users/bartek/work/datacapt/frontend-feature/apps/datacapt/src/components/reports/ReportsDashboard/ReportsDashboard.less`

**Dodać:**

```less
&__list {
  display: flex;
  flex-direction: column;
  gap: 0; // no gap, borders handle spacing

  .report-list-item {
    &:not(:last-child) {
      border-bottom: 0; // merge borders
    }
  }
}
```

**Weryfikacja:**

- [ ] Lista wyrównana poprawnie
- [ ] Brak podwójnych borderów między wierszami
- [ ] Spacing zgodny z designem

---

## Faza 4: Tłumaczenia (opcjonalne rozszerzenie)

**Agent:** translation-manager (jeśli potrzebne nowe klucze)
**Priorytet:** NISKI
**Dependency:** Może być równolegle z Fazą 2-3

### Zadania

**Sprawdzić czy potrzebne dodatkowe klucze:**

- Menu actions (View, Edit, etc.)
- Tooltips
- Aria labels

**Jeśli TAK:**
Dodać do `common/intl/en.json`:

```json
"reports.menu.view": "View",
"reports.menu.edit": "Edit",
"reports.menu.add_to_favorites": "Add to favorites",
"reports.menu.duplicate": "Duplicate",
"reports.menu.delete": "Delete"
```

**Jeśli NIE:**
Pominąć tę fazę - istniejące tłumaczenia wystarczają.

**Weryfikacja:**

- [ ] Wszystkie wyświetlane teksty mają tłumaczenia
- [ ] Brak hardcoded stringów w komponentach

---

## Faza 5: Design Fidelity i Code Review

**Agent:** less-style-reviewer (automatycznie po zapisie LESS)
**Priorytet:** WYSOKI
**Dependency:** Wymaga wszystkich poprzednich faz

### Checklist Design Fidelity

**Layout:**

- [ ] Wysokość wiersza dokładnie 68px
- [ ] Icon 32x32px w ramce 32x32px
- [ ] Avatar 32x32px
- [ ] Gap między elementami zgodny z design tokens
- [ ] Alignment wszystkich elementów poprawny

**Typography:**

- [ ] Tytuł używa `.body-md()`
- [ ] Metadata używa `.body-sm()`
- [ ] Kolory: `@fg-primary` dla tytułu, `@fg-secondary` dla metadata
- [ ] Line height zgodny z mixins

**Colors:**

- [ ] Background: `@bg-primary`
- [ ] Borders: `@border-secondary`
- [ ] Hover: `@bg-secondary`
- [ ] Icon background: `@bg-secondary`
- [ ] Wszystkie kolory z design system (nie hardcoded hex)

**Spacing:**

- [ ] Wszystkie spacingi używają tokenów (@xs, @sm, @md, @xl)
- [ ] Border radius używa `@border-radius-*`
- [ ] Shadows (jeśli są) używają `@shadow-*`

**Skeleton:**

- [ ] Animacja smooth (active prop)
- [ ] Skeleton dopasowany 1:1 do ReportListItem
- [ ] Border radius `@border-radius-2xs`
- [ ] Wysokość 14px dla tekstów

**Accessibility:**

- [ ] Checkbox ma aria-label
- [ ] Menu button ma aria-label
- [ ] Report row ma proper role (jeśli potrzebne)

### Manual Testing Checklist

**Funkcjonalność:**

- [ ] Strona ładuje się bez błędów
- [ ] Skeleton pokazuje się przez ~1.5s
- [ ] Lista raportów pojawia się po skeleleton
- [ ] Empty state działa (gdy brak raportów)
- [ ] Hover effect na wierszach
- [ ] Responsywność (jeśli w scope)

**Performance:**

- [ ] Brak console errors
- [ ] Brak console warnings
- [ ] TypeScript kompiluje clean
- [ ] ESLint passes
- [ ] Prettier formatted

---

## Kolejność wykonania

### Sekwencyjna (obowiązkowa):

1. **Faza 1** → Interfejsy i mock (musi być pierwsza)
2. **Faza 2** → Komponenty (wymaga Fazy 1)
3. **Faza 3** → Integracja (wymaga Fazy 2)
4. **Faza 5** → Review (wymaga wszystkich)

### Równoległa (opcjonalna):

- **Faza 4** może być wykonana równolegle z Fazą 2-3 (jeśli potrzebna)

---

## Rollback Plan

Jeśli coś pójdzie nie tak:

1. **Faza 1 fails:** Sprawdzić czy plik się stworzył, czy export działa
2. **Faza 2 fails:** Wrócić do pustego stanu, sprawdzić design system imports
3. **Faza 3 fails:** Wycofać zmiany w ReportsDashboard, debugować fetch
4. **Faza 5 fails:** Poprawić LESS według wskazówek reviewera

---

## Post-Implementation

### Kolejne kroki (poza scope tego planu):

1. Implementacja search functionality
2. Implementacja sort functionality
3. Pagination / infinite scroll
4. Menu actions (View, Edit, Delete, etc.)
5. Checkbox selection logic
6. Integracja z prawdziwym backendem
7. Error handling
8. Loading states dla akcji
