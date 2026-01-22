# Task 18316: Randomization Modal Requirements

## Task Description

Update the Randomization modal in the eCRF to display different information based on blinding status, user permissions, and number of randomizations. The modal should conditionally show/hide Treatment arm information and display emergency unblinding warnings.

## Figma Design
[Figma Link](https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=27085-31926&t=O3xrcyfimM6AvSnV-4)

![Modal Design](./images/randomization-modal-figma.png)

## Acceptance Criteria

### AC1: Multiple Randomizations
**GIVEN** a study with more than one randomization  
**WHEN** the user opens the randomization details modal  
**THEN** we display a dropdown with the randomization name  
**AND** the user can select the appropriate randomization

### AC2: Single-Blind Mode
**GIVEN** a study with a randomization in single-blind mode  
**WHEN** opening the randomization modal from the eCRF  
**THEN** all information is displayed (Rando ID, Treatment arm, Randomized by, Randomized at, Stratified by)

### AC3: Double-Blind Mode (Normal User)
**GIVEN** a study with a randomization in double-blind mode  
**WHEN** opening the randomization modal from the eCRF  
**THEN** the following information is displayed:
- Rando ID
- Randomized by  
- Randomized at
- Stratified by
**AND** the Treatment arm is **NOT displayed**

### AC4: Emergency Unblinded (User with Permission)
**GIVEN** a study with a randomization in double-blind mode  
**AND** a user with "emergency unblinding" permission  
**AND** the randomization was unblinded for the participant  
**WHEN** opening the eCRF for this participant  
**THEN** all information is displayed ONLY for user with the unblinded permission  
**AND** we display the red banner in the Randomization details modal

### AC5: Emergency Unblinded (User without Permission)
**GIVEN** a study with a randomization in double-blind mode  
**AND** a user without "emergency unblinding" permission  
**AND** the randomization was unblinded for the participant  
**WHEN** opening the eCRF for this participant  
**THEN** the following information is displayed:
- Rando ID
- Randomized by
- Randomized at  
- Stratified by
**AND** the Treatment arm is NOT displayed  
**AND** we DO NOT display the red banner (user doesn't know participant was unblinded)

## Technical Requirements

### Backend Integration
- **API Endpoints**: Use existing randomization endpoints from `/common/requests/inclusions.ts`
- **Data Structure**: `RandomisationData[]` from Inclusion interface
- **Blinding Detection**: Use `isBlinded` property from RandomisationData

### Frontend Components Required
- **New Modal Component**: `RandomizationDetailsModal.tsx` 
- **Menu Integration**: Add option to `fulfillment__menu-header__participant-actions` dropdown
- **Dropdown Component**: Multi-randomization selector (similar to Inclusion interface)

### Permissions System
- **Feature**: `AclFeature.RandomizationDetails = 'randomization_details'`
- **Action**: `AclAction.EmergencyUnblind = 'emergency_unblind'` 
- **Permission Check**: `user.canDo(AclFeature.RandomizationDetails)(AclAction.EmergencyUnblind)`

### UI Requirements
- **Modal Design**: Follow Figma specifications with:
  - Header with close button
  - Dropdown for multiple randomizations  
  - Status indicator (green checkmark)
  - Key-value pairs for randomization data
  - Optional red warning banner for emergency unblinding
- **Conditional Fields**: 
  - Treatment arm visibility based on blinding status + user permissions
  - Emergency unblinding banner visibility based on user permissions
- **Responsive Design**: Modal should work on mobile devices

### Integration Points
- **Context Dependency**: Use `FulfillmentContextWrapper` for access to participant record
- **Menu Location**: Add to `DatacDropdownMenu` in participant actions section
- **Error Handling**: Use `DatacMessage` for notifications
- **Translations**: Add new translation keys to `en.json` only

## Component Hierarchy
```
Fulfillment.tsx
├── fulfillment__menu-header__participant-actions
    ├── DatacDropdownMenu
        └── [New Option] "View Randomization Details"
            └── RandomizationDetailsModal.tsx
                ├── Modal Header (title + close)
                ├── Randomization Dropdown (if multiple)  
                ├── Status Indicator
                ├── Emergency Banner (conditional)
                └── Randomization Data List
```

## Data Flow
1. User clicks "View Randomization Details" from participant menu
2. Modal opens, loads randomization data from participant record
3. If multiple randomizations exist, show dropdown selector
4. Apply blinding logic based on study configuration and user permissions
5. Display appropriate fields with conditional Treatment arm visibility
6. Show emergency unblinding banner if user has permissions and participant is unblinded