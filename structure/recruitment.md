# Moduł RECRUITMENT - Rekrutacja uczestników

## Lokalizacja

`frontend/apps/datacapt/src/components/recruitment/`

## Opis modułu

Moduł obsługujący rekrutację uczestników do badań klinicznych. Zarządza procesem od publikacji badania rekrutacyjnego po analizę wyników rekrutacji.

## Struktura komponentów (2 główne grupy)

### 📋 **RecruitmentStudiesContent** - Lista badań rekrutacyjnych

**Lokalizacja**: `RecruitmentStudiesContent/`

#### **Główny komponent**

- **RecruitmentStudiesContent.tsx/less** - Dashboard badań rekrutacyjnych
- **Funkcja**: Lista wszystkich aktywnych i zakończonych rekrutacji

#### **Tworzenie nowego badania**

##### **NewRecruitmentStudy/**

- **Funkcja**: Kreator nowego badania rekrutacyjnego
- **Zawiera**:
  - Formularz podstawowych danych
  - Ustawienia kryteriów rekrutacji
  - Konfiguracja kampanii
  - Publikacja badania

#### **Statystyki i metryki**

##### **RecruitmentStudiesNumbers/**

- **Funkcja**: Główne statystyki rekrutacji
- **Zawiera**:
  - Liczba aktywnych badań
  - Łączna liczba uczestników
  - Wskaźniki konwersji
  - Trendy czasowe
  - Wykres postępu

#### **Karty badań**

##### **RecruitmentStudyCard/**

- **Funkcja**: Karta pojedynczego badania rekrutacyjnego
- **Zawiera**:
  - Podstawowe informacje
  - Status rekrutacji
  - Postęp względem celów
  - Szybkie akcje
  - Link do szczegółów

### 🎯 **RecruitmentStudyDetailsContent** - Szczegóły badania rekrutacyjnego

**Lokalizacja**: `RecruitmentStudyDetailsContent/`

#### **Główny komponent**

- **RecruitmentStudyDetailsContent.tsx** - Layout szczegółów badania
- **RecruitmentStudyDetailsStore.tsx** - Zustand store stanu badania

#### **Profil rekrutacji**

##### **RecruitmentProfile/**

- **Funkcja**: Profil i ustawienia badania rekrutacyjnego
- **Zawiera**:
  - Informacje o badaniu
  - Kryteria włączenia/wykluczenia
  - Cele rekrutacji
  - Terminy i harmonogram
  - Status publikacji

#### **Dashboard uczestników**

##### **ParticipantsDashboard/**

- **Funkcja**: Zarządzanie uczestnikami rekrutacji
- **Zawiera**:
  - Lista potencjalnych uczestników
  - Statusy aplikacji
  - Proces screeningu
  - Komunikacja z kandydatami
  - Metryki rekrutacji

#### **System wypełniania**

##### **RecruitmentFulfillment/**

- **Funkcja**: Wypełnianie formularzy przez kandydatów
- **Zawiera**:
  - Formularze screeningowe
  - Kwestionariusze kwalifikacyjne
  - Upload dokumentów
  - Podpisy elektroniczne
- **Integruje**: `shared/Fulfillment`

#### **System płatności**

##### **RecruitmentPayments/**

- **Funkcja**: Zarządzanie płatnościami za udział
- **Zawiera**:
  - Konfiguracja wynagrodzeń
  - Harmonogram płatności
  - Historia transakcji
  - Raporty finansowe

#### **Harmonogramy**

##### **RecruitmentStudySchedules/**

- **Funkcja**: Zarządzanie harmonogramem rekrutacji
- **Zawiera**:
  - Terminy rekrutacji
  - Harmonogram wizyt screeningowych
  - Availability slots
  - Integracja z kalendarzem

#### **Ustawienia**

##### **RecruitmentStudySettings/**

- **Funkcja**: Konfiguracja badania rekrutacyjnego
- **Zawiera**:
  - Ustawienia publikacji
  - Kryteria automatycznej kwalifikacji
  - Szablony komunikacji
  - Integracje zewnętrzne
  - Compliance settings

#### **Ankiety**

##### **RecruitmentSurvey/**

- **Funkcja**: System ankiet dla kandydatów
- **Zawiera**:
  - Ankiety przedrekrutacyjne
  - Feedback forms
  - Exit surveys
  - Analiza odpowiedzi
- **Integruje**: `shared/Survey`

#### **Layout i nawigacja**

##### **RecruitmentStudyDetailsLayout/**

- **Funkcja**: Layout strony szczegółów
- **Zawiera**:
  - Sidebar z nawigacją
  - Breadcrumbs
  - Quick actions
  - Status indicators

## Integracje wewnętrzne

### **Shared components**

- **Builder** - tworzenie formularzy rekrutacyjnych
- **Fulfillment** - wypełnianie przez kandydatów
- **Survey** - ankiety i feedback
- **SubjectForm** - formularze danych uczestników
- **InviteParticipantModal** - zapraszanie do badań

### **Calendar integration**

- Integracja z `calendar/` dla harmonogramów
- Booking slots dla wizyt screeningowych

### **Studies integration**

- Transfer wykwalifikowanych uczestników do `studies/`
- Synchronizacja danych między rekrutacją a badaniem

## API i external integrations

### **Common requests**

- `common/requests/recruitment/` - API calls
- `common/requests/subjects/` - zarządzanie uczestnikami

### **External services**

- **Email marketing platforms** - kampanie rekrutacyjne
- **Social media APIs** - promocja badań
- **Payment providers** - obsługa wynagrodzeń
- **SMS services** - powiadomienia

## Przepływy użytkowania

### **Tworzenie kampanii rekrutacyjnej**

1. RecruitmentStudiesContent → NewRecruitmentStudy
2. Konfiguracja kryteriów → publikacja → monitoring

### **Proces rekrutacji**

1. Kandydat wypełnia → RecruitmentFulfillment
2. System screening → ParticipantsDashboard
3. Kwalifikacja → transfer do Studies

### **Zarządzanie rekrutacją**

1. RecruitmentStudyDetailsContent → wybór modułu
2. Monitoring postępu → dostosowanie strategii
3. Analiza wyników → optymalizacja

## Kluczowe funkcjonalności

- **Multi-channel recruitment** - różne kanały rekrutacji
- **Automated screening** - automatyczna preselekcja
- **Real-time tracking** - śledzenie w czasie rzeczywistym
- **A/B testing** - testowanie różnych podejść
- **Compliance management** - zgodność z regulacjami
- **Integration ready** - łatwa integracja z external tools
