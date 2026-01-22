# Backend Reports API - Integration Analysis

## Overview

Django REST Framework API for clinical trials reports featuring dynamic report configuration, multiple data sources, filtering, sorting, and column selection.

---

## Data Sources and Tables

### DataSource Enum
```python
PAYMENTS = "PAYMENTS"
PAYMENT_ORDERS = "PAYMENT_ORDERS"
SUBJECTS = "SUBJECTS"
```

### Table Enum
```python
PAYMENT = "payment"
PAYMENT_ORDER = "payment_order"
SUBJECT = "subject"
```

### DataSource to Table Mapping

```python
DATA_SOURCE_TABLES = {
    DataSource.PAYMENTS: (Table.PAYMENT,),
    DataSource.PAYMENT_ORDERS: (Table.PAYMENT_ORDER,),
    DataSource.SUBJECTS: (Table.SUBJECT,),
}
```

### Main to Additional DataSources Relationships

```python
MAIN_TO_ADDITIONAL_DATA_SOURCES_MAP = {
    DataSource.PAYMENTS: (DataSource.PAYMENT_ORDERS, DataSource.SUBJECTS),
    DataSource.PAYMENT_ORDERS: (DataSource.PAYMENTS, DataSource.SUBJECTS),
    DataSource.SUBJECTS: (DataSource.PAYMENTS, DataSource.PAYMENT_ORDERS),
}
```

**Integration Note**: When selecting main data source, additional data sources are constrained by this map. Validate frontend selections against allowed combinations.

---

## Field Definitions by Table

### Payment Table Fields

| Field Name | Python Value | Sortable | Filter Type | Filter Options |
|-----------|--------------|----------|-------------|----------------|
| ID | `id` | ✓ | None | - |
| STATUS | `status` | ✓ | CHOICES | PaymentStatus.items() |
| AMOUNT | `amount` | ✓ | NUMBER | - |
| CURRENCY | `currency` | ✓ | None | - |
| PAYMENT_DATE | `payment_date` | ✓ | DATE | - |
| TAX | `tax` | ✓ | NUMBER | - |
| COMMENT | `comment` | ✓ | None | - |
| CREATED_AT | `created_at` | ✓ | DATE | - |
| MODIFIED_AT | `modified_at` | ✓ | DATE | - |

**PaymentStatus Options** (all statuses):
- `PENDING`, `CANCELLED`, `APPROVED`, `PROCESSING`, `ERROR`, `PAID`, `REJECTED`

### Payment Order Table Fields

| Field Name | Python Value | Sortable | Filter Type | Filter Options |
|-----------|--------------|----------|-------------|----------------|
| ID | `id` | ✓ | None | - |
| CENTER_ABBREVIATION | `center_abbreviation` | ✓ | None | - |
| CENTER_NAME | `center_name` | ✓ | None | - |
| RECRUITMENT_REFERENCE | `recruitment_reference` | ✓ | None | - |
| SUBJECT_FULL_NAME | `subject_full_name` | ✓ | None | - |
| CURRENCY | `currency` | ✓ | None | - |
| AMOUNT | `amount` | ✓ | NUMBER | - |
| STATUS | `status` | ✓ | CHOICES | PaymentStatus.items_for_orders() |
| STATUS_DETAILS | `status_details` | ✓ | None | - |
| PAYMENT_DATE | `payment_date` | ✓ | DATE | - |
| COUNTRY_CODE | `country_code` | ✓ | None | - |
| SWIFT | `swift` | ✓ | None | - |
| ACCOUNT_NUMBER | `account_number` | ✓ | None | - |
| ACCOUNT_BENEFICIARY | `account_beneficiary` | ✓ | None | - |
| CREATED_AT | `created_at` | ✓ | DATE | - |
| MODIFIED_AT | `modified_at` | ✓ | DATE | - |

**PaymentStatus Options for Orders** (limited set):
- `PROCESSING`, `ERROR`, `PAID`

