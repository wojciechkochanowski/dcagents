# Implementation Plan - Kit Status MVP (17662)

## Dostępni Sub-agenci

- **general-purpose** - zadania ogólne
- **api-requests-manager** - zarządzanie funkcjami API w ~/work/datacapt/frontend/apps/common/requests
- **react-component-creator** - tworzenie komponentów React
- **backend-api-analyzer** - analiza API Django backend
- **translation-manager** - zarządzanie plikami tłumaczeń
- **less-style-reviewer** - przegląd plików LESS

## Kolejność Implementacji

### Faza 1: Backend API (WYMAGANE NAJPIERW)

#### 1.1 Analiza Backend API Requirements
**Sub-agent**: `backend-api-analyzer`
**Zadanie**: 
- Przeanalizuj obecny endpoint zmiany statusów w `/allocations/kits` w `/Users/bartek/work/datacapt/backend/`
- jeśli endpoint istnieje określ dokładną strukturę request/response

**Deliverable**: Raport z wymaganiami dla nowego endpointu + przykładowa implementacja

**UWAGA**: Backend będzie implementowany przez inny zespół - musimy tylko określić wymagania!

### Faza 2: Frontend API Layer  

#### 2.1 Implementacja API Functions
**Sub-agent**: `api-requests-manager`
**Zadanie**:
- W pliku `/Users/bartek/work/datacapt/frontend/apps/common/requests/studies/randomisation/ipList.ts`
- Dodaj funkcję `changeKitStatus` wzorowaną na istniejącej `invalidIpRecords`
- Dodaj odpowiednie typy i interfejsy zgodnie z requirements.md
- Zastąp funkcję `invalidIpRecords` wywołaniem nowej funkcji z status="Invalid"
- Przetestuj struktur request/response handlers

**Wymaga raportu z backend-api-analyzer**

**Deliverable**: Gotowa funkcja API + typy TypeScript

### Faza 3: StatusChangeDrawer Component

#### 3.1 Utworzenie StatusChangeDrawer Component
**Sub-agent**: `react-component-creator`  
**Zadanie**:
- Utwórz komponent `StatusChangeDrawer.tsx` w `/Users/bartek/work/datacapt/frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyRandomisationContent/StudyRandomisationIpList/`
- Wykorzystaj projekty Figma:
  - Bulk: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25680-6406&m=dev
  - Single: https://www.figma.com/design/kD1GTWLjbBKmY9bo92lQlR/EDC-Platform--eCRF--ePRO--eConsent--Studies-?node-id=25680-4580&m=dev
- Komponent oparty na `DatacDrawer`, `DatacFormItem`, ant design radio,  `DatacButton`
- Props: `selectedItems`, `isBulkMode`, `currentStatuses`, `onSave`, `onClose`
- Logika filtrowania dostępnych statusów
- Form handling z `Form.useForm()`
- Error handling i success messages

**Wymaga gotowych API functions**

**Deliverable**: Gotowy komponent StatusChangeDrawer

#### 3.2 Logika przejść statusów  
**Sub-agent**: `react-component-creator`
**Zadanie**:
- W tym samym katalogu dodaj utility file `statusTransitions.ts`
- Funkcja `getAvailableStatusTransitions(currentStatus: IpRecordStatus): IpRecordStatus[]`
- Implementacja reguł z requirements.md
- Funkcja `getStatusColor(status: IpRecordStatus): string` z design tokens
- Eksport statusów jako options dla radio buttons

**Równoległe z 3.1**

**Deliverable**: Utility functions dla statusów

### Faza 4: Integracja w Tabeli 

#### 4.1 Modyfikacja Single Record Actions
**Sub-agent**: `react-component-creator`
**Zadanie**:
- Modyfikuj `/Users/bartek/work/datacapt/frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyRandomisationContent/StudyRandomisationIpList/IpListTable/IpListTableConfig.tsx`
- Zastąp akcję "invalidate" na "change status" w menu trzech kropek
- Dodaj nowy enum value do `IpTableActions`
- Modyfikuj `handleMenuClick` function
- Dodaj callback `onSingleStatusChange` w props komponentu
- Użyj ikony 'refresh-09' zamiast 'block-circle'

**Wymaga gotowego StatusChangeDrawer**

**Deliverable**: Zmodyfikowane menu akcji single record

