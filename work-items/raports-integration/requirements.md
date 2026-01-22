# Requirements: Reports Backend Integration

## Task Description

Integrate existing frontend reports UI (mock data) with implemented backend API. Frontend components complete: ReportsList, ReportSettings, ReportView, ColumnSelector. Backend provides full CRUD for reports, dynamic field configuration, data retrieval with filtering/sorting.

## Acceptance Criteria

### Phase 1: API Foundation

1. **Backend API Analysis Complete**

   - All field definitions documented (Payment, PaymentOrder, Subject tables)
   - Request/response structures mapped
   - Filter operators and validation rules understood

2. **TypeScript Interfaces Created**

   - Backend enums: DataSource, Table, FilterType, operators
   - Request/response types for all endpoints
   - Configuration structures matching backend models
   - Transform utilities snake_case ↔ camelCase

3. **Core API Functions Implemented**
   - `fetchDataSourceFields()` - POST /reports/datasources/fields/
   - `fetchReports()` - GET /reports/ with pagination/sorting
   - `fetchReportById()` - GET /reports/{id}/
   - `createReport()` - POST /reports/
   - `updateReport()` - PUT /reports/{id}/
   - `patchReport()` - PATCH /reports/{id}/
   - `deleteReport()` - DELETE /reports/{id}/
   - `fetchReportData()` - POST /reports/data/down/

### Phase 2: UI Integration

4. **ReportsList Connected**

   - Loads reports from backend API
   - Pagination working
   - Sorting implemented (newest, oldest, name A-Z/Z-A, recently modified)
   - Search functionality
   - Pin/unpin reports (PATCH is_pinned)
   - Delete reports with confirmation

5. **ReportSettings Connected**

   - Dataset selection triggers `fetchDataSourceFields()`
   - Available columns loaded dynamically from backend
   - Save report calls `createReport()` or `updateReport()`
   - Field configuration (sortable, filterable) from backend
   - Validation for dataset combinations

6. **ReportView Connected**

   - Loads report configuration via `fetchReportById()`
   - Fetches data via `fetchReportData()`
   - Pagination for data
   - Sorting updates and refetches
   - Filter updates and refetches

7. **ColumnSelector Enhanced**
   - Dynamically loads available columns based on selected datasets
   - Shows sortable/filterable status from backend config
   - Loading states during field fetching

### Phase 3: Finalization

8. **DatasetSelectionModal Validation**

   - Enforces valid dataset combinations per backend rules
   - Shows error for invalid combinations
   - Uses MAIN_TO_ADDITIONAL_DATA_SOURCES_MAP logic

9. **Error Handling & Translations**

   - Error messages translated (de, es, it, ja, pt, zh, pl, en, fr)
   - User-friendly error display
   - Network error handling

10. **Manual Testing Complete**
    - Create report with various configurations
    - Edit existing report
    - Delete report
    - List with sorting/filtering
    - View report data with filters
    - Pin/unpin functionality

## Naming Convention

**CRITICAL**: Follow backend naming with snake_case → camelCase conversion

### Rules:

- **API requests/responses**: snake_case (is_pinned, main_data_source, payment_date)
- **TypeScript interfaces**: camelCase properties (isPinned, mainDataSource, firstName)
- **Field names in data**: snake_case from backend (payment_date, created_at - no conversion)
- **Transformers**: Handle snake_case ↔ camelCase conversion

### Examples:

- Backend: `is_pinned` → Frontend: `isPinned` ✅ (not `isFavorite`)
- Backend: `first_name` → Frontend: `firstName` ✅
- Backend: `main_data_source` → Frontend: `mainDataSource` ✅
- Backend field: `payment_date` → stays `payment_date` in data ✅

## Backend API Endpoints

### Reports CRUD

