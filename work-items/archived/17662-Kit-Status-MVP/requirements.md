# Requirements - Kit Status MVP (17662)

## Opis Zadania

**User Story**: Jako użytkownik chcę przypisać status (Received, In transfer, Available, Allocated, Invalid) do IP, żeby móc śledzić i zarządzać statusem każdego IP.

## Acceptance Criteria

### Scenariusz 1: Assign Status as Allocated
- **GIVEN** użytkownik jest na IP
- **WHEN** uczestnik otrzymał alokację
- **THEN** system powinien zaktualizować status wybranego IP na "Allocated"

### Scenariusz 2: Assign Status as Invalid
- **GIVEN** użytkownik jest na IP
- **WHEN** wybiera IP i przypisuje status "Invalid"
- **THEN** system powinien zaktualizować status wybranego IP na "Invalid"
- **AND** wyświetlić komunikat potwierdzający (np. "IP status successfully updated to Invalid")

### Scenariusz 5: Bulk Assign Status
- **GIVEN** użytkownik jest na liście IP
- **WHEN** wybiera wiele IP i przypisuje status (np. "Invalid")
- **THEN** system powinien zaktualizować wszystkie wybrane IP z wybranym statusem
- **AND** wyświetlić komunikat potwierdzający (np. "Statuses successfully updated for selected IPs")

### Scenariusz 6: Audit Trails
- **GIVEN** użytkownik może zmienić status
- **WHEN** zmienia status
- **THEN** śledzimy to w audit trails na poziomie badania
- **EVENT**: RTSM - ACTION - Kit number - Kit Status Status Updated to [status]

## Możliwe Przejścia Statusów

- In transfer → Received
- In transfer → Invalid
- Received → Available
- Received → In transfer
- Available → In transfer
- Available → Invalid (z każdego miejsca)
- Available → Allocated (automatycznie z eCRF)
- Allocated → Invalid (z każdego miejsca)

## Interfejsy i Typy

### Existing Types (Frontend)
```typescript
enum IpRecordStatus {
  Allocated = 'Allocated',
  Invalid = 'Invalid', 
  Available = 'Available',
  Received = 'Received',
  InTransfer = 'InTransfer'
}

interface IpRecord {
  id: string
  kitNumber: string
  location: string
  status: IpRecordStatus
  // inne pola...
}
```

### New API Interface
```typescript
interface ChangeKitStatusRequest {
  studyId: string
  mode: RandomisationListMode
  updates: Array<{
    kitId: string
    newStatus: IpRecordStatus
  }>
}

interface ChangeKitStatusResponse {
  success: boolean
  updatedKits: IpRecord[]
  errors?: string[]
}
```

## Endpointy Backend

### Nowy endpoint do implementacji
- **POST** `/allocations/kits/change-status`
- **Payload**: `{ mode: string, updates: [{ kit_id: string, status: string }] }`
- **Response**: Lista zaktualizowanych Kit obiektów
- **Auth**: Wymagane uprawnienia do modyfikacji Kit
- **Audit**: Automatyczne logowanie zmian statusu

### Istniejące endpointy
- **GET** `/allocations/kits/` - listowanie (już istnieje)
- **POST** `/allocations/kits/invalid` - invalidation (będzie zastąpiony)

## Komponenty UI

### Nowy komponent: StatusChangeDrawer
- Oparty na `DatacDrawer` z common/components
- Form z radio buttons do wyboru statusu
- Różne tryby: single record vs bulk action
- Walidacja i error handling

### Modyfikowane komponenty
1. **StudyRandomisationIpList.tsx** - bulk actions
2. **IpListTableConfig.tsx** - menu single record
3. **IpList.ts** - nowe API functions

## Design System i UI

### Figma projekty
- **Bulk Action**: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25680-6406&m=dev
- **Single Record**: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25680-4580&m=dev

### Komponenty design systemu
- `DatacDrawer` - kontener drawer'a
- `DsInputRadio` - radio buttons z kolorami
- `DatacButton` - przyciski Save/Cancel
- `DatacIcon` - ikona zamknięcia

### Kolory statusów
- In transfer: niebieski (`@fg-brand-primary`)
- Received: czerwony (`@fg-error-primary`)
- Invalid: czerwony (`@fg-error-primary`) 
- Available: zielony (`@fg-success-primary`)

## Tłumaczenia

### Nowe klucze (en.json)
```json
{
  "studies.randomisation.ip_list.change_status": "Change status",
  "studies.randomisation.ip_list.selected_kits": "SELECTED KITS",
  "studies.randomisation.ip_list.selected_kit": "SELECTED KIT", 
  "studies.randomisation.ip_list.select_new_status": "Select new status",
  "studies.randomisation.ip_list.status.in_transfer": "In transfer",
  "studies.randomisation.ip_list.status.received": "Received",
  "studies.randomisation.ip_list.status.invalid": "Invalid",
  "studies.randomisation.ip_list.status.available": "Available",
  "studies.randomisation.ip_list.status.allocated": "Allocated",
  "studies.randomisation.ip_list.change_status.success_single": "IP status successfully updated",
  "studies.randomisation.ip_list.change_status.success_multiple": "Statuses successfully updated for selected IPs"
}
```

## Logika Biznesowa

### Reguły przejść statusów
Funkcja `getAvailableStatusTransitions(currentStatus)` zwraca dozwolone statusy:
- TYLKO w single record mode
- W bulk mode zawsze wszystkie statusy dostępne

### Walidacja
- Wymagany wybór nowego statusu
- Sprawdzenie czy status jest różny od obecnego
- Uprawnienia użytkownika

## Error Handling

### Frontend
- `DatacMessage.genericError(intl, code)` dla błędów API
- `DatacMessage.success()` dla powiadomień sukcesu
- Reset state po operacjach

### Backend  
- Walidacja uprawnień
- Sprawdzenie czy Kit istnieje
- Logowanie błędów
- Audit trails dla wszystkich zmian

## Ograniczenia

### Co NIE jest w scope
- Testy jednostkowe (brak testów w projekcie)
- Automatyczne przejścia statusów (tylko ręczne)
- Historia zmian statusów (tylko audit trails)
- Powiadomienia email/push