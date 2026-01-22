# Reports Single View - Implementation Plan

## Phase 1: Refactoring (Sequential)

### Task 1.1: Rename ReportsDashboard → ReportsList

**Agent**: Main agent (simple refactor)

**Steps**:

1. Rename folder `ReportsDashboard` → `ReportsList`
2. Rename files: `ReportsDashboard.tsx` → `ReportsList.tsx`, `.less` files
3. Update component name and exports
4. **Update ALL BEM class names** from `reports-dashboard` → `reports-list`
5. Update imports in `pages/reports/index.tsx`

### Task 1.2: Move Components Inside ReportsList

**Agent**: Main agent

**Steps**:

1. Move `ReportListItem/` folder inside `ReportsList/`
2. Move `ReportListSkeleton/` folder inside `ReportsList/`
3. Update imports in ReportsList.tsx
4. Update ReportsList/index.ts exports
5. Remove old empty folders

## Phase 2: API & Interfaces

### Task 2.1: Extend reports.ts with Config and Data Functions

**Agent**: api-requests-manager

**Prompt**:

```
Extend common/requests/reports.ts with report config and data fetching:

1. Add interfaces (use exact types from requirements.md):
   - ReportConfig (columns, filters, defaultSort)
   - ReportColumn (key, label, sortable?, filterable?, width?)
   - ReportFilter (field, type: "select"|"date"|"text", options?)
   - FetchReportDataOptions (reportId, config, pagination, sort?, filters?)
   - FetchReportDataResponse (data: Record<string, unknown>[], totalCount)
   - FetchReportDataResponseHandlers (onSuccess, onError)

2. Extend Report interface with optional config: ReportConfig field

3. Update MOCK_REPORTS - add config to first 3 reports with columns:
   - subjectId (sortable: true)
   - name
   - value (sortable: true)
   - status (filterable: true, with options: Active/Inactive/Pending)
   - date (sortable: true)

4. Add fetchReportData mock function:
   - Use response handlers pattern (not async/await)
   - Generate 50 mock rows based on config.columns
   - Support pagination (limit/offset)
   - Simulate 800ms delay
   - Return { cancel } object

5. Add fetchReportById helper:
   - Find report by ID from MOCK_REPORTS
   - Return Report or undefined
   - Use response handlers pattern

Reference: ~/work/datacapt/dcagents/work-items/reports-single/requirements.md
Reference: ~/work/datacapt/dcagents/instructions/api-requests.md for response handlers pattern
```

## Phase 3: Components (after Phase 2)

### Task 3.1: Create ReportView Component

**Agent**: react-component-creator

**Prompt**:

```
Create ReportView component in apps/datacapt/src/components/reports/ReportView/

Requirements:
1. Receives reportId from URL params (useParams)
2. Fetch report by ID using fetchReportById from common/requests
3. Display report title in header with back button
4. Show loading skeleton while fetching
5. Handle report not found with appropriate message
6. Render ReportViewTable when report has config, otherwise show "No config" state

Structure:
- ReportView.tsx - main component with data fetching
- ReportView.less - styles (use design system variables)
- index.ts - exports

Props: none (uses URL params)

Use useScopedIntl('reports.view') for translations. Add translations to en.json only.
Check existing patterns in ReportsDashboard for reference.
Use DatacTitle for header, DatacButton for back navigation.

Figma reference: Node 549:10501 - "Inside of the report" states
```

### Task 3.2: Create ReportViewTable Component

**Agent**: react-component-creator

**Prompt**:

