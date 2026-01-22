# Settings - Customization - Dostosowanie wyglądu

## Dostęp
- Z [[main-settings|głównych ustawień]] → Customization
- URL: `/en/settings/customization`

## Lokalizacja w kodzie
- **Page component**: Routing przez `SettingsLayout`
- **UI components**:
  - `SettingsCustomisationContent` w `frontend/apps/datacapt/src/components/settings/SettingsCustomisationContent/`
  - `DatacImageUpload` - komponent upload logo
  - `DatacColorPicker` - selektor kolorów
  - CSS klasy: `.settings-customisation-content`, `.settings-customisation-content__body`, `.settings-customisation-content__row`

## Struktura strony

### Nagłówek
- **Tytuł**: "Customization"
- **Funkcja**: Dostosowanie wyglądu i brandingu aplikacji

### Sekcja Logo
- **Label**: "Logo"
- **Funkcja**: "Upload image" (max 10MB)
- **Ikona upload**: Niebieska ikona z strzałką w górę
- **Format**: Prawdopodobnie PNG, JPG, SVG
- **Zastosowanie**: Logo organizacji w aplikacji

### Sekcja Main color
- **Label**: "Main color"
- **Input**: Pole tekstowe z wartością "Transparent"
- **Color picker**: Czerwona ikona selektora kolorów
- **Funkcja**: Główny kolor motywu aplikacji
- **Domyślnie**: Przezroczysty (używa domyślnych kolorów)

### Sekcja Button color
- **Label**: "Button color"
- **Input**: Pole tekstowe z wartością "Transparent"
- **Color picker**: Czerwona ikona selektora kolorów
- **Funkcja**: Kolor przycisków w całej aplikacji
- **Domyślnie**: Przezroczysty (używa domyślnych kolorów)

### Sekcja Reply-to email
- **Label**: "Reply-to email"
- **Input**: Pole tekstowe z placeholder "Type reply-to email"
- **Funkcja**: Adres email do odpowiedzi z systemowych powiadomień
- **Zastosowanie**: Automatyczne emaile z systemu

## Funkcjonalności
- **Brand customization**: Dostosowanie do brandingu organizacji
- **Color scheme**: Personalizacja kolorów interfejsu
- **Logo upload**: Własne logo w systemie
- **Email configuration**: Konfiguracja komunikacji
- **Theme consistency**: Spójny wygląd w całej aplikacji

## Upload logo
**Specyfikacje:**
- **Max size**: 10MB
- **Formaty**: PNG, JPG, SVG (prawdopodobnie)
- **Użycie**: Header, login page, raporty, emaile
- **Responsive**: Automatyczne skalowanie

## Color picker
**Funkcjonalności:**
- **HEX values**: Dokładne wartości kolorów
- **Color palette**: Paleta kolorów do wyboru
- **Preview**: Podgląd zmian na żywo
- **Reset**: Powrót do domyślnych wartości

## Email configuration
- **Reply-to address**: Adres do odpowiedzi
- **System notifications**: Powiadomienia systemowe
- **Automated emails**: Automatyczne wiadomości
- **Compliance**: Zgodność z przepisami email marketingu

## Wpływ na interfejs
- **Header bar**: Logo i kolory w górnej belce
- **Buttons**: Wszystkie przyciski w systemie
- **Links**: Kolory linków
- **Accents**: Akcenty i wyróżnienia
- **Forms**: Styling formularzy

## Uprawnienia
- Dostęp prawdopodobnie tylko dla administratorów
- Zmiany wpływają na wszystkich użytkowników
- Może wymagać restartu sesji po zmianach

## Zastosowania brandingu
- **White labeling**: Pełne dostosowanie do klienta
- **Corporate identity**: Zachowanie tożsamości firmy
- **Professional appearance**: Profesjonalny wygląd
- **Compliance branding**: Zgodność z guidelines

## Powiązania
- Powrót do [[main-settings|głównych ustawień]]
- Logo używane w [[../study/reports|raportach]]
- Kolory w [[../study/ecrf-builder|formularzach]]
- Branding w [[../recruitment-studies|rekrutacji]]
- Email styling w [[compliance|powiadomieniach]]