**TODO Note**: Line 208 in enums.py indicates filtering by center is planned but not yet implemented.

### Subject Table Fields

| Field Name | Python Value | Sortable | Filter Type | Filter Options |
|-----------|--------------|----------|-------------|----------------|
| ID | `id` | ✓ | None | - |
| DATACAPT_ID | `datacapt_id` | ✓ | None | - |

**TODO Note**: Line 154 in enums.py - Subject table configuration incomplete, only 2 fields configured.

---

## Filter System

### FilterType Enum
```python
DATE = "DATE"
CHOICES = "CHOICES"
NUMBER = "NUMBER"
```

### Filter Operators by Type

#### DATE Filters
```python
AFTER = "AFTER"   # Django: field__gt
BEFORE = "BEFORE" # Django: field__lt
```

**TypeScript Interface**:
```typescript
enum DateFilterOperator {
  AFTER = "AFTER",
  BEFORE = "BEFORE"
}
```

#### NUMBER Filters
```python
EQUAL = "EQUAL"      # Django: field
GREATER = "GREATER"  # Django: field__gt
LOWER = "LOWER"      # Django: field__lt
```

**TypeScript Interface**:
```typescript
enum NumberFilterOperator {
  EQUAL = "EQUAL",
  GREATER = "GREATER",
  LOWER = "LOWER"
}
```

#### CHOICES Filters
```python
EQUAL = "EQUAL"          # Django: field__in
NOT_EQUAL = "NOT_EQUAL"  # Django: exclude field__in
```

**TypeScript Interface**:
```typescript
enum BooleanFilterOperator {
  EQUAL = "EQUAL",
  NOT_EQUAL = "NOT_EQUAL"
}
```

**Backend Implementation**:
- DATE: selections[0] is single date string (ISO format)
- NUMBER: selections[0] is single number
- CHOICES: selections is array of values (strings or ints)

---

## Sort Order

```python
ASC = "ASC"
DESC = "DESC"
```

**TypeScript**:
```typescript
enum SortOrder {
  ASC = "ASC",
  DESC = "DESC"
}
```

---

## API Endpoints

Base URL: `/reports/`

### 1. List Reports
**Endpoint**: `GET /reports/`  
**Permissions**: `REPORTS_ACCESS`

**Response**: `ReportListSerializer`
```python
{
  "id": number,
  "name": string,
  "created_by": {
    "first_name": string,
    "last_name": string
  },
  "is_pinned": boolean,
  "created_at": string,  # ISO datetime
  "modified_at": string  # ISO datetime
}[]
```

**TypeScript Interface**:
```typescript
interface ReportListItem {
  id: number;
  name: string;
  created_by: {
    first_name: string;
    last_name: string;
  };
  is_pinned: boolean;
  created_at: string;
  modified_at: string;
}
```

**Ordering**: `-is_pinned, created_at` (pinned first, then by creation date)

---

### 2. Get Report Details
**Endpoint**: `GET /reports/{id}/`  
**Permissions**: `REPORTS_ACCESS`

**Response**: `ReportSerializer`
```python
{
  "id": number,
  "name": string,
  "is_pinned": boolean,
  "main_data_source": DataSource,
  "additional_data_sources": DataSource[],
  "columns": [
    {
      "table": Table,
      "field": string
    }
  ],
  "ordering": {
    "table": Table,
    "field": string,
    "order": SortOrder
  } | null,
  "filters": [
    {
      "table": Table,
      "field": string,
      "operator": string,
      "selections": (string | number)[]
    }
  ],
  "created_by": {
    "first_name": string,
    "last_name": string
  } | null,
  "created_at": string,
  "modified_at": string
}
```

