# 18067: Declare a Kit as Invalid - Requirements

## Task Description
**As a** user with the permission `allocation.edit`  
**I want to** declare a previously allocated kit as invalid during eCRF completion  
**So that** I can continue processing the eCRF when the allocation is no longer valid

## Acceptance Criteria

### Scenario 1: Declaring a kit invalid from the eCRF
- User with `allocation.edit` permission can access "Declare invalid" option in 3-dot menu of allocated kit
- Confirmation modal appears requiring mandatory reason input
- Action cannot proceed without reason

### Scenario 2: eCRF and kit inventory impacts
- Kit status changes to invalid in both eCRF and kit inventory
- Kit remains listed with all data (Kit ID, Investigator name, Timestamp)
- Properties remain stored (subject ID, timestamp) except status
- Audit trail created with specific format

## Required Backend Endpoints

### PUT /api/allocation/kits/{allocationId}/invalidate
**Based on existing undo pattern:** `DELETE /api/allocation/kits/{allocationId}`

**Request Body:**
```json
{
  "reason": "string (required)"
}
```

**Response:**
- 200: Success
- 404: Allocation not found
- 403: Permission denied
- 400: Invalid data

**Error Codes:** Follow existing pattern (`STUDY_RANDOMISATION_ALLOCATION_ERROR`)

## Required Frontend Components

### Component Hierarchy (based on existing undo allocation)

```
AllocationButtonControl (existing)
├── Dropdown Menu (existing)
│   ├── Undo Allocation (existing)
│   └── Declare Invalid (new)
└── DeclareInvalidModal (new)
    ├── DatacModal (existing)
    ├── Form with reason field
    └── Kit display with invalid styling
```

### API Interface (common/requests/)
```typescript
interface DeclareInvalidOptions {
  studyId: string
  subjectId: string  
  allocationId: string
  reason: string // required
}

interface ResponseHandlers {
  onSuccess?: () => void
  onRequestError?: (code: number) => void  
  onAllocationNotFound?: () => void
}
```

## UI/UX Requirements

### Visual Design
- **Invalid Kit Display:** Similar to undo but different color scheme
  - Icon: medicine-bottle-02 with warning/invalid colors
  - Text: strikethrough + invalid state colors
  - Status badge: "INVALID"

### Modal Design (based on UndoAllocationModal)
- **Title:** "Declare Kit Invalid" 
- **Content:** Kit details + reason form
- **Actions:** Cancel / Confirm
- **Validation:** Required reason field

### Permissions
- **Permission Key:** `allocation.edit`
- **Context:** `FulfillmentContextWrapper.isEditingAvailable`
- **Behavior:** Option hidden when no permissions

## Audit Trail Requirements

**Event:** `kit_allocation_undone` (reuse existing event type)
**Action Format:** `[kit ID] allocated to [subject ID] is invalid. [Reason]`
**Fields:**
- Who: Investigator full name
- When: Timestamp  
- Action: Formatted string

## Translation Keys (en.json)
```json
"studies.inclusion.allocation.button.declare_invalid": "Declare invalid",
"studies.inclusion.allocation.button.confirm_declare_invalid": "Declare kit invalid",
"studies.inclusion.allocation.button.reason_for_declaring_invalid": "Reason for declaring kit invalid",
"studies.inclusion.allocation.invalid_kit_status": "Invalid"
```

## Design System Integration
- **Colors:** Use warning/invalid color tokens from design system
- **Components:** DatacModal, DatacButton, DatacIcon, DatacMessage
- **Spacing:** Follow existing @xl, @md, @sm patterns
- **Typography:** Use existing body mixins

## Dependencies
- Existing AllocationButtonControl component
- Existing FulfillmentContextWrapper for permissions
- Existing DatacModal, validation patterns
- Backend allocation API extension