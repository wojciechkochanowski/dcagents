# Moduł SUBJECTDASHBOARD - Dashboard uczestnika

## Lokalizacja

`frontend/apps/datacapt/src/components/SubjectDashboard/`

## Opis modułu

Interfejs przeznaczony dla uczestników badań (patient-facing). Umożliwia zarządzanie kontem, rezerwację wizyt, wypełnianie ankiet i komunikację z zespołem badawczym.

## Struktura komponentów (7 głównych grup)

### 🏗️ **Layout** - Layout dla uczestników

**Lokalizacja**: `Layout/`

- **Layout.tsx/less** - Główny layout dla uczestników
- **StyleCustomisation.tsx** - Personalizacja stylu zgodnie z branding

### 📊 **SubjectDashboard** - Główny dashboard

- **SubjectDashboard.tsx/less** - Główny ekran uczestnika
- **SubjectDashboardStore.tsx** - Zustand store stanu dashboardu

### 🏥 **BookAppointments** - Rezerwacja wizyt

**Lokalizacja**: `BookAppointments/`

#### **Główny komponent**

- **BookAppointments.tsx/less** - System rezerwacji wizyt

#### **Proces rezerwacji**

##### **BookAppointmentsSteps/** - Kroki rezerwacji

##### **BookAppointmentsSchedule/** - Wybór terminu

##### **BookAppointmentsVerify/** - Weryfikacja danych

##### **BookAppointmentsEnroll/** - Finalizacja zapisu

#### **Statusy i błędy**

##### **BookAppointmentsNotAvailable/** - Brak dostępnych terminów

##### **BookAppointmentsErrorPage/** - Obsługa błędów

### 👤 **AccountDetails** - Szczegóły konta

**Lokalizacja**: `AccountDetails/`

- **AccountDetails.tsx/less** - Przeglądanie i edycja danych konta

### ✏️ **EditSubject** - Edycja danych uczestnika

**Lokalizacja**: `EditSubject/`

- **EditSubject.tsx/less** - Edycja danych osobowych

### 📧 **EditSubjectEmail** - Edycja email

**Lokalizacja**: `EditSubjectEmail/`

- **EditSubjectEmail.tsx/less** - Zmiana adresu email

### 🗑️ **DeletionRequest** - Żądanie usunięcia

**Lokalizacja**: `DeletionRequest/`

- **DeletionRequest.tsx/less** - GDPR - żądanie usunięcia danych

### ✅ **RenewConsentModal** - Odnowienie zgody

**Lokalizacja**: `RenewConsentModal/`

- **RenewConsentModal.tsx/less** - Modal odnowienia zgody na udział

### 📢 **SubjectDashboardBanner** - Banner informacyjny

**Lokalizacja**: `SubjectDashboardBanner/`

- **SubjectDashboardBanner.tsx/less** - Bannery z komunikatami dla uczestnika

## Integracje wewnętrzne

### **Calendar integration**

- Integracja z `calendar/BookingsContent` dla rezerwacji
- Synchronizacja dostępnych terminów

### **Auth integration**

- Specjalna autoryzacja dla uczestników
- Różne uprawnienia niż personel badawczy

### **Shared components**

- **Survey** - ankiety dla uczestników
- **Fulfillment** - wypełnianie formularzy
- **VisitConfirmationModal** - potwierdzenia wizyt

## Kluczowe funkcjonalności

### **Self-service**

- **Appointment booking** - samodzielna rezerwacja
- **Account management** - zarządzanie kontem
- **Data updates** - aktualizacja danych
- **Consent management** - zarządzanie zgodami

### **Communication**

- **Notifications** - powiadomienia o wizytach
- **Messages** - komunikacja z zespołem
- **Updates** - informacje o badaniu

### **Privacy & GDPR**

- **Data export** - eksport danych osobowych
- **Data deletion** - żądanie usunięcia
- **Consent tracking** - śledzenie zgód

## Przepływy użytkowania

### **Rejestracja wizyty**

1. SubjectDashboard → BookAppointments
2. BookAppointmentsSchedule → wybór terminu
3. BookAppointmentsVerify → potwierdzenie

### **Zarządzanie kontem**

1. Dashboard → AccountDetails → edycja
2. EditSubject → zapis → powrót

### **GDPR requests**

1. Dashboard → DeletionRequest
2. Potwierdzenie → wysłanie żądania
