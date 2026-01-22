# US 16326: Main Table - Implementation Plan

## Przegląd zadania
Rozszerzenie istniejącej tabeli randomizacji o 4 brakujące kolumny. Backend API już wspiera wszystkie wymagane pola. Treatment arm code już zaimplementowany w renderArm function.

## Sub-agent Tasks

### 1. Interface Updates (api-requests-manager) 
**Cel:** Rozszerz RandomisationRecord interface o brakujące pola
**Zadania:**
- Dodaj nowe pola do `RandomisationRecord` interface w randomisationList.ts:62-71
- Rozszerz `RemoteRandomisationRecord` interface o backend fields
- Update `parseRemoteRandomisationRecord` function (linie 73-94)
- Dodaj nowe pola do `randomisationSorterFields` mapping

**Nowe pola (4):**
```typescript
blockIdentifier?: string         // z block_identifier  
blockSize?: number              // z block_size
sequenceWithinBlock?: number    // z sequence_within_block
payload?: string                // z payload
```

### 2. Column Configuration (react-component-creator)
**Cel:** Dodaj nowe kolumny do tabeli randomizacji
**Zadania:**
- Modify `getColumns` function w ListTableConfig.tsx:72-126
- Dodaj 4 nowe kolumny: Block identifier, Block size, Sequence within block, Payload
- Konfiguracja sortowania dla nowych kolumn
- Responsive width adjustments w `getTableScrollWidth`

**Nowe kolumny (4):**
- Block identifier
- Block size
- Sequence within block
- Payload

### 3. Translation Updates (translation-manager)
**Cel:** Dodaj tłumaczenia dla nowych kolumn
**Zadania:**
- Dodaj keys w `en.json` dla nowych field labels
- Keys pattern: `studies.randomisation.list.field.*`

**Wymagane keys (4):**
```json
"studies.randomisation.list.field.block_identifier": "Block Identifier", 
"studies.randomisation.list.field.block_size": "Block Size",
"studies.randomisation.list.field.sequence_within_block": "Sequence Within Block",
"studies.randomisation.list.field.payload": "Payload"
```

### 4. Final Integration & Testing (Main Agent)
**Cel:** Integracja, weryfikacja i testy
**Zadania:**
- Weryfikacja wszystkich zmian
- Test sortowania nowych kolumn
- Test wyświetlania dla różnych typów randomization (blocks vs dynamic)
- Test visibility rules (double-blind vs open)
- Uruchomienie lint workflow
- Sprawdzenie responsive behavior

## Execution Strategy

### Parallel Execution (Steps 1-3):
- **api-requests-manager** + **react-component-creator** + **translation-manager** mogą pracować równolegle
- Main agent koordinuje i integruje zmiany

### Sequential (Step 4):
- Integration po zakończeniu wszystkich sub-tasks
- Testing i final validation

## Technical Considerations

### 1. Block Fields Availability  
```typescript
// Block fields - only for static randomizations
const showBlockFields = randomizationMethod === RandomisationMethod.Blocks
```

### 2. Column Ordering
Zachowaj logiczną kolejność kolumn zgodnie z US requirements.

### 3. Responsive Design
Update `getTableScrollWidth` function aby uwzględnić nowe kolumny.

## Files to Modify

1. **randomisationList.ts** (interfaces + parsing)
2. **ListTableConfig.tsx** (columns configuration)  
3. **ListTable.tsx** (potentially width calculations)
4. **en.json** (translations)

## Definition of Done
- [x] Wszystkie 4 brakujące kolumny wyświetlane
- [x] Sortowanie działa dla nowych kolumn  
- [x] Tłumaczenia dodane
- [x] Conditional display logic zaimplementowana (block fields)
- [x] Responsive design zachowany
- [x] Lint workflow przechodzi
- [x] Manual testing przeprowadzony