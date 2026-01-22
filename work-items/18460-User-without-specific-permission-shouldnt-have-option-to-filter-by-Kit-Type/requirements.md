# Requirements: 18460 - User without specific permission shouldn't have option to filter by Kit Type

## Task Description
User without specific permission shouldn't have option to filter by Kit Type.

## Acceptance Criteria
- GIVEN the user is on the table page with a filter panel available
- AND user have NOT access to unblinded permissions  
- WHEN open filters dropdown
- THEN they don't see the Kit type filter

## Current Behavior
- User with unblinded permission set as OFF opens kit inventory
- User opens filters and ALL Kit Type filters are visible 
- User is able to filter by Kit Type despite lack of permissions

## Expected Behavior
- Users without unblinded permissions should NOT see Kit Type filter in dropdown
- Kit Type filter should be conditionally displayed based on user permissions

## Technical Context

### Location
`/frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyRandomisationContent/StudyRandomisationKitsInventory/`

### Key Components
1. **StudyRandomisationKitsInventory.tsx** - główny komponent, zarządza filtrami
2. **KitsInventoryTable.tsx** - komponent tabeli, sprawdza uprawnienia ACL
3. **KitsInventoryTableConfig.tsx** - konfiguracja filtrów, w tym Kit Type filter

### Filter Interface  
```typescript
export interface IpRecordFilters extends Record<string, string[]> {
  kitType?: string[]
  status?: string[]
  location?: string[]
  allocatedBy?: string[]
}
```

### Permissions System
- **AclFeature.Randomization** - funkcjonalność randomizacji
- **AclAction.EmergencyUnblind** - akcja emergency unblind
- Pattern: `user.canDo(AclFeature.Randomization)(AclAction.EmergencyUnblind)`

### Existing Permission Pattern
W KitsInventoryTable.tsx już istnieje wzorzec kontroli uprawnień:
```typescript
if (user.canAccess(AclFeature.StudyUsersManagement)) {
  // fetch users for allocatedBy filter
}
```

### Filter Configuration Location
`KitsInventoryTableConfig.tsx` - funkcja `searchAndFilterOptions` (linie 207-254):
- Generuje opcje filtrowania
- Kit Type filter: linie 229-236
- Wzorzec warunkowego dodawania filtrów: linie 239-248 (allocatedBy)

## Required Changes
1. Przekazać user context do funkcji `searchAndFilterOptions`
2. Dodać sprawdzanie uprawnień przed dodaniem Kit Type filtra
3. Użyć wzorca podobnego do istniejącego filtra `allocatedBy`