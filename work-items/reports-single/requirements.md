# Reports Single View - Requirements

## Task Description

Implement single report view with dynamic table built from report configuration.

## Acceptance Criteria

1. **Refactoring**: Rename ReportsDashboard → ReportsList, move ReportListItem and ReportListSkeleton inside ReportsList folder
2. **Report Config**: Extend Report interface with config (columns, filters, defaultSort)
3. **ReportView Component**: New component at `/reports/:id` displaying dynamic table
4. **Mock Backend**: Create mock endpoint returning table data based on config
5. **Dynamic Table**: Build DatacTable columns from config
6. **Filters in Headers**: Column header filters as shown in Figma
7. **Empty State**: "No results" placeholder when no data

## Figma

- Node: 549:10501
- File: GLOBAL-functions--reports--settings
- Shows 4 states: Empty, Filled, Filled + no filters, Filled + sort applied

## Interfaces

### Extended Report Interface

```typescript
export interface ReportConfig {
  columns: ReportColumn[];
  filters: ReportFilter[];
  defaultSort?: {
    field: string;
    order: "asc" | "desc";
  };
}

export interface ReportColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

export interface ReportFilter {
  field: string;
  type: "select" | "date" | "text";
  options?: { value: string; label: string }[];
}

export interface Report {
  // existing fields...
  config?: ReportConfig;
}
```

### Report Data Request

```typescript
export interface FetchReportDataOptions {
  reportId: string;
  config: ReportConfig;
  pagination: {
    limit: number;
    offset: number;
  };
  sort?: {
    field: string;
    order: "asc" | "desc";
  };
  filters?: Record<string, unknown>;
}

export interface FetchReportDataResponse {
  data: Record<string, unknown>[];
  totalCount: number;
}
```

## Component Hierarchy

```
reports/
├── ReportsList/                    # renamed from ReportsDashboard
│   ├── ReportsList.tsx
│   ├── ReportsList.less
│   ├── ReportListItem/            # moved inside
│   │   ├── ReportListItem.tsx
│   │   └── ReportListItem.less
│   ├── ReportListSkeleton/        # moved inside
│   │   ├── ReportListSkeleton.tsx
│   │   └── ReportListSkeleton.less
│   └── index.ts
├── ReportView/                     # NEW
│   ├── ReportView.tsx
│   ├── ReportView.less
│   ├── ReportViewTable/
│   │   ├── ReportViewTable.tsx
│   │   └── ReportViewTable.less
│   └── index.ts
└── index.ts
```

## Routing

- `/reports` - ReportsList (existing)
- `/reports/:id` - ReportView (new)

## Backend Endpoint (Mock)

```typescript
// POST /reports/{id}/data
// Body: { config, pagination, sort, filters }
// Response: { data: [], totalCount: number }
```

## Technical Notes

- Use DatacTable with server-side pagination
- Follow PaymentsTableConfig pattern for column definitions
- Filters rendered in column headers (not separate filter bar)
- Empty state with centered "No results" message
