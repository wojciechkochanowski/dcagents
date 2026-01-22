# Moduł SETTINGS - Ustawienia systemu

## Lokalizacja

`frontend/apps/datacapt/src/components/settings/`

## Opis modułu

Centralny moduł zarządzania konfiguracją całego systemu Datacapt. Obsługuje ustawienia użytkowników, ról, organizacji, bezpieczeństwa i integracji.

## Struktura komponentów (12 głównych grup)

### 🏗️ **SettingsLayout** - Layout ustawień

**Lokalizacja**: `SettingsLayout/`

- **SettingsLayout.tsx/less** - Główny layout z sidebar nawigacyjny

### 👥 **SettingsUsersContent** - Zarządzanie użytkownikami

**Lokalizacja**: `SettingsUsersContent/`

#### **Główny komponent**

- **SettingsUsersContent.tsx/less** - Lista i zarządzanie użytkownikami

#### **Modalne użytkowników**

##### **SettingsUsersInviteModal/** - Zapraszanie nowych użytkowników

##### **SettingsUsersEditModal/** - Edycja danych użytkownika

##### **SettingsUsersDeleteModal/** - Usuwanie użytkownika

##### **SettingsUsersLockModal/** - Blokowanie konta

##### **SettingsUsersUnlockModal/** - Odblokowywanie konta

### 🔐 **SettingsRolesContent** - Zarządzanie rolami

**Lokalizacja**: `SettingsRolesContent/`

#### **Komponenty ról**

- **SettingsRolesContent.tsx/less** - Zarządzanie rolami i uprawnieniami

##### **SettingsRolesTable/** - Tabela ról

##### **SettingsRolesAddModal/** - Dodawanie nowej roli

##### **SettingsRolesViewAndEdit/** - Przeglądanie i edycja uprawnień

### 🏥 **SettingsCentersContent** - Ośrodki badawcze

**Lokalizacja**: `SettingsCentersContent/`

#### **Zarządzanie ośrodkami**

- **SettingsCentersContent.tsx/less** - Lista ośrodków badawczych

##### **SettingsCentersTable/** - Tabela ośrodków

##### **SettingsCentersAddModal/** - Dodawanie ośrodka

##### **SettingsCentersArchiveModal/** - Archiwizowanie

##### **SettingsCenterDetails/** - Szczegóły ośrodka

### 📄 **SettingsTemplatesContent** - Szablony

**Lokalizacja**: `SettingsTemplatesContent/`

#### **System szablonów**

- **SettingsTemplatesContent.tsx/less** - Zarządzanie szablonami

##### **SettingsTemplatesTable/** - Tabela szablonów

##### **SettingsTemplatesImportModal/** - Import szablonów

##### **TemplateTags/** - System tagów

### 🔑 **SettingsApiKeyContent** - Klucze API

**Lokalizacja**: `SettingsApiKeyContent/`

#### **Zarządzanie kluczami**

- **SettingsApiKeyContent.tsx/less** - Klucze API i integracje

##### **SettingsApiKeyDeleteModal/** - Usuwanie klucza

##### **SettingsApiKeyRegenerateModal/** - Regenerowanie klucza

### 📋 **SettingsAuditTrailsContent** - Ścieżki audytu

**Lokalizacja**: `SettingsAuditTrailsContent/`

- **SettingsAuditTrailsContent.tsx/less** - Przeglądanie logów audytu

### 🎨 **SettingsCustomisationContent** - Personalizacja

**Lokalizacja**: `SettingsCustomisationContent/`

- **SettingsCustomisationContent.tsx/less** - Konfiguracja wyglądu i brandingu

### 🔒 **SettingsPasswordChangeContent** - Zarządzanie hasłami

**Lokalizacja**: `SettingsPasswordChangeContent/`

#### **Bezpieczeństwo**

- **SettingsPasswordChangeContent.tsx/less** - Zmiana hasła i MFA

##### **SettingsEnableMfaModal/** - Włączenie MFA

##### **SettingsDisableMfaModal/** - Wyłączenie MFA

### 👤 **SettingsPersonalDetails** - Dane osobowe

**Lokalizacja**: `SettingsPersonalDetails/`

- **SettingsPersonalDetails.tsx/less** - Edycja danych osobowych użytkownika

### 🌐 **SettingsTranslationsContent** - Tłumaczenia

**Lokalizacja**: `SettingsTranslationsContent/`

- **SettingsTranslationsContent.tsx/less** - Zarządzanie tłumaczeniami systemu

### ⚖️ **SettingsComplianceDetails** - Zgodność z przepisami

**Lokalizacja**: `SettingsComplianceDetails/`

#### **Compliance i prywatność**

- **SettingsComplianceDetails.tsx/less** - Ustawienia zgodności

##### **SettingsPrivacyContent/** - Ustawienia prywatności

## Integracje wewnętrzne

### **Shared components**

- **UsersTable** - tabele użytkowników
- **AuditTrails** - komponenty audytu
- **TranslationsLists** - zarządzanie tłumaczeniami

### **Auth integration**

- Synchronizacja z modułem `auth/`
- Zarządzanie sesjami i uprawnieniami

## Kluczowe funkcjonalności

### **User Management**

- **RBAC** - Role-Based Access Control
- **User lifecycle** - pełen cykl życia użytkownika
- **Bulk operations** - operacje masowe
- **MFA support** - dwuskładnikowa autoryzacja

### **Organization Management**

- **Multi-tenant** - obsługa wielu organizacji
- **Center management** - zarządzanie ośrodkami
- **Hierarchical permissions** - uprawnienia hierarchiczne

### **System Configuration**

- **Branding** - personalizacja wyglądu
- **Templates** - zarządzanie szablonami
- **API keys** - klucze integracji
- **Audit logs** - pełne logowanie

### **Compliance & Security**

- **GDPR compliance** - zgodność z RODO
- **Data retention** - zasady retencji
- **Privacy controls** - kontrola prywatności
- **Security policies** - polityki bezpieczeństwa

## API Endpoints

- `common/requests/generalSettings/` - główne ustawienia
- `common/requests/auth.ts` - autoryzacja i użytkownicy

## Przepływy użytkowania

### **Zarządzanie użytkownikami**

1. SettingsLayout → SettingsUsersContent
2. Lista użytkowników → akcje (invite/edit/delete)
3. Modalne → formularz → zapisz

### **Konfiguracja ról**

1. SettingsRolesContent → SettingsRolesTable
2. Dodaj/edytuj rolę → SettingsRolesViewAndEdit
3. Definiuj uprawnienia → zapisz

### **Ustawienia organizacji**

1. SettingsCentersContent → zarządzanie ośrodkami
2. SettingsTemplatesContent → szablony
3. SettingsCustomisationContent → branding
