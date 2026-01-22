# Settings - Główne ustawienia aplikacji

## Lokalizacja w kodzie
- **Page component**: `Settings` w `frontend/apps/datacapt/src/pages/public/settings.tsx` (routing)
- **UI components**: 
  - `SettingsLayout` w `frontend/apps/datacapt/src/components/settings/SettingsLayout/SettingsLayout.tsx`
  - CSS klasy: `settings-layout`, `settings-layout__menu`, `settings-layout__content`

## Dostęp
- Z [[../main-menu|głównego menu]] → ósma opcja (ikona koła zębatego)
- URL pattern: `/en/settings/{section}`

## Struktura strony

### Menu boczne ustawień
**11 głównych sekcji konfiguracji:**

#### 1. [[personal-details|Personal details]] ✓ (aktywna domyślnie)
- **URL**: `/settings/personal-details`
- **Opis**: Dane osobowe użytkownika

#### 2. [[password|Password]]
- **URL**: `/settings/password-change`
- **Opis**: Zmiana hasła

#### 3. [[users|Users]]
- **URL**: `/settings/users`
- **Opis**: Zarządzanie użytkownikami organizacji

#### 4. [[roles|Roles]]
- **URL**: `/settings/roles`
- **Opis**: Konfiguracja ról i uprawnień

#### 5. [[centers|Centers]]
- **URL**: `/settings/centers`
- **Opis**: Zarządzanie centrami badawczymi

#### 6. [[templates|Templates]]
- **URL**: `/settings/templates`
- **Opis**: Szablony dokumentów i formularzy

#### 7. [[audit-trails|Audit trails]]
- **URL**: `/settings/audit-trails`
- **Opis**: Logi audytu i historia zmian

#### 8. [[compliance|Compliance]]
- **URL**: `/settings/compliance`
- **Opis**: Ustawienia zgodności z regulacjami

#### 9. [[translations|Translations]]
- **URL**: `/settings/translations`
- **Opis**: Zarządzanie tłumaczeniami

#### 10. [[customization|Customization]]
- **URL**: `/settings/customization`
- **Opis**: Personalizacja interfejsu

#### 11. [[api|API]]
- **URL**: `/settings/api-credentials`
- **Opis**: Konfiguracja API i integracji

### Strona Personal Details (domyślna)
**Formularz danych osobowych:**
- **First name**: Pole tekstowe z imieniem
- **Last name**: Pole tekstowe z nazwiskiem
- **Company**: Nazwa firmy/organizacji
- **E-mail**: Adres email (prawdopodobnie tylko do odczytu)
- **Language**: Dropdown wyboru języka (domyślnie English)

## Funkcjonalności
- **Zarządzanie profilem**: Edycja danych osobowych
- **Administracja użytkowników**: Dodawanie, edycja, role
- **Konfiguracja systemu**: Centra, szablony, compliance
- **Personalizacja**: Język, wygląd, tłumaczenia
- **Integracje**: API credentials i zewnętrzne systemy
- **Audyt**: Śledzenie zmian i działań użytkowników

## Uprawnienia
- Dostęp do poszczególnych sekcji może być ograniczony rolą
- Niektóre ustawienia tylko dla administratorów
- Personal details dostępne dla wszystkich użytkowników

## Dane dynamiczne
- Wszystkie dane ładowane z profilu użytkownika
- Lista języków z konfiguracji systemu
- Ustawienia organizacji są wspólne dla członków

## Powiązania
- Powrót do [[../main-menu|głównego menu]]
- Users połączone z [[../studies|badaniami]] (przypisanie do projektów)
- Centers używane w [[../recruitment-studies|rekrutacji]]
- Templates dla [[../subject-database|formularzy badanych]]
- API dla integracji z zewnętrznymi systemami