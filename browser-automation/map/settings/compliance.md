# Settings - Compliance - Ustawienia zgodności

## Dostęp
- Z [[main-settings|głównych ustawień]] → Compliance
- URL: `/en/settings/compliance`

## Lokalizacja w kodzie
- **Page component**: Routing przez `SettingsLayout`
- **UI components**:
  - `SettingsPrivacyContent` w `frontend/apps/datacapt/src/components/settings/SettingsComplianceDetails/SettingsPrivacyContent/`
  - `SettingsPrivacyConsentModal` - modal dodawania/edycji zgód
  - `EditorOutput` - komponent wyświetlania treści zgód
  - CSS klasy: `.settings-privacy-content`, `.settings-privacy-content__header`, `.settings-privacy-content__consents`

## Struktura strony

### Nagłówek
- **Tytuł**: "Compliance Settings"
- **Przycisk**: "Edit" (niebieski, prawy górny róg)
- **Opis**: "This settings enables you to manage compliance settings and consents for your organization so that you adhere to the messaging compliance of your country."

### Sekcja Privacy Policy
**Informacje organizacyjne:**
- **Nagłówek**: "Privacy Policy"
- **Funkcja**: Konfiguracja polityki prywatności organizacji

### Data Privacy Settings
**Konfiguracja prywatności danych:**
- **Tytuł**: "Data Privacy Settings"
- **Opis**: "Easily add multiple opt-in to allow participants to sign up and create an account. Add your custom messaging and data privacy information according to your preferences."
- **Ikona**: Strzałka w prawo (prowadzi do szczegółów)

### Data Retention Rules
**Zasady przechowywania danych:**
- **Nagłówek**: "Data Retention Rules"

### Request Account Deletion
**Zarządzanie usuwaniem kont:**
- **Toggle switch**: Włączenie/wyłączenie funkcji
- **Opis**: "When this settings is enabled, subjects can request to have their account permanently deleted. When the subject send a request, you will receive an automatic notification to the provided email address. The subject status will be updated to 'Deletion Requested'. After examination you'll be able to permanently delete the account in the subject profile."
- **Stan**: Prawdopodobnie wyłączona (toggle w pozycji off)

## Funkcjonalności
- **Polityka prywatności**: Konfiguracja zgodnie z lokalnymi przepisami
- **Opt-in mechanizmy**: Zarządzanie zgodami uczestników
- **GDPR compliance**: Prawo do usunięcia danych
- **Retention policies**: Automatyczne usuwanie starych danych
- **Notification system**: Powiadomienia o żądaniach usunięcia

## Modal/Strona "Edit"
**Prawdopodobne opcje edycji:**
- **Privacy policy text**: Edytor tekstu polityki
- **Retention period**: Ustawienie czasu przechowywania
- **Email notifications**: Adresy do powiadomień
- **Country-specific settings**: Ustawienia regionalne

## Przepisy prawne
- **GDPR**: Europejskie przepisy o ochronie danych
- **HIPAA**: Amerykańskie przepisy medyczne
- **Local regulations**: Przepisy krajowe
- **GCP**: Good Clinical Practice

## Uprawnienia
- Dostęp prawdopodobnie tylko dla administratorów
- Zmiany wpływają na całą organizację
- Może wymagać weryfikacji prawnej

## Powiadomienia
- **Email alerts**: Żądania usunięcia kont
- **Compliance alerts**: Naruszenia zasad
- **Retention warnings**: Zbliżające się automatyczne usunięcia

## Powiązania
- Powrót do [[main-settings|głównych ustawień]]
- Związane z [[audit-trails|logami audytu]]
- Wpływa na [[../subject-database|zarządzanie badanymi]]
- Konfiguracja dla [[../recruitment-studies|rekrutacji]]
- Polityki w [[../study/econsent-forms|formularzach zgód]]