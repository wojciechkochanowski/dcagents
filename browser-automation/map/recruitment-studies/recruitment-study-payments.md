# Recruitment Study - Payments Tab

## Lokalizacja w kodzie
- **UI components**:
  - `PaymentsTab` - główny komponent zakładki
  - `PaymentsDashboard` - dashboard z metrykami płatności
  - `PaymentsTable` - tabela płatności
  - `PaymentFilters` - filtry płatności

## Dostęp
- Z [[recruitment-study-details|szczegółów recruitment study]] → zakładka "Payments"

## Struktura zakładki

### Dashboard płatności (górna część)
**5 kolorowych kafelków z metrykami:**
- **Pending payments** (żółty) - płatności oczekujące
- **Approved payments** (niebieski) - płatności zatwierdzone  
- **Payments in processing** (fioletowy) - płatności w trakcie
- **Error payments** (pomarańczowy) - płatności z błędami
- **Global amount** (fioletowy) - łączna kwota

**Format każdego kafelka:**
- Ikona reprezentująca typ płatności
- Nazwa kategorii płatności
- Duża liczba (główna metryka)
- Mniejsza liczba (dodatkowa metryka lub kwota)

### Filtry i wyszukiwanie
**Opcje filtrowania:**
- **Wyszukiwanie**: Ikona lupy
- **Payment status**: Dropdown z statusami płatności
- **Creation date**: Filtr daty utworzenia
- **Payment date**: Filtr daty płatności  
- **More filters**: Dodatkowe opcje filtrowania

### Tabela płatności
**Kolumny:**
- **Checkbox** - selekcja płatności
- **CONTACT DETAIL** - dane uczestnika
- **APPLICATION STATUS** - status aplikacji
- **CREATION DATE** - data utworzenia płatności
- **AMOUNT** - kwota płatności
- **PAYMENT DATE** - data płatności
- **PAYMENT STATUS** - status płatności

### Stan pusty
- **Ikona**: Grafika reprezentująca brak danych
- **Komunikat**: "No data"
- **Paginacja**: "0-0 of 0" z opcjami "25 / page"

## Stan dynamiczny
- Dashboard aktualizuje się na podstawie rzeczywistych płatności
- Filtry wpływają na wyświetlane dane w tabeli
- Liczby w metrykach pochodzą z bazy danych płatności

## Funkcjonalności
- **Filtrowanie**: Wielopoziomowe filtrowanie płatności
- **Eksport**: Możliwość eksportu danych płatności
- **Zarządzanie**: Edycja statusów i kwot płatności
- **Raportowanie**: Generowanie raportów płatności

## Powiązania
- Powrót do [[recruitment-study-details|głównej strony study]]
- Połączenie z [[payment-orders|Payment Orders Management]]
- Przejście do innych zakładek tego samego study