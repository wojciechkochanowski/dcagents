# Wymagania: Wspólny komponent dla list studii

## Opis zadania

Utworzenie wspólnego komponentu dla wyświetlania list studii, wykorzystywanego przez:

- `/studies` - lista studii klinicznych (StudiesContent)
- `/recruitment` - lista studii rekrutacyjnych (RecruitmentStudiesContent)

## Architektura: Prosty kontekst

System wykorzystuje React Context bez dodatkowych HOC wrapperów:

### Wzorzec:

1. **Kontekst** (`StudyListContext.tsx`):

   - Interfejs `IStudyListState` definiujący dostępne wartości i funkcje
   - `studyListInitialState` z domyślnymi wartościami
   - `React.createContext` eksportujący kontekst

2. **Komponenty konsumujące**:
   - Używają `useContext(StudyListContext)` bezpośrednio
   - Brak HOC wrapperów - prostsza struktura

### Przykład użycia:

```tsx
// Główny komponent z providerem
<StudyListContext.Provider value={studyListState}>
  <StudyListContent />
</StudyListContext.Provider>;

// Komponent konsumujący
const StudyListHeader: React.FC = () => {
  const { intlScope, filterComponent } = useContext(StudyListContext);
  // ...
};
```

## Analiza istniejących implementacji

### StudiesList (Clinical Trials)

**Lokalizacja**: `/apps/datacapt/src/components/studies/StudiesContent/`

**Struktura**:

- `StudiesContent.tsx` - główny kontener z logiką
- `StudiesList/StudiesList.tsx` - lista z kafelkami
- `StudiesList/StudyCard/StudyCard.tsx` - pojedynczy kafelek

**Funkcjonalność**:

- Wyszukiwanie (debounced search)
- Filtrowanie (status, sortowanie)
- Paginacja
- Nawigacja do `/study-dashboard/:id`
- Modal tworzenia nowej studii

**Dane na kafelku**:

- Reference, status tag
- Nazwa studii, centra
- Data rozpoczęcia, project manager
- Progress bar (inclusions count/required)

**Unikalne elementy**:

- Filtry (StudyFilters - status, orderBy)
- Query params: `?searchPhrase=...&status=...&orderBy=...`

### RecruitmentStudiesContent

**Lokalizacja**: `/apps/datacapt/src/components/recruitment/RecruitmentStudiesContent/`

**Struktura**:

- `RecruitmentStudiesContent.tsx` - główny kontener z logiką
- `RecruitmentStudyCard/RecruitmentStudyCard.tsx` - pojedynczy kafelek
- `RecruitmentStudiesNumbers/` - statystyki na górze

**Funkcjonalność**:

- Wyszukiwanie (debounced search)
- Paginacja
- Nawigacja do `/recruitment-study/:id`
- Modal tworzenia nowej studii rekrutacyjnej

**Dane na kafelku**:

- Reference, status tag
- Nazwa studii, centra
- Target date, recruiter name
- Progress bar (qualified/target count)

**Unikalne elementy**:

- Statystyki (`RecruitmentStudiesNumbers` - currentCount, recruitingCount, etc.)
- Query params: `?searchPhrase=...`

## Wspólne elementy

### Logika:

- Fetchowanie listy z paginacją i searchem
- Debounced search (1000ms)
- Loading states (isFetchingStudyList, isSearching)
- URL query params sync
- Empty states (no studies / no results)
- ACL permissions (AclAction.Add)

### UI:

- Header z tytułem i kontrolkami (search, create button)
- Lista kafelków (Card z podobną strukturą)
- Paginacja (DatacPagination z isDetached)
- Loading overlay (DatacLoading)
- Empty state placeholders

### Kafelek studii:

- Card z headerem (reference + status tag)
- Progress circle (Antd Progress)
- Info items (ikona + label + value)
- Centra (z popoverem jeśli >2)
- Kliknięcie → nawigacja

