# Implementacja: Wspólny komponent dla list studii

## Strategia implementacji

Zadanie wymaga utworzenia **wspólnej abstrakcji dla list studii** z obsługą dwóch wariantów (clinical trials + recruitment), analogicznie do wzorca Builder z kontekstem.

### Podział na sub-agentów

#### Faza 1: Infrastruktura wspólnego komponentu (niezależne)

**Agent 1: StudyList Context**

- Utworzenie `/shared/StudyList/StudyListContext.tsx`
- Interfejs `IStudyListState` z konfiguracją dla obu typów list
- Export przez `/shared/StudyList/index.tsx`

**Agent 2: StudyList Core Components**

- Utworzenie `/shared/StudyList/StudyListContent.tsx` - główny kontener
- Utworzenie `/shared/StudyList/StudyListHeader.tsx` - header z search
- Utworzenie `/shared/StudyList/StudyListGrid.tsx` - grid z kafelkami
- Utworzenie `/shared/StudyList/StudyListEmptyState.tsx` - empty states
- Utworzenie `/shared/StudyList/StudyListContent.less` - style
- Wszystkie komponenty używają context wrapper

**Agent 3: StudyList Base Card**

- Utworzenie `/shared/StudyList/StudyListCard/StudyListCard.tsx`
- Utworzenie `/shared/StudyList/StudyListCard/StudyListCard.less`
- Bazowy komponent kafelka z render props dla customizacji
- Wspólne elementy: header (reference + status), progress, centra

#### Faza 2: Integracja z istniejącymi listami (sekwencyjnie po Fazie 1)

**Agent 4: Studies List Refactoring**

- Refaktoryzacja `/studies/StudiesContent/StudiesContent.tsx`
- Przeniesienie logiki filtrów do `/studies/StudiesContent/StudiesFilters.tsx`
- Utworzenie customizowanego kafelka używającego StudyListCard
- Usunięcie `/studies/StudiesContent/StudiesList/` (stare komponenty)
- Konfiguracja providera z parametrami dla clinical trials

**Agent 5: Recruitment List Refactoring**

- Refaktoryzacja `/recruitment/RecruitmentStudiesContent/RecruitmentStudiesContent.tsx`
- Utworzenie customizowanego kafelka używającego StudyListCard
- Integracja z RecruitmentStudiesNumbers jako topSection
- Usunięcie starego RecruitmentStudyCard
- Konfiguracja providera z parametrami dla recruitment

#### Faza 3: Finalizacja (sekwencyjnie po Fazie 2)

**Main Agent: Integration & Validation**

- Weryfikacja działania obu list
- Sprawdzenie routing, nawigacji, ACL
- Walidacja URL query params sync
- Sprawdzenie empty states i loading states
- Finalne czyszczenie kodu

## Szczegółowe zadania dla agentów

### Agent 1: StudyList Context

**Input**: Requirements.md
**Output**: Context + index

**Zadania**:

1. Utworzyć `/shared/StudyList/StudyListContext.tsx`:

   - Interface `IStudyListState` z:
     - API functions (fetchStudies, createStudy)
     - Dane (studies, studiesCount, isFetching, isSearching)
     - Routing (studyRoute)
     - UI (topSection, filterComponent, createStudyComponent)
     - Translation scope (intlScope)
     - Card component (cardComponent)
   - `studyListInitialState` z default values
   - `React.createContext<IStudyListState>`

2. Utworzyć `/shared/StudyList/index.tsx`:
   - Export kontekstu i typów

**Dependencies**: Brak (niezależne)

### Agent 2: StudyList Core Components

**Input**: StudyListContext z Agent 1
**Output**: Core components (Content, Header, Grid, EmptyState) + styles

**Zadania**:

1. Utworzyć `StudyListContent.tsx`:

   - Provider z konfiguracją
   - Logika fetchowania (z debounced search)
   - URL query params sync
   - Paginacja
   - Loading states
   - ACL permissions check
   - Render: Header + topSection + Grid + Pagination

