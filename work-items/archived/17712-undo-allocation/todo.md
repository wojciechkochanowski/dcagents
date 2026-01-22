# Todo List - 17712 Undo Allocation

## Etap 1: Implementacja API funkcji (Sub-agent 1)
- [ ] Dodać interfejsy `UndoAllocationOptions` i `UndoAllocationResponseHandlers`
- [ ] Zaimplementować funkcję `undoAllocationSubject` w `/common/requests/subjects/subjectsInApp.ts`
- [ ] Użyć metody DELETE do endpoint `/subjects/{subjectId}/allocations/{allocationId}`
- [ ] Dodać obsługę błędów podobnie jak w innych funkcjach
- [ ] Wyeksportować nową funkcję w głównym eksporcie pliku

## Etap 2: Aktualizacja mock danych (Sub-agent 2)
- [ ] Dodać funkcję mock `undoAllocation` w `/common/requests/forms/blocks/buttonContent/buttonContent.ts`
- [ ] Zmodyfikować `fetchAllocationButtonOptions` aby obsługiwać usunięte alokacje
- [ ] Upewnić się że mock zwraca poprawne dane po operacji undo

## Etap 3: Implementacja funkcji onUndo w komponencie (Sub-agent 3)
- [ ] Zaimplementować funkcję `handleUndo` w `AllocationButtonControlInner`
- [ ] Przekazać `handleUndo` do `AllocationListItem`
- [ ] Zaktualizować props w `AllocationListItem`
- [ ] Podłączyć `onUndo` do `AllocationActionMenu`

## Etap 4: Dodanie tłumaczeń (Sub-agent 4)
- [ ] Dodać brakujące klucze tłumaczeń do `/common/intl/en.json`
- [ ] Klucze: undo_success_title, undo_success_message, undo_error_not_found_title, undo_error_not_found_message

## Etap 5: Integracja i testy (Główny agent)
- [ ] Sprawdzenie integracji wszystkich komponentów
- [ ] Sprawdzić czy funkcja undo prawidłowo usuwa alokacje z listy
- [ ] Zweryfikować obsługę błędów
- [ ] Kontrola zgodności z `~/work/datacapt/instructions/frontend.md`
- [ ] Finalną weryfikacja AC z `~/work/llm/workitem-tool/workitem-tool`
- [ ] Wykonanie flow z `~/work/datacapt/instructions/lint.md`
- [ ] Sprawdzenie requirements.md - czy o niczym nie zapomniano