# Report Settings - Implementation Plan

## Execution: All tasks SEQUENTIAL (agent-instructions requirement)

---

## Task 1: API & Interfaces

**Agent:** api-requests-manager

Add to `common/requests/reports.ts`:

- `DatasetType` type
- `Dataset`, `DatasetColumn` interfaces
- `ReportSettingsState` interface
- Mock data constants (DATASETS, COLUMNS_BY_DATASET)
- `fetchDatasetColumns()` mock function (returns `{ cancel }`)
- `createReport()` mock function (returns `{ cancel }`)

---

## Task 2: DatasetItem Component

**Agent:** react-component-creator

Create `ReportSettings/DatasetItem/`:

- Icon + label + checkbox layout
- "Main dataset" badge state
- Disabled state for main dataset
- Selected/hover states
- Add required en.json translations

---

## Task 3: DatasetSelectionModal

**Agent:** react-component-creator

Create `ReportSettings/DatasetSelectionModal/`:

- Step 1: Dropdown for main dataset selection
- Step 2: List with DatasetItem components
- Handle step transitions
- Use DatacModal, DatacSelect, DatacButton
- Add required en.json translations

**Figma references:**

- Step 1: node-id=549-6349
- Step 2: node-id=549-6450

---

## Task 4: ColumnSelector Shell + Panels

**Agent:** react-component-creator

Create `ReportSettings/ColumnSelector/` with all panels:

- Full-screen DatacModal structure
- Header with Go back, title, Save report buttons
- ColumnSidebar (left): datasets info, search, column list
- SelectedColumnsPanel (center): tabs, selected columns, add sort
- ReportPreview (right): editable title, preview placeholder
- Add required en.json translations

**Figma reference:** node-id=549-6682

---

## Task 5: Main Orchestrator

**Agent:** Main agent

Create `ReportSettings/ReportSettings.tsx`:

- State management for entire flow
- Modal visibility states
- Step transitions
- Wire all child components
- Export from reports/index.ts

---

## Task 6: Integration with ReportsList

**Agent:** Main agent

- Add "Add report" button handler in ReportsList
- Open ReportSettings modal on click
- Handle report creation callback

---

## Task 7: LESS Review

**Agent:** less-style-reviewer

Review all created LESS files for:

- Design system compliance
- BEM naming
- Token usage

---

## Task 8: Translations

**Agent:** translation-manager

Translate all new en.json keys to other languages:

- de.json, es.json, it.json, ja.json, pl.json, pt.json, zh.json
- fr.json gets English copy

---

## Execution Order

```
Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7 → Task 8
```

## Validation Checklist

- [ ] All TypeScript interfaces properly typed
- [ ] Translations only in en.json
- [ ] LESS uses design system tokens
- [ ] Components follow BEM naming
- [ ] DatacModal fullScreen used for ColumnSelector
- [ ] Mock data matches Figma column names
- [ ] No hardcoded strings
- [ ] Proper exports in index.ts files
