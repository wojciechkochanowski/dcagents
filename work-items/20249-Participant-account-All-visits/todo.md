# TODO: 20249 - Participant account - All visits

## Phase 1: API Layer

- [x] Create `common/requests/subjects/subjectVisits.ts`
- [x] Define SubjectVisit interface
- [x] Define RemoteSubjectVisit interface (snake_case)
- [x] Define FetchSubjectVisitsOptions interface
- [x] Define FetchSubjectVisitsResponseHandlers interface
- [x] Implement fetchSubjectVisits function with mock fallback
- [x] Create mock data (4-5 visits: upcoming, completed, cancelled)
- [x] Add export to existing `common/requests/subjects/index.ts`

## Phase 2: Page Setup

- [x] Create `apps/datacapt/src/pages/public/calendar.tsx`
- [x] Add AuthRoute with AccountType.Subject
- [x] Add DatacPageTitle
- [x] Add SessionTimeoutModal
- [x] Import SubjectVisits component

## Phase 3: Main Component - SubjectVisits

- [x] Create directory `SubjectDashboard/SubjectVisits/`
- [x] Create SubjectVisits.tsx
- [x] Create SubjectVisits.less
- [x] Create index.tsx export
- [x] Implement Layout wrapper
- [x] Implement custom tab pills (Upcoming/Past)
- [x] Implement visits fetching
- [x] Implement tab filtering logic
- [x] Implement empty states
- [x] Implement modal state management

## Phase 4: Visit Card Component

- [x] Create directory `SubjectVisits/SubjectVisitCard/`
- [x] Create SubjectVisitCard.tsx
- [x] Create SubjectVisitCard.less
- [x] Create index.tsx export
- [x] Implement header (visit name • study name)
- [x] Implement map section (conditional)
- [x] Implement date section (day + month format)
- [x] Implement time + weekday row
- [x] Implement address row
- [x] Implement center name row
- [x] Implement cancelled status (conditional)
- [x] Implement chevron icon
- [x] Style upcoming variant (with map)
- [x] Style past variant (no map)
- [x] Style cancelled variant (red status, line-through)

## Phase 5: Visit Modal Component

- [x] Create directory `SubjectVisits/SubjectVisitModal/`
- [x] Create SubjectVisitModal.tsx
- [x] Create SubjectVisitModal.less
- [x] Create index.tsx export
- [x] Implement SubjectDashboardModal wrapper (close button X is built-in, do NOT add another!)
- [x] Implement header (date + time + weekday)
- [x] Implement map section (conditional - only if latitude/longitude exist)
- [x] Implement location section (icon + address + center)
- [x] Implement "Open in Google Maps" button
- [x] Implement study section (icon + study name + visit name)
- [x] Implement "Go to the study" button (placeholder functionality)

## Phase 6: Translations

- [x] Add subject_dashboard.visits.title
- [x] Add subject_dashboard.visits.upcoming
- [x] Add subject_dashboard.visits.past
- [x] Add subject_dashboard.visits.no_upcoming
- [x] Add subject_dashboard.visits.no_past
- [x] Add subject_dashboard.visits.cancelled
- [x] Add subject_dashboard.visits.open_in_google_maps
- [x] Add subject_dashboard.visits.go_to_study

## Phase 7: Styling Review

- [x] Verify design token usage in all LESS files
- [x] Verify BEM naming convention
- [x] Verify responsive behavior
- [x] Verify typography mixins

## Phase 8: Integration & Testing

- [x] Verify page loads at /public/calendar
- [x] Verify tab switching works
- [x] Verify visits display correctly
- [x] Verify modal opens/closes
- [x] Verify empty states display
- [x] Verify bottom nav "Visits" is active (already configured in Layout.tsx)
- [x] Run lint validation
- [x] Run TypeScript check

## Completion

- [x] All phases complete
- [x] Code reviewed
- [x] Ready for backend integration