2. Utworzyć `StudyListHeader.tsx`:

   - Używa `useContext(StudyListContext)`
   - Title + Search input + filterComponent + createStudyComponent
   - Debounced search callback (1000ms)

3. Utworzyć `StudyListGrid.tsx`:

   - Używa `useContext(StudyListContext)`
   - Render grid z cardComponent
   - Przekazywanie study + index do każdego card

4. Utworzyć `StudyListEmptyState.tsx`:

   - Używa `useContext(StudyListContext)`
   - 2 warianty: no studies (z create button) / no results (bez)
   - ACL check dla create button
   - Placeholders (DocumentPlaceholder / EmptyPlaceholder)

5. Utworzyć `StudyListContent.less`:
   - Style dla głównego kontenera
   - Header layout
   - Grid layout (responsive)
   - Empty states
   - Search input + controls

**Dependencies**: Agent 1 (StudyListContext)

### Agent 3: StudyList Base Card

**Input**: StudyListContext z Agent 1
**Output**: Bazowy komponent kafelka + styles

**Zadania**:

1. Utworzyć `StudyListCard/StudyListCard.tsx`:

   - Używa `useContext(StudyListContext)`
   - Props: `study`, `index`
   - Render Card z:
     - Header slot (reference + status)
     - Progress slot (customizable label + progress data)
     - Info slots (customizable fields)
   - Funkcja `renderCenters` (wspólna logika z popoverem)
   - onClick → navigate z context.studyRoute

2. Utworzyć `StudyListCard/StudyListCard.less`:
   - Card styling (border, shadow, hover)
   - Header layout
   - Progress section (circle + text)
   - Info items layout (icon + label + value)
   - Centers popover styling
   - Responsive design

**Dependencies**: Agent 1 (StudyListContext)

### Agent 4: Studies List Refactoring

**Input**: Wszystkie komponenty z Fazy 1 (Agent 1, 2, 3)
**Output**: Zrefaktoryzowane StudiesContent używające shared components

**Zadania**:

1. Przenieść filtry do `StudiesFilters.tsx`:

   - Wydzielić StudyFilters component z StudiesContent
   - Zachować logikę (status, orderBy, popover)
   - Pozostawić w `/studies/StudiesContent/StudiesFilters.tsx`

2. Utworzyć `StudiesContent/StudyCard.tsx`:

   - Wrapper używający `StudyListCard` z shared
   - Customizacja progress label: "Average progress" + "inclusions"
   - Customizacja info fields: Start date, Project manager
   - Progress data: `createdInclusionsCount / requiredInclusionsCount`

3. Refaktoryzować `StudiesContent.tsx`:

   - Import `StudyListContent` z shared
   - Konfiguracja providera:
     - `listType: 'studies'`
     - `fetchStudies: fetchStudies` (z common/requests)
     - `studyRoute: routes.studyDashboard`
     - `intlScope: 'studies'`
     - `filterComponent: <StudiesFilters />`
     - `createStudyComponent: <Modal + NewStudyForm>`
     - `cardComponent: StudyCard`
   - Usunąć starą logikę (przeniesioną do shared)
   - Zachować tylko konfigurację providera

4. Usunąć stare pliki:
   - `/studies/StudiesContent/StudiesList/StudiesList.tsx`
   - `/studies/StudiesContent/StudiesList/StudyCard/StudyCard.tsx`
   - Związane style

**Dependencies**: Faza 1 kompletna (Agent 1, 2, 3)

### Agent 5: Recruitment List Refactoring

**Input**: Wszystkie komponenty z Fazy 1 (Agent 1, 2, 3)
**Output**: Zrefaktoryzowane RecruitmentStudiesContent używające shared components

**Zadania**:

1. Utworzyć `RecruitmentStudiesContent/RecruitmentStudyCard.tsx`:

   - Wrapper używający `StudyListCard` z shared
   - Customizacja progress label: "Progress" + "qualified"
   - Customizacja info fields: Target date, Recruiter
   - Progress data: `getRecruitmentStudyProgress(study)` - qualified/target

