# SZCZEGÓŁOWY PLAN IMPLEMENTACJI - KIT TYPES MANAGEMENT

## OVERVIEW
Implementacja zarządzania typami kitów (Kit Types Management) w aplikacji testów klinicznych zgodnie z projektem Figma i wymaganiami AC. Nowa funkcjonalność zostanie dodana jako zakładka w sekcji Study → Randomization.

---

## FAZA 1: INFRASTRUKTURA API (SUB-AGENT 1)
**Cel:** Implementacja komunikacji frontend ↔ backend
**Priorytet:** KRYTYCZNY | **Czas:** 2-3h

### 1.1 Interfejsy TypeScript
**Plik:** `frontend/common/requests/studies/randomisation/kitTypes.ts`

**Zadania:**
- Definicja interfejsów na podstawie backend API:
  ```typescript
  interface KitType {
    id: number
    code: number
    label: string
    description: string
  }
  
  interface CreateKitTypeRequest {
    label: string
    description: string
  }
  ```

- Implementacja funkcji API:
  - `fetchKitTypes(studyId: string)` → GET `/allocations/kit-types/`
  - `createKitType(studyId: string, data: CreateKitTypeRequest)` → POST
  - `editKitType(studyId: string, id: number, data: EditKitTypeRequest)` → PATCH
  - `deleteKitType(studyId: string, id: number)` → DELETE

- Error handling dla kodów:
  - `ALLOCATION_KIT_TYPE_LABEL_EXISTS`
  - `STUDY_STATUS_NOT_DRAFT`
  - `ALLOCATION_KIT_TYPE_USED_IN_PRODUCTION_KITS`

- Response handlers z callback-ami (success/error pattern z aplikacji)

### 1.2 Rozszerzenie tłumaczeń
**Plik:** `frontend/common/intl/en.json`

**Nowe klucze:**
```json
{
  "studies.randomisation.kit_types.title": "Kit types configuration",
  "studies.randomisation.kit_types.empty_state.title": "No kit types added yet",
  "studies.randomisation.kit_types.empty_state.subtitle": "Create your first kit",
  "studies.randomisation.kit_types.add_new": "Add new kit type",
  "studies.randomisation.kit_types.create": "Create kit type",
  "studies.randomisation.kit_types.edit": "Edit kit type",
  "studies.randomisation.kit_types.form.label": "Label",
  "studies.randomisation.kit_types.form.description": "Description",
  "studies.randomisation.kit_types.created": "Kit type created successfully",
  "studies.randomisation.kit_types.updated": "Kit type updated successfully",
  "studies.randomisation.kit_types.deleted": "Kit type deleted successfully",
  "studies.randomisation.kit_types.column.id": "ID",
  "studies.randomisation.kit_types.column.label": "Label",
  "studies.randomisation.kit_types.column.description": "Description"
}
```

---

## FAZA 2: NAWIGACJA I STRUKTURA (SUB-AGENT 2)
**Cel:** Dodanie nowej zakładki w StudyRandomisationContent
**Priorytet:** WYSOKI | **Czas:** 1-2h

### 2.1 Rozszerzenie nawigacji
**Plik:** `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyRandomisationContent/StudyRandomisationContent.tsx`

**Zadania:**
- Dodanie nowej zakładki "Kit types configuration"
- Rozszerzenie enum-a z zakładkami (StudyRandomisationContentTab)
- Implementacja routing-u dla nowej zakładki
- Import i integracja komponentu StudyRandomisationKitTypes

### 2.2 Struktura folderów
**Utworzenie struktury:**
```
StudyRandomisationContent/
├── StudyRandomisationKitTypes/
│   ├── StudyRandomisationKitTypes.tsx
│   ├── StudyRandomisationKitTypes.less  
│   ├── KitTypeTable/
│   │   ├── KitTypeTable.tsx
│   │   ├── KitTypeTableConfig.tsx
│   │   └── index.ts
│   ├── KitTypeEditModal/
│   │   ├── KitTypeEditModal.tsx
│   │   ├── KitTypeEditModal.less
│   │   └── index.ts
│   └── index.ts
```

**Wzorce z istniejących komponentów:**
- Struktura podobna do `StudyRandomisationIpList`
- Konsystentne nazewnictwo i organizacja plików

---

## FAZA 3: GŁÓWNY KOMPONENT LISTY (SUB-AGENT 3)
**Cel:** Implementacja widoku listy kit types z empty state
**Priorytet:** WYSOKI | **Czas:** 2-3h

### 3.1 StudyRandomisationKitTypes
**Funkcjonalności:**
- React hook do pobierania listy kit types (`useEffect` + `fetchKitTypes`)
- State management: `loading`, `error`, `kitTypes[]`
- Obsługa empty state zgodnie z Figmą
- Integracja z system uprawnień (`canEdit` prop)
- Refresh po operacjach CRUD (callback pattern)
- Error boundary i error display

### 3.2 Empty State Component
**Figma Design:** https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=26089-5114&m=dev

