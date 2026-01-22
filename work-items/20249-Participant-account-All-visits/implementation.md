# Implementation Plan: 20249 - Participant account - All visits

## Overview

Implementacja widoku wizyt w koncie uczestnika. Mobile-first design, mockowane dane.

## 🚨 CRITICAL: Reusable Components from Participant Account

**MANDATORY**: Use these NEW components instead of standard Datacapt components:

### 1. SubjectDashboardModal (NOT DatacModal!)

**Location:** `SubjectDashboard/components/SubjectDashboardModal/`

```tsx
import { SubjectDashboardModal } from "../components/SubjectDashboardModal";

<SubjectDashboardModal
  isOpened={isOpen}
  onClose={() => setIsOpen(false)}
  className="custom-class"
>
  {/* content */}
</SubjectDashboardModal>;
```

- Has built-in close button (X) positioned top-right
- Uses AntModal underneath with participant-specific styling
- Props: `isOpened`, `onClose`, `children`, `className?`, `wrapClassName?`

### 2. Layout (SubjectDashboard Layout)

**Location:** `SubjectDashboard/Layout/`

- Already includes bottom navigation with "Visits" link to `/public/calendar`
- Responsive: LayoutDesktop (>748px) / LayoutMobile
- Handles subject data fetching, banners, warnings

```tsx
import { Layout } from "../Layout";

<Layout>{/* page content */}</Layout>;
```

### 3. SubjectDashboardSectionHeader

**Location:** `SubjectDashboard/components/SubjectDashboardSectionHeader/`

```tsx
<SubjectDashboardSectionHeader
  title="Page Title"
  subtitle="Optional subtitle"
  onBack={() => navigate(-1)}
/>
```

- Back button with chevron
- Sticky scrolled header on scroll

### 4. Available Icons (use with DatacIcon)

**Participant Account Icons:**

- `participantCalendar` - calendar icon
- `participantHome` - home icon
- `participantCircleCheckmark` - tasks/checkmark icon
- `participantUser` - user/profile icon
- `participantCoin` - payments icon
- `participantEarth` - globe/language icon
- `participantEdit2` - edit icon
- `participantLock` - password/lock icon

**Location Icons (for visit modal):**

- `location-01` / `location-03` - location marker
- `map-pin-01` through `map-pin-05` - map pins
- Verify exact icon from Figma design

```tsx
<DatacIcon name="participantCalendar" />
<DatacIcon name="location-01" type="outline" />
```

### 5. Other SubjectDashboard Components

- `SubjectDashboardFormItem` - form field wrapper
- `SubjectDashboardInput` - text input
- `SubjectDashboardDateInput` - date picker
- `SubjectDashboardInputSelect` - select dropdown
- `SubjectDashboardPhoneInput` - phone number input

## File Structure

```
apps/datacapt/src/
├── pages/public/
│   └── calendar.tsx                    # Nowa strona
├── components/SubjectDashboard/
│   └── SubjectVisits/
│       ├── index.tsx
│       ├── SubjectVisits.tsx           # Główny komponent
│       ├── SubjectVisits.less
│       ├── SubjectVisitCard/
│       │   ├── index.tsx
│       │   ├── SubjectVisitCard.tsx    # Karta wizyty
│       │   └── SubjectVisitCard.less
│       └── SubjectVisitModal/
│           ├── index.tsx
│           ├── SubjectVisitModal.tsx   # Modal szczegółów
│           └── SubjectVisitModal.less

common/requests/
├── subjects/
│   ├── subjectVisits.ts                # API + mock
│   └── index.ts                        # Export
```

## Implementation Phases

### Phase 1: API Layer (api-requests-manager agent)

**File:** `common/requests/subjects/subjectVisits.ts`

1. Interface `SubjectVisit` - model danych wizyty
2. Interface `FetchSubjectVisitsOptions` - opcje filtrowania (status)
3. Interface `FetchSubjectVisitsResponseHandlers` - handlers
4. Function `fetchSubjectVisits` - fetch z mockiem w onRequestError
5. Mock data - 4-5 przykładowych wizyt (upcoming, completed, cancelled)
6. Add export to existing `common/requests/subjects/index.ts` (file already exists)

**Mock strategy:**

```typescript
export const fetchSubjectVisits = (
  options: FetchSubjectVisitsOptions,
  responseHandlers?: FetchSubjectVisitsResponseHandlers,
) => {
  const query = {
    status: options.status,
  };

  const { req, cancel } = fetchApi.get<FetchSubjectVisitsResponse>(
    "subject_accounts/visits",
    query,
  );

  req.then(({ error, body, status }) => {
    if (error) {
      // MOCK: return data when backend doesn't exist yet
      const mockData = getMockVisits(options);
      responseHandlers?.onSuccess?.(mockData);
    } else if (responseHandlers?.onSuccess) {
      responseHandlers.onSuccess({
        visits: body.results.map(parseRemoteSubjectVisit),
        countAll: body.count,
      });
    }
  });

  return cancel; // Direct function, not { cancel } object - per project pattern
};
```

