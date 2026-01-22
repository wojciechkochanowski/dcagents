# Settings - Password - Zmiana hasła

## Dostęp
- Z [[main-settings|głównych ustawień]] → Password
- URL: `/en/settings/password-change`

## Lokalizacja w kodzie
- **Page component**: Routing przez `SettingsLayout`
- **UI components**:
  - `SettingsPasswordChangeContent` w `frontend/apps/datacapt/src/components/settings/SettingsPasswordChangeContent/SettingsPasswordChangeContent.tsx`
  - `SettingsEnableMfaModal`, `SettingsDisableMfaModal` - modały MFA
  - CSS klasy: `password-change-content`, `password-change-content__form`

## Struktura strony

### Nagłówek
- **Tytuł**: "Password"

### Formularz zmiany hasła
**Pola wymagane:**
- **Current password**: Pole na aktualne hasło
  - Placeholder: "Current password"
  - Ikona oka (show/hide password)
  
- **New password**: Pole na nowe hasło
  - Placeholder: "New password"  
  - Ikona oka (show/hide password)
  
- **Repeat password**: Potwierdzenie nowego hasła
  - Placeholder: "Repeat password"
  - Ikona oka (show/hide password)

### Przyciski akcji
- **Save/Submit**: Zapisanie nowego hasła (prawdopodobnie na dole)
- **Cancel**: Anulowanie zmian

## Funkcjonalności
- **Walidacja bezpieczeństwa**: Sprawdzanie siły hasła
- **Potwierdzenie**: Weryfikacja zgodności nowego hasła
- **Ukrywanie/pokazywanie**: Toggle visibility dla wszystkich pól
- **Zabezpieczenia**: Weryfikacja aktualnego hasła przed zmianą

## Wymagania bezpieczeństwa
- Minimalna długość hasła
- Wymagane znaki specjalne/cyfry/wielkie litery
- Zabezpieczenie przed weak passwords
- Weryfikacja aktualnego hasła

## Uprawnienia
- Dostęp dla wszystkich zalogowanych użytkowników
- Każdy może zmienić swoje hasło
- Wymaga znajomości aktualnego hasła

## Powiązania
- Powrót do [[main-settings|głównych ustawień]]
- Zmiana hasła wpływa na logowanie
- Może być wymagana przy pierwszym logowaniu
- Związane z polityką bezpieczeństwa [[compliance|Compliance]]