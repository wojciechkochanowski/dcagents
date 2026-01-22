# Implementation Plan: Randomization Details Modal

## Overview
Create a new modal component that displays randomization data with conditional visibility based on blinding status and user permissions. The modal will be accessible from the participant actions dropdown menu.

## Implementation Tasks

### Task 1: Backend API Analysis 
**Agent**: `backend-api-analyzer`
**Priority**: High
**Dependencies**: None

**Objective**: Analyze existing randomization API endpoints and data structures to ensure proper integration.

**Scope**:
- Review `/backend/` randomization endpoints for data structure validation
- Verify `isBlinded` property availability in RandomisationData
- Check emergency unblinding status endpoint
- Validate permission system for `emergency_unblind` action
- Document any missing API fields or endpoints needed

**Deliverables**:
- API documentation with endpoint URLs and response structures
- Data mapping between backend and frontend interfaces
- Permission validation requirements

### Task 2: Create RandomizationDetailsModal Component
**Agent**: `react-component-creator` 
**Priority**: High
**Dependencies**: Task 1

**Objective**: Build the main modal component following Figma design specifications.

**Scope**:
- Create `RandomizationDetailsModal.tsx` in `/apps/datacapt/src/components/shared/Fulfillment/`
- Implement Figma design with proper styling (follow existing component patterns)
- Add multi-randomization dropdown selector
- Implement conditional rendering logic for blinding status
- Add emergency unblinding banner component
- Use `FulfillmentContextWrapper` for context integration
- Add proper TypeScript interfaces and props

**Key Requirements**:
- Follow existing modal patterns from `EmergencyUnblindModal`
- Use `useScopedIntl` for translations  
- Implement proper error handling with `DatacMessage`
- Add loading states for API calls
- Responsive design for mobile compatibility

**Figma Reference**: 
- Node ID: `27085-31926`
- Design shows dropdown, status indicator, and key-value data display
- Emergency banner styling (red warning)

**Deliverables**:
- `RandomizationDetailsModal.tsx` component
- Associated TypeScript interfaces
- Unit tests for component logic

### Task 3: Menu Integration
**Agent**: `react-component-creator`
**Priority**: Medium  
**Dependencies**: Task 2

**Objective**: Add "View Randomization Details" option to participant actions dropdown menu.

**Scope**:
- Modify `Fulfillment.tsx` to add new menu option
- Update `menuOptions` array in participant actions dropdown
- Add permission check for menu visibility
- Implement modal trigger functionality
- Add proper icon and styling for menu item

**Integration Point**: 
```tsx
// In fulfillment__menu-header__participant-actions div
<DatacDropdownMenu options={menuOptions} onClick={onMenuClick} />
```

**Permission Logic**:
```tsx
if (user.canAccess(AclFeature.RandomizationDetails)) {
  menuOptions.push({
    type: 'view_randomization_details',
    label: intl('randomization.viewDetails'),
    icon: 'icon-randomization'
  })
}
```

**Deliverables**:
- Updated `Fulfillment.tsx` with new menu option
- Modal integration and event handling
- Permission-based visibility

### Task 4: Conditional Display Logic Implementation
**Agent**: `react-component-creator`
**Priority**: High
**Dependencies**: Task 1, Task 2

**Objective**: Implement complex conditional logic for field visibility based on blinding status and user permissions.

**Scope**:
- Implement blinding detection logic using `isBlinded` property
- Add emergency unblinding permission checks
- Create conditional rendering for Treatment arm field
- Add emergency banner display logic
- Handle edge cases (missing data, permission changes)

**Logic Flow**:
```typescript
// Pseudo-code for conditional logic
const shouldShowTreatmentArm = () => {
  if (!randomization.isBlinded) return true; // Single-blind
  if (isEmergencyUnblinded && user.canDo(AclFeature.RandomizationDetails)(AclAction.EmergencyUnblind)) {
    return true; // Double-blind but user has unblinding permission
  }
  return false; // Double-blind, hide treatment arm
}

const shouldShowEmergencyBanner = () => {
  return isEmergencyUnblinded && 
         user.canDo(AclFeature.RandomizationDetails)(AclAction.EmergencyUnblind);
}
```

