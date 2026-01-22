# 18096: RTSM Options - Implementation Plan

## Implementation Strategy
Break task into specialized sub-agent assignments with parallel execution where possible, followed by main agent integration and validation.

## Sub-Agent Task Breakdown

### Task 1: API Interfaces Extension
**Agent**: `api-requests-manager`  
**Priority**: High (blocking other tasks)  
**Files**: `~/work/datacapt/frontend/common/requests/studies/studies.ts`

**Scope**:
- Extend `RemoteStudy` interface with `allocation_enabled`, `shipment_enabled` boolean fields
- Extend `Study` interface with `allocationEnabled`, `shipmentEnabled` boolean fields  
- Update `parseRemoteStudy` function to map new fields from snake_case to camelCase
- Ensure backward compatibility with existing `randomisation` field

**Output**: Updated interfaces ready for frontend consumption

### Task 2: RTSM Settings Component Creation
**Agent**: `react-component-creator`  
**Priority**: High (main feature component)
**Files**: `~/work/datacapt/frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudySettingsContent/StudySettingsRtsm/StudySettingsRtsm.tsx`

**Scope**:
- Create main RTSM settings component following `StudySettingsOptions` pattern
- Implement form with three toggle sections (Randomisation, Allocation, Shipments)  
- Use `DatacFormItem` and `DatacSwitch` components consistent with existing patterns
- Integrate with `StudyDetailsContext` for study data and updates
- Handle form validation and submission
- Include proper TypeScript interfaces for form data
- Follow Figma design specifications exactly

**Design Reference**: Figma node 26164-9547
**Key Elements**: 3 toggle sections with icons, titles, descriptions, and switches

### Task 3: Settings Tab Integration  
**Agent**: `react-component-creator`
**Priority**: Medium (depends on Task 2)
**Files**: `~/work/datacapt/frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudySettingsContent/StudySettingsContent.tsx`

**Scope**:
- Add `Rtsm = 'Rtsm'` to `StudySettingsTab` enum
- Insert new tab between Options and Customisation in tab structure
- Import and render `StudySettingsRtsm` component in appropriate TabPane
- Ensure proper tab ordering and styling consistency

### Task 4: Navigation Conditional Rendering
**Agent**: `react-component-creator`
**Priority**: Medium (can run in parallel with Tasks 2-3)
**Files**: `~/work/datacapt/frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyDetailsLayout/StudyDetailsNavigation/StudyDetailsNavigation.tsx`

**Scope**:
- Update RTSM navigation items to check toggle states from study context
- Implement conditional rendering for each module:
  - Randomisation: `study.randomisation && user.canAccess(...)`
  - Allocation: `study.allocationEnabled && user.canAccess(...)`  
  - Shipments: `study.shipmentEnabled && user.canAccess(...)`
- Maintain existing permission checks alongside new toggle conditions
- Ensure navigation updates immediately when toggles change

**Pattern Reference**: Existing randomisation conditional logic in lines 308-315

### Task 5: Translation Management
**Agent**: `translation-manager`
**Priority**: Low (can run in parallel)
**Files**: `~/work/datacapt/frontend/common/intl/en.json`

**Scope**:
- Add all required translation keys for RTSM settings component
- Include labels, descriptions, success messages, error messages
- Follow existing translation key naming patterns
- Validate translation key structure and completeness

**Keys Required**:
```json
"studies.settings.rtsm": "RTSM settings",
"studies.settings.rtsm.randomisation.label": "Randomisation",
"studies.settings.rtsm.randomisation.description": "Allows you to create treatment arms (groups) and randomise subjects blindly or double blindly",
"studies.settings.rtsm.allocation.label": "Allocation", 
"studies.settings.rtsm.allocation.description": "Allows you to create kits and allocate them to the users. Doesn't require randomisation",
"studies.settings.rtsm.shipment.label": "Shipments",
"studies.settings.rtsm.shipment.description": "Allows you to send and track your kits"
```

## Execution Phases

### Phase 1: Foundation (Parallel Execution)
- **Task 1**: API interfaces extension (blocking)
- **Task 5**: Translation management (non-blocking)

### Phase 2: Core Implementation (Sequential after Task 1)
- **Task 2**: RTSM settings component creation  
- **Task 3**: Settings tab integration (depends on Task 2)

### Phase 3: Navigation Integration (Parallel with Phase 2)
- **Task 4**: Navigation conditional rendering

### Phase 4: Main Agent Integration & Validation
- Code review and integration testing
- End-to-end functionality validation  
- UI consistency checks against Figma design
- Navigation behavior verification
- Translation completeness check

## Technical Considerations

### Component Patterns to Follow
- Use `StudySettingsOptions.tsx` as template for component structure
- Follow existing form handling patterns with `Form.useForm<FormData>()`  
- Implement `useEffect` for form initialization from study context
- Use `DatacSwitch` component for consistency

### Integration Points
- `StudyDetailsContext` for study data access and updates
- `useScopedIntl('studies.settings')` for translations
- Existing permission system integration in navigation
- Form submission and success/error handling patterns

### Validation Requirements  
- Toggle state consistency with existing data
- Permission checks before allowing toggle changes
- Success banner implementation following design
- Error handling for edge cases (existing data conflicts)

## Success Criteria
1. New RTSM settings tab appears between Options and Customisation
2. All three toggles (Randomisation, Allocation, Shipments) function correctly
3. Navigation items show/hide based on toggle states  
4. Form handles existing study data appropriately
5. UI matches Figma design exactly
6. All translations display correctly
7. Success banners appear on toggle changes
8. Error messages prevent invalid toggle changes