```
Create ReportViewTable component in apps/datacapt/src/components/reports/ReportView/ReportViewTable/

Requirements:
1. Use DatacTable from common/components
2. Build columns dynamically from ReportConfig.columns
3. Server-side pagination using usePagination hook
4. Sortable columns with sort indicators (sorter: true for sortable columns)
5. Filters - keep simple for mock, add filter inputs in separate pass if needed
6. Empty state "No results" centered when data is empty

Props:
- config: ReportConfig
- reportId: string

State management:
- Pagination state (limit, offset) via usePagination
- Sort state (field, order) in useState
- Loading state for data fetching

Data fetching:
- Call fetchReportData on mount and when pagination/sort changes
- Pass config, pagination, sort, filters to request
- Handle response via onSuccess/onError handlers

Reference patterns:
- common/components/DatacTable/DatacTable.tsx for column structure
- apps/datacapt/src/components/payments/PaymentsDashboard/PaymentsTableConfig.tsx for getColumns pattern

Column definition pattern:
{
  title: label,
  dataIndex: key,
  key: key,
  width: width || 'auto',
  sorter: sortable,
  render: (value) => value
}

Figma: Node 549:10501 - table states (Empty, Filled, Filled + sort applied)
```

## Phase 4: Integration

### Task 4.1: Add Route and Navigation

**Agent**: Main agent

**Steps**:

1. **Update common/routes/index.ts**:

   - Add `report: (id: string) => \`/reports/${id}\`` route function

2. **Update main router in pages/index.tsx**:

   - Change `path="/reports"` to `path="/reports/*"` to enable nested routes

3. **Update pages/reports/index.tsx**:

   - Add nested Routes like in studies/index.tsx pattern:

   ```tsx
   <Routes>
     <Route element={<ReportView />} path="/:id" />
     <Route element={<ReportsList />} path="/" />
   </Routes>
   ```

   - Import ReportView and ReportsList (renamed)
   - Keep AuthRoute, BasicLayout, SessionTimeoutModal wrapper

4. **Update ReportListItem** to navigate on click:

   - Import routes from common/routes
   - Import useNavigate from react-router
   - Add onClick handler: `navigate(routes.report(report.id))`

5. **Export ReportView from components/reports/index.ts**:
   - Add export { ReportView } from './ReportView'

### Task 4.2: LESS Style Review

**Agent**: less-style-reviewer

Review all new LESS files for compliance with design system.

## Phase 5: Final Validation

### Task 5.1: Main Agent Validation

1. Run TypeScript check
2. Run ESLint
3. Test navigation flow: list → single report → back
4. Verify all states: loading, empty, filled, sorted
5. Check responsive behavior

## Dependency Map

```
Phase 1 (Sequential - must complete before others)
  ↓
Phase 2 (Parallel - both tasks independent)
  ↓
Phase 3 (Parallel - after Phase 2, both tasks can run together)
  ↓
Phase 4 (Sequential - integration)
  ↓
Phase 5 (Validation)
```

## Files to Create/Modify

### New Files

- `apps/datacapt/src/components/reports/ReportView/ReportView.tsx`
- `apps/datacapt/src/components/reports/ReportView/ReportView.less`
- `apps/datacapt/src/components/reports/ReportView/ReportViewTable/ReportViewTable.tsx`
- `apps/datacapt/src/components/reports/ReportView/ReportViewTable/ReportViewTable.less`
- `apps/datacapt/src/components/reports/ReportView/index.ts`

### Modified Files

- `common/requests/reports.ts` - add interfaces, config, fetchReportData, fetchReportById
- `common/intl/en.json` - translations for reports.view namespace
- `common/routes/index.ts` - add report(id) route function
- `apps/datacapt/src/pages/index.tsx` - change /reports to /reports/\*
- `apps/datacapt/src/pages/reports/index.tsx` - add nested Routes for / and /:id
- `apps/datacapt/src/components/reports/ReportsDashboard/` → rename to ReportsList + update BEM classes
- `apps/datacapt/src/components/reports/ReportListItem/ReportListItem.tsx` - add navigation onClick
- `apps/datacapt/src/components/reports/index.ts` - export ReportView

### Moved Files

- `reports/ReportListItem/` → `reports/ReportsList/ReportListItem/`
- `reports/ReportListSkeleton/` → `reports/ReportsList/ReportListSkeleton/`
