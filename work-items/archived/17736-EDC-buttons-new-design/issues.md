# Poprawki po implementacji: 17736 - EDC buttons - new design in a few places

## Rzeczywista implementacja (wykonana przez użytkownika)

### Co zostało faktycznie zrobione:

1. **Zmiana domyślnego typu w FiltersDropdown** - zmieniono z `primary` na `ghost` w `FiltersDropdown.tsx:67`
2. **Usunięcie prop `buttonType="ghost"`** z wszystkich miejsc gdzie był używany:
   - SubjectVisitsList 
   - PaymentOrdersDashboard
   - PaymentsDashboard  
   - SubjectTable (recruitment)
   - VisitListTable
3. **Aktualizacja buttonów "Add" na typ `primary`**:
   - StudySettingsCenters - button "Add centers" 
   - SubjectRepositoryDashboard - button "Import" 
4. **Stylowanie w .less** - usunięto nadpisujące style z `DatacTableSearchAndFilters.less` oraz poprawiono style w `FiltersDropdown.less`

### Różnice względem pierwotnego planu:

- **Plan zakładał**: Zmianę designu na primary blue background dla buttonów Filters
- **Rzeczywistość**: Przeszedł na ghost style (bardziej subtelny wygląd)
- **Plan zakładał**: Usunięcie ikony filtra  
- **Rzeczywistość**: Ikona została zachowana ale poprawiono jej pozycjonowanie
- **Dodatkowy bonus**: Poprawiono także buttony "Add" i "Import" na primary typ

### Wnioski dla przyszłych zadań:

1. **Centralne komponenty są kluczowe** - jedna zmiana w FiltersDropdown wpłynęła na wiele miejsc jednocześnie
2. **Sprawdzanie wszystkich wystąpień** - trzeba usunąć nadpisujące propsy gdy zmieniamy defaults
3. **Konsystentność buttonów** - buttony akcji (Add, Import) powinny być primary, filtry mogą być ghost  
4. **Style .less wymagają uwagi** - czasem nadpisują component props, trzeba je czyścić
5. **Ghost vs Primary decision** - ghost jest bardziej subtle i może być lepszym wyborem dla buttonów pomocniczych jak Filters

## Końcowy efekt:
- ✅ Wszystkie buttony "Filters" mają teraz spójny ghost design
- ✅ Buttony akcji (Add, Import) mają primary design
- ✅ Usunięto konfliktujące style z plików .less
- ✅ Zachowano funkcjonalność wszystkich komponentów
- ✅ Design jest bardziej spójny z system designem