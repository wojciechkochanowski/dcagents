# Plan implementacji: 17712 - Undo Allocation

## Plan implementacji

### Etap 1: Implementacja API funkcji (Sub-agent 1)
**Lokalizacja:** `/Users/bartek/work/datacapt/frontend/common/requests/subjects/subjectsInApp.ts`

**Zadania:**
1. Dodać interfejsy:
   ```typescript
   interface UndoAllocationOptions {
     studyId: string
     subjectId: string
     allocationId: string
   }
   
   interface UndoAllocationResponseHandlers {
     onSuccess?: () => void
     onRequestError?: (code: number) => void
     onAllocationNotFound?: () => void
   }
   ```

2. Zaimplementować funkcję `undoAllocationSubject` na wzór istniejącej `allocateSubject` (linie 636-661)
   - Użyć metody DELETE do endpoint `/subjects/{subjectId}/allocations/{allocationId}`
   - Dodać obsługę błędów podobnie jak w innych funkcjach
   
3. Wyeksportować nową funkcję w głównym eksporcie pliku

**Raport:** Sub-agent ma przekazać szczegóły implementacji i potwierdzenie działania

### Etap 2: Aktualizacja mock danych (Sub-agent 2)  
**Lokalizacja:** `/Users/bartek/work/datacapt/frontend/common/requests/forms/blocks/buttonContent/buttonContent.ts`

**Zadania:**
1. Dodać funkcję mock `undoAllocation` do obsługi usuwania alokacji
2. Zmodyfikować `fetchAllocationButtonOptions` aby obsługiwać usunięte alokacje
3. Upewnić się że mock zwraca poprawne dane po operacji undo

**Raport:** Sub-agent ma przekazać informacje o zmianach w strukturze mock danych

### Etap 3: Implementacja funkcji onUndo w komponencie (Sub-agent 3)
**Lokalizacja:** `/Users/bartek/work/datacapt/frontend/apps/datacapt/src/components/shared/Fulfillment/FulfillmentButton/AllocationButtonControl/AllocationButtonControl.tsx`

**Zadania:**
1. Zaimplementować funkcję `handleUndo` w komponencie `AllocationButtonControlInner`:
   ```typescript
   const handleUndo = useCallback((allocationId: string) => {
     undoAllocationSubject(
       {
         studyId: study.id,
         subjectId: inclusion.subject,
         allocationId
       },
       {
         onSuccess: () => {
           loadAllocations() // Reload allocations after undo
           DatacMessage.success(
             intlAllocationButton('undo_success_title'),
             intlAllocationButton('undo_success_message')
           )
         },
         onAllocationNotFound: () => {
           DatacMessage.error(
             intlAllocationButton('undo_error_not_found_title'),
             intlAllocationButton('undo_error_not_found_message')
           )
         },
         onRequestError: code => {
           DatacMessage.genericError(intl, code)
         }
       }
     )
   }, [study.id, inclusion.subject, loadAllocations])
   ```

2. Przekazać `handleUndo` do `AllocationListItem`:
   ```typescript
   <AllocationListItem 
     key={allocation.id} 
     allocation={allocation} 
     onUndo={() => handleUndo(allocation.id)}
   />
   ```

3. Zaktualizować props w `AllocationListItem`:
   ```typescript
   const AllocationListItem: React.FC<{
     allocation: AllocationRecord
     onUndo: () => void
   }> = ({ allocation, onUndo }) => {
   ```

4. Podłączyć `onUndo` do `AllocationActionMenu` w linii 65

**Raport:** Sub-agent ma przekazać szczegóły implementacji i informacje o testach

### Etap 4: Dodanie tłumaczeń (Sub-agent 4 - opcjonalnie)
**Lokalizacja:** `/Users/bartek/work/datacapt/frontend/common/intl/en.json`

**Zadania:**
1. Dodać brakujące klucze tłumaczeń:
   ```json
   "studies.inclusion.allocation.button.undo_success_title": "Kit allocation undone",
   "studies.inclusion.allocation.button.undo_success_message": "The kit allocation has been successfully removed",
   "studies.inclusion.allocation.button.undo_error_not_found_title": "Allocation not found",
   "studies.inclusion.allocation.button.undo_error_not_found_message": "The allocation could not be found or has already been removed"
   ```

**Raport:** Sub-agent ma potwierdzić dodanie tłumaczeń

## Etap 5: Integracja i testy (Główny agent)

**Po zakończeniu pracy przez sub-agentów:**

1. **Sprawdzenie integracji**
   - Upewnić się że wszystkie komponenty działają razem
   - Sprawdzić czy funkcja undo prawidłowo usuwa alokacje z listy
   - Zweryfikować obsługę błędów

2. **Kontrola zgodności z instrukcjami**
   - Ponownie sprawdzić plik `~/work/datacapt/instructions/frontend.md`
   - Porównać implementację z wytycznymi projektu

3. **Finalną weryfikacja AC**
   - Uruchomić ponownie `~/work/llm/workitem-tool/workitem-tool`
   - Upewnić się że wszystkie acceptance criteria są spełnione

4. **Uruchomienie lint i typecheck**
   - Wykonać instrukcje z `~/work/datacapt/instructions/lint.md`
   - Naprawić wszystkie błędy linting/typescript

## Harmonogram wykonania

**Sub-agenci mogą pracować równolegle:**
- Sub-agent 1 (API) i Sub-agent 2 (Mock) - niezależne
- Sub-agent 4 (Tłumaczenia) - niezależny
- Sub-agent 3 (UI) - po zakończeniu pracy Sub-agenta 1

**Główny agent:**
- Rozpoczyna po zakończeniu wszystkich sub-agentów
- Czas realizacji: ~30 minut integracji i testów