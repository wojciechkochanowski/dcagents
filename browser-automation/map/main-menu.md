# Główne menu aplikacji Datacapt

## Lokalizacja w kodzie
- **Page component**: `BasicLayout` w `frontend/apps/datacapt/src/components/BasicLayout/BasicLayout.tsx` (layout dla całej aplikacji)
- **UI components**:
  - `MenuOption` - komponenty opcji menu w BasicLayout.tsx
  - `BottomPopup` w `frontend/apps/datacapt/src/components/BasicLayout/BottomPopup/BottomPopup.tsx`
  - `InformationBannerPopup` w `frontend/apps/datacapt/src/components/BasicLayout/InformationBanner/InformationBannerPopup.tsx`
  - CSS klasy: `basic-layout`, `basic-layout__menu`, `basic-layout__menu-option`, `basic-layout__menu-options`

## Struktura menu bocznego

Aplikacja posiada lewe menu nawigacyjne z następującymi sekcjami:

### 1. Studies (Badania)
- **Selektor**: `.basic-layout__menu-option:nth-child(1)`
- **Ikona**: Dokument z załączniku
- **Opis**: Główna sekcja do zarządzania badaniami klinicznymi
- **Etykieta**: "Studies" (pojawia się po kliknięciu)
- **Link**: [[studies|Studies]]

### 2. Recruitment studies (Rekrutacja do badań)
- **Selektor**: `.basic-layout__menu-option:nth-child(2)`
- **Ikona**: Dokument z załącznikiem
- **Opis**: Sekcja do zarządzania rekrutacją uczestników
- **Tytuł strony**: "Recruitment studies"
- **Link**: [[recruitment-studies|Recruitment Studies]]

### 3. Project Database (Baza projektów)
- **Selektor**: `.basic-layout__menu-option:nth-child(3)`
- **Ikona**: Folder/baza danych
- **Opis**: Zarządzanie projektami badawczymi
- **Tytuł strony**: "Project Database"
- **Link**: [[project-database|Project Database]]

### 4. Formula library (Biblioteka formuł)
- **Selektor**: `.basic-layout__menu-option:nth-child(4)`
- **Ikona**: Baza danych
- **Opis**: Biblioteka formuł do badań
- **Tytuł strony**: "Formula library"
- **Kategorie**: All formulas, Standard formulas, Sample formulas, Benchmark formulas
- **Link**: [[formula-library|Formula Library]]

### 5. Payment Orders Management (Zarządzanie płatnościami)
- **Selektor**: `.basic-layout__menu-option:nth-child(5)`
- **Ikona**: Symbol dolara
- **Opis**: Zarządzanie płatnościami i rozliczeniami
- **Tytuł strony**: "Payment Orders Management"
- **Statusy**: Processing, Error, Paid, Global amount
- **Link**: [[payment-orders|Payment Orders Management]]

### 6. Subject database (Baza badanych)
- **Selektor**: `.basic-layout__menu-option:nth-child(6)`
- **Ikona**: Użytkownik z plusem
- **Opis**: Zarządzanie bazą uczestników badań
- **Tytuł strony**: "Subject database"
- **Funkcje**: Search, Import, Add subject, Settings
- **Statusy**: Active, Inactive, Pending
- **Link**: [[subject-database|Subject Database]]

### 7. Calendar (Kalendarz)
- **Selektor**: `.basic-layout__menu-option:nth-child(7)`
- **Ikona**: Kalendarz z datami
- **Opis**: Zarządzanie kalendarzem i rezerwacjami
- **Zakładki**: Calendar, Bookings
- **Link**: [[calendar|Calendar]]

### 8. Settings (Ustawienia)
- **Selektor**: `.basic-layout__menu-option:nth-child(8)`
- **Ikona**: Koło zębate
- **Opis**: Główne ustawienia aplikacji i organizacji
- **Sekcje**: 11 kategorii konfiguracji
- **Link**: [[settings/main-settings|Settings]]

## Profil użytkownika
- **Lokalizacja**: Dolna część menu
- **Selektor**: `.basic-layout-bottom-popup__initials`
- **Wyświetlane**: Inicjały użytkownika (np. "AA")
- **Dropdown menu**: Po kliknięciu inicjałów otwiera się menu z opcjami:
  - Powitanie: "Hi, [firstName] [lastName]"
  - Email użytkownika
  - "Helpdesk" - link do pomocy
  - "Log out" - przycisk wylogowania
  - Informacja o wersji aplikacji

## Ogólne informacje
- Menu jest zawsze widoczne po lewej stronie
- Aktywna sekcja jest podświetlana
- Wszystkie ikony to elementy SVG
- Layout używa klasy `.basic-layout` jako kontener główny