**TypeScript Interface**:
```typescript
interface FieldConfig {
  table: Table;
  field: string;
}

interface OrderFieldConfig extends FieldConfig {
  order: SortOrder;
}

interface FilterFieldConfig extends FieldConfig {
  operator: string;
  selections: (string | number)[];
}

interface Report {
  id: number;
  name: string;
  is_pinned: boolean;
  main_data_source: DataSource;
  additional_data_sources: DataSource[];
  columns: FieldConfig[];
  ordering: OrderFieldConfig | null;
  filters: FilterFieldConfig[];
  created_by: {
    first_name: string;
    last_name: string;
  } | null;
  created_at: string;
  modified_at: string;
}
```

**Error**: `REPORT_NOT_EXISTS` (404)

---

### 3. Create Report
**Endpoint**: `POST /reports/`  
**Permissions**: `REPORTS_EDIT`

**Request**: `ReportSerializer`
```python
{
  "name": string,                        # max_length=250
  "is_pinned": boolean,                  # optional, default=false
  "main_data_source": DataSource,
  "additional_data_sources": DataSource[], # optional, default=[]
  "columns": [                           # required, min 1
    {
      "table": Table,
      "field": string
    }
  ],
  "ordering": {                          # optional
    "table": Table,
    "field": string,
    "order": SortOrder
  },
  "filters": [                           # optional
    {
      "table": Table,
      "field": string,
      "operator": string,
      "selections": (string | number)[]  # required, non-empty
    }
  ]
}
```

**Response**: Same as Get Report Details

**Behavior**:
- `created_by` automatically set to `request.user`
- Creates related `Column` objects (bulk_create)
- Creates optional `OrderField` object

---

### 4. Update Report (Full)
**Endpoint**: `PUT /reports/{id}/`  
**Permissions**: `REPORTS_EDIT`

**Request**: Same as Create Report

**Response**: Same as Get Report Details

**Behavior**:
- Deletes all existing `Column` and `OrderField` objects
- Recreates with new configuration
- Updates main report fields

---

### 5. Update Report (Partial)
**Endpoint**: `PATCH /reports/{id}/`  
**Permissions**: `REPORTS_EDIT`

**Request**: `ReportPatchSerializer`
```python
{
  "name": string,      # optional
  "is_pinned": boolean # optional
}
```

**Response**: `ReportPatchSerializer`
```python
{
  "id": number,
  "name": string,
  "is_pinned": boolean,
  "created_by": {...} | null,
  "created_at": string,
  "modified_at": string
}
```

**Use Case**: Quick updates for name/pinned status without full configuration

---

### 6. Delete Report
**Endpoint**: `DELETE /reports/{id}/`  
**Permissions**: `REPORTS_EDIT`

**Response**: `204 No Content`

**Behavior**: Cascade deletes all related `Column` and `OrderField` objects

---

### 7. Get Fields for Data Sources
**Endpoint**: `POST /reports/datasources/fields/`  
**Permissions**: `REPORTS_ACCESS`

**Request**: `DataSourcesSerializer`
```python
{
  "data_sources": DataSource[]  # required, min 1
}
```

**Response**:
```python
{
  "status": "success",
  "data": {
    "payment": {
      "id": {
        "sortable": true,
        "filter_type": null
      },
      "status": {
        "sortable": true,
        "filter_type": "CHOICES",
        "filter_options": [
          ["PENDING", "PENDING"],
          ["CANCELLED", "CANCELLED"],
          ...
        ]
      },
      ...
    },
    "payment_order": {...},
    "subject": {...}
  }
}
```

**TypeScript Interface**:
```typescript
interface FieldMetadata {
  sortable: boolean;
  filter_type: FilterType | null;
  filter_options?: [string, string][];  // [value, label] tuples
}

interface DataSourceFieldsResponse {
  status: "success";
  data: {
    [table: string]: {
      [field: string]: FieldMetadata;
    };
  };
}
```

**Use Case**: Dynamic UI generation - fetch available fields and their capabilities for selected data sources

---

### 8. Get Report Data (Execute Query)
**Endpoint**: `POST /reports/data/down/`  
**Permissions**: `REPORTS_ACCESS`

