# Studies - Lista badań

## Lokalizacja w kodzie
- **Page component**: Strona Studies w `frontend/apps/datacapt/src/pages/studies/index.tsx` (routing)
- **UI components**:
  - `StudiesContent` w `frontend/apps/datacapt/src/components/studies/StudiesContent/StudiesContent.tsx`
  - `StudiesList` w `frontend/apps/datacapt/src/components/studies/StudiesContent/StudiesList/StudiesList.tsx`
  - `StudyCard` w `frontend/apps/datacapt/src/components/studies/StudiesContent/StudiesList/StudyCard.tsx`
  - `NewStudyForm` w `frontend/apps/datacapt/src/components/studies/StudiesContent/NewStudyForm/NewStudyForm.tsx`
  - CSS klasy: `studies-content`, `studies-list`, `studies-list__item`, `study-card`

## Dostęp
- Z [[main-menu|głównego menu]] → pierwsza opcja (ikona badania)
- URL: `http://localhost:3000` (strona główna po zalogowaniu)

## Struktura strony

### Nagłówek
- **Tytuł**: "Studies"
- **Pasek wyszukiwania**: "Search and filters:"
- **Przycisk**: "Create new study" (niebieski, prawy górny róg)

### Lista badań
Wyświetla karty badań w formie kafelków (`.studies-list__item`) w układzie dwóch kolumn:

#### Struktura kafelka badania
**Nagłówek kafelka:**
- **Nazwa badania**: Duży nagłówek (np. "CL", "CYPRESS")
- **Status**: Tag status (np. "Draft") w prawym górnym rogu

**Sekcja główna:**
- **Postęp**: "Average Progress" z okrągłym wykresem procentowym (0%)
- **Uczestnictwo**: "X | Y Inclusions" (np. "2 | 2 Inclusions")

**Sekcja szczegółów:**
- **Typ badania**: Link do badania (np. "condition logic test study", "cypress test study") - klikalnY
- **Centra**: Ikona lokalizacji + nazwa centrum (np. "CL (Cl)", "CYPRESS (Center 1)")
- **Data rozpoczęcia**: Ikona kalendarza + "Start date: -" (jeśli nieustawiona)
- **Kontakt główny**: Ikona użytkownika + "Main contact: [Nazwa]" (np. "Cypress manager")

### Nawigacja
- **Paginacja**: Dolna część strony
- **Selektor elementów badań**: `.studies-list__item`

## Funkcjonalności
- Kliknięcie w kafelek badania prowadzi do [[study/main-structure|szczegółów badania]]
- Przycisk "Create new study" otwiera kreator nowego badania
- Wyszukiwanie i filtrowanie badań

## Dane dynamiczne
- Lista badań jest ładowana z backendu
- Zawartość zależy od uprawnień użytkownika
- Administrator ma dostęp do wszystkich badań w systemie
- Ilość i nazwy badań są zmienne