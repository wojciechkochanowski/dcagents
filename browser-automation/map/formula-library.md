# Formula Library - Biblioteka formuł

## Lokalizacja w kodzie
- **Page component**: `Products` w `frontend/apps/datacapt/src/components/Products/Products.tsx` (routing)
- **UI components**:
  - `ProductsContent` w `frontend/apps/datacapt/src/components/Products/ProductsContent/ProductsContent.tsx`
  - `ProductsTable` w `frontend/apps/datacapt/src/components/shared/ProductsTable/ProductsTable.tsx`
  - `AddProductModal` w `frontend/apps/datacapt/src/components/shared/ProductsTable/AddProductModal/AddProductModal.tsx`
  - `FormulasEditor` w `frontend/apps/datacapt/src/components/sideBySide/SideBySideProjectDetailsContent/SideBySideProjectReports/ChartWizard/FormulasEditor/FormulasEditor.tsx`
  - CSS klasy: `products-content`, `products-content__header`, `products-table`

## Dostęp
- Z [[main-menu|głównego menu]] → czwarta opcja (ikona formuły)

## Struktura strony

### Nagłówek
- **Tytuł**: "Formula library"

### Kategorie formuł
Zorganizowane w kafelki kolorowe (`.datac-card--clickable`):

1. **All formulas** (szary kafelek)
   - Wyświetla wszystkie formuły niezależnie od kategorii
   
2. **Standard formulas** (zielony kafelek)
   - Filtruje do standardowych formuł
   
3. **Sample formulas** (niebieski kafelek)  
   - Pokazuje przykładowe formuły
   
4. **Benchmark formulas** (żółty kafelek)
   - Formuły benchmarkowe

### Funkcje wyszukiwania
- **Pasek wyszukiwania**: "Search" z ikoną lupy
- **Aktywne filtry**: Przycisk "Filters: +X" gdy kategoria jest wybrana
- Filtrowanie formuł według kategorii

### Tabela formuł
Kolumny tabeli:
- **FORMULA**: Nazwa formuły
- **TYPE**: Typ formuły  
- **BRAND**: Marka/producent
- **PRODUCT NAME**: Nazwa produktu
- **CATEGORY**: Kategoria
- **TECHNICAL**: Dane techniczne

### Stan danych
- **Komunikat**: "No data" 
- **Paginacja**: "0-0 of 0" (brak formuł w bazie)

## Funkcjonalności
- Kategoryzacja formuł według typów
- Wyszukiwanie i filtrowanie
- Zarządzanie bazą formuł używanych w badaniach

## Powiązania
- Powrót do [[main-menu|głównego menu]]
- Formuły używane w [[studies|badaniach]]