2. Refaktoryzować `RecruitmentStudiesContent.tsx`:

   - Import `StudyListContent` z shared
   - Konfiguracja providera:
     - `listType: 'recruitment'`
     - `fetchStudies: fetchRecruitmentStudies` (z common/requests)
     - `studyRoute: routes.recruitmentStudy`
     - `intlScope: 'recruitment'`
     - `topSection: <RecruitmentStudiesNumbers />`
     - `createStudyComponent: <NewRecruitmentStudy>`
     - `cardComponent: RecruitmentStudyCard`
   - Usunąć starą logikę (przeniesioną do shared)
   - Zachować tylko konfigurację providera

3. Usunąć stare pliki:

   - `/recruitment/RecruitmentStudiesContent/RecruitmentStudyCard/RecruitmentStudyCard.tsx`
   - Związane style

4. Zachować bez zmian:
   - `RecruitmentStudiesNumbers/` - używane jako topSection
   - `NewRecruitmentStudy/` - używane jako createStudyComponent

**Dependencies**: Faza 1 kompletna (Agent 1, 2, 3)

### Main Agent: Integration & Validation

**Input**: Wszystkie zrefaktoryzowane komponenty z Fazy 2
**Output**: Działający system + walidacja

**Zadania**:

1. Weryfikacja clinical trials list:

   - Sprawdzić routing `/studies`
   - Przetestować search + filtry
   - Sprawdzić paginację
   - Sprawdzić nawigację do study dashboard
   - Walidować query params sync
   - Sprawdzić empty states
   - Sprawdzić ACL (create button)

2. Weryfikacja recruitment list:

   - Sprawdzić routing `/recruitment`
   - Przetestować search
   - Sprawdzić paginację
   - Sprawdzić nawigację do recruitment study
   - Walidować query params sync
   - Sprawdzić statystyki na górze
   - Sprawdzić empty states
   - Sprawdzić ACL (create button)

3. Walidacja wspólnych elementów:

   - Context działa poprawnie
   - useContext używane bezpośrednio
   - Style są spójne
   - Loading states działają
   - Debounced search działa (1000ms)
   - Cards renderują poprawnie
   - Centers popover działa

4. Czyszczenie:
   - Usunięcie nieużywanych importów
   - Usunięcie nieużywanych stylów
   - Sprawdzenie czy wszystkie stare pliki usunięte
   - Weryfikacja struktury katalogów

**Dependencies**: Faza 2 kompletna (Agent 4, 5)

## Orchestration Pattern

### Faza 1: Parallel (Agent 1, 2, 3)

- Agent 1, 2, 3 mogą pracować **równolegle**
- Agent 2 i 3 zależą od interfejsów z Agent 1, ale mogą używać wstępnej wersji
- Synchronizacja przed Fazą 2

### Faza 2: Parallel after Faza 1 (Agent 4, 5)

- Agent 4 i 5 **czekają** na zakończenie Fazy 1
- Potem mogą pracować **równolegle**
- Synchronizacja przed Fazą 3

### Faza 3: Sequential after Faza 2 (Main Agent)

- Main Agent **czeka** na zakończenie Fazy 2
- Wykonuje walidację i finalizację **sekwencyjnie**

## Dependency Mapping

```
Faza 1 (Parallel):
  Agent 1: Context         → Independent
  Agent 2: Core Components         → Uses Agent 1 interfaces
  Agent 3: Base Card               → Uses Agent 1 interfaces

  Sync Point ✓

Faza 2 (Parallel):
  Agent 4: Studies Refactoring     → Depends on Faza 1 (all)
  Agent 5: Recruitment Refactoring → Depends on Faza 1 (all)

  Sync Point ✓

Faza 3 (Sequential):
  Main Agent: Integration          → Depends on Faza 2 (all)
```

## Interface Contracts

### Agent 1 → Agent 2, 3

```typescript
// Agent 1 dostarcza:
export interface IStudyListState {
  studies: any[];
  studiesCount: number | any;
  isFetching: boolean;
  isSearching: boolean;
  studyRoute: (id: string) => string;
  intlScope: string;
  topSection?: React.ReactNode;
  filterComponent?: React.ReactNode;
  createStudyComponent: React.ReactNode;
  cardComponent: React.ComponentType<any>;
  fetchStudies: (options: any, handlers: any) => void;
}

```