**Request**: `ReportConfigurationSerializer` (same as Create Report without `name`, `is_pinned`)
```python
{
  "main_data_source": DataSource,
  "additional_data_sources": DataSource[],
  "columns": FieldConfig[],
  "ordering": OrderFieldConfig,  # optional
  "filters": FilterFieldConfig[] # optional
}
```

**Response**:
```python
{
  "data": [
    {
      "payment__id": 123,
      "payment__status": "PAID",
      "payment__amount": 1500.00,
      "payment_order__center_name": "Medical Center A",
      ...
    },
    ...
  ]
}
```

**Field Naming Convention**: `{table}__{field}`
- Main table fields: `payment__id`, `payment__status`
- Related table fields: `payment_order__center_name`, `subject__datacapt_id`

**TypeScript Interface**:
```typescript
interface ReportDataRow {
  [key: string]: string | number | boolean | null;
}

interface ReportDataResponse {
  data: ReportDataRow[];
}
```

**Use Case**: 
1. Preview report data without saving
2. Execute saved report configuration
3. Export functionality

---

## Database Relationships (Query Joins)

### Payment (Main Data Source)
```python
RELATIONS = {
    Table.PAYMENT_ORDER: {"prefix": "orders__"},
    Table.SUBJECT: {"prefix": "recruitment_record__subject__"},
}
```

**Django ORM Path**:
- Payment → PaymentOrder: `payment.orders`
- Payment → Subject: `payment.recruitment_record.subject`

---

### Payment Order (Main Data Source)
```python
RELATIONS = {
    Table.PAYMENT: {"prefix": "payment__"},
    Table.SUBJECT: {"prefix": "payment__recruitment_record__subject__"},
}
```

**Django ORM Path**:
- PaymentOrder → Payment: `payment_order.payment`
- PaymentOrder → Subject: `payment_order.payment.recruitment_record.subject`

---

### Subject (Main Data Source)
```python
RELATIONS = {
    Table.PAYMENT: {"prefix": "recruitment_records__payment_records__"},
    Table.PAYMENT_ORDER: {"prefix": "recruitment_records__payment_records__orders__"},
}
```

**Django ORM Path**:
- Subject → Payment: `subject.recruitment_records.payment_records`
- Subject → PaymentOrder: `subject.recruitment_records.payment_records.orders`

**Note**: Uses plural relationships (`recruitment_records`, `payment_records`) indicating many-to-many or one-to-many traversal.

---

## Validation Rules

### 1. Field Validation
**Rule**: Field must exist in table's allowed fields  
**Error**: `REPORTS_FIELD_NOT_ALLOWED_FOR_THE_TABLE`  
**Message**: `"The field {field} is invalid for the table {table}"`

**Frontend**: Validate field selection against `ReportConfiguration.TABLE_FIELDS_CONFIG`

---

### 2. Additional Data Source Validation
**Rule**: Additional data sources must be in allowed set for main data source  
**Error**: `REPORTS_ADDITIONAL_DATA_SOURCE_NOT_ALLOWED`  
**Message**: `"Additional data sources: {invalid_sources} cannot be used with the selected main data source"`

**Frontend**: Use `MAIN_TO_ADDITIONAL_DATA_SOURCES_MAP` to constrain multi-select

---

### 3. Table Validation
**Rule**: All column/ordering/filter tables must be available in selected data sources  
**Error**: `REPORTS_TABLE_NOT_ALLOWED_IN_DATA_SOURCES`  
**Message**: `"Tables: {not_allowed_tables} are not available in the selected data sources"`

**Frontend**: Disable table options when not in combined data source tables

---

### 4. Filter Selections Validation
**Rule**: `selections` array must be non-empty  
**Django**: `allow_empty=False` on `ListField`

**Frontend**: Enforce minimum 1 selection for all filter types

---