**Zgodność z Figmą:**
- Ikona pakietu (Ant Design icon)
- Komunikat "No kit types added yet"
- Subtitle "Create your first kit"
- CTA button "Add new kit type"
- Centrowane layout
- Responsive design

**Komponent z warunkiem:**
```typescript
{kitTypes.length === 0 && !loading ? (
  <EmptyState onAddClick={() => setCreateModalVisible(true)} />
) : (
  <KitTypeTable 
    data={kitTypes} 
    onEdit={handleEdit}
    onDelete={handleDelete}
    canEdit={canEdit}
  />
)}
```

---

## FAZA 4: TABELA KIT TYPES (SUB-AGENT 4)
**Cel:** Implementacja tabeli z danymi i akcjami
**Priorytet:** WYSOKI | **Czas:** 3-4h

### 4.1 KitTypeTable
**Figma Design:** https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25860-4894&m=dev

**Kolumny (zgodnie z Figmą):**
- **ID**: `kit.code` (auto-generated number)
- **Label**: `kit.label` z sortowaniem
- **Description**: `kit.description` z truncation
- **Actions**: Dropdown menu (Edit/Delete)

**Funkcjonalności:**
- `DatacTable` component z aplikacji
- Sortowanie po Label i ID
- Loading states podczas operacji
- Empty rows handling
- Responsive column widths

### 4.2 KitTypeTableConfig
**Figma Design (Action Menu):** https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25860-5097&m=dev

**Action menu implementacja:**
- Edit action (tylko dla `canEdit` users)
- Delete action z `DatacPopconfirm`
- Ikony: 'edit', 'trash' (zgodnie z design system)
- Error handling na poziomie tabeli
- Success messages po operacjach

**Wzorce z IpListTable:**
```typescript
const menuOptions: DatacDropdownMenuOptions<KitTypeActions> = [
  canEdit && {
    type: KitTypeActions.Edit,
    label: 'common.edit',
    icon: 'edit',
  },
  canEdit && {
    type: KitTypeActions.Delete,
    label: 'common.delete',
    icon: 'trash',
  },
].filter(Boolean)
```

---

## FAZA 5: MODAL TWORZENIA/EDYCJI (SUB-AGENT 5)
**Cel:** Implementacja formularza CRUD
**Priorytet:** WYSOKI | **Czas:** 3-4h

### 5.1 KitTypeEditModal
**Figma Design (Create):** https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25860-5522&m=dev
**Figma Design (Edit):** https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25860-5775&m=dev

**Funkcjonalności:**
- Uniwersalny modal (create + edit mode)
- `DatacModal` component
- `Form.useForm()` z Ant Design
- Auto-focus na pierwszym polu
- Loading state podczas zapisywania (`isSaving`)
- `DatacModalCancelConfirmFooter`

**Props interface:**
```typescript
interface Props {
  itemToEdit?: KitType | null  // null = create mode
  onClose: () => void
  onSuccess: () => void  // refresh parent list
}
```

### 5.2 Form fields i validation
**Fields:**
- **Label**: `DsInputText`, required, max 50 chars
- **Description**: `DsInputTextArea`, optional, max 250 chars

**Client-side validation:**
- Required field validation
- Length constraints
- Real-time validation feedback
- Submit button disable podczas validation errors

**Server-side error handling:**
- Duplicate label errors → form field error
- Study status restrictions → general error message
- Network errors → `DatacMessage.genericError`

**Figma Design (Success Message):** https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25860-6394&m=dev
**Figma Design (Delete Confirmation - Dummy):** https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25891-4721&m=dev
**Figma Design (Delete Confirmation - Prod):** https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25891-5272&m=dev

**Form pattern z aplikacji:**
```typescript
const onSubmit = (formData: CreateKitTypeRequest) => {
  setIsSaving(true)
  const apiCall = itemToEdit ? editKitType : createKitType
  
  apiCall(studyId, formData, {
    onSuccess: () => {
      setIsSaving(false)
      onClose()
      onSuccess() // refresh parent
      DatacMessage.success(intl, 'kit_types.created')
    },
    onRequestError: (code) => {
      DatacMessage.genericError(intl, code)
      setIsSaving(false)
    }
  })
}
```

---

## FAZA 6: INTEGRACJA I UPRAWNIENIA (GŁÓWNY AGENT)
**Cel:** Połączenie wszystkich komponentów i testing
**Priorytet:** ŚREDNI | **Czas:** 2-3h

### 6.1 Permissions integration
**System uprawnień:**
- `event: kit_types, action: access` → readonly view
- `event: kit_types, action: edit` → full CRUD operations

**Implementation:**
```typescript
const canAccess = hasPermission('kit_types', 'access')
const canEdit = hasPermission('kit_types', 'edit')

// Hide components bez uprawnień
{canEdit && <Button onClick={openCreateModal}>Add new</Button>}
```

