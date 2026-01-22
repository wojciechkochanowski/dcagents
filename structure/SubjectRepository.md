# Moduł SUBJECTREPOSITORY - Repozytorium uczestników

## Lokalizacja

`frontend/apps/datacapt/src/components/SubjectRepository/`

## Opis modułu

Centralny system zarządzania bazą danych wszystkich uczestników badań. Umożliwia kompleksowe zarządzanie profilami uczestników, ich historią badań, dokumentacją i komunikacją.

## Struktura komponentów (6 głównych grup)

### 📊 **SubjectRepositoryDashboard** - Główny dashboard

**Lokalizacja**: `SubjectRepositoryDashboard/`

#### **Główny komponent**

- **SubjectRepositoryDashboard.tsx/less** - Główny dashboard repozytorium
- **SubjectRepositoryDashboardStore.tsx** - Zustand store stanu
- **SubjectRepositoryTableConfig.tsx** - Konfiguracja tabeli uczestników

#### **Statystyki**

##### **SubjectRepositoryStats/**

- **Funkcja**: Główne statystyki repozytorium
- **Zawiera**: Łączna liczba uczestników, statusy, trendy

#### **Opcje zarządzania**

##### **SubjectRepositoryOptions/**

- **Funkcja**: Menu opcji i akcji masowych
- **Zawiera**: Filtry zaawansowane, eksport, import

#### **Modalne zarządzania**

##### **AddSubjectModal/**

- **Funkcja**: Dodawanie nowego uczestnika

##### **DeleteSubjectModal/**

- **Funkcja**: Usuwanie uczestnika z potwierdzeniem

##### **AccountModal/**

- **Funkcja**: Zarządzanie kontem uczestnika

##### **MessageModal/**

- **Funkcja**: Wysyłanie wiadomości do uczestników

##### **RestartModal/**

- **Funkcja**: Restart procesów uczestnika

##### **AssignToRecruitmentModal/**

- **Funkcja**: Przypisanie do badania rekrutacyjnego

#### **Import/Export**

##### **ExportModal/**

- **Funkcja**: Eksport danych uczestników

##### **ImportModal/**

- **Funkcja**: Import uczestników z pliku

### 👤 **SubjectRepositoryProfile** - Profile uczestników

**Lokalizacja**: `SubjectRepositoryProfile/`

#### **Główny komponent**

- **SubjectRepositoryProfile.tsx/less** - Szczegółowy profil uczestnika
- **SubjectRepositoryProfileStore.tsx** - Store stanu profilu

#### **Nagłówek i sidebar**

##### **SubjectProfileHeader/**

- **Funkcja**: Nagłówek profilu z podstawowymi danymi

##### **SubjectProfileSidebar/**

- **Funkcja**: Sidebar z nawigacją i quick info

#### **Sekcje profilu**

##### **SubjectProfileBox/**

- **Funkcja**: Komponenty box z informacjami

##### **SubjectProfileCharacteristics/**

- **Funkcja**: Charakterystyki demograficzne

##### **SubjectProfileContactInfo/**

- **Funkcja**: Dane kontaktowe

##### **SubjectProfileQuickView/**

- **Funkcja**: Szybki podgląd kluczowych danych

##### **SubjectProfileAlertBanner/**

- **Funkcja**: Bannery z alertami i powiadomieniami

#### **Aktywność i historia**

##### **SubjectActivity/**

- **Funkcja**: Historia aktywności uczestnika

##### **SubjectFulfillment/**

- **Funkcja**: Wypełnione formularze i dane

#### **Listy powiązanych danych**

##### **SubjectStudiesList/**

- **Funkcja**: Lista badań w których uczestniczy

##### **SubjectVisitsList/**

- **Funkcja**: Historia wizyt i terminów

#### **Edycja**

##### **EditSubjectModal/**

- **Funkcja**: Edycja danych uczestnika

#### **Hooki**

##### **hooks/**

- **Funkcja**: Custom hooks dla profilu uczestnika

### 🏗️ **SubjectRepositoryBuilder** - Builder profili

**Lokalizacja**: `SubjectRepositoryBuilderContent/`

#### **Komponenty buildera**

- **SubjectRepositoryBuilder.tsx** - Builder struktury profilu
- **SubjectRepositoryBuilderContent.tsx** - Interfejs buildera

**Funkcja**: Konfiguracja pól i struktury profili uczestników

### ⚙️ **SubjectRepositorySettings** - Ustawienia

**Lokalizacja**: `SubjectRepositorySettings/`

#### **Komponenty**

- **SubjectRepositorySettings.tsx/less** - Ustawienia repozytorium

**Zawiera**:

- Konfiguracja pól profilu
- Ustawienia prywatności
- Reguły retencji danych
- Integracje zewnętrzne

### 📱 **SubjectRepositoryQrCodes** - Kody QR

**Lokalizacja**: `SubjectRepositoryQrCodes/`

#### **Komponenty**

- **SubjectRepositoryQrCodes.tsx/less** - Generator kodów QR

**Funkcja**:

- Generowanie QR dla uczestników
- QR do quick access profili
- QR dla ankiet i formularzy

### 📝 **SubjectRepositorySurvey** - Ankiety

**Lokalizacja**: `SubjectRepositorySurvey/`

#### **Komponenty**

- **SubjectRepositorySurvey.tsx/less** - System ankiet dla uczestników

**Integruje**: `shared/Survey`

## Integracje wewnętrzne

### **Shared components**

- **SubjectForm** - formularze uczestników
- **SubjectFilters** - filtry i wyszukiwanie
- **AuditTrails** - ścieżki audytu zmian
- **UsersTable** - komponenty tabelaryczne

### **Studies integration**

- Przypisanie uczestników do badań
- Transfer danych między studies i repository

### **Calendar integration**

- Historia wizyt i terminów
- Planowanie przyszłych spotkań

## Funkcjonalności kluczowe

### **Zarządzanie danymi**

- **CRUD operations** na profilach
- **Bulk operations** - operacje masowe
- **Data validation** - walidacja integralności
- **Audit trails** - śledzenie zmian

### **Wyszukiwanie i filtry**

- **Advanced search** - zaawansowane wyszukiwanie
- **Custom filters** - filtry konfigurowalne
- **Saved searches** - zapisane wyszukiwania

### **Import/Export**

- **CSV/Excel import** - import z plików
- **Flexible export** - eksport z opcjami
- **Data mapping** - mapowanie pól

### **Bezpieczeństwo**

- **Data encryption** - szyfrowanie danych wrażliwych
- **Access control** - kontrola dostępu
- **GDPR compliance** - zgodność z RODO
- **Data anonymization** - anonimizacja danych

## API Endpoints

- `common/requests/subjectRepository/` - główne API
- `common/requests/subjects/` - operacje na uczestnikach

## Przepływy użytkowania

### **Przeglądanie repozytorium**

1. SubjectRepositoryDashboard → filtry → tabela
2. Klik profil → SubjectRepositoryProfile

### **Dodawanie uczestnika**

1. Dashboard → AddSubjectModal → SubjectForm
2. Walidacja → zapis → powrót do listy

### **Zarządzanie profilami**

1. SubjectRepositoryProfile → edycja sekcji
2. Śledzenie zmian → audit trail

### **Operacje masowe**

1. Dashboard → zaznaczenie → SubjectRepositoryOptions
2. Wybór akcji → potwierdzenie → wykonanie
