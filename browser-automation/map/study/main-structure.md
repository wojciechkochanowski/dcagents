# Study Detail - Struktura wewnętrzna badania

## Dostęp

- Z [[../studies|listy badań]] → kliknięcie w kafelek badania
- URL pattern: `/en/studies/{studyId}/{section}`

## Lokalizacja w kodzie

- **Page component**: Routing przez główną aplikację
- **UI components**:
  - `StudyDetailsLayout` w `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyDetailsLayout/StudyDetailsLayout.tsx`
  - `StudyDetailsNavigation` - menu boczne z sekcjami badania
  - `StudyDetailsContext` - kontekst współdzielenia danych badania
  - Komponenty sekcji w `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/`
  - CSS klasy: `study-details-layout`, `study-details-layout__header`, `study-details-navigation`

## Struktura nawigacji bocznej

### Nagłówek badania

- **Element**: `.study-details-layout__header`
- **Tytuł**: "STUDY" (stała etykieta)
- **Nazwa badania**: Dynamiczna nazwa z backendu
- **Selektor**: `.study-details-layout__reference`

### Menu badania - 5 głównych sekcji:

#### 1. eCRF (Electronic Case Report Form)

**Nagłówek sekcji**: `.study-details-navigation__section-title-wrapper`

- **[[dashboard|Dashboard]]** ✓ (aktywny domyślnie)
  - URL: `/dashboard`
  - Klasa: `.datac-menu-option--active`
- **[[ecrf-builder|eCRF Builder]]**
  - URL: `/ecrf`
  - Narzędzie do budowania formularzy badawczych
- **[[inclusions-list|Inclusions list]]**
  - URL: `/inclusions`
  - Lista uczestników badania
- **[[monitoring|Monitoring]]**
  - URL: `/monitoring`
  - Monitorowanie badania

#### 2. ePRO (Electronic Patient Reported Outcomes)

**Nagłówek sekcji**: "ePRO"

- **[[epro-forms|ePRO forms]]**
  - URL: `/epro/forms`
  - Formularze wypełniane przez pacjentów
- **[[epro-records|ePRO records]]**
  - URL: `/epro/records`
  - Rekordy danych ePRO
- **[[epro-compliance|ePRO compliance]]**
  - URL: `/epro/compliance`
  - Zgodność z protokołem ePRO

#### 3. eConsent (Electronic Consent)

**Nagłówek sekcji**: "eConsent"

- **[[econsent-dashboard|Dashboard]]**
  - URL: `/econsent/dashboard`
  - Panel zgodności na leczenie
- **[[econsent-forms|eConsent Forms]]**
  - URL: `/econsent/forms`
  - Formularze zgody elektronicznej
- **[[signatures|Signatures]]**
  - URL: `/econsent/signatures`
  - Podpisy elektroniczne

#### 4. Study (Zarządzanie badaniem)

**Nagłówek sekcji**: "Study"

- **[[reports|Reports]]**
  - URL: `/analytics`
  - Raporty i analizy
- **[[documents|Documents]]**
  - URL: `/documents`
  - Dokumenty badania
- **[[subjects|Subjects]]**
  - URL: `/subjects`
  - Zarządzanie badanymi
- **[[translations|Translations]]**
  - URL: `/translations`
  - Tłumaczenia
- **[[audit-trails|Audit Trails]]**
  - URL: `/audit-trails`
  - Ścieżki audytu
- **[[automation|Automation]]**
  - URL: `/automation`
  - Automatyzacja procesów
- **[[randomization|RTSM]]**
  - URL: `/randomisation`
  - Randomization and Trial Supply Management
  - 5 tabów: Randomization configuration, Randomization list, Allocation configuration, Kit types configuration, Kits inventory
- **[[users|Users]]**
  - URL: `/users`
  - Zarządzanie użytkownikami
- **[[settings|Settings]]**
  - URL: `/settings`
  - Ustawienia badania

#### 5. Analysis (Analiza danych)

**Nagłówek sekcji**: "Analysis"

- **[[measurements|Measurements]]**
  - URL: `/data-analysis`
  - Pomiary i analiza danych

## Elementy wspólne

- **Powrót**: Przycisk "Back" w lewym górnym rogu
- **Menu option**: Klasa `.datac-menu-option` dla wszystkich linków
- **Aktywna sekcja**: Klasa `.datac-menu-option--active`
- **Study ID**: UUID generowane przez system (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

## Nawigacja

- Wszystkie linki prowadzą do podstron w ramach tego samego badania
- Struktura URL: `/en/studies/{studyId}/{section}/{subsection?}`
- Menu jest zawsze widoczne po lewej stronie
- Breadcrumbs na każdej podstronie
