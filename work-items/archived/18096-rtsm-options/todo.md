# 18096: RTSM Options - Task List

## Phase 1: Foundation (Parallel)
- [x] **Task 1**: API Interfaces Extension (api-requests-manager)
  - [x] Extend RemoteStudy interface with allocation_enabled, shipment_enabled  
  - [x] Extend Study interface with allocationEnabled, shipmentEnabled
  - [x] Update parseRemoteStudy mapping function
  - [x] Ensure backward compatibility testing

- [x] **Task 5**: Translation Management (translation-manager)  
  - [x] Add RTSM settings translation keys to en.json
  - [x] Validate translation key structure
  - [x] Include labels, descriptions, success/error messages

## Phase 2: Core Implementation (Sequential)
- [x] **Task 2**: RTSM Settings Component Creation (react-component-creator)
  - [x] Create StudySettingsRtsm.tsx following StudySettingsOptions pattern
  - [x] Implement form with 3 toggle sections (Randomisation, Allocation, Shipments)
  - [x] Use DatacFormItem and DatacSwitch components  
  - [x] Integrate with StudyDetailsContext
  - [x] Add proper TypeScript interfaces
  - [x] Match Figma design specifications

- [x] **Task 3**: Settings Tab Integration (react-component-creator)
  - [x] Add Rtsm to StudySettingsTab enum
  - [x] Insert tab between Options and Customisation
  - [x] Import and render StudySettingsRtsm component
  - [x] Ensure proper tab ordering

## Phase 3: Navigation Integration (Parallel with Phase 2)  
- [x] **Task 4**: Navigation Conditional Rendering (react-component-creator)
  - [x] Update RTSM navigation items with toggle state checks
  - [x] Implement conditional rendering for each module
  - [x] Maintain existing permission checks
  - [x] Ensure immediate navigation updates

## Phase 4: Integration & Validation
- [x] **Main Agent Tasks**:
  - [x] Code review and integration testing
  - [x] End-to-end functionality validation
  - [x] UI consistency check against Figma design  
  - [x] Navigation behavior verification
  - [x] Translation completeness check
  - [x] Success banner and error message testing

## Completion Checklist
- [x] New RTSM settings tab visible between Options and Customisation
- [x] All three toggles function correctly  
- [x] Navigation shows/hides items based on toggle states
- [x] Form handles existing study data properly
- [x] UI matches Figma design exactly
- [x] All translations display correctly  
- [x] Success banners work on toggle changes
- [x] Error messages prevent invalid changes
- [x] Lint workflow completed successfully