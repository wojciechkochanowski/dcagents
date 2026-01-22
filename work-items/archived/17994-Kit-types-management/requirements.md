# 17994: Kit types management

## Description
**WHY**
We need to identify to which type a kit belongs to associate in an allocation design to which "package" of kits we are going to grab units.

**USE CASES**
User with the right to edit allocation configuration will define kit types either:
- per period and then call those periods in the eCRF 
- associate to treatment arms
- associate to treatments arms per period in a specific treatment sequence

**HOW**
When having the editing rights, we will provide users with very basic actions:
- create 
- edit 
- delete 

When having only readonly right, we will only allow users to see the kit type table and the detailed information displayed in it

## Subtasks
- **18042**: [BE] Create a kit type
- **18043**: [BE] Edit a kit type  
- **18044**: [BE] Delete a kit type

## Figma Design
[Randomization - allocation](https://www.figma.com/board/pxBDfcmwXAmvB5Jt1rb7ln/Randomization---allocation?node-id=121-1011&t=jrwOFl6iKWFB68NF-4)

### UI Components:
1. **Empty State (Tab)**: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=26089-5114&m=dev
   - "No kit types added yet" message
   - "Create your first kit" subtitle
   - "Add new kit type" CTA button

2. **List View (Table)**: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25860-4894&m=dev
   - Columns: ID, LABEL, DESCRIPTION
   - Sample data: Medicine 5mg, Medicine 10mg, Placebo
   - "Add new" button in bottom

3. **Action Menu**: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25860-5097&m=dev
   - Edit and Delete actions in dropdown
   - Accessible via row interaction

4. **Create Modal**: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25860-5522&m=dev
   - "Add new kit type" title
   - Label field (required)
   - Description field (optional, textarea)
   - Cancel/Add buttons

5. **Edit Modal**: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25860-5775&m=dev
   - "Edit kit type" title
   - Pre-filled form fields
   - Cancel/Save buttons

6. **Success Message**: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25860-6394&m=dev
   - Green success banner at top
   - "Kit type added" message with dosage info

7. **Delete Confirmation (Dummy)**: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25891-4721&m=dev
   - Warning message about dummy list reference
   - Kit type name display
   - Cancel/Confirm buttons

8. **Delete Confirmation (Prod)**: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25891-5272&m=dev
   - Error message about production use
   - Kit type name display
   - Disabled Confirm button (Cannot delete)

## Key Requirements
1. **CRUD Operations**: Full Create, Read, Update, Delete functionality for kit types
2. **Permissions**: Role-based access (readonly vs edit permissions)
3. **UI Location**: New tab "Kit types configuration" in Study → Randomization section
4. **Data Fields**: ID (auto-generated), Label, Description
5. **Integration**: Works within existing randomization/allocation system
6. **Backend Ready**: API endpoints already implemented (tasks 18042-18044)

## Technical Details
- **Frontend**: React 19 + TypeScript + Ant Design
- **API Path**: `/allocations/kit-types/`
- **Permissions**: `event: kit_types, action: access/edit`
- **Audit Trail**: Automatic logging of all operations
- **Validation**: Unique labels per study, business rules for deletion