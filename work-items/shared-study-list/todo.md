# Task List: Wspólny komponent dla list studii

## Faza 1: Infrastruktura wspólnego komponentu ⏳

### Agent 1: StudyList Context

- [x] Utworzyć `/shared/StudyList/StudyListContext.tsx` z interfejsem `IStudyListState`
- [x] Utworzyć `/shared/StudyList/index.tsx` z eksportami

### Agent 2: StudyList Core Components

- [x] Utworzyć `StudyListContent.tsx` - główny kontener z logika fetchowania
- [x] Utworzyć `StudyListHeader.tsx` - header z search i controls
- [x] Utworzyć `StudyListGrid.tsx` - grid z kafelkami
- [x] Utworzyć `StudyListEmptyState.tsx` - empty states
- [x] Utworzyć `StudyListContent.less` - style

### Agent 3: StudyList Base Card

- [x] Utworzyć `StudyListCard/StudyListCard.tsx` - bazowy kafelek
- [x] Utworzyć `StudyListCard/StudyListCard.less` - style kafelka
- [x] Utworzyć `StudyListCard/index.tsx` - export

## Faza 2: Integracja z istniejącymi listami ⏳

### Agent 4: Studies List Refactoring ✅

- [x] Przenieść filtry do `StudiesFilters.tsx`
- [x] Utworzyć `StudiesContent/StudyCard.tsx` - customizacja kafelka
- [x] Refaktoryzować `StudiesContent.tsx` - wykorzystać shared components
- [x] Usunąć `/studies/StudiesContent/StudiesList/` (stare pliki)

**Raport z wykonania:**

**Utworzone pliki:**

- `/frontend/apps/datacapt/src/components/studies/StudiesContent/StudiesFilters.tsx` - wydzielony komponent filtrów z całą logiką status, orderBy, popover
- `/frontend/apps/datacapt/src/components/studies/StudiesContent/StudyCard.tsx` - wrapper używający `StudyListCard` z shared

**Zmodyfikowane pliki:**

- `/frontend/apps/datacapt/src/components/studies/StudiesContent/StudiesContent.tsx` - całkowicie przebudowany do użycia `StudyListContent` z shared

**Usunięte pliki:**

- `/frontend/apps/datacapt/src/components/studies/StudiesContent/StudiesList/` - cały folder ze starymi plikami `StudiesList.tsx`, `StudyCard.tsx`, `StudiesList.less`

**Konfiguracja provider:**

```tsx
<StudyListContent
  fetchStudies={fetchStudiesList}
  studies={studies}
  studiesCount={studiesCount}
  isFetching={isFetchingStudyList}
  studyRoute={routes.studyDashboard}
  topSection={topSection} // Header z tytułem
  filterComponent={filterComponent} // StudiesFilters komponent
  createStudyComponent={createStudyComponent} // Modal z NewStudyForm
  intlScope="studies"
  cardComponent={StudyCard} // Custom StudyCard wrapper
  pageSize={currentPageSize}
  canCreate={userCan(AclAction.Add)}
/>
```

**Customizacja kafelka:**
`StudyCard` używa `StudyListCard` z shared, przekazując:

- `renderProgress` - wyświetla "Average progress" + inclusions count (`createdInclusionsCount / requiredInclusionsCount`)
- `renderInfo` - 4 pola: Study name, Centers (z popover gdy >2), Start date, Project manager
- Progress data renderowany jako `Progress` circle z `study.progress` procentami
- Domyślny header z `study.reference` i `DatacStudyStatusTag`

### Agent 5: Recruitment List Refactoring ✅

- [x] Utworzyć `RecruitmentStudiesContent/RecruitmentStudyCard.tsx` - customizacja kafelka
- [x] Refaktoryzować `RecruitmentStudiesContent.tsx` - wykorzystać shared components
- [x] Usunąć stare pliki RecruitmentStudyCard

**Raport z wykonania:**

**Utworzone pliki:**

- `/frontend/apps/datacapt/src/components/recruitment/RecruitmentStudiesContent/RecruitmentStudyCard.tsx` - wrapper używający `StudyListCard` z shared

**Zmodyfikowane pliki:**

- `/frontend/apps/datacapt/src/components/recruitment/RecruitmentStudiesContent/RecruitmentStudiesContent.tsx` - całkowicie przebudowany do użycia `StudyListContent` z shared

**Usunięte pliki:**

- `/frontend/apps/datacapt/src/components/recruitment/RecruitmentStudiesContent/RecruitmentStudyCard/` - cały folder ze starymi plikami `RecruitmentStudyCard.tsx`, `RecruitmentStudyCard.less`, `index.tsx`

**Konfiguracja provider:**

```tsx
<StudyListContent
  fetchStudies={fetchStudiesList}
  studies={studies}
  studiesCount={studiesCount?.currentCount || 0}
  isFetching={isFetchingStudyList}
  studyRoute={routes.recruitmentStudy}
  topSection={topSection} // RecruitmentStudiesNumbers component
  createStudyComponent={createStudyComponent} // NewRecruitmentStudy modal
  intlScope="recruitment"
  cardComponent={RecruitmentStudyCardWithCenters} // Custom wrapper with centers
  pageSize={pageSize}
  canCreate={userCan(AclAction.Add)}
/>
```

**Customizacja kafelka:**
`RecruitmentStudyCard` używa `StudyListCard` z shared, przekazując:

- `renderProgress` - wyświetla "Progress" label + qualified count (`study.countQualified + study.countEnrolled + study.countExcluded + study.countCompleted / study.target`)
- `renderInfo` - 4 pola: Target date, Recruiter, Study name, Centers (z popover gdy >2)
- Progress data renderowany jako `Progress` circle z `getRecruitmentStudyProgress(study)` procentami
- Domyślny header z `study.reference` i `DatacStudyStatusTag`

**Integracja z topSection:**
`RecruitmentStudiesNumbers` przekazany jako `topSection` - wyświetla statystyki (total studies, recruiting count/percent, draft, ended, archived) przed listą kafelków

## Faza 3: Finalizacja ✅

### Main Agent: Integration & Validation

- [x] Weryfikacja clinical trials list (routing, search, filtry, paginacja)
- [x] Weryfikacja recruitment list (routing, search, paginacja, statystyki)
- [x] Walidacja wspólnych elementów (context, useContext, styles, loading, cards)
- [x] Czyszczenie kodu (unused imports, styles, pliki)
- [x] Finalne testy i walidacja

**Walidacja wykonana:**

✅ **TypeScript**: Brak błędów kompilacji
✅ **ESLint**: Brak błędów, usunięto nieużywane importy
✅ **Struktura katalogów**: Potwierdzone usunięcie starych plików

- Usunięto `/studies/StudiesContent/StudiesList/`
- Usunięto `/recruitment/RecruitmentStudiesContent/RecruitmentStudyCard/`
  ✅ **Shared components**: Wszystkie 10 plików utworzonych w `common/components/shared/StudyList/`
  ✅ **Refaktoryzacja**: Oba moduły używają nowego wspólnego komponentu
  ✅ **Brak pozostałości**: Żadne importy nie odnoszą się do starych komponentów
