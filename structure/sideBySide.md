# Moduł SIDEBYSIDE - Porównanie projektów

## Lokalizacja

`frontend/apps/datacapt/src/components/sideBySide/`

## Opis modułu

Moduł do porównywania różnych wersji projektów, badań lub formularzy. Umożliwia side-by-side comparison i analizę różnic.

## Struktura komponentów (2 główne grupy)

### 📋 **SideBySideProjectsContent** - Lista projektów

**Lokalizacja**: `SideBySideProjectsContent/`

- **SideBySideProjectsContent.tsx/less** - Lista projektów do porównania
- **NewProject/** - Tworzenie nowego projektu porównawczego
- **ProjectsFilters/** - Filtry projektów
- **ProjectsList/** - Lista z opcjami wyboru

### 🔍 **SideBySideProjectDetailsContent** - Szczegóły porównania

**Lokalizacja**: `SideBySideProjectDetailsContent/`

- **SideBySideProjectDetailsContent.tsx** - Główny interfejs porównania
- **SideBySideProjectDetailsStore.tsx** - Store stanu
- **SideBySideProjectBuilder/** - Builder porównań
- **SideBySideProjectReports/** - Raporty różnic
- **SideBySideProjectSettings/** - Ustawienia porównania
- **SideBySideProjectTest/** - Testing porównań
- **SideBySideProjectTests/** - Zestaw testów
- **SideBySideProjectDetailsLayout/** - Layout z panelami

## Kluczowe funkcjonalności

- **Visual diff** - wizualne porównanie
- **Text comparison** - porównanie tekstowe
- **Structure analysis** - analiza struktury
- **Change tracking** - śledzenie zmian