- **GET /reports/** - List reports (query: search, limit, offset, ordering)
- **GET /reports/{id}/** - Get report details with columns, ordering, filters
- **POST /reports/** - Create report
- **PUT /reports/{id}/** - Update report (full)
- **PATCH /reports/{id}/** - Partial update (name, is_pinned)
- **DELETE /reports/{id}/** - Delete report

### Data Sources & Fields

- **POST /reports/datasources/fields/** - Get available fields for selected data sources
  - Request: `{data_sources: ["PAYMENTS", "SUBJECTS"]}`
  - Response: `{[table]: {[field]: {sortable: bool, filter_type: str, filter_options: []}}}`

### Report Data

- **POST /reports/data/down/** - Execute report query
  - Request: Report configuration (columns, ordering, filters, data sources)
  - Response: `{data: [{field_name: value, ...}]}`
  - Note: No pagination in backend yet (returns all data)

## Data Structures

### Backend Enums

- **DataSource**: PAYMENTS, PAYMENT_ORDERS, SUBJECTS
- **Table**: payment, payment_order, subject
- **FilterType**: DATE, CHOICES, NUMBER
- **Operators**: AFTER, BEFORE (date), EQUAL, GREATER, LOWER (number)

### Report Configuration

```typescript
{
  mainDataSource: 'PAYMENTS',
  additionalDataSources: ['SUBJECTS'],
  columns: [{table: 'payment', field: 'payment_date'}, ...],
  ordering: {table: 'payment', field: 'created_at', order: 'DESC'},
  filters: [{table: 'payment', field: 'status', operator: 'EQUAL', selections: ['PAID']}]
}
```

### Field Configuration Response

```typescript
{
  payment: {
    payment_date: {
      sortable: true,
      filter_type: 'DATE',
      filter_options: null
    },
    status: {
      sortable: true,
      filter_type: 'CHOICES',
      filter_options: [{value: 'PAID', display_name: 'Paid'}, ...]
    }
  }
}
```

## Component Hierarchy

```
/reports (page)
├── ReportsList
│   ├── ReportListItem (multiple)
│   └── ReportListSkeleton
│
├── ReportSettings
│   ├── DatasetSelectionModal
│   ├── ColumnSelector
│   │   ├── ColumnSidebar
│   │   ├── SelectedColumnsPanel
│   │   └── ReportPreview
│   │       └── ActiveFilters
│   ├── ReportSortButton
│   └── ReportSortPopover
│
└── ReportView
    ├── ReportViewTable
    │   └── ColumnHeaderWithSortPopover
    └── ReportsDataTable
```

## Backend Analysis Reference

Complete backend API analysis available at:
`/Users/bartek/work/datacapt/dcagents/work-items/raports-integration/backend-api-analysis.md`

Key findings:

- Payment table: 9 fields configured
- PaymentOrder table: 15 fields configured
- Subject table: Only 2 fields (incomplete - backend TODO)
- PaymentStatus for orders: Limited to PROCESSING, ERROR, PAID
- No pagination in data endpoint yet
- Filter selections must be non-empty arrays
- Field names returned as `{table}__{field}` format requiring parsing

## Integration Patterns

Reference existing patterns from:

- `common/requests/fetchApi.ts` - Base fetch utilities, error handling
- `common/requests/visits.ts` - Pagination, filtering, search patterns
- `common/requests/inclusions.ts` - Remote/local type parsing, snake_case conversion

Common patterns:

- Response handlers: `{onSuccess, onRequestError, onNotFound}`
- Error handling via `createErrorsHandlers()`
- Query params: `{limit, offset, search, expand, filters}`
- Transform functions: `parseRemote*()` for snake_case → camelCase
- Cancel tokens: Return `cancel` function from API calls

## Known Limitations

1. **Backend Subject Table Incomplete**: Only id, datacapt_id configured (16 fields defined but not in TABLE_FIELDS_CONFIG)
2. **No Pagination in Data Endpoint**: `/reports/data/down/` returns all data - may need virtualization
3. **Backend Changes Expected**: API may evolve, design for adaptability
4. **Filter Selections Validation**: Must be non-empty, DATE/NUMBER use index 0, CHOICES use full array

## Dependencies

- Existing UI components (no modifications to layout/styling required)
- Backend API at configured backend URL
- fetchApi utility for all HTTP requests
- Existing error handling patterns
