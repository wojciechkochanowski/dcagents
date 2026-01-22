# Implementation Plan: Reports Backend Integration

## Overview

Sequential integration of reports UI with backend API. Three phases: API foundation, UI integration, finalization. Each sub-agent executes one domain-specific task.

## Phase 1: API Foundation

### Task 1.1: TypeScript Interfaces & Enums

**Agent**: api-requests-manager
**Dependency**: Independent (uses backend-api-analysis.md)

Create TypeScript definitions in `common/requests/reports.ts`:

**Backend Enums**:

```typescript
export enum BackendDataSource {
  PAYMENTS = "PAYMENTS",
  PAYMENT_ORDERS = "PAYMENT_ORDERS",
  SUBJECTS = "SUBJECTS",
}

export enum BackendTable {
  PAYMENT = "payment",
  PAYMENT_ORDER = "payment_order",
  SUBJECT = "subject",
}

export enum BackendFilterType {
  DATE = "DATE",
  CHOICES = "CHOICES",
  NUMBER = "NUMBER",
}

export enum DateFilterOperator {
  AFTER = "AFTER",
  BEFORE = "BEFORE",
}

export enum NumberFilterOperator {
  EQUAL = "EQUAL",
  GREATER = "GREATER",
  LOWER = "LOWER",
}

export enum BackendSortOrder {
  ASC = "ASC",
  DESC = "DESC",
}
```

**Request/Response Interfaces**:

- `BackendFieldConfig` - {sortable, filterType, filterOptions}
- `BackendColumnField` - {table, field}
- `BackendOrderField` - {table, field, order}
- `BackendFilterField` - {table, field, operator, selections}
- `BackendReportConfiguration` - {mainDataSource, additionalDataSources, columns, ordering, filters}
- `BackendReport` - full report object (id, name, isPinned, createdBy, createdAt, modifiedAt, + configuration)
- `BackendReportListItem` - list item (id, name, isPinned, createdBy, createdAt, modifiedAt)
- `BackendDataSourceFieldsRequest` - {dataSources: BackendDataSource[]}
- `BackendDataSourceFieldsResponse` - {[table]: {[field]: BackendFieldConfig}}
- `BackendReportDataRequest` - BackendReportConfiguration
- `BackendReportDataResponse` - {data: Record<string, unknown>[]}

**Naming**: camelCase properties, snake_case field values. Reference backend-api-analysis.md for exact structures.

**Deliverable**: TypeScript types/interfaces/enums in reports.ts

---

### Task 1.2: Transform Utilities

**Agent**: api-requests-manager
**Dependency**: Requires Task 1.1 interfaces

Create transformation functions in `common/requests/reports.ts`:

**snake_case → camelCase** (for responses):

- `parseBackendReport(remote: BackendReportAPI): BackendReport` - converts is_pinned → isPinned, created_by → createdBy, etc.
- `parseBackendReportListItem(remote: BackendReportListItemAPI): BackendReportListItem`
- `parseBackendFieldConfig(remote: {sortable, filter_type, filter_options}): BackendFieldConfig` - filter_type → filterType
- `parseCreatedBy(remote: {first_name, last_name}): {firstName, lastName, initials}`

**camelCase → snake_case** (for requests):

- `serializeReportConfiguration(config: BackendReportConfiguration): object` - converts to backend format
- `serializeColumnField(column: BackendColumnField): {table, field}` - no-op (already matches)
- `serializeOrderField(order: BackendOrderField): {table, field, order}` - no-op
- `serializeFilterField(filter: BackendFilterField): {table, field, operator, selections}` - no-op

**Field name utilities**:

- `parseTableFieldName(combined: string): {table: BackendTable, field: string}` - splits "payment\_\_status" → {table: 'payment', field: 'status'}
- `buildTableFieldName(table: BackendTable, field: string): string` - combines to "payment\_\_status"

**Deliverable**: Transform functions with clear naming pattern

---

### Task 1.3: Data Source Fields API

**Agent**: api-requests-manager
**Dependency**: Requires Tasks 1.1, 1.2

