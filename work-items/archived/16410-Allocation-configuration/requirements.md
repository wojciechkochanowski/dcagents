# Allocation Configuration - Requirements

## Work Items

**Główny task:** 16410: Allocation configuration

**Powiązane work-items:**
- 18032: Access allocation configuration in readonly view 
- 17998: Access allocation configuration permission (readonly)
- 18035: Configure allocation from eCRF builder (POMINIĘTY - inna część aplikacji)
- 18031: Create an allocation configuration
- 18041: Edit allocation configuration permission
- 18033: Edit an allocation configuration

## Opis zadania

Implementacja kompleksowego systemu zarządzania konfiguracją alokacji w badaniach klinicznych. System ma umożliwić:

1. **Przeglądanie konfiguracji alokacji** w trybie tylko do odczytu
2. **Tworzenie nowych konfiguracji** alokacji
3. **Edycję istniejących konfiguracji** alokacji
4. **Zarządzanie uprawnieniami** (readonly vs edit)

## Acceptance Criteria

### 1. Access allocation configuration permission (17998)
- Uprawnienie do wyświetlania konfiguracji alokacji w trybie tylko do odczytu

### 2. Access allocation configuration in readonly view (18032) 
- Strona do przeglądania konfiguracji alokacji bez możliwości edycji

### 3. Edit allocation configuration permission (18041)
- Uprawnienie do pełnej edycji konfiguracji alokacji

### 4. Create an allocation configuration (18031)
- Funkcjonalność tworzenia nowych konfiguracji alokacji

### 5. Edit an allocation configuration (18033)
- Funkcjonalność edycji istniejących konfiguracji alokacji

## Miejsce implementacji

**Lokalizacja:** W istniejącej sekcji StudyRandomisationContent, jako nowy tab podobny do KitTypes.

**Ścieżka:** `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyRandomisationContent/`

## Istniejące podobne funkcjonalności

**Wzorzec:** StudyRandomisationKitTypes
- Lokalizacja: `StudyRandomisationContent/StudyRandomisationKitTypes/`
- Komponenty: główny komponent, tabela, modal edycji
- System uprawnień: `AclFeature.AllocationSettings` z `AclAction.Edit`

## Interfejsy (do zdefiniowania)

```typescript
interface AllocationConfiguration {
  id: string
  name: string
  description?: string
  type: string
  settings: Record<string, any>
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface AllocationConfigurationSorter {
  field: keyof AllocationConfiguration
  order: SorterOrder
}
```

## API Endpoints (do mockowania)

Wszystkie endpointy będą mockowane na początku:

```typescript
// GET /api/studies/{studyId}/allocation-configurations
fetchAllocationConfigurations(params: { studyId: string, sorter?: AllocationConfigurationSorter })

// POST /api/studies/{studyId}/allocation-configurations  
createAllocationConfiguration(params: { studyId: string, data: Partial<AllocationConfiguration> })

// PUT /api/studies/{studyId}/allocation-configurations/{id}
updateAllocationConfiguration(params: { studyId: string, id: string, data: Partial<AllocationConfiguration> })

// DELETE /api/studies/{studyId}/allocation-configurations/{id}
deleteAllocationConfiguration(params: { studyId: string, id: string, check?: boolean })
```

## Hierarchia komponentów

```
StudyRandomisationContent
├── StudyAllocationConfiguration/ (NOWY)
│   ├── index.ts
│   ├── StudyAllocationConfiguration.tsx (główny komponent)
│   ├── AllocationConfigurationTable/
│   │   ├── index.ts  
│   │   └── AllocationConfigurationTable.tsx
│   └── AllocationConfigurationEditModal/
│       ├── index.ts
│       └── AllocationConfigurationEditModal.tsx
```

## Uprawnienia

**Istniejące uprawnienia w AclFeature:**
- `AclFeature.Allocation` (line 88) - dostęp do alokacji
- `AclFeature.AllocationSettings` (line 89) - zarządzanie ustawieniami alokacji

**Użycie:**
- **Readonly**: `user.canAccess(AclFeature.Allocation)`
- **Edit**: `user.canDo(AclFeature.AllocationSettings)(AclAction.Edit)`

## Design

**Figma:** Link był podany ale node-id `26128-20242` nie działał poprawnie.
**Wzorzec:** Podobny interfejs do StudyRandomisationKitTypes - tabela z przyciskami akcji, modal edycji.

## Tłumaczenia

Dodać klucze do `common/intl/en.json` w sekcji `studies.randomisation.allocation_configuration`:

```json
{
  "studies.randomisation.allocation_configuration.title": "Allocation Configuration",
  "studies.randomisation.allocation_configuration.create": "Create Configuration",
  "studies.randomisation.allocation_configuration.edit": "Edit Configuration", 
  "studies.randomisation.allocation_configuration.delete_confirm": "Are you sure you want to delete this configuration?",
  "studies.randomisation.allocation_configuration.name": "Name",
  "studies.randomisation.allocation_configuration.description": "Description",
  "studies.randomisation.allocation_configuration.type": "Type",
  "studies.randomisation.allocation_configuration.settings": "Settings"
}
```
