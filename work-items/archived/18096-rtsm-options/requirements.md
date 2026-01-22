# 18096: RTSM Options - Requirements

## Task Description
Add new "RTSM settings" tab in Study->Settings (between Options and Customisation) with toggles for RTSM modules: Randomization, Allocation, and Shipment.

## Acceptance Criteria

### User Story
**As a** user with study settings configuration    
**I want to** enable or disable key RTSM functionalities such as Randomization, Allocation, and Shipment   
**So that** I can activate only the modules that are relevant to the current study setup  

### Permissions
- **Permission key**: `study.settings.edit`  
- Grants ability to access and modify RTSM settings from study setup
- Toggle availability of Randomization, Allocation, and Shipment features  

### Business Logic Rules
- Each RTSM module (Randomization, Allocation, Shipments) is controlled independently via toggle  
- Toggle states:  
  - **ON** → Module becomes accessible from RTSM tab  
  - **OFF** → Module is hidden or disabled in navigation/menu  
- Default state when creating study: All modules are **OFF**  
- Module can't be **OFF** if there's existing randomization, kits or shipment created
- For existing studies: if there is randomization: the module is activated ("ON")
- Toggle can be activated even if study is LIVE if it was not set-up earlier

### User Experience Requirements
- **Access point**: Study > Settings > RTSM settings tab (between Options and Customisation)
- **UI behavior**:  
  - For each RTSM section: Label, short description, toggle switch
  - When toggle is changed: Visual success banner (top-right), navigation updates automatically
  - If user disables module with existing data: Error message preventing deactivation

### Audit Trail Requirements
- **Events**: `rtsm_setting_updated`  
- **Fields logged**: User full name, Timestamp, Action (e.g., "Randomization = ON"), Study ID  

## Required Interfaces & Backend

### Study Interface Extensions
```typescript
interface Study {
  // existing fields...
  randomisation: boolean,        // already exists
  allocationEnabled: boolean,    // new field
  shipmentEnabled: boolean,      // new field
}

interface RemoteStudy {
  // existing fields...
  randomisation: boolean,        // already exists  
  allocation_enabled: boolean,   // new field
  shipment_enabled: boolean,     // new field
}
```

### Backend Assumptions
- RTSM flags will be stored in main study settings
- Available via study context after implementation
- Update endpoint will handle toggle changes and validation
- No backend implementation required in this task

## Component Hierarchy

### New Components
- `StudySettingsRtsm.tsx` - Main RTSM settings component with toggles

### Modified Components
- `StudySettingsContent.tsx` - Add RTSM tab between Options and Customisation
- `StudyDetailsNavigation.tsx` - Conditional rendering of RTSM menu items based on toggles
- `studies.ts` - Extend Study/RemoteStudy interfaces

## Figma Design Reference

**Link**: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=26164-9547&t=3NcSUHKNjXqxv81s-4

**Design Elements**:
- Tab labeled "RTSM settings" between Options and Customisation
- Three toggle sections:
  1. **Randomisation** - "Allows you to create treatment arms (groups) and randomise subjects blindly or double blindly"
  2. **Allocation** - "Allows you to create kits and allocate them to the users. Doesn't require randomisation"  
  3. **Shipments** - "Allows you to send and track your kits"
- Each section has icon, title, description, and blue toggle switch on right
- Success banner shown when settings updated: "Allocation is now on. You may edit it in RTSM tab."

## Translation Keys Required
```json
"studies.settings.rtsm": "RTSM settings",
"studies.settings.rtsm.randomisation.label": "Randomisation", 
"studies.settings.rtsm.randomisation.description": "Allows you to create treatment arms (groups) and randomise subjects blindly or double blindly",
"studies.settings.rtsm.allocation.label": "Allocation",
"studies.settings.rtsm.allocation.description": "Allows you to create kits and allocate them to the users. Doesn't require randomisation", 
"studies.settings.rtsm.shipment.label": "Shipments",
"studies.settings.rtsm.shipment.description": "Allows you to send and track your kits",
"studies.settings.rtsm.success.enabled": "{module} is now on. You may edit it in RTSM tab.",
"studies.settings.rtsm.error.hasData": "Cannot disable {module} because there is existing data."
```