### 6.2 End-to-end integration testing
**Test scenarios:**
1. **Empty state flow**: Brak danych → CTA → Create modal → Success → Lista
2. **CRUD operations**: Create → Edit → Delete z proper refreshing
3. **Error scenarios**: Duplicates, unauthorized, network errors
4. **Permissions**: Readonly vs edit user experience
5. **Responsive design**: Mobile/tablet/desktop layouts

### 6.3 State synchronization
- Modal close/open state management
- Lista refresh po każdej operacji
- Loading states synchronization
- Error state recovery

---

## FAZA 7: FINALIZACJA I POLISH (GŁÓWNY AGENT)  
**Cel:** Dopracowanie szczegółów i final testing
**Priorytet:** NISKI | **Czas:** 1-2h

### 7.1 UI/UX polish
**Design system compliance:**
- Spacing zgodny z 8px grid
- Colors z design tokens
- Typography (TT Commons family)
- Icons consistency
- Button styles i hover states

**Responsive behavior:**
- Mobile-first approach
- Table horizontal scroll na mobile
- Modal responsiveness
- Touch-friendly controls

### 7.2 Performance i edge cases
**Optimizations:**
- Lazy loading dla dużych list
- Debounced search (jeśli będzie potrzebne)
- Memo dla expensive re-renders

**Edge cases:**
- Empty API responses
- Network timeouts
- Concurrent user modifications
- Browser refresh recovery
- Deep linking support

---

## HARMONOGRAM REALIZACJI

### Strategia równoległego wykonania:
1. **FAZA 1 + FAZA 2** (równolegle) → 3h total
2. **FAZA 3** → **FAZA 4** (sekwencyjnie) → 5-7h total
3. **FAZA 5** (równolegle z FAZA 4) → 3-4h
4. **FAZA 6** (integracja przez głównego agenta) → 2-3h  
5. **FAZA 7** (finalizacja przez głównego agenta) → 1-2h

**CAŁKOWITY CZAS:** 14-19 godzin  
**Z OPTYMALIZACJĄ:** 10-12 godzin

---

## DEFINICJE SUB-AGENTÓW

### Sub-agent 1: "API Integration Specialist"
**Kompetencje:** TypeScript interfaces, fetchApi patterns, error handling
**Zadania:** Implementacja warstwy komunikacji z backend API
**Narzędzia:** TypeScript, fetchApi, response handlers

### Sub-agent 2: "Navigation & Structure Expert"  
**Kompetencje:** React component architecture, routing, folder organization
**Zadania:** Rozszerzenie nawigacji i utworzenie struktury folderów  
**Narzędzia:** React components, file system, imports/exports

### Sub-agent 3: "UI State Manager"
**Kompetencje:** React hooks, state management, empty state patterns
**Zadania:** Implementacja głównego komponentu z lifecycle management
**Narzędzia:** useState, useEffect, loading patterns, conditional rendering

### Sub-agent 4: "Table Component Specialist"
**Kompetencje:** DatacTable, sorting, action menus, dropdown interactions
**Zadania:** Implementacja tabeli z danymi i operacjami CRUD
**Narzędzia:** Ant Design Table, DatacDropdownMenu, DatacPopconfirm

### Sub-agent 5: "Form & Modal Expert"
**Kompetencje:** Form validation, modal dialogs, user input handling
**Zadania:** Implementacja universal modal z formularzem
**Narzędzia:** Ant Design Form, DatacModal, validation patterns

---

## KRYTERIA SUKCESU

### Funkcjonalne:
- ✅ Wszystkie operacje CRUD działają poprawnie
- ✅ Empty state prawidłowo wyświetlany
- ✅ Formularze z proper validation
- ✅ Error handling i success messages
- ✅ Permissions system zintegrowany

### Techniczne:
- ✅ UI zgodne w 100% z projektem Figma
- ✅ Responsive design na wszystkich urządzeniach  
- ✅ No console errors ani warnings
- ✅ TypeScript bez any types
- ✅ Audit trail events rejestrowane

### UX:
- ✅ Intuitive user flow
- ✅ Loading states dla wszystkich async operations
- ✅ Proper focus management w modalach
- ✅ Accessibility compliance (ARIA labels, keyboard navigation)
- ✅ Consistent messaging i feedback

---

## RYZYKA I MITIGATION

### Wysokie ryzyko:
- **Backend API changes**: Regular sync z backend teamem
- **Permission system complexity**: Early integration testing

### Średnie ryzyko:  
- **Figma design changes**: Frequent design reviews
- **Performance z dużymi datasets**: Lazy loading implementation

### Niskie ryzyko:
- **Browser compatibility**: Standardowe React patterns
- **Responsive issues**: Mobile-first approach

---

## POST-IMPLEMENTATION

### Monitoring:
- User adoption metrics
- Error rate monitoring  
- Performance metrics (load times)

### Future enhancements:
- Search/filter functionality
- Bulk operations
- Export/import features
- Advanced validation rules

### Documentation:
- Component documentation updates
- API documentation sync
- User guide updates