# Recruitment Studies - Rekrutacja do badań

## Lokalizacja w kodzie
- **Page component**: Strona Recruitment w `frontend/apps/datacapt/src/pages/recruitment/index.tsx` (routing)
- **UI components**:
  - `RecruitmentStudiesContent` w `frontend/apps/datacapt/src/components/recruitment/RecruitmentStudiesContent/RecruitmentStudiesContent.tsx`
  - `NewRecruitmentStudy` w `frontend/apps/datacapt/src/components/recruitment/RecruitmentStudiesContent/NewRecruitmentStudy/NewRecruitmentStudy.tsx`
  - `RecruitmentStudyCard` w `frontend/apps/datacapt/src/components/recruitment/RecruitmentStudiesContent/RecruitmentStudyCard/RecruitmentStudyCard.tsx`
  - `RecruitmentStudiesNumbers` w `frontend/apps/datacapt/src/components/recruitment/RecruitmentStudiesContent/RecruitmentStudiesNumbers/RecruitmentStudiesNumbers.tsx`
  - CSS klasy: `recruitment-studies-content`, `recruitment-study-card`, `new-recruitment-study`

## Dostęp
- Z [[main-menu|głównego menu]] → druga opcja (ikona rekrutacji)

## Struktura strony

### Nagłówek
- **Tytuł**: "Recruitment studies"

### Zawartość główna
- **Ilustracja**: Centralna grafika przedstawiająca proces rekrutacji
- **Elementy graficzne**: 
  - Ikony dokumentów i formularzy
  - Ikona użytkownika z plusem (dodawanie uczestników)
  - Ikony komunikacji (e-mail, czat)
  - Elementy workflow

### Funkcjonalności
- **Przycisk**: "Create new study" (niebieski, centralny)
- Zarządzanie procesem rekrutacji uczestników do badań

### Modal "Create new study"
**Formularz tworzenia badania rekrutacyjnego:**
- **Recruitment study name**: Pole tekstowe na nazwę badania (wymagane)
- **Recruitment study reference**: Pole na referencję/kod badania
- **Recruitment study centers**: Dropdown wyboru centrów (wymagane, opcje: "CL CI", "CYPRESS Center 1")
- **Recruiter Name**: Pole na imię recruitera
- **Target number**: Pole numeryczne na docelową liczbę uczestników
- **Przyciski**: Cancel | Submit
- **Walidacja**: Pola wymagane podświetlane na czerwono przy próbie wysłania

## Stan dynamiczny

### Stan pusty (brak recruitment studies)
- **Ilustracja**: Centralna grafika przedstawiająca proces rekrutacji
- **Elementy graficzne**: ikony dokumentów, formularzy, użytkowników, komunikacji
- **Przycisk**: "Create new study" (niebieski, centralny)

### Stan z danymi (po utworzeniu recruitment studies)
- **Dashboard z metrykami** (górna część):
  - Total number of Studies (liczba z ikoną dokumentu)
  - Recruiting Studies (procent, żółty box)
  - Draft Studies (liczba, szary box) 
  - Ended Studies (liczba, zielony box)
  - Archived Studies (liczba, czerwony box)
- **Pasek wyszukiwania**: "Search study" z lupką
- **Przycisk**: "Create new study" (prawy górny róg)
- **Lista recruitment studies** z kartami zawierającymi:
  - Nazwa/kod study (np. "TRS-001") ze statusem ("Draft")
  - Recruitment progress (okrągły wykres z procentem)
  - Target number (np. "0 | 50 Qualified")
  - Szczegóły: Scheduled Start Date, Recruiter Name, Centers
  - Nazwa study jako link (np. "Test Recruitment Study")
- **Paginacja**: "1-1 of 1" z opcjami "25 / page"

## Powiązania
- Powrót do [[main-menu|głównego menu]]
- Tworzenie badania przekierowuje prawdopodobnie do [[studies|sekcji Studies]]
- Szczegóły recruitment study: [[recruitment-studies/recruitment-study-details|→]]

## Podstrony recruitment study
- [[recruitment-studies/recruitment-study-details|Recruitment Study Details]] - główna strona szczegółów
- [[recruitment-studies/recruitment-study-participants|Participants Tab]] - zarządzanie uczestnikami  
- [[recruitment-studies/recruitment-study-schedules|Schedules Tab]] - harmonogramy wizyt
- [[recruitment-studies/recruitment-study-payments|Payments Tab]] - płatności dla uczestników
- [[recruitment-studies/recruitment-study-settings|Settings Tab]] - ustawienia badania