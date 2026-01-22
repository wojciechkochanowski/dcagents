# Recruitment Study - Settings Tab

## Lokalizacja w kodzie
- **UI components**: (klasy CSS Ant Design)
  - `ant-tabs-tabpane` - kontener zawartości zakładki Settings
  - `ant-menu` - menu boczne z opcjami ustawień
  - `ant-form` - formularz ustawień study
  - `ant-input`, `ant-select` - pola formularza

## Dostęp
- Z [[recruitment-study-details|szczegółów recruitment study]] → zakładka "Settings"

## Struktura zakładki

### Menu boczne (lewe)
**Main Settings:**
- **General** (aktywna, z ikoną koła zębatego) - podstawowe ustawienia
- **Users** (z ikoną użytkownika) - zarządzanie użytkownikami
- **Builder** (z ikoną konstruktora) - kreator formularzy
- **Payment** (z ikoną dolara) - ustawienia płatności
- **QR Codes** (z ikoną QR) - kody QR

**Optional Settings:**
- **Recruitment details** (z ikoną szczegółów) - szczegóły rekrutacji
- **Wash out period** (z ikoną czasu) - okres wypłukiwania
- **EDC link** (z ikoną łącza) - połączenie z EDC

### Obszar główny - General Settings
**Nagłówek sekcji:**
- **Tytuł**: "General" 
- **Przycisk**: "Edit" (niebieski, prawy górny)

**Sekcja: STUDY SETTINGS**
**Pola formularza:** (wszystkie wartości z API, dynamiczne)
- **Recruitment study reference**: Kod/referencja study (format: [PREFIX]-[NUMBER])
- **Recruitment study name**: Nazwa study (tekst z bazy danych)
- **Recruiter Name**: Imię recruitera (dane użytkownika)
- **Target number**: Docelowa liczba uczestników (liczba całkowita)
- **Recruitment study centers**: Lista dostępnych centrów (dropdown z API)

### Stan formularza
- **Tryb tylko do odczytu**: Wszystkie pola wyświetlają zapisane wartości
- **Tryb edycji**: Po kliknięciu "Edit" pola stają się edytowalne
- **Walidacja**: Sprawdzanie poprawności wprowadzonych danych
- **Zapisywanie**: Automatyczne lub ręczne zapisywanie zmian

## Funkcjonalności poszczególnych sekcji

### General
- Edycja podstawowych informacji o study
- Zmiana nazwy, referencji, recruitera
- Modyfikacja celu rekrutacji i centrów

### Users (przyszłe funkcjonalności)
- Zarządzanie użytkownikami study
- Przypisywanie ról i uprawnień
- Kontrola dostępu do funkcji

### Builder
- Kreator formularzy rekrutacyjnych
- Definiowanie pytań i kryteriów
- Konfiguracja procesu kwalifikacji

### Payment
- Ustawienia wynagrodzeń dla uczestników
- Harmonogramy płatności
- Konfiguracja metod płatności

### QR Codes
- Generowanie kodów QR dla study
- Konfiguracja linków mobilnych
- Zarządzanie dostępem via QR

## Stan dynamiczny
- Wszystkie wartości pochodzą z bazy danych study
- Menu boczne może mieć różną liczbę opcji w zależności od typu study
- Sekcje opcjonalne mogą być ukryte dla niektórych typów badań

## Powiązania
- Powrót do [[recruitment-study-details|głównej strony study]]
- Połączenie z ustawieniami globalnymi aplikacji
- Przejście do innych zakładek tego samego study