Implement `fetchDataSourceFields()` in `common/requests/reports.ts`:

```typescript
interface FetchDataSourceFieldsOptions {
  dataSources: BackendDataSource[];
}

interface FetchDataSourceFieldsResponseHandlers {
  onSuccess?: (fields: BackendDataSourceFieldsResponse) => void;
  onRequestError?: (code: number) => void;
}

export const fetchDataSourceFields = (
  options: FetchDataSourceFieldsOptions,
  responseHandlers?: FetchDataSourceFieldsResponseHandlers,
) => {
  const body = { data_sources: options.dataSources };
  const { req, cancel } = fetchApi.post<BackendDataSourceFieldsResponseAPI>(
    "reports/datasources/fields",
    body,
  );

  req.then(({ error, body, status }) => {
    if (error) {
      createErrorsHandlers({}, error, responseHandlers, status);
    } else if (responseHandlers?.onSuccess) {
      // Transform filter_type → filterType for each field
      const parsed = parseDataSourceFieldsResponse(body);
      responseHandlers.onSuccess(parsed);
    }
  });

  return cancel;
};
```

**Key points**:

- Request body: `{data_sources: ["PAYMENTS", "SUBJECTS"]}` (snake_case!)
- Response: Transform filter_type → filterType, filter_options → filterOptions
- Error handling via createErrorsHandlers pattern
- Return cancel function directly (not as object: `return cancel` not `return { cancel }`)

**Deliverable**: Working fetchDataSourceFields() with transformation

---

### Task 1.4: Reports CRUD API

**Agent**: api-requests-manager
**Dependency**: Requires Tasks 1.1, 1.2

Implement CRUD functions in `common/requests/reports.ts`:

**List Reports**:

```typescript
interface FetchReportsOptions {
  search?: string;
  sortBy?: ReportSortField;
  limit?: number;
  offset?: number;
}

export const fetchReports = (
  options: FetchReportsOptions,
  responseHandlers?: FetchReportsResponseHandlers,
) => {
  const query = {
    search: options?.search,
    ordering: mapSortFieldToBackend(options?.sortBy),
    limit: options?.limit ?? 10,
    offset: options?.offset ?? 0,
  };
  const { req, cancel } = fetchApi.get<{
    results: BackendReportListItemAPI[];
    count: number;
  }>("reports", query);
  // Transform response, parse each report item
};
```

**Get Report**:

```typescript
export const fetchReportById = (
  reportId: string,
  responseHandlers?: FetchReportByIdResponseHandlers,
) => {
  const { req, cancel } = fetchApi.get<BackendReportAPI>(`reports/${reportId}`);
  // Transform response, parse report with columns/ordering/filters
};
```

**Create Report**:

```typescript
export const createReport = (
  config: BackendReportConfiguration & { name: string },
  responseHandlers?: CreateReportResponseHandlers,
) => {
  const body = {
    name: config.name,
    is_pinned: false,
    main_data_source: config.mainDataSource,
    additional_data_sources: config.additionalDataSources,
    columns: config.columns, // Already in {table, field} format
    ordering: config.ordering,
    filters: config.filters,
  };
  const { req, cancel } = fetchApi.post<BackendReportAPI>("reports", body);
};
```

**Update/Patch/Delete** - similar patterns

**IMPORTANT**: All functions must return `cancel` directly (not `{ cancel }`):

```typescript
return cancel; // ✅ Correct - direct function
// NOT: return { cancel } // ❌ Wrong - object wrapper
```

**Deliverable**: Complete CRUD API functions with transformations

---

### Task 1.5: Report Data API

**Agent**: api-requests-manager
**Dependency**: Requires Tasks 1.1, 1.2

Implement `fetchReportData()` in `common/requests/reports.ts`:

```typescript
interface FetchReportDataOptions {
  configuration: BackendReportConfiguration;
  pagination?: {
    limit: number;
    offset: number;
  };
}

export const fetchReportData = (
  options: FetchReportDataOptions,
  responseHandlers?: FetchReportDataResponseHandlers,
) => {
  const body = {
    main_data_source: options.configuration.mainDataSource,
    additional_data_sources: options.configuration.additionalDataSources,
    columns: options.configuration.columns,
    ordering: options.configuration.ordering,
    filters: options.configuration.filters,
    // Note: Backend doesn't support pagination yet
  };
  const { req, cancel } = fetchApi.post<{ data: Record<string, unknown>[] }>(
    "reports/data/down",
    body,
  );

  req.then(({ error, body, status }) => {
    if (error) {
      createErrorsHandlers({}, error, responseHandlers, status);
    } else if (responseHandlers?.onSuccess) {
      // Field names in data are snake_case - keep as is
      responseHandlers.onSuccess({
        data: body.data,
        totalCount: body.data.length, // No backend count yet
      });
    }
  });

  return cancel;
};
```

**Key points**:

- Request body in snake_case format
- Response data has snake_case field names (payment_date, created_at) - DO NOT transform
- No pagination in backend yet - returns all data
- May need client-side pagination/virtualization

**Deliverable**: Working fetchReportData() handling data retrieval

---

## Phase 2: UI Integration

### Task 2.1: ReportsList Integration

**Agent**: react-component-creator
**Dependency**: Requires Phase 1 complete (API functions available)

Update `apps/datacapt/src/components/reports/ReportsList/ReportsList.tsx`:

**Replace mock data**:

- Remove MOCK_REPORTS constant
- Call `fetchReports()` in useEffect
- Handle loading state during fetch
- Handle error states

**Implement features**:

1. **Pagination**: Pass limit/offset to fetchReports, handle totalCount
2. **Sorting**: Map UI sort selection to backend ordering param
3. **Search**: Pass search term to fetchReports with debouncing
4. **Pin/Unpin**: Call `patchReport(id, {isPinned: !currentValue})`
5. **Delete**: Call `deleteReport(id)` with confirmation modal

**State management**:

```typescript
const [reports, setReports] = useState<BackendReportListItem[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [totalCount, setTotalCount] = useState(0)
const [currentPage, setCurrentPage] = useState(0)
const [sortBy, setSortBy] = useState<ReportSortField>(...)
const [search, setSearch] = useState('')
```

**Error handling**: Display user-friendly messages for network errors, not found, etc.

**Deliverable**: ReportsList loading real data with all features working

---

### Task 2.2: ReportSettings Integration

**Agent**: react-component-creator
**Dependency**: Requires Phase 1 complete

Update `apps/datacapt/src/components/reports/ReportSettings/ReportSettings.tsx`:

**Dataset selection flow**:

1. User selects main dataset → call `fetchDataSourceFields([mainDataset])`
2. User adds secondary dataset → call `fetchDataSourceFields([mainDataset, secondaryDataset])`
3. Update available columns based on response

**Remove mock data**:

- Delete COLUMNS_BY_DATASET constant
- Replace with dynamic fields from API

**Save report**:

- Build BackendReportConfiguration from UI state
- Call `createReport()` for new reports
- Call `updateReport()` for editing existing
- Handle success (navigate to report view) and errors

**Loading states**:

- Show skeleton/spinner while fetching fields
- Disable save button during field fetch
- Show loading during report save

**Deliverable**: ReportSettings creating/editing reports via API

---

### Task 2.3: ColumnSelector Dynamic Fields

**Agent**: react-component-creator
**Dependency**: Requires Task 2.2 (integrated with ReportSettings)

Update `apps/datacapt/src/components/reports/ReportSettings/ColumnSelector/ColumnSelector.tsx`:

**Dynamic columns**:

- Receive `BackendDataSourceFieldsResponse` as prop from ReportSettings
- Parse into DatasetColumn format for UI
- Mark columns as sortable/filterable based on backend config

**Transform backend fields to UI format**:

```typescript
const transformToDatasetColumns = (
  fieldsResponse: BackendDataSourceFieldsResponse,
): DatasetColumn[] => {
  const columns: DatasetColumn[] = [];

  Object.entries(fieldsResponse).forEach(([table, fields]) => {
    Object.entries(fields).forEach(([fieldName, config]) => {
      columns.push({
        key: `${table}__${fieldName}`,
        label: formatFieldLabel(fieldName), // payment_date → Payment Date
        dataset: mapTableToDataset(table),
        type: mapFilterTypeToColumnType(config.filterType),
        filterOptions: config.filterOptions
          ? parseFilterOptions(config.filterOptions)
          : undefined,
        sortable: config.sortable,
      });
    });
  });

  return columns;
};
```

**Loading state**:

- Show spinner in column selector while fields are being fetched
- Disable column selection during fetch

**Deliverable**: ColumnSelector displaying dynamic fields from backend

---

### Task 2.4: ReportView Integration

**Agent**: react-component-creator
**Dependency**: Requires Phase 1 complete

Update `apps/datacapt/src/components/reports/ReportView/ReportView.tsx`:

**Load report configuration**:

```typescript
useEffect(() => {
  fetchReportById(reportId, {
    onSuccess: (report) => {
      setReportConfig(report);
      // Then fetch data with this configuration
      loadReportData(report);
    },
    onNotFound: () => navigate("/reports"),
    onRequestError: () => setError("..."),
  });
}, [reportId]);
```

**Load report data**:

```typescript
const loadReportData = (config: BackendReport) => {
  fetchReportData(
    {
      configuration: {
        mainDataSource: config.mainDataSource,
        additionalDataSources: config.additionalDataSources,
        columns: config.columns,
        ordering: config.ordering,
        filters: config.filters,
      },
    },
    {
      onSuccess: ({ data, totalCount }) => {
        setReportData(data);
        setTotalCount(totalCount);
      },
    },
  );
};
```

**Sorting updates**:

- When user clicks column header, update `ordering` in config
- Call `updateReport()` to save new ordering
- Refetch data with new configuration

**Filter updates**:

- When user applies filter, update `filters` in config
- Call `updateReport()` to save filters
- Refetch data

**Pagination**:

- Client-side pagination (backend returns all data)
- May need virtualization for large datasets

**Deliverable**: ReportView displaying real data with sorting/filtering

---

## Phase 3: Finalization

### Task 3.1: DatasetSelectionModal Validation

**Agent**: react-component-creator
**Dependency**: Independent (UI logic only)

Update `apps/datacapt/src/components/reports/ReportSettings/DatasetSelectionModal/DatasetSelectionModal.tsx`:

**Validation rules** (from backend MAIN_TO_ADDITIONAL_DATA_SOURCES_MAP):

- PAYMENTS main → can add PAYMENT_ORDERS or SUBJECTS
- PAYMENT_ORDERS main → can add PAYMENTS or SUBJECTS
- SUBJECTS main → can add PAYMENTS or PAYMENT_ORDERS

**Implementation**:

```typescript
const ALLOWED_COMBINATIONS = {
  [BackendDataSource.PAYMENTS]: [
    BackendDataSource.PAYMENT_ORDERS,
    BackendDataSource.SUBJECTS,
  ],
  [BackendDataSource.PAYMENT_ORDERS]: [
    BackendDataSource.PAYMENTS,
    BackendDataSource.SUBJECTS,
  ],
  [BackendDataSource.SUBJECTS]: [
    BackendDataSource.PAYMENTS,
    BackendDataSource.PAYMENT_ORDERS,
  ],
};

const validateCombination = (
  main: BackendDataSource,
  secondary: BackendDataSource,
) => {
  return ALLOWED_COMBINATIONS[main]?.includes(secondary) ?? false;
};
```

**UI feedback**:

- Disable invalid secondary dataset options
- Show error message if user tries invalid combination
- Tooltip explaining which combinations are valid

**Deliverable**: Validated dataset selection preventing invalid combinations

---

### Task 3.2: Error Messages & Translations

**Agent**: translation-manager
**Dependency**: Requires Phase 2 complete (know all error scenarios)

