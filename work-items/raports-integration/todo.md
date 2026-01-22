# TODO: Reports Backend Integration

## Phase 1: API Foundation

- [x] **Task 1.1**: TypeScript Interfaces & Enums (api-requests-manager)

  - [ ] Create backend enums (DataSource, Table, FilterType, operators)
  - [ ] Create request/response interfaces
  - [ ] Document naming conventions in code comments

- [x] **Task 1.2**: Transform Utilities (api-requests-manager)

  - [ ] Create snake_case → camelCase parsers
  - [ ] Create camelCase → snake_case serializers
  - [ ] Create field name utilities (parse/build table\_\_field)

- [x] **Task 1.3**: Data Source Fields API (api-requests-manager)

  - [ ] Implement fetchDataSourceFields()
  - [ ] Handle request/response transformation
  - [ ] Add error handling

- [x] **Task 1.4**: Reports CRUD API (api-requests-manager)

  - [ ] Implement fetchReports() with pagination/sorting
  - [ ] Implement fetchReportById()
  - [ ] Implement createReport()
  - [ ] Implement updateReport()
  - [ ] Implement patchReport()
  - [ ] Implement deleteReport()

- [x] **Task 1.5**: Report Data API (api-requests-manager)
  - [ ] Implement fetchReportData()
  - [ ] Handle configuration serialization
  - [ ] Handle data response (snake_case fields preserved)

## Phase 2: UI Integration

- [x] **Task 2.1**: ReportsList Integration (react-component-creator)

  - [ ] Replace mock data with fetchReports()
  - [ ] Implement pagination
  - [ ] Implement sorting
  - [ ] Implement search with debouncing
  - [ ] Implement pin/unpin via patchReport()
  - [ ] Implement delete with confirmation
  - [ ] Add loading/error states

- [x] **Task 2.2**: ReportSettings Integration (react-component-creator)

  - [ ] Replace COLUMNS_BY_DATASET with fetchDataSourceFields()
  - [ ] Implement dataset selection flow
  - [ ] Implement save (createReport/updateReport)
  - [ ] Add loading states during field fetch
  - [ ] Add loading during save

- [x] **Task 2.3**: ColumnSelector Dynamic Fields (react-component-creator)

  - [ ] Receive BackendDataSourceFieldsResponse prop
  - [ ] Transform to DatasetColumn format
  - [ ] Show sortable/filterable status from backend
  - [ ] Add loading spinner during fetch

- [x] **Task 2.4**: ReportView Integration (react-component-creator)
  - [ ] Load report config via fetchReportById()
  - [ ] Load report data via fetchReportData()
  - [ ] Implement sorting updates
  - [ ] Implement filter updates
  - [ ] Implement client-side pagination
  - [ ] Add loading/error states

## Phase 3: Finalization

- [x] **Task 3.1**: DatasetSelectionModal Validation (react-component-creator)

  - [ ] Implement ALLOWED_COMBINATIONS validation
  - [ ] Disable invalid dataset options
  - [ ] Show validation error messages
  - [ ] Add tooltips for valid combinations

- [x] **Task 3.2**: Error Messages & Translations (translation-manager)

  - [ ] Add error translation keys (9 languages)
  - [ ] Add success message keys (9 languages)
  - [ ] Verify all languages complete

- [x] **Task 3.3**: Main Agent Integration & Testing (main agent)
  - [ ] Verify all API functions work
  - [ ] Test transformations both directions
  - [ ] Verify error handling consistency
  - [ ] Manual test: Create report
  - [ ] Manual test: List reports (pagination/sorting/search)
  - [ ] Manual test: Edit report
  - [ ] Manual test: Delete report
  - [ ] Manual test: View report data
  - [ ] Manual test: Pin/unpin
  - [ ] Manual test: Invalid dataset combinations
  - [ ] Manual test: Error scenarios
  - [ ] Performance check: Large datasets
  - [ ] Performance check: Cancel tokens
  - [ ] Performance check: Debouncing