### 5. Columns Validation
**Rule**: At least one column required  
**Django**: `many=True, required=True` on `FieldSerializer`

**Frontend**: Validate minimum 1 column before submission

---

## Business Logic Constraints

### Report Ordering
- Pinned reports first (`-is_pinned`)
- Then by creation date (`created_at`)
- No pagination configured (returns all results)

### Query Building
- Filters applied before ordering
- Ordering uses `nulls_last=True` (null values at end regardless of ASC/DESC)
- Single ordering field (not multi-level sort)

### Filter Behavior
- Multiple filters applied with AND logic (cumulative)
- CHOICES filter with NOT_EQUAL uses Django `exclude()` instead of `filter()`
- DATE/NUMBER filters use single value from `selections[0]`
- CHOICES filter uses all values in `selections` array

---

## Permissions

### REPORTS_ACCESS
- GET endpoints (list, retrieve)
- POST datasources/fields (read metadata)
- POST data/down (execute queries)

### REPORTS_EDIT
- POST (create)
- PUT (full update)
- PATCH (partial update)
- DELETE

**TypeScript Mapping**:
```typescript
// Assuming ACL system exists
const canViewReports = user.canDo(AclFeature.Reports)(AclAction.Access);
const canEditReports = user.canDo(AclFeature.Reports)(AclAction.Edit);
```

---

## Known Limitations / TODOs

1. **Subject Table Incomplete** (line 154, enums.py)
   - Only 2 fields configured: `id`, `datacapt_id`
   - 16 other fields defined but not in config

2. **Center Filtering Not Implemented** (line 208, enums.py)
   - `center_abbreviation` marked for future filtering logic

3. **Filter Selections Type** (line 45, serializers.py)
   - TODO: Add child parameter to define selection types

4. **Pagination** (line 27, views.py)
   - Currently disabled (`pagination_class = None`)
   - May need implementation for large datasets

5. **Serializer Refactoring** (line 65, serializers.py)
   - TODO: Split validation to separate functions

6. **User Serializer Duplication** (line 127, serializers.py)
   - `SimpleUserSerializer` duplicated in allocation module

---

## Frontend Integration Checklist

### Type Definitions
- [ ] Create enums for DataSource, Table, FilterType, SortOrder
- [ ] Define field enums (PaymentFields, PaymentOrderFields, SubjectFields)
- [ ] Create filter operator enums (Date, Number, Boolean)
- [ ] Define interfaces for Report, FieldConfig, OrderFieldConfig, FilterFieldConfig
- [ ] Create response types for all endpoints

### API Request Functions
- [ ] `getReports()` - list with ordering
- [ ] `getReport(id)` - detail with relations
- [ ] `createReport(data)` - with created_by handling
- [ ] `updateReport(id, data)` - full replace
- [ ] `patchReport(id, data)` - partial update
- [ ] `deleteReport(id)` - with confirmation
- [ ] `getFieldsForDataSources(dataSources)` - metadata
- [ ] `executeReportQuery(config)` - preview/export

### Validation Logic
- [ ] Validate field exists in table's allowed fields
- [ ] Constrain additional data sources by main selection
- [ ] Validate table availability in selected data sources
- [ ] Enforce non-empty filter selections
- [ ] Require minimum 1 column
- [ ] Check sortable flag before allowing ordering
- [ ] Verify filter type before showing operator options

### UI Components
- [ ] Data source selector with cascading additional sources
- [ ] Dynamic field picker based on selected data sources
- [ ] Filter builder with operator selection by type
- [ ] Column configuration with drag-drop ordering
- [ ] Sort direction toggle (ASC/DESC)
- [ ] Report preview with table_field naming
- [ ] Pin/unpin toggle
- [ ] Created by display

### Data Transformation
- [ ] Parse `table__field` response format to column headers
- [ ] Map PaymentStatus values to display labels
- [ ] Format dates from ISO strings
- [ ] Handle null values in query results
- [ ] Transform nested created_by object

