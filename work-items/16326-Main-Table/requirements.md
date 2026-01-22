# US 16326: Main Table - Requirements

## Task Description
Implementacja rozszerzenia istniejącej tabeli randomizacji o brakujące kolumny zgodnie z wymaganiami US 16326.

## Acceptance Criteria
- Lista filtrowana według centrów użytkownika ✅ (już zaimplementowane)
- Wyświetlanie per randomization ✅ (już zaimplementowane)
- Wszystkie kolumny sortowalne i przeszukiwalne ✅ (już zaimplementowane)
- Dostęp: RTSM section → Randomization list ✅ (już zaimplementowane)
- Audit trail: event "Randomization list" ✅ (już zaimplementowane)

### Wymagane kolumny w tabeli:
- ✅ Internal ID (unique system-generated, immutable integer from 1 by randomization)
- ✅ Subject ID
- ✅ Randomization ID  
- ✅ Strate 1/2 name/label (center if stratified by center or question Variable name)
- ✅ Treatment arm name (if not double-blind)
- ✅ **Treatment arm code (if not double-blind)** - JUŻ ZAIMPLEMENTOWANE
- ❌ **Block identifier** - BRAKUJE
- ❌ **Block size** - BRAKUJE
- ❌ **Sequence within block** - BRAKUJE
- ❌ **Payload (if any - string)** - BRAKUJE
- ✅ Randomized on (date)
- ✅ Randomized by (User name + surname)

## Backend API Analysis
**Dostępne pola w API (4 brakujące):**
- ~~`assigned_arm.code` → Treatment arm code~~ ✅ JUŻ ZAIMPLEMENTOWANE
- `block_identifier` → Block identifier  
- `block_size` → Block size
- `sequence_within_block` → Sequence within block
- `payload` → Payload

**API Endpoint:** `/api/randomizations/<pk>/subjects/`

## Frontend Implementation Areas

### 1. Interface Updates
**Lokalizacja:** `/Users/bartek/work/datacapt/frontend/common/requests/studies/randomisation/randomisationList.ts:62-71`

### 2. Column Configuration  
**Lokalizacja:** `/Users/bartek/work/datacapt/frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyRandomisationContent/StudyRandomisationList/ListTable/ListTableConfig.tsx:72-126`

### 3. Component Logic
**Lokalizacja:** `/Users/bartek/work/datacapt/frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyRandomisationContent/StudyRandomisationList/ListTable/ListTable.tsx`

## Business Logic Rules
- Lista filtrowana per centrum użytkownika
- Treatment arm code widoczny tylko gdy nie double-blind
- Block fields dostępne tylko dla static randomizations
- Payload wyświetlane tylko gdy dostępne

## Permissions
- **Permission key**: `randomization.list.access`
- Permission given at study level