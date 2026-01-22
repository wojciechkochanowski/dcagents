---
name: tables
description: "Guidelines for implementing tables in Datacapt frontend using the DatacTable component. Use this skill when building table interfaces to ensure consistent pagination setup, column definitions, and data fetching patterns."
---

# DatacTable Component Guidelines

## Component Selection

**Always use DatacTable** for any tabular data display. Never use raw Ant Design Table.

Location: `common/components/DatacTable`

## Basic Usage Pattern

```tsx
import { DatacTable } from "common/components";

<DatacTable
  className="component-name__table"
  columns={columns}
  dataSource={data}
  loading={false}
  pagination={{
    current: currentPage,
    onChange: onPageChange,
    total: totalCount,
    pageSize,
  }}
  setPageSize={(size) => {
    setPageSize(size);
    setCurrentPage(1);
  }}
  hideSelectionColumn
/>;
```

## Minimum Width (Horizontal Scroll)

For tables with many columns, prevent name column disappearing on narrow screens:

```tsx
<DatacTable scroll={{ x: 1100 }} ... />
```

Set `x` to sum of fixed column widths (typically 900-1200px). Table scrolls horizontally when viewport narrower than `x`.

## Critical: Pagination Setup

**setPageSize must be a separate prop** - NOT inside pagination object.

```tsx
// CORRECT
<DatacTable
  pagination={{
    current: currentPage,
    onChange: onPageChange,
    total: totalCount,
    pageSize,
  }}
  setPageSize={size => {
    setPageSize(size)
    setCurrentPage(1)
  }}
/>

// WRONG - pagination won't show page size selector
<DatacTable
  pagination={{
    current: currentPage,
    onChange: onPageChange,
    total: totalCount,
    pageSize,
    showSizeChanger: true,  // This doesn't work!
    onShowSizeChange: (_, size) => setPageSize(size),
  }}
/>
```

## Column Definition (Standard Pattern)

Columns are typically defined as static arrays, often in a separate `*TableConfig.tsx` file:

```tsx
// ComponentTableConfig.tsx
import { DatacTooltip, renderDateWithAuthor } from "common/components";

const renderStatus = (status: Status) => <StatusTag status={status} />;

const renderId = (id: string) => (
  <DatacTooltip title={id}>
    <span className="table__id">{id}</span>
  </DatacTooltip>
);

export const getColumns = (options: ColumnOptions) => [
  {
    title: "ID",
    dataIndex: "name",
    key: "name",
    width: "150px",
    ellipsis: true,
    sorter: true,
    fixed: "left" as ColumnFixedType,
    render: renderId,
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
    ellipsis: true,
    sorter: true,
    // Render with access to full row data
    render: (startDate: Date, { investigator }: RowType) =>
      renderDateWithAuthor(startDate, investigator),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    ellipsis: true,
    render: renderStatus,
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "actions",
    width: "5rem",
    fixed: "right" as ColumnFixedType,
    render: (row: RowType) => <ActionCell {...row} />,
  },
];
```

### Key column properties

- `title`: Column header (string or React element)
- `dataIndex`: Field name in data object
- `key`: Unique identifier
- `width`: Fixed width (e.g., '150px', '5rem')
- `ellipsis`: Truncate overflow text
- `sorter`: Enable sorting (boolean)
- `fixed`: Pin column ('left' or 'right')
- `render`: Custom render function `(value, row) => ReactNode`

### Dynamic columns (special case)

For fully dynamic tables where structure comes from config:

```tsx
const columns = config.columns.map((col) => ({
  title: col.label,
  dataIndex: col.key,
  key: col.key,
  width: col.width || "auto",
  sorter: col.sortable,
  render: (value: unknown) => String(value ?? ""),
}));
```

## Loading State with Skeleton

For skeleton loading in table cells:

```tsx
import { Skeleton } from "antd";

const columns = config.columns.map((col) => ({
  title: col.label,
  dataIndex: col.key,
  key: col.key,
  render: isLoading
    ? () => <Skeleton active paragraph={false} title={{ width: "80%" }} />
    : (value: unknown) => String(value ?? ""),
}));

// Generate skeleton data
const skeletonData = Array.from({ length: pageSize }, (_, index) => ({
  key: `skeleton-${index}`,
  ...Object.fromEntries(columns.map((col) => [col.key, ""])),
}));

const tableData = isLoading ? skeletonData : dataWithKeys;
```

**Important:** Set `loading={false}` on DatacTable when using skeleton approach to avoid double loading indicators.

## Data Fetching Pattern

```tsx
const [data, setData] = useState<DataType[]>([]);
const [totalCount, setTotalCount] = useState(0);
const [isLoading, setIsLoading] = useState(true);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

const offset = (currentPage - 1) * pageSize;

useEffect(() => {
  setIsLoading(true);

  const { cancel } = fetchData(
    {
      pagination: { limit: pageSize, offset },
    },
    {
      onSuccess: (response) => {
        setData(response.data);
        setTotalCount(response.totalCount);
        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      },
    },
  );

  return () => cancel();
}, [offset, pageSize]);
```

## Common Mistakes to Avoid

1. **Missing setPageSize prop** - pagination selector won't appear
2. **Using loading={true}** with skeleton approach - causes double loading
3. **Missing key on data items** - React warnings

## Reference Implementations

**Standard pattern (static columns):**

- `/apps/datacapt/src/components/studies/StudyDetailsContent/StudyInclusionsContent/Inclusions/InclusionsTable/` - full example with TableConfig
- `/apps/datacapt/src/components/SubjectRepository/SubjectRepositoryDashboard/`
- `/apps/datacapt/src/components/payments/PaymentsDashboard/`

**Dynamic columns:**

- `/apps/datacapt/src/components/reports/ReportView/ReportViewTable/ReportViewTable.tsx`