## Różnice do obsłużenia

| Aspekt             | Studies                                | Recruitment                   |
| ------------------ | -------------------------------------- | ----------------------------- |
| **Top section**    | Brak                                   | RecruitmentStudiesNumbers     |
| **Filtry**         | StudyFilters (status, orderBy)         | Brak                          |
| **Progress data**  | createdInclusions / requiredInclusions | qualified / target            |
| **Progress label** | "Average progress" + "inclusions"      | "Progress" + "qualified"      |
| **Kafelek info**   | Start date, Project manager            | Target date, Recruiter        |
| **Nawigacja**      | `/study-dashboard/:id`                 | `/recruitment-study/:id`      |
| **API**            | fetchStudies                           | fetchRecruitmentStudies       |
| **Nowa studia**    | createStudy                            | NewRecruitmentStudy component |

## Wymagane interfejsy

### Kontekst studii:

```typescript
interface IStudyListState {
  // Konfiguracja typu listy
  listType: "studies" | "recruitment";

  // API functions
  fetchStudies: (options, handlers) => void;
  createStudy: (data, handlers) => void;

  // Dane studii
  studies: Study[] | RecruitmentStudy[];
  studiesCount: number | StudiesCount;

  // Routing
  studyRoute: (id: string) => string;

  // UI customization
  topSection?: React.ReactNode;
  hasFilters: boolean;
  filterComponent?: React.ReactNode;
  createStudyComponent: React.ReactNode;

  // Translation scopes
  intlScope: string;

  // Card rendering
  cardComponent: React.ComponentType<CardProps>;
}
```

## Struktura komponentów

```
shared/
  StudyList/
    index.tsx                        # Export
    StudyListContext.tsx             # Kontekst + initial state
    StudyListContent.tsx             # Główny kontainer (Provider)
    StudyListHeader.tsx              # Header z search + controls
    StudyListGrid.tsx                # Grid z kafelkami
    StudyListCard/                   # Bazowy komponent kafelka
      StudyListCard.tsx
      StudyListCard.less
    StudyListEmptyState.tsx          # Empty states

studies/StudiesContent/
  StudiesContent.tsx                 # Provider + config dla studies
  StudiesFilters.tsx                 # Filtry (status, orderBy)
  StudyCard.tsx                      # Customizacja kafelka

recruitment/RecruitmentStudiesContent/
  RecruitmentStudiesContent.tsx     # Provider + config dla recruitment
  RecruitmentStudiesNumbers.tsx     # Statystyki (existing)
  RecruitmentStudyCard.tsx          # Customizacja kafelka
```

## Planowane zmiany w istniejących plikach

### Do refaktoryzacji:

1. `/studies/StudiesContent/StudiesContent.tsx` - wykorzystać nowy shared component
2. `/studies/StudiesContent/StudiesList/` - usunąć, zastąpić shared
3. `/studies/StudiesContent/StudiesList/StudyCard/` - przenieść customizacje do nowego
4. `/recruitment/RecruitmentStudiesContent/RecruitmentStudiesContent.tsx` - wykorzystać shared
5. `/recruitment/RecruitmentStudiesContent/RecruitmentStudyCard/` - przenieść customizacje

### Do zachowania (bez zmian):

- `/studies/StudiesContent/NewStudyForm/` - używane w modal
- `/recruitment/RecruitmentStudiesContent/NewRecruitmentStudy/` - używane w modal
- `/recruitment/RecruitmentStudiesContent/RecruitmentStudiesNumbers/` - używane jako topSection

## Translations

Potrzebne klucze (en.json):

```json
{
  "shared": {
    "study_list": {
      "no_access_to_any": "...",
      "no_results_for_filters": "...",
      "search_placeholder": "...",
      "create_new": "..."
    }
  }
}
```

Istniejące scope'y do wykorzystania:

- `studies.*` - dla clinical trials
- `recruitment.*` - dla recruitment
