# Requirements - Reports List

## Opis zadania

Implementacja listy raportów z danymi zamokowanymi, skeleton loading state oraz obsługą trzech stanów wyświetlania.

## Figma

https://www.figma.com/design/jmK0yjytpvkZ7pJoBqep4H/GLOBAL-functions--reports--settings-?node-id=549-9820&m=dev

### Widoki w Figma:

- **Reports list | Empty** (549:9861) - Empty state (już zaimplementowany)
- **Reports list | Loading** (549:9890) - Skeleton loading state
- **Reports list | Partially full** (549:10079) - Lista z danymi
- **Reports list | Partially full** (549:10279) - Behavior after hover

## Funkcjonalność

### Trzy stany UI:

1. **Empty state** - gdy brak raportów (✓ już zaimplementowany w `ReportsDashboard.tsx`)
2. **Loading state** - skeleton podczas ładowania danych
3. **Lista z danymi** - wyświetlanie raportów w formie tabeli

### Struktura pojedynczego raportu

Każdy raport na liście zawiera:

- **Checkbox** - zaznaczenie raportu (lewo)
- **Icon** - ikona `monitor-01` w ramce
- **Tytuł** - nazwa raportu (główna linia, body-md)
- **Metadata** - "Created: [data]" (druga linia, body-sm, fg-secondary)
- **Numer** - identyfikator raportu (np. "45ML137", body-sm)
- **Avatar** - inicjały użytkownika tworzącego (np. "AS")
- **Menu button** - przycisk trzech kropek (prawo)

### Wzorzec do naśladowania

Skeleton loading wzorowany na:
`apps/datacapt/src/components/shared/StudyList/StudyListCardView/StudyListCardSkeleton.tsx`

## Interfejsy TypeScript

### Report Interface

```typescript
interface Report {
  id: string;
  title: string;
  createdAt: string;
  reportNumber: string;
  createdBy: {
    initials: string;
    name: string;
  };
}
```

### Komponenty Props

```typescript
// ReportListItem
interface ReportListItemProps {
  report: Report;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

// ReportListSkeleton
interface ReportListSkeletonProps {
  count?: number; // domyślnie 10
}
```

## Backend Endpoints

**Na razie mock** - funkcja `fetchReports()` w `common/requests/reports.ts` z zamokowanymi danymi.

W przyszłości (gdy backend będzie gotowy):

- `GET /api/reports` - pobranie listy raportów
- Parametry: search, sort, pagination

## Hierarchia komponentów

```
ReportsDashboard (istniejący)
├── Header (✓ już jest)
├── Filters (✓ już są - search i sort placeholder)
└── Content (warunkowe renderowanie):
    ├── ReportListSkeleton (loading: true)
    ├── Empty State (✓ już jest, loading: false, reports.length === 0)
    └── Report List (loading: false, reports.length > 0)
        └── ReportListItem (wielokrotnie)
```

## Design System

### Layout

- **Wysokość wiersza**: 68px (stała)
- **Padding wiersza**: vertical auto, horizontal zgodny z kontenerem
- **Gap między elementami**: zgodny z design tokens (@xs, @sm, @md)

### Typography

- **Tytuł raportu**: `.body-md()`, `@fg-primary`
- **Metadata**: `.body-sm()`, `@fg-secondary`
- **Numer raportu**: `.body-sm()`, `@fg-secondary`
- **Avatar**: `.body-md-emphasis()`, `@fg-primary`

### Colors

- **Background wiersza**: `@bg-primary`
- **Border**: `1px solid @border-secondary`
- **Hover background**: `@bg-secondary` (z czwartego screena Figma)
- **Icon background**: `@bg-secondary`, border `@border-secondary`
- **Avatar background**: `@bg-tertiary` lub color-coded

### Spacing

- Icon size: 32x32px w ramce 32x32px
- Avatar size: 32x32px
- Gap między icon a tekstem: `@md` (16px)
- Gap między kolumnami: zgodny z grid layout

### Skeleton

- Ant Design `Skeleton.Input` - dla tekstów
- Ant Design `Skeleton.Avatar` - dla ikon i avatarów
- `active` prop dla animacji
- Border radius: `@border-radius-2xs` (4px)
- Height: 14px dla tekstów

## Tłumaczenia

### Istniejące (✓ już dodane w `common/intl/en.json`):

```json
"reports.title": "Reports",
"reports.add_new": "Add new",
"reports.search_placeholder": "Search by report name",
"reports.sort_by_label": "Sort by: Recently modified",
"reports.empty_state.title": "No reports yet",
"reports.empty_state.description": "Create your first one"
```

### Potencjalnie potrzebne (do dodania jeśli będą używane):

- Menu actions tooltips
- Confirmation messages
- Error states

## Zakres poza implementacją (później)

**Nie implementujemy teraz:**

- ❌ Faktyczna funkcjonalność search (tylko UI placeholder)
- ❌ Faktyczna funkcjonalność sort (tylko UI placeholder)
- ❌ Pagination / "Load more" (widoczne w Figma, ale bez logiki)
- ❌ Menu actions (View, Edit, Add to favorites, Duplicate, Delete)
- ❌ Checkbox selection logic (tylko UI)
- ❌ Integracja z backendem

**Implementujemy teraz:**

- ✅ Mock API z zamokowanymi danymi
- ✅ Skeleton loading state
- ✅ Lista z danymi z mocka
- ✅ Layout zgodny z Figma
- ✅ Wszystkie komponenty UI (bez logiki akcji)
