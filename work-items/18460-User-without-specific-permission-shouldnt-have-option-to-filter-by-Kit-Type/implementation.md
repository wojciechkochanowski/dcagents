# Implementation Plan: 18460 - Kit Type Filter Permission Control

## Overview
Ukryj filtr Kit Type dla użytkowników bez uprawnień unblinded w Kit Inventory.

## Implementation Strategy

### Sub-Agent Tasks

#### Task 1: Analiza struktury plików komponenta
**Agent:** react-component-creator  
**Szczegóły:** Przeanalizuj KitsInventoryTable i KitsInventoryTableConfig - sprawdź user context, wzorzec filtra allocatedBy, przygotuj refactoring searchAndFilterOptions.

#### Task 2: Implementacja kontroli uprawnień w konfiguracji filtrów  
**Agent:** react-component-creator
**Szczegóły:** Zmodyfikuj searchAndFilterOptions - dodaj parametr user, warunkowo dodaj Kit Type filter, zaktualizuj wywołanie w KitsInventoryTable.

**Implementacja:**
```typescript
// KitsInventoryTableConfig.tsx
export const searchAndFilterOptions = (
  intlKitsInventory: IntlFunction,
  statusCounters: StatusCounters,
  usersOptions: SelectOption[],
  user: User // <- dodać parametr
): FilterAndSearchOptions => {
  // ... existing filters

  // Warunkowo dodaj Kit Type filter
  if (user.canDo(AclFeature.Randomization)(AclAction.EmergencyUnblind)) {
    filters.push({
      label: intlKitsInventory('field.kit_type'),
      name: 'kitType',
      options: kitTypesOptions,
    })
  }
}
```

#### Task 3: Walidacja i lint workflow
**Agent:** react-component-creator  
**Szczegóły:** Sprawdź build, błędy TypeScript, wykonaj workflow z lint.md (pnpm tsc, pnpm eslint, prettier).

### Integration Steps (Main Agent)
**Po zakończeniu wszystkich sub-agent tasks:** Finalna weryfikacja - sprawdź czy wszystkie zmiany zostały wprowadzone, logika jest spójna.

## Expected Outcomes

### Before Implementation
- Wszyscy użytkownicy widzą filtr Kit Type
- Brak kontroli uprawnień dla tego filtra

### After Implementation  
- Użytkownicy z uprawnieniami unblinded: widzą filtr Kit Type
- Użytkownicy bez uprawnień unblinded: NIE widzą filtra Kit Type  
- Zachowana funkcjonalność dla pozostałych filtrów

## Files to Modify
1. `/frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyRandomisationContent/StudyRandomisationKitsInventory/KitsInventoryTable/KitsInventoryTableConfig.tsx`
2. `/frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyRandomisationContent/StudyRandomisationKitsInventory/KitsInventoryTable/KitsInventoryTable.tsx`

## Risk Assessment: LOW
- Prosta modyfikacja istniejącej logiki
- Wzorzec już używany w kodzie
- Minimalna zmiana w API komponentu