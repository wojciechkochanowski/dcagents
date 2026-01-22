# Settings - Audit Trails - Logi audytu

## Dostęp
- Z [[main-settings|głównych ustawień]] → Audit trails
- URL: `/en/settings/audit-trails`

## Lokalizacja w kodzie
- **Page component**: Routing przez `SettingsLayout`
- **UI components**:
  - `SettingsAuditTrailsContent` w `frontend/apps/datacapt/src/components/settings/SettingsAuditTrailsContent/SettingsAuditTrailsContent.tsx`
  - `AuditTrailsTable` - tabela z logami audytu (z folderu shared)
  - CSS klasy: `.audit-trails`, `.audit-trails__header`, `.audit-trails__export-button`

## Struktura strony

### Nagłówek
- **Tytuł**: "System audit trails"
- **Przycisk**: "Export data" (niebieski, prawy górny róg)

### Funkcje zarządzania
- **Filters**: Przycisk filtrowania z dropdown menu
- **Search**: Prawdopodobnie wyszukiwanie w logach

### Tabela logów audytu
**Kolumny:**
- **CHECKBOX**: Zaznaczanie rekordów do masowych operacji
- **USERNAME**: Nazwa użytkownika wykonującego akcję
- **DATE**: Data i czas zdarzenia (format: DD MMM YYYY, HH:MM:SS GMT+X)
- **EVENT TYPE**: Typ zdarzenia (Login, Logout, etc.)

### Przykładowe dane audytu
**Rekordy z systemu:**
- **Login events**: Logowanie użytkowników (adminFirstName adminLastName)
- **Logout events**: Wylogowania z systemu
- **Timestamps**: Precyzyjne znaczniki czasowe z strefą GMT+2
- **Pattern dat**: 19 Jul 2025, 11:59:36 GMT+2 (format przykładowy)

### Paginacja
- **Wyniki**: Dynamiczna liczba rekordów
- **Nawigacja**: Standardowa paginacja
- **Opcje**: Liczba rekordów na stronę

## Funkcjonalności
- **Export danych**: Pobieranie logów do analizy
- **Filtrowanie**: Według typu zdarzenia, użytkownika, daty
- **Wyszukiwanie**: Znajdowanie konkretnych zdarzeń
- **Masowe operacje**: Zaznaczanie wielu rekordów
- **Monitoring**: Śledzenie aktywności użytkowników

## Panel filtrów
**Prawdopodobne opcje:**
- **Date range**: Zakres dat
- **Event type**: Login, Logout, Data changes, Export, etc.
- **Username**: Filtrowanie według użytkownika
- **IP address**: Filtrowanie według adresu IP

## Typy zdarzeń
- **Login**: Logowanie do systemu
- **Logout**: Wylogowanie z systemu
- **Data modification**: Zmiany w danych
- **Export**: Eksport danych
- **Configuration changes**: Zmiany w ustawieniach
- **User management**: Operacje na użytkownikach

## Uprawnienia
- Dostęp prawdopodobnie tylko dla administratorów i auditorów
- Logi są tylko do odczytu (read-only)
- Export może wymagać specjalnych uprawnień

## Compliance
- Wymagane dla przepisów medycznych (FDA, EMA)
- Śledzenie integralności danych
- Dokumentacja zgodności z GCP

## Powiązania
- Powrót do [[main-settings|głównych ustawień]]
- Związane z [[compliance|ustawieniami zgodności]]
- Monitoring [[users|aktywności użytkowników]]
- Śledzenie zmian w [[../studies|badaniach]]
- Dokumentacja dla regulatorów