# eCRF Builder - Konstruktor formularzy badawczych

## Dostęp
- Z [[main-structure|struktury badania]] → eCRF → eCRF Builder
- URL: `/en/studies/{studyId}/ecrf`

## Lokalizacja w kodzie
- **Page component**: Routing przez `StudyEcrfContent`
- **UI components**:
  - `EcrfBuilder` w `frontend/apps/datacapt/src/components/studies/StudyDetailsContent/StudyEcrfContent/EcrfBuilder.tsx`
  - `Builder` - główny komponent konstruktora w `frontend/apps/datacapt/src/components/shared/Builder/Builder.tsx`
  - `BuilderHeader` - nagłówek z narzędziami (wyszukiwanie, podgląd, drukowanie, dodawanie)
  - `BuilderPlaceholder` - placeholder gdy brak struktur
  - `BuilderSectionSettingsModal` - modal ustawień sekcji
  - CSS klasy: `builder`, `builder__header`, `builder__content`, `builder__structure`

## Struktura strony

### Nagłówek
- **Tytuł**: Dynamiczna nazwa badania z backendu
- **Przyciski narzędziowe**:
  - Ikona wyszukiwania
  - Ikona oka (podgląd)
  - Ikona drukarki (drukowanie)
  - Ikona plus (dodawanie)
  - **"Save as a template"** (niebieski przycisk)

### Nawigacja struktury (lewa strona)
**Panel "STRUCTURE":** (stała etykieta)

#### Struktura sekcji eCRF
- **Główne sekcje**: Dynamiczne nazwy sekcji z konfiguracji badania
- **Podsekcje**: Zagnieżdżone elementy struktury formularza
- **Hierarchia**: Wizualne wcięcia pokazujące poziomy zagnieżdżenia

### Obszar roboczy (prawa strona)
**Dynamiczne sekcje formularza:**

#### Struktura sekcji edytowalnej
- **Nagłówek sekcji**: Dynamiczna nazwa z możliwością edycji
- **Rozwijanie**: Chevron w dół/górę (stan zwijania)
- **Zawartość**: Pola formularza, pytania, opcje
- **Edycja**: Interfejs modyfikacji struktury

### Przycisk nawigacji
- **"Back"** - powrót do poprzedniej strony

## Funkcjonalności
- **Tworzenie formularzy**: Konstruktor CRF (Case Report Form)
- **Struktura hierarchiczna**: Sekcje → Podsekcje → Pola
- **Podgląd na żywo**: Możliwość podglądu formularza
- **Zapisywanie szablonów**: Ponowne wykorzystanie struktur
- **Drukowanie**: Export formularzy do druku

## Dane dynamiczne
- Struktura sekcji ładowana z konfiguracji badania
- Liczba i nazwy sekcji są zmienne
- Zawartość formularzy budowana dynamicznie
- Stany rozwinięcia/zwinięcia zapamiętywane w sesji

## Powiązania
- Powrót do [[dashboard|Dashboard]]
- Struktury używane w [[inclusions-list|liście uczestników]]
- Dane zapisywane w [[epro-records|rekordach ePRO]]
- Związek z [[main-structure|menu badania]]