**Test Scenarios**:
- Single-blind randomization (all fields visible)
- Double-blind randomization (treatment arm hidden)
- Emergency unblinded with permission (all fields + banner)
- Emergency unblinded without permission (treatment arm hidden, no banner)
- Multiple randomizations switching

**Deliverables**:
- Conditional rendering utilities
- Permission checking functions
- Edge case handling
- Unit tests for all logic branches

### Task 5: Translation Keys
**Agent**: `translation-manager`
**Priority**: Low
**Dependencies**: Task 2, Task 3

**Objective**: Add all required translation keys for the new modal.

**Scope**:
- Add translation keys to `common/intl/en.json`
- Keys for modal title, field labels, error messages
- Emergency unblinding banner text
- Menu option label

**Required Keys**:
```json
{
  "randomization.viewDetails": "View Randomization Details",
  "randomization.modal.title": "Randomization data", 
  "randomization.modal.selectRandomization": "Select randomization",
  "randomization.modal.randomizationId": "Randomization ID",
  "randomization.modal.treatmentArm": "Treatment arm",
  "randomization.modal.randomizedBy": "Randomized by", 
  "randomization.modal.randomizedAt": "Randomized at",
  "randomization.modal.stratifiedBy": "Stratification {number} by",
  "randomization.modal.payload": "Payload",
  "randomization.modal.subjectRandomized": "Subject is randomized",
  "randomization.modal.emergencyUnblinded": "This participant has been emergency unblinded",
  "randomization.modal.loadError": "Failed to load randomization data"
}
```

**Deliverables**:
- Updated `en.json` with new keys
- Validation of key usage in components

### Task 6: Integration Testing & Validation
**Agent**: `general-purpose`
**Priority**: Medium
**Dependencies**: All previous tasks

**Objective**: Test complete integration and validate all acceptance criteria.

**Scope**:
- Test all AC scenarios with different user permissions
- Validate modal behavior with multiple randomizations
- Test responsive design on mobile
- Verify proper error handling
- Performance testing with large randomization datasets
- Cross-browser compatibility testing

**Test Cases**:
1. Single randomization, single-blind → All fields visible
2. Single randomization, double-blind → Treatment arm hidden
3. Multiple randomizations → Dropdown functional
4. Emergency unblinded + permission → Banner + all fields
5. Emergency unblinded - permission → No banner, treatment arm hidden
6. API error handling → Proper error messages
7. Mobile responsive → Modal displays correctly

**Deliverables**:
- Test results documentation
- Bug reports (if any)
- Performance metrics
- Acceptance criteria validation

## Parallel Execution Opportunities

**Phase 1** (Parallel):
- Task 1: Backend API Analysis
- Task 5: Translation Keys (basic structure)

**Phase 2** (Sequential):  
- Task 2: Create RandomizationDetailsModal Component

**Phase 3** (Parallel):
- Task 3: Menu Integration  
- Task 4: Conditional Display Logic Implementation

**Phase 4** (Final):
- Task 6: Integration Testing & Validation

## Risk Assessment & Mitigation

**High Risk**:
- **Complex Conditional Logic**: Multiple blinding states + permissions
  - *Mitigation*: Extensive unit testing, clear documentation of logic flow
- **API Integration**: Backend data structure changes
  - *Mitigation*: Early API analysis, fallback data handling

**Medium Risk**:
- **Performance**: Large randomization datasets
  - *Mitigation*: Pagination/lazy loading if needed
- **Mobile UX**: Modal responsiveness
  - *Mitigation*: Mobile-first design approach

**Low Risk**:
- **Translation Management**: Standard process
- **Menu Integration**: Well-established pattern

## Final Integration Points

The main agent will be responsible for:
1. Coordinating between sub-agents
2. Final integration testing
3. Code review and consistency checks  
4. Documentation updates
5. Deployment preparation

## Success Criteria

- [ ] All 5 acceptance criteria pass testing
- [ ] Modal matches Figma design specifications
- [ ] Proper error handling and loading states
- [ ] Mobile responsive design
- [ ] Performance within acceptable limits
- [ ] All translation keys implemented
- [ ] Code follows existing patterns and standards