Add translations in `common/intl/*.json` (all languages: de, es, it, ja, pt, zh, pl, en, fr):

**Error keys**:

```json
{
  "reports.errors.fetchFailed": "Failed to load reports",
  "reports.errors.fetchReportFailed": "Failed to load report details",
  "reports.errors.saveFailed": "Failed to save report",
  "reports.errors.deleteFailed": "Failed to delete report",
  "reports.errors.notFound": "Report not found",
  "reports.errors.invalidDataSource": "Invalid data source combination",
  "reports.errors.invalidField": "Invalid field for selected data source",
  "reports.errors.networkError": "Network error. Please check your connection.",
  "reports.errors.unauthorised": "You don't have permission to access reports"
}
```

**Success messages**:

```json
{
  "reports.success.created": "Report created successfully",
  "reports.success.updated": "Report updated successfully",
  "reports.success.deleted": "Report deleted successfully",
  "reports.success.pinned": "Report pinned",
  "reports.success.unpinned": "Report unpinned"
}
```

**Deliverable**: Translated error/success messages in all 9 languages

---

### Task 3.3: Main Agent Integration & Testing

**Agent**: Main agent (this conversation)
**Dependency**: Requires all previous tasks

**Integration checklist**:

- [ ] All API functions return `cancel` directly (not `{ cancel }`)
- [ ] All API functions return correct types
- [ ] Transformations work both directions (snake_case ↔ camelCase)
- [ ] Error handling consistent across components
- [ ] Loading states displayed appropriately
- [ ] No TypeScript errors (post-edit hook runs prettier/eslint/tsc automatically)

**Manual testing scenarios**:

1. **Create report**: Select datasets, add columns, set filters, save → verify in backend
2. **List reports**: Check pagination, sorting, search work correctly
3. **Edit report**: Load existing, modify, save → verify changes persist
4. **Delete report**: Delete report, verify removed from list
5. **View report data**: Open report, check data loads, sorting/filtering work
6. **Pin/unpin**: Toggle pin, verify persists across page refreshes
7. **Invalid datasets**: Try invalid combination in modal → should be prevented
8. **Error scenarios**: Network offline, invalid report ID, etc. → user-friendly messages

**Performance checks**:

- Large datasets (>100 rows) → virtualization needed?
- Multiple concurrent requests → cancel tokens working?
- Rapid filter changes → debouncing needed?

**Deliverable**: Fully integrated, tested reports feature with backend

---

## Execution Order

**🚨 CRITICAL: Sequential execution ONLY** (one task at a time):

1. Phase 1: Tasks 1.1 → 1.2 → 1.3 → 1.4 → 1.5 (API foundation)
2. Phase 2: Tasks 2.1 → 2.2 → 2.3 → 2.4 (UI integration - STRICTLY SEQUENTIAL)
3. Phase 3: Tasks 3.1 → 3.2 → 3.3 (finalization)

**NEVER execute agents in parallel** - violates `agent-instructions.md` rules.

**Total estimated tasks**: 10 sub-agent tasks + 1 main agent integration

## Key Integration Points

**Between Phase 1 and Phase 2**:

- API functions must be complete and tested before UI integration
- TypeScript interfaces define contract between phases
- Transform utilities critical for data consistency

**Between Phase 2 tasks**:

- ReportSettings and ColumnSelector tightly coupled
- ReportsList and ReportView share pagination patterns
- All components use same error handling pattern

**Between Phase 2 and Phase 3**:

- Translations can be added after UI complete
- Validation can be implemented independently
- Testing happens last with full system

## Notes

**Naming consistency**: Enforce camelCase in TypeScript, snake_case in API calls throughout
**Error handling**: Use createErrorsHandlers pattern from fetchApi.ts
**Backend changes**: Design for adaptability - backend may add pagination, new fields
**Performance**: Monitor data loading - virtualization may be needed for large datasets
**Code quality**: Post-edit hook automatically runs prettier/eslint/tsc - no manual linting needed
**Cancel functions**: All API functions MUST return `cancel` directly (see `api-requests.md:313`)
