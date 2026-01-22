# Report Settings - Requirements

## Task Description

Implement report creation flow with dataset selection and column configuration.

## Acceptance Criteria

1. **Step 1: Main Dataset Selection Modal**

   - Modal with title "Add a new report"
   - Dropdown "Main dataset" with 3 options: Payments, Payment orders, Subjects
   - Cancel and "Create report" buttons
   - Figma: https://www.figma.com/design/jmK0yjytpvkZ7pJoBqep4H/?node-id=549-6349

2. **Step 2: Secondary Dataset Selection**

   - Same modal, shows after main dataset selected
   - List of 3 datasets with icons and checkboxes
   - Main dataset shows "Main dataset" badge and disabled checkbox
   - User can select one additional dataset
   - Figma: https://www.figma.com/design/jmK0yjytpvkZ7pJoBqep4H/?node-id=549-6450

3. **Step 3: Column Selection (Full-screen)**
   - Full-screen modal (DatacModal fullScreen)
   - Header: "Go back" button, "Report creation" title, "Save report" button, "Update data" button
   - Left sidebar:
     - "2 datasets selected" + Edit button
     - Search input "Search in datasets"
     - Dropdown "Browse in: [Dataset]"
     - List of available columns
   - Center panel:
     - Tabs (table/chart/clock icons)
     - "Selected columns" section with placeholder "Select on the left"
     - "+ Add sort" button
   - Right panel:
     - Editable title "Unnamed report"
     - Table preview placeholder: "You will see your report preview here"
   - Figma: https://www.figma.com/design/jmK0yjytpvkZ7pJoBqep4H/?node-id=549-6682

## Technical Requirements

### Interfaces (mock - backend not ready)

```typescript
// Dataset types
export type DatasetType = "payments" | "payment_orders" | "subjects";

export interface Dataset {
  id: DatasetType;
  label: string;
  icon: string; // DatacIcon name
}

// Column definition
export interface DatasetColumn {
  key: string;
  label: string;
  dataset: DatasetType;
}

// Report creation state
export interface ReportSettingsState {
  mainDataset: DatasetType | null;
  secondaryDataset: DatasetType | null;
  selectedColumns: string[];
  reportTitle: string;
}
```

### Mock Data

**Datasets:**

- Payments (icon: payments)
- Payment orders (icon: payment-orders)
- Subjects (icon: subjects)

**Mock columns per dataset:**

Payments:

- Payment order ID, Payment ID, Transaction ID, Center ID, Center abbreviation
- Center name, Recruitment reference, Subject full name, Currency, Amount
- Status, Status details, Payment date, Country code, SWIFT, Account number, Account beneficiary

Payment orders:

- Order ID, Order date, Total amount, Currency, Status
- Created by, Approved by, Center, Payments count

Subjects:

- Subject ID, Full name, Email, Phone, Center
- Recruitment status, Enrollment date, Last visit, Country

### Component Hierarchy

```
ReportSettings/
├── index.ts
├── ReportSettings.tsx                    # Main orchestrator with state
├── ReportSettings.less
├── DatasetSelectionModal/
│   ├── index.ts
│   ├── DatasetSelectionModal.tsx         # Steps 1 & 2
│   └── DatasetSelectionModal.less
├── DatasetItem/
│   ├── index.ts
│   ├── DatasetItem.tsx                   # Single dataset row with icon/checkbox
│   └── DatasetItem.less
└── ColumnSelector/
    ├── index.ts
    ├── ColumnSelector.tsx                # Full-screen modal (step 3)
    ├── ColumnSelector.less
    ├── ColumnSidebar/
    │   ├── index.ts
    │   ├── ColumnSidebar.tsx             # Left panel with column list
    │   └── ColumnSidebar.less
    ├── SelectedColumnsPanel/
    │   ├── index.ts
    │   ├── SelectedColumnsPanel.tsx      # Center panel
    │   └── SelectedColumnsPanel.less
    └── ReportPreview/
        ├── index.ts
        ├── ReportPreview.tsx             # Right panel with preview
        └── ReportPreview.less
```

### API Functions (to add to reports.ts)

```typescript
// Mock function - returns available columns for selected datasets
export const fetchDatasetColumns = (
  datasets: DatasetType[],
  responseHandlers?: FetchDatasetColumnsResponseHandlers
) => { ... }

// Mock function - creates report (returns mock ID)
export const createReport = (
  settings: ReportSettingsState,
  responseHandlers?: CreateReportResponseHandlers
) => { ... }
```

### Existing Patterns to Use

- `DatacModal` with `fullScreen` prop (see AppointmentScheduleSetUp)
- `DatacButton`, `DatacIcon`, `DatacSelect`
- `useScopedIntl` for translations
- Response handlers pattern for API functions

### Translations (en.json only)

Add under `reports.settings.*` namespace.

## Out of Scope

- Edit report functionality (later task)
- Actual data preview in table
- Filters configuration
- Chart/time tabs functionality
- Backend integration
