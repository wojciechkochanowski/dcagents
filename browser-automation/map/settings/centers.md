# Settings - Centers - Zarządzanie centrami

## Dostęp
- Z [[main-settings|głównych ustawień]] → Centers
- URL: `/en/settings/centers`

## Lokalizacja w kodzie
- **Page component**: Routing przez `SettingsLayout`
- **UI components**:
  - `SettingsCentersContent` w `frontend/apps/datacapt/src/components/settings/SettingsCentersContent/SettingsCentersContent.tsx`
  - `SettingsCentersTable` - tabela z listą centrów
  - `SettingsCentersArchiveModal` - modal archiwizacji centrum
  - CSS klasy: `.settings-centers-content`, `.settings-centers-content__header`, `.settings-centers-content__header-controls`

## Struktura strony

### Nagłówek
- **Tytuł**: "Manage centers"
- **Przycisk**: "Add center" (niebieski, prawy górny róg)

### Funkcje zarządzania
- **Search**: Pasek wyszukiwania centrów
- **Filters**: Przycisk filtrowania z dropdown menu

### Tabela centrów
**Kolumny:**
- **NAME**: Nazwa centrum
- **ABBREVIATION**: Skrót/kod centrum
- **ADDRESS**: Adres centrum
- **COUNTRY**: Kraj
- **CONTACT**: Dane kontaktowe

### Przykładowe dane centrów
**Z fixtures:**
- **Center 1**: CYPRESS | France
- **Cl**: CL | France

### Paginacja
- **Wyniki**: "1-2 of 2" (wszystkie centra)
- **Opcje**: "25 / page" dropdown

## Funkcjonalności
- **Dodawanie centrów**: Modal "Add center"
- **Edycja centrów**: Modyfikacja istniejących
- **Wyszukiwanie**: Filtrowanie po nazwie/kraju
- **Filtrowanie**: Według kraju, statusu, itp.
- **Zarządzanie kontaktami**: Dane osób odpowiedzialnych

## Modal "Add center"
**Prawdopodobna struktura:**
- **Name**: Pełna nazwa centrum
- **Abbreviation**: Krótki kod (np. CL, CYPRESS)
- **Address**: Pełny adres
- **Country**: Dropdown wyboru kraju
- **Contact person**: Imię i nazwisko
- **Phone**: Numer telefonu
- **Email**: Adres email centrum
- **Przyciski**: Cancel | Save

## Funkcje filtrowania
- **By country**: Filtrowanie według kraju
- **By status**: Active/Inactive centra
- **By region**: Geograficzne grupowanie

## Uprawnienia
- Dostęp prawdopodobnie dla administratorów i project managerów
- Wpływa na przypisanie użytkowników do centrów
- Używane w konfiguracji badań

## Powiązania
- Powrót do [[main-settings|głównych ustawień]]
- Centra używane w [[../recruitment-studies|rekrutacji]]
- Przypisanie w [[../project-database|projektach]]
- Konfiguracja w [[../studies|badaniach]]
- Filtrowanie w [[../subject-database|bazie badanych]]
- Użytkownicy przypisani w [[users|zarządzaniu użytkownikami]]