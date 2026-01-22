# Settings - Users - Zarządzanie użytkownikami

## Dostęp
- Z [[main-settings|głównych ustawień]] → Users
- URL: `/en/settings/users`

## Lokalizacja w kodzie
- **Page component**: Routing przez `SettingsLayout`
- **UI components**:
  - `SettingsUsersContent` w `frontend/apps/datacapt/src/components/settings/SettingsUsersContent/SettingsUsersContent.tsx`
  - `UsersTable` w `frontend/apps/datacapt/src/components/shared/UsersTable/UsersTable.tsx`
  - Modały: `SettingsUsersInviteModal`, `SettingsUsersEditModal`, `SettingsUsersDeleteModal`, `SettingsUsersLockModal`, `SettingsUsersUnlockModal`
  - CSS klasy: `users-content`, `users-table`

## Struktura strony

### Nagłówek
- **Tytuł**: "Users"
- **Przycisk**: "Invite users" (niebieski, prawy górny róg)

### Funkcje zarządzania
- **Search users**: Pasek wyszukiwania użytkowników
- **Filters**: Przycisk filtrowania z dropdown menu

### Tabela użytkowników
**Kolumny:**
- **USER**: Dane użytkownika (imię, nazwisko, email)
- **COMPANY**: Firma/organizacja
- **PLATFORM ACTIONS**: Akcje dostępne dla użytkownika
- **[Dodatkowe kolumny]**: W zależności od konfiguracji

### Stan danych
- **Komunikat**: "No data" (brak użytkowników lub brak uprawnień)
- **Paginacja**: "0-0 of 0"
- **Opcje**: "25 / page" dropdown

## Funkcjonalności
- **Zapraszanie użytkowników**: Modal/formularz zaproszenia
- **Wyszukiwanie**: Filtrowanie listy użytkowników
- **Zarządzanie rolami**: Przypisywanie uprawnień
- **Akcje masowe**: Operacje na wielu użytkownikach
- **Filtrowanie**: Według ról, statusów, firm

## Modal "Invite users"
**Prawdopodobna struktura formularza:**
- **Email**: Adres email nowego użytkownika
- **Role**: Wybór roli z dropdown
- **Company**: Przypisanie do firmy
- **Centers**: Dostęp do centrów badawczych
- **Przyciski**: Cancel | Send invitation

## Uprawnienia
- Dostęp prawdopodobnie tylko dla administratorów
- Możliwość zarządzania użytkownikami w swojej organizacji
- Różne poziomy uprawnień (view/edit/admin)

## Dane dynamiczne
- Lista użytkowników ładowana z backendu
- Filtrowanie według ról i statusów
- Stan "No data" może oznaczać brak uprawnień lub pustą organizację

## Powiązania
- Powrót do [[main-settings|głównych ustawień]]
- Użytkownicy przypisywani do [[../studies|badań]]
- Role konfigurowane w [[roles|sekcji Roles]]
- Centra z [[centers|sekcji Centers]]