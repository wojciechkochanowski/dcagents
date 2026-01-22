# 18067: Declare a Kit as Invalid - Implementation Plan

## Overview
Implementacja funkcjonalności "declare kit invalid" bazująca na istniejącym wzorcu "undo allocation". Zadanie podzielone na równoległe podzadania dla maksymalnej efektywności.

## Sub-agent Task Breakdown

### Task 1: API Request Function [api-requests-manager]
**Location:** `~/work/datacapt/frontend/common/requests/subjects/subjectsInApp.ts`

**Scope:**
- Dodać funkcję `declareKitInvalid` wzorując się na `undoAllocationSubject` (linie 950-989)
- Interface `DeclareKitInvalidOptions` z wymaganym polem `reason`
- PUT request do endpoint `/api/allocation/kits/{allocationId}/invalidate`
- Error handling pattern (`STUDY_RANDOMISATION_ALLOCATION_ERROR` -> `onAllocationNotFound`)
- Response handlers pattern (onSuccess, onRequestError, onAllocationNotFound)

**References:**
- Wzorzec: `subjectsInApp.ts:950-989` (`undoAllocationSubject`)
- Typ: `UndoAllocationOptions` interface

### Task 2: Modal Component [react-component-creator]  
**Location:** `~/work/datacapt/frontend/apps/datacapt/src/components/shared/Fulfillment/DeclareInvalidModal/`

**Scope:**
- Stworzyć `DeclareInvalidModal.tsx` wzorując się na `UndoAllocationModal`
- Props: `isOpened`, `onClose`, `onConfirm`, `allocation`, `loading`
- Form z wymaganym polem `reason` (validateRequired)
- DatacModal + DatacIcon (medicine-bottle-02) + invalid styling
- Styling `.less` z invalid color scheme (warning/error colors)

**References:**
- Wzorzec: `UndoAllocationModal/UndoAllocationModal.tsx:23`
- Style: `UndoAllocationModal.less`
- Translation keys: nowe klucze według requirements.md

### Task 3: Integration with AllocationButtonControl [react-component-creator]
**Location:** `~/work/datacapt/frontend/apps/datacapt/src/components/shared/Fulfillment/FulfillmentButton/AllocationButtonControl/AllocationButtonControl.tsx`

**Scope:**
- Dodać state dla declare invalid modal (`declareInvalidModal`, `isDeclaring`)
- Dodać nową opcję w dropdown menu (linie 87-329)
- Import i integracja z `DeclareInvalidModal`
- Handler funkcje (`handleDeclareInvalid`, `handleConfirmDeclareInvalid`)
- Permission check (`isEditingAvailable`)

**References:**
- Wzorzec: istniejące undo allocation handling w tym samym komponencie
- Dropdown pattern: linie obsługujące undo option

### Task 4: Visual Kit Status Update [react-component-creator]
**Location:** `~/work/datacapt/frontend/apps/datacapt/src/components/shared/Fulfillment/FulfillmentButton/AllocationButtonControl/`

**Scope:**
- Dodać visual indicators dla invalid kit status
- Styling invalid kits (similar to undo but different colors)
- Status badge "INVALID" 
- Icon styling z warning/invalid colors
- Strikethrough text + invalid state colors

**References:**
- Wzorzec: existing kit display w AllocationButtonControl
- Color scheme: design system invalid/warning tokens

### Task 5: Translation Keys [translation-manager]
**Location:** `~/work/datacapt/frontend/common/intl/en.json`

**Scope:**
- Dodać klucze translation według requirements.md
- Klucze: declare_invalid, confirm_declare_invalid, reason_for_declaring_invalid, invalid_kit_status
- Lokalizacja: sekcja studies.inclusion.allocation.button

**References:**
- Wzorzec: existing allocation translation keys (linie 1077-1085)
- Pattern: studies.inclusion.allocation.button.*

## Execution Plan

### Phase 1: Parallel Development (Tasks 1, 2, 5)
```
api-requests-manager -> API function
react-component-creator -> Modal component  
translation-manager -> Translation keys
```

### Phase 2: Integration (Tasks 3, 4)
```
react-component-creator -> AllocationButtonControl integration
react-component-creator -> Visual status updates
```

### Phase 3: Main Agent Validation
- Import integration testing
- Permission validation
- Error handling verification
- UI/UX final review
- Linting workflow execution

## Dependencies
- **Requires backend endpoint:** PUT `/api/allocation/kits/{allocationId}/invalidate`
- **Existing components:** AllocationButtonControl, FulfillmentContextWrapper
- **Design system:** DatacModal, DatacButton, DatacIcon, invalid color tokens

## Success Criteria
- [ ] API function follows existing pattern
- [ ] Modal component matches UndoAllocationModal structure
- [ ] Integration preserves existing undo functionality
- [ ] Visual invalid state clearly distinguishable
- [ ] Translation keys complete and consistent
- [ ] Permissions correctly enforced
- [ ] Error handling robust
- [ ] Audit trail format correct

## Risk Mitigation
- **API endpoint dependency:** Plan frontend structure, implement mock/placeholder
- **Permission conflicts:** Follow exact existing pattern
- **Visual confusion:** Distinct colors from undo action
- **Data consistency:** Maintain all existing properties except status