# Moduł PAYMENTS - System płatności

## Lokalizacja

`frontend/apps/datacapt/src/components/payments/`

## Opis modułu

System zarządzania płatnościami dla uczestników badań klinicznych. Obsługuje wynagrodzenia, zwroty kosztów, zlecenia płatności i raportowanie finansowe.

## Struktura komponentów (5 głównych grup)

### 💰 **PaymentsDashboard** - Dashboard płatności

**Lokalizacja**: `PaymentsDashboard/`

#### **Główny komponent**

- **PaymentsDashboard.tsx/less** - Główny dashboard płatności
- **PaymentsDashboardStore.tsx** - Zustand store
- **PaymentsTableConfig.tsx** - Konfiguracja tabeli płatności

#### **Statystyki**

##### **PaymentsDashboardStats/**

- **Funkcja**: Statystyki finansowe
- **Zawiera**: Łączne kwoty, statusy, trendy

#### **Eksport danych**

##### **PaymentsExport/**

- **Funkcja**: Eksport raportów płatności
- **Zawiera**: CSV, Excel, PDF raporty

#### **Zarządzanie statusami**

##### **PaymentsStatusModal/**

- **Funkcja**: Zmiana statusów płatności
- **Zawiera**: Workflow approval, komentarze

### 📋 **PaymentOrdersDashboard** - Dashboard zleceń płatności

**Lokalizacja**: `PaymentOrdersDashboard/`

#### **Główny komponent**

- **PaymentOrdersDashboard.tsx/less** - Zarządzanie zleceniami
- **PaymentOrdersDashboardStore.tsx** - Store zleceń
- **PaymentOrdersTableConfig.tsx** - Konfiguracja tabeli

#### **Statystyki zleceń**

##### **PaymentOrdersDashboardStats/**

- **Funkcja**: Statystyki zleceń płatności
- **Zawiera**: Pending, processed, failed orders

#### **Eksport zleceń**

##### **PaymentOrdersExport/**

- **Funkcja**: Raporty zleceń
- **Zawiera**: Batch reports, reconciliation

#### **Realizacja płatności**

##### **MakePaymentModal/**

- **Funkcja**: Realizacja płatności
- **Zawiera**: Wybór metody, potwierdzenie, wykonanie

#### **Obsługa błędów**

##### **SetErrorModal/**

- **Funkcja**: Zarządzanie błędami płatności
- **Zawiera**: Error codes, retry logic, manual resolution

### 👁️ **PaymentQuickView** - Szybki podgląd

**Lokalizacja**: `PaymentQuickView/`

#### **Główny komponent**

- **PaymentQuickView.tsx/less** - Quick view płatności

#### **Szczegóły płatności**

##### **PaymentDetails/**

- **Funkcja**: Pełne szczegóły płatności
- **Zawiera**: Kwoty, beneficjenci, metody, statusy

##### **PaymentHistory/**

- **Funkcja**: Historia transakcji
- **Zawiera**: Timeline zmian, audit trail

### 🏷️ **PaymentStatusSelect** - Wybór statusu płatności

**Lokalizacja**: `PaymentStatusSelect/`

#### **Komponenty**

- **PaymentStatusSelect.tsx/less** - Selector statusów płatności

**Statusy**:

- Pending - oczekująca
- Approved - zatwierdzona
- Processing - w realizacji
- Completed - zakończona
- Failed - nieudana
- Cancelled - anulowana

### 📄 **PaymentOrderStatusSelect** - Status zleceń

**Lokalizacja**: `PaymentOrderStatusSelect/`

#### **Komponenty**

- **PaymentOrderStatusSelect.tsx/less** - Selector statusów zleceń

**Statusy zleceń**:

- Draft - szkic
- Submitted - przesłane
- Under Review - w weryfikacji
- Approved - zatwierdzone
- Rejected - odrzucone
- Paid - opłacone

## Integracje wewnętrzne

### **SubjectRepository integration**

- Powiązanie płatności z uczestnikami
- Historia płatności w profilach

### **Studies integration**

- Płatności powiązane z badaniami
- Budżety i limity badań

### **Calendar integration**

- Płatności za wizyty
- Automatyczne naliczanie wynagrodzeń

## Integracje zewnętrzne

### **Payment providers**

- **Bank transfers** - przelewy bankowe
- **PayPal** - płatności PayPal
- **Stripe** - karty kredytowe
- **Wire transfers** - przelewy międzynarodowe

### **Accounting systems**

- **Export do systemów księgowych**
- **Reconciliation** - uzgadnianie
- **Tax reporting** - raporty podatkowe

## Kluczowe funkcjonalności

### **Payment Processing**

- **Multi-currency** - obsługa wielu walut
- **Bulk payments** - płatności masowe
- **Scheduled payments** - płatności zaplanowane
- **Approval workflow** - przepływ zatwierdzeń

### **Reporting & Analytics**

- **Financial reports** - raporty finansowe
- **Payment analytics** - analityka płatności
- **Budget tracking** - śledzenie budżetów
- **Cost center allocation** - alokacja kosztów

### **Compliance & Security**

- **Audit trails** - ścieżki audytu
- **Fraud detection** - wykrywanie oszustw
- **Data encryption** - szyfrowanie danych
- **Regulatory compliance** - zgodność z przepisami

## API Endpoints

- `common/requests/payments/` - główne API płatności
- `common/requests/paymentOrders/` - API zleceń

## Przepływy użytkowania

### **Przetwarzanie płatności**

1. PaymentsDashboard → wybór płatności
2. PaymentQuickView → szczegóły
3. PaymentsStatusModal → zmiana statusu

### **Zarządzanie zleceniami**

1. PaymentOrdersDashboard → lista zleceń
2. MakePaymentModal → realizacja
3. PaymentOrdersExport → raport

### **Monitorowanie błędów**

1. Dashboard → failed payments
2. SetErrorModal → analiza błędu
3. Retry/manual resolution