### Error Handling
- [ ] Map `REPORT_NOT_EXISTS` to 404 handler
- [ ] Handle `REPORTS_FIELD_NOT_ALLOWED_FOR_THE_TABLE`
- [ ] Handle `REPORTS_ADDITIONAL_DATA_SOURCE_NOT_ALLOWED`
- [ ] Handle `REPORTS_TABLE_NOT_ALLOWED_IN_DATA_SOURCES`
- [ ] Validate filter selections client-side before submit

---

## Example Request/Response Flows

### Flow 1: Create Payment Report with Filtering

**Step 1**: Get available fields
```typescript
POST /reports/datasources/fields/
{
  "data_sources": ["PAYMENTS", "PAYMENT_ORDERS"]
}

Response:
{
  "status": "success",
  "data": {
    "payment": {
      "id": {"sortable": true, "filter_type": null},
      "status": {"sortable": true, "filter_type": "CHOICES", "filter_options": [...]},
      "amount": {"sortable": true, "filter_type": "NUMBER"}
    },
    "payment_order": {...}
  }
}
```

**Step 2**: Create report
```typescript
POST /reports/
{
  "name": "High Value Paid Transactions",
  "is_pinned": false,
  "main_data_source": "PAYMENTS",
  "additional_data_sources": ["PAYMENT_ORDERS"],
  "columns": [
    {"table": "payment", "field": "id"},
    {"table": "payment", "field": "amount"},
    {"table": "payment", "field": "status"},
    {"table": "payment_order", "field": "center_name"}
  ],
  "ordering": {
    "table": "payment",
    "field": "amount",
    "order": "DESC"
  },
  "filters": [
    {
      "table": "payment",
      "field": "status",
      "operator": "EQUAL",
      "selections": ["PAID"]
    },
    {
      "table": "payment",
      "field": "amount",
      "operator": "GREATER",
      "selections": [1000]
    }
  ]
}

Response:
{
  "id": 42,
  "name": "High Value Paid Transactions",
  ...
}
```

**Step 3**: Execute query
```typescript
POST /reports/data/down/
{
  "main_data_source": "PAYMENTS",
  "additional_data_sources": ["PAYMENT_ORDERS"],
  "columns": [...],
  "ordering": {...},
  "filters": [...]
}

Response:
{
  "data": [
    {
      "payment__id": 101,
      "payment__amount": 5000.00,
      "payment__status": "PAID",
      "payment_order__center_name": "Memorial Hospital"
    },
    ...
  ]
}
```

---

### Flow 2: Update Report Name (Partial)

```typescript
PATCH /reports/42/
{
  "name": "High Value Transactions - Updated",
  "is_pinned": true
}

Response:
{
  "id": 42,
  "name": "High Value Transactions - Updated",
  "is_pinned": true,
  "created_by": {...},
  "created_at": "2025-01-15T10:30:00Z",
  "modified_at": "2025-01-16T14:20:00Z"
}
```

---

## TypeScript Starter Types