#### 4.2 Modyfikacja Bulk Actions
**Sub-agent**: `react-component-creator`
**Zadanie**:
- Modyfikuj `/Users/bartek/work/datacapt/frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyRandomisationContent/StudyRandomisationIpList/StudyRandomisationIpList.tsx`
- Zastąp akcję "invalidate" na "change status" w `DatacBulkActionsBar`
- Dodaj state: `isStatusChangeDrawerOpened`, `statusChangeMode`
- Dodaj funkcję `onBulkStatusChange` zamiast `onBulkInvalidIps`
- Integruj `StatusChangeDrawer` w render
- Obsługuj success/error callbacks

**Równoległe z 4.1**

**Deliverable**: Zmodyfikowany bulk actions

### Faza 5: Tłumaczenia

#### 5.1 Dodanie Tłumaczeń
**Sub-agent**: `translation-manager`  
**Zadanie**:
- Dodaj nowe klucze z requirements.md do `/Users/bartek/work/datacapt/frontend/common/intl/en.json`
- Sprawdź i zaktualizuj istniejące klucze związane z invalidate/delete
- Upewnij się że tłumaczenia są użyte w komponentach
- Zachowaj flat structure plików tłumaczeń

**Można wykonać równolegle z innymi zadaniami**

**Deliverable**: Zaktualizowane tłumaczenia

### Faza 6: Finalizacja i Weryfikacja

#### 6.1 Finalne sprawdzenie i integracja
**Executor**: **Główny Agent** (nie sub-agent)
**Zadanie**:
- Sprawdź czy wszystkie komponenty działają razem
- Uruchom `/Users/bartek/work/datacapt/.claude/commands/fast-check.md` workflow
- Sprawdź zgodność z requirements.md - każdy scenariusz AC
- Przetestuj oba tryby: single record i bulk action
- Przetestuj różne przejścia statusów
- Sprawdź error handling i success messages
- Wykonaj lint check zgodnie z `/Users/bartek/work/datacapt/instructions/lint.md`

**Wymaga ukończenia wszystkich poprzednich zadań**

### 6.2 Dokumentacja problemów
**Executor**: **Główny Agent**
**Zadanie**:
- Zaktualizuj `issues.md` z problemami napotkanych podczas implementacji
- Zaktualizuj `bugs.md` z bugami i ich rozwiązaniami  
- Dodaj notatki w `todo.md` o zadaniach zostających do zrobienia (jeśli jakieś)

## Zadania które mogą być wykonane równolegle

### Grupa A (mogą działać razem):
- **Faza 2.1**: API Functions (api-requests-manager)
- **Faza 5.1**: Tłumaczenia (translation-manager)

### Grupa B (mogą działać razem - po ukończeniu API):
- **Faza 3.1**: StatusChangeDrawer (react-component-creator)
- **Faza 3.2**: Status transitions utility (react-component-creator)

### Grupa C (mogą działać razem - po ukończeniu Drawera):
- **Faza 4.1**: Single record actions (react-component-creator) 
- **Faza 4.2**: Bulk actions (react-component-creator)

## Dependencies

```
Faza 1 (Backend Analysis)
    ↓
Faza 2 (API Layer)
    ↓
Faza 3 (StatusChangeDrawer) ← Faza 5 (Tłumaczenia)
    ↓
Faza 4 (Table Integration)
    ↓  
Faza 6 (Finalizacja)
```

## Ryzyko i Uwagi

1. **Backend dependency**: Faza 1 musi określić czy backend endpoint już istnieje czy trzeba go stworzyć
2. **Figma access**: Sub-agenci muszą mieć dostęp do projektów Figma
3. **Status transition rules**: Upewnić się że logika biznesowa jest prawidłowa
4. **Error handling**: Każdy sub-agent musi implementować consistent error handling
5. **Design system**: Wszystkie komponenty muszą używać istniejących design tokens

## Success Criteria

- ✅ Bulk actions: zmiana statusu wielu IP jednocześnie
- ✅ Single record: zmiana statusu pojedynczego IP z ograniczeniami  
- ✅ Prawidłowe komunikaty success/error
- ✅ Audit trails działają automatycznie
- ✅ UI zgodne z projektami Figma
- ✅ Wszystkie scenariusze AC spełnione
- ✅ Kod zgodny z lintem i konwencjami projektu