### Phase 2: Page Setup (react-component-creator agent)

**File:** `apps/datacapt/src/pages/public/calendar.tsx`

1. AuthRoute wrapper z AccountType.Subject
2. DatacPageTitle "Visits"
3. SessionTimeoutModal
4. Import SubjectVisits component

### Phase 3: Main Component (react-component-creator agent)

**File:** `SubjectVisits/SubjectVisits.tsx`

1. Layout wrapper (reuse from SubjectDashboard)
2. Title "Visits"
3. Tab component (Upcoming/Past) - custom pills, nie DatacTabs
4. State: selectedTab, visits data, loading
5. Fetch visits on mount i tab change
6. Filter visits by status
7. Render lista kart lub empty state
8. Modal state management

**Figma reference:** node-id=22609-66136, node-id=22609-66436

### Phase 4: Visit Card Component (react-component-creator agent)

**File:** `SubjectVisitCard/SubjectVisitCard.tsx`

Props:

- visit: SubjectVisit
- showMap: boolean (true dla upcoming z coords)
- onClick: () => void

Struktura:

1. Header: visitName • studyName
2. Map image (conditional) - Google Maps Static API lub placeholder
3. Date section: day + month | weekday, time range
4. Address
5. Center name
6. Cancelled status (conditional)
7. Chevron icon

**Figma reference:** node-id=22609-66506, node-id=22609-66568

### Phase 5: Visit Modal Component (react-component-creator agent)

**File:** `SubjectVisitModal/SubjectVisitModal.tsx`

**🚨 CRITICAL: Use SubjectDashboardModal, NOT DatacModal!**

```tsx
import { SubjectDashboardModal } from "../../components/SubjectDashboardModal";
```

Props:

- visit: SubjectVisit | null
- isOpened: boolean (matches SubjectDashboardModal prop name)
- onClose: () => void

Struktura:

1. SubjectDashboardModal wrapper (close button X is built-in - DO NOT add another!)
2. Header: date + time + weekday
3. Map (conditional - only render if latitude AND longitude exist)
4. Location section: icon + address + center
5. "Open in Google Maps" button (opens `https://www.google.com/maps?q={lat},{lng}`)
6. Study section: icon + studyName + visitName
7. "Go to the study" button (placeholder - navigation TBD)

**Figma reference:** node-id=22609-66218, node-id=22609-66330

### Phase 6: Translations (translation-manager agent)

Keys do dodania w `common/intl/en.json`:

```json
{
  "subject_dashboard.visits.title": "Visits",
  "subject_dashboard.visits.upcoming": "Upcoming",
  "subject_dashboard.visits.past": "Past",
  "subject_dashboard.visits.no_upcoming": "No upcoming visits",
  "subject_dashboard.visits.no_past": "No past visits",
  "subject_dashboard.visits.cancelled": "Cancelled",
  "subject_dashboard.visits.open_in_google_maps": "Open in Google Maps",
  "subject_dashboard.visits.go_to_study": "Go to the study"
}
```

### Phase 7: Styling (less-style-reviewer agent)

LESS files z design tokens:

- Tab pills styling (custom, nie Antd)
- Card styling (datac-box base)
- Map container styling
- Date typography (large day number)
- Modal styling (SubjectDashboardModal base)
- Cancelled state (red dot, line-through)

### Phase 8: Integration & Testing (main agent)

1. Verify wszystkie komponenty działają razem
2. Check responsive behavior
3. Verify navigation działa (bottom nav "Visits" active)
4. Test empty states
5. Test modal open/close
6. Lint validation

## Dependencies

```
Phase 1 (API) → Independent
Phase 2 (Page) → Depends on Phase 3
Phase 3 (Main) → Depends on Phase 1
Phase 4 (Card) → Independent (can parallel with Phase 3)
Phase 5 (Modal) → Independent (can parallel with Phase 3, 4)
Phase 6 (Translations) → Independent
Phase 7 (Styling) → Depends on Phase 3, 4, 5
Phase 8 (Integration) → Depends on all
```

## Parallel Execution Plan

**Round 1 (parallel):**

- Phase 1: API Layer
- Phase 4: Card component (structure only)
- Phase 5: Modal component (structure only)
- Phase 6: Translations

**Round 2 (parallel):**

- Phase 3: Main component (uses Phase 1)
- Phase 4: Card styling
- Phase 5: Modal styling

**Round 3 (sequential):**

- Phase 2: Page setup
- Phase 7: Style review
- Phase 8: Integration

## Notes

- Google Maps Static API requires API key - use placeholder image for now or conditional render
- "Go to the study" button - placeholder, nawigacja będzie w osobnym tasku
- **Bottom navigation "Visits" tab already configured** in Layout.tsx (line 32): `{ name: 'Visits', to: '/public/calendar', icon: 'participantCalendar' }` - no changes needed
- Use Layout component to wrap SubjectVisits - it handles responsive breakpoint (XsBreakpoint = 748px)