```typescript
// Enums
export enum DataSource {
  PAYMENTS = "PAYMENTS",
  PAYMENT_ORDERS = "PAYMENT_ORDERS",
  SUBJECTS = "SUBJECTS"
}

export enum Table {
  PAYMENT = "payment",
  PAYMENT_ORDER = "payment_order",
  SUBJECT = "subject"
}

export enum FilterType {
  DATE = "DATE",
  CHOICES = "CHOICES",
  NUMBER = "NUMBER"
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC"
}

export enum PaymentFields {
  ID = "id",
  STATUS = "status",
  AMOUNT = "amount",
  CURRENCY = "currency",
  PAYMENT_DATE = "payment_date",
  TAX = "tax",
  COMMENT = "comment",
  CREATED_AT = "created_at",
  MODIFIED_AT = "modified_at"
}

// Filter Operators
export enum DateFilterOperator {
  AFTER = "AFTER",
  BEFORE = "BEFORE"
}

export enum NumberFilterOperator {
  EQUAL = "EQUAL",
  GREATER = "GREATER",
  LOWER = "LOWER"
}

export enum BooleanFilterOperator {
  EQUAL = "EQUAL",
  NOT_EQUAL = "NOT_EQUAL"
}

// Configuration Structures
export interface FieldConfig {
  table: Table;
  field: string;
}

export interface OrderFieldConfig extends FieldConfig {
  order: SortOrder;
}

export interface FilterFieldConfig extends FieldConfig {
  operator: string;
  selections: (string | number)[];
}

// Report Configuration
export interface ReportConfiguration {
  main_data_source: DataSource;
  additional_data_sources: DataSource[];
  columns: FieldConfig[];
  ordering?: OrderFieldConfig;
  filters?: FilterFieldConfig[];
}

// Report Entity
export interface Report extends ReportConfiguration {
  id: number;
  name: string;
  is_pinned: boolean;
  created_by: {
    first_name: string;
    last_name: string;
  } | null;
  created_at: string;
  modified_at: string;
}

// List Item (simplified)
export interface ReportListItem {
  id: number;
  name: string;
  created_by: {
    first_name: string;
    last_name: string;
  };
  is_pinned: boolean;
  created_at: string;
  modified_at: string;
}

// Field Metadata
export interface FieldMetadata {
  sortable: boolean;
  filter_type: FilterType | null;
  filter_options?: [string, string][];
}

export interface DataSourceFieldsResponse {
  status: "success";
  data: {
    [table: string]: {
      [field: string]: FieldMetadata;
    };
  };
}

// Query Result
export interface ReportDataRow {
  [key: string]: string | number | boolean | null;
}

export interface ReportDataResponse {
  data: ReportDataRow[];
}

// Request Types
export interface CreateReportRequest extends ReportConfiguration {
  name: string;
  is_pinned?: boolean;
}

export interface UpdateReportRequest extends CreateReportRequest {}

export interface PatchReportRequest {
  name?: string;
  is_pinned?: boolean;
}

// Constants
export const MAIN_TO_ADDITIONAL_DATA_SOURCES: Record<DataSource, DataSource[]> = {
  [DataSource.PAYMENTS]: [DataSource.PAYMENT_ORDERS, DataSource.SUBJECTS],
  [DataSource.PAYMENT_ORDERS]: [DataSource.PAYMENTS, DataSource.SUBJECTS],
  [DataSource.SUBJECTS]: [DataSource.PAYMENTS, DataSource.PAYMENT_ORDERS]
};

export const DATA_SOURCE_TABLES: Record<DataSource, Table[]> = {
  [DataSource.PAYMENTS]: [Table.PAYMENT],
  [DataSource.PAYMENT_ORDERS]: [Table.PAYMENT_ORDER],
  [DataSource.SUBJECTS]: [Table.SUBJECT]
};
```

---

## Key Integration Insights

1. **Dynamic Field Discovery**: Use `/datasources/fields/` endpoint to build UI dynamically instead of hardcoding field lists

2. **Two-Phase Workflow**: 
   - Configuration phase (create/update report)
   - Execution phase (get report data)

3. **Field Naming**: Backend returns `table__field` format - parse for display

4. **Validation Client-Side**: Most validation rules can be enforced before API call using configuration maps

5. **Permissions**: Two-tier access (view vs edit) - adjust UI accordingly

6. **Incomplete Subject Support**: Only 2 subject fields configured - may need backend work before full subject reporting

7. **No Pagination**: Current implementation returns all rows - consider client-side virtualization for large datasets

8. **Filter Logic**: Multiple filters are AND-combined, CHOICES filters support multi-select

9. **Null Handling**: Ordering pushes nulls to end regardless of sort direction

10. **Cascade Deletes**: Deleting report removes all columns/ordering configuration automatically
