# 18096: RTSM Options - Issues & Notes

## Issues Log

### 1. Incorrect Randomisation Flag Usage
**Issue**: Initial implementation used existing `randomisation` flag (tied to `randomization_active`) to control RTSM randomisation module visibility.
**Problem**: This flag serves different purpose - indicates if randomisation process is active.
**Solution**: Created new `randomisationEnabled` flag specifically for RTSM module control.
**Files Modified**:
- `common/requests/studies/studies.ts` - Added `randomisation_enabled` to RemoteStudy, `randomisationEnabled` to Study
- `StudyDetailsNavigation.tsx` - Updated `shouldShowRtsm` logic to use `study.randomisationEnabled`

### 2. Missing Business Logic Dependency
**Issue**: Shipment module was independent, but business logic requires shipments to depend on allocation.
**Reason**: Shipments are for sending kits, which are created in allocation module.
**Solution**: Made shipment toggle visible only when allocation is enabled.
**Files Modified**:
- `StudySettingsRtsm.tsx` - Added conditional rendering `{isAllocationEnabled && <ShipmentModule>}`
- Auto-disable shipment when allocation is disabled

### 3. UI/UX Mismatch with Design
**Issue**: Component had Edit/Cancel/Save buttons like other settings tabs.
**Problem**: Figma design shows no buttons - should auto-save on switch change.
**Solution**: Removed edit mode, implemented auto-save on every toggle change.
**Files Modified**:
- `StudySettingsRtsm.tsx` - Removed edit state, button components, added auto-save handlers

### 4. Type Safety Issues
**Issue**: Using string literals `'randomisation' | 'allocation' | 'shipment'` instead of enum.
**Problem**: Reduces type safety and maintainability.
**Solution**: Created `RtsmModuleType` enum for better type safety.
**Files Modified**:
- `StudySettingsRtsm.tsx` - Added enum, updated all usages

### 5. Success Message Structure Issues  
**Issue**: Used single message template with `{module}` variable.
**Problem**: Module names need translation - can't use variables for translated content.
**Solution**: Separated into individual title keys per module + shared message.
**Files Modified**:
- Translation files - Replaced single `success.enabled` with separate title keys
- `StudySettingsRtsm.tsx` - Updated message logic to use module-specific titles

### 6. Missing Tab Visibility Control
**Issue**: RTSM flags didn't control tab visibility in StudyRandomisationContent.
**Problem**: All tabs showed regardless of RTSM settings.
**Solution**: Added conditional rendering of tabs based on RTSM flags.
**Files Modified**:
- `StudyRandomisationContent.tsx` - Updated `tableTabs` array and Settings tab rendering

## Technical Notes

### RTSM Module Dependencies
- **Randomisation**: Independent - controls randomisation config and list
- **Allocation**: Independent - controls allocation config and kit types  
- **Shipment**: Dependent on Allocation - controls investigational products (IP)

### Flag Mapping to Tabs
- `randomisationEnabled` → `TabsRandomisation.Settings` + `TabsRandomisation.RandomisationList`
- `allocationEnabled` → `TabsRandomisation.AllocationConfiguration` + `TabsRandomisation.KitTypes`
- `shipmentEnabled` → `TabsRandomisation.InvestigationalProducts`

### Auto-save Implementation
- Each toggle change triggers immediate API call via `updateStudy()`
- Success messages shown only when enabling modules (not disabling)
- Error handling reverts to previous state on failure
- Loading state prevents multiple simultaneous saves

## Testing Notes  
*Manual testing results and edge cases will be documented here*

## Future Considerations
- Complete translation keys for all 8 language files (currently only Polish completed)
- Consider backend validation for business rules (e.g., prevent disabling allocation when kits exist)
- Monitor for any edge cases with tab switching when modules are disabled