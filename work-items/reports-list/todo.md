# TODO - Reports List Implementation

## ✅ Planowanie (COMPLETED)

- [x] Analiza designów Figma
- [x] Przegląd istniejącego kodu (StudyList skeleton)
- [x] Stworzenie planu implementacji
- [x] Zapisanie plików planu

## ✅ Faza 1: API Mock i interfejsy (COMPLETED)

- [x] Utworzyć plik `common/requests/reports.ts`
- [x] Zdefiniować interfejs `Report`
- [x] Stworzyć zamokowane dane (10-15 raportów)
- [x] Zaimplementować funkcję `fetchReports` z delay
- [x] Dodać export do `common/requests/index.ts`
- [x] Weryfikacja: TypeScript kompiluje bez błędów

## ✅ Faza 2.1: ReportListItem Component (COMPLETED)

- [x] Utworzyć strukturę folderów `ReportListItem/`
- [x] Zaimplementować `ReportListItem.tsx`
- [x] Dodać props interface
- [x] Layout: checkbox, icon, title+metadata, number, avatar, menu
- [x] Stworzyć `ReportListItem.less` z BEM
- [x] Wysokość 68px, spacing z design tokens
- [x] Hover state: background `@bg-secondary`
- [x] Utworzyć `index.ts` export
- [x] Weryfikacja: komponent renderuje poprawnie

## ✅ Faza 2.2: ReportListSkeleton Component (COMPLETED)

- [x] Utworzyć strukturę folderów `ReportListSkeleton/`
- [x] Zaimplementować `ReportListSkeleton.tsx`
- [x] Dodać props interface (count?: number)
- [x] Skeleton.Input dla tekstów
- [x] Skeleton.Avatar dla ikon i avatarów
- [x] Active animation
- [x] Stworzyć `ReportListSkeleton.less`
- [x] Wysokość 68px per item, dopasowanie do ReportListItem
- [x] Utworzyć `index.ts` export
- [x] Weryfikacja: 10 wierszy domyślnie, smooth animation

## ✅ Faza 3: Integracja z ReportsDashboard (COMPLETED)

- [x] Zaktualizować imports w `ReportsDashboard.tsx`
- [x] Dodać state: reports, isLoading
- [x] Dodać useEffect z fetchReports
- [x] Zaimplementować warunkowe renderowanie:
  - [x] isLoading → ReportListSkeleton
  - [x] reports.length === 0 → empty state
  - [x] reports.length > 0 → lista
- [x] Zaktualizować `ReportsDashboard.less`
- [x] Dodać style dla `.reports-dashboard__list`
- [x] Weryfikacja: wszystkie 3 stany działają

## ✅ Faza 4: Tłumaczenia (COMPLETED - NOT NEEDED)

- [x] Sprawdzić czy potrzebne dodatkowe klucze
- [x] Dodać tłumaczenia jeśli brakuje (menu actions, tooltips)
- [x] Weryfikacja: brak hardcoded stringów

Note: Wszystkie wymagane tłumaczenia już istnieją. Menu actions będą dodane później gdy funkcjonalność zostanie zaimplementowana.

## ✅ Faza 5: Design Fidelity & Review (COMPLETED)

- [x] Sprawdzić layout (68px height, spacing, alignment)
- [x] Sprawdzić typography (mixins, colors)
- [x] Sprawdzić colors (wszystkie z design system)
- [x] Sprawdzić spacing (tokens, border radius)
- [x] Sprawdzić skeleton (animation, dopasowanie)
- [x] Accessibility check
- [x] Manual testing (loading, lista, empty state)
- [x] Performance check (no errors, TypeScript clean)

Note: LESS files reviewed by less-style-reviewer agent. All hardcoded px values in ReportsDashboard.less converted to rem. Comments added to document Figma spec values (68px height, 32px icons/avatars).

## 📌 Notes

- Empty state już zaimplementowany ✓
- Search i sort już w UI (placeholder) ✓
- Menu actions - tylko UI, logika później
- Pagination - później z backendem
