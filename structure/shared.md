# Moduł SHARED - Komponenty Współdzielone

## Lokalizacja

`frontend/apps/datacapt/src/components/shared/`

## Opis modułu

Najważniejszy moduł aplikacji zawierający komponenty współdzielone przez wszystkie pozostałe moduły. To rdzeń funkcjonalności Datacapt - builder formularzy, system wypełniania, edytory, tabele i narzędzia analityczne.

## Struktura komponentów (12 głównych grup)

### 🏗️ **Builder** - Kreator formularzy i badań

**Lokalizacja**: `Builder/`

**Najważniejszy komponent całej aplikacji** - pozwala na budowanie struktur badań, formularzy, kwestionariuszy.

#### **Główne pliki systemu**

- **Builder.tsx/less** - Główny interfejs buildera
- **BuilderContext.tsx** - Context zarządzający stanem budowania
- **BuilderReducer.ts** - Reducer do zarządzania złożonym stanem
- **BuilderUtils.tsx** - Narzędzia pomocnicze
- **BuilderHeader/** - Nagłówek z kontrolkami
- **BuilderPlaceholder/** - Placeholdery dla pustych miejsc

#### **Komponenty budujące**

##### **Struktura**

- **StructureBuilder/** - Budowanie ogólnej struktury
- **StructureNavigation/** - Nawigacja po strukturze
- **SubsectionBuilder/** - Budowanie podsekcji
- **BuilderSectionSettingsModal/** - Ustawienia sekcji

##### **Bloki zawartości**

- **BlockBuilder/** - Pojedyncze bloki
- **BlocksListBuilder/** - Lista bloków
- **BlockTypeOption/** - Opcje typów bloków
- **getBlockTypeSymbol.tsx** - Symbole typów
- **StaticContentBuilder/** - Zawartość statyczna
- **ButtonContentBuilder/** - Przyciski

##### **Pytania i formularze**

- **QuestionBuilder/** - Kreator pytań
- **RepeatedMeasuresBuilder/** - Powtarzalne pomiary
- **TableMatrixBuilder/** - Matryce tabelaryczne
- **ConditionalLogic/** - Logika warunkowa

##### **Obrazy i media**

- **BuilderImageFormItem/** - Komponenty obrazów w formach

##### **Szablony**

- **TemplateCreator/** - Tworzenie szablonów
- **TemplateSelector/** - Wybór szablonów
- **StudyBuilderEntry/** - Punkt wejścia dla badań

### 📝 **Fulfillment** - System wypełniania formularzy

**Lokalizacja**: `Fulfillment/`

**Drugi najważniejszy komponent** - obsługuje wypełnianie utworzonych w Builder formularzy przez użytkowników.

#### **Główny system**

- **Fulfillment.tsx/less** - Główny komponent wypełniania
- **FulfillmentContext.ts** - Context stanu wypełniania
- **FulfillmentReducer.ts** - Reducer zarządzania stanem
- **FulfillmentUtils.tsx** - Narzędzia pomocnicze

#### **Layout i nawigacja**

- **FulfillmentLayout/** - Layout strony wypełniania
- **FulfillmentHeader/** - Nagłówek z postępem
- **FulfillmentFooter/** - Stopka z kontrolkami
- **FulfillmentNavigation/** - Nawigacja między sekcjami
- **FulfillmentBanner/** - Bannery informacyjne

#### **Komponenty interakcji**

- **FulfillmentQuestion/** - Renderowanie pytań
- **FulfillmentButton/** - Przyciski akcji
- **FulfillmentCounter/** - Liczniki postępu
- **FulfillmentLanguageSelector/** - Wybór języka
- **FulfillmentInstruction/** - Instrukcje dla użytkowników

#### **Specjalistyczne elementy**

- **FulfillmentSubsection/** - Podsekcje
- **FulfillmentRepeatedMeasures/** - Powtarzalne pomiary
- **FulfillmentTableMatrix/** - Matryce
- **FulfillmentImage/** - Obrazy w formach
- **FulfillmentQueriesCounter/** - Licznik zapytań

#### **Funkcje specjalne**

- **ParticipantSwitch/** - Przełącznik uczestników
- **QuestionsInModal/** - Pytania w modalach
- **RandomizationDetailsModal/** - Szczegóły randomizacji
- **SignEcrfModal/** - Podpis eCRF
- **EmergencyUnblindModal/** - Odślepianie awaryjne
- **ExcludeInclusionModal/** - Wykluczanie/włączanie
- **DeclareInvalidModal/** - Oznaczanie jako nieprawidłowe
- **UndoAllocationModal/** - Cofanie alokacji
- **ReasonModal/** - Modalne z powodem
- **FulfillmentActionToast.ts** - Powiadomienia

### 📄 **Survey** - System ankiet

**Lokalizacja**: `Survey/`

#### **Główne komponenty**

- **Survey.tsx/less** - Główny komponent ankiety
- **SurveyContext.tsx** - Context ankiety
- **SurveyReducer.tsx** - Reducer zarządzania stanem

#### **Podkomponenty**

- **SurveyContent/** - Zawartość ankiety
- **SurveyDetails/** - Szczegóły ankiety
- **SurveyThankYou/** - Strona podziękowań

### ✏️ **Editor** - Edytory tekstu

**Lokalizacja**: `Editor/`

#### **System edycji**

- **EditorInput/** - Input edytora (Draft.js)
- **EditorOutput/** - Wyświetlanie sformatowanego tekstu
- **editorUtils.tsx** - Narzędzia edytora

#### **Modalne**

- **EditorImageModal/** - Wstawianie obrazów
- **EditorUrlModal/** - Wstawianie linków

### 🔍 **AuditTrails** - Ścieżki audytu

**Lokalizacja**: `AuditTrails/`

#### **Komponenty**

- **AuditTrailsTable/** - Tabela zmian
- **AuditTrailDetails/** - Szczegóły wpisu audytu
- **trails-utils.tsx** - Narzędzia pomocnicze

### 👥 **Zarządzanie użytkownikami i danymi**

#### **UsersTable/**

- **UsersTable.tsx/less** - Tabela użytkowników
- **UsersTableConfig.tsx** - Konfiguracja tabeli

#### **ProductsTable/**

- **ProductsTable.tsx/less** - Tabela produktów
- **ProductsTableConfig.tsx** - Konfiguracja
- **AddProductModal/** - Dodawanie produktu
- **ProductsTableActions/** - Akcje na produktach

### 🏥 **SubjectFilters** - Filtry uczestników

**Lokalizacja**: `SubjectFilters/`

#### **System filtrowania**

- **SubjectFilters.tsx** - Główne filtry
- **hooks/** - Custom hooks dla filtrów

### 👤 **SubjectForm** - Formularz uczestnika

**Lokalizacja**: `SubjectForm/`

#### **Komponenty formularza**

- **SubjectForm.tsx/less** - Główny formularz
- **SubjectFields/** - Pola podstawowe
- **NewSubjectFields/** - Pola nowego uczestnika
- **ExistingSubjectFields/** - Pola istniejącego

### 📧 **InviteParticipantModal** - Zapraszanie uczestników

**Lokalizacja**: `InviteParticipantModal/`

#### **System zaproszeń**

- **InviteParticipantModal.tsx/less** - Modal zaproszenia
- **MessagePreview/** - Podgląd wiadomości
- **ScheduleEditor/** - Edytor harmonogramu

### 🌐 **TranslationsLists** - Zarządzanie tłumaczeniami

**Lokalizacja**: `TranslationsLists/`

#### **System tłumaczeń**

- **TranslationsLists.tsx/less** - Lista tłumaczeń
- **TranslationsHeader/** - Nagłówek
- **TranslationsLanguageSelect/** - Wybór języka
- **TranslationsEdit/** - Edycja tłumaczeń
- **TranslationsOneList/** - Pojedyncza lista
- **TranslationsNoResults/** - Brak wyników

### ✅ **VisitConfirmationModal** - Potwierdzanie wizyt

**Lokalizacja**: `VisitConfirmationModal/`

#### **System potwierdzeń**

- **VisitConfirmationModal.tsx/less** - Modal potwierdzenia
- **ConfirmationSelect/** - Wybór potwierdzenia
- **ConfirmationSuccess/** - Sukces
- **ConfirmationPayments/** - Płatności
- **ApplicationStatus/** - Status aplikacji
- **VisitStatus/** - Status wizyty

## Znaczenie modułu Shared

### **Centralny rdzeń aplikacji**

- **Builder** + **Fulfillment** = podstawowa funkcjonalność CRF
- **Survey** = system ankiet i kwestionariuszy
- **Editor** = rich text editing w całej aplikacji

### **Ponowne użycie**

Wszystkie komponenty używane w:

- Studies (badania)
- Recruitment (rekrutacja)
- SubjectRepository (uczestnicy)
- Settings (ustawienia)

### **Architektura**

- **Context + Reducer** pattern dla złożonego stanu
- **Modularność** - każdy komponent niezależny
- **Reusability** - komponenty projektowane do ponownego użycia
