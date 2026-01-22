# TODO: 18460 - Kit Type Filter Permission Control

## Planning Phase ✅
- [x] Pobrać kryteria akceptacji
- [x] Przeanalizować kod komponentów
- [x] Wykonać research techniczny  
- [x] Stworzyć requirements.md
- [x] Stworzyć implementation.md

## Implementation Phase
- [x] **Task 1:** Analiza struktury plików (react-component-creator)
  - [x] Przeczytać KitsInventoryTable.tsx i KitsInventoryTableConfig.tsx
  - [x] Zidentyfikować przekazywanie user context
  - [x] Sprawdzić wzorzec filtra allocatedBy
  - [x] Przygotować plan refactoringu

- [x] **Task 2:** Implementacja kontroli uprawnień (react-component-creator)
  - [x] Zmodyfikować sygnaturę searchAndFilterOptions (dodać parametr user)  
  - [x] Dodać sprawdzanie uprawnień przed dodaniem Kit Type filtra
  - [x] Użyć wzorca: `user.canDo(AclFeature.Randomization)(AclAction.EmergencyUnblind)`

- [x] **Task 3:** Aktualizacja wywołania (react-component-creator)
  - [x] Przekazać user context do searchAndFilterOptions w KitsInventoryTable.tsx
  - [x] Sprawdzić dostępność user context w komponencie

- [x] **Task 4:** Walidacja (react-component-creator)
  - [x] Sprawdzić build bez błędów
  - [x] Zweryfikować poprawną sygnaturę funkcji
  - [x] Upewnić się że user context jest dostępny
  - [x] Uruchomić kompilację TypeScript

## Integration & Testing Phase  
- [x] **Main Agent:** Finalne sprawdzenie
  - [x] Weryfikacja wszystkich zmian
  - [x] Test build aplikacji
  - [x] Sprawdzenie błędów TypeScript

## Files to Modify
- `/frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyRandomisationContent/StudyRandomisationKitsInventory/KitsInventoryTable/KitsInventoryTableConfig.tsx`
- `/frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyRandomisationContent/StudyRandomisationKitsInventory/KitsInventoryTable/KitsInventoryTable.tsx`