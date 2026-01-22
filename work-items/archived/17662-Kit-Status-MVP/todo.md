# TODO List - Kit Status MVP (17662)

## ✅ Planning & Research
- [x] Research zadania z task-research-specialist  
- [x] Analiza kodu frontendu w miejscach modyfikacji
- [x] Analiza projektów Figma dla drawera zmiany statusu
- [x] Stworzenie planu implementacji

## 🔄 Backend API (Wymagane najpierw)
- [x] **1.1** Analiza Backend API Requirements (`backend-api-analyzer`)
  - Przeanalizuj endpoint `/allocations/kits/invalid` 
  - Sprawdź model `Kit` i enum `AllocationStatus`
  - Określ wymagania dla nowego endpointu `change-status`
  - Sprawdź audit trails w allocation views

## 🔄 Frontend API Layer
- [x] **2.1** Implementacja API Functions (`api-requests-manager`)
  - Dodaj funkcję `changeKitStatus` w ipList.ts
  - Dodaj typy i interfejsy
  - Zastąp `invalidIpRecords` wywołaniem nowej funkcji
  - Przetestuj request/response handlers

## 🔄 StatusChangeDrawer Component  
- [x] **3.1** Utworzenie StatusChangeDrawer Component (`react-component-creator`)
  - Utwórz `StatusChangeDrawer.tsx`
  - Wykorzystaj projekty Figma (bulk + single)
  - Komponent oparty na `DatacDrawer`, `DsInputRadio`, `DatacButton`
  - Form handling z `Form.useForm()`
  
- [x] **3.2** Logika przejść statusów (`react-component-creator`)
  - Dodaj utility file `statusTransitions.ts`
  - Funkcja `getAvailableStatusTransitions()`
  - Funkcja `getStatusColor()`
  - Status options dla radio buttons

## 🔄 Integracja w Tabeli
- [x] **4.1** Modyfikacja Single Record Actions (`react-component-creator`)
  - Modyfikuj `IpListTableConfig.tsx`
  - Zastąp "invalidate" na "change status" w menu trzech kropek
  - Dodaj callback `onSingleStatusChange`
  - Użyj ikony 'edit'/'pencil'

- [x] **4.2** Modyfikacja Bulk Actions (`react-component-creator`)  
  - Modyfikuj `StudyRandomisationIpList.tsx`
  - Zastąp "invalidate" na "change status" w `DatacBulkActionsBar`
  - Dodaj state dla drawer'a
  - Funkcja `onBulkStatusChange`
  - Integruj `StatusChangeDrawer`

## 🔄 Tłumaczenia
- [x] **5.1** Dodanie Tłumaczeń (`translation-manager`)
  - Dodaj nowe klucze do en.json
  - Sprawdź istniejące klucze związane z invalidate
  - Zachowaj flat structure

## 🔄 Finalizacja
- [ ] **6.1** Finalne sprawdzenie i integracja (główny agent)
  - Sprawdź działanie wszystkich komponentów
  - Uruchom fast-check workflow  
  - Sprawdź zgodność z requirements.md
  - Przetestuj oba tryby: single + bulk
  - Przetestuj przejścia statusów
  - Sprawdź error handling i success messages
  - Lint check

- [ ] **6.2** Dokumentacja problemów (główny agent)
  - Zaktualizuj issues.md z problemami
  - Zaktualizuj bugs.md z bugami i rozwiązaniami
  - Dodaj notatki w todo.md o pozostałych zadaniach

## 📋 Zadania równoległe

### Grupa A (mogą działać razem):
- Zadanie 2.1 + Zadanie 5.1

### Grupa B (po ukończeniu API):  
- Zadanie 3.1 + Zadanie 3.2

### Grupa C (po ukończeniu Drawera):
- Zadanie 4.1 + Zadanie 4.2

## ⚠️ Dependencies & Notes

- Backend analysis (1.1) → API functions (2.1) → Components (3.x) → Integration (4.x) → Finalization (6.x)
- Translations (5.1) can run parallel with most tasks
- All sub-agents need access to Figma projects
- Each component must use consistent error handling patterns
- Must follow existing code conventions and design system