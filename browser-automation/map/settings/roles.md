# Settings - Roles - Zarządzanie rolami

## Dostęp
- Z [[main-settings|głównych ustawień]] → Roles
- URL: `/en/settings/roles`

## Lokalizacja w kodzie
- **Page component**: Routing przez `SettingsLayout`
- **UI components**:
  - `SettingsRolesContent` w `frontend/apps/datacapt/src/components/settings/SettingsRolesContent/`
  - `SettingsRolesTable` - tabela z listą ról
  - `SettingsRolesAddModal` - modal dodawania nowej roli
  - `SettingsRolesViewAndEdit` - widok szczegółów i edycji roli
  - CSS klasy: `.settings-roles-content`, `.settings-roles-content__header`, `.settings-roles-content__header-controls`

## Struktura strony

### Nagłówek
- **Tytuł**: "Roles"
- **Przycisk**: "Add new role" (niebieski, prawy górny róg)

### Tabela ról
**Kolumny:**
- **ROLE**: Nazwa roli
- **USERS**: Liczba użytkowników przypisanych do roli
- **[Akcje]**: Menu akcji (prawdopodobnie ikona trzech kropek)

### Lista ról systemowych
**Przykładowe role (z fixtures):**
- **ADMIN**: 1 użytkownik
- **AUDITOR**: 0 użytkowników
- **DATA_MANAGER**: 0 użytkowników
- **INVESTIGATOR**: 0 użytkowników
- **MAIN_INVESTIGATOR**: 0 użytkowników
- **MONITOR**: 0 użytkowników
- **PROJECT_MANAGER**: 0 użytkowników

### Paginacja
- **Wyniki**: "1-7 of 7" (wszystkie role na jednej stronie)
- **Opcje**: "25 / page" dropdown

## Funkcjonalności
- **Tworzenie ról**: Modal "Add new role" z uprawnieniami
- **Edycja ról**: Modyfikacja istniejących ról
- **Zarządzanie uprawnieniami**: Przypisanie konkretnych permisji
- **Podgląd użytkowników**: Lista użytkowników w danej roli
- **Usuwanie ról**: (jeśli nie ma przypisanych użytkowników)

## Modal "Add new role"
**Prawdopodobna struktura:**
- **Role name**: Nazwa nowej roli
- **Description**: Opis roli
- **Permissions**: Lista checkboxów z uprawnieniami
- **Przyciski**: Cancel | Save

## Uprawnienia systemowe
**Kategorie uprawnień (prawdopodobne):**
- Studies management
- User management  
- Data access
- Export capabilities
- Admin functions

## Uprawnienia dostępu
- Dostęp prawdopodobnie tylko dla administratorów
- ADMIN może zarządzać wszystkimi rolami
- Wpływa na dostęp do funkcji w całej aplikacji

## Powiązania
- Powrót do [[main-settings|głównych ustawień]]
- Role przypisywane w [[users|zarządzaniu użytkownikami]]
- Wpływa na dostęp do [[../studies|badań]]
- Kontroluje uprawnienia w [[../subject-database|bazie badanych]]
- Używane przy [[../recruitment-studies|rekrutacji]]