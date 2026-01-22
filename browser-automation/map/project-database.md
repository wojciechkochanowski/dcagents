# Project Database - Baza projektów

## Lokalizacja w kodzie
- **Page component**: Strona Side-By-Side w `frontend/apps/datacapt/src/pages/side-by-side/index.tsx` (routing)
- **UI components**:
  - `SideBySideProjectsContent` w `frontend/apps/datacapt/src/components/sideBySide/SideBySideProjectsContent/SideBySideProjectsContent.tsx`
  - `ProjectsList` w `frontend/apps/datacapt/src/components/sideBySide/SideBySideProjectsContent/ProjectsList/ProjectsList.tsx`
  - `ProjectCard` w `frontend/apps/datacapt/src/components/sideBySide/SideBySideProjectsContent/ProjectsList/ProjectCard.tsx`
  - `NewProject` w `frontend/apps/datacapt/src/components/sideBySide/SideBySideProjectsContent/NewProject/NewProject.tsx`
  - `ProjectsFilters` w `frontend/apps/datacapt/src/components/sideBySide/SideBySideProjectsContent/ProjectsFilters/ProjectsFilters.tsx`
  - CSS klasy: `side-by-side-projects-content`, `projects-list`, `project-card`, `new-project`

## Dostęp
- Z [[main-menu|głównego menu]] → trzecia opcja (ikona bazy danych)

## Struktura strony

### Nagłówek
- **Tytuł**: "Project Database"

### Zawartość główna
- **Ilustracja**: Centralna grafika z:
  - Ikoną dokumentów/plików
  - Lupą (symbol wyszukiwania)
  - Symbolami organizacji danych

### Stan użytkownika
- **Komunikat**: "You are not assigned to any project."
- Wskazuje na system uprawnień oparty o przypisanie do projektów

### Funkcjonalności
- **Przycisk**: "Create new project" (niebieski, centralny)
- Zarządzanie projektami badawczymi
- System przypisywania użytkowników do projektów

### Modal "Create new project"
**Formularz tworzenia projektu:**
- **Name**: Pole tekstowe na nazwę projektu
- **Centers**: Dropdown wyboru centrów badawczych
- **Brand**: Dropdown/wyszukiwarka marek
- **Category**: Dropdown wyboru kategorii
- **Przyciski**: Cancel | Submit

## Uprawnienia
- Dostęp zależy od przypisania użytkownika do projektów
- Administrator może tworzyć nowe projekty
- Puste dla użytkowników nieprzypisanych

## Powiązania
- Powrót do [[main-menu|głównego menu]]
- Projekty prawdopodobnie grupują [[studies|badania]]