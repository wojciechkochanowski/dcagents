# Payment Orders Management - Zarządzanie płatnościami

## Lokalizacja w kodzie
- **Page component**: `PaymentOrderManagement` w `frontend/apps/datacapt/src/pages/payment-orders/index.tsx` (routing)
- **UI components**:
  - `PaymentOrdersDashboard` w `frontend/apps/datacapt/src/components/payments/PaymentOrdersDashboard/PaymentOrdersDashboard.tsx`
  - `PaymentOrdersDashboardStats` w `frontend/apps/datacapt/src/components/payments/PaymentOrdersDashboard/PaymentOrdersDashboardStats/PaymentOrdersDashboardStats.tsx`
  - `MakePaymentModal` w `frontend/apps/datacapt/src/components/payments/PaymentOrdersDashboard/MakePaymentModal/MakePaymentModal.tsx`
  - `PaymentOrdersExport` w `frontend/apps/datacapt/src/components/payments/PaymentOrdersDashboard/PaymentOrdersExport/PaymentOrdersExport.tsx`
  - `PaymentOrderStatusSelect` w `frontend/apps/datacapt/src/components/payments/PaymentOrderStatusSelect/PaymentOrderStatusSelect.tsx`
  - CSS klasy: `payment-orders-dashboard`, `payment-orders-dashboard-stats`, `payment-orders-stats-item`

## Dostęp  
- Z [[main-menu|głównego menu]] → piąta opcja (ikona płatności)

## Struktura strony

### Nagłówek
- **Tytuł**: "Payment Orders Management"

### Statystyki (kafelki statusów)
Cztery kafelki z ikonami i licznikami:

1. **Processing** (ikona odświeżania)
   - Wartość: 0
   - Kolor: niebieski
   
2. **Error** (ikona błędu)  
   - Wartość: 0
   - Kolor: czerwony/pomarańczowy
   
3. **Paid** (ikona zaznaczenia)
   - Wartość: 0  
   - Kolor: zielony
   
4. **Global amount** (ikona kwoty globalnej)
   - Wartość: 0
   - Kolor: fioletowy

### Filtry i wyszukiwanie
- **Pasek wyszukiwania**: z ikoną lupy
- **Payment status**: Dropdown do filtrowania według statusu
- **Creation date**: Selektor daty utworzenia  
- **Payment date**: Selektor daty płatności
- **More filters**: Dodatkowe opcje filtrowania

### Panel "More filters"
**Zaawansowane filtry:**
- **Recruitment study**: Wyszukiwanie i wybór badań rekrutacyjnych
- **Visit name**: Filtr według nazwy wizyty
- **Center**: Filtr według centrum badawczego
- **Selected (0)**: Licznik wybranych filtrów
- **Przyciski**: Cancel | Apply

### Tabela płatności
Kolumny:
- **CONTACT DETAIL**: Szczegóły kontaktu
- **RECRUITMENT STUDY**: Badanie rekrutacyjne
- **CREATION DATE**: Data utworzenia
- **CENTER**: Centrum badawcze

### Stan danych
- **Komunikat**: "No data"
- **Paginacja**: "0-0 of 0" (brak płatności)

## Funkcjonalności
- Śledzenie statusów płatności
- Filtrowanie według różnych kryteriów
- Zarządzanie płatnościami dla uczestników badań

## Powiązania
- Powrót do [[main-menu|głównego menu]]
- Powiązane z [[recruitment-studies|rekrutacją]] i [[subject-database|bazą badanych]]