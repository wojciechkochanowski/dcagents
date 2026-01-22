# Settings - API - Poświadczenia API

## Dostęp
- Z [[main-settings|głównych ustawień]] → API
- URL: `/en/settings/api-credentials`

## Lokalizacja w kodzie
- **Page component**: Routing przez `SettingsLayout`
- **UI components**:
  - `SettingsApiKeyContent` w `frontend/apps/datacapt/src/components/settings/SettingsApiKeyContent/SettingsApiKeyContent.tsx`
  - `SettingsApiKeyDeleteModal` - modal usuwania klucza API
  - `SettingsApiKeyRegenerateModal` - modal regeneracji klucza API
  - `DatacInfoRecord` - komponent wyświetlania klucza API
  - CSS klasy: `.api-key-content`, `.api-key-content__header`, `.api-key-content__body`

## Struktura strony

### Nagłówek
- **Tytuł**: "API Credentials"
- **Opis**: "Key used to access Datacapt APIs"

### Klucz API
**Sekcja główna:**
- **Ikona klucza**: Symbol bezpieczeństwa
- **Label**: "Key"
- **Wartość**: Zamaskowany klucz API (••••••••••••••••••••••••••••••••••••••••)
- **Przycisk**: "Regenerate" (ikona odświeżania)
- **Ikona oka**: Show/hide API key
- **Ikona kopiowania**: Copy to clipboard

### Dokumentacja API
**Informacje pomocnicze:**
- **Ikona info**: Niebieska ikona informacyjna
- **Link**: "The API document can be found at: http://localhost:8000/docs/public/"
- **Opis**: Dostęp do dokumentacji Swagger/OpenAPI

### Ostrzeżenie bezpieczeństwa
**Żółty panel ostrzegawczy:**
- **Nagłówek**: "Important"
- **Treść**: "keep your API key secure, as it can be used to access your data in Datacapt. Regenerating the key will revoke all previous access. Once the key has been regenerated, make sure to update it in all your applications, scripts, or services that utilize your API key. If you have any questions or encounter issues during the API key regeneration process, please don't hesitate to reach out to our support team for assistance and ensure the security of your account and data."

## Funkcjonalności
- **Generowanie kluczy**: Tworzenie nowych kluczy API
- **Regeneracja**: Unieważnienie starych kluczy
- **Kopiowanie**: Łatwe kopiowanie do schowka
- **Ukrywanie/pokazywanie**: Toggle visibility klucza
- **Dokumentacja**: Dostęp do API docs

## Przycisk "Regenerate"
**Proces regeneracji:**
- Potwierdzenie operacji (modal)
- Unieważnienie obecnego klucza
- Wygenerowanie nowego klucza
- Ostrzeżenie o konieczności aktualizacji w systemach

## Bezpieczeństwo
- **Maskowanie**: Klucz domyślnie ukryty
- **HTTPS only**: Wymagane bezpieczne połączenie
- **Rotacja kluczy**: Regularna zmiana
- **Access logging**: Śledzenie użycia API

## Dokumentacja API
- **Swagger UI**: Interaktywna dokumentacja
- **Endpoint reference**: Lista dostępnych API
- **Authentication examples**: Przykłady autoryzacji
- **Rate limiting**: Limity zapytań

## Uprawnienia
- Dostęp prawdopodobnie tylko dla administratorów i developerów
- Regeneracja może wymagać potwierdzenia
- Klucze osobiste vs. organizacyjne

## Przypadki użycia
- **Integracje**: Połączenie z zewnętrznymi systemami
- **Automatyzacja**: Skrypty i narzędzia CI/CD
- **Mobile apps**: Aplikacje mobilne
- **Third-party tools**: Narzędzia zewnętrzne

## Powiązania
- Powrót do [[main-settings|głównych ustawień]]
- API może eksportować dane z [[../studies|badań]]
- Integracja z [[../subject-database|bazą badanych]]
- Może być używane w [[../payment-orders|płatnościach]]
- Związane z [[audit-trails|logami dostępu]]