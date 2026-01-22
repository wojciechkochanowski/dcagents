# Moduł STUDIES - Zarządzanie Badaniami

## Lokalizacja

`frontend/apps/datacapt/src/components/studies/`

## Opis modułu

Główny moduł odpowiedzialny za zarządzanie badaniami klinicznymi w systemie Datacapt. Obsługuje pełny cykl życia badania od tworzenia po analizę danych.

## Struktura komponentów (4 główne grupy)

### 📊 **StudiesContent** - Lista i zarządzanie badaniami

**Lokalizacja**: `StudiesContent/`

#### **Główny komponent**

- **StudiesContent.tsx/less** - Lista wszystkich badań w systemie
- **Funkcja**: Dashboard z listą badań, filtry, wyszukiwanie

#### **Podkonstrukcje**:

- **NewStudyForm/** - Formularz tworzenia nowego badania
  - Kreator badania krok po kroku
  - Ustawienia podstawowe, randomizacja, protokół
- **StudiesList/** - Lista badań z paginacją i sortowaniem
  - Tabela badań z statusami
  - Akcje masowe, eksport danych

### 🔬 **StudyDetailsContent** - Szczegóły badania

**Lokalizacja**: `StudyDetailsContent/`

#### **Główny komponent**

- **StudyDetailsContent.tsx** - Layout szczegółów badania
- **StudyDetailsContext.tsx** - Context zarządzający stanem badania

#### **13 specjalistycznych podmodułów**:

##### **StudyDashboardContent/**

- **Funkcja**: Główny dashboard badania
- **Zawiera**: Statystyki, wykresy, kluczowe metryki

##### **StudyEcrfContent/**

- **Funkcja**: Electronic Case Report Forms
- **Zawiera**: Formularze danych, CRF builder, walidacja

##### **StudySubjectsContent/**

- **Funkcja**: Zarządzanie uczestnikami
- **Zawiera**: Lista uczestników, profile, randomizacja

##### **StudySettingsContent/**

- **Funkcja**: Ustawienia badania
- **Zawiera**: Konfiguracja, uprawnienia, protokoły

##### **StudyAnalyticsContent/**

- **Funkcja**: Analiza danych
- **Zawiera**: Raporty, wykresy, eksport analiz

##### **StudyAuditTrailsContent/**

- **Funkcja**: Ścieżka audytu
- **Zawiera**: Historia zmian, logi, compliance

##### **StudyAutomationContent/**

- **Funkcja**: Automatyzacja procesów
- **Zawiera**: Reguły, triggery, workflow

##### **StudyDataAnalysisContent/**

- **Funkcja**: Zaawansowana analiza
- **Zawiera**: Statystyki, modele, predykcje

##### **StudyDocumentsContent/**

- **Funkcja**: Dokumenty badania
- **Zawiera**: Protokoły, zgody, raporty

##### **StudyEconsentContent/**

- **Funkcja**: Elektroniczne zgody
- **Zawiera**: Formularze zgód, podpisy elektroniczne

##### **StudyEproContent/**

- **Funkcja**: Electronic Patient Reported Outcomes
- **Zawiera**: Kwestionariusze pacjentów, PRO data

##### **StudyInclusionsContent/**

- **Funkcja**: Kryteria włączenia/wykluczenia
- **Zawiera**: Definicje kryteriów, screening

##### **StudyMonitoringContent/**

- **Funkcja**: Monitorowanie badania
- **Zawiera**: Kontrola jakości, SDV, monitoring wizyty

##### **StudyRandomisationContent/**

- **Funkcja**: System randomizacji
- **Zawiera**: Algorytmy, stratyfikacja, blinding

##### **StudyTranslationsContent/**

- **Funkcja**: Tłumaczenia
- **Zawiera**: Wielojęzyczność, lokalizacja

##### **StudyUsersContent/**

- **Funkcja**: Użytkownicy badania
- **Zawiera**: Zespół, role, uprawnienia

#### **Modalne i pomocnicze**:

- **StudyDetailsLayout/** - Layout ze sidebar i breadcrumb
- **ExportModal/** - Eksport danych badania
- **InviteSubjectsModal/** - Zapraszanie nowych uczestników

### 🎥 **Econsult** - Konsultacje wideo

**Lokalizacja**: `Econsult/`

#### **Główny system**

- **Econsult.less** - Style dla całego modułu video

#### **Komponenty video**:

##### **Zarządzanie spotkaniami**

- **EconsultMeeting/** - Główny komponent spotkania
- **EconsultMeetingContext.tsx** - Context stanu spotkania
- **EconsultMeetingEnded/** - Ekran po zakończeniu
- **EconsultMeetingMenu/** - Menu kontrolne
- **EconsultSubjectMeeting/** - Spotkanie od strony uczestnika
- **EconsultInvestigatorMeetingModal/** - Modal dla badacza

##### **Komponenty AV**

- **EconsultVideoTrack/** - Komponent wideo
- **EconsultAudioTrack/** - Komponent audio
- **EconsultParticipantTracks/** - Zarządzanie ścieżkami
- **EconsultTrackPublication/** - Publikowanie strumieni

##### **UI i UX**

- **EconsultMeetingIcon/** - Ikony stanu
- **EconsultMeetingLabel/** - Etykiety
- **EconsultMeetingNoCameraPoster/** - Placeholder bez kamery
- **EconsultWaitingRoom/** - Poczekalnia
- **EconsultWaitingRoomFeed/** - Podgląd przed spotkaniem
- **EconsultWaitingRoomRemoteParticipantInfo/** - Info o uczestnikach

#### **Modalne i akcje**

- **EconsultEndMeetingModal/** - Modal zakończenia spotkania
- **InviteToEconsult/** - Zaproszenia do konsultacji

#### **Hooki custom**

- **hooks/** - Custom hooks dla Twilio Video, WebRTC

### 🔗 **Shortener** - Skracanie linków

**Lokalizacja**: `Shortener/`

#### **Komponenty**

- **Shortener.tsx/less** - Generator krótkich linków
- **Funkcja**: Tworzenie krótkich URL dla udostępniania badań
- **Integracja**: z systemem linków badania, sharing

## Integracje i zależności

### **Zewnętrzne biblioteki**

- **Twilio Video** - komunikacja video w Econsult
- **Draft.js** - edytory tekstu w formularzach
- **Ant Design Charts** - wykresy w analytics

### **Wewnętrzne zależności**

- **Common/components** - DatacTable, DatacModal, DatacButton
- **Common/requests/studies** - API calls
- **Shared/Builder** - budowanie formularzy
- **Shared/Fulfillment** - wypełnianie form

### **Context hierarchy**

```
StudyDetailsContext
├── EconsultMeetingContext (dla video)
├── SubjectsContext (dla uczestników)
└── AnalyticsContext (dla danych)
```

## Przepływy użytkowania

### **Tworzenie badania**

1. StudiesContent → NewStudyForm → kreator
2. Ustawienia → protokół → publikacja

### **Zarządzanie badaniem**

1. StudiesContent → wybór → StudyDetailsContent
2. Nawigacja przez zakładki (subjects, eCRF, settings)
3. Wykonanie akcji → aktualizacja stanu

### **Video konsultacja**

1. StudyDetailsContent → schedule → Econsult
2. EconsultWaitingRoom → EconsultMeeting → end