### Faza 1 → Faza 2

```typescript
// Faza 1 dostarcza:
export { StudyListContent } from "./StudyListContent";
export { StudyListCard } from "./StudyListCard";
export { IStudyListState, StudyListContext } from "./StudyListContext";

// Faza 2 konsumuje:
import { StudyListContent, StudyListCard } from "shared/StudyList";
```

## Translations

**Nowe klucze w `en.json`**:

```json
{
  "shared": {
    "study_list": {
      "no_access_to_any": "You don't have access to any studies",
      "no_results_for_filters": "No studies match your search criteria",
      "search_placeholder": "Search by study name or reference",
      "loading": "Loading studies..."
    }
  }
}
```

**Istniejące klucze** (zachowane bez zmian):

- `studies.title`, `studies.create_new`, `studies.card.*`
- `recruitment.title`, `recruitment.study_card.*`
- `studies.status.*`, `studies.filters.*`, `studies.sorting.*`

## Pliki do utworzenia

**Nowe pliki** (Faza 1):

1. `/shared/StudyList/index.tsx`
2. `/shared/StudyList/StudyListContext.tsx`
4. `/shared/StudyList/StudyListContent.tsx`
5. `/shared/StudyList/StudyListContent.less`
6. `/shared/StudyList/StudyListHeader.tsx`
7. `/shared/StudyList/StudyListGrid.tsx`
8. `/shared/StudyList/StudyListEmptyState.tsx`
9. `/shared/StudyList/StudyListCard/index.tsx`
10. `/shared/StudyList/StudyListCard/StudyListCard.tsx`
11. `/shared/StudyList/StudyListCard/StudyListCard.less`

**Nowe pliki** (Faza 2): 12. `/studies/StudiesContent/StudiesFilters.tsx` 13. `/studies/StudiesContent/StudyCard.tsx` 14. `/recruitment/RecruitmentStudiesContent/RecruitmentStudyCard.tsx`

## Pliki do modyfikacji

**Faza 2**:

1. `/studies/StudiesContent/StudiesContent.tsx` - pełna refaktoryzacja
2. `/recruitment/RecruitmentStudiesContent/RecruitmentStudiesContent.tsx` - pełna refaktoryzacja

## Pliki do usunięcia

**Faza 2**:

1. `/studies/StudiesContent/StudiesList/index.tsx`
2. `/studies/StudiesContent/StudiesList/StudiesList.tsx`
3. `/studies/StudiesContent/StudiesList/StudiesList.less`
4. `/studies/StudiesContent/StudiesList/StudyCard/index.tsx`
5. `/studies/StudiesContent/StudiesList/StudyCard/StudyCard.tsx`
6. `/recruitment/RecruitmentStudiesContent/RecruitmentStudyCard/index.tsx`
7. `/recruitment/RecruitmentStudiesContent/RecruitmentStudyCard/RecruitmentStudyCard.tsx`
8. `/recruitment/RecruitmentStudiesContent/RecruitmentStudyCard/RecruitmentStudyCard.less`

## Validation Checklist

- [ ] Context zawiera wszystkie potrzebne wartości
- [ ] StudyListContent fetchuje dane poprawnie
- [ ] Search działa z debounce (1000ms)
- [ ] Paginacja działa dla obu list
- [ ] Query params sync działa
- [ ] Empty states renderują poprawnie
- [ ] Clinical trials list działa z filtrami
- [ ] Recruitment list działa ze statystykami
- [ ] Cards renderują poprawnie dla obu typów
- [ ] Nawigacja działa (study-dashboard / recruitment-study)
- [ ] ACL permissions sprawdzane
- [ ] Loading states działają
- [ ] Centers popover działa
- [ ] Stare komponenty usunięte
- [ ] Style są spójne
- [ ] Translations używają poprawnych scope'ów
